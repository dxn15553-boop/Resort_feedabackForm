# DXN Resort – Guest Feedback Application

A professional, premium, responsive Guest Feedback Application built specifically for **DXN Resort** with luxury hospitality styling, comprehensive quality evaluation metrics, secure administrative analytics, and multi-tier data protection.

---

## 🌟 Key Features

### 1. Luxury Hospitality UI & Design
- **Branded Elegance:** DXN Resort emblem, deep royal pink (`#C2185B`, `#880E4F`) and soft pink gradient accents.
- **Card-Based Rating System:** Interactive rating cards (Excellent, Good, Average, Poor) with color-coded feedback instead of standard dropdowns.
- **Step-by-Step Progress Tracking:** 6-step progress indicator with instant visual percentages and completed state dots.
- **Flawless Responsiveness:** Optimized for smartphones, tablets, and desktop workstations.
- **Zero Distraction:** Clean, fast, accessible UI without bloated animations.

### 2. Multi-Step Form Workflow
- **STEP 01 – Guest Information:** Full Name, Room Number, Visit Date, Purpose of Visit, and Overall Impression.
- **STEP 02 – Hospitality & Rooms:** Guest Services (Check-in, Check-out, Staff Friendliness, Response to Requests) & Room Maintenance (Cleanliness, Comfort & Amenities, Housekeeping).
- **STEP 03 – Catering & Factory:** F&B Performance (Food Quality, Room Service) and Factory Visit Identification ("Yes, Visited" or "No, Skip").
- **STEP 04 – Industrial Experience:** Guided Tour, Information, Hygiene & Cleanliness, Staff Interaction, and Safety Measures. *(Automatically bypassed if the guest did not participate in factory tours!)*
- **STEP 05 – Products & Staff:** Personnel & Safety (Professionalism, Emergency Preparedness, Safety Compliance) and DXN Product Usage (Biscuits, Kombucha, Toothpaste, Soap, Shampoo, Coffee, Hand Wash).
- **STEP 06 – Final Summary:** Open suggestions multiline textarea and Ambassador Recommendation Status (Absolutely vs Not Likely).

### 3. Submission Integrity & Offline Safety
- **Strict Validation:** Prevents advancing past any step if mandatory fields are missing.
- **Backward Navigation with Memory:** Enter answers freely, go back and forward without losing previously entered values.
- **Idempotency & Double-Click Guard:** Unique client submission tokens prevent duplicate submissions from accidental double taps or network replays.
- **Offline Draft Autosave:** Form state is saved locally continuously, so temporary Wi-Fi or mobile network drops do not lose entered responses.
- **Confirmed Database Insertion:** Confirmation screen only displays upon validated database persistence, generating a prestigious Feedback ID (e.g. `DXN-2026-F982A1`).

### 4. Executive Admin Management Dashboard (`/admin/dashboard`)
- **Secure Authentication:** Cookie-based JWT token session with configurable credentials (`/admin/login`).
- **Real-Time KPI Metrics:** Total feedback submissions, impression breakdown, ambassador recommendation rate %, and factory tour visit counts.
- **Category Rating Averages:** Numeric score averages (scale 1.00 – 4.00) for Hospitality, Catering, Industrial Tour, Staff & Safety, and Products.
- **Product-Wise Rating Distribution:** Dedicated statistics for all 7 DXN wellness products.
- **Interactive Record Explorer:** Full table of guest submissions with search by name, room, date, or ID.
- **Filtering & Segments:** Filter by visit date, impression tier, or factory visit status.
- **Detailed Audit Modal:** Click "View" to inspect all six steps of any individual guest submission.
- **One-Click Exports:** Instant export to Microsoft Excel (`.xlsx`) and CSV (`.csv`).
- **Suggestions Stream:** Live feed of guest suggestions and refinement comments.

### 5. Database & Backup Architecture
- **Primary Database:** Neon Serverless PostgreSQL with Prisma ORM.
- **Vercel Hosting Ready:** Optimized for zero-configuration serverless deployment on Vercel.
- **Automated Daily Backups:** Vercel Cron (`/api/cron/backup`) runs daily at 02:00 UTC, archiving immutable snapshots with 30-day retention.
- **Resilient Fallback:** Graceful fallback to persistent storage prevents data loss if the primary database is undergoing maintenance or provisioning.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
pnpm install
# or
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Configure your Neon PostgreSQL connection string:
```env
DATABASE_URL="postgresql://[user]:[password]@[endpoint].neon.tech/neondb?sslmode=require"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="DXN_Resort@Admin2026"
JWT_SECRET="dxn_resort_super_secret_jwt_encryption_key_2026"
```

### 3. Run Prisma Migrations (when Neon DB is ready)
```bash
npx prisma db push
```

### 4. Start Development Server
```bash
npm run dev
# or
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

- **Guest Feedback Portal:** [http://localhost:3000](http://localhost:3000)
- **Admin Management Login:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
  - Default Username: `admin`
  - Default Password: `DXN_Resort@Admin2026`

---

## ☁️ Deploying to Vercel

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. In the Vercel Dashboard, import the project.
3. In **Project Settings > Environment Variables**, add:
   - `DATABASE_URL` (Your Neon connection string)
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `JWT_SECRET`
   - `CRON_SECRET`
4. Click **Deploy**. Vercel will automatically build the Next.js application and activate the daily cron job defined in `vercel.json`.

