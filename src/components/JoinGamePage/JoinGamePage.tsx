import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './JoinGamePage.module.css';
import { useGame } from '../../contexts/GameContext';

export const JoinGamePage: React.FC = () => {
  const { targetUuid } = useParams<{ targetUuid: string }>();
  const { playerUuid, joinGame, gameState } = useGame();
  const navigate = useNavigate();
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('JoinGamePage mounted');
    console.log('targetUuid:', targetUuid);
    console.log('playerUuid:', playerUuid);

    if (!targetUuid) {
      console.log('No targetUuid, redirecting to menu');
      navigate('/');
      return;
    }

    // Проверяем, что это не наша собственная ссылка
    if (targetUuid === playerUuid) {
      console.log('This is your own game link!');
      setError('Это ваша собственная ссылка. Отправьте её другу, чтобы начать игру.');
      setTimeout(() => {
        navigate('/');
      }, 3000);
      return;
    }

    // Автоматически присоединяемся к игре
    if (!isJoining) {
      setIsJoining(true);
      console.log('Auto-joining game:', targetUuid);
      joinGame(targetUuid);
    }
  }, [targetUuid, playerUuid, joinGame, navigate, isJoining]);

  // Когда игра началась, перенаправляем на главную страницу
  useEffect(() => {
    if (gameState.mySymbol) {
      console.log('Game started, redirecting to main page');
      navigate('/');
    }
  }, [gameState.mySymbol, navigate]);

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.errorIcon}>⚠️</div>
          <h2 className={styles.errorTitle}>Ошибка</h2>
          <p className={styles.errorText}>{error}</p>
          <p className={styles.redirectText}>Перенаправление на главную...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.spinner}></div>
        <h2 className={styles.title}>Присоединение к игре...</h2>
        <p className={styles.text}>Пожалуйста, подождите</p>
        <p className={styles.debugText}>UUID игры: {targetUuid}</p>
      </div>
    </div>
  );
};