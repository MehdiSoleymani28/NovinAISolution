# NovinAISolution - Official Website

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)

**AI Workflow Implementation & Automation Services**

[ویژگی‌ها](#-features) · [نصب و راه‌اندازی](#-installation) · [پنل مدیریت](#-admin-panel) · [تکنولوژی‌ها](#-tech-stack)

</div>

---

## 🎯 About

NovinAISolution is a professional website for an AI services company focused on **workflow automation** and **AI tool implementation** for businesses. Instead of building AI models from scratch, we help organizations leverage existing AI tools and assistants to automate their manual processes and boost productivity.

## ✨ Features

### Public Website
- 🎨 **Modern UI** with animated neural network background (Canvas)
- 🌗 **Dark/Light theme** with smooth transitions
- 🌐 **RTL support** for Persian language
- 🔍 **Full SEO** - Meta tags, Open Graph, Twitter Cards, JSON-LD structured data
- 📱 **Fully responsive** design for all devices

### Sections
- **Hero** - Eye-catching landing with animated tech background
- **Services** - AI consulting, workflow automation, infrastructure, analytics, security, MVP
- **Training** - Professional AI courses and workshops
- **Tools** - AI-powered tools showcase
- **About** - Company information and mission
- **Contact** - Contact form and information

### Blog System
- 📝 **Public blog** with article listing, search, and category filtering
- 📖 **Article pages** with Markdown rendering, SEO, and social sharing
- 🏷️ **Categories & Tags** for content organization

### Admin Panel
- 🔐 **Secure login** with authentication
- 📊 **Dashboard** with content statistics
- ✍️ **Markdown editor** with toolbar and live preview
- 🗂️ **Article management** - Create, edit, delete, publish/draft
- 📁 **Category management** - Organize content
- 🏷️ **Tag management** - Flexible tagging system
- 🔍 **SEO settings** per article - Meta title, description, slug

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Next.js 16** | Full-stack React framework (App Router) |
| **TypeScript** | Type safety |
| **Tailwind CSS 4** | Utility-first styling |
| **shadcn/ui** | UI component library |
| **Framer Motion** | Animations |
| **Prisma** | Database ORM |
| **SQLite** | Lightweight database |
| **next-themes** | Dark/Light mode |
| **react-markdown** | Markdown rendering |

## 📦 Installation

### Prerequisites
- Node.js 18+ or Bun
- Git

### Setup

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/NovinAISolution.git
cd NovinAISolution

# Install dependencies
bun install
# or
npm install

# Copy environment variables
cp .env.example .env

# Setup database
bun run db:push
bun run db:generate

# Seed the database (optional - adds sample data)
curl -X POST http://localhost:3000/api/seed

# Run development server
bun run dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Admin Panel

Navigate to `/admin/login` and use the default credentials:

| Field | Value |
|-------|-------|
| Email | `admin@novinaisolution.com` |
| Password | `admin123` |

> ⚠️ **Important**: Change the default password before deploying to production!

### Admin Features
- **Dashboard** - `/admin/dashboard` - Overview of content stats
- **Articles** - `/admin/articles` - Manage blog posts
- **New Article** - `/admin/articles/new` - Markdown editor with live preview
- **Categories** - `/admin/categories` - Organize content
- **Tags** - `/admin/tags` - Manage tags

## 🚀 Deployment

### Build for Production

```bash
bun run build
bun run start
```

### Deploy with PM2

```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save
pm2 startup
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | SQLite database path | `file:./db/custom.db` |
| `ADMIN_EMAIL` | Admin login email | - |
| `ADMIN_PASSWORD` | Admin login password | - |
| `NEXTAUTH_SECRET` | Secret key for auth | - |
| `NEXTAUTH_URL` | Base URL of the app | `http://localhost:3000` |

## 📁 Project Structure

```
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── admin/             # Admin panel pages
│   │   ├── api/               # API routes
│   │   ├── blog/              # Public blog pages
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # Reusable UI components
│   └── lib/                   # Utility functions
├── public/                    # Static assets
├── .env.example               # Environment template
└── README.md
```

## 📄 License

This project is proprietary and confidential. All rights reserved by NovinAISolution.

---

<div align="center">

**Built with ❤️ by NovinAISolution**

</div>
