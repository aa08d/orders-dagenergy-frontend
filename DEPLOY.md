# Деплой на сервер 45.147.176.51

## Что уже настроено в этом архиве
- `.env` — прописан IP сервера
- `backend/config/settings.py` — добавлен `CSRF_TRUSTED_ORIGINS` (нужен для Django-админки)
- `docker-compose.yml` — переменная `CSRF_TRUSTED_ORIGINS` передаётся в контейнер

---

## 1. Подключиться к серверу

```bash
ssh root@45.147.176.51
```

---

## 2. Установить Docker и Docker Compose (если не установлены)

```bash
apt update && apt install -y docker.io docker-compose-plugin
systemctl enable --now docker
```

Проверить:
```bash
docker --version
docker compose version
```

---

## 3. Закинуть проект на сервер

С локальной машины (в папке где лежит `orders.zip`):
```bash
scp orders.zip root@45.147.176.51:/opt/
```

На сервере:
```bash
cd /opt
unzip orders.zip
cd orders
```

---

## 4. Создать суперпользователя для Django-админки

Сначала запустить контейнеры:
```bash
docker compose up -d --build
```

Подождать ~30 секунд пока поднимется backend, затем:
```bash
docker compose exec backend python manage.py createsuperuser
```

Заполнить: username, email, password.

---

## 5. Проверить что всё работает

| Что | URL |
|-----|-----|
| Фронтенд | http://45.147.176.51 |
| Django-админка | http://45.147.176.51/admin/ |
| API (пример) | http://45.147.176.51/api/auth/login/ |

---

## 6. Полезные команды

```bash
# Посмотреть статус контейнеров
docker compose ps

# Логи всех сервисов
docker compose logs -f

# Логи только backend
docker compose logs -f backend

# Перезапустить
docker compose restart

# Остановить
docker compose down

# Пересобрать после изменений кода
docker compose up -d --build
```

---

## Архитектура

```
Браузер → Nginx :80
              ├── /api/*        → Django (Gunicorn :8000)
              ├── /admin/*      → Django (Gunicorn :8000)
              ├── /django-static/* → Django (Whitenoise)
              ├── /media/*      → shared volume (файлы напрямую)
              └── /*            → React (Nginx :80 внутри контейнера)
```
