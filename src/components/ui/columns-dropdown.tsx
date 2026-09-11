'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, SlidersHorizontal, CheckSquare, Square, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ColumnConfig {
  key: string;
  label: string;
  visible: boolean;
}

export const DEFAULT_TABLE_COLUMNS: ColumnConfig[] = [
  { key: 'company', label: 'Company', visible: true },
  { key: 'role', label: 'Role Title', visible: true },
  { key: 'status', label: 'Status', visible: true },
  { key: 'salary', label: 'Salary Band', visible: true },
  { key: 'source', label: 'Source', visible: true },
  { key: 'appliedDate', label: 'Applied Date', visible: true },
  { key: 'actions', label: 'Actions', visible: true },
];

interface ColumnsDropdownProps {
  columns: ColumnConfig[];
  onChange: (columns: ColumnConfig[]) => void;
  className?: string;
}

export const ColumnsDropdown: React.FC<ColumnsDropdownProps> = ({
  columns,
  onChange,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const toggleColumn = (key: string) => {
    const updated = columns.map((col) =>
      col.key === key ? { ...col, visible: !col.visible } : col
    );
    onChange(updated);
  };

  const showAll = () => {
    const updated = columns.map((col) => ({ ...col, visible: true }));
    onChange(updated);
  };

  const visibleCount = columns.filter((c) => c.visible).length;

  return (
    <div
      ref={dropdownRef}
      className={cn('relative inline-block text-left select-none', className)}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'h-8 px-3 font-mono text-xs rounded-sm border border-white/10 bg-[#141420] text-zinc-300 hover:text-white hover:border-white/20 inline-flex items-center gap-2 cursor-pointer shadow-none transition-colors duration-100',
          isOpen && 'border-indigo-500/50 bg-[#171728] text-white'
        )}
      >
        <SlidersHorizontal className='w-3.5 h-3.5 text-zinc-500 shrink-0' />
        <span>Columns ({visibleCount}/{columns.length})</span>
        <ChevronDown
          className={cn(
            'w-3.5 h-3.5 text-zinc-500 transition-transform duration-100 shrink-0',
            isOpen && 'rotate-180 text-indigo-400'
          )}
        />
      </button>

      {isOpen && (
        <div className='absolute right-0 z-50 mt-1.5 min-w-[210px] rounded-sm bg-[#0a0a14] border border-white/10 p-1.5 shadow-2xl backdrop-blur-2xl animate-in fade-in duration-100 font-mono text-xs'>
          <div className='px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500 border-b border-white/5 mb-1 flex items-center justify-between'>
            <span>Toggle Columns</span>
            <button
              type='button'
              onClick={showAll}
              className='text-[10px] text-indigo-400 hover:underline cursor-pointer'
            >
              Show All
            </button>
          </div>

          <div className='space-y-0.5'>
            {columns.map((col) => (
              <button
                key={col.key}
                type='button'
                onClick={() => toggleColumn(col.key)}
                className={cn(
                  'w-full px-2 py-1.5 rounded-sm text-xs flex items-center justify-between text-left transition-colors cursor-pointer',
                  col.visible
                    ? 'text-white hover:bg-white/5'
                    : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300'
                )}
              >
                <span className='truncate'>{col.label}</span>
                {col.visible ? (
                  <CheckSquare className='w-4 h-4 text-indigo-400 shrink-0' />
                ) : (
                  <Square className='w-4 h-4 text-zinc-600 shrink-0' />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
