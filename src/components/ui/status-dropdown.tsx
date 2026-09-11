'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import type { Application } from '@/modules/storage/types/schema';
import { STATUS_CONFIG, STATUS_ORDER } from '@/lib/status-colors';
import { cn } from '@/lib/utils';

interface StatusDropdownProps {
  value: Application['status'];
  onChange: (newStatus: Application['status']) => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  align?: 'left' | 'right' | 'center';
  fullWidth?: boolean;
  centeredText?: boolean;
  showLabelPrefix?: boolean;
}

export const StatusDropdown: React.FC<StatusDropdownProps> = ({
  value,
  onChange,
  size = 'sm',
  disabled = false,
  className,
  align = 'left',
  fullWidth = false,
  centeredText = false,
  showLabelPrefix = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentConfig = STATUS_CONFIG[value] || {
    label: value,
    bg: 'bg-zinc-500/10',
    text: 'text-zinc-300',
    border: 'border-zinc-500/30',
    dot: 'bg-zinc-400',
    badge: 'bg-zinc-500/10 text-zinc-300 border border-zinc-500/30',
  };

  // Close on outside click or Escape
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

  const sizeClasses = {
    sm: 'text-xs h-8 px-3 rounded-sm gap-1.5',
    md: 'text-sm h-10.5 px-3.5 rounded-sm gap-2',
    lg: 'text-sm h-12 px-4.5 rounded-sm gap-2.5',
  };

  const dotSizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  const isFull = fullWidth || className?.includes('w-full');

  return (
    <div
      ref={dropdownRef}
      className={cn('relative inline-block text-left select-none', isFull && 'w-full block', className)}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Trigger Button - Clean Single 1px Border & Rounded-sm */}
      <button
        type='button'
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'font-mono font-bold transition-all duration-150 cursor-pointer shadow-none active:scale-[0.99] rounded-sm',
          isFull ? 'w-full flex items-center justify-between' : 'inline-flex items-center justify-between',
          currentConfig.badge,
          sizeClasses[size],
          isOpen ? 'border-indigo-400/80 bg-indigo-500/15' : 'hover:brightness-110',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span
          className={cn(
            'flex items-center gap-2 truncate',
            centeredText && 'flex-1 justify-center'
          )}
        >
          <span className={cn('rounded-full shrink-0', currentConfig.dot, dotSizeClasses[size])} />
          <span className='truncate font-medium tracking-wide'>
            {showLabelPrefix ? `Stage: ${currentConfig.label}` : currentConfig.label}
          </span>
        </span>

        <ChevronDown
          className={cn(
            'transition-transform duration-150 opacity-60 shrink-0 ml-1.5',
            size === 'sm' ? 'w-3 h-3' : 'w-4 h-4',
            isOpen && 'rotate-180 opacity-100 text-indigo-400'
          )}
        />
      </button>

      {/* Floating Dropdown Popover Menu - Clean Single 1px Border, Rounded-sm, Full Height */}
      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-1.5 min-w-[210px] rounded-sm bg-[#0a0a14] border border-white/10 p-1 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-100',
            isFull && 'w-full min-w-full',
            align === 'right' ? 'right-0' : align === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-0'
          )}
        >
          <div className='px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 border-b border-white/5 mb-1 flex items-center justify-between'>
            <span>Move Stage</span>
            <span className='text-[9px] text-zinc-600'>7 stages</span>
          </div>

          <div className='space-y-0.5'>
            {STATUS_ORDER.map((statusKey) => {
              const cfg = STATUS_CONFIG[statusKey];
              const isSelected = statusKey === value;

              return (
                <button
                  key={statusKey}
                  type='button'
                  onClick={() => {
                    onChange(statusKey);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center justify-between px-2.5 py-1.5 rounded-sm text-xs font-mono transition-all text-left group cursor-pointer border',
                    isSelected
                      ? 'bg-indigo-600/20 text-white font-bold border-indigo-500/35 shadow-none'
                      : 'border-transparent text-zinc-300 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <div className='flex items-center gap-2 min-w-0'>
                    <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', cfg.dot)} />
                    <span className='truncate font-medium tracking-wide'>
                      {cfg.label}
                    </span>
                  </div>

                  {isSelected && (
                    <Check className='w-3.5 h-3.5 text-indigo-400 shrink-0 ml-2' />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusDropdown;
