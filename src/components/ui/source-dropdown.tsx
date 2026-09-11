'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Plus, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export const DEFAULT_SOURCES = [
  'LinkedIn',
  'Referral',
  'Wellfound',
  'Naukri',
  'Company Site',
  'Other',
];

const STORAGE_KEY = 'jobloom_custom_sources';

export function getStoredSources(): string[] {
  if (typeof window === 'undefined') return DEFAULT_SOURCES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SOURCES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const set = new Set([...DEFAULT_SOURCES, ...parsed]);
      return Array.from(set);
    }
  } catch (e) {
    console.error('Failed to parse stored sources', e);
  }
  return DEFAULT_SOURCES;
}

export function saveStoredSource(newSource: string): string[] {
  if (typeof window === 'undefined') return DEFAULT_SOURCES;
  try {
    const current = getStoredSources();
    if (!current.includes(newSource)) {
      const updated = [...current, newSource];
      const customOnly = updated.filter((s) => !DEFAULT_SOURCES.includes(s));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customOnly));
      window.dispatchEvent(new CustomEvent('jobloom:sources-updated', { detail: updated }));
      return updated;
    }
    return current;
  } catch (e) {
    console.error('Failed to save source to storage', e);
    return DEFAULT_SOURCES;
  }
}

interface SourceDropdownProps {
  value: string;
  onChange: (newSource: string) => void;
  sources?: string[];
  onAddSource?: (newSource: string) => void;
  showAllOption?: boolean;
  size?: 'sm' | 'md';
  disabled?: boolean;
  className?: string;
  align?: 'left' | 'right' | 'center';
  fullWidth?: boolean;
}

export const SourceDropdown: React.FC<SourceDropdownProps> = ({
  value,
  onChange,
  sources,
  onAddSource,
  showAllOption = true,
  size = 'sm',
  disabled = false,
  className,
  align = 'left',
  fullWidth = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [allSourcesList, setAllSourcesList] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      return getStoredSources();
    }
    return sources || DEFAULT_SOURCES;
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncSources = () => {
      setAllSourcesList(getStoredSources());
    };
    syncSources();

    window.addEventListener('jobloom:sources-updated', syncSources);
    window.addEventListener('storage', syncSources);
    return () => {
      window.removeEventListener('jobloom:sources-updated', syncSources);
      window.removeEventListener('storage', syncSources);
    };
  }, []);

  // Outside click and ESC handler
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customInput.trim();
    if (!trimmed) return;

    const updated = saveStoredSource(trimmed);
    setAllSourcesList(updated);
    if (onAddSource) {
      onAddSource(trimmed);
    }
    onChange(trimmed);
    setCustomInput('');
    setIsOpen(false);
  };

  const currentLabel =
    value === 'all'
      ? 'All Sources'
      : value || (showAllOption ? 'All Sources' : 'Select Source');

  const isFull = fullWidth || className?.includes('w-full');

  return (
    <div
      ref={dropdownRef}
      className={cn('relative inline-block text-left select-none', isFull && 'w-full block', className)}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Trigger Button */}
      <button
        type='button'
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'font-mono text-xs transition-colors duration-100 cursor-pointer shadow-none rounded-sm border border-white/10 bg-[#141420] text-zinc-300 hover:text-white hover:border-white/20',
          size === 'sm' ? 'h-8 px-3 text-xs' : 'h-10.5 px-3.5 text-sm',
          isFull ? 'w-full flex items-center justify-between' : 'inline-flex items-center justify-between gap-2',
          isOpen && 'border-indigo-500/50 bg-[#171728] text-white',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span className='flex items-center gap-1.5 truncate'>
          <Globe className='w-3.5 h-3.5 text-zinc-500 shrink-0' />
          <span className='truncate'>{currentLabel}</span>
        </span>
        <ChevronDown
          className={cn(
            'w-3.5 h-3.5 text-zinc-500 transition-transform duration-100 shrink-0 ml-1',
            isOpen && 'rotate-180 text-indigo-400'
          )}
        />
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-1.5 min-w-[220px] rounded-sm bg-[#0a0a14] border border-white/10 p-1.5 shadow-2xl backdrop-blur-2xl animate-in fade-in duration-100 font-mono',
            isFull && 'w-full min-w-full',
            align === 'right' ? 'right-0' : align === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-0'
          )}
        >
          <div className='px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500 border-b border-white/5 mb-1 flex items-center justify-between'>
            <span>Filter Source</span>
            <span className='text-[9px] text-zinc-600'>{allSourcesList.length} options</span>
          </div>

          <div className='max-h-56 overflow-y-auto custom-scrollbar space-y-0.5'>
            {showAllOption && (
              <button
                type='button'
                onClick={() => {
                  onChange('all');
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full px-2.5 py-1.5 rounded-sm text-xs flex items-center justify-between text-left transition-colors cursor-pointer',
                  value === 'all'
                    ? 'bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30'
                    : 'text-zinc-300 hover:bg-white/5 hover:text-white border border-transparent'
                )}
              >
                <span>All Sources</span>
                {value === 'all' && <Check className='w-3.5 h-3.5 text-indigo-400 shrink-0' />}
              </button>
            )}

            {allSourcesList.map((src) => {
              const isSelected = value === src;
              return (
                <button
                  key={src}
                  type='button'
                  onClick={() => {
                    onChange(src);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full px-2.5 py-1.5 rounded-sm text-xs flex items-center justify-between text-left transition-colors cursor-pointer',
                    isSelected
                      ? 'bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30'
                      : 'text-zinc-300 hover:bg-white/5 hover:text-white border border-transparent'
                  )}
                >
                  <span className='truncate'>{src}</span>
                  {isSelected && <Check className='w-3.5 h-3.5 text-indigo-400 shrink-0' />}
                </button>
              );
            })}
          </div>

          {/* Add custom source input at bottom */}
          <form onSubmit={handleAddCustom} className='pt-2 mt-1.5 border-t border-white/8 flex items-center gap-1.5'>
            <input
              type='text'
              placeholder='+ Add new source...'
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className='w-full px-2 py-1.5 rounded-sm bg-white/4 border border-white/10 text-xs text-white placeholder:text-zinc-600 focus:outline-hidden focus:border-indigo-500 font-mono'
            />
            <button
              type='submit'
              disabled={!customInput.trim()}
              className='px-2.5 py-1.5 rounded-sm bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-mono font-bold shrink-0 cursor-pointer shadow-none transition-colors'
            >
              Add
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
