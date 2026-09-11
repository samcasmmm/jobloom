import React from 'react';

export interface StatItem {
  label: string;
  value: string;
}

export interface StatsBarProps {
  stats?: StatItem[];
}

const defaultStats: StatItem[] = [
  { label: 'Verified Tech Jobs', value: '48,000+' },
  { label: 'Avg. Match Accuracy', value: '98.4%' },
  { label: 'Top Companies Hiring', value: '3,200+' },
  { label: 'Avg. Time to Offer', value: '4.8 Days' },
];

export const StatsBar: React.FC<StatsBarProps> = ({ stats = defaultStats }) => {
  return (
    <div className="w-full max-w-5xl mt-12 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div key={i} className="flex flex-col items-center">
          <span className="text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-300">
            {stat.value}
          </span>
          <span className="text-xs sm:text-sm text-zinc-400 mt-0.5">{stat.label}</span>
        </div>
      ))}
    </div>
  );
};

export default StatsBar;
