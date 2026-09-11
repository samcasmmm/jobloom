import type { Application } from '../storage/types/schema';

export type { Application } from '../storage/types/schema';

export type ApplicationDraft = Omit<Application, 'id' | 'createdAt' | 'updatedAt' | 'lastUpdated'>;

export interface ApplicationFilterOptions {
  search?: string;
  status?: Application['status'][];
  source?: Application['source'][];
  startDate?: string;
  endDate?: string;
}

export type ApplicationSortField =
  | 'appliedDate'
  | 'lastUpdated'
  | 'company'
  | 'role'
  | 'createdAt';

export interface ApplicationSortOptions {
  field: ApplicationSortField;
  direction: 'asc' | 'desc';
}
