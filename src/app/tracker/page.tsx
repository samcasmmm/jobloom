'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Kanban,
  Table as TableIcon,
  LayoutDashboard,
  Layers,
  FileText,
  Users,
  Clock,
  Settings as SettingsIcon,
  Plus,
  Search,
  ArrowLeft,
} from 'lucide-react';
import type { Application, InterviewRound, DocumentFile, Contact, Settings } from '@/modules/storage/types/schema';
import {
  getAllApplications,
  deleteApplication,
  bulkDeleteApplications,
  bulkUpdateStatus,
} from '@/modules/storage/repositories/applications.repository';
import { getAllInterviews } from '@/modules/storage/repositories/interviews.repository';
import { getAllDocuments } from '@/modules/storage/repositories/documents.repository';
import { getAllContacts } from '@/modules/storage/repositories/contacts.repository';
import { getSettings, DEFAULT_SETTINGS } from '@/modules/storage/repositories/settings.repository';
import { seedSampleDataIfEmpty } from '@/modules/storage/utils/seed';
import { createApplication, updateApplication } from '@/modules/applications/services/applications.service';
import type { ApplicationFormData } from '@/modules/applications/validations/application.schema';
import { STATUS_CONFIG, STATUS_ORDER } from '@/lib/status-colors';
import { SourceDropdown, SelectDropdown, DEFAULT_SOURCES } from '@/components/ui';

// Child Module Components
import { ApplicationKanban } from '@/modules/applications/components/ApplicationKanban';
import { ApplicationTable } from '@/modules/applications/components/ApplicationTable';
import { ApplicationModal } from '@/modules/applications/components/ApplicationModal';
import { ApplicationDrawer } from '@/modules/applications/components/ApplicationDrawer';
import { DashboardView } from '@/modules/dashboard/components/DashboardView';
import { InterviewsView } from '@/modules/interviews/components/InterviewsView';
import { DocumentsView } from '@/modules/documents/components/DocumentsView';
import { ContactsView } from '@/modules/contacts/components/ContactsView';
import { RemindersView } from '@/modules/reminders/components/RemindersView';
import { SettingsView } from '@/modules/settings/components/SettingsView';
import { AdBanner } from '@/components/ads/AdBanner';

type TabType = 'applications' | 'dashboard' | 'interviews' | 'documents' | 'contacts' | 'reminders' | 'settings';

