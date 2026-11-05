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

import { prisma } from '../lib/db';
import { StoredFeedback } from '../lib/types';

async function runRestore() {
  const args = process.argv.slice(2);
  const fileIndex = args.indexOf('--file');
  let backupFilePath = fileIndex !== -1 ? args[fileIndex + 1] : null;

  const backupDir = path.join(process.cwd(), process.env.BACKUP_DIR || 'backups');

  if (!backupFilePath) {
    // Find latest backup file in backups folder
    if (!fs.existsSync(backupDir)) {
      console.error('❌ Backup directory does not exist.');
      process.exit(1);
    }
    const files = fs.readdirSync(backupDir).filter((f) => f.startsWith('dxn_feedback_backup_') && f.endsWith('.json'));
    if (files.length === 0) {
      console.error('❌ No backup files found in', backupDir);
      process.exit(1);
    }
    files.sort();
    backupFilePath = path.join(backupDir, files[files.length - 1]);
  }

  console.log(`🔄 [DXN Resort] Restoring records from: ${backupFilePath}`);

  try {
    const raw = fs.readFileSync(backupFilePath, 'utf-8');
    const records: StoredFeedback[] = JSON.parse(raw);

    console.log(`📦 Found ${records.length} records in backup snapshot.`);

    // Restore to local store
    const localStorePath = path.join(process.cwd(), '.data', 'feedback_store.json');
    if (!fs.existsSync(path.dirname(localStorePath))) {
      fs.mkdirSync(path.dirname(localStorePath), { recursive: true });
    }
    fs.writeFileSync(localStorePath, JSON.stringify(records, null, 2), 'utf-8');
    console.log(`✅ Local fallback store updated successfully with ${records.length} records.`);

    // Attempt restoring into PostgreSQL if DATABASE_URL is accessible
    let dbSuccessCount = 0;
    for (const r of records) {
      try {
        await prisma.feedback.upsert({
          where: { feedbackId: r.feedbackId },
          update: {},
          create: {
            feedbackId: r.feedbackId,
            fullName: r.fullName,
            roomNumber: r.roomNumber,
            visitDate: r.visitDate,
            purposeOfVisit: r.purposeOfVisit,
            overallImpression: r.overallImpression,

            checkInProcess: r.checkInProcess,
            checkOutProcess: r.checkOutProcess,
            staffFriendliness: r.staffFriendliness,
            responseToRequests: r.responseToRequests,
            roomCleanliness: r.roomCleanliness,
            comfortAmenities: r.comfortAmenities,
            housekeepingService: r.housekeepingService,

            foodQuality: r.foodQuality,
            roomService: r.roomService,
            factoryVisited: r.factoryVisited,

            guidedTourExperience: r.guidedTourExperience || null,
            informationProvided: r.informationProvided || null,
            cleanlinessOrganization: r.cleanlinessOrganization || null,
            interactionWithStaff: r.interactionWithStaff || null,
            safetyMeasures: r.safetyMeasures || null,

            staffProfessionalism: r.staffProfessionalism,
            emergencyPreparedness: r.emergencyPreparedness,
            safetyCompliance: r.safetyCompliance,
            productBiscuits: r.productBiscuits,
            productKombucha: r.productKombucha,
            productToothpaste: r.productToothpaste,
            productSoap: r.productSoap,
            productShampoo: r.productShampoo,
            productCoffee: r.productCoffee,
            productHandWash: r.productHandWash,

            refinementText: r.refinementText || '',
            ambassadorStatus: r.ambassadorStatus,
          },
        });
        dbSuccessCount++;
      } catch {
        // Skip DB errors if Neon is not yet online
      }
    }

    if (dbSuccessCount > 0) {
      console.log(`✅ Restored ${dbSuccessCount} records directly into Neon PostgreSQL.`);
    }

    console.log('🎉 Database restoration process completed.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Database restoration failed:', err);
    process.exit(1);
  }
}

runRestore();
