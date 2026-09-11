'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Menu, X } from 'lucide-react';
import { TechIcon } from '@/components/ui/tech-icons';

export const LandingNavbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className='fixed top-0 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 lg:px-8 pt-4 transition-all duration-300'>
      <div
        className={`w-full max-w-6xl rounded-2xl transition-all duration-300 ${
          scrolled
            ? 'bg-[#08080d]/85 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] shadow-black/60 py-2.5 px-4 sm:px-6'
            : 'bg-[#08080d]/50 backdrop-blur-xl border border-white/8 py-3 px-5 sm:px-7 shadow-lg shadow-black/20'
        }`}
      >
        <div className='flex items-center justify-between'>
          {/* Brand Logo */}
          <Link href='/' className='flex items-center gap-3 group'>
            <div className='flex flex-col'>
              <div className='flex items-center gap-1.5'>
                <span className='text-xl font-bold tracking-tight'>
                  <span className='text-white'>Job</span>
                  <span className='bg-clip-text text-transparent bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400'>
                    loom
                  </span>
                </span>
                <span className='text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-white/10 border border-white/15 text-zinc-300'>
                  v1.0
                </span>
              </div>
              <span className='text-[10px] font-medium tracking-wider text-zinc-400 uppercase -mt-0.5'>
                Local-First Job Tracker
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Clean text-only) */}
          <nav className='hidden md:flex items-center gap-1 text-xs font-medium text-zinc-300'>
            <a href='#demo' className='px-3.5 py-2 rounded-lg hover:text-white hover:bg-white/6 transition-all'>
              Live Demo
            </a>
            <a href='#architecture' className='px-3.5 py-2 rounded-lg hover:text-white hover:bg-white/6 transition-all'>
              Architecture
            </a>
            <a href='#features' className='px-3.5 py-2 rounded-lg hover:text-white hover:bg-white/6 transition-all'>
              Features
            </a>
            <a href='#privacy' className='px-3.5 py-2 rounded-lg hover:text-white hover:bg-white/6 transition-all'>
              Privacy
            </a>
            <a href='#faq' className='px-3.5 py-2 rounded-lg hover:text-white hover:bg-white/6 transition-all'>
              FAQ
            </a>
          </nav>

          {/* Right Action Buttons (Uniform height & sizing) */}
          <div className='flex items-center gap-2.5'>
            <a
              href='https://github.com'
              target='_blank'
              rel='noopener noreferrer'
              className='hidden sm:inline-flex items-center justify-center gap-2 h-9 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-200 hover:text-white transition-all cursor-pointer shadow-sm'
            >
              <TechIcon name='github' className='w-4 h-4' />
              <span>GitHub</span>
            </a>

            <a
              href='#demo'
              className='relative group/btn inline-flex items-center justify-center h-9 px-4 rounded-xl overflow-hidden text-xs font-semibold text-white bg-indigo-600 shadow-md shadow-indigo-600/30 ring-1 ring-white/20 transition-all duration-300 ease-out hover:scale-[1.03] hover:shadow-lg hover:shadow-indigo-500/40 active:scale-95 cursor-pointer'
            >
              {/* Fluid smooth gradient shift layer */}
              <div className='absolute inset-0 bg-linear-to-r from-indigo-500 via-purple-600 to-indigo-500 bg-size-[200%_100%] transition-all duration-500 ease-out group-hover/btn:bg-position-[100%_0%]' />

              {/* Subtle soft sheen highlight overlay */}
              <div className='absolute inset-0 bg-linear-to-b from-white/20 via-transparent to-transparent opacity-60 group-hover/btn:opacity-100 transition-opacity duration-300 pointer-events-none' />

              {/* Text & Animated Arrow */}
              <span className='relative z-10 flex items-center gap-1.5'>
                <span>Open Tracker</span>
                <ArrowRight className='w-3.5 h-3.5 transition-transform duration-300 ease-out group-hover/btn:translate-x-1' />
              </span>
            </a>

            {/* Mobile Menu Toggle */}
            <button
              type='button'
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className='md:hidden h-9 w-9 flex items-center justify-center rounded-xl text-zinc-400 hover:text-white bg-white/5 border border-white/10'
              aria-label='Toggle menu'
            >
              {mobileMenuOpen ? <X className='w-4 h-4' /> : <Menu className='w-4 h-4' />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className='md:hidden mt-4 pt-4 border-t border-white/10 flex flex-col gap-2 text-sm text-zinc-300 pb-2'>
            <a
              href='#demo'
              onClick={() => setMobileMenuOpen(false)}
              className='px-3 py-2 rounded-lg hover:bg-white/5 text-white'
            >
              Live Demo
            </a>
            <a
              href='#architecture'
              onClick={() => setMobileMenuOpen(false)}
              className='px-3 py-2 rounded-lg hover:bg-white/5 hover:text-white'
            >
              Architecture
            </a>
            <a
              href='#features'
              onClick={() => setMobileMenuOpen(false)}
              className='px-3 py-2 rounded-lg hover:bg-white/5 hover:text-white'
            >
              Features
            </a>
            <a
              href='#privacy'
              onClick={() => setMobileMenuOpen(false)}
              className='px-3 py-2 rounded-lg hover:bg-white/5 hover:text-white'
            >
              Privacy
            </a>
            <a
              href='#faq'
              onClick={() => setMobileMenuOpen(false)}
              className='px-3 py-2 rounded-lg hover:bg-white/5 hover:text-white'
            >
              FAQ
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

export default LandingNavbar;
