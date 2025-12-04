# 🚀 Быстрый старт деплоя на VPS

## Что было сделано

✅ Убран Vercel  
✅ Созданы Dockerfile для всех приложений  
✅ Настроен docker-compose с PostgreSQL  
✅ Настроен nginx для meat-bot.fluttrium.com  
✅ .env файлы в репозитории (без секретов)  
✅ Готов скрипт автоматического деплоя  

## Порты

- **3443** - Next.js Web App
- **3553** - NestJS API  
- **80/443** - nginx (внешние)

## На VPS нужно сделать

### 1. Установить зависимости (если еще нет)

```bash
# Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Certbot
sudo apt update
sudo apt install certbot -y
```

### 2. Получить SSL сертификат

```bash
# Остановите глобальный nginx если запущен
sudo systemctl stop nginx

# Получите сертификат
sudo certbot certonly --standalone -d meat-bot.fluttrium.com

# Сертификаты будут в /etc/letsencrypt/live/meat-bot.fluttrium.com/
```

### 3. Клонировать репозиторий

```bash
cd /путь/к/твоим/проектам
git clone https://github.com/OkaneKatsuro/meat_mini_app.git
cd meat_mini_app
```

### 4. Обновить BOT_TOKEN

```bash
# Отредактируй .env
nano .env
# Укажи свой BOT_TOKEN от @BotFather

# Отредактируй apps/bot/.env
nano apps/bot/.env
# Укажи свой BOT_TOKEN

# Остальное уже настроено\!
```

### 5. Запустить

```bash
chmod +x deploy.sh
./deploy.sh
```

## Вот и все\! 🎉

Приложение будет доступно:
- **Web**: https://meat-bot.fluttrium.com
- **API Swagger**: https://meat-bot.fluttrium.com/api/docs
- **Telegram Bot**: @твой_бот

## Обновление

Для обновления просто запусти:

```bash
cd meat_mini_app
./deploy.sh
```

Скрипт автоматически:
1. Подтянет изменения из git
2. Пересоберет контейнеры
3. Запустит приложение
4. Выполнит миграции БД

## Управление

```bash
# Статус контейнеров
docker-compose ps

# Логи
docker-compose logs -f

# Перезапуск
docker-compose restart

# Остановка
docker-compose down
```

## Полная документация

Смотри `DEPLOY.md` для подробных инструкций, troubleshooting и backup.
