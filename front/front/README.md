# ДагЭнерджи — Управление договорами

React + TypeScript + Vite фронтенд. Архитектура FSD.

---

## Локальная разработка

```bash
yarn install
yarn dev
```

Приложение запустится на http://localhost:5173

**Учётные данные для входа:**

| Логин      | Пароль       | Роль           | Отделение         |
|------------|--------------|----------------|-------------------|
| `admin`    | `admin123`   | Администратор  | Махачкала (видит всё) |
| `manager`  | `manager123` | Менеджер       | Махачкала         |
| `ivanov`   | `ivanov123`  | Менеджер       | Дербент           |
| `kozlova`  | `kozlova123` | Специалист     | Дербент           |
| `novikov`  | `novikov123` | Специалист     | Каспийск          |
| `petrov`   | `petrov123`  | Менеджер       | Каспийск          |
| `sidorov`  | `sidorov123` | Специалист     | Хасавюрт          |

---

## Docker (production)

### Вариант 1 — docker compose (рекомендуется)

```bash
docker compose up -d --build
```

Приложение будет доступно на http://localhost:80

### Вариант 2 — вручную

```bash
# Сборка образа
docker build -t energy-app .

# Запуск контейнера
docker run -d -p 80:80 --name energy-app --restart unless-stopped energy-app
```

### Остановка

```bash
docker compose down
# или
docker stop energy-app && docker rm energy-app
```

---

## Структура проекта (FSD)

```
src/
├── app/          # Провайдеры, роутер, глобальные стили
├── pages/        # Страницы: contracts, tasks, stats, login
├── widgets/      # Составные блоки: ContractsTable, AddContractModal, ContractDetailModal, EditContractModal
├── features/     # Фичи: auth, theme-toggle
└── shared/       # Типы, моки, UI-компоненты (Icon, StatusBadge, Pagination)
```
