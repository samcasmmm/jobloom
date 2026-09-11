import type { Application } from '@/modules/storage/types/schema';

export interface StatusColorConfig {
  label: string;
  badge: string; // Tailwind classes for badge bg/text/border
  dot: string; // Tailwind classes for status indicator dot
  border: string; // Tailwind border accent
  bgSubtle: string;
  chartColor: string; // Hex color for charts
}

export const STATUS_CONFIG: Record<Application['status'], StatusColorConfig> = {
  Wishlist: {
    label: 'Wishlist',
    badge: 'bg-zinc-500/10 text-zinc-300 border-zinc-500/20',
    dot: 'bg-zinc-400',
    border: 'border-zinc-500/30',
    bgSubtle: 'bg-zinc-500/5',
    chartColor: '#a1a1aa',
  },
  Applied: {
    label: 'Applied',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    dot: 'bg-blue-400',
    border: 'border-blue-500/30',
    bgSubtle: 'bg-blue-500/5',
    chartColor: '#60a5fa',
  },
  OA: {
    label: 'Online Assessment',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    dot: 'bg-amber-400',
    border: 'border-amber-500/30',
    bgSubtle: 'bg-amber-500/5',
    chartColor: '#fbbf24',
  },
  Interview: {
    label: 'Interview',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    dot: 'bg-purple-400',
    border: 'border-purple-500/30',
    bgSubtle: 'bg-purple-500/5',
    chartColor: '#c084fc',
  },
  Offer: {
    label: 'Offer',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    dot: 'bg-emerald-400',
    border: 'border-emerald-500/30',
    bgSubtle: 'bg-emerald-500/5',
    chartColor: '#34d399',
  },
  Rejected: {
    label: 'Rejected',
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    dot: 'bg-rose-400',
    border: 'border-rose-500/30',
    bgSubtle: 'bg-rose-500/5',
    chartColor: '#f87171',
  },
  Ghosted: {
    label: 'Ghosted',
    badge: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    dot: 'bg-slate-400',
    border: 'border-slate-500/30',
    bgSubtle: 'bg-slate-500/5',
    chartColor: '#94a3b8',
  },
};

export const DEFAULT_STATUS_PIPELINE: Application['status'][] = [
  'Wishlist',
  'Applied',
  'OA',
  'Interview',
  'Offer',
  'Rejected',
  'Ghosted',
];
