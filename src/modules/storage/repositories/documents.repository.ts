import { getDB } from '../services/db';
import type { DocumentFile } from '../types/schema';

export async function getAllDocuments(): Promise<DocumentFile[]> {
  const db = await getDB();
  return db.getAll('documents');
}

export async function getDocumentsByApplicationId(applicationId: string): Promise<DocumentFile[]> {
  const db = await getDB();
  return db.getAllFromIndex('documents', 'by-applicationId', applicationId);
}

export async function saveDocument(doc: DocumentFile): Promise<void> {
  const db = await getDB();
  await db.put('documents', doc);
}

export async function deleteDocument(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('documents', id);
}
