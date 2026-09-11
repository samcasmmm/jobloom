import type { Application, ApplicationFilters, ApplicationSort } from '../types';

export function filterApplications(applications: Application[], filters: ApplicationFilters): Application[] {
  return applications.filter((app) => {
    // Search query matching
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      const matchCompany = app.company.toLowerCase().includes(q);
      const matchRole = app.role.toLowerCase().includes(q);
      const matchLocation = app.location?.toLowerCase().includes(q) ?? false;
      if (!matchCompany && !matchRole && !matchLocation) return false;
    }

    // Status filter
    if (filters.status !== 'all' && app.status !== filters.status) {
      return false;
    }

    // Source filter
    if (filters.source !== 'all' && app.source !== filters.source) {
      return false;
    }

    // Date range filter
    if (filters.dateRange?.from && app.appliedDate < filters.dateRange.from) {
      return false;
    }
    if (filters.dateRange?.to && app.appliedDate > filters.dateRange.to) {
      return false;
    }

    return true;
  });
}

export function sortApplications(applications: Application[], sort: ApplicationSort): Application[] {
  return [...applications].sort((a, b) => {
    let comparison = 0;
    switch (sort.field) {
      case 'company':
        comparison = a.company.localeCompare(b.company);
        break;
      case 'appliedDate':
        comparison = new Date(a.appliedDate).getTime() - new Date(b.appliedDate).getTime();
        break;
      case 'lastUpdated':
        comparison = new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
        break;
      case 'salaryMax':
        comparison = (a.salaryMax || 0) - (b.salaryMax || 0);
        break;
    }
    return sort.direction === 'asc' ? comparison : -comparison;
  });
}
