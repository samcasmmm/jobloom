import type { Application } from '@/modules/storage/types/schema';

export type { Application } from '@/modules/storage/types/schema';

export type ApplicationDraft = Omit<Application, 'id' | 'createdAt' | 'updatedAt' | 'lastUpdated'>;

export interface ApplicationFilters {
  search: string;
  status: Application['status'] | 'all';
  source: Application['source'] | 'all';
  dateRange?: {
    from?: string;
    to?: string;
  };
}

export type ApplicationSortField = 'appliedDate' | 'lastUpdated' | 'company' | 'salaryMax';
export type SortDirection = 'asc' | 'desc';

export interface ApplicationSort {
  field: ApplicationSortField;
  direction: SortDirection;
}
