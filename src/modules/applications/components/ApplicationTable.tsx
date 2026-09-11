'use client';

import React, { useState } from 'react';
import {
  ArrowUpDown,
  ExternalLink,
  MapPin,
  DollarSign,
  Calendar,
  MoreHorizontal,
  Trash2,
  Eye,
  CheckSquare,
  Square,
} from 'lucide-react';
import type { Application } from '@/modules/storage/types/schema';
import { STATUS_CONFIG, STATUS_ORDER } from '@/lib/status-colors';
import { StatusDropdown, ColumnsDropdown, SelectDropdown, DEFAULT_TABLE_COLUMNS, type ColumnConfig } from '@/components/ui';

interface ApplicationTableProps {
  applications: Application[];
  onSelectApplication: (app: Application) => void;
  onUpdateStatus: (id: string, newStatus: Application['status']) => Promise<void>;
  onDeleteApplication: (id: string) => Promise<void>;
  onBulkDelete: (ids: string[]) => Promise<void>;
  onBulkUpdateStatus: (ids: string[], status: Application['status']) => Promise<void>;
}

type SortField = 'company' | 'role' | 'status' | 'source' | 'appliedDate' | 'salaryMin';

export const ApplicationTable: React.FC<ApplicationTableProps> = ({
  applications,
  onSelectApplication,
  onUpdateStatus,
  onDeleteApplication,
  onBulkDelete,
  onBulkUpdateStatus,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>('appliedDate');
  const [sortAsc, setSortAsc] = useState(false);
  const [columns, setColumns] = useState<ColumnConfig[]>(DEFAULT_TABLE_COLUMNS);

  const isColVisible = (key: string) => {
    return columns.find((c) => c.key === key)?.visible ?? true;
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === applications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(applications.map((a) => a.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedApps = [...applications].sort((a, b) => {
    let valA = a[sortField] || '';
    let valB = b[sortField] || '';

    if (sortField === 'salaryMin') {
      valA = a.salaryMin || 0;
      valB = b.salaryMin || 0;
    }

    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const visibleColumnCount = columns.filter((c) => c.visible).length + 1; // +1 for checkbox column

  return (
    <div className='w-full space-y-3 text-left font-mono'>
      {/* Table Toolbar Bar: Bulk Actions & Columns Toggle Dropdown */}
      <div className='flex items-center justify-between gap-3 min-h-8'>
        {selectedIds.length > 0 ? (
          <div className='flex items-center gap-2.5 text-xs animate-in fade-in duration-150'>
            <span className='font-bold text-indigo-300 font-mono px-2 py-1 rounded-sm bg-indigo-500/15 border border-indigo-500/30'>
              {selectedIds.length} application{selectedIds.length > 1 ? 's' : ''} selected
            </span>
            <div className='flex items-center gap-1.5'>
              <SelectDropdown
                value=''
                onChange={(val) => {
                  if (val) {
                    onBulkUpdateStatus(selectedIds, val as Application['status']);
                    setSelectedIds([]);
                  }
                }}
                options={[
                  ...STATUS_ORDER.map((st) => ({
                    value: st,
                    label: `Move to ${STATUS_CONFIG[st]?.label || st}`,
                  })),
                ]}
                placeholder='Status...'
                size='sm'
              />
              <button
                type='button'
                onClick={() => {
                  onBulkDelete(selectedIds);
                  setSelectedIds([]);
                }}
                className='h-7 px-2.5 rounded-sm bg-rose-600/20 text-rose-300 border border-rose-500/30 font-bold hover:bg-rose-600 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1 shadow-none'
              >
                <Trash2 className='w-3.5 h-3.5' />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ) : (
          <div className='flex items-center gap-2 text-xs text-zinc-400 font-mono'>
            <span>{applications.length} applications tracked</span>
          </div>
        )}

        {/* Columns Dropdown */}
        <div className='ml-auto'>
          <ColumnsDropdown columns={columns} onChange={setColumns} />
        </div>
      </div>

      {/* Spreadsheet Table Container */}
      <div className='w-full rounded-sm bg-[#090912]/80 border border-white/8 overflow-hidden shadow-none'>
        <div className='overflow-x-auto custom-scrollbar'>
          <table className='w-full text-xs text-left text-zinc-300 border-collapse'>
            {/* Table Head */}
            <thead className='bg-white/3 border-b border-white/8 text-[11px] font-mono text-zinc-400 uppercase'>
              <tr>
                <th className='p-3.5 w-10 text-center'>
                  <button type='button' onClick={toggleSelectAll} className='text-zinc-400 hover:text-white cursor-pointer'>
                    {selectedIds.length === applications.length && applications.length > 0 ? (
                      <CheckSquare className='w-4 h-4 text-indigo-400 mx-auto' />
                    ) : (
                      <Square className='w-4 h-4 mx-auto' />
                    )}
                  </button>
                </th>

                {isColVisible('company') && (
                  <th
                    className='p-3.5 text-center cursor-pointer hover:text-white transition-colors select-none'
                    onClick={() => handleSort('company')}
                  >
                    <div className='flex items-center justify-center gap-1'>
                      <span>Company</span>
                      <ArrowUpDown className='w-3 h-3' />
                    </div>
                  </th>
                )}

                {isColVisible('role') && (
                  <th
                    className='p-3.5 text-center cursor-pointer hover:text-white transition-colors select-none'
                    onClick={() => handleSort('role')}
                  >
                    <div className='flex items-center justify-center gap-1'>
                      <span>Role Title</span>
                      <ArrowUpDown className='w-3 h-3' />
                    </div>
                  </th>
                )}

                {isColVisible('status') && (
                  <th
                    className='p-3.5 text-center cursor-pointer hover:text-white transition-colors select-none'
                    onClick={() => handleSort('status')}
                  >
                    <div className='flex items-center justify-center gap-1'>
                      <span>Status</span>
                      <ArrowUpDown className='w-3 h-3' />
                    </div>
                  </th>
                )}

                {isColVisible('salary') && (
                  <th
                    className='p-3.5 text-center cursor-pointer hover:text-white transition-colors select-none'
                    onClick={() => handleSort('salaryMin')}
                  >
                    <div className='flex items-center justify-center gap-1'>
                      <span>Salary Band</span>
                      <ArrowUpDown className='w-3 h-3' />
                    </div>
                  </th>
                )}

                {isColVisible('source') && (
                  <th
                    className='p-3.5 text-center cursor-pointer hover:text-white transition-colors select-none'
                    onClick={() => handleSort('source')}
                  >
                    <div className='flex items-center justify-center gap-1'>
                      <span>Source</span>
                      <ArrowUpDown className='w-3 h-3' />
                    </div>
                  </th>
                )}

                {isColVisible('appliedDate') && (
                  <th
                    className='p-3.5 text-center cursor-pointer hover:text-white transition-colors select-none'
                    onClick={() => handleSort('appliedDate')}
                  >
                    <div className='flex items-center justify-center gap-1'>
                      <span>Applied Date</span>
                      <ArrowUpDown className='w-3 h-3' />
                    </div>
                  </th>
                )}

                {isColVisible('actions') && <th className='p-3.5 text-center'>Actions</th>}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className='divide-y divide-white/5'>
              {sortedApps.map((app) => {
                const isSelected = selectedIds.includes(app.id);

                return (
                  <tr
                    key={app.id}
                    className={`hover:bg-white/4 transition-colors cursor-pointer ${
                      isSelected ? 'bg-indigo-950/25' : ''
                    }`}
                    onClick={() => onSelectApplication(app)}
                  >
                    <td className='p-3.5 text-center' onClick={(e) => e.stopPropagation()}>
                      <button
                        type='button'
                        onClick={() => toggleSelectOne(app.id)}
                        className='text-zinc-400 hover:text-white cursor-pointer'
                      >
                        {isSelected ? (
                          <CheckSquare className='w-4 h-4 text-indigo-400 mx-auto' />
                        ) : (
                          <Square className='w-4 h-4 mx-auto' />
                        )}
                      </button>
                    </td>

                    {isColVisible('company') && (
                      <td className='p-3.5 font-bold text-white whitespace-nowrap text-center'>
                        <div className='flex items-center justify-center gap-2'>
                          <span>{app.company}</span>
                          {app.jobLink && (
                            <a
                              href={app.jobLink}
                              target='_blank'
                              rel='noopener noreferrer'
                              onClick={(e) => e.stopPropagation()}
                              className='text-zinc-500 hover:text-indigo-400'
                            >
                              <ExternalLink className='w-3 h-3' />
                            </a>
                          )}
                        </div>
                      </td>
                    )}

                    {isColVisible('role') && (
                      <td className='p-3.5 font-medium text-zinc-200 text-center font-sans'>
                        <div>
                          <span>{app.role}</span>
                          {app.location && (
                            <span className='block text-[10px] text-zinc-500 font-mono'>{app.location}</span>
                          )}
                        </div>
                      </td>
                    )}

                    {isColVisible('status') && (
                      <td className='p-3.5 text-center' onClick={(e) => e.stopPropagation()}>
                        <div className='flex justify-center'>
                          <StatusDropdown
                            value={app.status}
                            onChange={(newStatus) => onUpdateStatus(app.id, newStatus)}
                            size='sm'
                            align='center'
                            centeredText={true}
                          />
                        </div>
                      </td>
                    )}

                    {isColVisible('salary') && (
                      <td className='p-3.5 font-mono text-zinc-300 text-center'>
                        {app.salaryMin || app.salaryMax ? (
                          <span>
                            ${((app.salaryMin || 0) / 1000).toFixed(0)}k - ${((app.salaryMax || 0) / 1000).toFixed(0)}k
                          </span>
                        ) : (
                          <span className='text-zinc-600'>—</span>
                        )}
                      </td>
                    )}

                    {isColVisible('source') && (
                      <td className='p-3.5 font-mono text-zinc-400 text-center'>{app.source}</td>
                    )}

                    {isColVisible('appliedDate') && (
                      <td className='p-3.5 font-mono text-zinc-400 text-center'>{app.appliedDate}</td>
                    )}

                    {isColVisible('actions') && (
                      <td className='p-3.5 text-center' onClick={(e) => e.stopPropagation()}>
                        <div className='flex items-center justify-center gap-1.5'>
                          <button
                            type='button'
                            onClick={() => onSelectApplication(app)}
                            className='p-1.5 rounded-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer'
                            title='View details'
                          >
                            <Eye className='w-3.5 h-3.5' />
                          </button>
                          <button
                            type='button'
                            onClick={() => onDeleteApplication(app.id)}
                            className='p-1.5 rounded-sm text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer'
                            title='Delete application'
                          >
                            <Trash2 className='w-3.5 h-3.5' />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}

              {sortedApps.length === 0 && (
                <tr>
                  <td colSpan={visibleColumnCount} className='p-12 text-center text-zinc-500 font-mono'>
                    No job applications found. Click &quot;+ New Application&quot; to begin.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
