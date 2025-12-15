# TIC-TAC-TOE Frontend

Онлайн-игра в крестики-нолики с WebSocket для игры вдвоём.

Фронтенд реализация проекта tic-tac-toe <br>

- Работает на основе WebSocket-сервера [Tic-Tac-Toe Backend](https://github.com/ffoDevilSusiJ/tic-tac-toe-backend.git)
- Реализовано быстрое создание комнаты и присоеденение по временной ссылке к игровой комнате

## Быстрый запуск

```bash
# 1. Клонируем репозиторий

git clone https://github.com/ffoDevilSusiJ/tic-tac-toe-web.git
cd tic-tac-toe-frontend

# 2. Создаем сеть
docker create network tictactoe-network

# 3. Запускаем
docker compose up -d

```

Приложение будет доступно на localhost:80

## 📁 Структура проекта
```
src/
├── components/
│   ├── Game/
│   │   ├── Game.tsx
│   │   └── Game.module.css
│   ├── Menu/
│   │   ├── Menu.tsx
│   │   └── Menu.module.css
│   ├── GameBoard/
│   │   ├── GameBoard.tsx
│   │   └── GameBoard.module.css
│   ├── WaitingModal/
│   │   ├── WaitingModal.tsx
│   │   └── WaitingModal.module.css
│   └── GameEndModal/
│       ├── GameEndModal.tsx
│       └── GameEndModal.module.css
├── contexts/
│   └── GameContext.tsx
├── hooks/
│   ├── useGameState.ts
│   └── useWebSocket.ts
├── services/
│   ├── game.service.ts
│   └── websocket.service.ts
├── types/
│   ├── game.types.ts
│   └── websocket.types.ts
├── utils/
│   ├── clipboard.ts
│   ├── gameLogic.ts
│   └── uuid.ts
├── styles/
│   ├── global.css
│   └── variables.css
├── App.tsx
└── index.tsx
```


## TODO

- Чат комнаты