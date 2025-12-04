@echo off
REM EventHive Local Startup Script for Windows
REM This script helps you start the application locally

echo.
echo ========================================
echo   EventHive Local Setup
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js v16 or higher.
    pause
    exit /b 1
)

echo [OK] Node.js found
node --version
echo.

REM Check if .env exists in backend
if not exist "backend\.env" (
    echo [WARNING] Backend .env file not found!
    echo [INFO] Creating .env file from template...
    echo.
    
    (
        echo # Database Configuration
        echo DATABASE_URL="postgresql://username:password@localhost:5432/eventhive?schema=public"
        echo.
        echo # Server Configuration
        echo PORT=3001
        echo FRONTEND_URL="http://localhost:3000"
        echo API_BASE_URL="http://localhost:3001"
        echo.
        echo # JWT Configuration
        echo JWT_SECRET="change-this-to-a-random-secret-key"
        echo.
        echo # Environment
        echo NODE_ENV="development"
    ) > backend\.env
    
    echo [OK] Created backend\.env file
    echo [WARNING] IMPORTANT: Please edit backend\.env and set your DATABASE_URL!
    echo.
)

REM Check if dependencies are installed
if not exist "backend\node_modules" (
    echo [INFO] Installing backend dependencies...
    cd backend
    call npm install
    cd ..
)

if not exist "frontend\node_modules" (
    echo [INFO] Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

if not exist "node_modules" (
    echo [INFO] Installing root dependencies...
    call npm install
)

echo.
echo [OK] All dependencies installed
echo.

REM Check if Prisma client is generated
if not exist "backend\node_modules\.prisma" (
    echo [INFO] Generating Prisma Client...
    cd backend
    call npx prisma generate
    cd ..
    echo [OK] Prisma Client generated
    echo.
)

echo ========================================
echo   Starting servers...
echo ========================================
echo.
echo Backend will run on: http://localhost:3001
echo Frontend will run on: http://localhost:3000
echo.
echo Press Ctrl+C to stop both servers
echo.

REM Start both servers
call npm run dev

pause

