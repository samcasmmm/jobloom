import type { Application, InterviewRound, Contact, NoteEntry } from '../types/schema';
import { saveApplication, getAllApplications } from '../repositories/applications.repository';
import { saveInterview } from '../repositories/interviews.repository';
import { saveContact } from '../repositories/contacts.repository';
import { saveNote } from '../repositories/notes.repository';

export async function seedSampleDataIfEmpty(): Promise<boolean> {
  const existing = await getAllApplications();
  if (existing && existing.length > 0) {
    return false;
  }

  const now = new Date();
  const subDays = (days: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - days);
    return d.toISOString();
  };
  const addDays = (days: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  // 1 Sample Application
  const sampleApp: Application = {
    id: 'app-stripe-01',
    company: 'Stripe',
    role: 'Staff Infrastructure Engineer',
    jobLink: 'https://stripe.com/jobs/staff-infra',
    location: 'Remote (US/EU)',
    salaryMin: 230000,
    salaryMax: 290000,
    source: 'Referral',
    status: 'Interview',
    appliedDate: subDays(14).split('T')[0],
    lastUpdated: subDays(1),
    followUpDate: addDays(4),
    createdAt: subDays(14),
    updatedAt: subDays(1),
  };

  await saveApplication(sampleApp);

  // 1 Sample Interview Round
  const sampleInterview: InterviewRound = {
    id: 'int-1',
    applicationId: 'app-stripe-01',
    type: 'System Design',
    mode: 'Online',
    scheduledAt: addDays(4) + 'T18:00:00Z',
    interviewerName: 'Alex Rivera',
    interviewerRole: 'Principal Architect',
    meetingLink: 'https://meet.google.com/str-arch-loop',
    outcome: 'Pending',
    notes: 'System design on distributed ledger write idempotency, rate limiting token buckets, and geo-replication.',
    createdAt: subDays(1),
  };

  await saveInterview(sampleInterview);

  // 1 Sample Contact
  const sampleContact: Contact = {
    id: 'con-1',
    name: 'Sarah Jenkins',
    role: 'Staff Technical Recruiter',
    company: 'Stripe',
    linkedinUrl: 'https://linkedin.com/in/sarah-jenkins-tech',
    email: 'sjenkins@stripe.com',
    notes: 'Very responsive on Slack & email. Prefers async updates.',
    applicationIds: ['app-stripe-01'],
    createdAt: subDays(10),
  };

  await saveContact(sampleContact);

  // 1 Sample Note
  const sampleNote: NoteEntry = {
    id: 'note-1',
    applicationId: 'app-stripe-01',
    type: 'auto',
    content: 'Application created for Staff Infrastructure Engineer at Stripe.',
    createdAt: subDays(14),
  };

  await saveNote(sampleNote);

  return true;
}
