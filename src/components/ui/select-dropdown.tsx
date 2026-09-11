'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
}

interface SelectDropdownProps {
  value: string;
  onChange: (newValue: string) => void;
  options: (SelectOption | string)[];
  placeholder?: string;
  size?: 'sm' | 'md';
  disabled?: boolean;
  className?: string;
  align?: 'left' | 'right' | 'center';
  fullWidth?: boolean;
}

export const SelectDropdown: React.FC<SelectDropdownProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  size = 'sm',
  disabled = false,
  className,
  align = 'left',
  fullWidth = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const normalizedOptions: SelectOption[] = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

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
          {selectedOption?.icon && <span className='shrink-0'>{selectedOption.icon}</span>}
          <span className='truncate'>{selectedOption ? selectedOption.label : placeholder}</span>
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
            'absolute z-50 mt-1.5 min-w-[180px] rounded-sm bg-[#0a0a14] border border-white/10 p-1 shadow-2xl backdrop-blur-2xl animate-in fade-in duration-100 font-mono text-xs',
            isFull && 'w-full min-w-full',
            align === 'right' ? 'right-0' : align === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-0'
          )}
        >
          <div className='max-h-60 overflow-y-auto custom-scrollbar space-y-0.5'>
            {normalizedOptions.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type='button'
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full px-2.5 py-1.5 rounded-sm text-xs flex items-center justify-between text-left transition-colors cursor-pointer',
                    isSelected
                      ? 'bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30'
                      : 'text-zinc-300 hover:bg-white/5 hover:text-white border border-transparent'
                  )}
                >
                  <span className='flex items-center gap-2 truncate'>
                    {opt.icon && <span className='shrink-0'>{opt.icon}</span>}
                    <span className='truncate'>{opt.label}</span>
                  </span>
                  {isSelected && <Check className='w-3.5 h-3.5 text-indigo-400 shrink-0' />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
