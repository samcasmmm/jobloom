'use client';

import React from 'react';
import {
  TrendingUp,
  Award,
  Layers,
  Clock,
  Briefcase,
  DollarSign,
  PieChart,
  Calendar,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import type { Application, InterviewRound } from '@/modules/storage/types/schema';
import { STATUS_CONFIG, STATUS_ORDER } from '@/lib/status-colors';

interface DashboardViewProps {
  applications: Application[];
  interviews: InterviewRound[];
  onSelectApplication: (app: Application) => void;
  onNavigateToTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  applications,
  interviews,
  onSelectApplication,
  onNavigateToTab,
}) => {
  const total = applications.length;
  const active = applications.filter(
    (a) => a.status === 'Applied' || a.status === 'OA' || a.status === 'Interview'
  ).length;
  const offers = applications.filter((a) => a.status === 'Offer').length;
  const rejected = applications.filter((a) => a.status === 'Rejected').length;
  const ghosted = applications.filter((a) => a.status === 'Ghosted').length;

  const offerRate = total > 0 ? ((offers / total) * 100).toFixed(1) : '0';
  const ghostRate = total > 0 ? ((ghosted / total) * 100).toFixed(1) : '0';

  // Calculate Median / Average Salary
  const salaries = applications
    .filter((a) => a.salaryMin || a.salaryMax)
    .map((a) => (a.salaryMax ? (a.salaryMin ? (a.salaryMin + a.salaryMax) / 2 : a.salaryMax) : a.salaryMin || 0));
  const avgSalary =
    salaries.length > 0
      ? (salaries.reduce((acc, s) => acc + s, 0) / salaries.length).toFixed(0)
      : '0';

  // Funnel counts
  const funnelStages: Application['status'][] = ['Wishlist', 'Applied', 'OA', 'Interview', 'Offer'];
  const funnelData = funnelStages.map((st) => ({
    stage: st,
    label: STATUS_CONFIG[st]?.label || st,
    count: applications.filter((a) => a.status === st).length,
    color: STATUS_CONFIG[st]?.bg || 'bg-zinc-700',
  }));

  // Source breakdown
  const sourceMap: Record<string, number> = {};
  applications.forEach((a) => {
    sourceMap[a.source] = (sourceMap[a.source] || 0) + 1;
  });

  // Upcoming interviews
  const upcomingInterviews = interviews
    .filter((i) => i.outcome === 'Pending')
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, 4);

  // Stale applications needing follow-up (>7 days)
  const staleApps = applications
    .filter((a) => a.status === 'Applied' || a.status === 'OA')
    .filter((a) => {
      const days = Math.floor(
        (Date.now() - new Date(a.lastUpdated || a.appliedDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      return days >= 7;
    })
    .slice(0, 4);

  return (
    <div className='w-full space-y-6 text-left'>
      {/* 4 Summary Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {/* Card 1: Active Applications */}
        <div className='p-5 rounded-sm bg-[#090912]/80 border border-white/8 shadow-none'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-mono text-zinc-400 font-bold'>ACTIVE PIPELINE</span>
            <div className='w-8 h-8 rounded-sm bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400'>
              <Briefcase className='w-4 h-4' />
            </div>
          </div>
          <div className='mt-4 flex items-baseline gap-2'>
            <span className='text-3xl font-black text-white'>{active}</span>
            <span className='text-xs text-zinc-500 font-mono'>/ {total} total</span>
          </div>
          <p className='text-[11px] text-zinc-400 mt-1'>Applied, OA, and Interview stages</p>
        </div>

        {/* Card 2: Offers & Rate */}
        <div className='p-5 rounded-sm bg-[#090912]/80 border border-white/8 shadow-none'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-mono text-emerald-400 font-bold'>OFFERS RECEIVED</span>
            <div className='w-8 h-8 rounded-sm bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400'>
              <Award className='w-4 h-4' />
            </div>
          </div>
          <div className='mt-4 flex items-baseline gap-2'>
            <span className='text-3xl font-black text-emerald-400'>{offers}</span>
            <span className='text-xs text-emerald-400/80 font-mono'>({offerRate}% rate)</span>
          </div>
          <p className='text-[11px] text-zinc-400 mt-1'>Converted to formal compensation packages</p>
        </div>

        {/* Card 3: Target Salary */}
        <div className='p-5 rounded-sm bg-[#090912]/80 border border-white/8 shadow-none'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-mono text-cyan-400 font-bold'>AVG TARGET SALARY</span>
            <div className='w-8 h-8 rounded-sm bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400'>
              <DollarSign className='w-4 h-4' />
            </div>
          </div>
          <div className='mt-4 flex items-baseline gap-2'>
            <span className='text-3xl font-black text-white'>
              ${Number(avgSalary) > 0 ? (Number(avgSalary) / 1000).toFixed(0) + 'k' : '—'}
            </span>
            <span className='text-xs text-zinc-500 font-mono'>base midpoint</span>
          </div>
          <p className='text-[11px] text-zinc-400 mt-1'>Computed across tracked listings</p>
        </div>

        {/* Card 4: Ghosting Rate */}
        <div className='p-5 rounded-sm bg-[#090912]/80 border border-white/8 shadow-none'>
          <div className='flex items-center justify-between'>
            <span className='text-xs font-mono text-amber-400 font-bold'>GHOSTED / STALE</span>
            <div className='w-8 h-8 rounded-sm bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400'>
              <Clock className='w-4 h-4' />
            </div>
          </div>
          <div className='mt-4 flex items-baseline gap-2'>
            <span className='text-3xl font-black text-amber-400'>{ghosted}</span>
            <span className='text-xs text-amber-400/80 font-mono'>({ghostRate}% rate)</span>
          </div>
          <p className='text-[11px] text-zinc-400 mt-1'>No response after recruiter engagement</p>
        </div>
      </div>

      {/* Row 2: Funnel Chart & Source Conversion */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Pipeline Funnel Visualizer (Span 2) */}
        <div className='lg:col-span-2 p-6 rounded-sm bg-[#090912]/80 border border-white/8 shadow-none flex flex-col justify-between'>
          <div>
            <div className='flex items-center justify-between mb-4'>
              <div>
                <h3 className='text-sm font-bold text-white'>Application Pipeline Funnel</h3>
                <p className='text-xs text-zinc-400'>Progression conversion from Wishlist to Offer</p>
              </div>
              <span className='text-xs font-mono text-zinc-400'>
                {total > 0 ? `${((active / total) * 100).toFixed(0)}% In-Flight` : '0%'}
              </span>
            </div>

            <div className='space-y-3.5 mt-6'>
              {funnelData.map((stage) => {
                const pct = total > 0 ? Math.max((stage.count / total) * 100, 4) : 4;
                return (
                  <div key={stage.stage} className='space-y-1.5'>
                    <div className='flex items-center justify-between text-xs font-mono'>
                      <span className='text-zinc-300 font-semibold'>{stage.label}</span>
                      <span className='text-zinc-400'>
                        {stage.count} ({total > 0 ? ((stage.count / total) * 100).toFixed(0) : 0}%)
                      </span>
                    </div>
                    <div className='w-full h-3 rounded-sm bg-white/5 overflow-hidden p-0.5'>
                      <div
                        className={`h-full rounded-xs transition-all duration-500 ${
                          stage.stage === 'Offer'
                            ? 'bg-emerald-400'
                            : stage.stage === 'Interview'
                              ? 'bg-purple-400'
                              : stage.stage === 'OA'
                                ? 'bg-amber-400'
                                : stage.stage === 'Applied'
                                  ? 'bg-blue-400'
                                  : 'bg-zinc-400'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className='mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500 font-mono'>
            <span>Computed locally with zero analytics beacons</span>
            <button
              type='button'
              onClick={() => onNavigateToTab('applications')}
              className='text-indigo-400 hover:underline font-bold'
            >
              View Kanban Board →
            </button>
          </div>
        </div>

        {/* Source Breakdown (Span 1) */}
        <div className='p-6 rounded-sm bg-[#090912]/80 border border-white/8 shadow-none flex flex-col justify-between'>
          <div>
            <h3 className='text-sm font-bold text-white'>Application Channels</h3>
            <p className='text-xs text-zinc-400 mb-4'>Volume by referral and discovery source</p>

            <div className='space-y-3'>
              {Object.entries(sourceMap).map(([src, count]) => (
                <div key={src} className='p-3 rounded-sm bg-white/3 border border-white/5 flex items-center justify-between'>
                  <span className='text-xs font-mono font-medium text-zinc-200'>{src}</span>
                  <div className='flex items-center gap-2'>
                    <span className='text-xs font-bold text-white font-mono'>{count}</span>
                    <span className='text-[10px] text-zinc-500 font-mono'>
                      ({total > 0 ? ((count / total) * 100).toFixed(0) : 0}%)
                    </span>
                  </div>
                </div>
              ))}

              {Object.keys(sourceMap).length === 0 && (
                <p className='text-xs text-zinc-500 italic text-center py-6'>No source data available.</p>
              )}
            </div>
          </div>

          <div className='pt-4 border-t border-white/5 text-[11px] text-zinc-500'>
            Top performing: <span className='text-indigo-300 font-bold'>Referrals & Wellfound</span>
          </div>
        </div>
      </div>

      {/* Row 3: Upcoming Interviews & Stale Follow-ups */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Upcoming Interview Loops */}
        <div className='p-6 rounded-sm bg-[#090912]/80 border border-white/8 shadow-none'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-2'>
              <Calendar className='w-4 h-4 text-purple-400' />
              <h3 className='text-sm font-bold text-white'>Upcoming Interview Loops</h3>
            </div>
            <button
              type='button'
              onClick={() => onNavigateToTab('interviews')}
              className='text-xs font-mono text-indigo-400 hover:underline'
            >
              All Interviews →
            </button>
          </div>

          <div className='space-y-3'>
            {upcomingInterviews.map((int) => {
              const app = applications.find((a) => a.id === int.applicationId);
              return (
                <div
                  key={int.id}
                  onClick={() => app && onSelectApplication(app)}
                  className='p-3.5 rounded-sm bg-white/3 border border-white/8 hover:border-purple-500/40 transition-all cursor-pointer'
                >
                  <div className='flex items-center justify-between'>
                    <span className='text-xs font-bold text-white'>
                      {app ? `${app.company} — ${int.type} Round` : `${int.type} Round`}
                    </span>
                    <span className='text-[10px] font-mono px-2 py-0.5 rounded-sm bg-amber-500/20 text-amber-300 border border-amber-500/30'>
                      Pending
                    </span>
                  </div>
                  <div className='mt-1 text-[11px] text-zinc-400 font-mono flex items-center gap-2'>
                    <span>{new Date(int.scheduledAt).toLocaleString()}</span>
                    {int.interviewerName && <span>• {int.interviewerName}</span>}
                  </div>
                </div>
              );
            })}

            {upcomingInterviews.length === 0 && (
              <p className='text-xs text-zinc-500 italic py-6 text-center'>No upcoming interview loops scheduled.</p>
            )}
          </div>
        </div>

        {/* Needs Follow-Up Alert Heuristics */}
        <div className='p-6 rounded-sm bg-[#090912]/80 border border-white/8 shadow-none'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-2'>
              <AlertCircle className='w-4 h-4 text-amber-400' />
              <h3 className='text-sm font-bold text-white'>Applications Needing Follow-up</h3>
            </div>
            <button
              type='button'
              onClick={() => onNavigateToTab('reminders')}
              className='text-xs font-mono text-indigo-400 hover:underline'
            >
              View Heuristics →
            </button>
          </div>

          <div className='space-y-3'>
            {staleApps.map((app) => {
              const days = Math.floor(
                (Date.now() - new Date(app.lastUpdated || app.appliedDate).getTime()) / (1000 * 60 * 60 * 24)
              );
              return (
                <div
                  key={app.id}
                  onClick={() => app && onSelectApplication(app)}
                  className='p-3.5 rounded-sm bg-white/3 border border-white/8 hover:border-amber-500/40 transition-all cursor-pointer flex items-center justify-between'
                >
                  <div>
                    <span className='text-xs font-bold text-white'>{app.company}</span>
                    <span className='block text-[11px] text-zinc-400'>{app.role}</span>
                  </div>
                  <span className='text-[10px] font-mono px-2 py-0.5 rounded-sm bg-amber-500/15 text-amber-300 border border-amber-500/30'>
                    {days} days inactive
                  </span>
                </div>
              );
            })}

            {staleApps.length === 0 && (
              <p className='text-xs text-zinc-500 italic py-6 text-center'>
                All applications are up to date within the 7-day window.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
