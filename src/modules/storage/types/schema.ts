export interface Application {
  id: string; // uuid
  company: string;
  role: string;
  jobLink?: string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  source: 'LinkedIn' | 'Referral' | 'Naukri' | 'Company Site' | 'Other';
  status: 'Wishlist' | 'Applied' | 'OA' | 'Interview' | 'Offer' | 'Rejected' | 'Ghosted';
  appliedDate: string; // ISO
  lastUpdated: string; // ISO
  followUpDate?: string; // ISO
  createdAt: string;
  updatedAt: string;
}

export interface InterviewRound {
  id: string;
  applicationId: string; // FK
  type: 'HR' | 'Tech' | 'Managerial' | 'System Design' | 'Other';
  mode: 'Online' | 'Offline' | 'Phone';
  scheduledAt: string; // ISO
  outcome: 'Pending' | 'Pass' | 'Fail';
  notes?: string;
  createdAt: string;
}

export interface DocumentFile {
  id: string;
  applicationId: string; // FK
  type: 'Resume' | 'CoverLetter' | 'Other';
  label: string; // e.g. "Resume_v2"
  blob: Blob;
  fileName: string;
  mimeType: string;
  uploadedAt: string;
}

export interface Contact {
  id: string;
  name: string;
  role?: string;
  linkedinUrl?: string;
  email?: string;
  notes?: string;
  applicationIds: string[]; // many-to-many
  createdAt: string;
}

export interface NoteEntry {
  id: string;
  applicationId: string; // FK
  type: 'auto' | 'manual'; // auto = system-generated log
  content: string;
  createdAt: string;
}

export interface Settings {
  id: 'app-settings'; // singleton key
  theme: 'light' | 'dark';
  statusLabels: Record<Application['status'], string>;
  lastBackupAt?: string;
}
