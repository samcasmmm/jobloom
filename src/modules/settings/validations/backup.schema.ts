import { z } from 'zod';
import { ApplicationStatusSchema, ApplicationSourceSchema } from '@/modules/applications/validations';
import { InterviewRoundTypeSchema, InterviewModeSchema, InterviewOutcomeSchema } from '@/modules/interviews/validations';

export const BackupApplicationSchema = z.object({
  id: z.string(),
  company: z.string().min(1),
  role: z.string().min(1),
  jobLink: z.string().optional(),
  location: z.string().optional(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  source: ApplicationSourceSchema,
  status: ApplicationStatusSchema,
  appliedDate: z.string(),
  lastUpdated: z.string(),
  followUpDate: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const BackupInterviewSchema = z.object({
  id: z.string(),
  applicationId: z.string(),
  type: InterviewRoundTypeSchema,
  mode: InterviewModeSchema,
  scheduledAt: z.string(),
  interviewerName: z.string().optional(),
  interviewerRole: z.string().optional(),
  meetingLink: z.string().optional(),
  outcome: InterviewOutcomeSchema,
  notes: z.string().optional(),
  createdAt: z.string(),
});

export const BackupContactSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string().optional(),
  company: z.string().optional(),
  linkedinUrl: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  notes: z.string().optional(),
  applicationIds: z.array(z.string()),
  createdAt: z.string(),
});

export const BackupNoteSchema = z.object({
  id: z.string(),
  applicationId: z.string(),
  type: z.enum(['auto', 'manual']),
  content: z.string(),
  createdAt: z.string(),
});

export const BackupPayloadSchema = z.object({
  version: z.number(),
  exportedAt: z.string(),
  appName: z.literal('Jobloom'),
  applications: z.array(BackupApplicationSchema),
  interviews: z.array(BackupInterviewSchema),
  contacts: z.array(BackupContactSchema),
  notes: z.array(BackupNoteSchema),
});
