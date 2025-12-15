export type PlayerSymbol = 'X' | 'O';

export interface GameState {
  board: (PlayerSymbol | null)[];
  currentPlayer: PlayerSymbol | null;
  mySymbol: PlayerSymbol | null;
  winner: PlayerSymbol | null;
  isDraw: boolean;
  isActive: boolean;
  score: {
    [uuid: string]: number;
  };
  roundNumber: number;
}

export interface Player {
  uuid: string;
  symbol: PlayerSymbol | null;
}