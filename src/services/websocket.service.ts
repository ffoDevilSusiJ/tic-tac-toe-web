import { io, Socket } from 'socket.io-client';
import { WSMessage } from '../types/websocket.types';

export class WebSocketService {
  private socket: Socket | null = null;
  private messageHandlers: ((msg: WSMessage) => void)[] = [];
  private url: string;
  private isConnecting: boolean = false;

  constructor(url: string) {
    this.url = url;
  }

  connect(playerUuid: string, targetUuid?: string): void {
    if (this.socket?.connected || this.isConnecting) {
      console.log('Already connected or connecting');
      return;
    }

    this.isConnecting = true;

    console.log('🔌 Connecting to WebSocket:', this.url);

    this.socket = io(this.url, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected:', this.socket?.id);
      this.isConnecting = false;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected:', reason);
      this.isConnecting = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error);
      this.isConnecting = false;
    });

    // Слушаем все типы сообщений
    this.socket.on('game_start', (data: WSMessage) => {
      console.log('📨 Received game_start:', data);
      this.notifyHandlers(data);
    });

    this.socket.on('player_move', (data: WSMessage) => {
      console.log('📨 Received player_move:', data);
      this.notifyHandlers(data);
    });

    this.socket.on('game_end', (data: WSMessage) => {
      console.log('📨 Received game_end:', data);
      this.notifyHandlers(data);
    });

    this.socket.on('round_start', (data: WSMessage) => {
      console.log('📨 Received round_start:', data);
      this.notifyHandlers(data);
    });

    this.socket.on('error', (data: WSMessage) => {
      console.error('📨 Received error:', data);
      this.notifyHandlers(data);
    });
  }

  send(message: WSMessage): void {
    if (!this.socket?.connected) {
      console.error('❌ WebSocket is not connected');
      return;
    }

    console.log('📤 Sending:', message.type, message);
    this.socket.emit(message.type, message);
  }

  onMessage(handler: (msg: WSMessage) => void): void {
    this.messageHandlers.push(handler);
  }

  private notifyHandlers(message: WSMessage): void {
    this.messageHandlers.forEach((handler) => handler(message));
  }

  disconnect(): void {
    if (this.socket) {
      console.log('🔌 Disconnecting WebSocket');
      this.socket.disconnect();
      this.socket = null;
    }
    this.messageHandlers = [];
    this.isConnecting = false;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}