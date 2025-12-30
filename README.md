# AVYX — Telegram Web App для дизайнеров

<div align="center">
  <img src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" alt="AVYX Banner" width="100%" />
  
  **Креативная платформа для дизайнеров и художников**
  
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
  [![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)
  [![React](https://img.shields.io/badge/react-19.x-61dafb.svg)](https://reactjs.org)
  [![Telegram](https://img.shields.io/badge/telegram-web%20app-0088cc.svg)](https://core.telegram.org/bots/webapps)
</div>

## О проекте

AVYX — Telegram Mini App где дизайнеры находят заказы, зарабатывают и растут через систему миссий и достижений.

### Возможности

- 🎨 **Маркетплейс заказов** — UI/UX, логотипы, иллюстрации, графика
- 🏆 **Система достижений** — бейджи, уровни, XP
- ⚡ **Спринты** — ежедневные творческие челленджи
- 🛡️ **Эскроу** — безопасные сделки

## Быстрый старт

### Требования

- Node.js >= 18.0.0
- Docker & Docker Compose

### Локальная разработка

```bash
# Клонировать репозиторий
git clone https://github.com/ibuildrun/avyx.git
cd avyx

# Установить зависимости
npm install

# Запустить dev-сервер
npm run dev
```

**Локальный URL:** http://localhost:3000

### Docker

```bash
# Production сборка
docker-compose up web

# Development с hot reload
docker-compose --profile dev up web-dev
```

**Docker URL:** http://localhost:3000

### Тестирование в Telegram

Для теста в Telegram нужен HTTPS:

```bash
# Через tuna
tuna http 3000
```

Полученный HTTPS URL указать в BotFather при создании Web App.

## Структура проекта

```
src/
├── api/            # API абстракция (mock → backend)
├── providers/      # TelegramProvider (SDK интеграция)
├── components/     # UI компоненты
├── screens/        # Экраны приложения
└── _legacy/        # Бэкап оригинального дизайна
```

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | Dev-сервер (localhost:3000) |
| `npm run build` | Production сборка |
| `npm run preview` | Превью сборки |
| `npm run type-check` | Проверка TypeScript |

## Технологии

- **React 19** + **TypeScript 5.8**
- **Vite 6** — сборка
- **Tailwind CSS** — стили
- **@tma.js/sdk-react** — Telegram Web App SDK
- **Docker** + **nginx** — деплой

## Лицензия

MIT — см. [LICENSE](LICENSE)

---

<div align="center">
  Made with ❤️ by AVYX Team
</div>
