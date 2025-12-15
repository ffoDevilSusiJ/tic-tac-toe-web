import { useEffect, useRef } from 'react';
import { WebSocketService } from '../services/websocket.service';
import { WSMessage } from '../types/websocket.types';

interface UseWebSocketProps {
  url: string;
  onMessage: (message: WSMessage) => void;
  playerUuid: string;
  targetUuid?: string;
}

export const useWebSocket = ({
  url,
  onMessage,
  playerUuid,
  targetUuid
}: UseWebSocketProps) => {
  const wsRef = useRef<WebSocketService | null>(null);

  useEffect(() => {
    if (!playerUuid) return;

    const ws = new WebSocketService(url); // Передаем строку напрямую
    wsRef.current = ws;

    ws.onMessage(onMessage);
    ws.connect(playerUuid, targetUuid);

    return () => {
      ws.disconnect();
    };
  }, [url, playerUuid, targetUuid, onMessage]);

  const sendMessage = (message: WSMessage) => {
    wsRef.current?.send(message);
  };

  return { sendMessage };
};