import { Match } from '@g-loot/react-tournament-brackets/dist/src/types';
import { DateTime } from 'luxon';
import { v4 as uuid } from 'uuid';

import { Division, Entry, Tournament } from '../../types';
import { IDLE_SECONDS_BETWEEN_MATCHES, MatchState } from '../../utils';
import { MatchData } from './types';

type EntriesBoundaries = {
  lowestAge: number;
  highestAge: number;
  lowestWeight: number;
  highestWeight: number;
};

type BeltDivision = {
  belt: string;
  entries: Entry[];
};

type AgeDivision = {
  minAge: number;
  maxAge: number;
  entries: Entry[];
  entryIds: string[];
};

type WeightDivision = {
  minWeight: number;
  maxWeight: number;
  entries: Entry[];
};

type BeltWeightDivision = {
  belt: string;
  minWeight: number;
  maxWeight: number;
  entries: Entry[];
};

function mapEntryById(entry: Entry) {
  return entry.id;
}

function findEntriesBoundaries(entries: Entry[]): EntriesBoundaries {
  const boundaries: EntriesBoundaries = {
    lowestAge: Number.MAX_SAFE_INTEGER,
    highestAge: 0,
    lowestWeight: Number.MAX_SAFE_INTEGER,
    highestWeight: 0,
  };

  let entry: Entry;
  let len = entries.length;
  for (let i = 0; i < len; i++) {
    entry = entries[i];
    if (entry.age < boundaries.lowestAge) {
      boundaries.lowestAge = Math.floor(entry.age);
    }
    if (entry.age > boundaries.highestAge) {
      boundaries.highestAge = Math.ceil(entry.age);
    }
    if (entry.weight < boundaries.lowestWeight) {
      boundaries.lowestWeight = Math.floor(entry.weight);
    }
    if (entry.weight > boundaries.highestWeight) {
      boundaries.highestWeight = Math.ceil(entry.weight);
    }
  }

  return boundaries;
}

function createBeltDivisions(entries: Entry[]): BeltDivision[] {
  const divisionsMap: Record<string, BeltDivision> = {};
  entries.forEach((e) => {
    if (!divisionsMap[e.belt]) {
      divisionsMap[e.belt] = {
        belt: e.belt,
        entries: [],
      };
    }
    divisionsMap[e.belt].entries.push(e);
  });

  return Object.values(divisionsMap).filter((d) => d.entries.length > 0);
}

function createAgeDivisions(
  lowestAge: number,
  highestAge: number,
  entries: Entry[],
  ageRange: number = 2,
): AgeDivision[] {
  const divisions: AgeDivision[] = [];
  const divisionMap: Record<number, AgeDivision> = {};

  let division: AgeDivision;
  let age = lowestAge - 1;
  let divisionAge;
  let nextDivisionAge = lowestAge + ageRange + 1;
  while (++age <= highestAge) {
    if (!divisionMap[age]) {
      if (!divisionAge || age === nextDivisionAge) {
        divisionAge = age;
        nextDivisionAge = divisionAge + ageRange + 1;
        division = {
          minAge: age,
          maxAge: age + ageRange,
          entries: [],
          entryIds: [],
        };
        divisionMap[divisionAge] = division;
        divisions.push(division);
      }
      divisionMap[age] = divisionMap[divisionAge];
    }
  }

  entries.forEach((e) => {
    divisionMap[Math.floor(e.age)].entries.push(e);
  });

  const result = divisions.filter((d) => d.entries.length > 0);
  result.forEach((d) => {
    d.entryIds = d.entries.map(mapEntryById);
  });
  return result;
}

function createWeightDivisions(
  lowestWeight: number,
  highestWeight: number,
  entries: Entry[],
  weightRange: number = 2,
): WeightDivision[] {
  const divisions: WeightDivision[] = [];
  const divisionMap: Record<number, WeightDivision> = {};

  let division: WeightDivision;
  let weight = lowestWeight - 1;
  let divisionWeight;
  let nextDivisionWeight = lowestWeight + weightRange + 1;
  while (++weight <= highestWeight) {
    if (!divisionMap[weight]) {
      if (!divisionWeight || weight === nextDivisionWeight) {
        divisionWeight = weight;
        nextDivisionWeight = divisionWeight + weightRange + 1;
        division = {
          minWeight: weight,
          maxWeight: weight + weightRange + 1,
          entries: [],
        };
        divisionMap[divisionWeight] = division;
        divisions.push(division);
      }
      divisionMap[weight] = divisionMap[divisionWeight];
    }
  }

  entries.forEach((e) => {
    divisionMap[Math.floor(e.weight)].entries.push(e);
  });

  return divisions.filter((d) => d.entries.length > 0);
}

function divideWeightDivisionsByBelt(
  weightDivisions: WeightDivision[],
): BeltWeightDivision[] {
  const divisionsMap: Record<string, BeltWeightDivision> = {};
  let key;

  weightDivisions.forEach((d) => {
    d.entries.forEach((e) => {
      key = `${d.minWeight}-${e.belt}`;
      if (!divisionsMap[key]) {
        divisionsMap[key] = {
          belt: e.belt,
          minWeight: d.minWeight,
          maxWeight: d.maxWeight,
          entries: [],
        };
      }
      divisionsMap[key].entries.push(e);
    });
  });

  return Object.values(divisionsMap).filter((d) => d.entries.length > 0);
}

