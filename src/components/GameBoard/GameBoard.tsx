import React, { useState, useEffect } from 'react';
import { useGame } from '../../contexts/GameContext';
import { getWinningLine } from '../../utils/gameLogic';
import styles from './GameBoard.module.css';

export const GameBoard: React.FC = () => {
  const { gameState, makeMove, makeLocalMove, playerUuid, opponentUuid, playerNickname } = useGame();
  const [showResult, setShowResult] = useState(false);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const isComputerGame = opponentUuid === 'computer';

  // Показываем результат после окончания раунда
  useEffect(() => {
    if (gameState.winner || gameState.isDraw) {
      // Определяем выигрышную линию для подсветки клеток
      if (gameState.winner) {
        const line = getWinningLine(gameState.board);
        setWinningLine(line);
      } else {
        setWinningLine(null);
      }

      setShowResult(true);
      
      // Скрываем результат через 4.5 секунды
      const timer = setTimeout(() => {
        setShowResult(false);
        setWinningLine(null);
      }, 4500);

      return () => clearTimeout(timer);
    } else {
      setShowResult(false);
      setWinningLine(null);
    }
  }, [gameState.winner, gameState.isDraw, gameState.board]);

  const handleCellClick = (index: number) => {
    if (isComputerGame) {
      makeLocalMove(index);
    } else {
      makeMove(index);
    }
  };

  const renderCell = (index: number) => {
    const value = gameState.board[index];
    const isMyTurn = gameState.currentPlayer === gameState.mySymbol;
    const canClick = 
      !value && 
      gameState.isActive && 
      isMyTurn;
    
    // Используем winningLine для подсветки клеток
    const isWinningCell = winningLine?.includes(index);

    return (
      <button
        key={index}
        className={`${styles.cell} ${
          canClick ? styles.cellActive : ''
        } ${value === 'X' ? styles.cellX : ''} ${
          value === 'O' ? styles.cellO : ''
        } ${isWinningCell ? styles.cellWinning : ''}`}
        onClick={() => handleCellClick(index)}
        disabled={!canClick}
      >
        {value && <span className={styles.cellValue}>{value}</span>}
      </button>
    );
  };

  const myScore = isComputerGame ? (gameState.score['player'] || 0) : (playerUuid ? gameState.score[playerUuid] || 0 : 0);
  const opponentScore = isComputerGame ? (gameState.score['computer'] || 0) : (opponentUuid ? gameState.score[opponentUuid] || 0 : 0);

  const getResultMessage = () => {
    if (gameState.isDraw) {
      return 'Ничья!';
    }
    const isWinner = gameState.winner === gameState.mySymbol;
    return isWinner ? 'Победа!' : 'Поражение';
  };

  const getResultClass = () => {
    if (gameState.isDraw) return styles.resultDraw;
    const isWinner = gameState.winner === gameState.mySymbol;
    return isWinner ? styles.resultWin : styles.resultLose;
  };


  return (
    <div className={styles.container}>
      {/* Никнейм игрока */}
      {playerNickname && (
        <div className={styles.playerNickname}>
          {playerNickname}
        </div>
      )}

      {/* Счет */}
      <div className={styles.scoreBoard}>
        <div className={styles.scoreItem}>
          <div className={styles.scoreLabel}>Вы</div>
          <div className={`${styles.scoreValue} ${styles.myScore}`}>{myScore}</div>
          <div className={styles.scoreSymbol}>
            <span className={gameState.mySymbol === 'X' ? styles.symbolX : styles.symbolO}>
              {gameState.mySymbol}
            </span>
          </div>
        </div>

        <div className={styles.scoreDivider}>
          <span className={styles.roundNumber}>Раунд {gameState.roundNumber}</span>
        </div>

        <div className={styles.scoreItem}>
          <div className={styles.scoreLabel}>{isComputerGame ? 'Компьютер' : 'Противник'}</div>
          <div className={`${styles.scoreValue} ${styles.opponentScore}`}>{opponentScore}</div>
          <div className={styles.scoreSymbol}>
            <span className={gameState.mySymbol === 'X' ? styles.symbolO : styles.symbolX}>
              {gameState.mySymbol === 'X' ? 'O' : 'X'}
            </span>
          </div>
        </div>
      </div>

      {/* Информация о ходе */}
      <div className={styles.turnInfo}>
        {gameState.isActive ? (
          <>
            {gameState.currentPlayer === gameState.mySymbol ? (
              <span className={styles.myTurn}>Ваш ход</span>
            ) : (
              <span className={styles.opponentTurn}>Ход противника</span>
            )}
          </>
        ) : showResult ? (
          <div className={`${styles.resultMessage} ${getResultClass()}`}>
            <div className={styles.resultText}>{getResultMessage()}</div>
            <div className={styles.resultSubtext}>Следующий раунд через несколько секунд...</div>
          </div>
        ) : (
          <span className={styles.waitingTurn}>Ожидание...</span>
        )}
      </div>

      {/* Игровое поле */}
      <div className={styles.boardWrapper}>
        <div className={styles.board}>
          {Array.from({ length: 9 }, (_, i) => renderCell(i))}
        </div>
      </div>
    </div>
  );
};