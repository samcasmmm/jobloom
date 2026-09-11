import React from 'react';
import { ShieldCheck, XCircle, CheckCircle2, Lock } from 'lucide-react';

const comparisons = [
  {
    feature: 'Data Storage Location',
    jobloom: 'On-device browser IndexedDB',
    others: 'Third-party cloud database',
    jobloomBetter: true,
  },
  {
    feature: 'Account & Passwords Required',
    jobloom: 'None. Start tracking immediately',
    others: 'Mandatory email / OAuth signup',
    jobloomBetter: true,
  },
  {
    feature: 'Data Telemetry & Analytics',
    jobloom: 'Zero analytics or third-party trackers',
    others: 'Tracks applications, salary & views',
    jobloomBetter: true,
  },
  {
    feature: 'Offline Capability',
    jobloom: '100% functional without internet',
    others: 'Fails without active connection',
    jobloomBetter: true,
  },
  {
    feature: 'Backup & Portability',
    jobloom: 'Instant full JSON export / import',
    others: 'Locked in proprietary database / paywall',
    jobloomBetter: true,
  },
  {
    feature: 'Resume & Document Privacy',
    jobloom: 'Stored as Blobs directly on device',
    others: 'Uploaded to cloud file buckets',
    jobloomBetter: true,
  },
];

export const PrivacyComparison: React.FC = () => {
  return (
    <section id='privacy' className='py-24 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      <div className='rounded-3xl p-8 sm:p-12 bg-linear-to-b from-emerald-950/20 via-white/2 to-black/40 border border-emerald-500/20 backdrop-blur-2xl'>
        {/* Header */}
        <div className='text-center max-w-3xl mx-auto mb-14'>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4'>
            <Lock className='w-3.5 h-3.5' />
            Privacy Architecture
          </div>
          <h2 className='text-3xl sm:text-4xl font-extrabold text-white'>
            Why Local-First Is the Superior Way to Track Your Career.
          </h2>
          <p className='mt-3 text-sm sm:text-base text-zinc-400'>
            Your salary negotiations, company targets, and interview notes are strictly confidential. We believe your
            data should never leave your machine.
          </p>
        </div>

        {/* Comparison Table */}
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm'>
            <thead>
              <tr className='border-b border-white/10 text-xs uppercase tracking-wider text-zinc-400 font-semibold'>
                <th className='pb-4 pr-6'>Architecture Feature</th>
                <th className='pb-4 px-6 text-indigo-400 font-bold flex items-center gap-1.5'>
                  <ShieldCheck className='w-4 h-4 text-emerald-400' />
                  Jobloom (Local-First)
                </th>
                <th className='pb-4 pl-6 text-zinc-500'>Traditional Cloud Trackers</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-white/5'>
              {comparisons.map((row, idx) => (
                <tr key={idx} className='hover:bg-white/2 transition-colors'>
                  <td className='py-4 pr-6 font-semibold text-white'>{row.feature}</td>
                  <td className='py-4 px-6 font-medium text-emerald-300 bg-emerald-500/3'>
                    <div className='flex items-center gap-2'>
                      <CheckCircle2 className='w-4 h-4 text-emerald-400 shrink-0' />
                      <span>{row.jobloom}</span>
                    </div>
                  </td>
                  <td className='py-4 pl-6 text-zinc-400'>
                    <div className='flex items-center gap-2'>
                      <XCircle className='w-4 h-4 text-rose-400/70 shrink-0' />
                      <span>{row.others}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default PrivacyComparison;
