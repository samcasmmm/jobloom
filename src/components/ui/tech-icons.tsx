'use client';

import React from 'react';
import StackIcon from 'tech-stack-icons';

export interface TechIconProps {
  name: string;
  className?: string;
  variant?: 'light' | 'dark' | 'grayscale';
}

export const TechIcon: React.FC<TechIconProps> = ({ name, className = 'w-4 h-4', variant = 'dark' }) => {
  return (
    <span className={`inline-flex items-center justify-center shrink-0 ${className}`}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <StackIcon name={name as any} variant={variant} className="w-full h-full" />
    </span>
  );
};

export default TechIcon;
