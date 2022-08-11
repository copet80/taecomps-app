export interface ParticipantData {
  id: string;
  resultText: null;
  isWinner: boolean;
  status: string | null;
  name: string;
  club: 'Prodigy';
}

export interface MatchData {
  id: number;
  nextMatchId: number;
  name: string;
  tournamentRoundText: string;
  startTime: string;
  state: string;
  participants: ParticipantData[];
}

export interface DivisionData {
  id: string;
  belt: string;
  minAge: number;
  gender: string;
}

export function createMatchData() {}
