import {
  getAllInterviews,
  getInterviewsByApplicationId,
  saveInterview,
  deleteInterview,
} from '@/modules/storage/repositories/interviews.repository';
import { saveNote } from '@/modules/storage/repositories/notes.repository';
import type { InterviewRound } from '../types';
import {
  InterviewRoundFormSchema,
  type InterviewRoundFormData,
} from '../validations/interview.schema';

export async function fetchInterviews(): Promise<InterviewRound[]> {
  return getAllInterviews();
}

export async function fetchInterviewsForApplication(applicationId: string): Promise<InterviewRound[]> {
  return getInterviewsByApplicationId(applicationId);
}

export async function createInterviewRound(data: InterviewRoundFormData): Promise<InterviewRound> {
  const validated = InterviewRoundFormSchema.parse(data);
  const now = new Date().toISOString();
  const id = crypto.randomUUID();

  const round: InterviewRound = {
    id,
    applicationId: validated.applicationId,
    type: validated.type,
    mode: validated.mode,
    scheduledAt: validated.scheduledAt,
    interviewerName: validated.interviewerName || undefined,
    interviewerRole: validated.interviewerRole || undefined,
    meetingLink: validated.meetingLink || undefined,
    outcome: validated.outcome,
    notes: validated.notes || undefined,
    createdAt: now,
  };

  await saveInterview(round);

  await saveNote({
    id: crypto.randomUUID(),
    applicationId: validated.applicationId,
    type: 'auto',
    content: `Added ${validated.type} interview scheduled for ${new Date(validated.scheduledAt).toLocaleString()}.`,
    createdAt: now,
  });

  return round;
}

export async function updateInterviewRound(id: string, data: InterviewRoundFormData): Promise<InterviewRound> {
  const validated = InterviewRoundFormSchema.parse(data);
  const now = new Date().toISOString();

  const round: InterviewRound = {
    id,
    applicationId: validated.applicationId,
    type: validated.type,
    mode: validated.mode,
    scheduledAt: validated.scheduledAt,
    interviewerName: validated.interviewerName || undefined,
    interviewerRole: validated.interviewerRole || undefined,
    meetingLink: validated.meetingLink || undefined,
    outcome: validated.outcome,
    notes: validated.notes || undefined,
    createdAt: now,
  };

  await saveInterview(round);
  return round;
}

export async function removeInterviewRound(id: string, applicationId: string): Promise<void> {
  await deleteInterview(id);
  await saveNote({
    id: crypto.randomUUID(),
    applicationId,
    type: 'auto',
    content: `Interview round deleted.`,
    createdAt: new Date().toISOString(),
  });
}
