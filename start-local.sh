#!/bin/bash

# EventHive Local Startup Script
# This script helps you start the application locally

echo "🚀 EventHive Local Setup"
echo "========================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Check if .env exists in backend
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Backend .env file not found!"
    echo "📝 Creating .env file from template..."
    
    cat > backend/.env << EOF
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/eventhive?schema=public"

# Server Configuration
PORT=3001
FRONTEND_URL="http://localhost:3000"
API_BASE_URL="http://localhost:3001"

# JWT Configuration
JWT_SECRET="$(openssl rand -base64 32)"

# Environment
NODE_ENV="development"
EOF
    
    echo "✅ Created backend/.env file"
    echo "⚠️  IMPORTANT: Please edit backend/.env and set your DATABASE_URL!"
    echo ""
fi

# Check if dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

if [ ! -d "node_modules" ]; then
    echo "📦 Installing root dependencies..."
    npm install
fi

echo ""
echo "✅ All dependencies installed"
echo ""

# Check if Prisma client is generated
if [ ! -d "backend/node_modules/.prisma" ]; then
    echo "🔧 Generating Prisma Client..."
    cd backend
    npx prisma generate
    cd ..
    echo "✅ Prisma Client generated"
    echo ""
fi

echo "🎯 Starting servers..."
echo ""
echo "📍 Backend will run on: http://localhost:3001"
echo "📍 Frontend will run on: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Start both servers
npm run dev