function combineBeltWeightWithAgeDivisions(
  beltWeightDivisions: BeltWeightDivision[],
  ageDivisions: AgeDivision[],
): Division[] {
  const ageDivisionsMap: Record<number, AgeDivision> = {};
  ageDivisions.forEach((d) => {
    for (let i = d.minAge; i <= d.maxAge; i++) {
      ageDivisionsMap[i] = d;
    }
  });

  const divisionsMap: Record<string, Division> = {};
  let key, a;

  beltWeightDivisions.forEach((d) => {
    d.entries.forEach((e) => {
      a = ageDivisionsMap[e.age];
      if (a) {
        key = `${d.minWeight}-${e.belt}-${e.gender}-${a.minAge}`;
        if (!divisionsMap[key]) {
          divisionsMap[key] = {
            id: uuid(),
            belt: e.belt,
            gender: e.gender,
            minWeight: d.minWeight,
            maxWeight: d.maxWeight,
            minAge: a.minAge,
            maxAge: a.maxAge,
            duration: 90,
            numRounds: 2,
            entries: [],
            entryIds: [],
          };
        }
        divisionsMap[key].entries?.push(e);
      }
    });
  });

  const result = Object.values(divisionsMap).filter(
    (d) => d.entries && d.entries.length > 0,
  );
  result.forEach((d) => {
    d.entryIds = (d.entries || []).map(mapEntryById);
  });
  return result;
}

export function createDivisionsFromEntries(entries: Entry[]): Division[] {
  if (!entries || entries.length === 0) {
    return [];
  }
  const { lowestAge, highestAge, lowestWeight, highestWeight } =
    findEntriesBoundaries(entries);

  const ageDivisions = createAgeDivisions(lowestAge, highestAge, entries);

  const weightDivisions = createWeightDivisions(
    lowestWeight,
    highestWeight,
    entries,
  );

  const beltWeightDivisions = divideWeightDivisionsByBelt(weightDivisions);
  const divisions = combineBeltWeightWithAgeDivisions(
    beltWeightDivisions,
    ageDivisions,
  );

  return divisions;
}

function createNextMatches(matches: MatchData[]): MatchData[] {
  const result: MatchData[] = [...matches];

  const prevMatchesById: Record<number, number[]> = {};
  let nextMatch: MatchData | null = null;

  result
    .filter((match) => !match.nextMatchId)
    .forEach((match) => {
      if (!nextMatch) {
        nextMatch = {
          id: result.length,
          name: '',
          nextMatchId: null,
          tournamentRoundText: '1',
          startTime: '',
          state: MatchState.Scheduled,
          participants: [],
        };
        prevMatchesById[nextMatch.id] = [];
        result.push(nextMatch);
      }
      if (prevMatchesById[nextMatch.id].length < 2) {
        match.nextMatchId = nextMatch.id;
        prevMatchesById[nextMatch.id].push(match.id);
      }
      if (prevMatchesById[nextMatch.id].length >= 2) {
        nextMatch = null;
      }
    });

  if (result.filter((match) => !match.nextMatchId).length > 1) {
    return createNextMatches(result);
  }

  return result;
}

export function createDivisionMatches(division: Division): MatchData[] {
  let matches: MatchData[] = [];
  const { entries } = division;
  const matchesById: Record<number, MatchData> = {};

  let match: MatchData;

  (entries || [])?.forEach((entry, index) => {
    if (index % 2 === 0) {
      match = {
        id: matches.length,
        name: '',
        nextMatchId: null,
        tournamentRoundText: '1',
        startTime: '',
        state: MatchState.Scheduled,
        participants: [],
      };
      matchesById[match.id] = match;
      matches.push(match);
    }
    match.participants.push({
      id: uuid(),
      resultText: null,
      isWinner: false,
      status: null,
      name: entry.name,
      club: entry.club,
    });
  });

  if (matches.filter((match) => !match.nextMatchId).length > 1) {
    return createNextMatches(matches);
  }

  return matches;
}

export function assignMatchesTimesAndOrder(
  tournament: Tournament,
  divisions: Division[],
  matchesByDivisionId: Record<string, MatchData[]>,
): Record<string, MatchData[]> {
  const startMatchTime = DateTime.fromISO(tournament.startMatchTime || '09:30');

  let counter = 0;
  let timeInSeconds = 0;
  let matches: MatchData[];

  const totalMatchCount = divisions.reduce(
    (sum, division) => sum + matchesByDivisionId[division.id].length,
    0,
  );
  const totalMatchDigit = String(totalMatchCount).length;

  divisions.forEach((division) => {
    matches = matchesByDivisionId[division.id];
    if (matches) {
      matches.forEach((match) => {
        timeInSeconds +=
          division.numRounds * division.duration + IDLE_SECONDS_BETWEEN_MATCHES;
        match.startTime = startMatchTime
          .plus({ seconds: timeInSeconds })
          .toLocaleString(DateTime.TIME_SIMPLE);
        match.name = String(++counter).padStart(totalMatchDigit + 1, '0');
      });
    }
  });
  return matchesByDivisionId;
}
