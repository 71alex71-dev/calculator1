'use client';

import { useEffect, useMemo, useState } from 'react';
import { calculateOrder, Material, ProductInput, ProductType, ServicesInput } from '@/lib/calculationEngine';

const PRODUCT_TYPES: ProductType[] = ['Подоконник', 'Столешница', 'Стеновая панель'];

const DEFAULT_MATERIALS: Material[] = [
  {
    id: 'grandex-p101',
    brand: 'Grandex',
    series: 'Pure',
    code: 'P101',
    name: 'Pure Vanilla',
    fullName: 'Grandex P101 Pure Vanilla',
    category: 'white',
    sheetPurchasePrice: 22000,
    sheetSalePrice: 30000,
    workCostRatePerSqm: 6000,
    workSaleRatePerSqm: 12000,
  },
  {
    id: 'grandex-p104',
    brand: 'Grandex',
    series: 'Pure',
    code: 'P104',
    name: 'Pure White',
    fullName: 'Grandex P104 Pure White',
    category: 'white',
    sheetPurchasePrice: 22000,
    sheetSalePrice: 30000,
    workCostRatePerSqm: 6000,
    workSaleRatePerSqm: 12000,
  },
  {
    id: 'grandex-s201',
    brand: 'Grandex',
    series: 'Sand and Sky',
    code: 'S201',
    name: 'Dirty Sand',
    fullName: 'Grandex S201 Dirty Sand',
    category: 'small_particles',
    sheetPurchasePrice: 26000,
    sheetSalePrice: 36000,
    workCostRatePerSqm: 6500,
    workSaleRatePerSqm: 13000,
  },
  {
    id: 'grandex-s202',
    brand: 'Grandex',
    series: 'Sand and Sky',
    code: 'S202',
    name: 'Peaceful Night',
    fullName: 'Grandex S202 Peaceful Night',
    category: 'small_particles',
    sheetPurchasePrice: 26000,
    sheetSalePrice: 36000,
    workCostRatePerSqm: 6500,
    workSaleRatePerSqm: 13000,
  },
  {
    id: 'grandex-s203',
    brand: 'Grandex',
    series: 'Sand and Sky',
    code: 'S203',
    name: 'Sparkling Sand',
    fullName: 'Grandex S203 Sparkling Sand',
    category: 'small_particles',
    sheetPurchasePrice: 26000,
    sheetSalePrice: 36000,
    workCostRatePerSqm: 6500,
    workSaleRatePerSqm: 13000,
  },
  {
    id: 'grandex-s204',
    brand: 'Grandex',
    series: 'Sand and Sky',
    code: 'S204',
    name: 'Creamy Sand',
    fullName: 'Grandex S204 Creamy Sand',
    category: 'small_particles',
    sheetPurchasePrice: 26000,
    sheetSalePrice: 36000,
    workCostRatePerSqm: 6500,
    workSaleRatePerSqm: 13000,
  },
  {
    id: 'grandex-s205',
    brand: 'Grandex',
    series: 'Sand and Sky',
    code: 'S205',
    name: 'Fair Sky',
    fullName: 'Grandex S205 Fair Sky',
    category: 'small_particles',
    sheetPurchasePrice: 26000,
    sheetSalePrice: 36000,
    workCostRatePerSqm: 6500,
    workSaleRatePerSqm: 13000,
  },
  {
    id: 'grandex-s207',
    brand: 'Grandex',
    series: 'Sand and Sky',
    code: 'S207',
    name: 'Clear Sky',
    fullName: 'Grandex S207 Clear Sky',
    category: 'small_particles',
    sheetPurchasePrice: 26000,
    sheetSalePrice: 36000,
    workCostRatePerSqm: 6500,
    workSaleRatePerSqm: 13000,
  },
  {
    id: 'grandex-m713',
    brand: 'Grandex',
    series: 'Marble Ocean',
    code: 'M713',
    name: 'Whitesand Beach',
    fullName: 'Grandex M713 Whitesand Beach',
    category: 'marble',
    sheetPurchasePrice: 32000,
    sheetSalePrice: 45000,
    workCostRatePerSqm: 7000,
    workSaleRatePerSqm: 14000,
  },
  {
    id: 'grandex-m720',
    brand: 'Grandex',
    series: 'Marble Ocean',
    code: 'M720',
    name: 'Carrara Lunar',
    fullName: 'Grandex M720 Carrara Lunar',
    category: 'marble',
    sheetPurchasePrice: 35000,
    sheetSalePrice: 50000,
    workCostRatePerSqm: 8000,
    workSaleRatePerSqm: 15000,
  },
];
const DEFAULT_SERVICES: ServicesInput = {
  surveyCost: 3000,
  surveySalePrice: 5000,
  deliveryCost: 5000,
  deliverySalePrice: 7000,
  installationCost: 8000,
  installationSalePrice: 12000,
  discountPercent: 0,
};

