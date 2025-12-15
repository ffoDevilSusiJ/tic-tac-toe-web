import { GameState, PlayerSymbol } from '../types/game.types';
import { checkWinner, checkDraw } from '../utils/gameLogic';

export class GameService {
  static createInitialState(): GameState {
    return {
      board: Array(9).fill(null),
      currentPlayer: null,
      mySymbol: null,
      winner: null,
      isDraw: false,
      isActive: false,
      score: {},
      roundNumber: 1,
    };
  }

  static makeMove(
    state: GameState,
    cell: number,
    symbol: PlayerSymbol
  ): GameState {
    const newBoard = [...state.board];
    newBoard[cell] = symbol;

    const winner = checkWinner(newBoard);
    const isDraw = checkDraw(newBoard);

    return {
      ...state,
      board: newBoard,
      currentPlayer: symbol === 'X' ? 'O' : 'X',
      winner,
      isDraw,
      isActive: !winner && !isDraw
    };
  }

  static setGameStart(state: GameState, mySymbol: PlayerSymbol): GameState {
    return {
      ...state,
      mySymbol,
      currentPlayer: 'X',
      isActive: true
    };
  }

  static generateGameUrl(playerUuid: string): string {
    return `${window.location.origin}/${playerUuid}`;
  }
}