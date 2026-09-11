'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AdBannerProps {
  adSlot?: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  fullWidthResponsive?: boolean;
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  adSlot,
  adFormat = 'horizontal',
  fullWidthResponsive = true,
  className,
}) => {
  const adRef = useRef<HTMLModElement>(null);
  const isPushed = useRef(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && !isPushed.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
        isPushed.current = true;
      }
    } catch (e) {
      console.error('AdSense display error', e);
    }
  }, []);

  return (
    <div
      className={cn(
        'w-full rounded-sm bg-[#090912]/60 border border-white/6 p-2 text-center overflow-hidden font-mono text-zinc-500 relative select-none',
        className
      )}
    >
      <div className='flex items-center justify-between px-2 pb-1.5 border-b border-white/5 mb-1.5 text-[9px] uppercase tracking-widest text-zinc-600 font-semibold'>
        <span>Sponsored</span>
        <span>Ad</span>
      </div>

      <div className='min-h-[60px] sm:min-h-[90px] flex items-center justify-center overflow-hidden'>
        <ins
          ref={adRef}
          className='adsbygoogle'
          style={{ display: 'block', minHeight: '60px' }}
          data-ad-client='ca-pub-1947157505829323'
          data-ad-slot={adSlot || 'auto'}
          data-ad-format={adFormat}
          data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
        />
      </div>
    </div>
  );
};

export default AdBanner;
