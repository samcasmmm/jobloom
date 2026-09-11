'use client';

import React, { useState } from 'react';
import { Users, ExternalLink, Mail, Phone, Plus, Trash2, X } from 'lucide-react';
import type { Application, Contact } from '@/modules/storage/types/schema';
import { saveContact, deleteContact } from '@/modules/storage/repositories/contacts.repository';
import { SelectDropdown } from '@/components/ui';

interface ContactsViewProps {
  applications: Application[];
  contacts: Contact[];
  onSelectApplication: (app: Application) => void;
  onRefresh: () => Promise<void>;
}

export const ContactsView: React.FC<ContactsViewProps> = ({
  applications,
  contacts,
  onSelectApplication,
  onRefresh,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    role: '',
    company: '',
    linkedinUrl: '',
    email: '',
    phone: '',
    notes: '',
    applicationId: applications[0]?.id || '',
  });

  const appMap = new Map(applications.map((a) => [a.id, a]));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.name.trim()) return;

    const contact: Contact = {
      id: crypto.randomUUID(),
      name: newContact.name.trim(),
      role: newContact.role.trim() || undefined,
      company: newContact.company.trim() || undefined,
      linkedinUrl: newContact.linkedinUrl.trim() || undefined,
      email: newContact.email.trim() || undefined,
      phone: newContact.phone.trim() || undefined,
      notes: newContact.notes.trim() || undefined,
      applicationIds: newContact.applicationId ? [newContact.applicationId] : [],
      createdAt: new Date().toISOString(),
    };

    await saveContact(contact);
    setShowAddModal(false);
    setNewContact({
      name: '',
      role: '',
      company: '',
      linkedinUrl: '',
      email: '',
      phone: '',
      notes: '',
      applicationId: applications[0]?.id || '',
    });
    await onRefresh();
  };

  const handleDelete = async (id: string) => {
    await deleteContact(id);
    await onRefresh();
  };

  return (
    <div className='w-full space-y-6 text-left'>
      {/* Top Header */}
      <div className='flex flex-wrap items-center justify-between gap-4 p-4 rounded-sm bg-[#090912]/80 border border-white/8'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-sm bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400'>
            <Users className='w-5 h-5' />
          </div>
          <div>
            <h2 className='text-base font-bold text-white'>Recruiter & Referral Directory</h2>
            <p className='text-xs text-zinc-400 font-mono'>
              {contacts.length} contact{contacts.length === 1 ? '' : 's'} in your network
            </p>
          </div>
        </div>

        <button
          type='button'
          onClick={() => setShowAddModal(true)}
          className='h-8 px-3.5 inline-flex items-center gap-1.5 rounded-sm bg-indigo-600 text-white text-xs font-mono font-bold hover:bg-indigo-500 transition-all cursor-pointer shadow-none'
        >
          <Plus className='w-4 h-4' />
          <span>Add Contact</span>
        </button>
      </div>

      {/* Contacts Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {contacts.map((contact) => {
          const linkedApps = contact.applicationIds
            .map((id) => appMap.get(id))
            .filter((a): a is Application => Boolean(a));

          return (
            <div
              key={contact.id}
              className='p-5 rounded-sm bg-[#090912]/80 border border-white/8 hover:border-emerald-500/40 transition-all flex flex-col justify-between shadow-none'
            >
              <div>
                <div className='flex items-start justify-between gap-2'>
                  <div>
                    <h3 className='text-sm font-bold text-white'>{contact.name}</h3>
                    <p className='text-xs text-indigo-400 font-medium mt-0.5'>
                      {contact.role || 'Hiring Contact'} {contact.company ? `• ${contact.company}` : ''}
                    </p>
                  </div>
                  <button
                    type='button'
                    onClick={() => handleDelete(contact.id)}
                    className='text-zinc-500 hover:text-rose-400 p-1 rounded-sm cursor-pointer'
                    title='Delete Contact'
                  >
                    <Trash2 className='w-3.5 h-3.5' />
                  </button>
                </div>

                <div className='mt-3.5 space-y-1.5 text-xs text-zinc-400 font-mono'>
                  {contact.email && (
                    <div className='flex items-center gap-2'>
                      <Mail className='w-3.5 h-3.5 text-zinc-500 shrink-0' />
                      <a href={`mailto:${contact.email}`} className='text-zinc-300 hover:underline truncate'>
                        {contact.email}
                      </a>
                    </div>
                  )}

                  {contact.phone && (
                    <div className='flex items-center gap-2'>
                      <Phone className='w-3.5 h-3.5 text-zinc-500 shrink-0' />
                      <span>{contact.phone}</span>
                    </div>
                  )}

                  {contact.linkedinUrl && (
                    <div className='flex items-center gap-2'>
                      <ExternalLink className='w-3.5 h-3.5 text-indigo-400 shrink-0' />
                      <a
                        href={contact.linkedinUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-indigo-400 hover:underline truncate'
                      >
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                </div>

                {contact.notes && (
                  <p className='mt-3 pt-3 border-t border-white/5 text-xs text-zinc-300 leading-relaxed line-clamp-2'>
                    {contact.notes}
                  </p>
                )}
              </div>

              {/* Linked Applications */}
              {linkedApps.length > 0 && (
                <div className='mt-4 pt-3 border-t border-white/5'>
                  <span className='text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1'>
                    Linked Applications
                  </span>
                  <div className='flex flex-wrap gap-1.5'>
                    {linkedApps.map((app) => (
                      <span
                        key={app.id}
                        onClick={() => onSelectApplication(app)}
                        className='text-[11px] px-2 py-0.5 rounded-sm bg-white/4 text-indigo-300 hover:bg-white/8 hover:underline cursor-pointer border border-white/5 font-mono'
                      >
                        {app.company}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {contacts.length === 0 && (
          <div className='col-span-full py-16 text-center border border-dashed border-white/10 rounded-sm'>
            <Users className='w-10 h-10 text-zinc-600 mx-auto mb-2' />
            <h3 className='text-sm font-bold text-white'>No contacts saved yet</h3>
            <p className='text-xs text-zinc-400 mt-1 font-mono'>
              Track recruiters, referrals, and engineering leaders linked to your job applications.
            </p>
          </div>
        )}
      </div>

      {/* Add Contact Drawer */}
      {showAddModal && (
        <div className='fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in duration-200'>
          <div className='absolute inset-y-0 right-0 max-w-full flex pl-10' onClick={() => setShowAddModal(false)}>
            <div
              className='w-screen max-w-lg bg-[#0b0b13] border-l border-white/10 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300'
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className='p-6 border-b border-white/10 bg-white/2 flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='w-9 h-9 rounded-sm bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400'>
                    <Users className='w-4 h-4' />
                  </div>
                  <div>
                    <h2 className='text-lg font-bold text-white font-mono'>Add Network Contact</h2>
                    <p className='text-xs text-zinc-400 font-mono'>Link recruiters & referrals to applications</p>
                  </div>
                </div>
                <button
                  type='button'
                  onClick={() => setShowAddModal(false)}
                  className='p-2 rounded-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer'
                >
                  <X className='w-5 h-5' />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className='flex-1 flex flex-col justify-between overflow-y-auto custom-scrollbar p-6 space-y-6 text-left'>
                <div className='space-y-4 font-mono'>
                  {/* Full Name & Role */}
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-zinc-300 mb-1.5 text-xs font-medium'>Full Name *</label>
                      <input
                        type='text'
                        required
                        placeholder='Sarah Jenkins'
                        value={newContact.name}
                        onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                        className='w-full h-10.5 px-3.5 py-2 rounded-sm bg-white/4 border border-white/10 text-sm text-white focus:outline-hidden focus:border-indigo-500 font-mono'
                      />
                    </div>
                    <div>
                      <label className='block text-zinc-300 mb-1.5 text-xs font-medium'>Role / Title</label>
                      <input
                        type='text'
                        placeholder='Staff Technical Recruiter'
                        value={newContact.role}
                        onChange={(e) => setNewContact({ ...newContact, role: e.target.value })}
                        className='w-full h-10.5 px-3.5 py-2 rounded-sm bg-white/4 border border-white/10 text-sm text-white focus:outline-hidden focus:border-indigo-500 font-mono'
                      />
                    </div>
                  </div>

                  {/* Company & Linked Application */}
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-zinc-300 mb-1.5 text-xs font-medium'>Company</label>
                      <input
                        type='text'
                        placeholder='Stripe, Linear, Figma'
                        value={newContact.company}
                        onChange={(e) => setNewContact({ ...newContact, company: e.target.value })}
                        className='w-full h-10.5 px-3.5 py-2 rounded-sm bg-white/4 border border-white/10 text-sm text-white focus:outline-hidden focus:border-indigo-500 font-mono'
                      />
                    </div>
                    <div>
                      <label className='block text-zinc-300 mb-1.5 text-xs font-medium'>Link to Application</label>
                      <SelectDropdown
                        value={newContact.applicationId}
                        onChange={(val) => setNewContact({ ...newContact, applicationId: val })}
                        options={[
                          { value: '', label: 'None' },
                          ...applications.map((a) => ({
                            value: a.id,
                            label: `${a.company} (${a.role})`,
                          })),
                        ]}
                        size='md'
                        fullWidth={true}
                      />
                    </div>
                  </div>

                  {/* Email & LinkedIn */}
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div>
                      <label className='block text-zinc-300 mb-1.5 text-xs font-medium'>Email</label>
                      <input
                        type='email'
                        placeholder='sarah@stripe.com'
                        value={newContact.email}
                        onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                        className='w-full h-10.5 px-3.5 py-2 rounded-sm bg-white/4 border border-white/10 text-sm text-white focus:outline-hidden focus:border-indigo-500 font-mono'
                      />
                    </div>
                    <div>
                      <label className='block text-zinc-300 mb-1.5 text-xs font-medium'>LinkedIn URL</label>
                      <input
                        type='url'
                        placeholder='https://linkedin.com/in/...'
                        value={newContact.linkedinUrl}
                        onChange={(e) => setNewContact({ ...newContact, linkedinUrl: e.target.value })}
                        className='w-full h-10.5 px-3.5 py-2 rounded-sm bg-white/4 border border-white/10 text-sm text-white focus:outline-hidden focus:border-indigo-500 font-mono'
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className='block text-zinc-300 mb-1.5 text-xs font-medium'>Notes</label>
                    <textarea
                      rows={3}
                      placeholder='Communication preferences, referral context, interview tips...'
                      value={newContact.notes}
                      onChange={(e) => setNewContact({ ...newContact, notes: e.target.value })}
                      className='w-full px-3.5 py-2.5 rounded-sm bg-white/4 border border-white/10 text-sm text-white focus:outline-hidden focus:border-indigo-500 resize-none font-mono'
                    />
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className='flex items-center justify-end gap-3 pt-5 border-t border-white/10 mt-auto bg-[#0b0b13]'>
                  <button
                    type='button'
                    onClick={() => setShowAddModal(false)}
                    className='px-4 py-2 rounded-sm text-xs font-mono font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer'
                  >
                    Cancel
                  </button>
                  <button
                    type='submit'
                    className='px-5 py-2 rounded-sm text-xs font-mono font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all cursor-pointer shadow-none'
                  >
                    Save Contact
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
