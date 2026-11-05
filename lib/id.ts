import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a unique, prestigious DXN Resort Feedback ID
 * Format: DXN-YYYY-XXXXXX (e.g. DXN-2026-A83F9C)
 */
export function generateFeedbackId(): string {
  const year = new Date().getFullYear();
  const hexPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `DXN-${year}-${hexPart}`;
}

export function generateSubmissionToken(): string {
  return uuidv4();
}

