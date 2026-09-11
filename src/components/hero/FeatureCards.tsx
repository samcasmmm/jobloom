import React from 'react';
import { Zap, ShieldCheck, Building2 } from 'lucide-react';

export const FeatureCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-5xl mt-14 sm:mt-16 text-left">
      {/* Card 1 */}
      <div className="p-5 rounded-2xl bg-white/[0.03] backdrop-blur-lg border border-white/10 hover:border-indigo-500/40 transition-all group">
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
            98% Match
          </span>
        </div>
        <h2 className="text-lg font-bold text-white">Smart Skill-Graph Matching</h2>
        <p className="mt-1.5 text-sm text-zinc-400 leading-relaxed">
          Our neural engine maps your genuine codebase skills to hiring engineering leaders without resume keyword spam.
        </p>
      </div>

      {/* Card 2 */}
      <div className="p-5 rounded-2xl bg-white/[0.03] backdrop-blur-lg border border-white/10 hover:border-pink-500/40 transition-all group">
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
            <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-pink-500/15 text-pink-300 border border-pink-500/25">
            100% Verified
          </span>
        </div>
        <h2 className="text-lg font-bold text-white">Transparent Compensation</h2>
        <p className="mt-1.5 text-sm text-zinc-400 leading-relaxed">
          Every single listing features verified salary bands, equity packages, and bonus tiers before you apply.
        </p>
      </div>

      {/* Card 3 */}
      <div className="p-5 rounded-2xl bg-white/[0.03] backdrop-blur-lg border border-white/10 hover:border-cyan-500/40 transition-all group">
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Building2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/25">
            Fast-Track
          </span>
        </div>
        <h2 className="text-lg font-bold text-white">Direct Founder & Lead Access</h2>
        <p className="mt-1.5 text-sm text-zinc-400 leading-relaxed">
          Skip gatekeepers and black-hole inboxes. Chat directly with founders and hiring managers.
        </p>
      </div>
    </div>
  );
};

export default FeatureCards;
