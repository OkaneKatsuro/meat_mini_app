# Склад Мяса - Telegram Mini App

Приложение для управления складом замороженного мяса с функциями учета поставок, отгрузок и контроля оплаты.

## Технологический стек

- **Monorepo**: Turborepo
- **Backend**: NestJS (latest)
- **Frontend**: Next.js (latest)
- **Database**: PostgreSQL + Prisma ORM
- **UI**: Tailwind CSS + shadcn/ui
- **Container**: Docker
- **TypeScript**: Latest version

## Возможности

### Учет поставок
- Регистрация поставок мяса (курица/говядина)
- Размеры упаковок: 15 кг и 20 кг
- Дата поступления и количество

### Управление клиентами
- Создание и редактирование клиентов
- История отгрузок по клиентам
- Контактная информация

### Отгрузки
- Создание отгрузок с привязкой к клиенту
- Контроль оплаты (оплачено/не оплачено)
- Сумма отгрузки
- Комментарии к отгрузке

### Dashboard
- Виджет с текущими остатками на складе
- Список должников с суммами задолженности
- Общая статистика по складу

### Отчеты
- Формирование отчетов за указанный период
- Статистика по поставкам и отгрузкам
- Анализ выручки (оплаченной и неоплаченной)
- Топ клиентов по объему закупок

## Структура проекта

```
meet_tg/
├── apps/
│   ├── api/          # NestJS backend
│   └── web/          # Next.js frontend (Telegram Mini App)
├── packages/
│   ├── database/     # Prisma schema и client
│   └── typescript-config/  # Общие TypeScript конфиги
├── docker-compose.yml
└── turbo.json
```

## Быстрый старт

### Разработка с Docker

1. Клонируйте репозиторий:
```bash
cd meet_tg
```

2. Создайте .env файл:
```bash
cp .env .env
```

3. Запустите Docker Compose:
```bash
docker-compose up -d
```

4. Примените миграции базы данных:
```bash
docker-compose exec api npx prisma migrate dev
```

Приложения будут доступны:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api/docs

### Локальная разработка

1. Установите зависимости:
```bash
npm install
```

2. Настройте базу данных:
```bash
cd packages/database
npx prisma migrate dev
npx prisma generate
```

3. Запустите dev-серверы:
```bash
npm run dev
```

## База данных

### Миграции

Создание новой миграции:
```bash
cd packages/database
npx prisma migrate dev --name migration_name
```

Применение миграций в production:
```bash
npx prisma migrate deploy
```

### Prisma Studio

Просмотр и редактирование данных:
```bash
cd packages/database
npx prisma studio
```

## API Endpoints

### Supplies (Поставки)
- `GET /api/supplies` - Список всех поставок
- `POST /api/supplies` - Создать поставку
- `GET /api/supplies/:id` - Получить поставку
- `PATCH /api/supplies/:id` - Обновить поставку
- `DELETE /api/supplies/:id` - Удалить поставку

### Clients (Клиенты)
- `GET /api/clients` - Список всех клиентов
- `POST /api/clients` - Создать клиента
- `GET /api/clients/:id` - Получить клиента
- `PATCH /api/clients/:id` - Обновить клиента
- `DELETE /api/clients/:id` - Удалить клиента

### Shipments (Отгрузки)
- `GET /api/shipments` - Список всех отгрузок
- `GET /api/shipments/unpaid` - Неоплаченные отгрузки
- `POST /api/shipments` - Создать отгрузку
- `GET /api/shipments/:id` - Получить отгрузку
- `PATCH /api/shipments/:id` - Обновить отгрузку
- `PATCH /api/shipments/:id/mark-paid` - Отметить как оплаченную
- `DELETE /api/shipments/:id` - Удалить отгрузку

### Dashboard
- `GET /api/dashboard` - Полные данные дашборда
- `GET /api/dashboard/inventory` - Остатки на складе
- `GET /api/dashboard/debtors` - Список должников
- `GET /api/dashboard/stats` - Общая статистика

### Reports (Отчеты)
- `GET /api/reports/period?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` - Отчет за период
- `GET /api/reports/period/csv?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` - CSV-выгрузка отчета за период

## Telegram Mini App

Приложение интегрировано с Telegram Web App API:

- Автоматическая адаптация к теме Telegram
- Поддержка темной/светлой темы
- Использование нативных элементов (BackButton, MainButton)
- Haptic Feedback для лучшего UX

### Настройка Telegram Mini App

1. Создайте бота через [@BotFather](https://t.me/botfather)
2. Получите токен бота
3. Настройте Web App URL через /newapp в BotFather
4. Укажите URL: `https://your-domain.com`

## Скрипты

```bash
# Запустить все приложения в dev режиме
npm run dev

# Собрать все приложения
npm run build

# Запустить линтер
npm run lint

# Форматировать код
npm run format

# Очистить все build артефакты
npm run clean
```

## Production Deployment

### Vercel (Рекомендуется)

Подробное руководство по деплою на Vercel смотрите в [DEPLOYMENT.md](./DEPLOYMENT.md)

Краткая инструкция:
1. Создайте Git репозиторий и запушьте код
2. Импортируйте проект в Vercel
3. Настройте два проекта: frontend (apps/web) и backend (apps/api)
4. Добавьте переменные окружения
5. Deploy!

### Docker

```bash
docker-compose up -d
```

### Manual

1. Соберите проект:
```bash
npm run build
```

2. Примените миграции:
```bash
cd packages/database
npx prisma migrate deploy
```

3. Запустите приложения:
```bash
# API
cd apps/api
npm run start:prod

# Web
cd apps/web
npm run start
```

## Переменные окружения

### API (apps/api)
- `DATABASE_URL` - URL подключения к PostgreSQL
- `PORT` - Порт API сервера (по умолчанию 3001)
- `NODE_ENV` - Окружение (development/production)
- `FRONTEND_URL` - URL фронтенда для CORS

### Web (apps/web)
- `NEXT_PUBLIC_API_URL` - URL API сервера

## Лицензия

MIT
