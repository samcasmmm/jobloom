import { getDB } from '../services/db';
import type { Contact } from '../types/schema';

export async function getAllContacts(): Promise<Contact[]> {
  const db = await getDB();
  return db.getAll('contacts');
}

export async function getContactsByApplicationId(applicationId: string): Promise<Contact[]> {
  const all = await getAllContacts();
  return all.filter((c) => c.applicationIds.includes(applicationId));
}

export async function saveContact(contact: Contact): Promise<void> {
  const db = await getDB();
  await db.put('contacts', contact);
}

export async function deleteContact(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('contacts', id);
}
