'use client';

import React from 'react';
import {
  Kanban,
  CalendarCheck,
  FileBox,
  HardDrive,
  Activity,
  BarChart3,
  Download,
  ShieldCheck,
  Sparkles,
  Zap,
  CheckCircle2,
  Layers,
  FileJson,
  Cpu,
  ArrowUpRight,
} from 'lucide-react';
import { WobbleCard } from '@/components/ui/wobble-card';

export const FeatureBento: React.FC = () => {
  return (
    <section id="features" className="py-24 sm:py-32 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
        <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1 rounded-full">
          Comprehensive Feature Set
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-4">
          Engineered for High-Velocity Software Careers.
        </h2>
        <p className="mt-4 text-base sm:text-lg text-zinc-400 leading-relaxed">
          Every tool you need to track applications, practice technical interview rounds, and manage your compensation goals — with zero backend lock-in.
        </p>
      </div>

      {/* Wobble Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
        {/* Card 1: Kanban & High-Density Table (Span 2) */}
        <WobbleCard
          containerClassName="col-span-1 lg:col-span-2 bg-[#0d1024] border border-indigo-500/25 min-h-[380px] lg:min-h-[360px]"
          className="p-6 sm:p-10 flex flex-col justify-between"
        >
          <div className="max-w-md relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-medium mb-4">
              <Kanban className="w-3.5 h-3.5 text-indigo-400" />
              <span>Core Application Pipeline</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Visual Kanban & High-Density Spreadsheet Matrix
            </h3>
            <p className="mt-3 text-sm sm:text-base text-zinc-300 leading-relaxed">
              Transition applications fluidly across 7 distinct pipeline stages from Wishlist to Offer. Filter by salary tier, referral source, or tech stack with instant 0ms search.
            </p>
          </div>

          {/* Interactive UI Preview snippet inside card */}
          <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-300">
            <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-200">
              Wishlist → Applied → OA
            </span>
            <span className="text-zinc-600">•</span>
            <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-200">
              Interview (Rounds 1-4)
            </span>
            <span className="text-zinc-600">•</span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300">
              Offer Received
            </span>
          </div>
        </WobbleCard>

        {/* Card 2: Multi-Round Interview Manager (Span 1) */}
        <WobbleCard
          containerClassName="col-span-1 bg-[#1a0f2e] border border-purple-500/25 min-h-[380px] lg:min-h-[360px]"
          className="p-6 sm:p-10 flex flex-col justify-between"
        >
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-mono font-medium mb-4">
              <CalendarCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Multi-Stage Prep</span>
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight text-white">
              Multi-Round Technical Prep
            </h3>
            <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
              Track HR screenings, Live Coding, System Design, and Take-home assignments with interviewer logs and Pass/Fail outcomes.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-purple-300/80 font-mono">
            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Structured round notes & links</span>
          </div>
        </WobbleCard>

        {/* Card 3: 100% Client-Side Privacy (Span 1) */}
        <WobbleCard
          containerClassName="col-span-1 bg-[#061826] border border-cyan-500/25 min-h-[380px] lg:min-h-[360px]"
          className="p-6 sm:p-10 flex flex-col justify-between"
        >
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium mb-4">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Zero-Knowledge Engine</span>
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight text-white">
              IndexedDB Pure Local Storage
            </h3>
            <p className="mt-3 text-sm text-zinc-300 leading-relaxed">
              No server databases, no analytics SDKs, no trackers. Your confidential compensation expectations and notes never leave your device.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-cyan-300/80 font-mono">
            <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>0ms local mutation speed</span>
          </div>
        </WobbleCard>

        {/* Card 4: Document Vault & JSON Portability (Span 2) */}
        <WobbleCard
          containerClassName="col-span-1 lg:col-span-2 bg-[#091a18] border border-emerald-500/25 min-h-[380px] lg:min-h-[360px]"
          className="p-6 sm:p-10 flex flex-col justify-between"
        >
          <div className="max-w-md relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-medium mb-4">
              <FileJson className="w-3.5 h-3.5 text-emerald-400" />
              <span>Data Portability & Vault</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Resume Version Blobs & 1-Click Backup Portability
            </h3>
            <p className="mt-3 text-sm sm:text-base text-zinc-300 leading-relaxed">
              Store tailored resume PDFs and cover letter Blobs per company. Export your entire dataset to a clean, schema-validated JSON file anytime to transfer between browsers or devices.
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-300">
            <div className="flex items-center gap-2 text-emerald-300">
              <Download className="w-4 h-4" />
              <span>Full JSON Export & Import</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
              <FileBox className="w-4 h-4 text-emerald-400" />
              <span>Tailored Resume Blob Storage</span>
            </div>
          </div>
        </WobbleCard>
      </div>
    </section>
  );
};

export default FeatureBento;
