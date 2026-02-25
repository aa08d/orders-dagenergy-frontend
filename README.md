# Orders — система договоров

Full-stack проект: **React + TypeScript** (Vite, FSD) + **Django + DRF** backend + **PostgreSQL** + **Nginx**.

## Структура

```
orders/
├── front/          # React-приложение (Vite)
├── backend/        # Django + DRF
├── nginx/
│   └── default.conf   # Reverse-proxy конфиг
├── docker-compose.yml
└── .env.example
```

## Быстрый старт

```bash
# 1. Скопируй переменные окружения
cp .env.example .env
# Отредактируй .env — смени пароли и SECRET_KEY в продакшене!

# 2. Собери и запусти все сервисы
docker compose up --build -d

# 3. Открой браузер
open http://localhost
```

При первом запуске `entrypoint.sh` автоматически:
- Дождётся готовности PostgreSQL
- Применит миграции (`migrate`)
- Создаст тестовые отделения и сотрудников (`seed_data`)
- Соберёт статику Django (`collectstatic`)

## Тестовые учётные данные

| Логин    | Пароль      | Роль          | Отделение       |
|----------|-------------|---------------|-----------------|
| admin    | admin123    | Администратор | Махачкалинское  |
| manager  | manager123  | Менеджер      | Махачкалинское  |
| ivanov   | ivanov123   | Менеджер      | Дербентское     |
| kozlova  | kozlova123  | Специалист    | Дербентское     |
| novikov  | novikov123  | Специалист    | Каспийское      |
| petrov   | petrov123   | Менеджер      | Каспийское      |
| sidorov  | sidorov123  | Специалист    | Хасавюртовское  |

## API

| Метод | Endpoint                           | Описание                  |
|-------|------------------------------------|---------------------------|
| POST  | `/api/auth/login/`                 | Авторизация (JWT)         |
| POST  | `/api/auth/refresh/`               | Обновление токена         |
| GET   | `/api/auth/me/`                    | Текущий пользователь      |
| GET   | `/api/departments/`                | Список отделений          |
| GET   | `/api/contracts/`                  | Список договоров          |
| POST  | `/api/contracts/`                  | Создать договор           |
| GET   | `/api/contracts/{id}/`             | Договор по ID             |
| PATCH | `/api/contracts/{id}/`             | Обновить договор          |
| DEL   | `/api/contracts/{id}/`             | Удалить договор           |
| GET   | `/api/contracts/stats/?year=&month=` | Статистика              |

**Фильтры для GET `/api/contracts/`:**
- `search` — поиск по имени / адресу / ответственному
- `status` — статус договора
- `consumer_type` — тип потребителя
- `consumer_category` — категория
- `tasks=1` — только активные (В работе / Согласование)
- `page` — пагинация (10 записей на страницу)

## Django Admin

`http://localhost/admin/` — войти как `admin / admin123`

## Разработка (без Docker)

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
# Настрой .env с локальным Postgres
python manage.py migrate
python manage.py seed_data
python manage.py runserver
```

```bash
cd front
yarn install
yarn dev   # http://localhost:5173 (проксирует /api на 8000)
```
