'use client';

import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, HardDrive, FileCode2, Lock, Download } from 'lucide-react';
import AppPreviewCard from './AppPreviewCard';
import { TechIcon } from '@/components/ui/tech-icons';

export const LandingHero: React.FC = () => {
  return (
    <section className='relative pt-32 pb-20 sm:pt-40 sm:pb-28 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center'>
      {/* Privacy Tag Badge */}
      <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/30 backdrop-blur-md shadow-inner shadow-emerald-500/10 text-xs sm:text-sm text-emerald-300 font-medium mb-8 hover:border-emerald-500/50 transition-all cursor-default'>
        <span className='flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse' />
        <span className='font-semibold text-white'>Local-First Architecture</span>
        <span className='text-zinc-400'>•</span>
        <span className='flex items-center gap-1'>
          <Lock className='w-3.5 h-3.5 text-emerald-400' />
          No Server, No Login, No Tracking
        </span>
      </div>

      {/* Main Headline */}
      <h1 className='text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl leading-[1.12] text-white'>
        Track Your Job Hunt with{' '}
        <span className='bg-clip-text text-transparent bg-linear-to-r from-indigo-400 via-pink-400 to-cyan-300'>
          Zero Cloud & Total Control.
        </span>
      </h1>

      {/* Subtitle */}
      <p className='mt-6 text-base sm:text-xl text-zinc-300 max-w-3xl font-normal leading-relaxed'>
        Jobloom stores all your applications, interview rounds, prep notes, and resume versions directly inside your
        browser’s IndexedDB. Blazing fast, 100% private, with instant JSON backup portability.
      </p>

      {/* Action CTA Buttons */}
      <div className='mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto'>
        <a
          href='#preview'
          className='w-full sm:w-auto relative group overflow-hidden px-8 py-4 rounded-2xl bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 font-bold text-white shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-2.5 transition-all duration-300 active:scale-98'
        >
          <Sparkles className='w-5 h-5 text-indigo-200' />
          <span>Launch Tracker (Free)</span>
          <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
        </a>

        <a
          href='#features'
          className='w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-zinc-200 hover:text-white font-semibold flex items-center justify-center gap-2 transition-all backdrop-blur-md'
        >
          <FileCode2 className='w-4 h-4 text-indigo-400' />
          <span>Explore Architecture</span>
        </a>
      </div>

      {/* Quick Value Props Banner */}
      <div className='mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-zinc-400'>
        <div className='flex items-center gap-2'>
          <Zap className='w-4 h-4 text-amber-400' />
          <span>0ms Network Latency</span>
        </div>
        <div className='flex items-center gap-2'>
          <HardDrive className='w-4 h-4 text-indigo-400' />
          <span>IndexedDB Client Persistence</span>
        </div>
        <div className='flex items-center gap-2'>
          <ShieldCheck className='w-4 h-4 text-emerald-400' />
          <span>Zero Server Storage</span>
        </div>
        <div className='flex items-center gap-2'>
          <Download className='w-4 h-4 text-cyan-400' />
          <span>1-Click JSON Backup</span>
        </div>
      </div>

      {/* Powered by Tech Stack Badges */}
      <div className='mt-8 flex items-center justify-center gap-3 py-2 px-4 rounded-2xl bg-white/3 border border-white/10 backdrop-blur-md'>
        <span className='text-[11px] font-semibold tracking-wider text-zinc-400 uppercase'>Engineered With:</span>
        <div className='flex items-center gap-3'>
          <div className='flex items-center gap-1.5 text-xs text-zinc-300 font-medium'>
            <TechIcon name='nextjs' className='w-4 h-4' />
            <span>Next.js 16</span>
          </div>
          <span className='text-zinc-600'>•</span>
          <div className='flex items-center gap-1.5 text-xs text-zinc-300 font-medium'>
            <TechIcon name='reactjs' className='w-4 h-4' />
            <span>React 19</span>
          </div>
          <span className='text-zinc-600'>•</span>
          <div className='flex items-center gap-1.5 text-xs text-zinc-300 font-medium'>
            <TechIcon name='typescript' className='w-4 h-4' />
            <span>TypeScript</span>
          </div>
          <span className='text-zinc-600'>•</span>
          <div className='flex items-center gap-1.5 text-xs text-zinc-300 font-medium'>
            <TechIcon name='tailwindcss' className='w-4 h-4' />
            <span>Tailwind v4</span>
          </div>
        </div>
      </div>

      {/* Interactive App Preview Showcase */}
      <div id='preview' className='w-full mt-16 sm:mt-20 scroll-mt-28'>
        <AppPreviewCard />
      </div>
    </section>
  );
};

export default LandingHero;
