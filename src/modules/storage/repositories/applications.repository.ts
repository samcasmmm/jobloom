import { getDB } from '../services/db';
import type { Application } from '../types/schema';

export async function getAllApplications(): Promise<Application[]> {
  const db = await getDB();
  return db.getAll('applications');
}

export async function getApplicationById(id: string): Promise<Application | undefined> {
  const db = await getDB();
  return db.get('applications', id);
}

export async function getApplicationsByStatus(status: Application['status']): Promise<Application[]> {
  const db = await getDB();
  return db.getAllFromIndex('applications', 'by-status', status);
}

export async function saveApplication(app: Application): Promise<void> {
  const db = await getDB();
  await db.put('applications', app);
}

export async function deleteApplication(id: string): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(['applications', 'interviews', 'documents', 'notes'], 'readwrite');
  
  // Delete application
  await tx.objectStore('applications').delete(id);
  
  // Clean up cascade foreign keys
  const interviewIdx = tx.objectStore('interviews').index('by-applicationId');
  let interviewCursor = await interviewIdx.openCursor(id);
  while (interviewCursor) {
    await interviewCursor.delete();
    interviewCursor = await interviewCursor.continue();
  }

  const docIdx = tx.objectStore('documents').index('by-applicationId');
  let docCursor = await docIdx.openCursor(id);
  while (docCursor) {
    await docCursor.delete();
    docCursor = await docCursor.continue();
  }

  const noteIdx = tx.objectStore('notes').index('by-applicationId');
  let noteCursor = await noteIdx.openCursor(id);
  while (noteCursor) {
    await noteCursor.delete();
    noteCursor = await noteCursor.continue();
  }

  await tx.done;
}

export async function bulkDeleteApplications(ids: string[]): Promise<void> {
  for (const id of ids) {
    await deleteApplication(id);
  }
}

export async function bulkUpdateStatus(ids: string[], status: Application['status']): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('applications', 'readwrite');
  const store = tx.objectStore('applications');
  const now = new Date().toISOString();

  for (const id of ids) {
    const app = await store.get(id);
    if (app) {
      app.status = status;
      app.lastUpdated = now;
      app.updatedAt = now;
      await store.put(app);
    }
  }
  await tx.done;
}
