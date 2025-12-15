@echo off
echo Creating project structure...

REM Create main directories
mkdir src\components 2>nul
mkdir src\services 2>nul
mkdir src\types 2>nul
mkdir src\hooks 2>nul
mkdir src\utils 2>nul
mkdir src\contexts 2>nul
mkdir src\styles 2>nul

REM Create component subdirectories
mkdir src\components\Menu 2>nul
mkdir src\components\Game 2>nul
mkdir src\components\WaitingModal 2>nul
mkdir src\components\GameBoard 2>nul
mkdir src\components\GameEndModal 2>nul

REM Create component files
echo. > src\components\Menu\Menu.tsx
echo. > src\components\Menu\Menu.module.css
echo. > src\components\Game\Game.tsx
echo. > src\components\Game\Game.module.css
echo. > src\components\WaitingModal\WaitingModal.tsx
echo. > src\components\WaitingModal\WaitingModal.module.css
echo. > src\components\GameBoard\GameBoard.tsx
echo. > src\components\GameBoard\GameBoard.module.css
echo. > src\components\GameEndModal\GameEndModal.tsx
echo. > src\components\GameEndModal\GameEndModal.module.css

REM Create service files
echo. > src\services\websocket.service.ts
echo. > src\services\game.service.ts

REM Create type files
echo. > src\types\game.types.ts
echo. > src\types\websocket.types.ts

REM Create hook files
echo. > src\hooks\useWebSocket.ts
echo. > src\hooks\useGameState.ts

REM Create utility files
echo. > src\utils\uuid.ts
echo. > src\utils\clipboard.ts
echo. > src\utils\gameLogic.ts

REM Create context files
echo. > src\contexts\GameContext.tsx

REM Create style files
echo. > src\styles\variables.css
echo. > src\styles\global.css

echo Project structure created successfully!
pause