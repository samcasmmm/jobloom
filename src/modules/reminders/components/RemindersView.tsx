'use client';

import React from 'react';
import { Clock, AlertTriangle, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import type { Application } from '@/modules/storage/types/schema';
import { formatDate } from '@/lib/date';

interface RemindersViewProps {
  applications: Application[];
  onSelectApplication: (app: Application) => void;
  onUpdateStatus: (id: string, newStatus: Application['status']) => Promise<void>;
  thresholdDays?: number;
}

export const RemindersView: React.FC<RemindersViewProps> = ({
  applications,
  onSelectApplication,
  onUpdateStatus,
  thresholdDays = 7,
}) => {
  const now = Date.now();

  // Heuristic 1: Inactive applications (> thresholdDays) in Applied / OA stage
  const staleApplications = applications
    .filter((a) => a.status === 'Applied' || a.status === 'OA')
    .map((app) => {
      const lastActive = new Date(app.lastUpdated || app.appliedDate).getTime();
      const daysSince = Math.floor((now - lastActive) / (1000 * 60 * 60 * 24));
      return { app, daysSince };
    })
    .filter((item) => item.daysSince >= thresholdDays)
    .sort((a, b) => b.daysSince - a.daysSince);

  // Heuristic 2: Explicit Follow-Up dates
  const explicitFollowUps = applications
    .filter((a) => Boolean(a.followUpDate))
    .map((app) => {
      const targetTime = new Date(app.followUpDate!).getTime();
      const diffDays = Math.ceil((targetTime - now) / (1000 * 60 * 60 * 24));
      return { app, diffDays, followUpDate: app.followUpDate! };
    })
    .sort((a, b) => a.diffDays - b.diffDays);

  return (
    <div className='w-full space-y-6 text-left'>
      {/* Top Header */}
      <div className='p-4 rounded-sm bg-[#090912]/80 border border-white/8 flex flex-wrap items-center justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-sm bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400'>
            <Clock className='w-5 h-5' />
          </div>
          <div>
            <h2 className='text-base font-bold text-white'>Follow-Up Intelligence & Heuristics</h2>
            <p className='text-xs text-zinc-400 font-mono'>
              Computed dynamically on-read. Zero background daemons or annoying push notifications.
            </p>
          </div>
        </div>

        <div className='inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-white/4 border border-white/10 text-xs font-mono text-zinc-300'>
          <ShieldCheck className='w-4 h-4 text-emerald-400' />
          <span>Threshold: {thresholdDays} days</span>
        </div>
      </div>

      {/* Grid: 2 Heuristic Categories */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Section 1: Inactivity Alerts */}
        <div className='p-6 rounded-sm bg-[#090912]/80 border border-white/8 shadow-none space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <AlertTriangle className='w-4 h-4 text-amber-400' />
              <h3 className='text-sm font-bold text-white'>Stale Recruiter Inactivity</h3>
            </div>
            <span className='text-xs font-mono text-amber-400 font-bold'>{staleApplications.length} flagged</span>
          </div>
          <p className='text-xs text-zinc-400'>
            Applications with no status change or candidate activity in over {thresholdDays} days.
          </p>

          <div className='space-y-3 mt-4'>
            {staleApplications.map(({ app, daysSince }) => (
              <div
                key={app.id}
                className='p-4 rounded-sm bg-white/3 border border-amber-500/20 hover:border-amber-500/40 transition-all flex items-center justify-between gap-4'
              >
                <div onClick={() => onSelectApplication(app)} className='min-w-0 cursor-pointer group'>
                  <span className='text-xs font-bold text-white group-hover:text-indigo-400 transition-colors block truncate'>
                    {app.company}
                  </span>
                  <span className='text-[11px] text-zinc-400 block truncate'>{app.role}</span>
                  <span className='text-[10px] text-amber-300/90 font-mono mt-0.5 block'>
                    {daysSince} days since last action • Stage: {app.status}
                  </span>
                </div>

                <div className='flex items-center gap-2 shrink-0'>
                  <button
                    type='button'
                    onClick={() => onUpdateStatus(app.id, 'Ghosted')}
                    className='px-2.5 py-1 rounded-sm bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/20 text-[11px] font-mono cursor-pointer'
                    title='Mark as Ghosted'
                  >
                    Mark Ghosted
                  </button>
                  <button
                    type='button'
                    onClick={() => onSelectApplication(app)}
                    className='p-1.5 rounded-sm text-zinc-400 hover:text-white cursor-pointer'
                  >
                    <ArrowRight className='w-4 h-4' />
                  </button>
                </div>
              </div>
            ))}

            {staleApplications.length === 0 && (
              <div className='py-10 text-center text-xs text-zinc-500 italic font-mono'>
                No stale applications detected. Everything is active!
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Scheduled Follow-Up Dates */}
        <div className='p-6 rounded-sm bg-[#090912]/80 border border-white/8 shadow-none space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Calendar className='w-4 h-4 text-purple-400' />
              <h3 className='text-sm font-bold text-white'>Scheduled Follow-Up Deadlines</h3>
            </div>
            <span className='text-xs font-mono text-purple-400 font-bold'>{explicitFollowUps.length} scheduled</span>
          </div>
          <p className='text-xs text-zinc-400'>
            Target dates manually configured to send a check-in note to the hiring team.
          </p>

          <div className='space-y-3 mt-4'>
            {explicitFollowUps.map(({ app, diffDays, followUpDate }) => (
              <div
                key={app.id}
                onClick={() => onSelectApplication(app)}
                className='p-4 rounded-sm bg-white/3 border border-white/8 hover:border-purple-500/40 transition-all cursor-pointer flex items-center justify-between gap-4'
              >
                <div className='min-w-0'>
                  <span className='text-xs font-bold text-white block truncate'>{app.company}</span>
                  <span className='text-[11px] text-zinc-400 block truncate'>{app.role}</span>
                  <span className='text-[10px] text-zinc-500 font-mono mt-0.5 block'>Scheduled: {formatDate(followUpDate)}</span>
                </div>

                <div className='shrink-0'>
                  <span
                    className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-sm border ${
                      diffDays < 0
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : diffDays === 0
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                    }`}
                  >
                    {diffDays < 0 ? `${Math.abs(diffDays)}d overdue` : diffDays === 0 ? 'Due Today' : `In ${diffDays}d`}
                  </span>
                </div>
              </div>
            ))}

            {explicitFollowUps.length === 0 && (
              <div className='py-10 text-center text-xs text-zinc-500 italic font-mono'>
                No follow-up dates scheduled on active applications.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
