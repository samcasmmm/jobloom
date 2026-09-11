import type { Application } from '@/modules/storage/types/schema';

export interface DashboardMetrics {
  totalApplications: number;
  activeApplications: number;
  offersReceived: number;
  interviewsScheduled: number;
  rejectionRate: number; // percentage
  ghostingRate: number; // percentage
}

export interface FunnelStageData {
  stage: string;
  count: number;
  conversionRate: number; // percentage from previous stage
}

export interface VelocityDataPoint {
  date: string; // YYYY-MM-DD or Week label
  count: number;
}

export interface SourceConversionData {
  source: Application['source'];
  applied: number;
  interviewed: number;
  offers: number;
  conversionRate: number; // offers / applied
}
