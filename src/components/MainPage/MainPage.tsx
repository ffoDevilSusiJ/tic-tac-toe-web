import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { GameBoard } from '../GameBoard/GameBoard';
import { Menu } from '../Menu/Menu';
import { WaitingModal } from '../WaitingModal/WaitingModal';

export const MainPage: React.FC = () => {
  const { gameState, isWaiting, gameUrl } = useGame();

  return (
    <>
      {gameState.mySymbol ? <GameBoard /> : <Menu />}
      {isWaiting && gameUrl && <WaitingModal url={gameUrl} />}
    </>
  );
};