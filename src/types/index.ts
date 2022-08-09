export type Tournament = {
  id: string;
  name: string;
};

export type SwitchTournamentFn = (tournament: Tournament) => Promise<boolean>;
