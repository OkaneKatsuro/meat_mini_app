# Deployment Guide - Vercel

Это руководство поможет развернуть fullstack приложение на Vercel.

## Подготовка

### 1. База данных

У вас уже есть PostgreSQL база данных. Убедитесь, что она доступна из интернета.

Текущая БД: `postgresql://gen_user:std!Y8XUk-RF%3BV@185.211.170.182:5432/meat`

### 2. Git репозиторий

Создайте Git репозиторий и запушьте код:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

## Деплой на Vercel

### Вариант 1: Два отдельных проекта (Рекомендуется)

#### A. Деплой Frontend (Next.js)

1. Перейдите на [vercel.com](https://vercel.com) и войдите
2. Нажмите "Add New Project"
3. Импортируйте ваш Git репозиторий
4. Настройте проект:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `cd ../.. && npm run build --workspace=apps/web`
   - **Output Directory**: `apps/web/.next`
   - **Install Command**: `npm install`

5. Добавьте Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-api-name.vercel.app/api
   ```

6. Нажмите "Deploy"

#### B. Деплой Backend (NestJS API)

1. Создайте новый проект на Vercel
2. Импортируйте тот же Git репозиторий
3. Настройте проект:
   - **Framework Preset**: Other
   - **Root Directory**: `apps/api`
   - **Build Command**: `cd ../.. && npm install && npm run build --workspace=packages/database && npm run build --workspace=apps/api`
   - **Output Directory**: `apps/api/dist`
   - **Install Command**: `npm install`

4. Добавьте Environment Variables:
   ```
   DATABASE_URL=postgresql://gen_user:std!Y8XUk-RF%3BV@185.211.170.182:5432/meat
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-name.vercel.app
   ```

5. Нажмите "Deploy"

### Вариант 2: Monorepo деплой

Если Vercel поддерживает ваш monorepo setup:

1. Импортируйте репозиторий
2. Vercel автоматически определит структуру
3. Настройте переменные окружения для обоих проектов
4. Deploy

## После деплоя

### 1. Примените миграции БД

Локально выполните:

```bash
DATABASE_URL="postgresql://gen_user:std!Y8XUk-RF%3BV@185.211.170.182:5432/meat" npx prisma migrate deploy --schema=packages/database/schema.prisma
```

### 2. Обновите CORS

Если нужно, обновите CORS настройки в `apps/api/src/main.ts`:

```typescript
app.enableCors({
  origin: ['https://your-frontend-name.vercel.app'],
  credentials: true,
});
```

### 3. Проверьте работу

- Frontend: `https://your-frontend-name.vercel.app`
- API: `https://your-api-name.vercel.app/api`
- API Docs: `https://your-api-name.vercel.app/api/docs`

## Настройка Telegram Mini App

1. Создайте бота через [@BotFather](https://t.me/botfather)
   ```
   /newbot
   ```

2. Создайте Web App:
   ```
   /newapp
   ```

3. Выберите созданного бота

4. Укажите Web App URL: `https://your-frontend-name.vercel.app`

5. Загрузите иконку и описание

6. Готово! Теперь ваше приложение доступно через Telegram

## Troubleshooting

### Проблема: 500 Internal Server Error на API

**Решение**: Проверьте переменные окружения в Vercel Dashboard

### Проблема: Cannot connect to database

**Решение**:
1. Убедитесь, что DATABASE_URL правильный
2. Проверьте, что БД доступна из интернета
3. Проверьте, что миграции применены

### Проблема: CORS errors

**Решение**: Обновите origin в main.ts и пересоберите API

## Environment Variables Reference

### Frontend (apps/web)
- `NEXT_PUBLIC_API_URL` - URL вашего API (например: `https://api.vercel.app/api`)

### Backend (apps/api)
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - `production`
- `FRONTEND_URL` - URL вашего frontend (для CORS)

## Custom Domain (Опционально)

1. В Vercel Dashboard выберите проект
2. Settings → Domains
3. Добавьте свой домен
4. Настройте DNS записи согласно инструкциям Vercel

## Автоматический деплой

Vercel автоматически деплоит при каждом push в main ветку:

```bash
git add .
git commit -m "Update features"
git push origin main
```

Vercel автоматически:
1. Соберет проект
2. Запустит миграции (если настроено)
3. Задеплоит новую версию

## Полезные команды

```bash
# Установить Vercel CLI
npm i -g vercel

# Деплой из командной строки
vercel

# Production деплой
vercel --prod

# Просмотр логов
vercel logs

# Список проектов
vercel list
```

## Мониторинг

В Vercel Dashboard вы можете:
- Просматривать логи
- Мониторить производительность
- Настроить алерты
- Просматривать аналитику

## Стоимость

Vercel предлагает бесплатный план для личных проектов:
- Unlimited deployments
- Automatic HTTPS
- 100GB bandwidth/month
- Serverless functions

Для production рекомендуется Pro план ($20/месяц).
