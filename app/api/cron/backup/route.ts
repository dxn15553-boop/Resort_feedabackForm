import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getAllFeedbackRecords } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    // Check Cron Secret Header or Admin Session
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'dxn_cron_secret_token_secure';
    const isCronAuthorized = authHeader === `Bearer ${cronSecret}`;
    const isAdmin = await getAdminSession();

    if (!isCronAuthorized && !isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized backup request' }, { status: 401 });
    }

    const records = await getAllFeedbackRecords();

    // Create timestamped backup filename
    const now = new Date();
    const dateStr = now.toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(process.cwd(), process.env.BACKUP_DIR || 'backups');

    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const backupFile = path.join(backupDir, `dxn_feedback_backup_${dateStr}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(records, null, 2), 'utf-8');

    // Clean up backups older than 30 days
    const retentionDays = parseInt(process.env.BACKUP_RETENTION_DAYS || '30', 10);
    const retentionMs = retentionDays * 24 * 60 * 60 * 1000;
    const files = fs.readdirSync(backupDir);

    let purgedCount = 0;
    for (const file of files) {
      if (file.startsWith('dxn_feedback_backup_') && file.endsWith('.json')) {
        const filePath = path.join(backupDir, file);
        const stats = fs.statSync(filePath);
        if (now.getTime() - stats.mtimeMs > retentionMs) {
          fs.unlinkSync(filePath);
          purgedCount++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Automated database export completed successfully.',
      filename: path.basename(backupFile),
      recordsCount: records.length,
      retentionDays,
      purgedOldBackups: purgedCount,
      timestamp: now.toISOString(),
    });
  } catch (err: any) {
    console.error('Backup generation failed:', err);
    return NextResponse.json(
      { success: false, error: 'Backup generation failed: ' + err.message },
      { status: 500 }
    );
  }
}

