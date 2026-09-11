import {
  getDocumentsByApplicationId,
  saveDocument,
  deleteDocument,
} from '@/modules/storage/repositories/documents.repository';
import { saveNote } from '@/modules/storage/repositories/notes.repository';
import type { DocumentFile } from '../types';

export async function fetchDocumentsForApplication(applicationId: string): Promise<DocumentFile[]> {
  return getDocumentsByApplicationId(applicationId);
}

export async function uploadDocument(
  applicationId: string,
  file: File,
  type: DocumentFile['type'],
  label: string
): Promise<DocumentFile> {
  const now = new Date().toISOString();
  const id = crypto.randomUUID();

  const doc: DocumentFile = {
    id,
    applicationId,
    type,
    label: label.trim() || file.name,
    blob: file,
    fileName: file.name,
    mimeType: file.type || 'application/octet-stream',
    uploadedAt: now,
  };

  await saveDocument(doc);

  await saveNote({
    id: crypto.randomUUID(),
    applicationId,
    type: 'auto',
    content: `Attached ${type} document '${doc.label}' (${file.name}).`,
    createdAt: now,
  });

  return doc;
}

export async function removeDocument(id: string, applicationId: string, label: string): Promise<void> {
  await deleteDocument(id);
  await saveNote({
    id: crypto.randomUUID(),
    applicationId,
    type: 'auto',
    content: `Removed document '${label}'.`,
    createdAt: new Date().toISOString(),
  });
}
