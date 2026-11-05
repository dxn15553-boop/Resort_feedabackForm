# DXN Resort – Database Backup & Disaster Recovery Architecture

This document outlines the database backup, retention, and disaster recovery strategy for the **DXN Resort Guest Feedback Application** using **Neon PostgreSQL** and **Vercel**.

---

## 1. Primary Database: Neon PostgreSQL

- **Engine:** Serverless PostgreSQL 16+ on AWS / Neon.
- **Connection String:** Configured via `DATABASE_URL` environment variable.
- **Connection Security:** Uses SSL (`sslmode=require`) and connection pooling for serverless execution.
- **Transactions:** Multi-table writes and record insertions utilize transactional guarantees (`prisma.$transaction`).
- **Idempotency & Duplicate Prevention:** Every submission generates a unique `clientSubmissionToken` and a permanent `feedbackId` (e.g., `DXN-2026-XXXXXX`). Duplicate submissions from rapid clicking or network replays are rejected safely.

---

## 2. Automated Daily Backups

### A. Vercel Cron Job
Defined in `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/backup",
      "schedule": "0 2 * * *"
    }
  ]
}
```
- Runs every night at **02:00 UTC**.
- Queries all feedback records and produces an immutable, timestamped JSON/CSV snapshot file: `dxn_feedback_backup_YYYY-MM-DDTHH-mm-ss.json`.
- Can be configured to sync automatically to an Amazon S3 / Google Cloud Storage / Azure Blob container.
- Secured using `CRON_SECRET` authorization header.

### B. Standalone CLI Backup Script
Can be run on any maintenance server, CI/CD pipeline, or cron container:
```bash
npm run backup
# or
npx tsx scripts/backup.ts
```

### C. 30-Day Retention Policy
Old backups exceeding `BACKUP_RETENTION_DAYS=30` are automatically pruned by the cleanup routine during each daily export cycle.

---

## 3. Zero-Downtime Offline Fallback & Resiliency

To satisfy the requirement:
> *"Handle database downtime without losing the guest's entered responses"*

1. **Client-Side Draft Storage:** Form progress is continuously persisted in browser storage. If a guest loses Wi-Fi while walking around the resort or inspecting the factory, their form data remains preserved and repopulates automatically upon reloading.
2. **Resilient Local File Store:** If Neon PostgreSQL experiences a temporary network outage or connection timeout, the server-side API writes the feedback to an encrypted, append-only persistent storage file (`.data/feedback_store.json`) and signals the guest with confirmed storage. When the primary database connection resumes, the records can be reconciled to Neon.

---

## 4. Disaster Recovery & Restoration Procedure

In the event of accidental database dropping or regional outage:

### Step 1: Provision a New Neon PostgreSQL Branch / Instance
Create a new database in the Neon Console:
```bash
# Obtain connection string:
DATABASE_URL="postgresql://[user]:[password]@[new-endpoint].neon.tech/neondb?sslmode=require"
```

### Step 2: Push Database Schema
```bash
npx prisma db push
```

### Step 3: Restore Data from Timestamped Snapshot
To restore from the latest JSON backup:
```bash
npx tsx scripts/restore.ts --file ./backups/dxn_feedback_backup_2026-11-05.json
```
Or if using PostgreSQL `pg_dump`:
```bash
# Logical SQL dump:
pg_dump "$OLD_DATABASE_URL" > dxn_resort_backup.sql

# Restore to new database:
psql "$NEW_DATABASE_URL" < dxn_resort_backup.sql
```

### Step 4: Verify Admin Dashboard
1. Log in to `/admin/login` using `ADMIN_USERNAME` and `ADMIN_PASSWORD`.
2. Confirm total submission count, category averages, product ratings, and factory visit records match previous counts.
3. Test exporting to Excel and CSV.

---

## 5. Environment Variables Reference

| Variable | Description | Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | Neon PostgreSQL connection string | `postgresql://user:pass@ep-cool.us-east-2.aws.neon.tech/neondb?sslmode=require` |
| `ADMIN_USERNAME` | Admin portal username | `admin` |
| `ADMIN_PASSWORD` | Secure administrative password | `DXN_Resort@Admin2026` |
| `JWT_SECRET` | 256-bit secret key for admin auth tokens | `dxn_resort_super_secret_jwt_encryption_key_2026` |
| `BACKUP_DIR` | Directory for backup snapshots | `./backups` |
| `BACKUP_RETENTION_DAYS` | Minimum retention period | `30` |
| `CRON_SECRET` | Authorization token for Vercel Cron | `dxn_cron_secret_token_secure` |

