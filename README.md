<p align="center">
  <img src="./public/wellspace-logo.png" alt="WellSpace Logo" width="180" />
</p>

<h1 align="center">WellSpace Frontend 🏥</h1>

<p align="center">
  <strong>Next-generation clinical telehealth web client engineered with Next.js 16, TypeScript, Tailwind CSS, and shadcn/ui.</strong>
</p>

<p align="center">
  Connecting Care, Anytime, Anywhere. High-assurance video consultations, automated scheduling, and HIPAA-compliant patient management.
</p>

---

## 🌟 Key Features

- **Multi-Role Portals:**
  - **Patient Portal:** Browse specialties & doctors, book live consultation slots, manage appointments, access encrypted electronic health records (EHR), download prescriptions, and review clinicians.
  - **Doctor Portal:** Manage available schedules, inspect patient medical dossiers, launch live WebRTC video consultation rooms, and issue digital prescriptions.
  - **Admin / Super Admin Portal:** Comprehensive platform telemetry, doctor verification, patient governance, global schedule curation, audit logs, and system settings.
- **Next-Gen Clinical UI (2026 Design System):** Vitality Azure (`#0ea5e9`) & Deep Obsidian palette with fluid glassmorphism, responsive data-tables, and seamless dark/light mode toggle.
- **Enterprise Middleware Security:** Next.js Edge proxy layer for role-based path protection (`PATIENT`, `DOCTOR`, `ADMIN`, `SUPER_ADMIN`), cookie-based token validation, and redirect safeguards.
- **Production Compliance Pages:** Medical Disclaimer, Patient Rights & Consent, Refund & Cancellation Policy, Privacy Policy, and Terms of Service.
- **Optimized PWA & Brand Assets:** Full Web App Manifest, responsive multi-resolution favicons, and dedicated SVG/PNG brand components.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16.4.3 (Turbopack, App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS, PostCSS, Lucide React, Tabler Icons
- **UI Components:** Radix UI primitives via shadcn/ui (Cards, Dialogs, Sheets, Tooltips, Accordions, Dropdown Menus, Sonner Toasts)
- **Forms & Validation:** React Hook Form, Zod
- **Data Visualizations:** Recharts / Modern Area Interactive Charts
- **Package Manager:** pnpm 9.15.4

---

## 📁 Directory Architecture

```text
Frontend/
├── public/                      # Static assets, Web App Manifest & multi-size favicons
│   ├── favicon.ico
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── apple-touch-icon.png
│   ├── android-chrome-192x192.png
│   ├── android-chrome-512x512.png
│   ├── site.webmanifest
│   └── wellspace-logo.png       # Primary logo artifact
├── src/
│   ├── app/                     # Next.js App Router (40+ routes)
│   │   ├── (commonLayout)/      # Public pages (Home, Consultations, Legal, Auth)
│   │   │   ├── (auth)/          # Login, Register, Password Reset
│   │   │   ├── doctors/         # Doctor profiles & directories
│   │   │   ├── patient-rights/  # Patient compliance & consent
│   │   │   ├── refund-policy/   # Refund & cancellation policy
│   │   │   └── terms/           # Terms of service
│   │   ├── (dashboardLayout)/   # Protected role-based dashboards
│   │   │   ├── admin/           # Platform governance & telemetry
│   │   │   ├── doctor/          # Clinical schedules & prescriptions
│   │   │   └── (patient)/       # Appointments, EHR, medical records
│   │   ├── layout.tsx           # Global Root layout with SEO/PWA metadata
│   │   └── proxy.ts             # Edge middleware for role-based routing
│   ├── assets/                  # Brand assets and graphics
│   ├── components/              # Atomic UI & business modules
│   │   ├── modules/             # Domain modules (Home, Auth, Admin, Doctor, Patient)
│   │   ├── shared/              # Reusable shared elements (BrandLogo, Navbar, Footer)
│   │   └── ui/                  # shadcn/ui components
│   ├── lib/                     # Client utilities, navigation maps & icon helpers
│   ├── services/                # API communication layers & cookie handlers
│   └── types/                   # TypeScript interfaces and schema contracts
└── scripts/                     # Custom build scripts & deployment tooling
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the `Frontend/` root directory:

```env
# JWT Access Token Secret (used for edge proxy signature verification)
ACCESS_TOKEN_SECRET=your_jwt_access_token_secret_here

# Runtime Environment
NODE_ENV=development

# Backend API Endpoint
# Local Development:
BACKEND_API_URL=http://localhost:5000/api/v1
# Production (Render / Custom Domain):
# BACKEND_API_URL=https://wellspace-backend-1.onrender.com/api/v1
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js:** `>= 20.x` (LTS recommended)
- **pnpm:** `9.15.4` (`npm install -g pnpm@9.15.4`)

### 2. Installation
```bash
cd Frontend
pnpm install
```

### 3. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Code Quality & Linting
```bash
# Run ESLint validation
pnpm lint
```

### 5. Production Build
```bash
# Compile and build production bundle
pnpm build

# Serve production build locally
pnpm start
```

---

## 🌐 Deployment to Vercel

1. Import your frontend repository (`WellSpace-frontend`) into [Vercel](https://vercel.com).
2. Configure **Framework Preset:** `Next.js`.
3. Set **Root Directory:** `./` (or `Frontend` if in a monorepo).
4. Add Environment Variables:
   - `ACCESS_TOKEN_SECRET`
   - `BACKEND_API_URL` (Points to your live backend URL)
5. Deploy. Builds run cleanly with Next.js 16 Turbopack optimization.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

