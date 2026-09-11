import type { Application, InterviewRound } from '@/modules/storage/types/schema';

export interface FollowUpReminderItem {
  application: Application;
  reason: 'follow_up_date_due' | 'inactivity_threshold';
  daysInactive: number;
}

export interface UpcomingInterviewItem {
  interview: InterviewRound;
  application?: Application;
  daysUntil: number;
  isToday: boolean;
}

export interface RemindersSummaryPayload {
  needsFollowUp: FollowUpReminderItem[];
  upcomingInterviews: UpcomingInterviewItem[];
}
