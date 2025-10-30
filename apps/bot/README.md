# Telegram Bot для Склад Мяса

Простой бот для открытия Mini App приложения управления складом.

## Настройка

1. Создайте бота через [@BotFather](https://t.me/botfather):
   - Отправьте `/newbot`
   - Укажите имя бота
   - Получите токен

2. Создайте файл `.env`:
   ```bash
   cp .env.example .env
   ```

3. Заполните `.env`:
   ```
   BOT_TOKEN=ваш_токен_от_botfather
   MINI_APP_URL=https://meat-mini-app-web.vercel.app
   ```

4. Установите зависимости:
   ```bash
   npm install
   ```

5. Запустите бота:
   ```bash
   npm start
   # или для разработки с автоперезагрузкой:
   npm run dev
   ```

## Настройка Mini App в BotFather

После создания бота, настройте Mini App:

1. Отправьте [@BotFather](https://t.me/botfather) команду `/mybots`
2. Выберите вашего бота
3. Выберите "Bot Settings" → "Menu Button"
4. Нажмите "Edit Menu Button URL"
5. Введите URL: `https://meat-mini-app-web.vercel.app`
6. Введите текст кнопки: `📦 Открыть приложение`

Теперь у бота будет постоянная кнопка для открытия Mini App!

## Команды бота

- `/start` - Приветствие и кнопка открытия Mini App
- `/app` - Кнопка для открытия Mini App
- `/help` - Справка

## Деплой на production

Для production рекомендуется деплоить на:
- Railway.app
- Fly.io
- Heroku
- VPS с PM2

Пример с PM2:
```bash
pm2 start src/index.js --name meat-bot
pm2 save
pm2 startup
```
