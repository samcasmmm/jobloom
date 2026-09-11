import {
  getSettings,
  saveSettings,
  clearAllData,
} from '@/modules/storage/repositories/settings.repository';
import { getAllApplications, saveApplication } from '@/modules/storage/repositories/applications.repository';
import { getAllInterviews, saveInterview } from '@/modules/storage/repositories/interviews.repository';
import { getAllContacts, saveContact } from '@/modules/storage/repositories/contacts.repository';
import { getDB } from '@/modules/storage/services/db';
import type { Settings } from '../types';
import type { BackupPayload } from '../types';
import { BackupPayloadSchema } from '../validations/backup.schema';
import type { NoteEntry } from '@/modules/storage/types/schema';

export async function fetchSettings(): Promise<Settings> {
  return getSettings();
}

export async function updateSettings(settings: Settings): Promise<Settings> {
  await saveSettings(settings);
  return settings;
}

export async function exportAllDataAsJSON(): Promise<string> {
  const db = await getDB();
  const [settings, applications, interviews, contacts, notes] = await Promise.all([
    getSettings(),
    getAllApplications(),
    getAllInterviews(),
    getAllContacts(),
    db.getAll('notes'),
  ]);

  const payload: BackupPayload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    appName: 'Jobloom',
    settings,
    applications,
    interviews,
    contacts,
    notes,
  };

  // Update last backup timestamp in settings
  settings.lastBackupAt = payload.exportedAt;
  await saveSettings(settings);

  return JSON.stringify(payload, null, 2);
}

export async function importDataFromJSON(jsonString: string): Promise<{
  applicationsCount: number;
  interviewsCount: number;
  contactsCount: number;
  notesCount: number;
}> {
  let parsedRaw: unknown;
  try {
    parsedRaw = JSON.parse(jsonString);
  } catch {
    throw new Error('Invalid JSON file format. Please upload a valid Jobloom backup.');
  }

  // Validate schema
  const validationResult = BackupPayloadSchema.safeParse(parsedRaw);
  if (!validationResult.success) {
    const errorMessages = validationResult.error.issues
      .map((i) => `${i.path.join('.')}: ${i.message}`)
      .slice(0, 3)
      .join(', ');
    throw new Error(`Backup data failed validation: ${errorMessages}`);
  }

  const data = validationResult.data;

  // Clear existing dataset for clean restore
  await clearAllData();

  // Restore records
  for (const app of data.applications) {
    await saveApplication(app);
  }

  for (const interview of data.interviews) {
    await saveInterview(interview);
  }

  for (const contact of data.contacts) {
    await saveContact(contact);
  }

  const db = await getDB();
  for (const note of data.notes) {
    await db.put('notes', note as NoteEntry);
  }

  return {
    applicationsCount: data.applications.length,
    interviewsCount: data.interviews.length,
    contactsCount: data.contacts.length,
    notesCount: data.notes.length,
  };
}

export async function wipeAllDatabaseData(): Promise<void> {
  await clearAllData();
}
