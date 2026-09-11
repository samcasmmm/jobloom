import { getDB } from '../services/db';
import type { NoteEntry } from '../types/schema';

export async function getNotesByApplicationId(applicationId: string): Promise<NoteEntry[]> {
  const db = await getDB();
  return db.getAllFromIndex('notes', 'by-applicationId', applicationId);
}

export async function saveNote(note: NoteEntry): Promise<void> {
  const db = await getDB();
  await db.put('notes', note);
}

export async function deleteNote(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('notes', id);
}
