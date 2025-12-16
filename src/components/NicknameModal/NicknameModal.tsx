import React, { useState } from 'react';
import styles from './NicknameModal.module.css';

interface NicknameModalProps {
  onSubmit: (nickname: string) => void;
}

export const NicknameModal: React.FC<NicknameModalProps> = ({ onSubmit }) => {
  const [nickname, setNickname] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.trim()) {
      onSubmit(nickname.trim());
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Введите ваш никнейм</h2>
        <p className={styles.subtitle}>Он будет отображаться в игре</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className={styles.input}
            placeholder="Ваш никнейм"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            autoFocus
            maxLength={20}
          />
          <button
            type="submit"
            className={styles.button}
            disabled={!nickname.trim()}
          >
            Начать игру
          </button>
        </form>
      </div>
    </div>
  );
};
