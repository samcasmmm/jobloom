import type { Application } from '@/modules/storage/types/schema';

export interface StatusColorConfig {
  label: string;
  badge: string; // Tailwind classes for badge bg/text/border
  dot: string; // Tailwind classes for status indicator dot
  border: string; // Tailwind border accent
  bgSubtle: string;
  chartColor: string; // Hex color for charts
  bg: string;
  text: string;
}

export const STATUS_CONFIG: Record<Application['status'], StatusColorConfig> = {
  Wishlist: {
    label: 'Wishlist',
    badge: 'bg-zinc-500/10 text-zinc-300 border border-zinc-500/30',
    dot: 'bg-zinc-400',
    border: 'border-zinc-500/30',
    bgSubtle: 'bg-zinc-500/5',
    chartColor: '#a1a1aa',
    bg: 'bg-zinc-500/10',
    text: 'text-zinc-300',
  },
  Applied: {
    label: 'Applied',
    badge: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',
    dot: 'bg-blue-400',
    border: 'border-blue-500/30',
    bgSubtle: 'bg-blue-500/5',
    chartColor: '#60a5fa',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
  },
  OA: {
    label: 'Online Assessment',
    badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
    dot: 'bg-amber-400',
    border: 'border-amber-500/30',
    bgSubtle: 'bg-amber-500/5',
    chartColor: '#fbbf24',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
  },
  Interview: {
    label: 'Interview',
    badge: 'bg-purple-500/10 text-purple-400 border border-purple-500/30',
    dot: 'bg-purple-400',
    border: 'border-purple-500/30',
    bgSubtle: 'bg-purple-500/5',
    chartColor: '#c084fc',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
  },
  Offer: {
    label: 'Offer',
    badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    dot: 'bg-emerald-400',
    border: 'border-emerald-500/30',
    bgSubtle: 'bg-emerald-500/5',
    chartColor: '#34d399',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
  },
  Rejected: {
    label: 'Rejected',
    badge: 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
    dot: 'bg-rose-400',
    border: 'border-rose-500/30',
    bgSubtle: 'bg-rose-500/5',
    chartColor: '#f87171',
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
  },
  Ghosted: {
    label: 'Ghosted',
    badge: 'bg-slate-500/10 text-slate-400 border border-slate-500/30',
    dot: 'bg-slate-400',
    border: 'border-slate-500/30',
    bgSubtle: 'bg-slate-500/5',
    chartColor: '#94a3b8',
    bg: 'bg-slate-500/10',
    text: 'text-slate-400',
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

export const STATUS_ORDER: Application['status'][] = DEFAULT_STATUS_PIPELINE;
