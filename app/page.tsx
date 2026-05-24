'use client';

import { FormEvent, useMemo, useState } from 'react';

type ListingType = 'Товар' | 'Услуга';
type CountOption = 5 | 10 | 20;

type Listing = {
  title: string;
  description: string;
  priceHint: string;
};

type FormData = {
  niche: string;
  city: string;
  type: ListingType;
  price: string;
  count: CountOption;
  extra: string;
};

const listingTemplates: Record<ListingType, string[]> = {
  Товар: ['Надёжный вариант', 'Отличное состояние', 'Быстрая доставка', 'Гарантия качества'],
  Услуга: ['Профессиональный подход', 'Выезд в удобное время', 'Опыт более 5 лет', 'Работа по договору']
};

function generateDemoListings(data: FormData): Listing[] {
  const notes = listingTemplates[data.type];

  return Array.from({ length: data.count }, (_, index) => {
    const note = notes[index % notes.length];

    return {
      title: `${data.niche} в ${data.city} — вариант #${index + 1}`,
      description: `${note}. ${data.extra || 'Подходит для частных и коммерческих задач.'}`,
      priceHint: data.price || 'Цена по договорённости'
    };
  });
}

export default function HomePage() {
  const [formData, setFormData] = useState<FormData>({
    niche: '',
    city: '',
    type: 'Товар',
    price: '',
    count: 5,
    extra: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const listings = useMemo(() => generateDemoListings(formData), [formData]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setIsSubmitted(false);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 900);
  };

  return (
    <main className="min-h-screen bg-slate-100 py-8 px-4 sm:py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Генератор объявлений для Авито</h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-600 sm:text-base">
            Быстро создаёт тексты, идеи фото и рекомендации для размещения.
          </p>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <form className="grid grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-2 sm:col-span-1">
              <span className="text-sm font-medium text-slate-700">Что продаёте?</span>
              <input
                required
                className="rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                value={formData.niche}
                onChange={(event) => setFormData((prev) => ({ ...prev, niche: event.target.value }))}
                placeholder="Например, ремонт ноутбуков"
              />
            </label>

            <label className="flex flex-col gap-2 sm:col-span-1">
              <span className="text-sm font-medium text-slate-700">Город</span>
              <input
                required
                className="rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                value={formData.city}
                onChange={(event) => setFormData((prev) => ({ ...prev, city: event.target.value }))}
                placeholder="Москва"
              />
            </label>

            <label className="flex flex-col gap-2 sm:col-span-1">
              <span className="text-sm font-medium text-slate-700">Тип: товар или услуга</span>
              <select
                className="rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                value={formData.type}
                onChange={(event) => setFormData((prev) => ({ ...prev, type: event.target.value as ListingType }))}
              >
                <option value="Товар">Товар</option>
                <option value="Услуга">Услуга</option>
              </select>
            </label>

            <label className="flex flex-col gap-2 sm:col-span-1">
              <span className="text-sm font-medium text-slate-700">Цена, если есть</span>
              <input
                className="rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                value={formData.price}
                onChange={(event) => setFormData((prev) => ({ ...prev, price: event.target.value }))}
                placeholder="Например, от 8000 ₽/м²"
              />
              <span className="text-xs text-slate-500">Текст цены сохраняется без изменений (например: от 8000 ₽/м²).</span>
            </label>

            <label className="flex flex-col gap-2 sm:col-span-1">
              <span className="text-sm font-medium text-slate-700">Сколько объявлений сделать</span>
              <select
                className="rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                value={formData.count}
                onChange={(event) => setFormData((prev) => ({ ...prev, count: Number(event.target.value) as CountOption }))}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </label>

            <label className="flex flex-col gap-2 sm:col-span-2">
              <span className="text-sm font-medium text-slate-700">Дополнительная информация</span>
              <textarea
                className="min-h-28 rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                value={formData.extra}
                onChange={(event) => setFormData((prev) => ({ ...prev, extra: event.target.value }))}
                placeholder="Напишите детали: сроки, преимущества, условия"
              />
            </label>

            <button
              type="submit"
              className="sm:col-span-2 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
              disabled={isLoading}
            >
              {isLoading ? 'Генерируем демо-объявления...' : 'Сделать объявления'}
            </button>
          </form>
        </section>

        {isSubmitted && (
          <section className="space-y-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Краткий анализ ниши</h2>
              <p className="mt-2 text-sm text-slate-600 sm:text-base">
                В нише «{formData.niche}» в городе {formData.city} лучше работают объявления с конкретной выгодой,
                локальными триггерами доверия и понятным призывом к действию. Для типа «{formData.type.toLowerCase()}»
                важно сразу указать сроки и формат взаимодействия.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900">Таблица объявлений</h3>
              <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                  <thead className="bg-slate-50 text-slate-700">
                    <tr>
                      <th className="px-4 py-3 font-medium">#</th>
                      <th className="px-4 py-3 font-medium">Заголовок</th>
                      <th className="px-4 py-3 font-medium">Описание</th>
                      <th className="px-4 py-3 font-medium">Цена</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                    {listings.map((listing, index) => (
                      <tr key={listing.title + index}>
                        <td className="px-4 py-3">{index + 1}</td>
                        <td className="px-4 py-3 font-medium">{listing.title}</td>
                        <td className="px-4 py-3">{listing.description}</td>
                        <td className="px-4 py-3">{listing.priceHint}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900">Идеи фото</h3>
              <ul className="mt-3 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
                <li className="rounded-lg bg-slate-50 p-3">1. Главное фото с самым привлекательным ракурсом и хорошим дневным светом.</li>
                <li className="rounded-lg bg-slate-50 p-3">2. Фото процесса / использования, чтобы показать пользу в реальной ситуации.</li>
                <li className="rounded-lg bg-slate-50 p-3">3. Крупный план деталей, подтверждающих качество и состояние.</li>
                <li className="rounded-lg bg-slate-50 p-3">4. Фото с инфографикой: цена, сроки, ключевые преимущества.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900">Что проверить перед публикацией</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
                <li>Нет ли ошибок в заголовке и тексте объявления.</li>
                <li>Указаны ли город, актуальная цена и условия.</li>
                <li>Добавлены ли 4–8 качественных и понятных фото.</li>
                <li>Есть ли чёткий призыв к действию: звонок, сообщение или заказ.</li>
              </ul>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
