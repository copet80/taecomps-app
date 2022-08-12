export interface ParticipantData {
  id: string;
  resultText: null;
  isWinner: boolean;
  status: string | null;
  name: string;
  club: string;
}

export interface MatchData {
  id: number;
  nextMatchId: number | null;
  name: string;
  tournamentRoundText: string;
  startTime: string;
  state: string;
  participants: ParticipantData[];
}
