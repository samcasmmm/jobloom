import {
  getAllContacts,
  getContactsByApplicationId,
  saveContact,
  deleteContact,
} from '@/modules/storage/repositories/contacts.repository';
import type { Contact } from '../types';
import { ContactFormSchema, type ContactFormData } from '../validations/contact.schema';

export async function fetchAllContacts(): Promise<Contact[]> {
  return getAllContacts();
}

export async function fetchContactsForApplication(applicationId: string): Promise<Contact[]> {
  return getContactsByApplicationId(applicationId);
}

export async function createContact(data: ContactFormData): Promise<Contact> {
  const validated = ContactFormSchema.parse(data);
  const now = new Date().toISOString();
  const id = crypto.randomUUID();

  const contact: Contact = {
    id,
    name: validated.name.trim(),
    role: validated.role || undefined,
    company: validated.company || undefined,
    linkedinUrl: validated.linkedinUrl || undefined,
    email: validated.email || undefined,
    phone: validated.phone || undefined,
    notes: validated.notes || undefined,
    applicationIds: validated.applicationIds,
    createdAt: now,
  };

  await saveContact(contact);
  return contact;
}

export async function updateContact(id: string, data: ContactFormData): Promise<Contact> {
  const validated = ContactFormSchema.parse(data);
  const now = new Date().toISOString();

  const contact: Contact = {
    id,
    name: validated.name.trim(),
    role: validated.role || undefined,
    company: validated.company || undefined,
    linkedinUrl: validated.linkedinUrl || undefined,
    email: validated.email || undefined,
    phone: validated.phone || undefined,
    notes: validated.notes || undefined,
    applicationIds: validated.applicationIds,
    createdAt: now,
  };

  await saveContact(contact);
  return contact;
}

export async function removeContact(id: string): Promise<void> {
  await deleteContact(id);
}
