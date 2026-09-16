# 🎓 Learnzfy

> **Education is your right, not a product for sale.**

Learnzfy is a full-featured, modern e-learning platform that connects students with expert educators. It combines a rich learning experience — video lessons, quizzes, exams, and certificates — with an engaging gamification layer (XP, levels, badges, streaks, leaderboards, rewards) and a full administrative backend.

Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS 4**, **Prisma**, and **NextAuth**, Learnzfy ships as a single, self-contained Next.js application serving a marketing site, role-based dashboards, and a public REST API.

---

## ✨ Features

### 👩‍🎓 Student Experience
- **Dashboard** with personalized insights and quick access to enrolled courses
- **Course player** — modules, video lessons, progress tracking, notes panel, and downloadable resources
- **Assessments** — timed quizzes (MCQ, true/false, multi-select) and proctored-style exams with attempt limits and passing scores
- **Certificates** — automatically issued on completion, with a unique QR-coded verification ID and a public verification page
- **Gamification** — earn XP and level up, unlock badges and achievement tiers, maintain learning streaks, and climb the leaderboard
- **Rewards store** — redeem points for coupons, discounts, and promo codes backed by sponsors
- **Community** — per-course and per-lesson discussions with nested replies, voting, and pinning
- **Recommendations** — continue-learning prompts, trending courses, and recommended courses/teachers
- **Search** — full-text search with live suggestions, recent & popular queries
- **Bookmarks & saved content** — save courses and lessons for later
- **Notifications** — in-app notification center with unread badges
- **Analytics** — learning statistics and progress charts
- **Profile & privacy controls** — visibility, leaderboard opt-out, and activity sharing preferences

### 👨‍🏫 Teacher Experience
- Teacher application & approval workflow (admin-reviewed)
- Course authoring — create and manage courses, modules, and lessons, with Cloudinary-powered thumbnail uploads
- Manage enrolled students
- Performance analytics and content insights
- Teacher profile with public-facing page and teacher reviews

### 🛡️ Admin & Super Admin
- **Analytics dashboard** — platform-wide metrics with interactive charts
- **Course / category / badge management**
- **Quiz & exam management**
- **Review moderation** — approve, hide, or remove course & teacher reviews, handle reports
- **Teacher applications** — review, note, request changes, approve/reject, verify teachers
- **Certificate management** — search, revoke, restore, and audit verification logs
- **Rewards & sponsors** management with stock tracking and redemption status
- **Notifications** — broadcast platform-wide messages
- **Streak configuration** — tune streak rewards and milestones
- **Student & teacher management** — activate/deactivate users
- **Website settings** — editable platform configuration

### 🌍 Public & Marketing
- Landing page with hero, featured courses, statistics, testimonials, top teachers, sponsors, and CTA sections
- Public course catalog, course search, teacher directory & profiles
- About, Contact, and API Documentation pages
- SEO — generated `sitemap.xml` and `robots.txt`

