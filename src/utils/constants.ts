import { MATCH_STATES } from '@g-loot/react-tournament-brackets';

export const ENTRY_AGE_MIN = 1;
export const ENTRY_AGE_MAX = 99;
export const ENTRY_NAME_MAX_LENGTH = 100;
export const ENTRY_WEIGHT_MIN = 1;
export const ENTRY_WEIGHT_MAX = 200;
export const IDLE_SECONDS_BETWEEN_MATCHES = 5 * 60;
export const DIVISION_AGE_MIN = 1;
export const DIVISION_AGE_MAX = 99;
export const DIVISION_DURATION_MIN = 1;
export const DIVISION_DURATION_MAX = 180;
export const DIVISION_NUM_ROUNDS_MIN = 1;
export const DIVISION_NUM_ROUNDS_MAX = 5;
export const DIVISION_WEIGHT_MIN = 1;
export const DIVISION_WEIGHT_MAX = 200;
export const TOURNAMENT_NAME_MAX_LENGTH = 100;
export const TOURNAMENT_DESCRIPTION_MAX_LENGTH = 255;

export const MatchState = {
  Done: MATCH_STATES.DONE,
  NoParty: MATCH_STATES.NO_PARTY,
  NoShow: MATCH_STATES.NO_SHOW,
  Played: MATCH_STATES.PLAYED,
  ScoreDone: MATCH_STATES.SCORE_DONE,
  WalkOver: MATCH_STATES.WALK_OVER,
  Scheduled: 'SCHEDULED',
  Running: 'RUNNING',
};
