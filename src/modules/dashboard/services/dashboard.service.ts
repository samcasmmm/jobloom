import { getAllApplications } from '@/modules/storage/repositories/applications.repository';
import {
  computeDashboardMetrics,
  computeFunnelStages,
  computeSourceConversion,
  computeApplicationVelocity,
} from '../utils/analytics';
import type {
  DashboardMetrics,
  FunnelStageData,
  SourceConversionData,
  VelocityDataPoint,
} from '../types';

export interface DashboardSummaryPayload {
  metrics: DashboardMetrics;
  funnel: FunnelStageData[];
  sourceStats: SourceConversionData[];
  velocity: VelocityDataPoint[];
}

export async function fetchDashboardSummary(): Promise<DashboardSummaryPayload> {
  const applications = await getAllApplications();

  return {
    metrics: computeDashboardMetrics(applications),
    funnel: computeFunnelStages(applications),
    sourceStats: computeSourceConversion(applications),
    velocity: computeApplicationVelocity(applications),
  };
}
