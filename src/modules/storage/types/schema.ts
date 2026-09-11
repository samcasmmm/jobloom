export interface Application {
  id: string;
  company: string;
  role: string;
  jobLink?: string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  source: 'LinkedIn' | 'Referral' | 'Naukri' | 'Wellfound' | 'Company Site' | 'Other' | (string & {});
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
  type: 'HR' | 'Tech' | 'Managerial' | 'System Design' | 'Culture Fit' | 'Assignment' | 'Other';
  mode: 'Online' | 'Offline' | 'Phone';
  scheduledAt: string; // ISO
  interviewerName?: string;
  interviewerRole?: string;
  meetingLink?: string;
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
  company?: string;
  linkedinUrl?: string;
  email?: string;
  phone?: string;
  notes?: string;
  applicationIds: string[]; // many-to-many
  createdAt: string;
}

export interface NoteEntry {
  id: string;
  applicationId: string; // FK
  type: 'auto' | 'manual'; // auto = system-generated activity log
  content: string;
  createdAt: string;
}

export interface Settings {
  id: 'app-settings'; // singleton key
  theme: 'light' | 'dark' | 'system';
  statusLabels: Record<Application['status'], string>;
  statusColors?: Record<Application['status'], string>;
  followUpThresholdDays: number; // used by "needs follow-up" computed filter
  lastBackupAt?: string;
}
