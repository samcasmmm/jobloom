'use client';

import React, { useState } from 'react';
import { Kanban, Table as TableIcon, Code2, Clock, CheckCircle2, Search, Download } from 'lucide-react';
import { STATUS_CONFIG } from '@/lib/status-colors';
import type { Application } from '@/modules/storage/types/schema';

interface DemoApplication extends Application {
  interviewRounds?: {
    type: string;
    date: string;
    interviewer: string;
    outcome: 'Pass' | 'Pending' | 'Fail';
    notes: string;
  }[];
  timeline?: { time: string; event: string; type: 'auto' | 'manual' }[];
}

const demoData: DemoApplication[] = [
  {
    id: 'app-1',
    company: 'Stripe',
    role: 'Staff Infrastructure Engineer',
    location: 'Remote (US/EU)',
    salaryMin: 220000,
    salaryMax: 275000,
    source: 'Referral',
    status: 'Interview',
    appliedDate: '2026-03-02',
    lastUpdated: '2026-03-10',
    followUpDate: '2026-03-15',
    createdAt: '2026-03-02T10:00:00Z',
    updatedAt: '2026-03-10T14:30:00Z',
    interviewRounds: [
      {
        type: 'Recruiter Screen',
        date: 'Mar 4, 2026',
        interviewer: 'Sarah Chen (Lead Tech Recruiter)',
        outcome: 'Pass',
        notes: 'Aligned on compensation expectations ($250k base + equity) and team scope.',
      },
      {
        type: 'System Design & Architecture',
        date: 'Mar 11, 2026',
        interviewer: 'Alex Rivera (Principal Architect)',
        outcome: 'Pending',
        notes: 'Focusing on distributed idempotency, ledger write pipelines, and latency budgets.',
      },
    ],
    timeline: [
      { time: '2 hours ago', event: 'Round 2 scheduled: System Design Loop (Mar 11)', type: 'auto' },
      { time: 'Mar 4', event: 'Passed Recruiter Screen — Moving to Technical Loops', type: 'auto' },
      { time: 'Mar 2', event: 'Application submitted via Staff referral', type: 'auto' },
    ],
  },
  {
    id: 'app-2',
    company: 'Linear',
    role: 'Product Systems Engineer',
    location: 'San Francisco / Remote',
    salaryMin: 195000,
    salaryMax: 245000,
    source: 'Company Site',
    status: 'Offer',
    appliedDate: '2026-02-20',
    lastUpdated: '2026-03-09',
    createdAt: '2026-02-20T11:00:00Z',
    updatedAt: '2026-03-09T18:00:00Z',
    interviewRounds: [
      {
        type: 'Founder Sync',
        date: 'Mar 2, 2026',
        interviewer: 'Karri Saarinen',
        outcome: 'Pass',
        notes: 'Deep alignment on craft, sync engines, and local-first UX architecture.',
      },
      {
        type: 'Take-home & Pair Programming',
        date: 'Feb 26, 2026',
        interviewer: 'Engineering Lead',
        outcome: 'Pass',
        notes: 'Built optimistic offline mutation queue with CRDT conflict resolution.',
      },
    ],
    timeline: [
      { time: 'Mar 9', event: 'Formal Offer Received: $240k base + 0.15% equity grant 🎉', type: 'auto' },
      { time: 'Mar 3', event: 'Completed all technical and design loops', type: 'auto' },
    ],
  },
  {
    id: 'app-3',
    company: 'OpenAI',
    role: 'Compute Platform Engineer',
    location: 'San Francisco, CA',
    salaryMin: 280000,
    salaryMax: 350000,
    source: 'Wellfound',
    status: 'Applied',
    appliedDate: '2026-03-08',
    lastUpdated: '2026-03-08',
    createdAt: '2026-03-08T12:00:00Z',
    updatedAt: '2026-03-08T12:00:00Z',
    interviewRounds: [],
    timeline: [{ time: 'Mar 8', event: 'Application submitted for GPU cluster orchestration', type: 'auto' }],
  },
  {
    id: 'app-4',
    company: 'Figma',
    role: 'Design Systems Architect',
    location: 'New York / Remote',
    salaryMin: 205000,
    salaryMax: 255000,
    source: 'Referral',
    status: 'Applied',
    appliedDate: '2026-03-10',
    lastUpdated: '2026-03-10',
    createdAt: '2026-03-10T15:00:00Z',
    updatedAt: '2026-03-10T15:00:00Z',
    interviewRounds: [],
    timeline: [{ time: 'Mar 10', event: 'Application submitted via referral', type: 'auto' }],
  },
  {
    id: 'app-5',
    company: 'Vercel',
    role: 'Framework & DX Lead',
    location: 'Remote Global',
    salaryMin: 190000,
    salaryMax: 230000,
    source: 'LinkedIn',
    status: 'Applied',
    appliedDate: '2026-03-05',
    lastUpdated: '2026-03-07',
    followUpDate: '2026-03-12',
    createdAt: '2026-03-05T09:00:00Z',
    updatedAt: '2026-03-07T16:00:00Z',
    interviewRounds: [
      {
        type: 'Async Coding Assessment',
        date: 'Mar 8, 2026',
        interviewer: 'Core Turbopack Team',
        outcome: 'Pending',
        notes: 'Turbopack bundler AST transformations and incremental compilation task.',
      },
    ],
    timeline: [
      { time: 'Mar 7', event: 'Received online assessment invitation', type: 'auto' },
      { time: 'Mar 5', event: 'Application submitted', type: 'auto' },
    ],
  },
];

