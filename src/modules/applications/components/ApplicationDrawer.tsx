'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  ExternalLink,
  MapPin,
  Calendar,
  Layers,
  FileText,
  Users,
  Clock,
  Plus,
  Trash2,
  Upload,
  Download,
  Pencil,
  CheckCircle2,
  Mail,
  Eye,
} from 'lucide-react';
import type { Application, InterviewRound, DocumentFile, Contact, NoteEntry } from '@/modules/storage/types/schema';
import { StatusDropdown, SelectDropdown, DatePicker } from '@/components/ui';
import {
  getInterviewsByApplicationId,
  saveInterview,
  deleteInterview,
} from '@/modules/storage/repositories/interviews.repository';
import {
  getDocumentsByApplicationId,
  saveDocument,
  deleteDocument,
} from '@/modules/storage/repositories/documents.repository';
import { getContactsByApplicationId, saveContact } from '@/modules/storage/repositories/contacts.repository';
import { getNotesByApplicationId, saveNote } from '@/modules/storage/repositories/notes.repository';
import { formatDateTime } from '@/lib/date';
import { DocumentPreviewModal } from '@/modules/documents/components/DocumentPreviewModal';

interface ApplicationDrawerProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: Application['status']) => Promise<void>;
  onEdit: (app: Application) => void;
  onDelete: (id: string) => Promise<void>;
}

const INTERVIEW_TYPES: InterviewRound['type'][] = [
  'HR',
  'Tech',
  'Managerial',
  'System Design',
  'Culture Fit',
  'Assignment',
  'Other',
];

