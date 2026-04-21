# Tense Trainer 2.0

Next.js-тренажёр английских времён для школьников 10–14 лет и начинающих. В одной странице собраны:

- наглядная таблица всех 12 времён
- смешанные тренировки по нескольким временам
- отдельная разминка `to be`
- локальный прогресс и повтор слабых мест
- SEO-обвязка для органического трафика

## Стек

- Next.js App Router
- React 19
- TypeScript
- `localStorage` для темы и прогресса

## Локальный запуск

```bash
npm install
npm run dev
```

Продакшен-сборка:

```bash
npm run build
npm run start
```

## Деплой

Рабочая схема проекта теперь такая:

- `Vercel` — для development, preview и быстрых проверок веток
- `Render` — для production и домена `временаванглийском.рф`

### Vercel

- `vercel.json` настроен для Next.js preview/development workflow
- любые обычные `vercel deploy` используются как preview
- Vercel production-домен можно использовать как резервный, но не как основной публичный домен

### Render

- `render.yaml` настроен как production web service
- Render должен отслеживать ветку `main`
- build command: `npm install && npm run build`
- start command: `npm run start`
- health check: `/`

Если текущий домен всё ещё смотрит на старый Render-сервис, проще всего обновить существующий Render service или создать новый из этого `render.yaml`, а потом привязать к нему домен `временаванглийском.рф`.

## Структура

- `app/` — маршруты, layout, metadata, robots, sitemap, manifest
- `components/` — UI главной страницы, тренажёр, footer
- `content/` — данные по 12 временам и разминка `to be`
- `lib/` — типы, генерация вопросов, прогресс и localStorage
- `docs/` — старые заметки по SEO и временам как справочный материал

## Что важно в релизе

- В первой версии нет аккаунтов и бэкенда
- Основной SEO-фокус идёт на одну сильную страницу `/`
- Канонический домен для production остаётся `временаванглийском.рф`
- Vercel используется как preview-среда, Render — как production-среда
