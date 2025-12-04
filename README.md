# EventHive - Event Management Platform

A full-stack event management platform built with Next.js and Express.

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js (v16+)
- PostgreSQL database
- npm or yarn

### Quick Setup

1. **Clone and install:**
   ```bash
   npm run install:all
   ```

2. **Set up environment:**
   - Create `backend/.env` with your database URL and API keys (see below)

3. **Set up database:**
   ```bash
   cd backend
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Start the app:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

📖 **For detailed setup, see below**

## Setup (Detailed)

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

   Or install individually:
   ```bash
   # Root dependencies
   npm install
   
   # Backend dependencies
   cd backend && npm install
   
   # Frontend dependencies
   cd ../frontend && npm install
   ```

2. **Set up environment variables:**

   Create a `.env` file in the `backend` directory:
   ```env
   DATABASE_URL="your_postgresql_connection_string"
   JWT_SECRET="your_jwt_secret_key"
   PORT=3001
   FRONTEND_URL="http://localhost:3000"
   API_BASE_URL="http://localhost:3001"
   ```

   Create a `.env.local` file in the `frontend` directory (optional):
   ```env
   NEXT_PUBLIC_API_BASE_URL=""
   NEXT_PUBLIC_BACKEND_URL="http://localhost:3001"
   ```

3. **Set up the database:**
   ```bash
   cd backend
   npx prisma generate
   npx prisma migrate dev
   ```

## Running the Application

### Run both frontend and backend together:

From the root directory:
```bash
npm run dev
```

This will start:
- **Frontend** on `http://localhost:3000`
- **Backend** on `http://localhost:3001`

### Run services individually:

**Frontend only:**
```bash
cd frontend
npm run dev
```

**Backend only:**
```bash
cd backend
npm run dev
```

## Port Configuration

- **Frontend (Next.js)**: Port 3000
- **Backend (Express)**: Port 3001

The frontend is configured to proxy API requests to the backend, so most API calls can be made through `http://localhost:3000/api/*` which will be forwarded to the backend automatically.

## Project Structure

```
AP_eventHive/
├── backend/          # Express.js API server
│   ├── prisma/      # Prisma schema and migrations
│   └── index.js     # Main server file
├── frontend/        # Next.js frontend application
│   ├── app/         # Next.js app directory
│   ├── components/  # React components
│   └── lib/         # Utility functions
└── package.json     # Root package.json with scripts
```

## Available Scripts

### Root Level:
- `npm run dev` - Run both frontend and backend in development mode
- `npm run start` - Run both frontend and backend in production mode
- `npm run install:all` - Install dependencies for all packages

### Backend:
- `npm run dev` - Start backend with nodemon (auto-reload)
- `npm start` - Start backend in production mode

### Frontend:
- `npm run dev` - Start Next.js development server on port 3000
- `npm run build` - Build for production
- `npm start` - Start production server on port 3000

## Features

- User authentication (JWT-based)
- OAuth integration (Google, GitHub)
- Event management
- College-based event filtering
- Event registration and saving
  (External local events via Ticketmaster/RapidAPI have been removed and are no longer used.)
- Admin dashboard
- Responsive UI with Tailwind CSS


