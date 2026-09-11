import type { InterviewRound } from '@/modules/storage/types/schema';

export type { InterviewRound } from '@/modules/storage/types/schema';

export type InterviewRoundDraft = Omit<InterviewRound, 'id' | 'createdAt'>;
