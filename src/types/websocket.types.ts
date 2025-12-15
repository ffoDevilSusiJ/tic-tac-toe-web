export type WSMessageType = 'game_start' | 'player_move' | 'game_end' | 'error' | 'round_start';

export interface WSMessage {
  type: WSMessageType;
  sourceUuid?: string;
  targetUuid?: string;
  cell?: number;
  symbol?: 'X' | 'O';
  winner?: string | null;
  isDraw?: boolean;
  error?: string;
  score?: {
    [uuid: string]: number;
  };
  roundNumber?: number;
}