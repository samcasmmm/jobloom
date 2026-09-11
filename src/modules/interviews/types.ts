import type { InterviewRound } from '../storage/types/schema';

export type { InterviewRound } from '../storage/types/schema';

export type InterviewRoundDraft = Omit<InterviewRound, 'id' | 'createdAt'>;
