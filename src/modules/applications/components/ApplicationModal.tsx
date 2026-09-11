'use client';

import React, { useState } from 'react';
import { X, Building2, Briefcase, Link as LinkIcon, MapPin, DollarSign, Calendar, Sparkles } from 'lucide-react';
import type { Application } from '@/modules/storage/types/schema';
import { ApplicationFormSchema, type ApplicationFormData } from '../validations/application.schema';
import { StatusDropdown, SourceDropdown, DatePicker } from '@/components/ui';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ApplicationFormData) => Promise<void>;
  initialData?: Application | null;
}

const SOURCES: Application['source'][] = ['LinkedIn', 'Referral', 'Wellfound', 'Naukri', 'Company Site', 'Other'];

const STATUSES: Application['status'][] = ['Wishlist', 'Applied', 'OA', 'Interview', 'Offer', 'Rejected', 'Ghosted'];

const getInitialFormData = (initialData?: Application | null): ApplicationFormData => {
  if (initialData) {
    return {
      company: initialData.company || '',
      role: initialData.role || '',
      jobLink: initialData.jobLink || '',
      location: initialData.location || '',
      salaryMin: initialData.salaryMin,
      salaryMax: initialData.salaryMax,
      source: initialData.source || 'LinkedIn',
      status: initialData.status || 'Applied',
      appliedDate: initialData.appliedDate?.split('T')[0] || new Date().toISOString().split('T')[0],
      followUpDate: initialData.followUpDate?.split('T')[0] || '',
    };
  }
  return {
    company: '',
    role: '',
    jobLink: '',
    location: '',
    salaryMin: undefined,
    salaryMax: undefined,
    source: 'LinkedIn',
    status: 'Applied',
    appliedDate: new Date().toISOString().split('T')[0],
    followUpDate: '',
  };
};

