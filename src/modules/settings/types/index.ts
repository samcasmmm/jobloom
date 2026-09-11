import type {
  Settings,
  Application,
  InterviewRound,
  Contact,
  NoteEntry,
} from '@/modules/storage/types/schema';

export type { Settings } from '@/modules/storage/types/schema';

export interface DocumentExportMetadata {
  id: string;
  applicationId: string;
  type: string;
  label: string;
  fileName: string;
  mimeType: string;
  uploadedAt: string;
  base64Data?: string; // Serialized blob for JSON portability
}

export interface BackupPayload {
  version: number;
  exportedAt: string;
  appName: 'Jobloom';
  settings?: Settings;
  applications: Application[];
  interviews: InterviewRound[];
  contacts: Contact[];
  notes: NoteEntry[];
  documents?: DocumentExportMetadata[];
}
