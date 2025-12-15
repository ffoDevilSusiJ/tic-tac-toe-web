import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './contexts/GameContext';
import './App.css';
import './styles/variables.css';
import './styles/global.css';
import { JoinGamePage } from './components/JoinGamePage/JoinGamePage';
import { MainPage } from './components/MainPage/MainPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <GameProvider>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/:targetUuid" element={<JoinGamePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </GameProvider>
    </BrowserRouter>
  );
};

export default App;