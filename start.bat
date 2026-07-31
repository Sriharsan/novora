@echo off
REM ============================================================
REM  Novora — launch backend + frontend (Windows)
REM  Opens two windows: the API (port 4000) and the web app (5173).
REM ============================================================
echo Starting Novora backend and frontend...
start "Novora API"  cmd /k "cd /d %~dp0server && npm start"
timeout /t 3 /nobreak >nul
start "Novora Web"  cmd /k "cd /d %~dp0 && npm run dev"
echo.
echo Backend:  http://localhost:4000
echo Frontend: http://localhost:5173  (opens automatically)
echo Close the two opened windows to stop Novora.
