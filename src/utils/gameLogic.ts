import { PlayerSymbol } from '../types/game.types';

const WINNING_COMBINATIONS = [
  [0, 1, 2], // Горизонтали
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6], // Вертикали
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8], // Диагонали
  [2, 4, 6]
];

export const checkWinner = (board: (PlayerSymbol | null)[]): PlayerSymbol | null => {
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

export const getWinningLine = (board: (PlayerSymbol | null)[]): number[] | null => {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return combination;
    }
  }
  return null;
};

export const checkDraw = (board: (PlayerSymbol | null)[]): boolean => {
  return board.every(cell => cell !== null) && !checkWinner(board);
};

export const isValidMove = (
  board: (PlayerSymbol | null)[],
  cell: number,
  currentPlayer: PlayerSymbol | null,
  mySymbol: PlayerSymbol | null
): boolean => {
  return (
    cell >= 0 &&
    cell < 9 &&
    board[cell] === null &&
    currentPlayer === mySymbol
  );
};