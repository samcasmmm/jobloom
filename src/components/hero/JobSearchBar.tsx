'use client';

import React, { useState } from 'react';
import { Search, MapPin, Sparkles, TrendingUp } from 'lucide-react';

const defaultTrendingRoles = [
  'Fullstack Engineer',
  'AI / ML Lead',
  'Founding Designer',
  'Remote (Global)',
  'Rust / Systems',
  'Product Manager',
];

export interface JobSearchBarProps {
  onSearch?: (params: { role: string; location: string }) => void;
  trendingRoles?: string[];
}

export const JobSearchBar: React.FC<JobSearchBarProps> = ({ onSearch, trendingRoles = defaultTrendingRoles }) => {
  const [roleQuery, setRoleQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('Remote Worldwide');
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    if (onSearch) {
      onSearch({ role: roleQuery, location: locationQuery });
    }
    setTimeout(() => setIsSearching(false), 700);
  };

  return (
    <div className='w-full max-w-4xl mt-10'>
      <form
        onSubmit={handleSubmit}
        className='p-2 sm:p-2.5 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/15 shadow-2xl shadow-black/60 flex flex-col sm:flex-row gap-2 transition-all focus-within:border-indigo-500/60 focus-within:ring-4 focus-within:ring-indigo-500/10'
      >
        {/* Role Query Input */}
        <div className='flex-1 flex items-center gap-3 px-3.5 py-2.5 sm:py-2 rounded-xl bg-white/4 border border-white/5 focus-within:bg-white/[0.07] transition-all'>
          <Search className='w-5 h-5 text-indigo-400 shrink-0' />
          <input
            type='text'
            value={roleQuery}
            onChange={(e) => setRoleQuery(e.target.value)}
            placeholder='Role, skill, or company (e.g. Senior Frontend Engineer)'
            className='w-full bg-transparent text-sm sm:text-base text-white placeholder:text-zinc-500 focus:outline-none'
          />
        </div>

        {/* Location Selector */}
        <div className='sm:w-60 flex items-center gap-3 px-3.5 py-2.5 sm:py-2 rounded-xl bg-white/4 border border-white/5 focus-within:bg-white/[0.07] transition-all'>
          <MapPin className='w-5 h-5 text-pink-400 shrink-0' />
          <input
            type='text'
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            placeholder='Location / Remote'
            className='w-full bg-transparent text-sm sm:text-base text-white placeholder:text-zinc-500 focus:outline-none'
          />
        </div>

        {/* Submit CTA */}
        <button
          type='submit'
          disabled={isSearching}
          className='sm:w-auto px-7 py-3.5 rounded-xl bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 font-semibold text-white shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-75 cursor-pointer'
        >
          {isSearching ? (
            <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
          ) : (
            <>
              <Sparkles className='w-4 h-4' />
              <span>Search Jobs</span>
            </>
          )}
        </button>
      </form>

      {/* Popular Tag Pills */}
      <div className='mt-4 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-zinc-400'>
        <span className='font-medium text-zinc-500 flex items-center gap-1'>
          <TrendingUp className='w-3.5 h-3.5 text-indigo-400' /> Trending:
        </span>
        {trendingRoles.map((role) => (
          <button
            key={role}
            type='button'
            onClick={() => setRoleQuery(role)}
            className='px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-all cursor-pointer'
          >
            {role}
          </button>
        ))}
      </div>
    </div>
  );
};

export default JobSearchBar;