export const ApplicationDrawer: React.FC<ApplicationDrawerProps> = ({
  application,
  isOpen,
  onClose,
  onUpdateStatus,
  onEdit,
  onDelete,
}) => {
  const [activeTab, setActiveTab] = useState<'interviews' | 'documents' | 'contacts' | 'timeline'>('interviews');
  const [interviews, setInterviews] = useState<InterviewRound[]>([]);
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [notes, setNotes] = useState<NoteEntry[]>([]);
  const [previewDoc, setPreviewDoc] = useState<DocumentFile | null>(null);

  // New Interview Form State
  const [showAddInterview, setShowAddInterview] = useState(false);
  const [newInterview, setNewInterview] = useState<Partial<InterviewRound>>({
    type: 'Tech',
    mode: 'Online',
    scheduledAt: new Date().toISOString().slice(0, 16),
    interviewerName: '',
    interviewerRole: '',
    meetingLink: '',
    outcome: 'Pending',
    notes: '',
  });

  // New Manual Note State
  const [manualNoteText, setManualNoteText] = useState('');

  // New Contact State
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    role: '',
    company: '',
    linkedinUrl: '',
    email: '',
    phone: '',
    notes: '',
  });

  const loadData = useCallback(async () => {
    if (!application) return;
    try {
      const [ints, docs, cons, nts] = await Promise.all([
        getInterviewsByApplicationId(application.id),
        getDocumentsByApplicationId(application.id),
        getContactsByApplicationId(application.id),
        getNotesByApplicationId(application.id),
      ]);
      setInterviews(ints.sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()));
      setDocuments(docs);
      setContacts(cons);
      setNotes(nts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err) {
      console.error('Failed to load drawer application details', err);
    }
  }, [application]);

  useEffect(() => {
    let isMounted = true;
    if (isOpen && application) {
      Promise.all([
        getInterviewsByApplicationId(application.id),
        getDocumentsByApplicationId(application.id),
        getContactsByApplicationId(application.id),
        getNotesByApplicationId(application.id),
      ])
        .then(([ints, docs, cons, nts]) => {
          if (isMounted) {
            setInterviews(ints.sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()));
            setDocuments(docs);
            setContacts(cons);
            setNotes(nts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
          }
        })
        .catch((err) => {
          console.error('Failed to load drawer application details', err);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [isOpen, application]);

  if (!isOpen || !application) return null;

  // Handle Add Interview Round
  const handleSaveInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!application) return;

    const round: InterviewRound = {
      id: crypto.randomUUID(),
      applicationId: application.id,
      type: (newInterview.type || 'Tech') as InterviewRound['type'],
      mode: (newInterview.mode || 'Online') as InterviewRound['mode'],
      scheduledAt: newInterview.scheduledAt || new Date().toISOString(),
      interviewerName: newInterview.interviewerName?.trim() || undefined,
      interviewerRole: newInterview.interviewerRole?.trim() || undefined,
      meetingLink: newInterview.meetingLink?.trim() || undefined,
      outcome: (newInterview.outcome || 'Pending') as InterviewRound['outcome'],
      notes: newInterview.notes?.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    await saveInterview(round);

    // Auto-log note
    await saveNote({
      id: crypto.randomUUID(),
      applicationId: application.id,
      type: 'auto',
      content: `Scheduled ${round.type} interview loop on ${new Date(round.scheduledAt).toLocaleDateString()}.`,
      createdAt: new Date().toISOString(),
    });

    setShowAddInterview(false);
    setNewInterview({
      type: 'Tech',
      mode: 'Online',
      scheduledAt: new Date().toISOString().slice(0, 16),
      interviewerName: '',
      interviewerRole: '',
      meetingLink: '',
      outcome: 'Pending',
      notes: '',
    });
    await loadData();
  };

  const handleDeleteInterview = async (id: string) => {
    await deleteInterview(id);
    await loadData();
  };

  // Handle Document Upload (Blob to IndexedDB)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !application) return;
    const file = e.target.files[0];

    const docFile: DocumentFile = {
      id: crypto.randomUUID(),
      applicationId: application.id,
      type: file.name.toLowerCase().includes('cover') ? 'CoverLetter' : 'Resume',
      label: file.name.replace(/\.[^/.]+$/, ''),
      blob: file,
      fileName: file.name,
      mimeType: file.type || 'application/octet-stream',
      uploadedAt: new Date().toISOString(),
    };

    await saveDocument(docFile);

    // Auto-log note
    await saveNote({
      id: crypto.randomUUID(),
      applicationId: application.id,
      type: 'auto',
      content: `Uploaded document: ${file.name} (${(file.size / 1024).toFixed(1)} KB).`,
      createdAt: new Date().toISOString(),
    });

    await loadData();
  };

  const handleDeleteDoc = async (id: string) => {
    await deleteDocument(id);
    await loadData();
  };

  const handleDownloadDoc = (doc: DocumentFile) => {
    const url = URL.createObjectURL(doc.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle Add Contact
  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.name.trim() || !application) return;

    const contact: Contact = {
      id: crypto.randomUUID(),
      name: newContact.name.trim(),
      role: newContact.role.trim() || undefined,
      company: newContact.company.trim() || application.company,
      linkedinUrl: newContact.linkedinUrl.trim() || undefined,
      email: newContact.email.trim() || undefined,
      phone: newContact.phone.trim() || undefined,
      notes: newContact.notes.trim() || undefined,
      applicationIds: [application.id],
      createdAt: new Date().toISOString(),
    };

    await saveContact(contact);

    // Auto-log note
    await saveNote({
      id: crypto.randomUUID(),
      applicationId: application.id,
      type: 'auto',
      content: `Added contact: ${contact.name}${contact.role ? ` (${contact.role})` : ''}.`,
      createdAt: new Date().toISOString(),
    });

    setShowAddContact(false);
    setNewContact({
      name: '',
      role: '',
      company: '',
      linkedinUrl: '',
      email: '',
      phone: '',
      notes: '',
    });
    await loadData();
  };

  // Handle Add Manual Note
  const handleAddManualNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualNoteText.trim() || !application) return;

    await saveNote({
      id: crypto.randomUUID(),
      applicationId: application.id,
      type: 'manual',
      content: manualNoteText.trim(),
      createdAt: new Date().toISOString(),
    });

    setManualNoteText('');
    await loadData();
  };

  return (
    <div className='fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in duration-200'>
      <div className='absolute inset-y-0 right-0 max-w-full flex pl-10'>
        <div className='w-screen max-w-2xl bg-[#0b0b13] border-l border-white/10 shadow-2xl flex flex-col'>
          {/* Header */}
          <div className='p-6 border-b border-white/10 bg-white/2'>
            <div className='flex items-start justify-between gap-4'>
              <div>
                <div className='flex items-center gap-2 flex-wrap'>
                  <StatusDropdown
                    value={application.status}
                    onChange={(newStatus) => onUpdateStatus(application.id, newStatus)}
                    size='sm'
                  />
                  <span className='text-xs font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded-sm border border-white/10'>
                    {application.source}
                  </span>
                  {application.location && (
                    <span className='text-xs text-zinc-400 flex items-center gap-1 font-mono'>
                      <MapPin className='w-3 h-3 text-zinc-500' />
                      {application.location}
                    </span>
                  )}
                </div>
                <h2 className='text-2xl font-black text-white mt-2'>{application.role}</h2>
                <p className='text-base font-semibold text-indigo-400 mt-0.5'>{application.company}</p>
              </div>

              <div className='flex items-center gap-2 shrink-0'>
                <button
                  type='button'
                  onClick={() => onEdit(application)}
                  className='p-2 rounded-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer'
                  title='Edit Application'
                >
                  <Pencil className='w-4 h-4' />
                </button>
                <button
                  type='button'
                  onClick={() => onDelete(application.id)}
                  className='p-2 rounded-sm text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer'
                  title='Delete Application'
                >
                  <Trash2 className='w-4 h-4' />
                </button>
                <button
                  type='button'
                  onClick={onClose}
                  className='p-2 rounded-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer'
                >
                  <X className='w-5 h-5' />
                </button>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className='grid grid-cols-3 gap-3 mt-5 text-xs font-mono'>
              <div className='p-3 rounded-sm bg-white/3 border border-white/8 flex flex-col justify-center gap-1.5 min-h-17'>
                <span className='text-zinc-400 block text-[10px] uppercase tracking-wider font-mono font-medium'>
                  SALARY TARGET
                </span>
                <div className='flex items-center h-7 text-zinc-100 font-bold text-xs truncate font-mono'>
                  {application.salaryMin || application.salaryMax
                    ? `$${(application.salaryMin || 0).toLocaleString()} - $${(application.salaryMax || 0).toLocaleString()}`
                    : 'Unspecified'}
                </div>
              </div>
              <div className='p-3 rounded-sm bg-white/3 border border-white/8 flex flex-col justify-center gap-1.5 min-h-17'>
                <span className='text-zinc-400 block text-[10px] uppercase tracking-wider font-mono font-medium'>
                  APPLIED DATE
                </span>
                <div className='flex items-center h-7 text-zinc-100 font-bold text-xs truncate font-mono'>
                  {application.appliedDate}
                </div>
              </div>
              <div className='p-3 rounded-sm bg-white/3 border border-white/8 flex flex-col justify-center gap-1.5 min-h-17'>
                <span className='text-zinc-400 block text-[10px] uppercase tracking-wider font-mono font-medium'>
                  STAGE STATUS
                </span>
                <div className='flex items-center h-7 w-full'>
                  <StatusDropdown
                    value={application.status}
                    onChange={(newStatus) => onUpdateStatus(application.id, newStatus)}
                    size='sm'
                    fullWidth={true}
                  />
                </div>
              </div>
            </div>

            {application.jobLink && (
              <a
                href={application.jobLink}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 hover:underline mt-3 font-mono'
              >
                <ExternalLink className='w-3.5 h-3.5' />
                <span>Open Job Posting</span>
              </a>
            )}
          </div>

          {/* Tab Navigation */}
          <div className='flex items-center border-b border-white/10 bg-[#08080f] px-6 text-xs font-medium font-mono'>
            <button
              type='button'
              onClick={() => setActiveTab('interviews')}
              className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'interviews'
                  ? 'border-indigo-500 text-white font-bold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Layers className='w-4 h-4' />
              <span>Interviews ({interviews.length})</span>
            </button>
            <button
              type='button'
              onClick={() => setActiveTab('documents')}
              className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'documents'
                  ? 'border-indigo-500 text-white font-bold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <FileText className='w-4 h-4' />
              <span>Documents ({documents.length})</span>
            </button>
            <button
              type='button'
              onClick={() => setActiveTab('contacts')}
              className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'contacts'
                  ? 'border-indigo-500 text-white font-bold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Users className='w-4 h-4' />
              <span>Contacts ({contacts.length})</span>
            </button>
            <button
              type='button'
              onClick={() => setActiveTab('timeline')}
              className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'timeline'
                  ? 'border-indigo-500 text-white font-bold'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Clock className='w-4 h-4' />
              <span>Timeline ({notes.length})</span>
            </button>
          </div>

          {/* Drawer Body */}
          <div className='flex-1 overflow-y-auto p-6 space-y-6'>
            {/* TAB 1: INTERVIEWS */}
            {activeTab === 'interviews' && (
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-sm font-bold text-white'>Technical & HR Interview Loops</h3>
                  <button
                    type='button'
                    onClick={() => setShowAddInterview(true)}
                    className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-semibold hover:bg-indigo-600/30 transition-all cursor-pointer'
                  >
                    <Plus className='w-3.5 h-3.5' />
                    <span>Log Round</span>
                  </button>
                </div>

                {/* Add Interview Modal/Inline */}
                {showAddInterview && (
                  <form
                    onSubmit={handleSaveInterview}
                    className='p-5 rounded-sm bg-[#0e0e18] border border-indigo-500/30 space-y-4'
                  >
                    <div className='flex items-center justify-between pb-3 border-b border-white/10'>
                      <div className='flex items-center gap-2.5'>
                        <div className='w-7 h-7 rounded-sm bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400'>
                          <Calendar className='w-4 h-4' />
                        </div>
                        <span className='text-sm font-bold text-white font-mono'>New Interview Round</span>
                      </div>
                      <button
                        type='button'
                        onClick={() => setShowAddInterview(false)}
                        className='p-1.5 rounded-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer'
                      >
                        <X className='w-4 h-4' />
                      </button>
                    </div>

                    {/* Round Type & Outcome */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <div>
                        <label className='text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5 font-mono'>
                          <Layers className='w-3.5 h-3.5 text-zinc-400' />
                          Round Type *
                        </label>
                        <SelectDropdown
                          value={newInterview.type || 'Tech'}
                          onChange={(val) => setNewInterview({ ...newInterview, type: val as InterviewRound['type'] })}
                          options={INTERVIEW_TYPES.map((t) => ({ value: t, label: `${t} Round` }))}
                          size='md'
                          fullWidth={true}
                        />
                      </div>

                      <div>
                        <label className='text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5 font-mono'>
                          <CheckCircle2 className='w-3.5 h-3.5 text-zinc-400' />
                          Outcome *
                        </label>
                        <SelectDropdown
                          value={newInterview.outcome || 'Pending'}
                          onChange={(val) =>
                            setNewInterview({ ...newInterview, outcome: val as InterviewRound['outcome'] })
                          }
                          options={[
                            { value: 'Pending', label: 'Pending' },
                            { value: 'Pass', label: 'Pass' },
                            { value: 'Fail', label: 'Fail' },
                          ]}
                          size='md'
                          fullWidth={true}
                        />
                      </div>
                    </div>

                    {/* Scheduled Date & Interviewer */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <div>
                        <label className='text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5 font-mono'>
                          <Calendar className='w-3.5 h-3.5 text-zinc-400' />
                          Scheduled Date & Time *
                        </label>
                        <DatePicker
                          showTime={true}
                          size='md'
                          value={newInterview.scheduledAt}
                          onChange={(val) => setNewInterview({ ...newInterview, scheduledAt: val })}
                          placeholder='dd-mm-yyyy hh:mm'
                          required={true}
                        />
                      </div>

                      <div>
                        <label className='text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5 font-mono'>
                          <Users className='w-3.5 h-3.5 text-zinc-400' />
                          Interviewer Name
                        </label>
                        <input
                          type='text'
                          placeholder='e.g. Alex Rivera (Lead Architect)'
                          value={newInterview.interviewerName || ''}
                          onChange={(e) => setNewInterview({ ...newInterview, interviewerName: e.target.value })}
                          className='w-full h-10.5 px-3.5 py-2 rounded-sm bg-white/4 border border-white/10 text-sm text-white focus:outline-hidden focus:border-indigo-500 transition-all placeholder:text-zinc-600 font-mono'
                        />
                      </div>
                    </div>

                    {/* Meeting URL */}
                    <div>
                      <label className='text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5 font-mono'>
                        <ExternalLink className='w-3.5 h-3.5 text-zinc-400' />
                        Meeting URL
                      </label>
                      <input
                        type='url'
                        placeholder='https://meet.google.com/...'
                        value={newInterview.meetingLink || ''}
                        onChange={(e) => setNewInterview({ ...newInterview, meetingLink: e.target.value })}
                        className='w-full h-10.5 px-3.5 py-2 rounded-sm bg-white/4 border border-white/10 text-sm text-white focus:outline-hidden focus:border-indigo-500 transition-all placeholder:text-zinc-600 font-mono'
                      />
                    </div>

                    {/* Prep Notes */}
                    <div>
                      <label className='text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5 font-mono'>
                        <FileText className='w-3.5 h-3.5 text-zinc-400' />
                        Prep Notes & Debrief
                      </label>
                      <textarea
                        rows={3}
                        placeholder='System architecture scope, LeetCode topics, compensation notes...'
                        value={newInterview.notes || ''}
                        onChange={(e) => setNewInterview({ ...newInterview, notes: e.target.value })}
                        className='w-full px-3.5 py-2.5 rounded-sm bg-white/4 border border-white/10 text-sm text-white focus:outline-hidden focus:border-indigo-500 transition-all placeholder:text-zinc-600 resize-none font-mono'
                      />
                    </div>

                    <div className='flex items-center justify-end gap-3 pt-3 border-t border-white/10'>
                      <button
                        type='button'
                        onClick={() => setShowAddInterview(false)}
                        className='px-4 py-2 rounded-sm text-xs font-mono font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer'
                      >
                        Cancel
                      </button>
                      <button
                        type='submit'
                        className='px-5 py-2 rounded-sm text-xs font-mono font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all cursor-pointer shadow-none'
                      >
                        Save Round
                      </button>
                    </div>
                  </form>
                )}

                {/* Interviews List */}
                <div className='space-y-3'>
                  {interviews.map((round) => (
                    <div
                      key={round.id}
                      className='p-4 rounded-sm bg-white/3 border border-white/8 hover:border-white/15 transition-all'
                    >
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <span className='text-xs font-bold text-white'>{round.type} Round</span>
                          <span
                            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm border ${
                              round.outcome === 'Pass'
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                : round.outcome === 'Fail'
                                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                                  : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                            }`}
                          >
                            {round.outcome}
                          </span>
                        </div>
                        <button
                          type='button'
                          onClick={() => handleDeleteInterview(round.id)}
                          className='text-zinc-500 hover:text-rose-400 p-1 rounded-sm cursor-pointer'
                          title='Delete Round'
                        >
                          <Trash2 className='w-3.5 h-3.5' />
                        </button>
                      </div>

                      <div className='text-xs text-zinc-400 mt-2 space-y-1 font-mono'>
                        <div className='flex items-center gap-2'>
                          <Calendar className='w-3.5 h-3.5 text-zinc-500' />
                          <span>{formatDateTime(round.scheduledAt)}</span>
                        </div>
                        {round.interviewerName && (
                          <div className='flex items-center gap-2'>
                            <Users className='w-3.5 h-3.5 text-zinc-500' />
                            <span>{round.interviewerName}</span>
                          </div>
                        )}
                        {round.meetingLink && (
                          <div className='flex items-center gap-2'>
                            <ExternalLink className='w-3.5 h-3.5 text-indigo-400' />
                            <a
                              href={round.meetingLink}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-indigo-400 hover:underline truncate'
                            >
                              Join Call Link
                            </a>
                          </div>
                        )}
                      </div>

                      {round.notes && (
                        <p className='mt-3 pt-3 border-t border-white/5 text-xs text-zinc-300 leading-relaxed'>
                          {round.notes}
                        </p>
                      )}
                    </div>
                  ))}

                  {interviews.length === 0 && !showAddInterview && (
                    <div className='text-center py-10 border border-dashed border-white/10 rounded-sm'>
                      <Layers className='w-8 h-8 text-zinc-600 mx-auto mb-2' />
                      <p className='text-xs text-zinc-400 font-mono'>No interview rounds logged yet.</p>
                      <button
                        type='button'
                        onClick={() => setShowAddInterview(true)}
                        className='mt-3 px-3.5 py-1.5 rounded-sm bg-indigo-600 text-white text-xs font-semibold font-mono cursor-pointer shadow-none'
                      >
                        Add First Round
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: DOCUMENTS */}
            {activeTab === 'documents' && (
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-sm font-bold text-white'>Resume & Cover Letter Blobs</h3>
                  <label className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-indigo-600 text-white text-xs font-mono font-semibold hover:bg-indigo-500 transition-all cursor-pointer shadow-none'>
                    <Upload className='w-3.5 h-3.5' />
                    <span>Upload Blob</span>
                    <input type='file' onChange={handleFileUpload} className='hidden' />
                  </label>
                </div>

                <div className='space-y-3'>
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className='p-4 rounded-sm bg-white/3 border border-white/8 flex items-center justify-between gap-4 group'
                    >
                      <div
                        onClick={() => setPreviewDoc(doc)}
                        className='flex items-center gap-3 min-w-0 cursor-pointer'
                        title='Click to preview document'
                      >
                        <div className='w-9 h-9 rounded-sm bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 group-hover:bg-indigo-500/25 transition-colors'>
                          <FileText className='w-5 h-5' />
                        </div>
                        <div className='min-w-0'>
                          <span className='text-xs font-bold text-white truncate block group-hover:text-indigo-300 transition-colors'>
                            {doc.fileName}
                          </span>
                          <span className='text-[10px] text-zinc-500 font-mono'>
                            {doc.type} • {(doc.blob.size / 1024).toFixed(1)} KB •{' '}
                            {new Date(doc.uploadedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className='flex items-center gap-1 shrink-0'>
                        <button
                          type='button'
                          onClick={() => setPreviewDoc(doc)}
                          className='p-2 rounded-sm text-indigo-400 hover:text-indigo-300 hover:bg-white/5 transition-all cursor-pointer'
                          title='Preview Document'
                        >
                          <Eye className='w-4 h-4' />
                        </button>
                        <button
                          type='button'
                          onClick={() => handleDownloadDoc(doc)}
                          className='p-2 rounded-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer'
                          title='Download Document'
                        >
                          <Download className='w-4 h-4' />
                        </button>
                        <button
                          type='button'
                          onClick={() => handleDeleteDoc(doc.id)}
                          className='p-2 rounded-sm text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer'
                          title='Delete Document'
                        >
                          <Trash2 className='w-4 h-4' />
                        </button>
                      </div>
                    </div>
                  ))}

                  {documents.length === 0 && (
                    <div className='text-center py-10 border border-dashed border-white/10 rounded-sm'>
                      <FileText className='w-8 h-8 text-zinc-600 mx-auto mb-2' />
                      <p className='text-xs text-zinc-400 font-mono'>No tailored resumes or cover letters attached.</p>
                      <p className='text-[11px] text-zinc-500 mt-1 font-mono'>
                        Files are stored 100% locally in IndexedDB.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: CONTACTS */}
            {activeTab === 'contacts' && (
              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-sm font-bold text-white'>Hiring Team & Referral Contacts</h3>
                  <button
                    type='button'
                    onClick={() => setShowAddContact(true)}
                    className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-semibold hover:bg-indigo-600/30 transition-all cursor-pointer'
                  >
                    <Plus className='w-3.5 h-3.5' />
                    <span>Add Contact</span>
                  </button>
                </div>

                {showAddContact && (
                  <form
                    onSubmit={handleSaveContact}
                    className='p-5 rounded-sm bg-[#0e0e18] border border-indigo-500/30 space-y-4'
                  >
                    <div className='flex items-center justify-between pb-3 border-b border-white/10'>
                      <div className='flex items-center gap-2.5'>
                        <div className='w-7 h-7 rounded-sm bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400'>
                          <Users className='w-4 h-4' />
                        </div>
                        <span className='text-sm font-bold text-white font-mono'>New Contact</span>
                      </div>
                      <button
                        type='button'
                        onClick={() => setShowAddContact(false)}
                        className='p-1.5 rounded-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer'
                      >
                        <X className='w-4 h-4' />
                      </button>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <div>
                        <label className='text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5 font-mono'>
                          <Users className='w-3.5 h-3.5 text-zinc-400' />
                          Name *
                        </label>
                        <input
                          type='text'
                          required
                          placeholder='Sarah Jenkins'
                          value={newContact.name}
                          onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                          className='w-full h-10.5 px-3.5 py-2 rounded-sm bg-white/4 border border-white/10 text-sm text-white focus:outline-hidden focus:border-indigo-500 transition-all placeholder:text-zinc-600 font-mono'
                        />
                      </div>
                      <div>
                        <label className='text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5 font-mono'>
                          <Layers className='w-3.5 h-3.5 text-zinc-400' />
                          Role / Title
                        </label>
                        <input
                          type='text'
                          placeholder='Staff Recruiter / Referral'
                          value={newContact.role}
                          onChange={(e) => setNewContact({ ...newContact, role: e.target.value })}
                          className='w-full h-10.5 px-3.5 py-2 rounded-sm bg-white/4 border border-white/10 text-sm text-white focus:outline-hidden focus:border-indigo-500 transition-all placeholder:text-zinc-600 font-mono'
                        />
                      </div>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <div>
                        <label className='text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5 font-mono'>
                          <Mail className='w-3.5 h-3.5 text-zinc-400' />
                          Email
                        </label>
                        <input
                          type='email'
                          placeholder='sarah@stripe.com'
                          value={newContact.email}
                          onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                          className='w-full h-10.5 px-3.5 py-2 rounded-sm bg-white/4 border border-white/10 text-sm text-white focus:outline-hidden focus:border-indigo-500 transition-all placeholder:text-zinc-600 font-mono'
                        />
                      </div>
                      <div>
                        <label className='text-xs font-medium text-zinc-300 mb-1.5 flex items-center gap-1.5 font-mono'>
                          <ExternalLink className='w-3.5 h-3.5 text-zinc-400' />
                          LinkedIn URL
                        </label>
                        <input
                          type='url'
                          placeholder='https://linkedin.com/in/...'
                          value={newContact.linkedinUrl}
                          onChange={(e) => setNewContact({ ...newContact, linkedinUrl: e.target.value })}
                          className='w-full h-10.5 px-3.5 py-2 rounded-sm bg-white/4 border border-white/10 text-sm text-white focus:outline-hidden focus:border-indigo-500 transition-all placeholder:text-zinc-600 font-mono'
                        />
                      </div>
                    </div>

                    <div className='flex items-center justify-end gap-3 pt-3 border-t border-white/10'>
                      <button
                        type='button'
                        onClick={() => setShowAddContact(false)}
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
                )}

                <div className='space-y-3'>
                  {contacts.map((con) => (
                    <div key={con.id} className='p-4 rounded-sm bg-white/3 border border-white/8'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <h4 className='text-xs font-bold text-white'>{con.name}</h4>
                          <span className='text-[11px] text-indigo-400 font-mono'>{con.role || 'Contact'}</span>
                        </div>
                        {con.linkedinUrl && (
                          <a
                            href={con.linkedinUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-xs text-indigo-400 hover:underline flex items-center gap-1 font-mono'
                          >
                            <ExternalLink className='w-3 h-3' />
                            <span>LinkedIn</span>
                          </a>
                        )}
                      </div>
                      {con.email && <p className='text-xs text-zinc-400 font-mono mt-2'>{con.email}</p>}
                    </div>
                  ))}

                  {contacts.length === 0 && !showAddContact && (
                    <div className='text-center py-10 border border-dashed border-white/10 rounded-sm'>
                      <Users className='w-8 h-8 text-zinc-600 mx-auto mb-2' />
                      <p className='text-xs text-zinc-400 font-mono'>No hiring contacts linked to this application.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: TIMELINE */}
            {activeTab === 'timeline' && (
              <div className='space-y-4'>
                <h3 className='text-sm font-bold text-white'>Activity History & Notes</h3>

                {/* Manual Note Input */}
                <form onSubmit={handleAddManualNote} className='flex gap-2'>
                  <input
                    type='text'
                    placeholder='Add interview prep note or debrief reflection...'
                    value={manualNoteText}
                    onChange={(e) => setManualNoteText(e.target.value)}
                    className='flex-1 px-3.5 py-2 rounded-sm bg-white/4 border border-white/10 text-xs text-white placeholder:text-zinc-600 focus:outline-hidden focus:border-indigo-500 font-mono'
                  />
                  <button
                    type='submit'
                    className='px-4 py-2 rounded-sm bg-indigo-600 text-white text-xs font-mono font-bold hover:bg-indigo-500 transition-all shrink-0 cursor-pointer shadow-none'
                  >
                    Add Note
                  </button>
                </form>

                {/* Vertical Stepper Timeline */}
                <div className='relative pl-6 space-y-4 border-l border-white/10 font-mono'>
                  {notes.map((note) => (
                    <div key={note.id} className='relative'>
                      <span
                        className={`absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-[#0b0b13] ${
                          note.type === 'auto' ? 'bg-indigo-400' : 'bg-emerald-400'
                        }`}
                      />
                      <div>
                        <span className='text-[10px] text-zinc-500'>
                          {new Date(note.createdAt).toLocaleString()} •{' '}
                          {note.type === 'auto' ? 'System Log' : 'Candidate Note'}
                        </span>
                        <p className='text-xs text-zinc-300 mt-0.5 leading-relaxed font-sans'>{note.content}</p>
                      </div>
                    </div>
                  ))}

                  {notes.length === 0 && <p className='text-xs text-zinc-500 italic'>No activity entries yet.</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Document In-Browser Preview Modal */}
      <DocumentPreviewModal
        document={previewDoc}
        isOpen={Boolean(previewDoc)}
        onClose={() => setPreviewDoc(null)}
      />
    </div>
  );
};