### 🔌 Public REST API
- Versioned API under `/api/v1` with an auto-generated OpenAPI spec at `/api/openapi.json`
- Live API documentation at `/api-docs`
- Endpoints for courses, categories, teachers, lessons, exams, reviews, leaderboards, sponsors, and platform stats

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router) · [React 19](https://react.dev) · [TypeScript](https://www.typescriptlang.org) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com) · `class-variance-authority` · `tailwind-merge` |
| **UI Components** | [Radix UI](https://www.radix-ui.com) primitives · custom shadcn-style components · [lucide-react](https://lucide.dev) icons |
| **Database** | [PostgreSQL](https://www.postgresql.org) via [Prisma ORM 6](https://www.prisma.io) |
| **Authentication** | [NextAuth v5 (beta)](https://next-auth.js.org) — Credentials + Google OAuth, JWT sessions, RBAC |
| **Forms & Validation** | [React Hook Form](https://react-hook-form.com) · [Zod](https://zod.dev) · `@hookform/resolvers` |
| **Data Fetching** | [TanStack Query](https://tanstack.com/query) v5 |
| **Charts** | [Recharts](https://recharts.org) |
| **Image Storage** | [Cloudinary](https://cloudinary.com) — course thumbnails & image uploads |
| **QR Codes** | `qrcode` · `qrcode.react` |
| **Misc** | `date-fns` · `bcryptjs` |

---

## 📁 Project Structure

```
Learnzfy/
├── prisma/
│   ├── schema.prisma        # Full data model (PostgreSQL)
│   └── seed.ts              # Seed script (roles, demo users, categories, courses)
├── public/                  # Static assets
├── src/
│   ├── app/
│   │   ├── (auth)/          # login, register, forgot/reset password
│   │   ├── (dashboard)/
│   │   │   ├── admin/       # Admin & Super Admin dashboards
│   │   │   ├── student/     # Student dashboards & course player
│   │   │   └── teacher/     # Teacher dashboards
│   │   ├── (marketing)/     # Public marketing pages & catalog
│   │   ├── api/             # Route handlers (REST + public v1 API)
│   │   ├── verify/          # Public certificate verification
│   │   ├── layout.tsx       # Root layout
│   │   └── sitemap.ts, robots.ts
│   ├── components/          # Reusable UI & feature components
│   ├── config/              # Site & route configuration
│   ├── lib/                 # Auth, db, RBAC, search, rate-limit, gamification logic
│   ├── providers/           # React Query & Theme providers
│   └── types/               # Shared TypeScript types
├── next.config.ts           # Security headers, CSP, image optimization, redirects
├── tsconfig.json
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) **20.9+**
- [PostgreSQL](https://www.postgresql.org) (local or remote — e.g. [Neon](https://neon.tech), [Supabase](https://supabase.com), [Railway](https://railway.app))
- npm (or your preferred package manager)

### 1. Clone & install

```bash
git clone https://github.com/RajinShahriar10/Learnzfy.git
cd Learnzfy
npm install
```

### 2. Configure environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/learnzfy?schema=public"

# NextAuth — generate a strong secret with: openssl rand -base64 32
AUTH_SECRET="your-auth-secret-change-in-production"
AUTH_URL="http://localhost:3000"

# Google OAuth (optional but recommended)
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# Cloudinary (required for image/thumbnail uploads)
# Create a free account at https://cloudinary.com and grab your credentials
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
CLOUDINARY_UPLOAD_FOLDER="Learnzfy"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Learnzfy"
```

### 3. Set up the database

```bash
# Create the schema (idempotent — also runs the Prisma client generation)
npm run db:push

# Seed the database with roles, demo users, categories, and content
npm run db:seed
```

> Prefer versioned migrations for production — replace `db:push` with:
> `npm run db:migrate` (creates & applies a migration).

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app auto-updates as you edit files. The database dashboard is available at [http://localhost:5555](http://localhost:5555) via `npm run db:studio`.

---

## 🔐 Demo Accounts

After seeding, the following accounts are available (all share the password `password123`):

| Role | Email |
|---|---|
| **Super Admin** | `superadmin@learnzfy.com` |
| **Admin** | `admin@learnzfy.com` |
| **Teacher** | `teacher@learnzfy.com` |
| **Student** | `student@learnzfy.com` |

> ⚠️ Change these credentials before any production deployment.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the production bundle |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Regenerate the Prisma client |
| `npm run db:push` | Push the schema to the database (no migrations) |
| `npm run db:migrate` | Create & apply a Prisma migration |
| `npm run db:seed` | Seed the database |
| `npm run db:studio` | Open Prisma Studio (database GUI) |

---

## 🔐 Role-Based Access Control

| Capability | Student | Teacher | Admin | Super Admin |
|---|:---:|:---:|:---:|:---:|
| Browse & enroll in courses | ✅ | ✅ | ✅ | ✅ |
| Take quizzes, exams & earn certificates | ✅ | ✅ | — | — |
| Gamification (XP, badges, streaks, rewards) | ✅ | — | — | — |
| Create & manage own courses | — | ✅ | — | — |
| Manage all content & users | — | — | ✅ | ✅ |
| Platform configuration & certificate revocation | — | — | ✅ | ✅ |
| Manage administrators & global settings | — | — | — | ✅ |

Route-level and API-level guards enforce these roles via `src/lib/rbac.ts`.

---

## 🔌 API Overview

The application exposes two categories of endpoints:

- **Internal APIs** under `/api/*` — power the marketing site and dashboards (protected by auth + RBAC where required).
- **Public v1 API** under `/api/v1` — intentionally open endpoints for courses, categories, teachers, lessons, exams, reviews, leaderboards, sponsors, and stats.

Live, interactive documentation and an OpenAPI spec are available at:

- `GET /api-docs`
- `GET /api/openapi.json`

---

## 🔒 Security

- **Content-Security-Policy** and other hardening headers (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) set globally in `next.config.ts`
- Password hashing via `bcryptjs` (cost factor 12)
- Rate limiting on sensitive endpoints (`src/lib/rate-limit.ts`)
- JWT-based sessions with role claims; RBAC enforced server-side
- User deactivation for revoked accounts
- Input validation on all forms via Zod
- CORS policies scoped per route group

---

## ☁️ Deployment

The recommended deployment target is [Vercel](https://vercel.com):

```bash
npm run build
```

On Vercel:

1. Push the repository to GitHub and import it in Vercel
2. Add the environment variables from `.env.example`
3. Deploy — a PostgreSQL host such as [Neon](https://neon.tech) or [Supabase](https://supabase.com) is recommended for the database

See the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more options (Node.js hosts, Docker, etc.).

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/my-feature`)
3. Commit your changes with a clear message
4. Push and open a pull request

Please run `npm run lint` and `npm run build` before opening a pull request.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — feel free to use, modify, and learn from it.

---

<div align="center">
  <sub>Built with ❤️ using Next.js, Prisma, and TypeScript.</sub>
</div>