export default function TrackerPage() {
  const [activeTab, setActiveTab] = useState<TabType>('applications');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('table');

  // IndexedDB State
  const [applications, setApplications] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<InterviewRound[]>([]);
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [availableSources, setAvailableSources] = useState<string[]>(DEFAULT_SOURCES);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedSourceFilter, setSelectedSourceFilter] = useState<string>('all');

  // Modals & Drawers
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [selectedDrawerApp, setSelectedDrawerApp] = useState<Application | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Load IndexedDB Records
  const refreshAllData = useCallback(async () => {
    try {
      await seedSampleDataIfEmpty();
      const [apps, ints, docs, cons, sets] = await Promise.all([
        getAllApplications(),
        getAllInterviews(),
        getAllDocuments(),
        getAllContacts(),
        getSettings(),
      ]);

      setApplications(apps);
      setInterviews(ints);
      setDocuments(docs);
      setContacts(cons);
      setSettings(sets);

      setSelectedDrawerApp((prev) => {
        if (!prev) return null;
        return apps.find((a) => a.id === prev.id) || null;
      });
    } catch (err) {
      console.error('Failed to load IndexedDB data', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Handler: Create / Update Application
  const handleSaveApplication = async (formData: ApplicationFormData) => {
    if (editingApp) {
      await updateApplication(editingApp.id, formData);
    } else {
      await createApplication(formData);
    }
    setEditingApp(null);
    await refreshAllData();
  };

  // Handler: Update Status Inline / Kanban Drag
  const handleUpdateStatus = async (id: string, newStatus: Application['status']) => {
    const existing = applications.find((a) => a.id === id);
    if (existing) {
      await updateApplication(id, { ...existing, status: newStatus });
      await refreshAllData();
    }
  };

  // Handler: Delete Application
  const handleDeleteApplication = async (id: string) => {
    await deleteApplication(id);
    if (selectedDrawerApp?.id === id) {
      setIsDrawerOpen(false);
      setSelectedDrawerApp(null);
    }
    await refreshAllData();
  };

  // Handler: Bulk Delete
  const handleBulkDelete = async (ids: string[]) => {
    await bulkDeleteApplications(ids);
    await refreshAllData();
  };

  // Handler: Bulk Update Status
  const handleBulkUpdateStatus = async (ids: string[], status: Application['status']) => {
    await bulkUpdateStatus(ids, status);
    await refreshAllData();
  };

  // Open Drawer for an Application
  const handleOpenDrawer = (app: Application) => {
    setSelectedDrawerApp(app);
    setIsDrawerOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (app: Application) => {
    setEditingApp(app);
    setIsModalOpen(true);
  };

  // Filtered Applications for Applications Tab
  const filteredApplications = applications.filter((app) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchComp = app.company.toLowerCase().includes(q);
      const matchRole = app.role.toLowerCase().includes(q);
      const matchLoc = app.location?.toLowerCase().includes(q);
      if (!matchComp && !matchRole && !matchLoc) return false;
    }
    if (selectedStatusFilter !== 'all' && app.status !== selectedStatusFilter) {
      return false;
    }
    if (selectedSourceFilter !== 'all' && app.source !== selectedSourceFilter) {
      return false;
    }
    return true;
  });

  const activePipelineCount = applications.filter(
    (a) => a.status === 'Applied' || a.status === 'OA' || a.status === 'Interview',
  ).length;

  return (
    <div className='min-h-screen w-full bg-[#07070b] text-white flex flex-col'>
      {/* Top Header Navbar */}
      <header className='sticky top-0 z-30 w-full border-b border-white/10 bg-[#07070b]/90 backdrop-blur-md'>
        <div className='w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between'>
          {/* Brand Logo & Back to Marketing */}
          <div className='flex items-center gap-6'>
            <Link
              href='/'
              className='flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors'
            >
              <ArrowLeft className='w-4 h-4' />
              <span className='hidden sm:inline'>Landing</span>
            </Link>

            {/* Brand Logo */}
            <Link href='/' className='flex items-center gap-3 group'>
              <div className='flex flex-col'>
                <div className='flex items-center gap-1.5'>
                  <span className='text-xl font-bold tracking-tight'>
                    <span className='text-white'>Job</span>
                    <span className='bg-clip-text text-transparent bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400'>
                      loom
                    </span>
                  </span>
                  <span className='text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-white/10 border border-white/15 text-zinc-300'>
                    v1.0
                  </span>
                </div>
                <span className='text-[10px] font-medium tracking-wider text-zinc-400 uppercase -mt-0.5'>
                  Local-First Workspace
                </span>
              </div>
            </Link>
          </div>

          {/* Quick Storage Status Indicator */}
          <div className='flex items-center gap-3'>
            <div className='hidden md:flex items-center gap-2 px-3 py-1 rounded-sm bg-white/4 border border-white/8 text-[11px] font-mono text-zinc-400'>
              <span className='w-2 h-2 rounded-full bg-emerald-400 animate-pulse' />
              <span>IndexedDB: 0ms Latency</span>
            </div>

            <button
              type='button'
              onClick={() => {
                setEditingApp(null);
                setIsModalOpen(true);
              }}
              className='inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold transition-all cursor-pointer active:scale-95 shadow-none'
            >
              <Plus className='w-4 h-4' />
              <span>New Application</span>
            </button>
          </div>
        </div>

        {/* Workspace Module Navigation Tabs */}
        <div className='w-full px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto text-xs border-t border-white/5 py-1.5 hide-scrollbar'>
          {[
            { id: 'applications' as const, label: 'Applications', icon: Kanban, count: applications.length },
            { id: 'dashboard' as const, label: 'Analytics', icon: LayoutDashboard },
            { id: 'interviews' as const, label: 'Interviews', icon: Layers, count: interviews.length },
            { id: 'documents' as const, label: 'Documents', icon: FileText, count: documents.length },
            { id: 'contacts' as const, label: 'Contacts', icon: Users, count: contacts.length },
            { id: 'reminders' as const, label: 'Follow-ups', icon: Clock },
            { id: 'settings' as const, label: 'Settings & Vault', icon: SettingsIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type='button'
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-sm flex items-center gap-2 shrink-0 font-mono text-xs font-semibold border transition-colors duration-100 cursor-pointer select-none ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/4 border-transparent'
                }`}
              >
                <Icon className='w-3.5 h-3.5 shrink-0' />
                <span>
                  {tab.label}
                  {tab.count !== undefined ? ` (${tab.count})` : ''}
                </span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className='flex-1 w-full px-4 sm:px-6 lg:px-8 py-6'>
        <div key={activeTab} className='w-full animate-in fade-in duration-100'>
          {/* TAB 1: APPLICATIONS PIPELINE (KANBAN & TABLE) */}
          {activeTab === 'applications' && (
            <div className='space-y-4'>
              {/* Sponsored Google Ad Banner (Only in Applications Tab) */}

              {/* Search & Filter Toolbar */}
              <div className='flex flex-wrap items-center justify-between gap-3 p-3 rounded-sm bg-[#090912]/80 border border-white/8'>
                {/* Search input */}
                <div className='relative flex-1 min-w-50 max-w-md'>
                  <Search className='w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2' />
                  <input
                    type='text'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder='Search by company, role title, location...'
                    className='w-full h-8 pl-9 pr-4 rounded-sm bg-white/4 border border-white/10 text-xs text-white placeholder:text-zinc-600 focus:outline-hidden focus:border-indigo-500 font-mono'
                  />
                </div>

                {/* Status Filter, Source Filter & View Switcher */}
                <div className='flex items-center gap-2 text-xs flex-wrap'>
                  <SelectDropdown
                    value={selectedStatusFilter}
                    onChange={setSelectedStatusFilter}
                    options={[
                      { value: 'all', label: 'All Status Stages' },
                      ...STATUS_ORDER.map((st) => ({
                        value: st,
                        label: STATUS_CONFIG[st]?.label || st,
                        icon: (
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${STATUS_CONFIG[st]?.dot || 'bg-zinc-400'}`}
                          />
                        ),
                      })),
                    ]}
                    size='sm'
                  />

                  <SourceDropdown
                    value={selectedSourceFilter}
                    onChange={setSelectedSourceFilter}
                    sources={availableSources}
                    onAddSource={(newSrc) => {
                      if (!availableSources.includes(newSrc)) {
                        setAvailableSources((prev) => [...prev, newSrc]);
                      }
                    }}
                    showAllOption={true}
                    size='sm'
                  />

                  {/* View Switcher (Kanban / Table) */}
                  <div className='h-8 p-0.5 flex items-center bg-white/4 rounded-sm border border-white/10'>
                    <button
                      type='button'
                      onClick={() => setViewMode('kanban')}
                      className={`h-full px-2 rounded-xs flex items-center justify-center transition-colors duration-100 cursor-pointer ${
                        viewMode === 'kanban'
                          ? 'bg-indigo-600 text-white shadow-none'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                      title='Kanban Pipeline Board'
                    >
                      <Kanban className='w-4 h-4' />
                    </button>
                    <button
                      type='button'
                      onClick={() => setViewMode('table')}
                      className={`h-full px-2 rounded-xs flex items-center justify-center transition-colors duration-100 cursor-pointer ${
                        viewMode === 'table' ? 'bg-indigo-600 text-white shadow-none' : 'text-zinc-400 hover:text-white'
                      }`}
                      title='Spreadsheet Matrix View'
                    >
                      <TableIcon className='w-4 h-4' />
                    </button>
                  </div>
                </div>
              </div>
              <AdBanner />

              {/* View Render */}
              {viewMode === 'kanban' ? (
                <ApplicationKanban
                  applications={filteredApplications}
                  onSelectApplication={handleOpenDrawer}
                  onUpdateStatus={handleUpdateStatus}
                  onAddNewToStage={(st) => {
                    setEditingApp(null);
                    setIsModalOpen(true);
                  }}
                />
              ) : (
                <ApplicationTable
                  applications={filteredApplications}
                  onSelectApplication={handleOpenDrawer}
                  onUpdateStatus={handleUpdateStatus}
                  onDeleteApplication={handleDeleteApplication}
                  onBulkDelete={handleBulkDelete}
                  onBulkUpdateStatus={handleBulkUpdateStatus}
                />
              )}
            </div>
          )}

          {/* TAB 2: ANALYTICS DASHBOARD */}
          {activeTab === 'dashboard' && (
            <DashboardView
              applications={applications}
              interviews={interviews}
              onSelectApplication={handleOpenDrawer}
              onNavigateToTab={(t) => setActiveTab(t as TabType)}
            />
          )}

          {/* TAB 3: INTERVIEWS LOOP HUB */}
          {activeTab === 'interviews' && (
            <InterviewsView
              applications={applications}
              interviews={interviews}
              onSelectApplication={handleOpenDrawer}
              onRefresh={refreshAllData}
            />
          )}

          {/* TAB 4: DOCUMENTS VAULT */}
          {activeTab === 'documents' && (
            <DocumentsView
              applications={applications}
              documents={documents}
              onSelectApplication={handleOpenDrawer}
              onRefresh={refreshAllData}
            />
          )}

          {/* TAB 5: CONTACTS DIRECTORY */}
          {activeTab === 'contacts' && (
            <ContactsView
              applications={applications}
              contacts={contacts}
              onSelectApplication={handleOpenDrawer}
              onRefresh={refreshAllData}
            />
          )}

          {/* TAB 6: FOLLOW-UPS INTELLIGENCE */}
          {activeTab === 'reminders' && (
            <RemindersView
              applications={applications}
              onSelectApplication={handleOpenDrawer}
              onUpdateStatus={handleUpdateStatus}
              thresholdDays={settings.followUpThresholdDays || 7}
            />
          )}

          {/* TAB 7: SETTINGS & JSON DATA PORTABILITY */}
          {activeTab === 'settings' && <SettingsView settings={settings} onRefresh={refreshAllData} />}
        </div>
      </main>

      {/* Create / Edit Application Modal */}
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingApp(null);
        }}
        onSubmit={handleSaveApplication}
        initialData={editingApp}
      />

      {/* Deep-Dive Application Drawer */}
      <ApplicationDrawer
        application={selectedDrawerApp}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedDrawerApp(null);
        }}
        onUpdateStatus={handleUpdateStatus}
        onEdit={(app) => {
          setIsDrawerOpen(false);
          handleOpenEdit(app);
        }}
        onDelete={handleDeleteApplication}
      />
    </div>
  );
}
