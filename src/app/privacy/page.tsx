import Link from 'next/link';
import { ArrowLeft, Shield, FileJson, Scale } from 'lucide-react';
import { constructMetadata } from '@/lib/seo';
import LandingNavbar from '@/components/landing/LandingNavbar';
import LandingFooter from '@/components/landing/LandingFooter';

export const metadata = constructMetadata({
  title: 'Privacy Policy & Terms and Conditions',
  description:
    'Jobloom’s privacy policy and terms of service. 100% on-device local IndexedDB storage, zero telemetry, and complete data ownership.',
  canonicalUrl: 'https://jobloom.digitat.in/privacy',
});

export default function PrivacyAndTermsPage() {
  return (
    <div className='min-h-screen bg-[#07070b] text-white flex flex-col selection:bg-indigo-500 selection:text-white'>
      <LandingNavbar />

      <main className='flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 relative z-10 w-full'>
        {/* Back Link */}
        <Link
          href='/'
          className='inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors mb-8 group'
        >
          <ArrowLeft className='w-4 h-4 group-hover:-translate-x-1 transition-transform' />
          <span>Back to Home</span>
        </Link>

        {/* Page Header */}
        <div className='mb-12'>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4'>
            <Scale className='w-3.5 h-3.5' />
            <span>Legal, Privacy & Terms</span>
          </div>
          <h1 className='text-3xl sm:text-5xl font-black tracking-tight text-white'>
            Privacy Policy & Terms of Service
          </h1>
          <p className='mt-3 text-sm sm:text-base text-zinc-400 font-mono'>
            Last Updated: March 2026 • Version 1.0 (digitat.in)
          </p>
        </div>

        {/* Highlight Architecture Guarantee Card */}
        <div className='p-6 sm:p-8 rounded-3xl bg-indigo-950/30 border border-indigo-500/30 backdrop-blur-xl mb-12 shadow-xl shadow-indigo-500/5'>
          <div className='flex items-start gap-4'>
            <div className='w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5'>
              <Shield className='w-5 h-5' />
            </div>
            <div>
              <h3 className='text-lg font-bold text-white'>The Zero-Telemetry Guarantee</h3>
              <p className='mt-2 text-sm text-zinc-300 leading-relaxed'>
                Jobloom is built on a <strong>local-first, client-only architecture</strong>. All application entries,
                interview transcripts, compensation goals, documents, and notes are stored exclusively in your
                browser&apos;s IndexedDB database on your device. We operate no remote databases, maintain no user
                accounts, and deploy zero third-party tracking scripts.
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className='space-y-12 text-sm sm:text-base text-zinc-300 leading-relaxed'>
          {/* Section 1 */}
          <section id='storage' className='space-y-4 scroll-mt-28'>
            <h2 className='text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5'>
              <span className='text-indigo-400 font-mono text-base'>01.</span>
              <span>Data Storage & Ownership</span>
            </h2>
            <p>
              When you use Jobloom, all state mutations (creating, updating, or deleting job applications, interview
              rounds, and notes) execute locally inside your web browser via HTML5 <strong>IndexedDB</strong> (database
              name:{' '}
              <code className='text-indigo-300 bg-white/5 px-1.5 py-0.5 rounded font-mono text-xs'>job-tracker-db</code>
              ).
            </p>
            <ul className='list-disc pl-6 space-y-2 text-zinc-400 text-sm'>
              <li>
                <strong>You own 100% of your data:</strong> No data is transmitted to or stored on servers owned by
                digitat.in or any third party.
              </li>
              <li>
                <strong>Offline capability:</strong> Jobloom continues to function with full capabilities without an
                active internet connection.
              </li>
              <li>
                <strong>Data persistence:</strong> Your data remains in your local browser until you explicitly clear
                your browser storage or site data.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section id='portability' className='space-y-4 scroll-mt-28'>
            <h2 className='text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5'>
              <span className='text-indigo-400 font-mono text-base'>02.</span>
              <span>Data Portability & Backup Responsibility</span>
            </h2>
            <p>
              Because Jobloom operates without a centralized cloud server,{' '}
              <strong>you are the sole custodian of your backup files</strong>.
            </p>
            <div className='p-4 rounded-2xl bg-white/3 border border-white/10 space-y-3'>
              <div className='flex items-center gap-2 text-white font-semibold'>
                <FileJson className='w-4 h-4 text-cyan-400' />
                <span>1-Click JSON Backup & Restore</span>
              </div>
              <p className='text-xs sm:text-sm text-zinc-400'>
                You can export your complete dataset into a standardized, schema-validated JSON payload at any time from
                Settings. We strongly recommend downloading a backup copy periodically or prior to clearing your browser
                cache.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section id='cookies' className='space-y-4 scroll-mt-28'>
            <h2 className='text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5'>
              <span className='text-indigo-400 font-mono text-base'>03.</span>
              <span>Cookies & Tracking Technologies</span>
            </h2>
            <p id='telemetry'>
              Jobloom sets <strong>no advertising cookies</strong>, no cross-site tracking beacons, and loads no
              third-party analytics telemetry (such as Google Analytics or Segment). Theme preferences (
              <code className='text-indigo-300 bg-white/5 px-1.5 py-0.5 rounded font-mono text-xs'>dark</code> /{' '}
              <code className='text-indigo-300 bg-white/5 px-1.5 py-0.5 rounded font-mono text-xs'>light</code>) and app
              settings are persisted solely in your local storage.
            </p>
          </section>

          {/* Section 4 */}
          <section id='terms' className='space-y-4 scroll-mt-28'>
            <h2 className='text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5'>
              <span className='text-indigo-400 font-mono text-base'>04.</span>
              <span>Terms of Service & License</span>
            </h2>
            <p>
              Jobloom is provided by <strong>Digitat</strong> (&quot;digitat.in&quot;) as a free, client-side
              productivity software tool.
            </p>
            <ul className='list-disc pl-6 space-y-2 text-zinc-400 text-sm'>
              <li>
                <strong>As-Is Basis:</strong> The software is provided &quot;as is&quot;, without warranty of any kind,
                express or implied, including but not limited to the warranties of merchantability or fitness for a
                particular purpose.
              </li>
              <li>
                <strong>Limitation of Liability:</strong> In no event shall digitat.in be liable for any data loss
                resulting from browser cache wipes, hardware failure, or device operating system storage management.
              </li>
              <li>
                <strong>Lawful Use:</strong> You agree to use Jobloom in compliance with all applicable local, national,
                and international laws.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className='space-y-4'>
            <h2 className='text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5'>
              <span className='text-indigo-400 font-mono text-base'>05.</span>
              <span>Contact & Inquiries</span>
            </h2>
            <p>
              For security disclosures, open-source feedback, or questions regarding Jobloom&apos;s privacy framework,
              please reach out directly:
            </p>
            <div className='p-4 rounded-2xl bg-white/3 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono'>
              <div>
                <span className='text-zinc-500 block'>STUDIO & MAINTAINER</span>
                <span className='text-white font-bold text-sm'>Digitat Studio</span>
              </div>
              <div>
                <span className='text-zinc-500 block'>OFFICIAL DOMAIN</span>
                <a
                  href='https://digitat.in'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-indigo-400 hover:underline'
                >
                  https://digitat.in
                </a>
              </div>
              <div>
                <span className='text-zinc-500 block'>APPLICATION HOST</span>
                <a
                  href='https://jobloom.digitat.in'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-emerald-400 hover:underline'
                >
                  https://jobloom.digitat.in
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
