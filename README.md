# 📦 PackFlow v2.0

**Intelligent Production & Packaging Management System**

[![Next.js](https://img.shields.io/badge/Next.js-14.x-000000?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.x-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 🎯 Overview

PackFlow is an **MVP** designed for **Marba Sp. z o.o.** , a packaging plant in Zielona Góra, Poland. The system optimizes manufacturing operations through real-time monitoring, maintenance management, and production tracking for products like laundry soaps, dishwasher tablets, and descaling agents.

### ✨ Key Features

| Feature | Description |
|---------|-------------|
| 📊 **Dashboard** | Role-based real-time KPIs with machine status cards |
| 🤖 **AI Assistant** | Simulated diagnostic assistant with predefined solutions |
| 🔧 **Maintenance** | Preventive, corrective & emergency work orders |
| 📦 **Pallet Tracking** | Production progress from start to dispatch |
| 🚨 **Alerts & Incidents** | Severity-based escalation system |
| 👥 **Staff Management** | Roles, ratings, incidents, and machine assignments |
| 📈 **KPIs & Analytics** | OEE tracking, production trends, shift analysis |
| 📋 **Product Cards** | Per-machine product configurations |
| 🌐 **Multi-language** | English 🇺🇸 · Polski 🇵🇱 · Español 🇪🇸 |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Database** | PostgreSQL + Prisma ORM |
| **Auth** | NextAuth.js (JWT) |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **State** | Zustand + Jotai |
| **Forms** | React Hook Form + Zod |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+ (recommended v20)
- **Yarn** (`npm install -g yarn`)
- **PostgreSQL** 15+ (or SQLite for local dev)

### Installation

```bash
# Clone the repository
git clone https://github.com/andresfergarcia/packflow.git
cd packflow/nextjs_space

# Install dependencies
yarn install

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials
```

### Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/packflow_db"
NEXTAUTH_SECRET="your-generated-secret"
NEXTAUTH_URL="http://localhost:3000"
```

> 💡 Generate a secure secret: `openssl rand -base64 32`

### Database Setup

```bash
# Generate Prisma client
yarn prisma generate

# Sync database schema
yarn prisma db push

# (Optional) Seed with sample data
yarn prisma db seed
```

### Run the App

```bash
# Development server
yarn dev
# → http://localhost:3000

# Production build
yarn build && yarn start
```

---

## 🧪 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| 👑 Plant Director | `director@marba.pl` | `director123` |
| 👨‍👩‍👦 Team Leader | `leader1@marba.pl` | `leader123` |
| 🔧 Operator | `operator1@marba.pl` | `operator123` |
| ⚙️ Mechanic | `mechanic1@marba.pl` | `mechanic123` |

---

## 📁 Project Structure

```
nextjs_space/
├── app/
│   ├── api/                  # REST API routes
│   ├── dashboard/            # Dashboard pages
│   └── login/                # Authentication
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── dashboard/            # Dashboard widgets
│   └── layouts/              # Layout components
├── lib/
│   ├── auth.ts               # NextAuth configuration
│   ├── db.ts                 # Prisma client
│   └── i18n/                 # Translations (EN/PL/ES)
├── prisma/
│   └── schema.prisma         # Data models
├── hooks/                    # Custom React hooks
├── types/                    # TypeScript types
└── scripts/                  # Seed scripts
```

---

## 📖 Full Documentation

For detailed deployment instructions, architecture overview, and troubleshooting, see the **[PACKFLOW_GUIDE.md](./PACKFLOW_GUIDE.md)**.

---

## 📄 License

This project is developed for **Marba Sp. z o.o.** All rights reserved.

---

## 👤 Author

**Andres Fernando Garcia**  
📍 Zielona Góra, Poland  
📅 Version 2.0.1 — March 2025
