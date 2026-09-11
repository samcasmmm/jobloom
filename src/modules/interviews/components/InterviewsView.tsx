'use client';

import React, { useState } from 'react';
import { Layers, Calendar, ExternalLink, Users, Trash2 } from 'lucide-react';
import type { Application, InterviewRound } from '@/modules/storage/types/schema';
import { deleteInterview } from '@/modules/storage/repositories/interviews.repository';
import { SelectDropdown } from '@/components/ui';

interface InterviewsViewProps {
  applications: Application[];
  interviews: InterviewRound[];
  onSelectApplication: (app: Application) => void;
  onRefresh: () => Promise<void>;
}

export const InterviewsView: React.FC<InterviewsViewProps> = ({
  applications,
  interviews,
  onSelectApplication,
  onRefresh,
}) => {
  const [filterOutcome, setFilterOutcome] = useState<'All' | 'Pending' | 'Pass' | 'Fail'>('All');
  const [filterType, setFilterType] = useState<string>('All');

  const filteredInterviews = interviews.filter((item) => {
    if (filterOutcome !== 'All' && item.outcome !== filterOutcome) return false;
    if (filterType !== 'All' && item.type !== filterType) return false;
    return true;
  });

  const handleDelete = async (id: string) => {
    await deleteInterview(id);
    await onRefresh();
  };

  const appMap = new Map(applications.map((a) => [a.id, a]));

  return (
    <div className='w-full space-y-6 text-left'>
      {/* Top Header & Filters */}
      <div className='flex flex-wrap items-center justify-between gap-4 p-4 rounded-sm bg-[#090912]/80 border border-white/8'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-sm bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400'>
            <Layers className='w-5 h-5' />
          </div>
          <div>
            <h2 className='text-base font-bold text-white'>Technical & HR Interview Hub</h2>
            <p className='text-xs text-zinc-400 font-mono'>
              {interviews.length} total round{interviews.length === 1 ? '' : 's'} across active pipelines
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className='flex items-center gap-3 text-xs'>
          <div className='h-8 p-0.5 flex items-center gap-0.5 bg-white/4 rounded-sm border border-white/10'>
            {(['All', 'Pending', 'Pass', 'Fail'] as const).map((outcome) => (
              <button
                key={outcome}
                type='button'
                onClick={() => setFilterOutcome(outcome)}
                className={`h-full px-3 rounded-xs font-mono font-medium transition-all cursor-pointer flex items-center justify-center text-xs ${
                  filterOutcome === outcome
                    ? 'bg-indigo-600 text-white font-bold shadow-none'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {outcome}
              </button>
            ))}
          </div>

          <SelectDropdown
            value={filterType}
            onChange={setFilterType}
            options={[
              { value: 'All', label: 'All Round Types' },
              { value: 'Tech', label: 'Technical / Coding' },
              { value: 'System Design', label: 'System Design' },
              { value: 'HR', label: 'HR & Recruiter' },
              { value: 'Managerial', label: 'Managerial' },
              { value: 'Assignment', label: 'Assignment' },
            ]}
            size='sm'
          />
        </div>
      </div>

      {/* Interviews Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {filteredInterviews.map((round) => {
          const app = appMap.get(round.applicationId);

          return (
            <div
              key={round.id}
              className='p-5 rounded-sm bg-[#090912]/80 border border-white/8 hover:border-purple-500/40 transition-all flex flex-col justify-between shadow-none'
            >
              <div>
                <div className='flex items-start justify-between gap-2'>
                  <div>
                    <span
                      onClick={() => app && onSelectApplication(app)}
                      className='text-xs font-bold text-indigo-400 hover:underline cursor-pointer block'
                    >
                      {app?.company || 'Unknown Company'}
                    </span>
                    <h3 className='text-sm font-bold text-white mt-0.5'>{round.type} Round</h3>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-sm border ${
                      round.outcome === 'Pass'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : round.outcome === 'Fail'
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {round.outcome}
                  </span>
                </div>

                <div className='mt-3.5 space-y-1.5 text-xs text-zinc-400 font-mono'>
                  <div className='flex items-center gap-2'>
                    <Calendar className='w-3.5 h-3.5 text-zinc-500 shrink-0' />
                    <span>{new Date(round.scheduledAt).toLocaleString()}</span>
                  </div>

                  {round.interviewerName && (
                    <div className='flex items-center gap-2'>
                      <Users className='w-3.5 h-3.5 text-zinc-500 shrink-0' />
                      <span className='truncate'>
                        {round.interviewerName} {round.interviewerRole ? `(${round.interviewerRole})` : ''}
                      </span>
                    </div>
                  )}

                  {round.meetingLink && (
                    <div className='flex items-center gap-2'>
                      <ExternalLink className='w-3.5 h-3.5 text-indigo-400 shrink-0' />
                      <a
                        href={round.meetingLink}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-indigo-400 hover:underline truncate'
                      >
                        Join Meeting URL
                      </a>
                    </div>
                  )}
                </div>

                {round.notes && (
                  <div className='mt-3 pt-3 border-t border-white/5'>
                    <p className='text-xs text-zinc-300 leading-relaxed line-clamp-3'>{round.notes}</p>
                  </div>
                )}
              </div>

              <div className='mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono'>
                <button
                  type='button'
                  onClick={() => app && onSelectApplication(app)}
                  className='text-indigo-400 hover:underline font-semibold'
                >
                  View Application →
                </button>
                <button
                  type='button'
                  onClick={() => handleDelete(round.id)}
                  className='text-zinc-500 hover:text-rose-400 p-1 rounded-sm'
                  title='Delete Round'
                >
                  <Trash2 className='w-3.5 h-3.5' />
                </button>
              </div>
            </div>
          );
        })}

        {filteredInterviews.length === 0 && (
          <div className='col-span-full py-16 text-center border border-dashed border-white/10 rounded-sm'>
            <Layers className='w-10 h-10 text-zinc-600 mx-auto mb-2' />
            <h3 className='text-sm font-bold text-white'>No interview rounds found</h3>
            <p className='text-xs text-zinc-400 mt-1'>
              Log your technical, system design, or managerial rounds inside any application entry.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
