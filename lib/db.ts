import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { FeedbackFormData, StoredFeedback } from './types';
import { generateFeedbackId } from './id';

// Global singleton for Prisma to avoid hot-reload connection leaks
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Resilient file fallback store location
const DATA_DIR = path.join(process.cwd(), '.data');
const STORE_FILE = path.join(DATA_DIR, 'feedback_store.json');

function ensureDataStore(): StoredFeedback[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(STORE_FILE)) {
      fs.writeFileSync(STORE_FILE, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    const raw = fs.readFileSync(STORE_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read local data store:', err);
    return [];
  }
}

function saveLocalDataStore(data: StoredFeedback[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save to local data store:', err);
  }
}

/**
 * Saves feedback safely:
 * Attempts Prisma / Neon first. If the remote database is unreachable or credentials are placeholder,
 * saves to persistent local store so zero guest submissions are ever lost.
 */
export async function saveFeedbackRecord(data: FeedbackFormData): Promise<{ success: boolean; feedbackId: string; source: 'database' | 'local' }> {
  const feedbackId = generateFeedbackId();
  const now = new Date().toISOString();

  // Check duplicate submission token
  if (data.clientSubmissionToken) {
    const existing = await findFeedbackByToken(data.clientSubmissionToken);
    if (existing) {
      return { success: true, feedbackId: existing.feedbackId, source: 'database' };
    }
  }

  // Attempt database save via Prisma
  try {
    const created = await prisma.feedback.create({
      data: {
        feedbackId,
        clientSubmissionToken: data.clientSubmissionToken || null,
        fullName: data.fullName,
        roomNumber: data.roomNumber,
        visitDate: data.visitDate,
        purposeOfVisit: data.purposeOfVisit,
        overallImpression: data.overallImpression,

        checkInProcess: data.checkInProcess,
        checkOutProcess: data.checkOutProcess,
        staffFriendliness: data.staffFriendliness,
        responseToRequests: data.responseToRequests,
        roomCleanliness: data.roomCleanliness,
        comfortAmenities: data.comfortAmenities,
        housekeepingService: data.housekeepingService,

        foodQuality: data.foodQuality,
        roomService: data.roomService,
        factoryVisited: data.factoryVisited,

        guidedTourExperience: data.guidedTourExperience || null,
        informationProvided: data.informationProvided || null,
        cleanlinessOrganization: data.cleanlinessOrganization || null,
        interactionWithStaff: data.interactionWithStaff || null,
        safetyMeasures: data.safetyMeasures || null,

        staffProfessionalism: data.staffProfessionalism,
        emergencyPreparedness: data.emergencyPreparedness,
        safetyCompliance: data.safetyCompliance,
        productBiscuits: data.productBiscuits,
        productKombucha: data.productKombucha,
        productToothpaste: data.productToothpaste,
        productSoap: data.productSoap,
        productShampoo: data.productShampoo,
        productCoffee: data.productCoffee,
        productHandWash: data.productHandWash,

        refinementText: data.refinementText || '',
        ambassadorStatus: data.ambassadorStatus,
      },
    });

    // Also mirror to local store as backup
    const list = ensureDataStore();
    list.unshift({
      ...data,
      id: created.id,
      feedbackId: created.feedbackId,
      createdAt: created.createdAt.toISOString(),
    });
    saveLocalDataStore(list);

    return { success: true, feedbackId: created.feedbackId, source: 'database' };
  } catch (dbErr) {
    console.warn('Prisma DB write failed or database not reachable. Falling back to persistent store:', dbErr);

    // Persist to local backup storage
    const list = ensureDataStore();
    const newRecord: StoredFeedback = {
      ...data,
      id: feedbackId,
      feedbackId,
      createdAt: now,
    };
    list.unshift(newRecord);
    saveLocalDataStore(list);

    return { success: true, feedbackId, source: 'local' };
  }
}

export async function findFeedbackByToken(token: string): Promise<StoredFeedback | null> {
  try {
    const item = await prisma.feedback.findUnique({
      where: { clientSubmissionToken: token },
    });
    if (item) {
      return {
        ...(item as any),
        createdAt: item.createdAt.toISOString(),
      };
    }
  } catch {
    // Check local store
  }

  const list = ensureDataStore();
  const found = list.find((item) => item.clientSubmissionToken === token);
  return found || null;
}

export async function getAllFeedbackRecords(): Promise<StoredFeedback[]> {
  try {
    const records = await prisma.feedback.findMany({
      orderBy: { createdAt: 'desc' },
    });
    if (records && records.length > 0) {
      return records.map((r) => ({
        ...(r as any),
        createdAt: r.createdAt.toISOString(),
      }));
    }
  } catch (err) {
    console.warn('Could not read from Prisma database. Using local persistent store:', err);
  }

  return ensureDataStore();
}

