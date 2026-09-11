import {
  getNotesByApplicationId,
  saveNote,
  deleteNote,
} from '@/modules/storage/repositories/notes.repository';
import type { NoteEntry } from '../types';

export async function fetchTimelineNotes(applicationId: string): Promise<NoteEntry[]> {
  const notes = await getNotesByApplicationId(applicationId);
  return notes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function addManualNote(applicationId: string, content: string): Promise<NoteEntry> {
  const now = new Date().toISOString();
  const note: NoteEntry = {
    id: crypto.randomUUID(),
    applicationId,
    type: 'manual',
    content: content.trim(),
    createdAt: now,
  };

  await saveNote(note);
  return note;
}

export async function removeTimelineNote(id: string): Promise<void> {
  await deleteNote(id);
}
