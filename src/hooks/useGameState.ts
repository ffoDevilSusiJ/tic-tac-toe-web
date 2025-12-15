import { useState, useCallback } from 'react';
import { GameState, PlayerSymbol } from '../types/game.types';
import { GameService } from '../services/game.service';
import { isValidMove } from '../utils/gameLogic';

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(
    GameService.createInitialState()
  );

  const startGame = useCallback((mySymbol: PlayerSymbol, score?: { [uuid: string]: number }, roundNumber?: number) => {
    setGameState(prev => ({
      ...GameService.setGameStart(prev, mySymbol),
      score: score || prev.score,
      roundNumber: roundNumber || 1,
    }));
  }, []);

  const makeMove = useCallback((cell: number, symbol: PlayerSymbol) => {
    setGameState(prev => {
      if (!isValidMove(prev.board, cell, prev.currentPlayer, prev.mySymbol)) {
        return prev;
      }
      return GameService.makeMove(prev, cell, symbol);
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState(GameService.createInitialState());
  }, []);

  const updateBoard = useCallback((cell: number, symbol: PlayerSymbol) => {
    setGameState(prev => GameService.makeMove(prev, cell, symbol));
  }, []);

  const setWinner = useCallback((winner: PlayerSymbol | null, isDraw: boolean) => {
    setGameState(prev => ({
      ...prev,
      winner,
      isDraw,
      isActive: false
    }));
  }, []);

  const updateScore = useCallback((score: { [uuid: string]: number }) => {
    setGameState(prev => ({
      ...prev,
      score,
    }));
  }, []);

  const startNewRound = useCallback((roundNumber: number) => {
    setGameState(prev => ({
      ...prev,
      board: Array(9).fill(null),
      currentPlayer: 'X',
      winner: null,
      isDraw: false,
      isActive: true,
      roundNumber,
    }));
  }, []);

  return {
    gameState,
    startGame,
    makeMove,
    resetGame,
    updateBoard,
    setWinner,
    updateScore,
    startNewRound,
  };
};