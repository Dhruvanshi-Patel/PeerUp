# 🤝 PeerUp — Peer-to-Peer Campus Skill Exchange Network

[![Deployment Status](https://img.shields.io/badge/Vercel-Deployed-success?style=flat&logo=vercel)](https://omnikon.vercel.app)
[![Database](https://img.shields.io/badge/Turso-libSQL-blue?style=flat&logo=sqlite)](https://turso.tech)
[![Frontend](https://img.shields.io/badge/React-18-blue?style=flat&logo=react)](https://react.dev)
[![Styling](https://img.shields.io/badge/Tailwind_CSS-v3-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com)

**PeerUp** (Omnikon) is a modern, trust-based peer-to-peer skill exchange platform designed for college and university students. Students trade knowledge 1-for-1—such as Python coding, multivariable calculus, Spanish conversation, or digital design—using a zero-tuition simple credit wallet (**1 Hour Taught = 1 Simple Credit**).

🌐 **Live Demo:** [https://omnikon.vercel.app](https://omnikon.vercel.app)

---

## 🏛️ System Architecture

```text
┌──────────────────────────────────────────────────────────────────┐
│              Frontend SPA (Vite + React 18 + Tailwind)           │
│  Explore Mentors │ Study Notes │ 1:1 Swaps │ Wallet │ Leaderboard  │
└────────────────────────────────┬─────────────────────────────────┘
                                 │ HTTPS REST API
┌────────────────────────────────▼─────────────────────────────────┐
│              Vercel Serverless Functions Layer (/api/*)          │
│                                                                  │
│  /api/users    /api/swaps    /api/sessions    /api/messages      │
│  /api/notes    /api/misc (Health, Leaderboard, Wallet, Perks)    │
│                                                                  │
│  ┌─────────────────┐  ┌──────────────────┐  ┌─────────────────┐ │
│  │ Verified .edu   │  │ 1:1 Simple Credit│  │ Karma & Badging │ │
│  │ Domain Guard    │  │ Engine (+1 Cr)   │  │ Ranking Engine  │ │
│  └────────┬────────┘  └────────┬─────────┘  └────────┬────────┘ │
│           │                    │                     │           │
│  ┌────────▼────────────────────▼─────────────────────▼────────┐ │
│  │                 Turso Database (libSQL / SQLite)           │ │
│  │  users │ skills │ swaps │ sessions │ reviews │ notes │ msgs │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

- 🎓 **Verified University Email Authentication**: Enforces official university email addresses (`.edu`, `.ac.uk`, `.ac.in`, etc.) to guarantee a safe, trusted student-only network. Commercial domain registrations (`@gmail.com`, `@yahoo.com`) are automatically rejected.
- ⏳ **Simple Credit Economy**: Reciprocal 1:1 tutoring wallet. Teaching a 60-minute peer session earns 1 Simple Credit and +50 Karma XP.
- 📚 **Course Notes & PYQ Study Guides Hub**: Share and unlock peer-verified lecture summaries, past exam papers (PYQs), and hand-drawn solution diagrams.
- 🗓️ **Interactive Session Scheduling & QR Check-in**: Propose, accept, and conduct virtual or campus 1:1 sessions with automated room codes and QR verification.
- 🏆 **Campus Karma Leaderboard**: Real-time rankings ordered by Karma XP and hours taught. Earn badges from *Verified Contributor* to *Master Mentor*.
- ☕ **Campus Perks & Rewards**: Redeem earned simple credits for real campus perks ($10 Peet's Coffee vouchers, Boba drinks, Dining Hall meal passes, Bookstore cards).
- 🛠️ **Developer Sandbox**: Toggle developer tools via `?dev=true` to test session completions and credit rewards.

---

## 🛠️ Tech Stack

### **Frontend & User Interface**
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS v3 (Custom HSL color palette, Glassmorphism, Dark/Light campus accents)
- **Icons**: Lucide React
- **Animations**: Canvas Confetti

### **Backend & Database**
- **Hosting / Compute**: Vercel Serverless Functions (`/api/*`)
- **Database**: [Turso](https://turso.tech) (libSQL / SQLite cloud)
- **ORM / Client**: `@libsql/client`

---

## 📁 Repository Structure

```text
omnikon/
├── api/                   # Vercel Serverless Functions
│   ├── users.js           # Auth, Registration, Profiles, Skills, Referrals
│   ├── swaps.js           # Swap proposals, Accept/Decline logic
│   ├── sessions.js        # Session list, Completion rewards, QR codes
│   ├── messages.js        # Direct peer messaging & conversation threads
│   ├── notes.js           # Course notes listing, Uploads, Unlocks
│   └── misc.js            # Health check, Leaderboard, Reviews, Campus Perks
├── lib/
│   ├── db.js              # Shared Turso libSQL connection wrapper
│   └── userHelpers.js     # University email validation & profile hydration
├── scripts/
│   └── migrate.js         # One-touch DB schema creation & initial seeding script
├── src/                   # React Single Page Application
│   ├── components/        # Modals, Profile views, Swap cards, Navigation
│   ├── context/           # React AppContext state management
│   ├── services/          # Frontend API service layer (`api.js`)
│   └── data/              # Mock fallbacks and category definitions
├── vercel.json            # Vercel deployment rewrites & configuration
└── vite.config.js         # Vite build configuration
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- A free [Turso Database](https://turso.tech) account

### 1. Clone the repository

```bash
git clone https://github.com/your-username/peerup.git
cd peerup
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Turso database credentials:

```ini
TURSO_DATABASE_URL=libsql://your-database-name.turso.io
TURSO_AUTH_TOKEN=your-turso-auth-token
```

### 4. Run database migration

Create tables and seed initial student personas:

```bash
npm run migrate
```

### 5. Start local development server

```bash
# Standard Vite dev server
npm run dev

# Or with Vercel CLI (runs API serverless functions locally alongside Vite)
npx vercel dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌐 Deploying to Vercel

1. Push your repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. Add the following **Environment Variables** in your Vercel Project Settings:
   - `TURSO_DATABASE_URL` = `libsql://your-database-name.turso.io`
   - `TURSO_AUTH_TOKEN` = `your-turso-auth-token`
4. Deploy! Vercel automatically builds the frontend and provisions the 6 Serverless API routes.

---

## 🔐 Security & Data Privacy

- `.env`, `.env.local`, `.vercel`, and database files are protected via `.gitignore`.
- Authentication uses case-insensitive email matching and university domain checks.
- Passwords are encrypted before storage.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
