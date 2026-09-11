import type { Application } from '@/modules/storage/types/schema';
import type {
  DashboardMetrics,
  FunnelStageData,
  VelocityDataPoint,
  SourceConversionData,
} from '../types';

export function computeDashboardMetrics(applications: Application[]): DashboardMetrics {
  const total = applications.length;
  if (total === 0) {
    return {
      totalApplications: 0,
      activeApplications: 0,
      offersReceived: 0,
      interviewsScheduled: 0,
      rejectionRate: 0,
      ghostingRate: 0,
    };
  }

  const active = applications.filter(
    (a) => a.status === 'Applied' || a.status === 'OA' || a.status === 'Interview'
  ).length;

  const offers = applications.filter((a) => a.status === 'Offer').length;
  const interviews = applications.filter((a) => a.status === 'Interview').length;
  const rejected = applications.filter((a) => a.status === 'Rejected').length;
  const ghosted = applications.filter((a) => a.status === 'Ghosted').length;

  return {
    totalApplications: total,
    activeApplications: active,
    offersReceived: offers,
    interviewsScheduled: interviews,
    rejectionRate: Math.round((rejected / total) * 100),
    ghostingRate: Math.round((ghosted / total) * 100),
  };
}

export function computeFunnelStages(applications: Application[]): FunnelStageData[] {
  const appliedCount = applications.filter((a) => a.status !== 'Wishlist').length;
  const oasCount = applications.filter((a) => ['OA', 'Interview', 'Offer'].includes(a.status)).length;
  const interviewCount = applications.filter((a) => ['Interview', 'Offer'].includes(a.status)).length;
  const offerCount = applications.filter((a) => a.status === 'Offer').length;

  return [
    {
      stage: 'Applied',
      count: appliedCount,
      conversionRate: 100,
    },
    {
      stage: 'OA / Screen',
      count: oasCount,
      conversionRate: appliedCount > 0 ? Math.round((oasCount / appliedCount) * 100) : 0,
    },
    {
      stage: 'Interview',
      count: interviewCount,
      conversionRate: oasCount > 0 ? Math.round((interviewCount / oasCount) * 100) : 0,
    },
    {
      stage: 'Offer',
      count: offerCount,
      conversionRate: interviewCount > 0 ? Math.round((offerCount / interviewCount) * 100) : 0,
    },
  ];
}

export function computeSourceConversion(applications: Application[]): SourceConversionData[] {
  const sources: Application['source'][] = [
    'LinkedIn',
    'Referral',
    'Naukri',
    'Wellfound',
    'Company Site',
    'Other',
  ];

  return sources.map((source) => {
    const fromSource = applications.filter((a) => a.source === source);
    const applied = fromSource.length;
    const interviewed = fromSource.filter((a) => ['Interview', 'Offer'].includes(a.status)).length;
    const offers = fromSource.filter((a) => a.status === 'Offer').length;

    return {
      source,
      applied,
      interviewed,
      offers,
      conversionRate: applied > 0 ? Math.round((offers / applied) * 100) : 0,
    };
  });
}

export function computeApplicationVelocity(applications: Application[]): VelocityDataPoint[] {
  const dateMap = new Map<string, number>();

  for (const app of applications) {
    const date = app.appliedDate ? app.appliedDate.slice(0, 10) : 'Unknown';
    dateMap.set(date, (dateMap.get(date) || 0) + 1);
  }

  return Array.from(dateMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
