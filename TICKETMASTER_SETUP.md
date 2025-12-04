# Ticketmaster API Setup Guide

## Option 1: Direct Ticketmaster API (Recommended)

### Step 1: Get Your API Key

1. Go to **https://developer.ticketmaster.com/**
2. Click **"Register"** to create a free account
3. Once registered, log in to access your dashboard
4. Create a new app to get your **API Key**
5. Copy your API key (looks like: `abc123...`)

### Step 2: Add to Backend

Edit `backend/.env` file and add:

```env
TICKETMASTER_API_KEY=your_api_key_here
TICKETMASTER_HOST=app.ticketmaster.com
```

### Step 3: Restart Backend

```bash
cd backend
npm run dev
```

---

## Option 2: Ticketmaster via RapidAPI

### Step 1: Get RapidAPI Key

1. Go to **https://rapidapi.com/**
2. Sign up or log in
3. Search for **"Ticketmaster Discovery API"** or **"Ticketmaster"**
4. Subscribe (free plan available)
5. Copy your RapidAPI key from Dashboard

### Step 2: Add to Backend

Edit `backend/.env` file:

```env
RAPIDAPI_KEY=your_rapidapi_key_here
USE_RAPIDAPI_TICKETMASTER=true
RAPIDAPI_TICKETMASTER_HOST=ticketmaster-discovery.p.rapidapi.com
```

### Step 3: Restart Backend

```bash
cd backend
npm run dev
```

---

## Test

1. Open http://localhost:3000/events
2. Enable "Show Local Events" checkbox
3. Enter City (e.g., "New York")
4. Enter State (e.g., "NY")
5. Click Search

**Done!** Ticketmaster events should now appear.

## API Documentation

- **Ticketmaster Developer Portal:** https://developer.ticketmaster.com/
- **Discovery API Docs:** https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/

