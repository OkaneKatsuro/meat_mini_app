#!/bin/bash
set -e

echo "🔧 Настройка Nginx и SSL для meat-bot.fluttrium.com"
echo ""

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. Установка Nginx и Certbot
echo -e "${YELLOW}📦 Шаг 1: Установка Nginx и Certbot...${NC}"
apt update
apt install -y nginx certbot python3-certbot-nginx

# 2. Создание директории для challenge
echo -e "${YELLOW}📁 Шаг 2: Создание директории для certbot...${NC}"
mkdir -p /var/www/certbot

# 3. Копирование конфига (временно без SSL)
echo -e "${YELLOW}📝 Шаг 3: Настройка временного конфига Nginx...${NC}"
cat > /etc/nginx/sites-available/meat-bot << 'EOF'
server {
    listen 80;
    server_name meat-bot.fluttrium.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        proxy_pass http://localhost:3443;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/ {
        proxy_pass http://localhost:3553/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# 4. Активация конфига
echo -e "${YELLOW}🔗 Шаг 4: Активация конфига...${NC}"
ln -sf /etc/nginx/sites-available/meat-bot /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 5. Проверка конфига и перезапуск
echo -e "${YELLOW}✅ Шаг 5: Проверка и перезапуск Nginx...${NC}"
nginx -t
systemctl restart nginx
systemctl enable nginx

# 6. Получение SSL сертификата
echo -e "${YELLOW}🔒 Шаг 6: Получение SSL сертификата от Let's Encrypt...${NC}"
echo "Введите email для уведомлений Let's Encrypt:"
read -p "Email: " EMAIL

certbot --nginx -d meat-bot.fluttrium.com --email "$EMAIL" --agree-tos --no-eff-email --redirect

# 7. Копирование финального конфига с SSL
echo -e "${YELLOW}📝 Шаг 7: Применение финального конфига...${NC}"
# Certbot уже настроил SSL, просто перезагрузим
systemctl reload nginx

# 8. Настройка автообновления сертификата
echo -e "${YELLOW}🔄 Шаг 8: Настройка автообновления сертификата...${NC}"
systemctl enable certbot.timer
systemctl start certbot.timer

echo ""
echo -e "${GREEN}✅ Готово! Nginx настроен с SSL сертификатом${NC}"
echo -e "${GREEN}🌐 Сайт доступен по адресу: https://meat-bot.fluttrium.com${NC}"
echo ""
echo "Полезные команды:"
echo "  - Проверка статуса Nginx: systemctl status nginx"
echo "  - Перезагрузка конфига: nginx -t && systemctl reload nginx"
echo "  - Проверка сертификата: certbot certificates"
echo "  - Обновление сертификата: certbot renew"
echo "  - Логи Nginx: tail -f /var/log/nginx/access.log"
