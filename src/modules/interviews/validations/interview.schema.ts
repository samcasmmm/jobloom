import { z } from 'zod';

export const InterviewRoundTypeSchema = z.enum([
  'HR',
  'Tech',
  'Managerial',
  'System Design',
  'Culture Fit',
  'Assignment',
  'Other',
]);

export const InterviewModeSchema = z.enum(['Online', 'Offline', 'Phone']);

export const InterviewOutcomeSchema = z.enum(['Pending', 'Pass', 'Fail']);

export const InterviewRoundFormSchema = z.object({
  applicationId: z.string().min(1, 'Application ID is required'),
  type: InterviewRoundTypeSchema,
  mode: InterviewModeSchema,
  scheduledAt: z.string().min(1, 'Scheduled date and time are required'),
  interviewerName: z.string().max(100).optional().or(z.literal('')),
  interviewerRole: z.string().max(100).optional().or(z.literal('')),
  meetingLink: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  outcome: InterviewOutcomeSchema,
  notes: z.string().optional().or(z.literal('')),
});

export type InterviewRoundFormData = z.infer<typeof InterviewRoundFormSchema>;
