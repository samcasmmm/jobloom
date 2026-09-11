import type { Application, InterviewRound } from '@/modules/storage/types/schema';
import { daysSince } from '@/lib/date';
import type { FollowUpReminderItem, UpcomingInterviewItem } from '../types';

export function computeNeedsFollowUp(
  applications: Application[],
  thresholdDays: number = 7
): FollowUpReminderItem[] {
  const activeStatuses: Application['status'][] = ['Applied', 'OA', 'Interview'];
  const todayIso = new Date().toISOString().slice(0, 10);

  const results: FollowUpReminderItem[] = [];

  for (const app of applications) {
    if (!activeStatuses.includes(app.status)) continue;

    // Check 1: Explicit target follow-up date reached or passed
    if (app.followUpDate && app.followUpDate.slice(0, 10) <= todayIso) {
      results.push({
        application: app,
        reason: 'follow_up_date_due',
        daysInactive: daysSince(app.lastUpdated || app.appliedDate),
      });
      continue;
    }

    // Check 2: No activity for threshold days
    const inactiveDays = daysSince(app.lastUpdated || app.appliedDate);
    if (inactiveDays >= thresholdDays) {
      results.push({
        application: app,
        reason: 'inactivity_threshold',
        daysInactive: inactiveDays,
      });
    }
  }

  return results.sort((a, b) => b.daysInactive - a.daysInactive);
}

export function computeUpcomingInterviews(
  interviews: InterviewRound[],
  applicationsMap: Map<string, Application>
): UpcomingInterviewItem[] {
  const now = Date.now();
  const todayDateStr = new Date().toISOString().slice(0, 10);

  const pending = interviews.filter((i) => i.outcome === 'Pending');

  const upcoming: UpcomingInterviewItem[] = [];

  for (const interview of pending) {
    try {
      const scheduledTime = new Date(interview.scheduledAt).getTime();
      if (scheduledTime >= now - 1000 * 60 * 60 * 2) {
        // Upcoming or happened within last 2 hours
        const daysUntil = Math.ceil((scheduledTime - now) / (1000 * 60 * 60 * 24));
        const isToday = interview.scheduledAt.slice(0, 10) === todayDateStr;

        upcoming.push({
          interview,
          application: applicationsMap.get(interview.applicationId),
          daysUntil,
          isToday,
        });
      }
    } catch {}
  }

  return upcoming.sort(
    (a, b) =>
      new Date(a.interview.scheduledAt).getTime() - new Date(b.interview.scheduledAt).getTime()
  );
}
