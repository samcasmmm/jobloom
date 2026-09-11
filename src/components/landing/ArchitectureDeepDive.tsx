'use client';

import React from 'react';
import { HardDrive, Clock, Layers, FileJson } from 'lucide-react';
import { CardSpotlight } from '@/components/ui/card-spotlight';

export const ArchitectureDeepDive: React.FC = () => {
  return (
    <section id='architecture' className='py-24 sm:py-32 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      {/* Section Header */}
      <div className='text-center max-w-3xl mx-auto mb-16 sm:mb-20'>
        <span className='text-xs font-mono font-bold tracking-wider text-indigo-400 uppercase bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1 rounded-full'>
          Engineering Architecture
        </span>
        <h2 className='text-3xl sm:text-5xl font-black tracking-tight text-white mt-4'>
          Built for Software Engineers. Zero Compromises.
        </h2>
        <p className='mt-4 text-base sm:text-lg text-zinc-400 leading-relaxed'>
          No cloud lock-in, no slow API round-trips, and no subscription paywalls. A handcrafted local-first tool
          designed around how technical candidates actually interview.
        </p>
      </div>

      {/* 4-Panel Bento Architecture Grid with CardSpotlight */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Panel 1: IndexedDB Engine */}
        <CardSpotlight
          color='#1e1b4b'
          radius={300}
          className='p-8 sm:p-10 rounded-3xl bg-[#090912]/95 border-white/10 hover:border-indigo-500/50 transition-all flex flex-col justify-between'
        >
          <div className='relative z-10'>
            <div className='flex items-center justify-between mb-6'>
              <div className='w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400'>
                <HardDrive className='w-6 h-6' />
              </div>
              <span className='text-xs font-mono font-bold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/35'>
                0ms Client Latency
              </span>
            </div>

            <h3 className='text-2xl font-bold text-white'>Direct-to-IndexedDB Engine</h3>
            <p className='mt-3 text-sm text-zinc-300 leading-relaxed'>
              Every card drag, status change, and interview note writes directly to a versioned client-side IndexedDB
              database. Instant response times with offline-first resilience.
            </p>

            {/* Code Block Snippet */}
            <div className='mt-6 p-4 rounded-2xl bg-black/80 border border-white/10 font-mono text-[11px] text-zinc-300'>
              <div className='text-zinc-500 pb-2 border-b border-white/5 flex items-center justify-between'>
                <span>modules/storage/services/db.ts</span>
                <span className='text-emerald-400'>client-only</span>
              </div>
              <pre className='pt-3 text-indigo-300 leading-relaxed'>
                {`const db = await openDB<JobTrackerDB>('job-tracker-db', 1);
// Zero server round-trips; instant client persistence
await db.put('applications', validatedApp);`}
              </pre>
            </div>
          </div>
        </CardSpotlight>

        {/* Panel 2: Multi-Round Interview Engine */}
        <CardSpotlight
          color='#2e1065'
          radius={300}
          className='p-8 sm:p-10 rounded-3xl bg-[#090912]/95 border-white/10 hover:border-purple-500/50 transition-all flex flex-col justify-between'
        >
          <div className='relative z-10'>
            <div className='flex items-center justify-between mb-6'>
              <div className='w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400'>
                <Layers className='w-6 h-6' />
              </div>
              <span className='text-xs font-mono font-bold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/35'>
                Full Lifecycle
              </span>
            </div>

            <h3 className='text-2xl font-bold text-white'>Multi-Round Technical Prep Loop</h3>
            <p className='mt-3 text-sm text-zinc-300 leading-relaxed'>
              Real interview processes aren&apos;t just one conversation. Track HR screens, LeetCode / pair programming
              rounds, System Design architectures, and Managerial syncs with notes and outcomes.
            </p>

            {/* Visual Round Stages */}
            <div className='mt-6 grid grid-cols-2 gap-2.5 text-xs font-mono'>
              <div className='p-3 rounded-xl bg-white/4 border border-white/10 flex items-center gap-2 text-zinc-200'>
                <span className='w-2 h-2 rounded-full bg-blue-400' />
                <span>1. HR & Recruiter Screen</span>
              </div>
              <div className='p-3 rounded-xl bg-white/4 border border-white/10 flex items-center gap-2 text-zinc-200'>
                <span className='w-2 h-2 rounded-full bg-amber-400' />
                <span>2. Online Assessment</span>
              </div>
              <div className='p-3 rounded-xl bg-white/4 border border-white/10 flex items-center gap-2 text-zinc-200'>
                <span className='w-2 h-2 rounded-full bg-purple-400' />
                <span>3. System Design Loop</span>
              </div>
              <div className='p-3 rounded-xl bg-white/4 border border-white/10 flex items-center gap-2 text-zinc-200'>
                <span className='w-2 h-2 rounded-full bg-emerald-400' />
                <span>4. Offer & Negotiations</span>
              </div>
            </div>
          </div>
        </CardSpotlight>

        {/* Panel 3: Computed Follow-Up Heuristics */}
        <CardSpotlight
          color='#451a03'
          radius={300}
          className='p-8 sm:p-10 rounded-3xl bg-[#090912]/95 border-white/10 hover:border-amber-500/50 transition-all flex flex-col justify-between'
        >
          <div className='relative z-10'>
            <div className='flex items-center justify-between mb-6'>
              <div className='w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400'>
                <Clock className='w-6 h-6' />
              </div>
              <span className='text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/35'>
                Zero Background Drain
              </span>
            </div>

            <h3 className='text-2xl font-bold text-white'>Computed Follow-up Heuristics</h3>
            <p className='mt-3 text-sm text-zinc-300 leading-relaxed'>
              No annoying background daemons or push notifications. Follow-ups are computed dynamically on read when
              recruiter activity has lapsed beyond your configured threshold.
            </p>

            <div className='mt-6 p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-3'>
              <Clock className='w-4 h-4 text-amber-400 shrink-0 mt-0.5' />
              <div>
                <span className='font-bold block text-white'>Smart Inactivity Heuristic</span>
                <span className='text-amber-200/80 text-[11px] mt-0.5 block'>
                  Automatically flags when an application in &apos;Applied&apos; or &apos;OA&apos; stage has had 0
                  updates in &gt;7 days.
                </span>
              </div>
            </div>
          </div>
        </CardSpotlight>

        {/* Panel 4: 100% Data Portability */}
        <CardSpotlight
          color='#083344'
          radius={300}
          className='p-8 sm:p-10 rounded-3xl bg-[#090912]/95 border-white/10 hover:border-cyan-500/50 transition-all flex flex-col justify-between'
        >
          <div className='relative z-10'>
            <div className='flex items-center justify-between mb-6'>
              <div className='w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400'>
                <FileJson className='w-6 h-6' />
              </div>
              <span className='text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/35'>
                Zero Cloud Lock-In
              </span>
            </div>

            <h3 className='text-2xl font-bold text-white'>1-Click JSON Backup & Restore</h3>
            <p className='mt-3 text-sm text-zinc-300 leading-relaxed'>
              Your data is never trapped in a proprietary database. Export the entire IndexedDB dataset into an audited,
              portable JSON payload and restore it seamlessly across browsers.
            </p>

            <div className='mt-6 flex items-center gap-3'>
              <div className='flex-1 p-3 rounded-xl bg-white/4 border border-white/10 text-center text-xs font-mono text-zinc-200'>
                <span className='text-zinc-400 block text-[10px]'>EXPORT</span>
                <span>jobloom_backup.json</span>
              </div>
              <span className='text-zinc-500'>⇄</span>
              <div className='flex-1 p-3 rounded-xl bg-white/4 border border-white/10 text-center text-xs font-mono text-zinc-200'>
                <span className='text-zinc-400 block text-[10px]'>RESTORE</span>
                <span className='text-emerald-300'>Instant Validate</span>
              </div>
            </div>
          </div>
        </CardSpotlight>
      </div>
    </section>
  );
};

export default ArchitectureDeepDive;
