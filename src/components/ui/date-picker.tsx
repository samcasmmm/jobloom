'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  value?: string; // YYYY-MM-DD or YYYY-MM-DDTHH:mm
  onChange: (dateStr: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  size?: 'sm' | 'md';
  fullWidth?: boolean;
  align?: 'left' | 'right';
  showClear?: boolean;
  showTime?: boolean;
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = 'dd-mm-yyyy',
  disabled = false,
  className,
  size = 'md',
  fullWidth = true,
  align = 'left',
  showClear = true,
  showTime = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial view year, month, time
  const initialDate = value ? new Date(value) : new Date();
  const validInitialDate = !isNaN(initialDate.getTime()) ? initialDate : new Date();

  const [viewYear, setViewYear] = useState<number>(validInitialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(validInitialDate.getMonth());

  // Time state (12-hour format)
  const initialHours = validInitialDate.getHours();
  const initialMinutes = Math.floor(validInitialDate.getMinutes() / 5) * 5;
  const [selectedHour12, setSelectedHour12] = useState<number>(
    initialHours % 12 === 0 ? 12 : initialHours % 12
  );
  const [selectedMinute, setSelectedMinute] = useState<number>(initialMinutes);
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>(
    initialHours >= 12 ? 'PM' : 'AM'
  );

  // Close on outside click or Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
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

  // Sync view when value changes
  useEffect(() => {
    if (value) {
      const parsed = new Date(value);
      if (!isNaN(parsed.getTime())) {
        setViewYear(parsed.getFullYear());
        setViewMonth(parsed.getMonth());
        const h = parsed.getHours();
        setSelectedHour12(h % 12 === 0 ? 12 : h % 12);
        setSelectedMinute(parsed.getMinutes());
        setSelectedPeriod(h >= 12 ? 'PM' : 'AM');
      }
    }
  }, [value]);

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const compute24Hour = (h12: number, period: 'AM' | 'PM') => {
    if (period === 'AM') {
      return h12 === 12 ? 0 : h12;
    }
    return h12 === 12 ? 12 : h12 + 12;
  };

  const handleSelectDay = (day: number) => {
    const monthStr = String(viewMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');

    if (showTime) {
      const h24 = compute24Hour(selectedHour12, selectedPeriod);
      const hourStr = String(h24).padStart(2, '0');
      const minStr = String(selectedMinute).padStart(2, '0');
      onChange(`${viewYear}-${monthStr}-${dayStr}T${hourStr}:${minStr}`);
    } else {
      onChange(`${viewYear}-${monthStr}-${dayStr}`);
      setIsOpen(false);
    }
  };

  const handleTimeChange = (newH12: number, newMin: number, newPeriod: 'AM' | 'PM') => {
    setSelectedHour12(newH12);
    setSelectedMinute(newMin);
    setSelectedPeriod(newPeriod);

    if (value) {
      const parts = value.split('T')[0].split('-');
      if (parts.length === 3) {
        const h24 = compute24Hour(newH12, newPeriod);
        const hourStr = String(h24).padStart(2, '0');
        const minStr = String(newMin).padStart(2, '0');
        onChange(`${parts[0]}-${parts[1]}-${parts[2]}T${hourStr}:${minStr}`);
      }
    } else {
      const today = new Date();
      const year = today.getFullYear();
      const monthStr = String(today.getMonth() + 1).padStart(2, '0');
      const dayStr = String(today.getDate()).padStart(2, '0');
      const h24 = compute24Hour(newH12, newPeriod);
      const hourStr = String(h24).padStart(2, '0');
      const minStr = String(newMin).padStart(2, '0');
      onChange(`${year}-${monthStr}-${dayStr}T${hourStr}:${minStr}`);
    }
  };

  const handleSetToday = (e: React.MouseEvent) => {
    e.stopPropagation();
    const today = new Date();
    const year = today.getFullYear();
    const monthStr = String(today.getMonth() + 1).padStart(2, '0');
    const dayStr = String(today.getDate()).padStart(2, '0');
    setViewYear(year);
    setViewMonth(today.getMonth());

    if (showTime) {
      const h = today.getHours();
      const m = Math.floor(today.getMinutes() / 5) * 5;
      setSelectedHour12(h % 12 === 0 ? 12 : h % 12);
      setSelectedMinute(m);
      setSelectedPeriod(h >= 12 ? 'PM' : 'AM');
      const hourStr = String(h).padStart(2, '0');
      const minStr = String(m).padStart(2, '0');
      onChange(`${year}-${monthStr}-${dayStr}T${hourStr}:${minStr}`);
    } else {
      onChange(`${year}-${monthStr}-${dayStr}`);
    }
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setIsOpen(false);
  };

  // Generate calendar days
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const prevMonthDays = Array.from(
    { length: firstDayOfWeek },
    (_, i) => daysInPrevMonth - firstDayOfWeek + i + 1
  );
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const totalSlots = Math.ceil((firstDayOfWeek + daysInMonth) / 7) * 7;
  const nextMonthDays = Array.from(
    { length: totalSlots - (firstDayOfWeek + daysInMonth) },
    (_, i) => i + 1
  );

  // Check if today
  const today = new Date();
  const isCurrentMonthToday =
    today.getFullYear() === viewYear && today.getMonth() === viewMonth;
  const todayDateNumber = today.getDate();

  // Selected date components
  let selectedYear: number | null = null;
  let selectedMonth: number | null = null;
  let selectedDay: number | null = null;

  if (value) {
    const datePart = value.includes('T') ? value.split('T')[0] : value;
    const parts = datePart.split('-');
    if (parts.length === 3) {
      selectedYear = parseInt(parts[0], 10);
      selectedMonth = parseInt(parts[1], 10) - 1;
      selectedDay = parseInt(parts[2], 10);
    }
  }

  const isSelected = (day: number) =>
    selectedYear === viewYear && selectedMonth === viewMonth && selectedDay === day;

  // Format display date
  let displayFormattedDate = '';
  if (value) {
    if (showTime && value.includes('T')) {
      const [dPart, tPart] = value.split('T');
      const dParts = dPart.split('-');
      if (dParts.length === 3 && tPart) {
        const [hStr, mStr] = tPart.split(':');
        const hNum = parseInt(hStr, 10);
        const period = hNum >= 12 ? 'PM' : 'AM';
        const h12 = hNum % 12 === 0 ? 12 : hNum % 12;
        const formattedH = String(h12).padStart(2, '0');
        const formattedM = String(mStr || '00').padStart(2, '0');
        displayFormattedDate = `${dParts[2]}-${dParts[1]}-${dParts[0]} ${formattedH}:${formattedM} ${period}`;
      } else {
        displayFormattedDate = value;
      }
    } else {
      const parts = value.split('T')[0].split('-');
      if (parts.length === 3) {
        displayFormattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      } else {
        displayFormattedDate = value;
      }
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative inline-block text-left select-none', fullWidth && 'w-full block', className)}
    >
      {/* Trigger Input/Button */}
      <button
        type='button'
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between rounded-sm border bg-[#141420] text-sm font-mono transition-colors duration-100 cursor-pointer shadow-none',
          size === 'sm' ? 'h-7 px-2.5 text-xs' : 'h-10.5 px-3.5 py-2 text-sm',
          isOpen
            ? 'border-indigo-500 bg-[#171728] text-white shadow-xs'
            : 'border-white/10 text-zinc-300 hover:border-white/20 hover:text-white',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span className='flex items-center gap-2 truncate'>
          <CalendarIcon className='w-4 h-4 text-zinc-400 shrink-0' />
          {displayFormattedDate ? (
            <span className='text-zinc-100 font-medium'>{displayFormattedDate}</span>
          ) : (
            <span className='text-zinc-500'>{placeholder}</span>
          )}
        </span>

        <span className='flex items-center gap-1 shrink-0 ml-2'>
          {value && showClear && !disabled && (
            <span
              role='button'
              tabIndex={0}
              onClick={handleClear}
              className='p-1 rounded-sm text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors'
              title='Clear date'
            >
              <X className='w-3.5 h-3.5' />
            </span>
          )}
        </span>
      </button>

      {/* Popover Calendar */}
      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-1.5 w-[280px] rounded-sm bg-[#0a0a14] border border-white/10 p-3 shadow-2xl backdrop-blur-2xl animate-in fade-in duration-100 font-mono text-zinc-300',
            align === 'right' ? 'right-0' : 'left-0'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Navigation */}
          <div className='flex items-center justify-between pb-2 mb-2 border-b border-white/8'>
            <button
              type='button'
              onClick={handlePrevMonth}
              className='p-1 rounded-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer'
              title='Previous Month'
            >
              <ChevronLeft className='w-4 h-4' />
            </button>

            <span className='text-xs font-bold text-white tracking-wide'>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>

            <button
              type='button'
              onClick={handleNextMonth}
              className='p-1 rounded-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer'
              title='Next Month'
            >
              <ChevronRight className='w-4 h-4' />
            </button>
          </div>

          {/* Days of Week Header */}
          <div className='grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-zinc-500 mb-1 uppercase tracking-wider'>
            {DAY_LABELS.map((d) => (
              <div key={d} className='h-6 flex items-center justify-center'>
                {d}
              </div>
            ))}
          </div>

          {/* Day Cells Grid */}
          <div className='grid grid-cols-7 gap-1 text-center text-xs'>
            {/* Previous Month Days */}
            {prevMonthDays.map((d) => (
              <div
                key={`prev-${d}`}
                className='h-7 flex items-center justify-center text-zinc-600 cursor-not-allowed opacity-40 text-[11px]'
              >
                {d}
              </div>
            ))}

            {/* Current Month Days */}
            {currentMonthDays.map((d) => {
              const active = isSelected(d);
              const isToday = isCurrentMonthToday && todayDateNumber === d;

              return (
                <button
                  key={`curr-${d}`}
                  type='button'
                  onClick={() => handleSelectDay(d)}
                  className={cn(
                    'h-7 w-7 mx-auto flex items-center justify-center rounded-sm transition-all cursor-pointer text-xs font-mono font-medium',
                    active
                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                      : isToday
                        ? 'border border-indigo-400/60 text-indigo-300 hover:bg-white/10'
                        : 'text-zinc-300 hover:bg-white/8 hover:text-white'
                  )}
                >
                  {d}
                </button>
              );
            })}

            {/* Next Month Days */}
            {nextMonthDays.map((d) => (
              <div
                key={`next-${d}`}
                className='h-7 flex items-center justify-center text-zinc-600 cursor-not-allowed opacity-40 text-[11px]'
              >
                {d}
              </div>
            ))}
          </div>

          {/* Time Picker Section (when showTime is enabled) */}
          {showTime && (
            <div className='pt-2.5 mt-2.5 border-t border-white/8 space-y-2'>
              <div className='flex items-center justify-between text-[11px] text-zinc-400 font-medium'>
                <span className='flex items-center gap-1.5'>
                  <Clock className='w-3.5 h-3.5 text-indigo-400' />
                  <span>Time</span>
                </span>
                <span className='text-zinc-200 font-mono font-bold text-xs bg-white/5 px-2 py-0.5 rounded-sm border border-white/10'>
                  {String(selectedHour12).padStart(2, '0')}:{String(selectedMinute).padStart(2, '0')} {selectedPeriod}
                </span>
              </div>

              <div className='grid grid-cols-7 gap-1.5 items-center'>
                {/* Hours select */}
                <div className='col-span-3'>
                  <select
                    value={selectedHour12}
                    onChange={(e) => handleTimeChange(parseInt(e.target.value, 10), selectedMinute, selectedPeriod)}
                    className='w-full h-7 rounded-sm bg-[#141420] border border-white/10 text-white text-xs font-mono px-2 focus:border-indigo-500 focus:outline-hidden cursor-pointer'
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                      <option key={h} value={h} className='bg-[#0a0a14] text-white'>
                        {String(h).padStart(2, '0')} hr
                      </option>
                    ))}
                  </select>
                </div>

                {/* Minutes select */}
                <div className='col-span-2'>
                  <select
                    value={selectedMinute}
                    onChange={(e) => handleTimeChange(selectedHour12, parseInt(e.target.value, 10), selectedPeriod)}
                    className='w-full h-7 rounded-sm bg-[#141420] border border-white/10 text-white text-xs font-mono px-1.5 focus:border-indigo-500 focus:outline-hidden cursor-pointer'
                  >
                    {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((m) => (
                      <option key={m} value={m} className='bg-[#0a0a14] text-white'>
                        :{String(m).padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>

                {/* AM/PM Toggle */}
                <div className='col-span-2 flex h-7 rounded-sm border border-white/10 overflow-hidden bg-[#141420]'>
                  <button
                    type='button'
                    onClick={() => handleTimeChange(selectedHour12, selectedMinute, 'AM')}
                    className={cn(
                      'flex-1 flex items-center justify-center text-[10px] font-mono font-bold transition-colors cursor-pointer',
                      selectedPeriod === 'AM'
                        ? 'bg-indigo-600 text-white'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    )}
                  >
                    AM
                  </button>
                  <button
                    type='button'
                    onClick={() => handleTimeChange(selectedHour12, selectedMinute, 'PM')}
                    className={cn(
                      'flex-1 flex items-center justify-center text-[10px] font-mono font-bold transition-colors cursor-pointer',
                      selectedPeriod === 'PM'
                        ? 'bg-indigo-600 text-white'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    )}
                  >
                    PM
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions Footer */}
          <div className='flex items-center justify-between pt-2.5 mt-2.5 border-t border-white/8 text-[11px] font-mono'>
            <div className='flex items-center gap-3'>
              <button
                type='button'
                onClick={handleSetToday}
                className='text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer transition-colors flex items-center gap-1'
              >
                <Clock className='w-3 h-3' />
                <span>{showTime ? 'Now' : 'Today'}</span>
              </button>

              {value && showClear && (
                <button
                  type='button'
                  onClick={handleClear}
                  className='text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer'
                >
                  Clear
                </button>
              )}
            </div>

            {showTime && (
              <button
                type='button'
                onClick={() => setIsOpen(false)}
                className='px-2.5 py-1 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] transition-colors cursor-pointer shadow-none'
              >
                Done
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