export const InteractiveTrackerDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'kanban' | 'table' | 'json'>('kanban');
  const [selectedAppId, setSelectedAppId] = useState<string>('app-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterStatus] = useState<string>('all');

  const selectedApp = demoData.find((a) => a.id === selectedAppId) || demoData[0];

  const filteredApps = demoData.filter((app) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!app.company.toLowerCase().includes(q) && !app.role.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (activeFilterStatus !== 'all' && app.status !== activeFilterStatus) {
      return false;
    }
    return true;
  });

  const columns: Application['status'][] = ['Applied', 'Interview', 'Offer'];

  return (
    <div className='w-full max-w-7xl mx-auto rounded-3xl p-1 bg-linear-to-b from-white/15 via-white/5 to-white/2 shadow-[0_0_100px_rgba(99,102,241,0.15)] border border-white/10'>
      <div className='w-full bg-[#09090f]/95 backdrop-blur-2xl rounded-[22px] border border-white/5 overflow-hidden flex flex-col'>
        {/* Top App Bar with Tab Navigation */}
        <div className='px-6 py-4 border-b border-white/10 bg-white/2 flex flex-wrap items-center justify-between gap-4'>
          <div className='flex items-center gap-4'>
            {/* Terminal Window Dots */}
            <div className='flex items-center gap-1.5'>
              <div className='w-2.5 h-2.5 rounded-full bg-rose-500/70' />
              <div className='w-2.5 h-2.5 rounded-full bg-amber-500/70' />
              <div className='w-2.5 h-2.5 rounded-full bg-emerald-500/70' />
            </div>

            <span className='text-xs font-mono font-bold text-zinc-400 flex items-center gap-2'>
              <span className='text-indigo-400'>jobloom</span>
              <span className='text-zinc-600'>/</span>
              <span>workspace</span>
            </span>

            {/* View Mode Tabs */}
            <div className='flex items-center p-0.5 rounded-xl bg-black/40 border border-white/10 text-xs'>
              <button
                type='button'
                onClick={() => setActiveTab('kanban')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === 'kanban'
                    ? 'bg-indigo-600/90 text-white shadow-md shadow-indigo-600/20'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Kanban className='w-3.5 h-3.5' />
                <span>Kanban</span>
              </button>
              <button
                type='button'
                onClick={() => setActiveTab('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === 'table'
                    ? 'bg-indigo-600/90 text-white shadow-md shadow-indigo-600/20'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <TableIcon className='w-3.5 h-3.5' />
                <span>Table</span>
              </button>
              <button
                type='button'
                onClick={() => setActiveTab('json')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === 'json'
                    ? 'bg-indigo-600/90 text-white shadow-md shadow-indigo-600/20'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Code2 className='w-3.5 h-3.5 text-cyan-400' />
                <span>JSON Vault</span>
              </button>
            </div>
          </div>

          {/* Search bar & Live Local Indicator */}
          <div className='flex items-center gap-3'>
            <div className='relative hidden sm:block w-48'>
              <Search className='w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2' />
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Filter by company...'
                className='w-full bg-white/4 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500'
              />
            </div>

            <div className='flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono'>
              <span className='w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse' />
              <span>IndexedDB: 0ms latency</span>
            </div>
          </div>
        </div>

        {/* Main Workspace Area with Split Panel Detail Drawer */}
        <div className='flex flex-col lg:flex-row min-h-130'>
          {/* Main Board / Table Area */}
          <div className='flex-1 p-5 overflow-x-auto'>
            {activeTab === 'kanban' && (
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4 w-full'>
                {columns.map((status) => {
                  const config = STATUS_CONFIG[status];
                  const apps = filteredApps.filter((a) => a.status === status);

                  return (
                    <div
                      key={status}
                      className='flex flex-col rounded-2xl bg-white/2 border border-white/5 p-3 min-h-110'
                    >
                      {/* Column Title */}
                      <div className='flex items-center justify-between pb-2.5 border-b border-white/5 mb-3'>
                        <div className='flex items-center gap-2'>
                          <span className={`w-2 h-2 rounded-full ${config.dot}`} />
                          <span className='text-xs font-bold text-zinc-300'>{config.label}</span>
                        </div>
                        <span className='text-[10px] font-mono font-semibold text-zinc-500 bg-white/5 px-1.5 py-0.5 rounded'>
                          {apps.length}
                        </span>
                      </div>

                      {/* Cards List */}
                      <div className='flex flex-col gap-2.5 flex-1'>
                        {apps.map((app) => {
                          const isSelected = selectedAppId === app.id;
                          return (
                            <div
                              key={app.id}
                              onClick={() => setSelectedAppId(app.id)}
                              className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left group ${
                                isSelected
                                  ? 'bg-indigo-950/40 border-indigo-500/70 shadow-lg shadow-indigo-500/10'
                                  : 'bg-white/3 border-white/10 hover:border-white/20 hover:bg-white/5'
                              }`}
                            >
                              <div className='flex items-start justify-between'>
                                <h4 className='text-sm font-bold text-white group-hover:text-indigo-300 transition-colors'>
                                  {app.company}
                                </h4>
                                <span className='text-[10px] text-zinc-500 bg-white/5 px-1.5 py-0.5 rounded'>
                                  {app.source}
                                </span>
                              </div>
                              <p className='text-xs text-zinc-400 mt-0.5 line-clamp-1'>{app.role}</p>

                              {/* Salary Pill */}
                              {app.salaryMin && app.salaryMax && (
                                <div className='mt-2 text-[11px] font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md inline-block border border-emerald-500/20'>
                                  ${(app.salaryMin / 1000).toFixed(0)}k - ${(app.salaryMax / 1000).toFixed(0)}k
                                </div>
                              )}

                              {/* Interview notice */}
                              {app.status === 'Interview' && (
                                <div className='mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-purple-300 font-medium'>
                                  <span className='flex items-center gap-1'>
                                    <Clock className='w-3 h-3 text-purple-400' />
                                    System Design Loop
                                  </span>
                                  <span className='text-purple-400 font-semibold'>Mar 11</span>
                                </div>
                              )}

                              {app.status === 'Offer' && (
                                <div className='mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-emerald-300 font-medium'>
                                  <span className='flex items-center gap-1'>
                                    <CheckCircle2 className='w-3 h-3 text-emerald-400' />
                                    Offer Received
                                  </span>
                                  <span className='text-emerald-400 font-bold'>$240k Base</span>
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {apps.length === 0 && (
                          <div className='flex-1 flex items-center justify-center border border-dashed border-white/5 rounded-xl text-[10px] text-zinc-600'>
                            No applications
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'table' && (
              <div className='overflow-x-auto rounded-xl border border-white/10 bg-black/20'>
                <table className='w-full text-left text-xs text-zinc-300'>
                  <thead className='bg-white/4 text-zinc-400 uppercase tracking-wider font-mono text-[10px] border-b border-white/10'>
                    <tr>
                      <th className='px-4 py-3'>Company & Role</th>
                      <th className='px-4 py-3'>Status</th>
                      <th className='px-4 py-3'>Compensation Band</th>
                      <th className='px-4 py-3'>Source</th>
                      <th className='px-4 py-3'>Applied Date</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-white/5'>
                    {filteredApps.map((app) => {
                      const isSelected = selectedAppId === app.id;
                      const config = STATUS_CONFIG[app.status];
                      return (
                        <tr
                          key={app.id}
                          onClick={() => setSelectedAppId(app.id)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-indigo-950/30' : 'hover:bg-white/2'
                          }`}
                        >
                          <td className='px-4 py-3.5'>
                            <div className='font-bold text-white text-sm'>{app.company}</div>
                            <div className='text-zinc-400 text-xs'>{app.role}</div>
                          </td>
                          <td className='px-4 py-3.5'>
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.badge}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                              {config.label}
                            </span>
                          </td>
                          <td className='px-4 py-3.5 font-mono text-emerald-400 font-semibold'>
                            {app.salaryMin && app.salaryMax
                              ? `$${(app.salaryMin / 1000).toFixed(0)}k - $${(app.salaryMax / 1000).toFixed(0)}k`
                              : '—'}
                          </td>
                          <td className='px-4 py-3.5 text-zinc-400'>{app.source}</td>
                          <td className='px-4 py-3.5 font-mono text-zinc-400'>{app.appliedDate}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'json' && (
              <div className='p-4 rounded-2xl bg-black/60 border border-white/10 font-mono text-xs text-zinc-300 overflow-auto max-h-110'>
                <div className='flex items-center justify-between pb-3 border-b border-white/10 mb-3'>
                  <span className='text-zinc-400 text-[11px]'>
                    {`// Complete IndexedDB JSON Export format (1-Click Portability)`}
                  </span>
                  <button className='flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs hover:bg-indigo-500/30 transition-all'>
                    <Download className='w-3 h-3' />
                    <span>Download JSON</span>
                  </button>
                </div>
                <pre className='text-emerald-400 text-[11px] leading-relaxed'>
                  {JSON.stringify(
                    {
                      version: 1,
                      appName: 'Jobloom',
                      exportedAt: '2026-03-11T19:30:00Z',
                      applications: demoData.map((d) => ({
                        id: d.id,
                        company: d.company,
                        role: d.role,
                        salaryMin: d.salaryMin,
                        salaryMax: d.salaryMax,
                        source: d.source,
                        status: d.status,
                        appliedDate: d.appliedDate,
                      })),
                    },
                    null,
                    2,
                  )}
                </pre>
              </div>
            )}
          </div>

          {/* Right Slide-Over Detail Drawer */}
          <div className='w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-white/10 bg-white/1.5 p-5 flex flex-col justify-between'>
            <div>
              {/* Drawer Header */}
              <div className='flex items-start justify-between pb-4 border-b border-white/10'>
                <div>
                  <div className='flex items-center gap-2'>
                    <h3 className='text-lg font-bold text-white'>{selectedApp.company}</h3>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        STATUS_CONFIG[selectedApp.status].badge
                      }`}
                    >
                      {selectedApp.status}
                    </span>
                  </div>
                  <p className='text-xs text-zinc-400 mt-1 font-medium'>{selectedApp.role}</p>
                </div>
                <span className='text-[10px] font-mono text-zinc-500 bg-white/5 px-2 py-1 rounded'>
                  {selectedApp.id}
                </span>
              </div>

              {/* Compensation & Details Info */}
              <div className='py-4 grid grid-cols-2 gap-3 text-xs border-b border-white/10'>
                <div className='p-2.5 rounded-xl bg-white/2 border border-white/5'>
                  <span className='text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold'>
                    Target Pay
                  </span>
                  <span className='text-sm font-mono font-bold text-emerald-400 mt-0.5 block'>
                    ${(selectedApp.salaryMin || 0) / 1000}k - ${(selectedApp.salaryMax || 0) / 1000}k
                  </span>
                </div>

                <div className='p-2.5 rounded-xl bg-white/2 border border-white/5'>
                  <span className='text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold'>
                    Location
                  </span>
                  <span className='text-xs text-zinc-300 font-medium mt-1 block truncate'>{selectedApp.location}</span>
                </div>
              </div>

              {/* Interview Rounds Stepper */}
              <div className='py-4 border-b border-white/10'>
                <span className='text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-3'>
                  Interview Rounds ({selectedApp.interviewRounds?.length || 0})
                </span>

                <div className='flex flex-col gap-2.5'>
                  {selectedApp.interviewRounds?.map((round, idx) => (
                    <div key={idx} className='p-3 rounded-xl bg-white/2 border border-white/5 text-xs text-left'>
                      <div className='flex items-center justify-between'>
                        <span className='font-bold text-white'>{round.type}</span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            round.outcome === 'Pass'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {round.outcome}
                        </span>
                      </div>
                      <p className='text-[11px] text-zinc-400 mt-1'>{round.notes}</p>
                      <div className='mt-2 text-[10px] text-zinc-500 flex items-center gap-2'>
                        <span>{round.date}</span>
                        <span>•</span>
                        <span>{round.interviewer}</span>
                      </div>
                    </div>
                  ))}

                  {(!selectedApp.interviewRounds || selectedApp.interviewRounds.length === 0) && (
                    <p className='text-xs text-zinc-500 italic'>No interview rounds logged yet.</p>
                  )}
                </div>
              </div>

              {/* Automated Activity Stepper Log */}
              <div className='py-4'>
                <span className='text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-2.5'>
                  Activity Timeline
                </span>
                <div className='flex flex-col gap-2 text-xs'>
                  {selectedApp.timeline?.map((item, idx) => (
                    <div key={idx} className='flex items-start gap-2 text-left'>
                      <span className='w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0' />
                      <div>
                        <p className='text-zinc-300 text-xs leading-snug'>{item.event}</p>
                        <span className='text-[10px] text-zinc-500 font-mono'>{item.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom local action hint */}
            <div className='pt-3 border-t border-white/5 text-[11px] text-zinc-500 flex items-center justify-between'>
              <span>Saved locally to IndexedDB</span>
              <span className='text-indigo-400 font-medium cursor-pointer hover:underline'>Full Details →</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveTrackerDemo;
