import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className='relative z-10 border-t border-white/10 bg-[#050509] text-zinc-400 overflow-hidden pt-16 sm:pt-20 pb-12 sm:pb-16'>
      {/* Top Content Grid */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-10 lg:gap-8 pb-16'>
          {/* Brand & Copyright Column (Span 4) */}
          <div className='col-span-2 md:col-span-6 lg:col-span-4 flex flex-col justify-between'>
            <div>
              {/* Brand Header */}
              <Link href='/' className='inline-flex items-center gap-2 group'>
                <div className='flex flex-col'>
                  <div className='flex items-center gap-1.5'>
                    <span className='text-2xl font-bold tracking-tight text-white'>
                      Job
                      <span className='bg-clip-text text-transparent bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400'>
                        loom
                      </span>
                    </span>
                    <span className='text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-white/10 border border-white/15 text-zinc-300'>
                      v1.0
                    </span>
                  </div>
                  <span className='text-[10px] font-medium tracking-wider text-zinc-500 uppercase mt-0.5'>
                    Local-First Job Application Tracker
                  </span>
                </div>
              </Link>

              <p className='mt-4 text-xs text-zinc-400 max-w-sm leading-relaxed'>
                Zero backend, no tracking, and 100% client-side persistence powered by IndexedDB. Track applications,
                technical interviews, compensation targets, and resume versions privately.
              </p>
            </div>

            <div className='mt-8 space-y-1'>
              <p className='text-xs text-zinc-400'>
                © copyright Jobloom {new Date().getFullYear()}. All rights reserved.
              </p>
              <p className='text-[11px] text-zinc-400'>
                Crafted for software engineers by{' '}
                <a
                  href='https://digitat.in'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-zinc-400 hover:text-white transition-colors underline underline-offset-2'
                >
                  digitat.in
                </a>
              </p>
            </div>
          </div>

          {/* Navigation Links (Span 2) */}
          <div className='col-span-1 md:col-span-2 lg:col-span-2 space-y-4'>
            <h4 className='text-xs font-bold uppercase tracking-wider text-white'>Pages</h4>
            <ul className='space-y-2.5 text-xs text-zinc-400'>
              <li>
                <a href='#demo' className='hover:text-white transition-colors'>
                  Live Workspace
                </a>
              </li>
              <li>
                <a href='#architecture' className='hover:text-white transition-colors'>
                  Architecture
                </a>
              </li>
              <li>
                <a href='#features' className='hover:text-white transition-colors'>
                  Features
                </a>
              </li>
              <li>
                <a href='#privacy' className='hover:text-white transition-colors'>
                  Privacy Model
                </a>
              </li>
              <li>
                <a href='#faq' className='hover:text-white transition-colors'>
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Socials / Community (Span 2) */}
          <div className='col-span-1 md:col-span-2 lg:col-span-2 space-y-4'>
            <h4 className='text-xs font-bold uppercase tracking-wider text-white'>Socials</h4>
            <ul className='space-y-2.5 text-xs text-zinc-400'>
              <li>
                <a
                  href='https://github.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='hover:text-white transition-colors inline-flex items-center gap-1.5 group'
                >
                  <span>GitHub</span>
                  <ArrowUpRight className='w-3 h-3 text-zinc-600 group-hover:text-zinc-300 transition-colors' />
                </a>
              </li>
              <li>
                <a
                  href='https://digitat.in'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='hover:text-white transition-colors inline-flex items-center gap-1.5 group'
                >
                  <span>Digitat Studio</span>
                  <ArrowUpRight className='w-3 h-3 text-zinc-600 group-hover:text-zinc-300 transition-colors' />
                </a>
              </li>
              <li>
                <a
                  href='https://twitter.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='hover:text-white transition-colors inline-flex items-center gap-1.5 group'
                >
                  <span>Twitter / X</span>
                  <ArrowUpRight className='w-3 h-3 text-zinc-600 group-hover:text-zinc-300 transition-colors' />
                </a>
              </li>
              <li>
                <a
                  href='https://linkedin.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='hover:text-white transition-colors inline-flex items-center gap-1.5 group'
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight className='w-3 h-3 text-zinc-600 group-hover:text-zinc-300 transition-colors' />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal / Data Safety (Span 2) */}
          <div className='col-span-1 md:col-span-2 lg:col-span-2 space-y-4'>
            <h4 className='text-xs font-bold uppercase tracking-wider text-white'>Legal</h4>
            <ul className='space-y-2.5 text-xs text-zinc-400'>
              <li>
                <a href='#privacy' className='hover:text-white transition-colors'>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href='#privacy' className='hover:text-white transition-colors'>
                  Zero Telemetry Promise
                </a>
              </li>
              <li>
                <a href='#faq' className='hover:text-white transition-colors'>
                  Terms of Service
                </a>
              </li>
              <li>
                <a href='#faq' className='hover:text-white transition-colors'>
                  Cookie Policy (None)
                </a>
              </li>
            </ul>
          </div>

          {/* App Access / Tracker (Span 2) */}
          <div className='col-span-1 md:col-span-2 lg:col-span-2 space-y-4'>
            <h4 className='text-xs font-bold uppercase tracking-wider text-white'>Tracker</h4>
            <ul className='space-y-2.5 text-xs text-zinc-400'>
              <li>
                <a href='#demo' className='hover:text-white transition-colors font-medium text-indigo-400'>
                  Open Tracker Board
                </a>
              </li>
              <li>
                <a href='#demo' className='hover:text-white transition-colors'>
                  Kanban View
                </a>
              </li>
              <li>
                <a href='#demo' className='hover:text-white transition-colors'>
                  Spreadsheet Matrix
                </a>
              </li>
              <li>
                <a href='#demo' className='hover:text-white transition-colors'>
                  JSON Data Vault
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Massive Ambient Typography Watermark */}
      <div className='relative w-full flex justify-center items-center select-none pointer-events-none overflow-hidden -mb-6 sm:-mb-12'>
        <span className='text-[17vw] font-black tracking-tighter text-white/[0.035] leading-none whitespace-nowrap uppercase'>
          Jobloom
        </span>
      </div>
    </footer>
  );
};

export default LandingFooter;
