# 🚀 Инструкция по деплою на VPS

## Предварительные требования

На сервере должны быть установлены:
- Docker
- Docker Compose
- Git
- Certbot (для SSL сертификатов)

## Настройка SSL сертификата

Перед запуском приложения получите SSL сертификат:

```bash
# Остановите nginx если он запущен глобально
sudo systemctl stop nginx

# Получите сертификат
sudo certbot certonly --standalone -d meat-bot.fluttrium.com

# Сертификаты будут в /etc/letsencrypt/live/meat-bot.fluttrium.com/
```

## Деплой приложения

### 1. Клонируйте репозиторий

```bash
cd /path/to/your/apps
git clone https://github.com/OkaneKatsuro/meat_mini_app.git
cd meat_mini_app
```

### 2. Обновите .env файлы

Откройте и измените файлы:

```bash
# Корневой .env
nano .env
# Укажите BOT_TOKEN от @BotFather

# apps/bot/.env
nano apps/bot/.env
# Укажите BOT_TOKEN

# Остальные настройки уже правильные
```

### 3. Проверьте доступные порты

Убедитесь что порты свободны:

```bash
sudo netstat -tulpn | grep -E '3443|3553|80|443'
```

Если порты заняты, измените их в:
- `docker-compose.yml`
- `nginx/nginx.conf`

### 4. Запустите деплой

```bash
# Дайте права на выполнение скрипту
chmod +x deploy.sh

# Запустите деплой
./deploy.sh
```

## Управление контейнерами

```bash
# Посмотреть статус
docker-compose ps

# Посмотреть логи
docker-compose logs -f

# Перезапустить все
docker-compose restart

# Перезапустить один сервис
docker-compose restart api

# Остановить все
docker-compose down

# Остановить с удалением volumes (УДАЛИТ БАЗУ\!)
docker-compose down -v
```

## Обновление приложения

Просто запустите скрипт деплоя:

```bash
./deploy.sh
```

Он автоматически:
1. Подтянет изменения из git
2. Остановит старые контейнеры
3. Соберет новые образы
4. Запустит контейнеры
5. Выполнит миграции базы данных

## Проверка работы

После деплоя проверьте:

1. **Web приложение**: https://meat-bot.fluttrium.com
2. **API Swagger**: https://meat-bot.fluttrium.com/api/docs
3. **Бот в Telegram**: @ваш_бот

## Структура портов

- `80` → nginx (HTTP, редирект на HTTPS)
- `443` → nginx (HTTPS)
- `3443` → Next.js Web App (внутри Docker сети)
- `3553` → NestJS API (внутри Docker сети)
- `5432` → PostgreSQL (только внутри Docker сети)

## Troubleshooting

### Проблема с SSL сертификатами

```bash
# Проверьте наличие сертификатов
ls -la /etc/letsencrypt/live/meat-bot.fluttrium.com/

# Если нет, получите заново
sudo certbot certonly --standalone -d meat-bot.fluttrium.com
```

### Контейнер не запускается

```bash
# Посмотрите логи
docker-compose logs api
docker-compose logs web
docker-compose logs bot

# Проверьте статус
docker-compose ps
```

### База данных не доступна

```bash
# Проверьте статус postgres
docker-compose logs postgres

# Зайдите в контейнер
docker-compose exec postgres psql -U meat_user -d meat_warehouse
```

### Nginx не работает

```bash
# Проверьте конфиг
docker-compose exec nginx nginx -t

# Перезапустите nginx
docker-compose restart nginx
```

## Backup базы данных

```bash
# Создать backup
docker-compose exec postgres pg_dump -U meat_user meat_warehouse > backup_$(date +%Y%m%d_%H%M%S).sql

# Восстановить из backup
docker-compose exec -T postgres psql -U meat_user -d meat_warehouse < backup_20240101_120000.sql
```

## Полезные команды

```bash
# Очистить неиспользуемые образы и контейнеры
docker system prune -a

# Посмотреть использование ресурсов
docker stats

# Зайти в контейнер
docker-compose exec api sh
docker-compose exec web sh

# Пересобрать без кеша
docker-compose build --no-cache
```
