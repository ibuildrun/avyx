<div align="center">

# AVYX

**Telegram Mini App для дизайнеров и художников**

[![Open in Telegram](https://img.shields.io/badge/Open%20App-Telegram-0088cc?style=for-the-badge&logo=telegram)](https://t.me/anyx_robot)
[![Demo](https://img.shields.io/badge/Demo-GitHub%20Pages-222?style=for-the-badge&logo=github)](https://ibuildrun.github.io/avyx/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![CI](https://github.com/ibuildrun/avyx/actions/workflows/ci.yml/badge.svg)](https://github.com/ibuildrun/avyx/actions/workflows/ci.yml)
[![Deploy](https://github.com/ibuildrun/avyx/actions/workflows/deploy.yml/badge.svg)](https://github.com/ibuildrun/avyx/actions/workflows/deploy.yml)
[![Release](https://img.shields.io/github/v/release/ibuildrun/avyx?include_prereleases)](https://github.com/ibuildrun/avyx/releases)

[Русский](#о-проекте) | [English](#about)

</div>

---

## О проекте

AVYX — маркетплейс заказов для дизайнеров с геймификацией. Находи заказы, зарабатывай и расти через систему миссий и достижений.

### Возможности

- Маркетплейс заказов — UI/UX, логотипы, иллюстрации, графика
- Геймификация — XP, уровни, бейджи, стрики
- Спринты — ежедневные творческие челленджи
- Эскроу — безопасные сделки через Telegram Stars
- Telegram Stars — оплата внутри приложения

### Типы пользователей

| Тип | Описание |
|-----|----------|
| Designer | Исполнители заказов |
| Entrepreneur | Частные заказчики |
| Company | Компании |

### Быстрый старт

```bash
# Клонировать
git clone https://github.com/ibuildrun/avyx.git
cd avyx

# Frontend
npm install
npm run dev

# Backend
cd backend
npm install
npm run dev
```

### Docker

```bash
# Production
docker-compose up

# Development
docker-compose --profile dev up
```

### Тестирование в Telegram

```bash
# HTTPS туннель
tuna http 3000
```

### Технологии

| Frontend | Backend |
|----------|---------|
| React 19 | Node.js + Express |
| TypeScript 5.8 | SQLite |
| Vite 6 | Telegram Bot API |
| Tailwind CSS | Telegram Stars |
| @tma.js/sdk-react | |

---

## About

AVYX is a gamified marketplace for designers. Find orders, earn money, and grow through missions and achievements.

### Features

- Order Marketplace — UI/UX, logos, illustrations, graphics
- Gamification — XP, levels, badges, streaks
- Sprints — daily creative challenges
- Escrow — secure deals via Telegram Stars
- Telegram Stars — in-app payments

### User Types

| Type | Description |
|------|-------------|
| Designer | Order executors |
| Entrepreneur | Individual clients |
| Company | Business clients |

### Quick Start

```bash
# Clone
git clone https://github.com/ibuildrun/avyx.git
cd avyx

# Frontend
npm install
npm run dev

# Backend
cd backend
npm install
npm run dev
```

### Docker

```bash
# Production
docker-compose up

# Development
docker-compose --profile dev up
```

### Testing in Telegram

```bash
# HTTPS tunnel
tuna http 3000
```

### Tech Stack

| Frontend | Backend |
|----------|---------|
| React 19 | Node.js + Express |
| TypeScript 5.8 | SQLite |
| Vite 6 | Telegram Bot API |
| Tailwind CSS | Telegram Stars |
| @tma.js/sdk-react | |

---

## Project Structure

```
avyx/
├── src/                    # Frontend source
│   ├── api/                # API client
│   ├── components/         # UI components
│   ├── providers/          # Telegram SDK
│   └── screens/            # App screens
├── backend/                # Backend source
│   ├── src/
│   │   ├── api/            # REST API
│   │   ├── bot/            # Telegram bot
│   │   ├── auth/           # Auth middleware
│   │   └── db/             # SQLite database
│   └── Dockerfile
├── docker-compose.yml
└── Dockerfile
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run type-check` | TypeScript check |
| `cd backend && npm run dev` | Start backend |

## License

MIT — see [LICENSE](LICENSE)

---

<div align="center">

**[Open AVYX in Telegram](https://t.me/anyx_robot)** | **[Demo](https://ibuildrun.github.io/avyx/)**

</div>
