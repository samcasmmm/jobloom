'use client';

import React, { useRef, useEffect, useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd';
import {
  Plus,
  MapPin,
  DollarSign,
  GripVertical,
} from 'lucide-react';
import type { Application } from '@/modules/storage/types/schema';
import { STATUS_CONFIG, STATUS_ORDER } from '@/lib/status-colors';
import { cn } from '@/lib/utils';

interface ApplicationKanbanProps {
  applications: Application[];
  onSelectApplication: (app: Application) => void;
  onUpdateStatus: (id: string, newStatus: Application['status']) => Promise<void>;
  onAddNewToStage?: (status: Application['status']) => void;
}

export const ApplicationKanban: React.FC<ApplicationKanbanProps> = ({
  applications,
  onSelectApplication,
  onUpdateStatus,
  onAddNewToStage,
}) => {
  const [mounted, setMounted] = useState(false);
  const topScrollRef = useRef<HTMLDivElement>(null);
  const mainScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Synchronize top and main horizontal scrollbars
  useEffect(() => {
    const topEl = topScrollRef.current;
    const mainEl = mainScrollRef.current;
    if (!topEl || !mainEl) return;

    let isSyncingTop = false;
    let isSyncingMain = false;

    const handleTopScroll = () => {
      if (!isSyncingTop) {
        isSyncingMain = true;
        mainEl.scrollLeft = topEl.scrollLeft;
      }
      isSyncingTop = false;
    };

    const handleMainScroll = () => {
      if (!isSyncingMain) {
        isSyncingTop = true;
        topEl.scrollLeft = mainEl.scrollLeft;
      }
      isSyncingMain = false;
    };

    topEl.addEventListener('scroll', handleTopScroll, { passive: true });
    mainEl.addEventListener('scroll', handleMainScroll, { passive: true });

    return () => {
      topEl.removeEventListener('scroll', handleTopScroll);
      mainEl.removeEventListener('scroll', handleMainScroll);
    };
  }, []);

  const todayTimestamp = React.useMemo(() => Date.now(), []);
  const getDaysSinceUpdate = (isoDate?: string) => {
    if (!isoDate) return 0;
    const diff = todayTimestamp - new Date(isoDate).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Dropped outside or in same column with same index
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as Application['status'];
    if (newStatus && newStatus !== source.droppableId) {
      onUpdateStatus(draggableId, newStatus);
    }
  };

  return (
    <div className='w-full space-y-2 select-none'>
      {/* Top Customized Scrollbar Track */}
      <div
        ref={topScrollRef}
        className='w-full overflow-x-auto overflow-y-hidden h-3.5 rounded-sm bg-[#090912]/80 border border-white/8 custom-scrollbar'
        title='Horizontal Pipeline Scroll'
      >
        <div className='h-1 min-w-[2140px]' />
      </div>

      {/* Main Kanban Board Container (Bottom Scrollbar Removed via hide-scrollbar) */}
      <div ref={mainScrollRef} className='w-full overflow-x-auto hide-scrollbar pb-6'>
        {mounted ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className='flex items-start gap-4 min-w-[2140px]'>
              {STATUS_ORDER.map((status) => {
                const cfg = STATUS_CONFIG[status];
                const stageApps = applications.filter((app) => app.status === status);

                return (
                  <div
                    key={status}
                    className='w-72 shrink-0 rounded-sm bg-[#090912]/80 border border-white/8 p-3.5 flex flex-col max-h-[calc(100vh-220px)] shadow-none overflow-hidden'
                  >
                    {/* Stage Header */}
                    <div className='flex items-center justify-between pb-3 border-b border-white/5 mb-3 px-1'>
                      <div className='flex items-center gap-2'>
                        <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                        <h3 className='text-xs font-bold font-mono text-zinc-200'>{cfg.label}</h3>
                        <span className='text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-white/5 text-zinc-400'>
                          {stageApps.length}
                        </span>
                      </div>
                      {onAddNewToStage && (
                        <button
                          type='button'
                          onClick={() => onAddNewToStage(status)}
                          className='p-1 rounded-sm text-zinc-500 hover:text-white hover:bg-white/5 transition-all cursor-pointer'
                          title={`Add new application to ${cfg.label}`}
                        >
                          <Plus className='w-4 h-4' />
                        </button>
                      )}
                    </div>

                    {/* Droppable Stage Cards List */}
                    <Droppable droppableId={status}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={cn(
                            'flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar space-y-3 pr-1 min-h-[120px] rounded-sm transition-colors duration-150',
                            snapshot.isDraggingOver && 'bg-indigo-950/20 border border-indigo-500/30 ring-1 ring-indigo-500/20'
                          )}
                        >
                          {stageApps.map((app, index) => {
                            const daysOld = getDaysSinceUpdate(app.lastUpdated || app.appliedDate);

                            return (
                              <Draggable key={app.id} draggableId={app.id} index={index}>
                                {(dragProvided, dragSnapshot) => (
                                  <div
                                    ref={dragProvided.innerRef}
                                    {...dragProvided.draggableProps}
                                    {...dragProvided.dragHandleProps}
                                    onClick={() => onSelectApplication(app)}
                                    className={cn(
                                      'p-3.5 rounded-sm bg-white/3 hover:bg-white/6 border border-white/8 hover:border-indigo-500/40 transition-all cursor-grab active:cursor-grabbing group shadow-none text-left relative',
                                      dragSnapshot.isDragging &&
                                        'shadow-2xl shadow-indigo-500/40 border-indigo-400/80 bg-[#161628] opacity-95 ring-1 ring-indigo-400/60 z-50 cursor-grabbing'
                                    )}
                                  >
                                    <div className='flex items-start justify-between gap-2'>
                                      <div className='min-w-0 flex-1'>
                                        <div className='flex items-center gap-1.5'>
                                          <span
                                            className='text-zinc-600 group-hover:text-zinc-400 p-0.5 -ml-1 rounded-sm'
                                            title='Drag to move'
                                          >
                                            <GripVertical className='w-3.5 h-3.5' />
                                          </span>
                                          <span className='text-[11px] font-bold text-indigo-400 group-hover:text-indigo-300 transition-colors truncate block'>
                                            {app.company}
                                          </span>
                                        </div>
                                        <h4 className='text-xs font-bold text-white leading-snug mt-1 line-clamp-2'>
                                          {app.role}
                                        </h4>
                                      </div>
                                      <span className='text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-sm bg-white/4 text-zinc-400 border border-white/5 shrink-0'>
                                        {app.source}
                                      </span>
                                    </div>

                                    {/* Details & Metadata */}
                                    <div className='mt-2.5 space-y-1 text-[11px] text-zinc-400 font-mono'>
                                      {app.location && (
                                        <div className='flex items-center gap-1.5 text-zinc-400'>
                                          <MapPin className='w-3 h-3 text-zinc-500 shrink-0' />
                                          <span className='truncate'>{app.location}</span>
                                        </div>
                                      )}
                                      {(app.salaryMin || app.salaryMax) && (
                                        <div className='flex items-center gap-1.5 text-zinc-300 font-mono'>
                                          <DollarSign className='w-3 h-3 text-emerald-400 shrink-0' />
                                          <span>
                                            ${((app.salaryMin || 0) / 1000).toFixed(0)}k - ${((app.salaryMax || 0) / 1000).toFixed(0)}k
                                          </span>
                                        </div>
                                      )}
                                    </div>

                                    {/* Footer: Date & Stage Badge */}
                                    <div className='mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-zinc-500'>
                                      <span className={daysOld > 7 ? 'text-amber-400/90 font-medium' : ''}>
                                        {daysOld === 0 ? 'Today' : `${daysOld}d ago`}
                                      </span>

                                      <span
                                        className={cn(
                                          'px-2 py-0.5 rounded-sm text-[10px] font-mono font-medium border flex items-center gap-1.5',
                                          cfg.badge
                                        )}
                                      >
                                        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', cfg.dot)} />
                                        {cfg.label}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}

                          {stageApps.length === 0 && (
                            <div className='py-8 text-center text-[11px] font-mono text-zinc-600 border border-dashed border-white/5 rounded-sm'>
                              Drop applications here
                            </div>
                          )}
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
              })}
            </div>
          </DragDropContext>
        ) : (
          /* Static Skeleton during Initial Hydration */
          <div className='flex items-start gap-4 min-w-[2140px]'>
            {STATUS_ORDER.map((status) => {
              const cfg = STATUS_CONFIG[status];
              const stageApps = applications.filter((app) => app.status === status);

              return (
                <div
                  key={status}
                  className='w-72 shrink-0 rounded-sm bg-[#090912]/80 border border-white/8 p-3.5 flex flex-col max-h-[calc(100vh-220px)] shadow-none'
                >
                  <div className='flex items-center justify-between pb-3 border-b border-white/5 mb-3 px-1'>
                    <div className='flex items-center gap-2'>
                      <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                      <h3 className='text-xs font-bold font-mono text-zinc-200'>{cfg.label}</h3>
                      <span className='text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-white/5 text-zinc-400'>
                        {stageApps.length}
                      </span>
                    </div>
                  </div>
                  <div className='flex-1 space-y-3 min-h-[120px]'>
                    {stageApps.map((app) => (
                      <div
                        key={app.id}
                        className='p-3.5 rounded-sm bg-white/3 border border-white/8 text-left'
                      >
                        <span className='text-[11px] font-bold text-indigo-400 block truncate'>{app.company}</span>
                        <h4 className='text-xs font-bold text-white leading-snug mt-1 truncate'>{app.role}</h4>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
