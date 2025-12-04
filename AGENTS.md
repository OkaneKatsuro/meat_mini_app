# Repository Guidelines

## Структура проекта и модули
- Monorepo на Turborepo с workspace-ами в `apps/` и `packages/`.
- `apps/api`: NestJS REST API со Swagger; доменная логика и валидация в `src/`.
- `apps/web`: Next.js Telegram Mini App; страницы и UI-примитивы в `app/` и `components/`.
- `apps/bot`: Telegram-бот на `grammy`, точка входа `src/index.js`.
- `packages/database`: Prisma schema/client и DB-команды; сборки в `dist/`.
- `packages/typescript-config`: общие TS-конфиги. Материалы по деплою в `DEPLOY*.md`, `docker-compose.yml`.

## Сборка, тесты и разработка
- Установка: `npm install` (Node >=18).
- Все dev-сервера: `npm run dev` (через Turborepo поднимает web/api/bot).
- Полная сборка: `npm run build` (генерация Prisma, сборка `packages/database`, затем build всех приложений).
- Качество: `npm run lint`, `npm run format`.
- API: `npm run dev --workspace=api`, `npm run build --workspace=api`, `npm run start:prod --workspace=api`.
- Web: `npm run dev --workspace=web`, `npm run build --workspace=web`, `npm run start --workspace=web`.
- База: `npm run db:generate --workspace=packages/database`, `npm run db:migrate --workspace=packages/database`, `npm run db:push --workspace=packages/database`, `npm run db:studio --workspace=packages/database`.

## Стиль кода и именование
- TypeScript везде, кроме бота. Prettier 3 (2 пробела) — перед пушем запускайте `npm run format`.
- ESLint: `next lint` в web, `eslint "{src,apps,libs,test}/**/*.ts"` в API; не оставляйте warnings.
- PascalCase для компонентов/классов, camelCase для переменных/функций, kebab-case для файлов/папок. DTO и схемы держите в `dto/` или `prisma/` с понятными суффиксами.

## Тестирование
- API: Jest с шаблоном `*.spec.ts` в `src/` или `test/`. Запуск: `npm run test --workspace=api` или `npm run test:cov --workspace=api`.
- Пишите тесты рядом с кодом, повторяйте структуру модулей. Внешние сервисы и БД мокайте (Prisma utilities).
- Web и bot пока без стандартных тестов — добавляйте Jest/RTL или интеграционные проверки для критичных изменений.

## Коммиты и PR
- Conventional Commits (`feat: ...`, `chore: ...`, `docs: ...`) как в истории. Формулируйте императивно и со скоупом (`feat(api): add shipment debtors endpoint`).
- В PR указывайте скоуп (web/api/bot/database), что сделано, какие тесты прогнаны, нужны ли миграции/новые env. Для UI — скриншоты; для бота — изменённые команды/поведение.
- Не коммитьте секреты; `.env` оставляем локально, примеры значений — в документации.

## Безопасность и конфигурация
- Env-переменные: API — `DATABASE_URL`, `PORT`, `FRONTEND_URL`; web — `NEXT_PUBLIC_API_URL`; бот — токен в `.env` для `apps/bot`. Реальные креды не коммитим.
- После правок Prisma: `npm run db:migrate --workspace=packages/database && npm run db:generate --workspace=packages/database`; миграции коммитим вместе с кодом.
- Для соответствия продакшену используйте Docker: `docker-compose up -d` поможет избегать дрейфа БД локально.
