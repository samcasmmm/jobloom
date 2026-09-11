import { getAllApplications } from '@/modules/storage/repositories/applications.repository';
import { getAllInterviews } from '@/modules/storage/repositories/interviews.repository';
import { getSettings } from '@/modules/storage/repositories/settings.repository';
import { computeNeedsFollowUp, computeUpcomingInterviews } from '../utils/heuristics';
import type { RemindersSummaryPayload } from '../types';
import type { Application } from '@/modules/storage/types/schema';

export async function fetchRemindersSummary(): Promise<RemindersSummaryPayload> {
  const [applications, interviews, settings] = await Promise.all([
    getAllApplications(),
    getAllInterviews(),
    getSettings(),
  ]);

  const appMap = new Map<string, Application>();
  for (const app of applications) {
    appMap.set(app.id, app);
  }

  const threshold = settings.followUpThresholdDays || 7;

  return {
    needsFollowUp: computeNeedsFollowUp(applications, threshold),
    upcomingInterviews: computeUpcomingInterviews(interviews, appMap),
  };
}
