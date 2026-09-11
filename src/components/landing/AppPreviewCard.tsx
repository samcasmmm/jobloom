'use client';

import React, { useState } from 'react';
import { Kanban, Table as TableIcon, Plus, MapPin, Clock, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { STATUS_CONFIG } from '@/lib/status-colors';
import type { Application } from '@/modules/storage/types/schema';

const sampleApplications: (Partial<Application> & { id: string; company: string; role: string })[] = [
  {
    id: '1',
    company: 'Stripe',
    role: 'Staff Frontend Engineer',
    location: 'Remote (US/EU)',
    salaryMin: 210000,
    salaryMax: 260000,
    source: 'Referral',
    status: 'Interview',
    appliedDate: '2026-03-01',
    followUpDate: '2026-03-14',
  },
  {
    id: '2',
    company: 'Vercel',
    role: 'AI / DX Systems Engineer',
    location: 'San Francisco, CA',
    salaryMin: 185000,
    salaryMax: 235000,
    source: 'LinkedIn',
    status: 'OA',
    appliedDate: '2026-03-04',
  },
  {
    id: '3',
    company: 'Linear',
    role: 'Product Engineer',
    location: 'Remote Global',
    salaryMin: 190000,
    salaryMax: 240000,
    source: 'Company Site',
    status: 'Offer',
    appliedDate: '2026-02-18',
  },
  {
    id: '4',
    company: 'OpenAI',
    role: 'Research Infrastructure Lead',
    location: 'San Francisco, CA',
    salaryMin: 280000,
    salaryMax: 360000,
    source: 'Wellfound',
    status: 'Applied',
    appliedDate: '2026-03-08',
  },
  {
    id: '5',
    company: 'Figma',
    role: 'Design Systems Architect',
    location: 'New York / Remote',
    salaryMin: 200000,
    salaryMax: 250000,
    source: 'Referral',
    status: 'Wishlist',
    appliedDate: '2026-03-10',
  },
];

export const AppPreviewCard: React.FC = () => {
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [selectedApp, setSelectedApp] = useState<string>('1');

  const columns: Application['status'][] = ['Wishlist', 'Applied', 'OA', 'Interview', 'Offer'];

  return (
    <div className='w-full max-w-6xl mx-auto rounded-3xl p-1 bg-linear-to-b from-white/20 via-white/10 to-white/5 shadow-[0_0_80px_rgba(99,102,241,0.2)]'>
      <div className='w-full bg-[#0d0d16]/95 backdrop-blur-2xl rounded-[22px] border border-white/10 overflow-hidden'>
        {/* Mock App Shell Header */}
        <div className='px-6 py-4 border-b border-white/10 bg-white/2 flex flex-wrap items-center justify-between gap-4'>
          <div className='flex items-center gap-4'>
            {/* Window Dots */}
            <div className='flex items-center gap-1.5'>
              <div className='w-3 h-3 rounded-full bg-rose-500/80' />
              <div className='w-3 h-3 rounded-full bg-amber-500/80' />
              <div className='w-3 h-3 rounded-full bg-emerald-500/80' />
            </div>

            <div className='h-4 w-px bg-white/15 mx-1' />

            {/* View Mode Toggle */}
            <div className='flex items-center p-1 rounded-xl bg-white/5 border border-white/10'>
              <button
                type='button'
                onClick={() => setViewMode('kanban')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'kanban'
                    ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Kanban className='w-3.5 h-3.5' />
                Kanban Board
              </button>
              <button
                type='button'
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'table'
                    ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <TableIcon className='w-3.5 h-3.5' />
                Table View
              </button>
            </div>
          </div>

          {/* Quick Metrics Badge in Header */}
          <div className='flex items-center gap-3'>
            <div className='hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium'>
              <span className='w-2 h-2 rounded-full bg-emerald-400 animate-pulse' />1 Active Offer ($190k - $240k)
            </div>
            <button className='flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white transition-all shadow-md shadow-indigo-500/20'>
              <Plus className='w-3.5 h-3.5' />
              <span>Add Job</span>
            </button>
          </div>
        </div>

        {/* View Mode: Kanban */}
        {viewMode === 'kanban' ? (
          <div className='p-6 overflow-x-auto'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 min-w-225 lg:min-w-0'>
              {columns.map((status) => {
                const config = STATUS_CONFIG[status];
                const appsInCol = sampleApplications.filter((a) => a.status === status);

                return (
                  <div key={status} className='flex flex-col rounded-2xl bg-white/2 border border-white/5 p-3 min-h-80'>
                    {/* Column Header */}
                    <div className='flex items-center justify-between pb-3 border-b border-white/5 mb-3'>
                      <div className='flex items-center gap-2'>
                        <span className={`w-2 h-2 rounded-full ${config.dot}`} />
                        <span className='text-xs font-bold text-zinc-200 tracking-wide'>{config.label}</span>
                      </div>
                      <span className='text-[11px] font-semibold text-zinc-400 px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10'>
                        {appsInCol.length}
                      </span>
                    </div>

                    {/* Cards List */}
                    <div className='flex flex-col gap-3 flex-1'>
                      {appsInCol.map((app) => (
                        <div
                          key={app.id}
                          onClick={() => setSelectedApp(app.id)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer group relative ${
                            selectedApp === app.id
                              ? 'bg-indigo-950/40 border-indigo-500/60 shadow-lg shadow-indigo-500/10'
                              : 'bg-white/3 border-white/10 hover:border-white/20 hover:bg-white/5'
                          }`}
                        >
                          <div className='flex items-start justify-between gap-2'>
                            <div>
                              <h4 className='text-sm font-bold text-white group-hover:text-indigo-300 transition-colors'>
                                {app.company}
                              </h4>
                              <p className='text-xs text-zinc-400 mt-0.5 font-medium leading-snug'>{app.role}</p>
                            </div>
                            <span className='text-[10px] font-medium text-zinc-500 bg-white/5 px-1.5 py-0.5 rounded'>
                              {app.source}
                            </span>
                          </div>

                          {/* Location & Salary */}
                          <div className='mt-3 flex flex-wrap items-center gap-2 text-[11px] text-zinc-400'>
                            {app.salaryMin && app.salaryMax && (
                              <span className='flex items-center gap-0.5 text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20'>
                                ${(app.salaryMin / 1000).toFixed(0)}k-${(app.salaryMax / 1000).toFixed(0)}k
                              </span>
                            )}
                            <span className='text-zinc-500 flex items-center gap-1'>
                              <MapPin className='w-3 h-3 text-zinc-400' />
                              {app.location?.split(',')[0]}
                            </span>
                          </div>

                          {/* Footer details (Rounds or Follow-up) */}
                          {app.status === 'Interview' && (
                            <div className='mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-purple-300'>
                              <span className='flex items-center gap-1 font-medium'>
                                <Clock className='w-3 h-3 text-purple-400' />
                                Round 2: Tech Deep-Dive
                              </span>
                              <span className='font-semibold text-purple-400'>Mar 14</span>
                            </div>
                          )}

                          {app.status === 'Offer' && (
                            <div className='mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-emerald-300'>
                              <span className='flex items-center gap-1 font-medium'>
                                <CheckCircle2 className='w-3 h-3 text-emerald-400' />
                                Offer Received
                              </span>
                              <span className='font-bold text-emerald-400'>Accepted 🎉</span>
                            </div>
                          )}
                        </div>
                      ))}

                      {appsInCol.length === 0 && (
                        <div className='flex-1 flex items-center justify-center border border-dashed border-white/5 rounded-xl text-[11px] text-zinc-500 py-6'>
                          Drop here
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* View Mode: Table */
          <div className='overflow-x-auto'>
            <table className='w-full text-left text-xs text-zinc-300'>
              <thead className='bg-white/3 text-zinc-400 border-b border-white/10 uppercase tracking-wider font-semibold text-[10px]'>
                <tr>
                  <th className='px-6 py-3.5'>Company & Role</th>
                  <th className='px-6 py-3.5'>Status</th>
                  <th className='px-6 py-3.5'>Salary Band</th>
                  <th className='px-6 py-3.5'>Source</th>
                  <th className='px-6 py-3.5'>Applied Date</th>
                  <th className='px-6 py-3.5'>Action</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-white/5'>
                {sampleApplications.map((app) => {
                  const statusKey = (app.status || 'Applied') as Application['status'];
                  const config = STATUS_CONFIG[statusKey];
                  return (
                    <tr key={app.id} className='hover:bg-white/3 transition-colors group cursor-pointer'>
                      <td className='px-6 py-4'>
                        <div className='font-bold text-white text-sm group-hover:text-indigo-300 transition-colors'>
                          {app.company}
                        </div>
                        <div className='text-zinc-400 mt-0.5'>{app.role}</div>
                      </td>
                      <td className='px-6 py-4'>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.badge}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                          {config.label}
                        </span>
                      </td>
                      <td className='px-6 py-4 font-semibold text-emerald-400'>
                        {app.salaryMin && app.salaryMax
                          ? `$${(app.salaryMin / 1000).toFixed(0)}k - $${(app.salaryMax / 1000).toFixed(0)}k`
                          : '—'}
                      </td>
                      <td className='px-6 py-4 text-zinc-400'>{app.source}</td>
                      <td className='px-6 py-4 text-zinc-400'>{app.appliedDate}</td>
                      <td className='px-6 py-4'>
                        <button className='text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1'>
                          View Details
                          <ArrowUpRight className='w-3.5 h-3.5' />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Mock Status Bar */}
        <div className='px-6 py-3 bg-black/60 border-t border-white/5 flex flex-wrap items-center justify-between text-xs text-zinc-500'>
          <div className='flex items-center gap-4'>
            <span className='flex items-center gap-1.5'>
              <span className='w-2 h-2 rounded-full bg-emerald-400' />
              IndexedDB Storage: <strong>Local (Ready)</strong>
            </span>
            <span className='hidden sm:inline'>•</span>
            <span className='hidden sm:inline'>Zero network latency</span>
          </div>
          <div className='flex items-center gap-3'>
            <span>5 Applications Loaded</span>
            <span>•</span>
            <span className='text-indigo-400 hover:underline cursor-pointer'>Export to JSON</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppPreviewCard;
