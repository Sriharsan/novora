@echo off
REM ============================================================
REM  Novora — one-time setup (Windows)
REM  Requires: Node.js 18+ and PostgreSQL running locally.
REM  Edit server\.env if your Postgres user/password differ.
REM ============================================================
echo.
echo === Novora setup ===
echo.

echo [1/3] Installing frontend dependencies...
call npm install || goto :err

echo.
echo [2/3] Installing backend dependencies...
pushd server
call npm install || goto :err

echo.
echo [3/3] Creating database + tables + demo data...
call npm run setup || goto :err
popd

echo.
echo ============================================================
echo  Setup complete!  Now run  start.bat  to launch Novora.
echo ============================================================
pause
exit /b 0

:err
echo.
echo *** Setup failed. Check that PostgreSQL is running and
echo *** server\.env has the correct DATABASE_URL, then retry.
pause
exit /b 1
