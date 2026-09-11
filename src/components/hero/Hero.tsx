'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { GradientWaves } from '@/components/background';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { JobSearchBar } from './JobSearchBar';
import { FeatureCards } from './FeatureCards';
import { StatsBar } from './StatsBar';

export const Hero: React.FC = () => {
  return (
    <div className='relative min-h-screen w-full overflow-hidden bg-[#0a0a0f] text-white flex flex-col justify-between selection:bg-indigo-500 selection:text-white'>
      {/* Background WebGL Gradient Waves */}
      <div className='absolute inset-0 z-0 opacity-75 pointer-events-none'>
        <GradientWaves
          horizonColor='#4f46e5'
          waveColor='#ec4899'
          crestColor='#38bdf8'
          speed={0.45}
          amplitude={2.8}
          waveScale={0.65}
          waveRatio={0.9}
          swell={32}
          turbulence={24}
          tilt={1.12}
          zoom={1.05}
          height={5.2}
          fogDepth={16}
          detail='high'
          brightness={1.05}
          opacity={0.88}
          mouseInteraction={true}
          parallaxStrength={0.6}
          grain={true}
          grainIntensity={0.06}
          className='w-full h-full'
        />
      </div>

      {/* Subtle Lighting Overlays */}
      <div className='absolute inset-0 z-1 bg-linear-to-b from-black/60 via-black/20 to-[#0a0a0f] pointer-events-none' />
      <div className='absolute inset-0 z-1 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-indigo-500/15 via-transparent to-transparent pointer-events-none' />

      {/* Navigation Bar */}
      <Navbar />

      {/* Main Hero Content */}
      <main className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-16 flex flex-col items-center text-center'>
        {/* Release Pill Badge */}
        <div className='inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/40 backdrop-blur-md shadow-inner shadow-indigo-500/20 text-xs sm:text-sm text-indigo-300 font-medium mb-8 hover:border-indigo-500/50 transition-colors cursor-pointer'>
          <span className='flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse' />
          <span className='font-semibold text-white'>Jobloom 2.0</span>
          <span className='text-zinc-400'>•</span>
          <span>Next-Gen Neural Career Matching</span>
          <ChevronRight className='w-3.5 h-3.5 text-indigo-400' />
        </div>

        {/* Headline */}
        <h1 className='text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl leading-[1.15]'>
          Where Ambitious Talent Meets{' '}
          <span className='bg-clip-text text-transparent bg-linear-to-r from-indigo-400 via-pink-400 to-cyan-300'>
            Next-Era Careers
          </span>
        </h1>

        {/* Subtitle */}
        <p className='mt-6 text-base sm:text-xl text-zinc-300 max-w-3xl font-normal leading-relaxed'>
          Jobloom cuts through the noise with deep skill-graph matching, verified salary intelligence, and direct access
          to engineering teams at the world&apos;s best tech companies.
        </p>

        {/* Job Search Box */}
        <JobSearchBar />

        {/* Value Proposition Bento Cards */}
        <FeatureCards />

        {/* Live Metrics Bar */}
        <StatsBar />
      </main>

      {/* Footer Branding Bar */}
      <Footer />
    </div>
  );
};

export default Hero;
