import React, { useState, useEffect } from 'react';
import { copyToClipboard } from '../../utils/clipboard';
import styles from './WaitingModal.module.css';

interface WaitingModalProps {
  url: string;
  onClose?: () => void;
}

export const WaitingModal: React.FC<WaitingModalProps> = ({ url, onClose }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Автоматическое копирование при открытии
    copyToClipboard(url);
  }, [url]);

  const handleCopy = async () => {
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.spinnerContainer}>
          <div className={styles.spinner}></div>
        </div>

        <h2 className={styles.title}>Ожидание игрока...</h2>
        <p className={styles.description}>
          Отправьте эту ссылку другу, чтобы начать игру
        </p>

        <div className={styles.urlContainer}>
          <code className={styles.url}>{url}</code>
        </div>

        <button 
          className={`${styles.copyButton} ${copied ? styles.copied : ''}`}
          onClick={handleCopy}
        >
          <span className={styles.copyIcon}>{copied ? '✓' : '📋'}</span>
          <span>{copied ? 'Скопировано!' : 'Копировать ссылку'}</span>
        </button>

        {onClose && (
          <button className={styles.cancelButton} onClick={onClose}>
            Отменить
          </button>
        )}
      </div>
    </div>
  );
};