const formatMoney = (value: number) => `${value.toLocaleString('ru-RU')} ₽`;
const getCategoryLabel = (category: Material['category']) => {
  const labels: Record<Material['category'], string> = {
    white: 'Белый',
    monochrome: 'Монохромный',
    small_particles: 'Мелкие вкрапления',
    large_particles: 'Крупные вкрапления',
    marble: 'Под мрамор / с разводами',
    promo: 'Акция',
  };

  return labels[category];
};

export default function CalculatorApp({ page }: { page: 'new' | 'materials' | 'summary' | 'message' }) {
  const [materials, setMaterials] = useState<Material[]>(DEFAULT_MATERIALS);
  const [products, setProducts] = useState<ProductInput[]>([]);
  const [services, setServices] = useState<ServicesInput>(DEFAULT_SERVICES);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('stone-calculator-state');

      if (raw) {
        const parsed = JSON.parse(raw);

        setMaterials(parsed.materials ?? DEFAULT_MATERIALS);
        setProducts(parsed.products ?? []);
        setServices(parsed.services ?? DEFAULT_SERVICES);
      }
    } catch (error) {
      console.error('Failed to load calculator state', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem(
      'stone-calculator-state',
      JSON.stringify({ materials, products, services }),
    );
  }, [isLoaded, materials, products, services]);

  const calculation = useMemo(
    () => calculateOrder(products, materials, services),
    [products, materials, services],
  );

  const addProduct = () => {
    setProducts((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: 'Подоконник',
        lengthMm: 1000,
        widthMm: 300,
        quantity: 1,
        materialId: materials[0]?.id ?? '',
      },
    ]);
  };

  if (page === 'materials') {
    return <MaterialsView materials={materials} setMaterials={setMaterials} />;
  }

  if (page === 'summary') {
    return <SummaryView calculation={calculation} products={products} />;
  }

  if (page === 'message') {
    return <MessageView products={products} materials={materials} calculation={calculation} />;
  }

  return (
    <section className="space-y-4 rounded-2xl bg-white p-6 shadow">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Новый расчёт</h2>
        <button
          onClick={addProduct}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Добавить изделие
        </button>
      </div>

      {products.length === 0 && (
        <p className="text-slate-500">Добавьте минимум одно изделие в заказ.</p>
      )}

      {products.map((item, index) => (
        <div
          key={item.id}
          className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 p-4 md:grid-cols-4"
        >
          <select
            value={item.type}
            onChange={(e) =>
              setProducts((prev) =>
                prev.map((p) =>
                  p.id === item.id ? { ...p, type: e.target.value as ProductType } : p,
                ),
              )
            }
            className="rounded-lg border p-2"
          >
            {PRODUCT_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>

          <Input
            label="Длина (мм)"
            value={item.lengthMm}
            onChange={(v) =>
              setProducts((prev) =>
                prev.map((p) => (p.id === item.id ? { ...p, lengthMm: v } : p)),
              )
            }
          />

          <Input
            label="Ширина (мм)"
            value={item.widthMm}
            onChange={(v) =>
              setProducts((prev) =>
                prev.map((p) => (p.id === item.id ? { ...p, widthMm: v } : p)),
              )
            }
          />

          <Input
            label="Количество"
            value={item.quantity}
            onChange={(v) =>
              setProducts((prev) =>
                prev.map((p) => (p.id === item.id ? { ...p, quantity: v } : p)),
              )
            }
          />

          <select
            value={item.materialId}
            onChange={(e) =>
              setProducts((prev) =>
                prev.map((p) =>
                  p.id === item.id ? { ...p, materialId: e.target.value } : p,
                ),
              )
            }
            className="rounded-lg border p-2 md:col-span-3"
          >
            {materials.map((m) => (
              <option key={m.id} value={m.id}>
                {m.fullName}
              </option>
            ))}
          </select>

          <button
            onClick={() => setProducts((prev) => prev.filter((p) => p.id !== item.id))}
            className="rounded-lg bg-rose-100 px-3 py-2 text-rose-700"
          >
            Удалить #{index + 1}
          </button>
        </div>
      ))}

      <div className="grid gap-3 rounded-xl border border-slate-200 p-4 md:grid-cols-4">
        <Input
          label="Замер"
          value={services.surveySalePrice}
          onChange={(v) => setServices((s) => ({ ...s, surveySalePrice: v }))}
        />

        <Input
          label="Доставка"
          value={services.deliverySalePrice}
          onChange={(v) => setServices((s) => ({ ...s, deliverySalePrice: v }))}
        />

        <Input
          label="Монтаж"
          value={services.installationSalePrice}
          onChange={(v) => setServices((s) => ({ ...s, installationSalePrice: v }))}
        />

        <Input
          label="Скидка (%)"
          value={services.discountPercent}
          onChange={(v) => setServices((s) => ({ ...s, discountPercent: v }))}
        />
      </div>

      <div className="rounded-xl bg-slate-50 p-4">
        <p className="text-sm">
          Предварительный итог: <strong>{formatMoney(calculation.finalClientPrice)}</strong>
        </p>
      </div>
    </section>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="text-sm">
      {label}
      <input
        className="mt-1 w-full rounded-lg border p-2"
        type="number"
        value={Number.isFinite(value) ? String(value) : ''}
        onFocus={(e) => e.target.select()}
        onChange={(e) => {
          const nextValue = e.target.value;
          onChange(nextValue === '' ? 0 : Number(nextValue));
        }}
      />
    </label>
  );
}

