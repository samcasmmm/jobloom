'use client';

import React, { useState, useEffect } from 'react';
import { X, Download, ExternalLink, FileText } from 'lucide-react';
import type { DocumentFile } from '@/modules/storage/types/schema';
import { formatDateTime } from '@/lib/date';

interface DocumentPreviewModalProps {
  document: DocumentFile | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document: doc,
  isOpen,
  onClose,
}) => {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !doc || !doc.blob) {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        setObjectUrl(null);
      }
      return;
    }

    const url = URL.createObjectURL(doc.blob);
    setObjectUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [isOpen, doc]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !doc || !objectUrl) return null;

  const mime = doc.mimeType?.toLowerCase() || '';
  const fileName = doc.fileName?.toLowerCase() || '';
  const isPdf = mime.includes('pdf') || fileName.endsWith('.pdf');
  const isImage =
    mime.startsWith('image/') ||
    fileName.endsWith('.png') ||
    fileName.endsWith('.jpg') ||
    fileName.endsWith('.jpeg') ||
    fileName.endsWith('.webp') ||
    fileName.endsWith('.svg');

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = doc.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleOpenNewTab = () => {
    window.open(objectUrl, '_blank');
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6'>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200'
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className='relative w-full max-w-5xl h-[85vh] rounded-sm bg-[#090912] border border-white/10 shadow-2xl flex flex-col z-10 overflow-hidden font-mono'>
        {/* Header */}
        <div className='flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#0e0e1a] shrink-0'>
          <div className='flex items-center gap-3 min-w-0'>
            <div className='w-8 h-8 rounded-sm bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0'>
              <FileText className='w-4 h-4' />
            </div>
            <div className='min-w-0'>
              <h3 className='text-xs font-bold text-white truncate max-w-md'>{doc.fileName}</h3>
              <p className='text-[10px] text-zinc-400'>
                {doc.type} • {(doc.blob.size / 1024).toFixed(1)} KB • Uploaded {formatDateTime(doc.uploadedAt)}
              </p>
            </div>
          </div>

          <div className='flex items-center gap-2 shrink-0'>
            <button
              type='button'
              onClick={handleOpenNewTab}
              className='h-8 px-3 rounded-sm bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs border border-white/10 inline-flex items-center gap-1.5 transition-colors cursor-pointer'
              title='Open in new tab'
            >
              <ExternalLink className='w-3.5 h-3.5 text-indigo-400' />
              <span className='hidden sm:inline'>Open Tab</span>
            </button>

            <button
              type='button'
              onClick={handleDownload}
              className='h-8 px-3 rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-none'
              title='Download file'
            >
              <Download className='w-3.5 h-3.5' />
              <span className='hidden sm:inline'>Download</span>
            </button>

            <button
              type='button'
              onClick={onClose}
              className='p-1.5 rounded-sm text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer ml-1'
              title='Close Preview'
            >
              <X className='w-5 h-5' />
            </button>
          </div>
        </div>

        {/* Viewer Body */}
        <div className='flex-1 p-3 bg-[#06060c] overflow-auto flex items-center justify-center'>
          {isPdf ? (
            <iframe
              src={objectUrl}
              className='w-full h-full rounded-sm border border-white/5 bg-white'
              title={doc.fileName}
            />
          ) : isImage ? (
            <div className='w-full h-full flex items-center justify-center p-4'>
              <img
                src={objectUrl}
                alt={doc.fileName}
                className='max-h-full max-w-full object-contain rounded-sm shadow-lg border border-white/10'
              />
            </div>
          ) : (
            <div className='w-full h-full flex flex-col items-center justify-center p-8 text-center space-y-4'>
              <iframe
                src={objectUrl}
                className='w-full h-full rounded-sm border border-white/5 bg-[#0a0a14] text-zinc-200'
                title={doc.fileName}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
