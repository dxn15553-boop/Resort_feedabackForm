import fs from 'fs';
import path from 'path';

// Load .env.local or .env if present
function loadEnv() {
  for (const envFile of ['.env.local', '.env']) {
    const fullPath = path.resolve(process.cwd(), envFile);
    if (fs.existsSync(fullPath)) {
      const lines = fs.readFileSync(fullPath, 'utf-8').split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const [key, ...vals] = trimmed.split('=');
        if (key && vals.length > 0 && !process.env[key.trim()]) {
          let val = vals.join('=').trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          process.env[key.trim()] = val;
        }
      }
    }
  }
}
loadEnv();

import { getAllFeedbackRecords } from '../lib/db';

async function runBackup() {
  console.log('🔄 [DXN Resort] Starting automated database backup...');
  try {
    const records = await getAllFeedbackRecords();
    const now = new Date();
    const dateStr = now.toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(process.cwd(), process.env.BACKUP_DIR || 'backups');

    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const backupFile = path.join(backupDir, `dxn_feedback_backup_${dateStr}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(records, null, 2), 'utf-8');

    console.log(`✅ Backup successfully created at: ${backupFile}`);
    console.log(`📊 Total records archived: ${records.length}`);

    // Retention cleanup (30 days)
    const retentionDays = parseInt(process.env.BACKUP_RETENTION_DAYS || '30', 10);
    const retentionMs = retentionDays * 24 * 60 * 60 * 1000;
    const files = fs.readdirSync(backupDir);

    let purged = 0;
    for (const file of files) {
      if (file.startsWith('dxn_feedback_backup_') && file.endsWith('.json')) {
        const filePath = path.join(backupDir, file);
        const stats = fs.statSync(filePath);
        if (now.getTime() - stats.mtimeMs > retentionMs) {
          fs.unlinkSync(filePath);
          purged++;
        }
      }
    }

    if (purged > 0) {
      console.log(`🧹 Cleaned up ${purged} historical backup(s) older than ${retentionDays} days.`);
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Backup process failed:', err);
    process.exit(1);
  }
}

runBackup();
