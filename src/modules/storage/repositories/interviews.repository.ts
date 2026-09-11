import { getDB } from '../services/db';
import type { InterviewRound } from '../types/schema';

export async function getAllInterviews(): Promise<InterviewRound[]> {
  const db = await getDB();
  return db.getAll('interviews');
}

export async function getInterviewsByApplicationId(applicationId: string): Promise<InterviewRound[]> {
  const db = await getDB();
  return db.getAllFromIndex('interviews', 'by-applicationId', applicationId);
}

export async function saveInterview(interview: InterviewRound): Promise<void> {
  const db = await getDB();
  await db.put('interviews', interview);
}

export async function deleteInterview(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('interviews', id);
}