const ApplicationModalContent: React.FC<ApplicationModalProps> = ({ onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<ApplicationFormData>(() => getInitialFormData(initialData));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const parsed = ApplicationFormSchema.parse(formData);
      setIsSubmitting(true);
      await onSubmit(parsed);
      onClose();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'flatten' in err) {
        const fieldErrors = (err as { flatten: () => { fieldErrors: Record<string, string[]> } }).flatten().fieldErrors;
        const errMap: Record<string, string> = {};
        for (const [key, val] of Object.entries(fieldErrors)) {
          if (val && val.length > 0) {
            errMap[key] = val[0];
          }
        }
        setErrors(errMap);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in duration-200'>
      <div className='absolute inset-y-0 right-0 max-w-full flex pl-10' onClick={onClose}>
        <div
          className='w-screen max-w-xl sm:max-w-2xl bg-[#0b0b13] border-l border-white/10 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300'
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className='p-6 border-b border-white/10 bg-white/2 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='w-9 h-9 rounded-sm bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400'>
                <Sparkles className='w-4 h-4' />
              </div>
              <div>
                <h2 className='text-xl font-bold text-white font-mono'>
                  {initialData ? 'Edit Application' : 'New Job Application'}
                </h2>
                <p className='text-xs text-zinc-400 font-mono'>Direct client-side IndexedDB persistence</p>
              </div>
            </div>
            <button
              type='button'
              onClick={onClose}
              className='p-2 rounded-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer'
            >
              <X className='w-5 h-5' />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='flex-1 flex flex-col justify-between overflow-y-auto custom-scrollbar p-6 space-y-6 text-left'>
            <div className='space-y-4'>
              {/* Company & Role */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label className='text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5 font-mono'>
                    <Building2 className='w-3.5 h-3.5 text-zinc-400' />
                    Company Name *
                  </label>
                  <input
                    type='text'
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder='e.g. Stripe, Linear, Figma'
                    className='w-full h-10.5 px-3.5 py-2 rounded-sm bg-white/4 border border-white/10 text-sm text-white focus:outline-hidden focus:border-indigo-500 transition-all placeholder:text-zinc-600 font-mono'
                  />
                  {errors.company && <p className='text-[11px] text-rose-400 mt-1 font-mono'>{errors.company}</p>}
                </div>

                <div>
                  <label className='text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5 font-mono'>
                    <Briefcase className='w-3.5 h-3.5 text-zinc-400' />
                    Role Title *
                  </label>
                  <input
                    type='text'
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder='e.g. Staff Infrastructure Engineer'
                    className='w-full h-10.5 px-3.5 py-2 rounded-sm bg-white/4 border border-white/10 text-sm text-white focus:outline-hidden focus:border-indigo-500 transition-all placeholder:text-zinc-600 font-mono'
                  />
                  {errors.role && <p className='text-[11px] text-rose-400 mt-1 font-mono'>{errors.role}</p>}
                </div>
              </div>

              {/* Job Link & Location */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label className='text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5 font-mono'>
                    <LinkIcon className='w-3.5 h-3.5 text-zinc-400' />
                    Job Posting URL
                  </label>
                  <input
                    type='url'
                    value={formData.jobLink}
                    onChange={(e) => setFormData({ ...formData, jobLink: e.target.value })}
                    placeholder='https://company.com/jobs/...'
                    className='w-full h-10.5 px-3.5 py-2 rounded-sm bg-white/4 border border-white/10 text-sm text-white focus:outline-hidden focus:border-indigo-500 transition-all placeholder:text-zinc-600 font-mono'
                  />
                  {errors.jobLink && <p className='text-[11px] text-rose-400 mt-1 font-mono'>{errors.jobLink}</p>}
                </div>

                <div>
                  <label className='text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5 font-mono'>
                    <MapPin className='w-3.5 h-3.5 text-zinc-400' />
                    Location
                  </label>
                  <input
                    type='text'
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder='Remote, San Francisco, Hybrid'
                    className='w-full h-10.5 px-3.5 py-2 rounded-sm bg-white/4 border border-white/10 text-sm text-white focus:outline-hidden focus:border-indigo-500 transition-all placeholder:text-zinc-600 font-mono'
                  />
                </div>
              </div>

              {/* Salary Min & Max */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label className='text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5 font-mono'>
                    <DollarSign className='w-3.5 h-3.5 text-zinc-400' />
                    Salary Min ($)
                  </label>
                  <input
                    type='number'
                    min='0'
                    step='1000'
                    value={formData.salaryMin ?? ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        salaryMin: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    placeholder='180000'
                    className='w-full h-10.5 px-3.5 py-2 rounded-sm bg-white/4 border border-white/10 text-sm text-white focus:outline-hidden focus:border-indigo-500 transition-all placeholder:text-zinc-600 font-mono'
                  />
                </div>

                <div>
                  <label className='text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5 font-mono'>
                    <DollarSign className='w-3.5 h-3.5 text-zinc-400' />
                    Salary Max ($)
                  </label>
                  <input
                    type='number'
                    min='0'
                    step='1000'
                    value={formData.salaryMax ?? ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        salaryMax: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    placeholder='240000'
                    className='w-full h-10.5 px-3.5 py-2 rounded-sm bg-white/4 border border-white/10 text-sm text-white focus:outline-hidden focus:border-indigo-500 transition-all placeholder:text-zinc-600 font-mono'
                  />
                </div>
              </div>

              {/* Status & Source */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-xs font-medium text-zinc-300 mb-1.5 font-mono'>Stage Status *</label>
                  <StatusDropdown
                    value={formData.status}
                    onChange={(newStatus) => setFormData({ ...formData, status: newStatus })}
                    size='md'
                    className='w-full'
                  />
                </div>

                <div>
                  <label className='block text-xs font-medium text-zinc-300 mb-1.5 font-mono'>Source Channel *</label>
                  <SourceDropdown
                    value={formData.source}
                    onChange={(newSource) => setFormData({ ...formData, source: newSource })}
                    showAllOption={false}
                    size='md'
                    className='w-full'
                  />
                </div>
              </div>

              {/* Applied Date & Follow-Up Date */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div>
                  <label className='text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5 font-mono'>
                    <Calendar className='w-3.5 h-3.5 text-zinc-400' />
                    Applied Date *
                  </label>
                  <DatePicker
                    value={formData.appliedDate}
                    onChange={(dateStr) => setFormData({ ...formData, appliedDate: dateStr })}
                    placeholder='dd-mm-yyyy'
                    required={true}
                    size='md'
                  />
                  {errors.appliedDate && <p className='text-[11px] text-rose-400 mt-1 font-mono'>{errors.appliedDate}</p>}
                </div>

                <div>
                  <label className='text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5 font-mono'>
                    <Calendar className='w-3.5 h-3.5 text-amber-400' />
                    Scheduled Follow-up Date
                  </label>
                  <DatePicker
                    value={formData.followUpDate}
                    onChange={(dateStr) => setFormData({ ...formData, followUpDate: dateStr })}
                    placeholder='dd-mm-yyyy'
                    showClear={true}
                    size='md'
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex items-center justify-end gap-3 pt-5 border-t border-white/10 mt-auto bg-[#0b0b13]'>
              <button
                type='button'
                onClick={onClose}
                className='px-4 py-2 rounded-sm text-xs font-mono font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={isSubmitting}
                className='px-5 py-2 rounded-sm text-xs font-mono font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all disabled:opacity-50 cursor-pointer shadow-none'
              >
                {isSubmitting ? 'Saving...' : initialData ? 'Save Changes' : 'Create Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export const ApplicationModal: React.FC<ApplicationModalProps> = (props) => {
  if (!props.isOpen) return null;
  return <ApplicationModalContent key={props.initialData?.id || 'new-app'} {...props} />;
};
