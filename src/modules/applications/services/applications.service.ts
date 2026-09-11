import {
  getAllApplications,
  getApplicationById,
  saveApplication,
  deleteApplication as deleteAppRepo,
  bulkDeleteApplications as bulkDeleteRepo,
  bulkUpdateStatus as bulkUpdateRepo,
} from '@/modules/storage/repositories/applications.repository';
import { saveNote } from '@/modules/storage/repositories/notes.repository';
import type { Application } from '../types';
import { ApplicationFormSchema, type ApplicationFormData } from '../validations/application.schema';

export async function fetchApplications(): Promise<Application[]> {
  return getAllApplications();
}

export async function fetchApplicationById(id: string): Promise<Application | undefined> {
  return getApplicationById(id);
}

export async function createApplication(data: ApplicationFormData): Promise<Application> {
  // Validate at service boundary
  const validated = ApplicationFormSchema.parse(data);
  const now = new Date().toISOString();
  const id = crypto.randomUUID();

  const app: Application = {
    id,
    company: validated.company.trim(),
    role: validated.role.trim(),
    jobLink: validated.jobLink || undefined,
    location: validated.location || undefined,
    salaryMin: validated.salaryMin,
    salaryMax: validated.salaryMax,
    source: validated.source,
    status: validated.status,
    appliedDate: validated.appliedDate,
    lastUpdated: now,
    followUpDate: validated.followUpDate || undefined,
    createdAt: now,
    updatedAt: now,
  };

  await saveApplication(app);

  // Auto-log initial creation in timeline notes
  await saveNote({
    id: crypto.randomUUID(),
    applicationId: id,
    type: 'auto',
    content: `Application created for ${app.role} at ${app.company} with status '${app.status}'.`,
    createdAt: now,
  });

  return app;
}

export async function updateApplication(id: string, data: Partial<ApplicationFormData>): Promise<Application> {
  const existing = await getApplicationById(id);
  if (!existing) {
    throw new Error(`Application with id ${id} not found`);
  }

  const merged = {
    ...existing,
    ...data,
  };

  const validated = ApplicationFormSchema.parse(merged);
  const now = new Date().toISOString();

  const isStatusChanged = existing.status !== validated.status;

  const updated: Application = {
    ...existing,
    company: validated.company.trim(),
    role: validated.role.trim(),
    jobLink: validated.jobLink || undefined,
    location: validated.location || undefined,
    salaryMin: validated.salaryMin,
    salaryMax: validated.salaryMax,
    source: validated.source,
    status: validated.status,
    appliedDate: validated.appliedDate,
    lastUpdated: now,
    followUpDate: validated.followUpDate || undefined,
    updatedAt: now,
  };

  await saveApplication(updated);

  if (isStatusChanged) {
    await saveNote({
      id: crypto.randomUUID(),
      applicationId: id,
      type: 'auto',
      content: `Status changed from '${existing.status}' to '${validated.status}'.`,
      createdAt: now,
    });
  }

  return updated;
}

export async function updateApplicationStatus(id: string, newStatus: Application['status']): Promise<void> {
  const existing = await getApplicationById(id);
  if (!existing) return;

  const now = new Date().toISOString();
  existing.status = newStatus;
  existing.lastUpdated = now;
  existing.updatedAt = now;

  await saveApplication(existing);

  await saveNote({
    id: crypto.randomUUID(),
    applicationId: id,
    type: 'auto',
    content: `Status changed to '${newStatus}'.`,
    createdAt: now,
  });
}

export async function removeApplication(id: string): Promise<void> {
  await deleteAppRepo(id);
}

export async function removeBulkApplications(ids: string[]): Promise<void> {
  await bulkDeleteRepo(ids);
}

export async function updateBulkStatus(ids: string[], status: Application['status']): Promise<void> {
  await bulkUpdateRepo(ids, status);
}
