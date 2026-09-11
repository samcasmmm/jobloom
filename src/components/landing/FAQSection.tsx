'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles, Shield, RefreshCw, FolderGit2, CalendarClock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FAQItem {
  q: string;
  a: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
}

const faqs: FAQItem[] = [
  {
    q: 'Where is my job application data stored?',
    a: 'All data is stored directly in your browser’s IndexedDB storage on your device. There is no remote backend, no cloud database, and no server logging your confidential interview notes, compensation figures, or company applications.',
    icon: Shield,
    tag: 'Privacy & Storage',
  },
  {
    q: 'What happens if I clear my browser history or cookies?',
    a: 'Clearing your browser’s "Site Data" or IndexedDB can wipe local databases. To prevent accidental data loss, Jobloom includes a 1-click JSON backup export in Settings. We recommend downloading a backup copy periodically or after large application sprints.',
    icon: RefreshCw,
    tag: 'Data Safety',
  },
  {
    q: 'How do I move my applications to another computer or browser?',
    a: 'Simply go to Settings > Export Backup to download your verified `.json` file. On your new computer or browser, open Jobloom, go to Settings > Import Backup, and your entire board, rounds, document versions, and notes are instantly restored.',
    icon: FolderGit2,
    tag: 'Portability',
  },
  {
    q: 'Can I track multi-round interviews and take-home tests?',
    a: 'Yes! Jobloom supports unlimited interview rounds per application (HR Screen, Technical, System Design, Managerial, Assignment) with structured prep notes, scheduled dates, meeting links, and Pass/Fail/Pending outcome tracking.',
    icon: Sparkles,
    tag: 'Interview Pipeline',
  },
  {
    q: 'How do follow-up reminders work without push notifications?',
    a: 'Reminders are calculated dynamically on read whenever you open the app (e.g. flagging applications with no activity for 7+ days or upcoming scheduled interviews). This requires zero background daemons, zero battery drain, and no browser notification permissions.',
    icon: CalendarClock,
    tag: 'Smart Heuristics',
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id='faq' className='py-24 relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
      {/* Header */}
      <div className='text-center mb-14'>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className='inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide mb-3'
        >
          <HelpCircle className='w-3.5 h-3.5' />
          <span>Got Questions?</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight'
        >
          Frequently Asked Questions
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className='mt-3 text-zinc-400 text-sm sm:text-base max-w-xl mx-auto'
        >
          Everything you need to know about Jobloom’s local-first architecture and workflow.
        </motion.p>
      </div>

      {/* Accordion List */}
      <div className='flex flex-col gap-3.5'>
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          const Icon = faq.icon;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              className={`rounded-2xl border transition-colors duration-300 overflow-hidden ${
                isOpen
                  ? 'bg-[#0e0e17]/90 border-indigo-500/35 shadow-[0_8px_30px_rgba(99,102,241,0.08)]'
                  : 'bg-[#0a0a10]/60 border-white/8 hover:border-white/15 hover:bg-[#0c0c14]/80'
              }`}
            >
              <button
                type='button'
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className='w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer select-none group'
              >
                <div className='flex items-center gap-3.5 sm:gap-4 min-w-0'>
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isOpen
                        ? 'bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/40'
                        : 'bg-white/5 text-zinc-400 group-hover:text-zinc-200 group-hover:bg-white/8'
                    }`}
                  >
                    <Icon className='w-4 h-4' />
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-xs font-mono text-zinc-400 mb-0.5'>{faq.tag}</span>
                    <span
                      className={`text-base sm:text-lg font-semibold transition-colors duration-200 ${isOpen ? 'text-white' : 'text-zinc-200 group-hover:text-white'}`}
                    >
                      {faq.q}
                    </span>
                  </div>
                </div>

                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 ${
                    isOpen
                      ? 'bg-indigo-500/15 text-indigo-400 rotate-180'
                      : 'bg-white/5 text-zinc-400 group-hover:text-white'
                  }`}
                >
                  <ChevronDown className='w-4 h-4' />
                </div>
              </button>

              {/* Animated Expansion Content */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key='content'
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: 'auto',
                      opacity: 1,
                      transition: {
                        height: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
                        opacity: { duration: 0.25, delay: 0.05 },
                      },
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                      transition: {
                        height: { duration: 0.24, ease: [0.16, 1, 0.3, 1] },
                        opacity: { duration: 0.15 },
                      },
                    }}
                    className='overflow-hidden'
                  >
                    <div className='px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-zinc-300 leading-relaxed border-t border-white/6 pl-16 sm:pl-18'>
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQSection;
