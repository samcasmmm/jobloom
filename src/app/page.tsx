import {
  LandingNavbar,
  LandingHeroV2,
  ArchitectureDeepDive,
  FeatureBento,
  PrivacyComparison,
  FAQSection,
  LandingFooter,
} from '@/components';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Jobloom — The Local-First Job Application & Interview Tracker',
  description:
    'A privacy-first, local-first web app to track job applications, multi-round technical interviews, resume versions, and follow-ups. Stored directly in your browser with IndexedDB and JSON backups.',
});

export default function Home() {
  return (
    <div className='relative min-h-screen w-full bg-[#07070b] text-white selection:bg-indigo-500 selection:text-white'>
      {/* Page Content Shell */}
      <div className='relative z-10 flex flex-col min-h-screen'>
        <LandingNavbar />
        <main className='flex-1'>
          <LandingHeroV2 />
          <ArchitectureDeepDive />
          <FeatureBento />
          <PrivacyComparison />
          <FAQSection />
        </main>
        <LandingFooter />
      </div>
    </div>
  );
}
