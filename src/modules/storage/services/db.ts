import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type {
  Application,
  InterviewRound,
  DocumentFile,
  Contact,
  NoteEntry,
  Settings,
} from '../types/schema';

export interface JobTrackerDB extends DBSchema {
  applications: {
    key: string;
    value: Application;
    indexes: { 'by-status': string; 'by-company': string; 'by-appliedDate': string };
  };
  interviews: {
    key: string;
    value: InterviewRound;
    indexes: { 'by-applicationId': string };
  };
  documents: {
    key: string;
    value: DocumentFile;
    indexes: { 'by-applicationId': string };
  };
  contacts: {
    key: string;
    value: Contact;
  };
  notes: {
    key: string;
    value: NoteEntry;
    indexes: { 'by-applicationId': string };
  };
  settings: {
    key: string;
    value: Settings;
  };
}

export const DB_NAME = 'job-tracker-db';
export const DB_VERSION = 1;

export async function getDB(): Promise<IDBPDatabase<JobTrackerDB>> {
  return openDB<JobTrackerDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const apps = db.createObjectStore('applications', { keyPath: 'id' });
      apps.createIndex('by-status', 'status');
      apps.createIndex('by-company', 'company');
      apps.createIndex('by-appliedDate', 'appliedDate');

      const interviews = db.createObjectStore('interviews', { keyPath: 'id' });
      interviews.createIndex('by-applicationId', 'applicationId');

      const docs = db.createObjectStore('documents', { keyPath: 'id' });
      docs.createIndex('by-applicationId', 'applicationId');

      db.createObjectStore('contacts', { keyPath: 'id' });

      const notes = db.createObjectStore('notes', { keyPath: 'id' });
      notes.createIndex('by-applicationId', 'applicationId');

      db.createObjectStore('settings', { keyPath: 'id' });
    },
  });
}
