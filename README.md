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
- 🤖 **AI-ассистент** — советы от Gemini AI
- 🛡️ **Эскроу** — безопасные сделки

## Быстрый старт

### Требования

- Node.js >= 18.0.0
- Docker & Docker Compose (для контейнеризации)

### Локальная разработка

```bash
# Клонировать репозиторий
git clone https://github.com/ibuildrun/avyx.git
cd avyx

# Установить зависимости
npm install

# Настроить переменные окружения
cp .env.local.example .env.local
# Добавить GEMINI_API_KEY в .env.local

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

Для теста в Telegram нужен HTTPS. Варианты:

1. **ngrok** (быстро для теста):
   ```bash
   ngrok http 3000
   ```
   Использовать полученный `https://xxx.ngrok.io` URL в BotFather

2. **Деплой** на Vercel/Netlify/VPS с SSL

## Структура проекта

```
src/
├── api/            # API абстракция (mock → backend)
├── providers/      # TelegramProvider (SDK интеграция)
├── components/     # UI компоненты
├── screens/        # Экраны приложения
├── services/       # Gemini AI
└── _legacy/        # Бэкап оригинального дизайна
```

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | Dev-сервер (localhost:3000) |
| `npm run build` | Production сборка |
| `npm run preview` | Превью сборки |
| `npm run type-check` | Проверка TypeScript |
| `npm run lint` | ESLint |

## Технологии

- **React 19** + **TypeScript 5.8**
- **Vite 6** — сборка
- **Tailwind CSS** — стили
- **@tma.js/sdk-react** — Telegram Web App SDK
- **Google Gemini AI** — AI-фичи
- **Docker** + **nginx** — деплой

## Переменные окружения

```env
GEMINI_API_KEY=your_api_key_here
VITE_API_URL=https://api.example.com  # будущий бекенд
```

## Roadmap

- [x] MVP фронтенд (Telegram Web App)
- [x] Docker контейнеризация
- [ ] Backend API (Go/Node)
- [ ] PostgreSQL + Redis
- [ ] Платежи через Telegram Stars
- [ ] Push-уведомления

## Лицензия

MIT — см. [LICENSE](LICENSE)

---

<div align="center">
  Made with ❤️ by AVYX Team
</div>
