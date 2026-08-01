import { TeamTournament } from "./value-objects/team-tournament.vo";
import { TournamentConfiguration } from "./value-objects/tournament-configuration.vo";
import {
  TeamAlreadyInTournamentError,
  TeamNotInTournamentError,
  InsufficientTeamsForFixtureError,
} from "./errors";


export class Tournament {
  private constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _state: string,
    private readonly _configuration: Record<string, any>,
    private readonly _startDate: Date,
    private readonly _teams: TeamTournament[] = [],
    private readonly _createdAt?: Date,
    private readonly _updatedAt?: Date,
  ) {}

  private static readonly MIN_TEAMS_FOR_FIXTURE = 2;

  static create(
    id: string,
    name: string,
    state: string,
    configuration: Record<string, any>,
    startDate: Date,
  ): Tournament {
    return new Tournament(id, name, state, configuration, startDate);
  }

  static fromPersistence(props: {
    id: string;
    name: string;
    state: string;
    configuration: Record<string, any>;
    startDate: Date;
    teams?: TeamTournament[];
  }): Tournament {
    return new Tournament(
      props.id,
      props.name,
      props.state,
      props.configuration,
      props.startDate,
      props.teams ?? [],
    );
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get state(): string {
    return this._state;
  }

  get configuration(): Record<string, any> {
    return this._configuration;
  }

  get startDate(): Date {
    return this._startDate;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  get teams(): TeamTournament[] {
    return this._teams ?? [];
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  addTeam(team: TeamTournament): void {
    if (this._teams.some((t) => t.id === team.id)) {
      throw new TeamAlreadyInTournamentError(team.id);
    }
    this._teams.push(team);
  }

  removeTeam(teamId: string): void {
    if (!this._teams.some((t) => t.id === teamId)) {
      throw new TeamNotInTournamentError(teamId);
    }
    const index = this._teams.findIndex((t) => t.id === teamId);
    this._teams.splice(index, 1);
  }

  assertCanGenerateFixture(): void {
    if (this._teams.length < Tournament.MIN_TEAMS_FOR_FIXTURE) {
      throw new InsufficientTeamsForFixtureError(this._id, this._teams.length);
    }
  }

  shouldCreatePhaseAutomatically(): boolean {
    return TournamentConfiguration.from(this._configuration).shouldCreatePhaseAutomatically();
  }
}