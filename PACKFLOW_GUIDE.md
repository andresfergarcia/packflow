# 📘 PackFlow v2.0 MVP — Deployment & Usage Guide
## Intelligent Production & Packaging Management System
### Marba Sp. z o.o. · Zielona Góra, Poland

---

## 📑 Table of Contents

1. [Overview](#1-overview)
2. [System Architecture](#2-system-architecture)
3. [Roles & Permissions](#3-roles--permissions)
4. [Implemented Modules](#4-implemented-modules)
5. [Recent Updates](#5-recent-updates)
6. [Technology Stack](#6-technology-stack)
7. [Project Structure](#7-project-structure)
8. [Environment Variables](#8-environment-variables)
9. [VPS Deployment (Hostinger)](#9-vps-deployment-hostinger)
10. [Database Setup](#10-database-setup)
11. [Subdomain Configuration](#11-subdomain-configuration)
12. [GitHub → VPS Workflow](#12-github--vps-workflow)
13. [Useful Commands](#13-useful-commands)
14. [Test Credentials](#14-test-credentials)
15. [Internationalization (i18n)](#15-internationalization-i18n)
16. [Troubleshooting](#16-troubleshooting)
17. [Roadmap](#17-roadmap)

---

## 1. Overview

**PackFlow v2.0** is an MVP (Minimum Viable Product) of an intelligent production and packaging management system, designed specifically for **Marba Sp. z o.o.** packaging plant in Zielona Góra, Poland.

### Main Objective
Optimize packaging operations for Marba's manufactured products (laundry soaps, dishwasher tablets, descaling agents, toilet tablets) through:

- 📊 Real-time monitoring of 10+ machines
- 🔧 Preventive and corrective maintenance management
- 📦 Pallet and production tracking
- 🚨 Alert and escalation system
- 📋 Digital product cards
- 📈 Automatic KPIs and reports
- 🤖 AI-powered diagnostic assistant (simulated)
- 👥 Complete staff management with assignments, ratings and incidents

### Value Proposition
> Reduce machine downtime by 40%, improve production traceability to 100%, and provide role-specific tools in a single unified platform.

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────┐
│              FRONTEND (Next.js 14)               │
│    PWA · React · Tailwind CSS · TypeScript      │
│    Dashboard · Forms · Charts · i18n            │
└──────────────────────┬──────────────────────────┘
                       │ API Routes
┌──────────────────────▼──────────────────────────┐
│              BACKEND (Next.js API)               │
│   NextAuth · Prisma ORM · bcryptjs              │
│   REST APIs · Server-Side Rendering             │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│           DATABASE (PostgreSQL)                  │
│   Users · Machines · Products · Incidents       │
│   Pallets · Alerts · Maintenance · Processes    │
│   StaffAssignments · Ratings · StaffIncidents   │
└─────────────────────────────────────────────────┘
```

---

## 3. Roles & Permissions

The system implements **4 roles** with differentiated access:

| Role | Code | Description | Access |
|------|------|-------------|--------|
| **Plant Director** | `PLANT_DIRECTOR` | Global supervision | Dashboard, KPIs, Analytics, Reports, Incidents, Staff, Products, Processes, Machines |
| **Team Leader** | `TEAM_LEADER` | Shift management | Dashboard, Pallets, Products, Incidents, Staff, Alerts, Add Product |
| **Operator** | `OPERATOR` | Plant operation | Dashboard, Pallets, Products, Printer, Waste, Machine Config |
| **Mechanic** | `MECHANIC` | Maintenance | Dashboard, Machines, Incidents, Maintenance, Alerts |

---

## 4. Implemented Modules

### 4.1 Main Dashboard (`/dashboard`)
- Role-based personalized view
- Real-time KPIs: active machines, average OEE, production, alerts
- Machine status cards with color indicators
- Active alert banner

### 4.2 KPIs & OEE (`/dashboard/kpis`)
- Plant-wide average OEE with 85% target line
- Per-machine KPIs: production progress, uptime
- Interactive OEE chart per machine (Recharts)
- **Access**: Director

### 4.3 Analytics (`/dashboard/analytics`)
- 7-day production trend
- Per-machine performance comparison
- Shift productivity analysis
- Interactive Recharts charts
- **Access**: Director

### 4.4 Products (`/dashboard/products`)
- Search by name/SKU
- Product cards with per-machine configurations
- Parameters: printer, glue, nozzle
- **Access**: All roles (read), Director/Leader (edit)

### 4.5 Incidents (`/dashboard/incidents`)
- Status filters: OPEN, IN_PROGRESS, ESCALATED, RESOLVED
- Modal for reporting new incidents
- Resolution tracking with timestamps
- **Access**: All roles

### 4.6 Alerts (`/dashboard/alerts`)
- Status filter: ALL, ACTIVE, ACKNOWLEDGED, RESOLVED
- Severity badges with colors
- Actions: acknowledge, escalate
- **Access**: Director, Leader, Mechanic

### 4.7 Pallets (`/dashboard/pallets`)
- Pallet status: In Progress, Completed, Dispatched
- Production progress bars
- Machine/product association
- **Access**: Leader, Operator

### 4.8 Staff Management (`/dashboard/staff`)
- **Staff list** with expandable detail cards
- **Staff filtering tabs**: All, Operators, Team Leaders, Mechanics, Agencies
- **Add Staff form**: name, email, password, role, phone, agency, position, skills
- **Add Agency form**: agency name, contact info, notes
- **Machine assignment**: select machine + shift per staff member
- **Rating system**: 1-5 star ratings with strengths/notes
- **Staff Incidents**: per-person incident tracking with severity and resolution
- **Toggle active/inactive**: enable or disable staff accounts
- **Access**: Director, Team Leader

### 4.9 Waste (`/dashboard/waste`)
- Waste registration by category/machine
- Bar chart of waste by machine
- Total waste quantity
- **Access**: Leader, Operator

### 4.10 Hitachi Printer (`/dashboard/printer`)
- Per-machine configuration: date format, speed, ink type
- Printer status indicators
- Real-time save
- **Access**: Operator

### 4.11 AI Assistant (`/dashboard/ai-assistant`)
- Text/photo input (simulated)
- Predefined diagnostic steps
- Machine-specific suggested solution
- Urgency level badges
- **Access**: All

### 4.12 Reports (`/dashboard/reports`)
- 4 simulated report types (PDF/Excel)
- Preview with machine statistics
- Recent reports list
- **Access**: Director

### 4.13 Maintenance (`/dashboard/maintenance`)
- Full CRUD for maintenance reports
- Types: Preventive, Corrective, Emergency (color badges)
- Fields: machine, description, parts changed, time invested
- Type filters
- **Access**: Mechanic

### 4.14 Add Machine (`/dashboard/add-machine`)
- Form: name, location, serial, capacity, OEE target
- **Access**: Mechanic, Operator

### 4.15 Add Product (`/dashboard/add-product`)
- Form: name, SKU, description, unit of measure
- **Access**: Leader, Director

### 4.16 Processes (`/dashboard/processes`)
- Full CRUD: create, edit, activate/deactivate
- Fields: name, description, duration
- **Access**: Director

### 4.17 Machine Config (`/dashboard/machine-config`)
- Select machine + product → configuration
- Parameters: dimensions, nozzle, glue, printer, film, box
- Upsert system (create or update existing config)
- **Access**: Operator

---

## 5. Recent Updates

### v2.0.1 — Staff Management Enhancement
- 🆕 **Redesigned Staff page** (`/dashboard/staff`) with accordion-style expandable cards
- 🆕 **Staff filtering tabs**: All, Operators, Team Leaders, Mechanics, Agencies
- 🆕 **Add Staff form**: name, email, password, role, phone, agency, position, skills
- 🆕 **Add Agency form**: create staffing agencies with contact info
- 🆕 **Machine assignment**: assign staff to machines by shift
- 🆕 **Rating system**: 1-5 star ratings per staff member with comments
- 🆕 **Staff Incidents**: per-person incident tracking with severity levels
- 🆕 **Activate/Deactivate**: toggle staff accounts on/off
- 🆕 **Agencies tab**: list view of all agencies with employee counts

### v2.0.0 — Initial MVP
- All core modules (dashboard, KPIs, products, incidents, alerts, pallets, etc.)
- Authentication with NextAuth
- 3-language i18n (English, Polish, Spanish)
- Role-based access control
- PostgreSQL database with Prisma ORM

---

## 6. Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Framework | Next.js | 14.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 3.x |
| UI Components | shadcn/ui | — |
| ORM | Prisma | 5.x |
| Database | PostgreSQL | 15+ |
| Auth | NextAuth.js | 4.x |
| Charts | Recharts | 2.x |
| Icons | Lucide React | — |
| Notifications | Sonner (toast) | — |
| Password Hashing | bcryptjs | — |

---

## 7. Project Structure

```
packflow_mvp/
└── nextjs_space/
    ├── app/
    │   ├── api/                    # API Routes
    │   │   ├── agencies/route.ts           # 🆕 v2.0.1
    │   │   ├── alerts/route.ts
    │   │   ├── auth/[...nextauth]/route.ts
    │   │   ├── incidents/route.ts
    │   │   ├── machines/route.ts
    │   │   ├── maintenance/route.ts
    │   │   ├── pallets/route.ts
    │   │   ├── printer/route.ts
    │   │   ├── processes/route.ts
    │   │   ├── product-cards/route.ts
    │   │   ├── production-logs/route.ts
    │   │   ├── products/route.ts
    │   │   ├── signup/route.ts
    │   │   ├── staff/
    │   │   │   ├── route.ts                # 🆕 v2.0.1
    │   │   │   ├── incidents/route.ts      # 🆕 v2.0.1
    │   │   │   └── ratings/route.ts        # 🆕 v2.0.1
    │   │   ├── stats/route.ts
    │   │   └── waste/route.ts
    │   ├── dashboard/              # Dashboard Pages
    │   │   ├── add-machine/
    │   │   ├── add-product/
    │   │   ├── ai-assistant/
    │   │   ├── alerts/
    │   │   ├── analytics/
    │   │   ├── incidents/
    │   │   ├── kpis/
    │   │   ├── machine-config/
    │   │   ├── maintenance/
    │   │   ├── pallets/
    │   │   ├── printer/
    │   │   ├── processes/
    │   │   ├── products/
    │   │   ├── reports/
    │   │   ├── staff/
    │   │   │   ├── page.tsx
    │   │   │   └── staff-content.tsx        # 🆕 v2.0.1
    │   │   └── waste/
    │   ├── login/
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    ├── components/
    │   ├── dashboard/
    │   │   ├── dashboard-shell.tsx
    │   │   ├── stat-card.tsx
    │   │   └── machine-card.tsx
    │   ├── ui/                     # shadcn/ui components
    │   └── language-selector.tsx
    ├── hooks/
    │   └── use-fetch.ts
    ├── lib/
    │   ├── auth.ts                 # NextAuth config
    │   ├── db.ts                   # Prisma client
    │   ├── i18n/
    │   │   ├── translations.ts     # EN/PL/ES
    │   │   └── i18n-context.tsx
    │   └── utils.ts
    ├── prisma/
    │   └── schema.prisma           # Data models
    ├── scripts/
    │   └── seed.ts                 # Example data
    ├── .env                        # Environment variables
    ├── next.config.js
    ├── tailwind.config.ts
    ├── tsconfig.json
    └── package.json
```

---

## 8. Environment Variables

Create a `.env` file in `nextjs_space/` root:

```env
# PostgreSQL Database
DATABASE_URL="postgresql://user:password@host:5432/db_name?connect_timeout=15"

# NextAuth
NEXTAUTH_SECRET="your-secure-secret-generated-with-openssl"
NEXTAUTH_URL="https://your-subdomain.yourdomain.com"
```

### Generate NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```

---

## 9. VPS Deployment (Hostinger)

### 9.1 VPS Requirements
- **OS**: Ubuntu 22.04 LTS or higher
- **RAM**: Minimum 2 GB (recommended 4 GB)
- **CPU**: 2 vCPUs minimum
- **Disk**: 20 GB SSD minimum
- **Node.js**: v18.x or v20.x
- **PostgreSQL**: 15+ (local or external service)

### 9.2 VPS Initial Setup

```bash
# Connect to VPS
ssh root@your-vps-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Yarn
npm install -g yarn

# Install PM2 (process manager)
npm install -g pm2

# Install Nginx (reverse proxy)
sudo apt install -y nginx

# Install PostgreSQL (optional, for local DB)
sudo apt install -y postgresql postgresql-contrib
```

### 9.3 Configure PostgreSQL (if local)

```bash
# Create user and database
sudo -u postgres psql

CREATE USER packflow WITH PASSWORD 'your_secure_password';
CREATE DATABASE packflow_db OWNER packflow;
GRANT ALL PRIVILEGES ON DATABASE packflow_db TO packflow;
\q
```

### 9.4 Deploy Application

```bash
# Clone repository
cd /var/www
git clone https://github.com/your-user/packflow.git
cd packflow/nextjs_space

# Install dependencies
yarn install

# Create .env file
nano .env
# (Paste environment variables from section 8)

# Generate Prisma client
yarn prisma generate

# Sync schema with database
yarn prisma db push

# Run seed (example data)
yarn prisma db seed

# Build the application
yarn build

# Start with PM2
pm2 start yarn --name "packflow" -- start
pm2 save
pm2 startup
```

### 9.5 Configure Nginx as Reverse Proxy

```nginx
# /etc/nginx/sites-available/packflow
server {
    listen 80;
    server_name your-subdomain.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable configuration
sudo ln -s /etc/nginx/sites-available/packflow /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 9.6 SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-subdomain.yourdomain.com

# Auto-renewal (cron)
sudo certbot renew --dry-run
```

---

## 10. Database Setup

### Main Models (Prisma Schema)

| Model | Description | Key Fields |
|-------|-------------|------------|
| `User` | System users | name, email, password, role, shift, isActive |
| `Machine` | Plant machines | name, location, serialNumber, status, currentOee |
| `Product` | Products | name, sku, description, unitOfMeasure |
| `ProductCard` | Product-machine config | dimensions, nozzleType, glueAmount, printerPos |
| `Pallet` | Pallet tracking | status, quantity, targetQuantity |
| `Incident` | Incidents | severity, status, description, machineId |
| `Alert` | System alerts | type, severity, status, machineId |
| `WasteEntry` | Waste records | category, quantity, reason |
| `ProductionLog` | Production logs | produced, target, shift, date |
| `PrinterConfig` | Printer config | dateFormat, printSpeed, inkType |
| `MaintenanceReport` | Maintenance reports | type, description, partsChanged, timeInvested |
| `Process` | Production processes | name, description, duration, isActive |
| `Agency` | 🆕 Staffing agencies | name, contactName, contactEmail, contactPhone |
| `StaffAssignment` | Operator-machine assignment | userId, machineId, shift |
| `Rating` | 🆕 Staff ratings | userId, score, strengths, notes |
| `StaffIncident` | 🆕 Staff incidents | userId, title, description, severity, resolved |
| `Report` | Generated reports | title, type, period, data |

### Enums
- **Role**: `OPERATOR`, `TEAM_LEADER`, `PLANT_DIRECTOR`, `MECHANIC`
- **MachineStatus**: `RUNNING`, `STOPPED`, `MAINTENANCE`, `IDLE`
- **MaintenanceType**: `REPAIR`, `PREVENTIVE`, `PART_CHANGE`, `INSPECTION`, `EMERGENCY`
- **AlertSeverity**: `CRITICAL`, `WARNING`, `INFO`
- **AlertStatus**: `ACTIVE`, `ACKNOWLEDGED`, `RESOLVED`
- **IncidentStatus**: `OPEN`, `IN_PROGRESS`, `RESOLVED`, `ESCALATED`
- **IncidentPriority**: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`
- **PalletStatus**: `IN_PROGRESS`, `COMPLETED`, `DISPATCHED`
- **ShiftType**: `MORNING`, `AFTERNOON`, `NIGHT`

---

## 11. Subdomain Configuration

### In Hostinger (Control Panel)

1. Go to **Domains** → Your domain → **DNS / Nameservers**
2. Add **A** record:
   - **Type**: A
   - **Name**: `packflow` (or your desired subdomain)
   - **Value**: Your VPS IP address
   - **TTL**: 14400
3. Wait for DNS propagation (may take up to 24-48h, usually minutes)

### Verify propagation
```bash
dig packflow.yourdomain.com +short
# Should show your VPS IP

nslookup packflow.yourdomain.com
```

---

## 12. GitHub → VPS Workflow

### 12.1 Manual Workflow

```bash
# On your local machine (after making changes)
git add .
git commit -m "Description of changes"
git push origin main

# On the VPS
cd /var/www/packflow
git pull origin main
cd nextjs_space
yarn install
yarn prisma generate
yarn build
pm2 restart packflow
```

### 12.2 Automated Deploy (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to VPS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /var/www/packflow
            git pull origin main
            cd nextjs_space
            yarn install
            yarn prisma generate
            yarn prisma db push
            yarn build
            pm2 restart packflow
```

**Configure GitHub Secrets**:
- `VPS_HOST`: Your VPS IP
- `VPS_USER`: SSH user (e.g., `root`)
- `VPS_SSH_KEY`: Private SSH key

---

## 13. Useful Commands

### Development
```bash
yarn dev                    # Development server (port 3000)
yarn build                  # Production build
yarn start                  # Start in production mode
```

### Database
```bash
yarn prisma generate        # Generate Prisma client
yarn prisma db push         # Sync database schema
yarn prisma db seed         # Run example data seed
yarn prisma studio          # GUI to explore data
```

### PM2 (on VPS)
```bash
pm2 list                    # List processes
pm2 logs packflow           # View real-time logs
pm2 restart packflow        # Restart app
pm2 stop packflow           # Stop app
pm2 monit                   # Resource monitor
```

### Nginx
```bash
sudo nginx -t               # Verify configuration
sudo systemctl restart nginx # Restart Nginx
sudo tail -f /var/log/nginx/error.log  # View errors
```

---

## 14. Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Plant Director | director@marba.pl | director123 |
| Team Leader | leader1@marba.pl | leader123 |
| Operator | operator1@marba.pl | operator123 |
| Mechanic | mechanic1@marba.pl | mechanic123 |

**Additional users available**:
- `leader2@marba.pl`, `leader3@marba.pl` (leaders)
- `operator2@marba.pl` ... `operator6@marba.pl` (operators)
- `mechanic2@marba.pl` ... `mechanic6@marba.pl` (mechanics)

> ⚠️ **Important**: Change all passwords before going to production.

---

## 15. Internationalization (i18n)

The system supports **3 languages**:

| Language | Code | Flag |
|----------|------|------|
| English | `en` | 🇺🇸 |
| Polski | `pl` | 🇵🇱 |
| Español | `es` | 🇪🇸 |

The language selector is available at:
- Login page
- Dashboard sidebar

To add translations: edit `lib/i18n/translations.ts`

---

## 16. Troubleshooting

### Error: "ECONNREFUSED" connecting to database
- Verify PostgreSQL is running: `sudo systemctl status postgresql`
- Check `DATABASE_URL` in `.env`
- If using remote DB, verify firewall allows port 5432

### Error: "NEXTAUTH_SECRET is not set"
- Generate a secret: `openssl rand -base64 32`
- Add to `.env`: `NEXTAUTH_SECRET="your-secret"`

### App doesn't load after `yarn build`
- Check logs: `pm2 logs packflow`
- Ensure `NEXTAUTH_URL` points to the correct URL
- Verify Nginx is proxying correctly

### Error 502 Bad Gateway
- App is not running. Check with `pm2 list`
- Restart: `pm2 restart packflow`

### Blank page after login
- Clear browser cookies
- Verify `NEXTAUTH_URL` exactly matches the domain
- Check server logs: `pm2 logs packflow --lines 50`

### Example data not showing
- Run seed: `cd nextjs_space && yarn prisma db seed`
- Verify with Prisma Studio: `yarn prisma studio`

### Production build fails with "Unexpected token" JSX error
- This can happen with Next.js 14.2.28 when using complex nested arrow functions inside JSX attributes
- **Solution**: Refactor complex inline expressions (like `onClick={() => setState({...obj, [key]: {...}})}`) into named functions
- Use `function(){}` syntax instead of `()=>{}` in JSX event handlers
- Example:
  ```jsx
  // ❌ Avoid deeply nested arrow functions in JSX
  <button onClick={() => setForm({...form, [id]: { ...form[id], field: e.target.value }})} />
  
  // ✅ Use named handler functions
  function handleChange(id, e) {
    setForm(prev => { var r = {}; r[id] = {...prev[id], field: e.target.value}; return {...prev, ...r}; });
  }
  <button onClick={function(e) { handleChange(person.id, e); }} />
  ```

---

## 17. Roadmap

### Phase 2 — Real Integrations
- [ ] WhatsApp Business API for alert escalation
- [ ] Real integration with Hitachi RX2-S printers
- [ ] AI Assistant with Gemini 2.5 Pro (image analysis)
- [ ] n8n integration for automated workflows

### Phase 3 — Advanced Features
- [ ] Next Shift View
- [ ] Material inventory management
- [ ] Automatic mid-shift reports (real PDF)
- [ ] Staff performance evaluation
- [ ] Optimal team formation system

### Phase 4 — Optimization
- [ ] PWA with offline support (Service Workers)
- [ ] Push notifications
- [ ] Advanced charts with historical data
- [ ] Customizable user dashboard
- [ ] Public API for ERP integration

---

## 📞 Support

**Author**: Andres Fernando Garcia  
**Client**: Marba Sp. z o.o.  
**Location**: Trasa Północna 19, Zielona Góra, Poland  
**Version**: 2.0.1 — March 2025

---

*This document is part of the PackFlow v2.0 MVP project and should be kept updated with each new system version.*
