import React from 'react';
import { useGame } from '../../contexts/GameContext';
import styles from './GameEndModal.module.css';

export const GameEndModal: React.FC = () => {
  const { gameState, resetGame } = useGame();

  if (!gameState.winner && !gameState.isDraw) {
    return null;
  }

  const isWinner = gameState.winner === gameState.mySymbol;
  
  const getTitle = () => {
    if (gameState.isDraw) return 'Ничья!';
    return isWinner ? '🎉 Победа!' : '😔 Поражение';
  };

  const getMessage = () => {
    if (gameState.isDraw) {
      return 'Игра закончилась вничью. Хотите сыграть еще раз?';
    }
    return isWinner 
      ? 'Поздравляем! Вы выиграли эту партию!'
      : 'В этот раз не повезло. Попробуйте еще раз!';
  };

  const getTitleClass = () => {
    if (gameState.isDraw) return styles.titleDraw;
    return isWinner ? styles.titleWin : styles.titleLose;
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.iconContainer}>
          {gameState.isDraw ? (
            <span className={styles.iconDraw}>🤝</span>
          ) : isWinner ? (
            <span className={styles.iconWin}>👑</span>
          ) : (
            <span className={styles.iconLose}>💫</span>
          )}
        </div>

        <h2 className={`${styles.title} ${getTitleClass()}`}>
          {getTitle()}
        </h2>
        
        <p className={styles.message}>{getMessage()}</p>

        {gameState.winner && (
          <div className={styles.winnerInfo}>
            Победитель: 
            <span className={`${styles.winnerSymbol} ${
              gameState.winner === 'X' ? styles.symbolX : styles.symbolO
            }`}>
              {gameState.winner}
            </span>
          </div>
        )}

        <button 
          className={styles.newGameButton}
          onClick={resetGame}
        >
          <span className={styles.buttonIcon}>🔄</span>
          <span>Новая игра</span>
        </button>
      </div>
    </div>
  );
};