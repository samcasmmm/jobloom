'use client';

import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import {
  Calendar as CalendarIcon,
  Video,
  Users,
  ExternalLink,
  FileText,
  Trash2,
  X,
  Clock,
} from 'lucide-react';
import type { Application, InterviewRound } from '@/modules/storage/types/schema';
import { formatDateTime } from '@/lib/date';
import { cn } from '@/lib/utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventClickArg = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventContentArg = any;

interface InterviewCalendarViewProps {
  applications: Application[];
  interviews: InterviewRound[];
  onSelectApplication: (app: Application) => void;
  onDeleteInterview: (id: string) => Promise<void>;
}

export const InterviewCalendarView: React.FC<InterviewCalendarViewProps> = ({
  applications,
  interviews,
  onSelectApplication,
  onDeleteInterview,
}) => {
  const [selectedRound, setSelectedRound] = useState<InterviewRound | null>(null);
  const appMap = new Map(applications.map((a) => [a.id, a]));

  const getOutcomeBadge = (outcome: InterviewRound['outcome']) => {
    switch (outcome) {
      case 'Pass':
        return {
          bg: 'bg-emerald-500/20',
          text: 'text-emerald-300',
          border: 'border-emerald-500/30',
          dot: 'bg-emerald-400',
        };
      case 'Fail':
        return {
          bg: 'bg-rose-500/20',
          text: 'text-rose-300',
          border: 'border-rose-500/30',
          dot: 'bg-rose-400',
        };
      default:
        return {
          bg: 'bg-indigo-500/20',
          text: 'text-indigo-300',
          border: 'border-indigo-500/30',
          dot: 'bg-indigo-400',
        };
    }
  };

  // Convert interviews to FullCalendar events
  const calendarEvents = interviews.map((round) => {
    const app = appMap.get(round.applicationId);
    const badge = getOutcomeBadge(round.outcome);

    return {
      id: round.id,
      title: `${app?.company || 'Company'} — ${round.type}`,
      start: round.scheduledAt,
      extendedProps: {
        round,
        app,
        badge,
      },
    };
  });

  const handleEventClick = (info: EventClickArg) => {
    const round = info.event.extendedProps.round as InterviewRound;
    if (round) {
      setSelectedRound(round);
    }
  };

  // Custom Event Chip inside FullCalendar cells
  const renderEventContent = (eventInfo: EventContentArg) => {
    const { round, app, badge } = eventInfo.event.extendedProps as {
      round: InterviewRound;
      app?: Application;
      badge: ReturnType<typeof getOutcomeBadge>;
    };

    return (
      <div
        className={cn(
          'w-full px-2 py-1 rounded-sm border text-[10px] font-mono leading-tight flex items-center justify-between gap-1.5 transition-all cursor-pointer shadow-xs overflow-hidden',
          badge.bg,
          badge.text,
          badge.border,
          'hover:brightness-125'
        )}
        title={`${app?.company || 'Company'} — ${round.type} Round (${eventInfo.timeText})`}
      >
        <div className='flex items-center gap-1.5 min-w-0 truncate'>
          <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', badge.dot)} />
          {eventInfo.timeText && (
            <span className='font-bold opacity-90 shrink-0'>{eventInfo.timeText}</span>
          )}
          <span className='truncate font-medium'>{app?.company || 'Company'}</span>
          <span className='opacity-70 truncate hidden sm:inline'>({round.type})</span>
        </div>
      </div>
    );
  };

  return (
    <div className='w-full space-y-4 text-left font-mono interview-calendar-container'>
      {/* Top Legend Bar */}
      <div className='p-3.5 rounded-sm bg-[#090912]/80 border border-white/8 flex flex-wrap items-center justify-between gap-4 text-xs'>
        <div className='flex items-center gap-2'>
          <CalendarIcon className='w-4 h-4 text-indigo-400' />
          <span className='font-bold text-white'>Interview Schedule & Loop Timeline</span>
          <span className='text-[10px] text-zinc-400 ml-1'>({interviews.length} scheduled rounds)</span>
        </div>

        <div className='flex items-center gap-3 text-[11px] text-zinc-400'>
          <div className='flex items-center gap-1.5'>
            <span className='w-2 h-2 rounded-full bg-indigo-400' />
            <span>Pending</span>
          </div>
          <div className='flex items-center gap-1.5'>
            <span className='w-2 h-2 rounded-full bg-emerald-400' />
            <span>Passed</span>
          </div>
          <div className='flex items-center gap-1.5'>
            <span className='w-2 h-2 rounded-full bg-rose-400' />
            <span>Failed</span>
          </div>
        </div>
      </div>

      {/* FullCalendar Wrapper */}
      <div className='p-4 rounded-sm bg-[#090912]/80 border border-white/8 shadow-2xl overflow-hidden'>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          initialView='dayGridMonth'
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
          }}
          buttonText={{
            today: 'Today',
            month: 'Month',
            week: 'Week',
            day: 'Day',
            list: 'List',
          }}
          events={calendarEvents}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          dayMaxEvents={3}
          height='auto'
          aspectRatio={1.65}
          nowIndicator={true}
        />
      </div>

      {/* Selected Interview Round Detail Modal */}
      {selectedRound && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6'>
          <div
            className='fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-150'
            onClick={() => setSelectedRound(null)}
          />

          <div className='relative w-full max-w-lg rounded-sm bg-[#0e0e1a] border border-indigo-500/30 p-6 shadow-2xl z-10 space-y-5 animate-in zoom-in-95 duration-150 font-mono'>
            {/* Header */}
            <div className='flex items-start justify-between gap-3 pb-3 border-b border-white/10'>
              <div className='flex items-center gap-3 min-w-0'>
                <div className='w-9 h-9 rounded-sm bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0'>
                  <Video className='w-5 h-5' />
                </div>
                <div>
                  <h3 className='text-sm font-bold text-white'>
                    {appMap.get(selectedRound.applicationId)?.company || 'Company'} — {selectedRound.type} Round
                  </h3>
                  <span
                    className={cn(
                      'inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm border mt-1',
                      getOutcomeBadge(selectedRound.outcome).bg,
                      getOutcomeBadge(selectedRound.outcome).text,
                      getOutcomeBadge(selectedRound.outcome).border
                    )}
                  >
                    Outcome: {selectedRound.outcome}
                  </span>
                </div>
              </div>

              <button
                type='button'
                onClick={() => setSelectedRound(null)}
                className='p-1.5 rounded-sm text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer'
              >
                <X className='w-4 h-4' />
              </button>
            </div>

            {/* Details */}
            <div className='space-y-3 text-xs text-zinc-300'>
              <div className='flex items-center gap-2.5'>
                <CalendarIcon className='w-4 h-4 text-indigo-400 shrink-0' />
                <span>{formatDateTime(selectedRound.scheduledAt)}</span>
              </div>

              {selectedRound.interviewerName && (
                <div className='flex items-center gap-2.5'>
                  <Users className='w-4 h-4 text-indigo-400 shrink-0' />
                  <span>
                    {selectedRound.interviewerName}{' '}
                    {selectedRound.interviewerRole ? `(${selectedRound.interviewerRole})` : ''}
                  </span>
                </div>
              )}

              {selectedRound.meetingLink && (
                <div className='flex items-center gap-2.5'>
                  <ExternalLink className='w-4 h-4 text-emerald-400 shrink-0' />
                  <a
                    href={selectedRound.meetingLink}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-emerald-400 hover:underline truncate'
                  >
                    {selectedRound.meetingLink}
                  </a>
                </div>
              )}

              {selectedRound.notes && (
                <div className='pt-3 border-t border-white/5 space-y-1.5'>
                  <span className='text-[11px] text-zinc-400 font-bold flex items-center gap-1.5'>
                    <FileText className='w-3.5 h-3.5 text-zinc-400' />
                    Notes & Debrief
                  </span>
                  <p className='text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed bg-white/4 p-3 rounded-sm border border-white/5 font-sans'>
                    {selectedRound.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className='flex items-center justify-between pt-3 border-t border-white/10'>
              <button
                type='button'
                onClick={async () => {
                  if (confirm('Delete this interview round?')) {
                    await onDeleteInterview(selectedRound.id);
                    setSelectedRound(null);
                  }
                }}
                className='px-3 py-1.5 rounded-sm text-xs text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors inline-flex items-center gap-1.5 cursor-pointer'
              >
                <Trash2 className='w-3.5 h-3.5' />
                <span>Delete</span>
              </button>

              <div className='flex items-center gap-2'>
                {appMap.get(selectedRound.applicationId) && (
                  <button
                    type='button'
                    onClick={() => {
                      const app = appMap.get(selectedRound.applicationId);
                      if (app) onSelectApplication(app);
                      setSelectedRound(null);
                    }}
                    className='px-4 py-1.5 rounded-sm text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors cursor-pointer shadow-none'
                  >
                    View Application
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
