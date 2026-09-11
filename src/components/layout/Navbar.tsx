'use client';

import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="relative z-20 w-full border-b border-white/10 backdrop-blur-md bg-black/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[1.5px] shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#0d0d14] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
                Jobloom
              </span>
              <span className="text-[10px] font-medium tracking-widest text-indigo-400 uppercase -mt-1">
                Talent Intelligence
              </span>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-300">
            <a href="#explore" className="hover:text-white transition-colors">
              Explore Roles
            </a>
            <a href="#companies" className="hover:text-white transition-colors">
              Companies
            </a>
            <a href="#salaries" className="hover:text-white transition-colors flex items-center gap-1.5">
              Salaries
              <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                Live
              </span>
            </a>
            <a href="#ai-match" className="hover:text-white transition-colors">
              AI Matcher
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden sm:inline-flex text-sm font-medium text-zinc-300 hover:text-white px-3.5 py-2 rounded-lg hover:bg-white/5 transition-all cursor-pointer">
            Sign In
          </button>
          <button className="relative group overflow-hidden text-sm font-semibold px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-95 shadow-md shadow-indigo-500/25 transition-all active:scale-95 cursor-pointer">
            <span className="relative z-10 flex items-center gap-1.5">
              Post a Job
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
