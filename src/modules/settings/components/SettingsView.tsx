'use client';

import React, { useState } from 'react';
import { Download, Upload, Trash2, Sliders, ShieldAlert, CheckCircle2, FileJson, RefreshCw } from 'lucide-react';
import type { Settings } from '@/modules/storage/types/schema';
import { getAllApplications, saveApplication } from '@/modules/storage/repositories/applications.repository';
import { getAllInterviews, saveInterview } from '@/modules/storage/repositories/interviews.repository';
import { getAllContacts, saveContact } from '@/modules/storage/repositories/contacts.repository';
import { getAllNotes, saveNote } from '@/modules/storage/repositories/notes.repository';
import { getSettings, saveSettings, clearAllData } from '@/modules/storage/repositories/settings.repository';
import { seedSampleDataIfEmpty } from '@/modules/storage/utils/seed';

interface SettingsViewProps {
  settings: Settings;
  onRefresh: () => Promise<void>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, onRefresh }) => {
  const [followUpThreshold, setFollowUpThreshold] = useState<number>(settings.followUpThresholdDays || 7);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [showWipeConfirm, setShowWipeConfirm] = useState(false);

  // Handle Full JSON Export
  const handleExportJSON = async () => {
    try {
      setIsExporting(true);
      const [apps, ints, cons, nts, currSettings] = await Promise.all([
        getAllApplications(),
        getAllInterviews(),
        getAllContacts(),
        getAllNotes(),
        getSettings(),
      ]);

      const backupPayload = {
        meta: {
          app: 'Jobloom',
          version: 1,
          exportedAt: new Date().toISOString(),
        },
        data: {
          applications: apps,
          interviews: ints,
          contacts: cons,
          notes: nts,
          settings: currSettings,
        },
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupPayload, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `jobloom_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      // Update lastBackupAt
      await saveSettings({
        ...currSettings,
        lastBackupAt: new Date().toISOString(),
      });
      await onRefresh();
    } catch (err) {
      console.error('Export failed', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Handle JSON Import
  const handleImportJSON = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    try {
      setIsImporting(true);
      setImportStatus('Reading backup file...');
      const text = await file.text();
      const parsed = JSON.parse(text);

      if (!parsed.data || !Array.isArray(parsed.data.applications)) {
        throw new Error('Invalid Jobloom backup JSON format.');
      }

      setImportStatus('Restoring records to IndexedDB...');

      // Restore applications
      for (const app of parsed.data.applications) {
        await saveApplication(app);
      }

      // Restore interviews
      if (Array.isArray(parsed.data.interviews)) {
        for (const int of parsed.data.interviews) {
          await saveInterview(int);
        }
      }

      // Restore contacts
      if (Array.isArray(parsed.data.contacts)) {
        for (const con of parsed.data.contacts) {
          await saveContact(con);
        }
      }

      // Restore notes
      if (Array.isArray(parsed.data.notes)) {
        for (const note of parsed.data.notes) {
          await saveNote(note);
        }
      }

      setImportStatus('Backup successfully restored!');
      await onRefresh();
      setTimeout(() => setImportStatus(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to import JSON.';
      setImportStatus(`Error: ${msg}`);
    } finally {
      setIsImporting(false);
    }
  };

  // Handle Settings Save
  const handleSaveThreshold = async (val: number) => {
    setFollowUpThreshold(val);
    await saveSettings({
      ...settings,
      followUpThresholdDays: val,
    });
    await onRefresh();
  };

  // Handle Wipe All Data
  const handleWipeData = async () => {
    await clearAllData();
    setShowWipeConfirm(false);
    await onRefresh();
  };

  // Handle Load Demo Seed Data
  const handleLoadDemoSeed = async () => {
    await clearAllData();
    await seedSampleDataIfEmpty();
    await onRefresh();
  };

  return (
    <div className='w-full space-y-6 text-left'>
      {/* Header */}
      <div className='p-4 rounded-sm bg-[#090912]/80 border border-white/8 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-sm bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400'>
            <Sliders className='w-5 h-5' />
          </div>
          <div>
            <h2 className='text-base font-bold text-white'>Preferences & Data Portability Vault</h2>
            <p className='text-xs text-zinc-400 font-mono'>Full ownership of your local browser storage</p>
          </div>
        </div>

        {settings.lastBackupAt && (
          <span className='text-xs font-mono text-zinc-400 bg-white/4 px-3 py-1 rounded-sm border border-white/8'>
            Last Backup: {new Date(settings.lastBackupAt).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* JSON Backup & Restore Section */}
      <div className='p-6 rounded-sm bg-[#090912]/80 border border-white/8 space-y-6'>
        <div>
          <h3 className='text-sm font-bold text-white flex items-center gap-2'>
            <FileJson className='w-4 h-4 text-cyan-400' />
            <span>1-Click JSON Data Portability</span>
          </h3>
          <p className='text-xs text-zinc-400 mt-1 leading-relaxed font-mono'>
            Jobloom keeps your entire job search strictly on your device. Export a complete JSON backup for safe
            storage, moving between laptops, or switching browsers.
          </p>
        </div>

        <div className='flex flex-wrap items-center gap-4'>
          <button
            type='button'
            onClick={handleExportJSON}
            disabled={isExporting}
            className='inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold shadow-none transition-all cursor-pointer'
          >
            <Download className='w-4 h-4' />
            <span>{isExporting ? 'Exporting...' : 'Export Full JSON Backup'}</span>
          </button>

          <label className='inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono font-bold transition-all cursor-pointer'>
            <Upload className='w-4 h-4 text-cyan-400' />
            <span>{isImporting ? 'Importing...' : 'Restore from JSON File'}</span>
            <input type='file' accept='.json' onChange={handleImportJSON} className='hidden' />
          </label>
        </div>

        {importStatus && (
          <div className='p-3.5 rounded-sm bg-indigo-950/40 border border-indigo-500/30 text-xs font-mono text-indigo-300 flex items-center gap-2'>
            <CheckCircle2 className='w-4 h-4 text-emerald-400 shrink-0' />
            <span>{importStatus}</span>
          </div>
        )}
      </div>

      {/* Follow-Up Heuristics Threshold */}
      <div className='p-6 rounded-sm bg-[#090912]/80 border border-white/8 space-y-4'>
        <div>
          <h3 className='text-sm font-bold text-white'>Follow-Up Inactivity Threshold</h3>
          <p className='text-xs text-zinc-400 mt-1 font-mono'>
            Configure after how many days of recruiter silence an application in &apos;Applied&apos; or &apos;OA&apos;
            stage should be flagged for follow-up or marked as Ghosted.
          </p>
        </div>

        <div className='flex items-center gap-4'>
          <input
            type='range'
            min='3'
            max='30'
            value={followUpThreshold}
            onChange={(e) => handleSaveThreshold(Number(e.target.value))}
            className='w-64 accent-indigo-500'
          />
          <span className='text-xs font-mono font-bold text-indigo-300 px-3 py-1 rounded-sm bg-indigo-500/10 border border-indigo-500/20'>
            {followUpThreshold} days
          </span>
        </div>
      </div>

      {/* Demo Seed Loader & Clean Slate */}
      <div className='p-6 rounded-sm bg-[#090912]/80 border border-white/8 space-y-4'>
        <div>
          <h3 className='text-sm font-bold text-white'>Development & Clean Slate Actions</h3>
          <p className='text-xs text-zinc-400 mt-1 font-mono'>
            Reset sample tech applications or wipe all client-side IndexedDB databases completely.
          </p>
        </div>

        <div className='flex flex-wrap items-center gap-3 pt-2'>
          <button
            type='button'
            onClick={handleLoadDemoSeed}
            className='inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm bg-white/4 hover:bg-white/8 border border-white/10 text-xs font-mono font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer'
          >
            <RefreshCw className='w-3.5 h-3.5 text-indigo-400' />
            <span>Load Sample Seed Data</span>
          </button>

          <button
            type='button'
            onClick={() => setShowWipeConfirm(true)}
            className='inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm bg-rose-950/30 hover:bg-rose-950/60 border border-rose-500/30 text-xs font-mono font-semibold text-rose-300 hover:text-rose-200 transition-all cursor-pointer'
          >
            <Trash2 className='w-3.5 h-3.5 text-rose-400' />
            <span>Wipe All Data (Clean Slate)</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showWipeConfirm && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md'>
          <div className='w-full max-w-md rounded-sm bg-[#0e0e18] border border-rose-500/30 p-6 shadow-none space-y-4'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-sm bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0'>
                <ShieldAlert className='w-5 h-5' />
              </div>
              <div>
                <h3 className='text-sm font-bold text-white font-mono'>Wipe All Local Data?</h3>
                <p className='text-xs text-zinc-400 font-mono'>This action cannot be undone.</p>
              </div>
            </div>

            <p className='text-xs text-zinc-300 leading-relaxed font-mono'>
              This will permanently delete all applications, interview loops, attached resume blobs, contacts, and
              timeline logs stored in your browser&apos;s IndexedDB.
            </p>

            <div className='flex justify-end gap-2 pt-3 border-t border-white/10 font-mono'>
              <button
                type='button'
                onClick={() => setShowWipeConfirm(false)}
                className='px-3.5 py-1.5 rounded-sm text-xs text-zinc-400 hover:text-white cursor-pointer'
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={handleWipeData}
                className='px-4 py-1.5 rounded-sm text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 cursor-pointer shadow-none'
              >
                Yes, Wipe Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
