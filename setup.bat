@echo off
echo.
echo ========================================
echo   Flight Finder - Setup
echo ========================================
echo.

echo [1/3] Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (echo ERROR in backend install & pause & exit /b 1)

echo.
echo [2/3] Installing frontend dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (echo ERROR in frontend install & pause & exit /b 1)

echo.
echo [3/3] Creating .env file...
cd ..\backend
if not exist .env (
  copy .env.example .env
  echo Created backend\.env - you can add your API key here later
) else (
  echo .env already exists, skipping
)

echo.
echo ========================================
echo   Setup complete!
echo.
echo   To run the app, open TWO terminal
echo   windows and run:
echo.
echo   Terminal 1 (backend):
echo     cd backend
echo     npm run dev
echo.
echo   Terminal 2 (frontend):
echo     cd frontend
echo     npm run dev
echo.
echo   Then open: http://localhost:5173
echo ========================================
echo.
pause
