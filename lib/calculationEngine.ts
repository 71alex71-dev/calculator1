export type ProductType = 'Подоконник' | 'Столешница' | 'Стеновая панель';

export interface Material {
  id: string;
  brand: string;
  series: string;
  code: string;
  name: string;
  fullName: string;
  category: 'white' | 'monochrome' | 'small_particles' | 'large_particles' | 'marble' | 'promo';
  sheetPurchasePrice: number;
  sheetSalePrice: number;
  workCostRatePerSqm: number;
  workSaleRatePerSqm: number;
}

export interface ProductInput {
  id: string;
  type: ProductType;
  lengthMm: number;
  widthMm: number;
  quantity: number;
  materialId: string;
}

export interface ServicesInput {
  surveyCost: number;
  surveySalePrice: number;
  deliveryCost: number;
  deliverySalePrice: number;
  installationCost: number;
  installationSalePrice: number;
  discountPercent: number;
}

export interface ProductCalculation {
  id: string;
  type: ProductType;
  area: number;
  materialSheetsRaw: number;
  materialSheetsPurchased: number;
  materialPurchaseCost: number;
  materialSalePrice: number;
  workCost: number;
  workSalePrice: number;
  costSubtotal: number;
  saleSubtotal: number;
}

export interface OrderCalculation {
  items: ProductCalculation[];
  totalArea: number;
  totalMaterialSheetsRaw: number;
  totalMaterialSheetsPurchased: number;
  materialPurchaseCost: number;
  materialSalePrice: number;
  workCost: number;
  workSalePrice: number;
  installationCost: number;
  installationSalePrice: number;
  deliveryCost: number;
  deliverySalePrice: number;
  surveyCost: number;
  surveySalePrice: number;
  totalCost: number;
  preDiscountClientPrice: number;
  discountAmount: number;
  finalClientPrice: number;
  profit: number;
  marginPercent: number;
}

export const roundTo = (value: number, fraction = 2): number => {
  const factor = 10 ** fraction;
  return Math.round(value * factor) / factor;
};

export const calculateAreaSqm = (lengthMm: number, widthMm: number, quantity: number): number => {
  return (lengthMm / 1000) * (widthMm / 1000) * quantity;
};

export const calculateSheetsRaw = (areaSqm: number): number => areaSqm / 2.65;

export const roundUpToQuarterSheet = (sheets: number): number => Math.ceil(sheets * 4) / 4;

export const calculateProduct = (product: ProductInput, material: Material): ProductCalculation => {
  const area = calculateAreaSqm(product.lengthMm, product.widthMm, product.quantity);
  const materialSheetsRaw = calculateSheetsRaw(area);
  const materialSheetsPurchased = roundUpToQuarterSheet(materialSheetsRaw);

  const materialPurchaseCost = materialSheetsPurchased * material.sheetPurchasePrice;
  const materialSalePrice = materialSheetsPurchased * material.sheetSalePrice;
  const workCost = area * material.workCostRatePerSqm;
  const workSalePrice = area * material.workSaleRatePerSqm;

  const costSubtotal = materialPurchaseCost + workCost;
  const saleSubtotal = materialSalePrice + workSalePrice;

  return {
    id: product.id,
    type: product.type,
    area: roundTo(area, 3),
    materialSheetsRaw: roundTo(materialSheetsRaw, 3),
    materialSheetsPurchased: roundTo(materialSheetsPurchased, 2),
    materialPurchaseCost: roundTo(materialPurchaseCost),
    materialSalePrice: roundTo(materialSalePrice),
    workCost: roundTo(workCost),
    workSalePrice: roundTo(workSalePrice),
    costSubtotal: roundTo(costSubtotal),
    saleSubtotal: roundTo(saleSubtotal),
  };
};

export const calculateOrder = (
  products: ProductInput[],
  materials: Material[],
  services: ServicesInput,
): OrderCalculation => {
  const items = products.map((p) => {
    const material = materials.find((m) => m.id === p.materialId);
    if (!material) {
      throw new Error(`Материал с id=${p.materialId} не найден`);
    }
    return calculateProduct(p, material);
  });

  const totalArea = items.reduce((acc, item) => acc + item.area, 0);
  const totalMaterialSheetsRaw = items.reduce((acc, item) => acc + item.materialSheetsRaw, 0);
  const totalMaterialSheetsPurchased = items.reduce((acc, item) => acc + item.materialSheetsPurchased, 0);

  const materialPurchaseCost = items.reduce((acc, item) => acc + item.materialPurchaseCost, 0);
  const materialSalePrice = items.reduce((acc, item) => acc + item.materialSalePrice, 0);
  const workCost = items.reduce((acc, item) => acc + item.workCost, 0);
  const workSalePrice = items.reduce((acc, item) => acc + item.workSalePrice, 0);

  const installationCost = services.installationCost;
  const installationSalePrice = services.installationSalePrice;
  const deliveryCost = services.deliveryCost;
  const deliverySalePrice = services.deliverySalePrice;
  const surveyCost = services.surveyCost;
  const surveySalePrice = services.surveySalePrice;

  const totalCost = materialPurchaseCost + workCost + installationCost + deliveryCost + surveyCost;
  const preDiscountClientPrice = materialSalePrice + workSalePrice + installationSalePrice + deliverySalePrice + surveySalePrice;
  const discountAmount = preDiscountClientPrice * (services.discountPercent / 100);
  const finalClientPrice = preDiscountClientPrice - discountAmount;

  const profit = finalClientPrice - totalCost;
  const marginPercent = finalClientPrice > 0 ? (profit / finalClientPrice) * 100 : 0;

  return {
    items,
    totalArea: roundTo(totalArea, 3),
    totalMaterialSheetsRaw: roundTo(totalMaterialSheetsRaw, 3),
    totalMaterialSheetsPurchased: roundTo(totalMaterialSheetsPurchased, 2),
    materialPurchaseCost: roundTo(materialPurchaseCost),
    materialSalePrice: roundTo(materialSalePrice),
    workCost: roundTo(workCost),
    workSalePrice: roundTo(workSalePrice),
    installationCost: roundTo(installationCost),
    installationSalePrice: roundTo(installationSalePrice),
    deliveryCost: roundTo(deliveryCost),
    deliverySalePrice: roundTo(deliverySalePrice),
    surveyCost: roundTo(surveyCost),
    surveySalePrice: roundTo(surveySalePrice),
    totalCost: roundTo(totalCost),
    preDiscountClientPrice: roundTo(preDiscountClientPrice),
    discountAmount: roundTo(discountAmount),
    finalClientPrice: roundTo(finalClientPrice),
    profit: roundTo(profit),
    marginPercent: roundTo(marginPercent, 2),
  };
};
