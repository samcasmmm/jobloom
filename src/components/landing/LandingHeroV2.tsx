'use client';

import React from 'react';
import { ArrowRight, ShieldCheck, Zap, HardDrive, Code2, FileJson } from 'lucide-react';
import InteractiveTrackerDemo from './InteractiveTrackerDemo';
import { GradientWaves } from '@/components/background';

export const LandingHeroV2: React.FC = () => {
  return (
    <section className='relative pt-28 pb-20 sm:pt-36 sm:pb-28 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center overflow-hidden'>
      {/* Localized WebGL GradientWaves Background for Hero Only */}
      <div className='absolute inset-0 z-0 opacity-45 pointer-events-none overflow-hidden'>
        <GradientWaves
          horizonColor='#312e81'
          waveColor='#7c3aed'
          crestColor='#38bdf8'
          speed={0.3}
          amplitude={2.4}
          waveScale={0.7}
          waveRatio={0.9}
          swell={28}
          turbulence={20}
          tilt={1.12}
          zoom={1.05}
          height={4.8}
          fogDepth={20}
          detail='high'
          brightness={1.0}
          opacity={0.8}
          mouseInteraction={true}
          parallaxStrength={0.5}
          grain={true}
          grainIntensity={0.05}
          className='w-full h-full'
        />
        {/* Soft bottom fade mask so it blends naturally into obsidian */}
        <div className='absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-[#07070b] pointer-events-none' />
      </div>

      <div className='relative z-10 flex flex-col items-center w-full'>
        {/* Precision Badge */}
        <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/4 backdrop-blur-xl shadow-lg shadow-black/40 text-xs font-mono text-zinc-300 mb-8 hover:border-white/20 transition-all cursor-default'>
          <span className='flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse' />
          <span className='text-white font-semibold'>Local-First Architecture</span>
          <span className='text-zinc-600'>•</span>
          <span className='text-zinc-400'>IndexedDB Client Persistence</span>
        </div>

        {/* Main Headline */}
        <h1 className='text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-5xl leading-[1.08] text-white'>
          The Local-First Job Tracker{' '}
          <span className='bg-clip-text text-transparent bg-linear-to-r from-indigo-300 via-purple-300 to-cyan-300'>
            Built for Software Engineers.
          </span>
        </h1>

        {/* Subtitle */}
        <p className='mt-6 text-base sm:text-xl text-zinc-400 max-w-3xl font-normal leading-relaxed'>
          Track applications, multi-round technical interviews, compensation targets, and recruiter follow-ups. No
          backend, zero tracking, and instant JSON portability.
        </p>

        {/* Action Buttons */}
        <div className='mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto'>
          <a
            href='#demo'
            className='w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 font-bold text-sm text-white shadow-xl shadow-indigo-600/35 ring-1 ring-white/20 transition-all duration-200 hover:scale-[1.02] hover:shadow-indigo-500/50 active:scale-95 group cursor-pointer'
          >
            <span>Explore Live Workspace</span>
            <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
          </a>

          <a
            href='#architecture'
            className='w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/4 hover:bg-white/8 border border-white/10 hover:border-white/20 text-zinc-200 hover:text-white font-semibold flex items-center justify-center gap-2 transition-all backdrop-blur-md cursor-pointer'
          >
            <Code2 className='w-4 h-4 text-indigo-400' />
            <span>System Architecture</span>
          </a>
        </div>

        {/* Tech Stack Specs Bar */}
        <div className='mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono text-zinc-400'>
          <div className='flex items-center gap-2'>
            <Zap className='w-4 h-4 text-amber-400' />
            <span>0ms Mutation Latency</span>
          </div>
          <div className='flex items-center gap-2'>
            <HardDrive className='w-4 h-4 text-indigo-400' />
            <span>No Cloud Database</span>
          </div>
          <div className='flex items-center gap-2'>
            <FileJson className='w-4 h-4 text-cyan-400' />
            <span>1-Click JSON Portability</span>
          </div>
          <div className='flex items-center gap-2'>
            <ShieldCheck className='w-4 h-4 text-emerald-400' />
            <span>100% Client-Side Private</span>
          </div>
        </div>

        {/* Interactive Tracker Demo Component */}
        <div id='demo' className='w-full mt-16 sm:mt-20 scroll-mt-28'>
          <InteractiveTrackerDemo />
        </div>
      </div>
    </section>
  );
};

export default LandingHeroV2;
