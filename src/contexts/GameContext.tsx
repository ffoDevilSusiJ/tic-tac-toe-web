import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrCreatePlayerUUID } from '../utils/uuid';
import { copyToClipboard } from '../utils/clipboard';
import { GameService } from '../services/game.service';
import { useGameState } from '../hooks/useGameState';
import { WebSocketService } from '../services/websocket.service';
import { WSMessage } from '../types/websocket.types';
import { GameState, PlayerSymbol } from '../types/game.types';

interface GameContextValue {
  playerUuid: string;
  gameState: GameState;
  isWaiting: boolean;
  gameUrl: string | null;
  opponentUuid: string | null;
  createGame: () => void;
  joinGame: (targetUuid: string) => void;
  makeMove: (cell: number) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: React.ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [playerUuid] = useState(() => getOrCreatePlayerUUID());
  const [isWaiting, setIsWaiting] = useState(false);
  const [gameUrl, setGameUrl] = useState<string | null>(null);
  const [opponentUuid, setOpponentUuid] = useState<string | null>(null);
  const [wsService] = useState(() => new WebSocketService(
    process.env.REACT_APP_WS_URL || 'http://localhost:8080'
  ));
  const navigate = useNavigate();

  const {
    gameState,
    startGame,
    resetGame: resetGameState,
    updateBoard,
    setWinner,
    updateScore,
    startNewRound,
  } = useGameState();

  // Обработка сообщений от WebSocket
  useEffect(() => {
    const handleMessage = (message: WSMessage) => {
      console.log('📨 Processing message:', message);

      switch (message.type) {
        case 'game_start':
          if (message.symbol) {
            console.log('🎮 Game started, my symbol:', message.symbol);
            startGame(message.symbol, message.score, message.roundNumber);
            setIsWaiting(false);
            
            // Определяем UUID оппонента
            if (message.score) {
              const opponent = Object.keys(message.score).find(uuid => uuid !== playerUuid);
              if (opponent) {
                setOpponentUuid(opponent);
              }
            }
          }
          break;

        case 'player_move':
          if (message.cell !== undefined && message.sourceUuid) {
            const symbol: PlayerSymbol =
              message.sourceUuid === playerUuid
                ? gameState.mySymbol!
                : gameState.mySymbol === 'X'
                ? 'O'
                : 'X';

            console.log('👆 Move:', message.cell, 'by', symbol);
            updateBoard(message.cell, symbol);
          }
          break;

        case 'game_end':
          console.log('🏁 Round ended:', message);
          setWinner(message.winner as PlayerSymbol | null, message.isDraw || false);
          
          if (message.score) {
            updateScore(message.score);
          }
          break;

        case 'round_start':
          console.log('🔄 New round starting:', message.roundNumber);
          if (message.roundNumber && message.score) {
            startNewRound(message.roundNumber);
            updateScore(message.score);
          }
          break;

        case 'error':
          console.error('❌ Error from server:', message.error);
          if (message.error === 'Game not found or is full') {
            alert('Игра не найдена или уже заполнена');
            navigate('/');
          }
          break;
      }
    };

    wsService.onMessage(handleMessage);
  }, [wsService, playerUuid, gameState.mySymbol, startGame, updateBoard, setWinner, updateScore, startNewRound, navigate]);

  const createGame = useCallback(() => {
    console.log('🎮 Creating game for:', playerUuid);
    const url = GameService.generateGameUrl(playerUuid);
    setGameUrl(url);
    setIsWaiting(true);
    copyToClipboard(url);

    wsService.connect(playerUuid);

    setTimeout(() => {
      console.log('📤 Sending game_start');
      wsService.send({
        type: 'game_start',
        sourceUuid: playerUuid,
        targetUuid: playerUuid,
      });
    }, 500);
  }, [playerUuid, wsService]);

  const joinGame = useCallback(
    (targetUuid: string) => {
      console.log('🎮 Joining game:', targetUuid);
      setOpponentUuid(targetUuid);

      wsService.connect(playerUuid, targetUuid);

      setTimeout(() => {
        console.log('📤 Sending game_start to join');
        wsService.send({
          type: 'game_start',
          sourceUuid: playerUuid,
          targetUuid: targetUuid,
        });
      }, 500);
    },
    [playerUuid, wsService]
  );

  const makeMove = useCallback(
    (cell: number) => {
      if (!gameState.isActive || gameState.currentPlayer !== gameState.mySymbol) {
        console.log('❌ Cannot make move');
        return;
      }

      if (gameState.board[cell] !== null) {
        console.log('❌ Cell already occupied');
        return;
      }

      console.log('📤 Sending move:', cell);
      wsService.send({
        type: 'player_move',
        sourceUuid: playerUuid,
        cell,
      });
    },
    [gameState, playerUuid, wsService]
  );

  const resetGame = useCallback(() => {
    console.log('🔄 Resetting game');
    resetGameState();
    setIsWaiting(false);
    setGameUrl(null);
    setOpponentUuid(null);
    wsService.disconnect();
    navigate('/');
  }, [resetGameState, wsService, navigate]);

  const value: GameContextValue = {
    playerUuid,
    gameState,
    isWaiting,
    gameUrl,
    opponentUuid,
    createGame,
    joinGame,
    makeMove,
    resetGame,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};