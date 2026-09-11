import { getDB } from '../services/db';
import type { Settings } from '../types/schema';

export const DEFAULT_SETTINGS: Settings = {
  id: 'app-settings',
  theme: 'system',
  statusLabels: {
    Wishlist: 'Wishlist',
    Applied: 'Applied',
    OA: 'Online Assessment',
    Interview: 'Interview',
    Offer: 'Offer',
    Rejected: 'Rejected',
    Ghosted: 'Ghosted',
  },
  followUpThresholdDays: 7,
};

export async function getSettings(): Promise<Settings> {
  const db = await getDB();
  const settings = await db.get('settings', 'app-settings');
  return settings || DEFAULT_SETTINGS;
}

export async function saveSettings(settings: Settings): Promise<void> {
  const db = await getDB();
  await db.put('settings', settings);
}

export async function clearAllData(): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(
    ['applications', 'interviews', 'documents', 'contacts', 'notes', 'settings'],
    'readwrite'
  );
  await tx.objectStore('applications').clear();
  await tx.objectStore('interviews').clear();
  await tx.objectStore('documents').clear();
  await tx.objectStore('contacts').clear();
  await tx.objectStore('notes').clear();
  await tx.objectStore('settings').clear();
  await tx.done;
}
