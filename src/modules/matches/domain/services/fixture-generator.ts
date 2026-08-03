import { randomUUID } from 'crypto';
import { Match } from '../match.entity';

export type FixtureGenerationInput = {
  phaseId: string;
  teamIds: string[];
  fixtureStartDate: Date;
  doubleRound?: boolean; // fecha de la jornada 1
  groupId?: string | null;
};

type Pair = readonly [string, string];

export class FixtureGenerator {
  private static readonly DAYS_BETWEEN_ROUNDS = 7;

  generate(input: FixtureGenerationInput): Match[] {
    const {
      phaseId,
      teamIds,
      fixtureStartDate,
      doubleRound = false,
      groupId = null,
    } = input;
    if (teamIds.length < 2) {
      throw new Error('Se necesitan al menos 2 equipos');
    }
    const rounds = this.buildRoundRobinRounds(teamIds);
    // Ida y vuelta: mismas jornadas con local/visitante invertidos
    const allRounds: Pair[][] = doubleRound
      ? [
          ...rounds,
          ...rounds.map((round) =>
            round.map(([home, away]) => [away, home] as const),
          ),
        ]
      : rounds;
    const matches: Match[] = [];
    allRounds.forEach((roundPairs, roundIndex) => {
      const scheduledAt = new Date(fixtureStartDate);
      scheduledAt.setDate(
        fixtureStartDate.getDate() +
          roundIndex * FixtureGenerator.DAYS_BETWEEN_ROUNDS,
      );
      for (const [homeTeamId, awayTeamId] of roundPairs) {
        matches.push(
          Match.create(
            randomUUID(),
            phaseId,
            homeTeamId,
            awayTeamId,
            0,
            0,
            'TO_COME', // TODO: pasar a un enum general
            scheduledAt,
            groupId,
          ),
        );
      }
    });
    return matches;
  }

  /** Cada elemento = una jornada (varios partidos el mismo día). */
  private buildRoundRobinRounds(teamIds: string[]): Pair[][] {
    const teams = [...teamIds];
    if (teams.length % 2 !== 0) teams.push('BYE');
    const n = teams.length;
    const roundCount = n - 1;
    const half = n / 2;
    const rounds: Pair[][] = [];
    const rotation = [...teams];
    for (let round = 0; round < roundCount; round++) {
      const pairs: Pair[] = [];
      for (let i = 0; i < half; i++) {
        const home = rotation[i];
        const away = rotation[n - 1 - i];
        if (home !== 'BYE' && away !== 'BYE') {
          pairs.push(round % 2 === 0 ? [home, away] : [away, home]);
        }
      }
      rounds.push(pairs);
      const fixed = rotation[0];
      const rest = rotation.slice(1);
      rest.unshift(rest.pop()!);
      rotation.splice(0, rotation.length, fixed, ...rest);
    }
    return rounds;
  }
}
