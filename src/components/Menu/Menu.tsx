import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../contexts/GameContext';
import { NicknameModal } from '../NicknameModal/NicknameModal';
import styles from './Menu.module.css';

export const Menu: React.FC = () => {
  const { createGame, startComputerGame, playerNickname, setPlayerNickname } = useGame();
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [joinUrl, setJoinUrl] = useState('');
  const navigate = useNavigate();

  const handleCreateGame = () => {
    createGame();
    // НЕ переходим на другой роут, просто создаем игру
    // модальное окно появится автоматически через isWaiting
  };

  const handleJoinGame = () => {
    try {
      const url = new URL(joinUrl);
      const uuid = url.pathname.slice(1); // Убираем первый слеш
      
      if (uuid && uuid.length > 0) {
        navigate(`/${uuid}`);
      } else {
        alert('Неверная ссылка');
      }
    } catch (error) {
      // Если не удалось распарсить как URL, пробуем извлечь UUID
      const uuid = joinUrl.split('/').pop();
      if (uuid && uuid.length > 0) {
        navigate(`/${uuid}`);
      } else {
        alert('Неверная ссылка');
      }
    }
  };

  const toggleJoinInput = () => {
    setShowJoinInput(!showJoinInput);
    setJoinUrl('');
  };

  const handlePlayComputer = () => {
    if (!playerNickname) {
      setShowNicknameModal(true);
    } else {
      startComputerGame();
    }
  };

  const handleNicknameSubmit = (nickname: string) => {
    setPlayerNickname(nickname);
    setShowNicknameModal(false);
    startComputerGame();
  };

  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <div className={styles.header}>
          <h1 className={styles.title}>Крестики-нолики</h1>
          <p className={styles.subtitle}>Играйте с друзьями онлайн</p>
        </div>

        <div className={styles.buttonContainer}>
          <button className={styles.primaryButton} onClick={handleCreateGame}>
            Создать игру
          </button>

          <button className={styles.primaryButton} onClick={handlePlayComputer}>
            Играть против компьютера
          </button>

          <button className={styles.secondaryButton} onClick={toggleJoinInput}>
            Присоединиться к игре
          </button>
        </div>

        {showJoinInput && (
          <div className={styles.joinContainer}>
            <input
              type="text"
              className={styles.input}
              placeholder="Вставьте ссылку от друга"
              value={joinUrl}
              onChange={(e) => setJoinUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleJoinGame()}
            />
            <button
              className={styles.joinButton}
              onClick={handleJoinGame}
              disabled={!joinUrl.trim()}
            >
              Присоединиться
            </button>
          </div>
        )}
      </div>

      {showNicknameModal && <NicknameModal onSubmit={handleNicknameSubmit} />}
    </div>
  );
};