function MaterialsView({
  materials,
  setMaterials,
}: {
  materials: Material[];
  setMaterials: (materials: Material[]) => void;
}) {
  const [search, setSearch] = useState('');

  const filteredMaterials = materials.filter((material) => {
    const query = search.toLowerCase().trim();

    if (!query) return true;

    return [
      material.brand,
      material.series,
      material.code,
      material.name,
      material.fullName,
      material.category,
    ]
      .join(' ')
      .toLowerCase()
      .includes(query);
  });

  return (
    <section className="space-y-3 rounded-2xl bg-white p-6 shadow">
      <h2 className="text-xl font-semibold">Справочник материалов</h2>

      <input
        className="w-full rounded-lg border p-3 text-sm"
        placeholder="Поиск: Grandex, P104, Pure White, marble..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <p className="text-sm text-slate-500">
        Найдено материалов: {filteredMaterials.length}
      </p>

      {filteredMaterials.map((m) => (
        <div
          key={m.id}
          className="grid grid-cols-1 gap-3 rounded-xl border p-4 md:grid-cols-3"
        >
          <div>
            <div className="font-medium">{m.fullName}</div>
            <div className="text-xs text-slate-500">
              {m.brand} / {m.series} / {m.code} / {getCategoryLabel(m.category)}
            </div>
          </div>

          <Input
            label="Закупка листа"
            value={m.sheetPurchasePrice}
            onChange={(v) =>
              setMaterials(
                materials.map((x) => (x.id === m.id ? { ...x, sheetPurchasePrice: v } : x)),
              )
            }
          />

          <Input
            label="Продажа листа"
            value={m.sheetSalePrice}
            onChange={(v) =>
              setMaterials(
                materials.map((x) => (x.id === m.id ? { ...x, sheetSalePrice: v } : x)),
              )
            }
          />

          <Input
            label="Работа себестоимость м²"
            value={m.workCostRatePerSqm}
            onChange={(v) =>
              setMaterials(
                materials.map((x) =>
                  x.id === m.id ? { ...x, workCostRatePerSqm: v } : x,
                ),
              )
            }
          />

          <Input
            label="Работа продажа м²"
            value={m.workSaleRatePerSqm}
            onChange={(v) =>
              setMaterials(
                materials.map((x) =>
                  x.id === m.id ? { ...x, workSaleRatePerSqm: v } : x,
                ),
              )
            }
          />
        </div>
      ))}
    </section>
  );
}
function SummaryView({
  calculation,
  products,
}: {
  calculation: ReturnType<typeof calculateOrder>;
  products: ProductInput[];
}) {
  const findProduct = (id: string) => products.find((product) => product.id === id);

  return (
    <section className="space-y-4 rounded-2xl bg-white p-6 shadow">
      <h2 className="text-xl font-semibold">Итог расчёта</h2>

      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th>Изделие</th>
              <th>Размер</th>
              <th>Кол-во</th>
              <th>Площадь</th>
              <th>Листы</th>
              <th>Материал</th>
              <th>Работа</th>
            </tr>
          </thead>
          <tbody>
            {calculation.items.map((i) => {
              const product = findProduct(i.id);

              return (
                <tr key={i.id} className="border-t">
                  <td>{i.type}</td>
                  <td>
                    {product
                      ? `${product.lengthMm} × ${product.widthMm} мм`
                      : '—'}
                  </td>
                  <td>{product?.quantity ?? '—'}</td>
                  <td>{i.area} м²</td>
                  <td>{i.materialSheetsPurchased}</td>
                  <td>{formatMoney(i.materialSalePrice)}</td>
                  <td>{formatMoney(i.workSalePrice)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid gap-2 rounded-xl bg-slate-50 p-4 text-sm">
        <p>
          Общая площадь: <b>{calculation.totalArea} м²</b>
        </p>
        <p>
          Количество листов: <b>{calculation.totalMaterialSheetsRaw}</b> закупка:{' '}
          <b>{calculation.totalMaterialSheetsPurchased}</b>
        </p>
        <p>
          Материал продажа: <b>{formatMoney(calculation.materialSalePrice)}</b>
        </p>
        <p>
          Работа продажа: <b>{formatMoney(calculation.workSalePrice)}</b>
        </p>
        <p>
          Монтаж продажа: <b>{formatMoney(calculation.installationSalePrice)}</b>
        </p>
        <p>
          Доставка продажа: <b>{formatMoney(calculation.deliverySalePrice)}</b>
        </p>
        <p>
          Замер продажа: <b>{formatMoney(calculation.surveySalePrice)}</b>
        </p>
        <p>
          Цена до скидки: <b>{formatMoney(calculation.preDiscountClientPrice)}</b>
        </p>
        <p>
          Скидка: <b>{formatMoney(calculation.discountAmount)}</b>
        </p>
        <p>
          Итоговая цена клиенту: <b>{formatMoney(calculation.finalClientPrice)}</b>
        </p>
        <p>
          Себестоимость: <b>{formatMoney(calculation.totalCost)}</b>
        </p>
        <p>
          Прибыль: <b>{formatMoney(calculation.profit)}</b>
        </p>
        <p>
          Маржинальность: <b>{calculation.marginPercent}%</b>
        </p>
      </div>
    </section>
  );
}
function MessageView({
  products,
  materials,
  calculation,
}: {
  products: ProductInput[];
  materials: Material[];
  calculation: ReturnType<typeof calculateOrder>;
}) {
  const productLines = products.map((product, index) => {
    const material = materials.find((m) => m.id === product.materialId);
    const calculatedItem = calculation.items[index];

    return `— ${product.type} ${product.lengthMm} × ${product.widthMm} мм — ${product.quantity} шт., материал: ${
      material?.name ?? 'не выбран'
    }, стоимость: ${formatMoney((calculatedItem?.materialSalePrice ?? 0) + (calculatedItem?.workSalePrice ?? 0))}`;
  });

  const message = `Здравствуйте!

Подготовили предварительный расчёт изделий из искусственного камня.

Изделия:
${productLines.length > 0 ? productLines.join('\n') : '— изделия не добавлены'}

Материал и изготовление: ${formatMoney(calculation.materialSalePrice + calculation.workSalePrice)}
Замер: ${formatMoney(calculation.surveySalePrice)}
Доставка: ${formatMoney(calculation.deliverySalePrice)}
Монтаж: ${formatMoney(calculation.installationSalePrice)}
${calculation.discountAmount > 0 ? `Скидка: ${formatMoney(calculation.discountAmount)}\n` : ''}Итого: ${formatMoney(calculation.finalClientPrice)}

Расчёт предварительный. Точная стоимость зависит от выбранного материала, кромки, вырезов и особенностей монтажа.`;

  const copyMessage = async () => {
    await navigator.clipboard.writeText(message);
    alert('Сообщение скопировано');
  };

  return (
    <section className="space-y-4 rounded-2xl bg-white p-6 shadow">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Сообщение клиенту</h2>
        <button
          onClick={copyMessage}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Скопировать
        </button>
      </div>

      <p className="whitespace-pre-line rounded-xl bg-slate-50 p-4 text-sm">{message}</p>
    </section>
  );
}