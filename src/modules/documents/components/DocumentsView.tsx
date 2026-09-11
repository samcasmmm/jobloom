'use client';

import React, { useState } from 'react';
import {
  FileText,
  Download,
  Trash2,
  Upload,
  Eye,
  ExternalLink,
} from 'lucide-react';
import type { Application, DocumentFile } from '@/modules/storage/types/schema';
import {
  saveDocument,
  deleteDocument,
} from '@/modules/storage/repositories/documents.repository';
import { SelectDropdown } from '@/components/ui';
import { DocumentPreviewModal } from './DocumentPreviewModal';

interface DocumentsViewProps {
  applications: Application[];
  documents: DocumentFile[];
  onSelectApplication: (app: Application) => void;
  onRefresh: () => Promise<void>;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  applications,
  documents,
  onSelectApplication,
  onRefresh,
}) => {
  const [selectedAppId, setSelectedAppId] = useState<string>(
    applications[0]?.id || ''
  );
  const [previewDoc, setPreviewDoc] = useState<DocumentFile | null>(null);

  const totalBytes = documents.reduce((acc, doc) => acc + (doc.blob?.size || 0), 0);
  const totalKB = (totalBytes / 1024).toFixed(1);

  const appMap = new Map(applications.map((a) => [a.id, a]));

  const handleDownload = (doc: DocumentFile) => {
    const url = URL.createObjectURL(doc.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (id: string) => {
    await deleteDocument(id);
    await onRefresh();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !selectedAppId) return;
    const file = e.target.files[0];

    const doc: DocumentFile = {
      id: crypto.randomUUID(),
      applicationId: selectedAppId,
      type: file.name.toLowerCase().includes('cover') ? 'CoverLetter' : 'Resume',
      label: file.name.replace(/\.[^/.]+$/, ''),
      blob: file,
      fileName: file.name,
      mimeType: file.type || 'application/octet-stream',
      uploadedAt: new Date().toISOString(),
    };

    await saveDocument(doc);
    await onRefresh();
  };

  return (
    <div className='w-full space-y-6 text-left'>
      {/* Top Header */}
      <div className='flex flex-wrap items-center justify-between gap-4 p-4 rounded-sm bg-[#090912]/80 border border-white/8'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-sm bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400'>
            <FileText className='w-5 h-5' />
          </div>
          <div>
            <h2 className='text-base font-bold text-white'>Resume & Document Vault</h2>
            <p className='text-xs text-zinc-400 font-mono'>
              {documents.length} document{documents.length === 1 ? '' : 's'} • {totalKB} KB indexed locally in browser
            </p>
          </div>
        </div>

        {/* Upload Action */}
        {applications.length > 0 && (
          <div className='flex items-center gap-2'>
            <SelectDropdown
              value={selectedAppId}
              onChange={setSelectedAppId}
              options={applications.map((a) => ({
                value: a.id,
                label: `${a.company} (${a.role})`,
              }))}
              size='sm'
            />

            <label className='h-8 px-3.5 inline-flex items-center gap-1.5 rounded-sm bg-indigo-600 text-white text-xs font-mono font-bold hover:bg-indigo-500 transition-all cursor-pointer shadow-none'>
              <Upload className='w-3.5 h-3.5' />
              <span>Upload Document</span>
              <input type='file' onChange={handleUpload} className='hidden' />
            </label>
          </div>
        )}
      </div>

      {/* Documents Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {documents.map((doc) => {
          const app = appMap.get(doc.applicationId);

          return (
            <div
              key={doc.id}
              className='p-5 rounded-sm bg-[#090912]/80 border border-white/8 hover:border-cyan-500/40 transition-all flex flex-col justify-between shadow-none group'
            >
              <div>
                <div className='flex items-start justify-between gap-3'>
                  <div
                    onClick={() => setPreviewDoc(doc)}
                    className='w-10 h-10 rounded-sm bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 cursor-pointer group-hover:bg-cyan-500/20 transition-colors'
                    title='Click to preview'
                  >
                    <FileText className='w-5 h-5' />
                  </div>
                  <span className='text-[10px] font-mono px-2 py-0.5 rounded-sm bg-white/4 text-zinc-400 border border-white/5'>
                    {doc.type}
                  </span>
                </div>

                <div className='mt-3'>
                  <h3
                    onClick={() => setPreviewDoc(doc)}
                    className='text-sm font-bold text-white truncate cursor-pointer hover:text-cyan-400 transition-colors'
                    title='Click to preview'
                  >
                    {doc.fileName}
                  </h3>
                  {app && (
                    <span
                      onClick={() => onSelectApplication(app)}
                      className='text-xs text-indigo-400 hover:underline cursor-pointer block mt-1 font-semibold'
                    >
                      {app.company} — {app.role}
                    </span>
                  )}
                </div>

                <div className='mt-3 text-xs text-zinc-400 font-mono space-y-1'>
                  <div>Size: {(doc.blob.size / 1024).toFixed(1)} KB</div>
                  <div>Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</div>
                </div>
              </div>

              <div className='mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono'>
                <div className='flex items-center gap-3'>
                  <button
                    type='button'
                    onClick={() => setPreviewDoc(doc)}
                    className='inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-bold cursor-pointer transition-colors'
                    title='Preview Document'
                  >
                    <Eye className='w-3.5 h-3.5' />
                    <span>View</span>
                  </button>

                  <button
                    type='button'
                    onClick={() => handleDownload(doc)}
                    className='inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-bold cursor-pointer transition-colors'
                    title='Download Document'
                  >
                    <Download className='w-3.5 h-3.5' />
                    <span>Download</span>
                  </button>
                </div>

                <button
                  type='button'
                  onClick={() => handleDelete(doc.id)}
                  className='p-1.5 rounded-sm text-zinc-500 hover:text-rose-400 cursor-pointer transition-colors'
                  title='Delete Document'
                >
                  <Trash2 className='w-3.5 h-3.5' />
                </button>
              </div>
            </div>
          );
        })}

        {documents.length === 0 && (
          <div className='col-span-full py-16 text-center border border-dashed border-white/10 rounded-sm'>
            <FileText className='w-10 h-10 text-zinc-600 mx-auto mb-2' />
            <h3 className='text-sm font-bold text-white'>No documents stored</h3>
            <p className='text-xs text-zinc-400 mt-1 font-mono'>
              Upload tailored resume versions or cover letters directly to IndexedDB.
            </p>
          </div>
        )}
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
