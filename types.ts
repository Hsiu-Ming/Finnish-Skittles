export interface Team {
  id: 'A' | 'B';
  name: string;
  roster: string[];
  currentThrowerIndex: number;
  score: number;
  faults: number; // Consecutive misses
  isEliminated: boolean;
}

export interface GameLog {
  id: string;
  round: number;
  teamId: 'A' | 'B';
  teamName: string;
  throwerName: string;
  points: number;
  scoreAfter: number;
  note?: string; // e.g., "Miss", "Over 50 -> 25"
  timestamp: number;
  // Snapshot for undo
  snapshot: {
    teamAScore: number;
    teamAFaults: number;
    teamAThrowerIndex: number;
    teamBScore: number;
    teamBFaults: number;
    teamBThrowerIndex: number;
    turn: 'A' | 'B';
  };
}

export type GameStatus = 'SETUP' | 'PLAYING' | 'FINISHED';

export interface GameState {
  status: GameStatus;
  teamA: Team;
  teamB: Team;
  currentTurn: 'A' | 'B';
  round: number;
  history: GameLog[];
  winnerId: 'A' | 'B' | null;
  winReason: string | null;
}
