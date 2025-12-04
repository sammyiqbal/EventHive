require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const prisma = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const API_BASE_URL = process.env.API_BASE_URL || `http://localhost:${PORT}`;

if (!JWT_SECRET) {
  console.warn('JWT_SECRET is not set. JWT generation will fail.');
}

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const generateToken = (userId) => {
  if (!JWT_SECRET) {
    throw new Error('JWT secret is not configured');
  }

  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  if (!JWT_SECRET) {
    return res.status(500).json({ message: 'JWT secret not configured' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Admin only middleware
const requireAdmin = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Error verifying admin status' });
  }
};

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'EventHive API Server',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        google: 'GET /api/auth/google',
        github: 'GET /api/auth/github'
      },
      events: {
        list: 'GET /api/events',
        get: 'GET /api/events/:id',
        create: 'POST /api/events (Admin)',
        update: 'PUT /api/events/:id (Admin)',
        delete: 'DELETE /api/events/:id (Admin)',
        save: 'POST /api/events/:id/save',
        register: 'POST /api/events/:id/register',
      },
      users: {
        me: 'GET /api/users/me',
        update: 'PUT /api/users/me',
        savedEvents: 'GET /api/users/:id/saved-events'
      },
      colleges: 'GET /api/colleges',
      categories: 'GET /api/categories',
      ai: {
        generateCaption: 'POST /api/ai/generate-caption (Admin)'
      }
    }
  });
});

// Test database connection
app.get('/health', async (req, res) => {
  try {
    await prisma.$connect();
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { email, password, name, role, collegeId } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (role && !['student', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Role must be either "student" or "admin"' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'student',
        collegeId: collegeId || null,
      },
      include: {
        college: true,
      },
    });

    const token = generateToken(user.id);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        collegeId: user.collegeId,
        college: user.college,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Failed to create user', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.id);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        collegeId: user.collegeId,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to login', error: error.message });
  }
});

// ==================== Event APIs ====================

// Get all events (public with filters)
app.get('/api/events', async (req, res) => {
  try {
    const { q, college, category, dateFrom, dateTo, savedByUser, createdBy, limit, offset } = req.query;
    
    const where = {};
    
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }
    
    if (college) {
      where.collegeId = parseInt(college);
    }
    
    if (category) {
      where.category = category;
    }
    
    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) {
        where.date.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.date.lte = new Date(dateTo);
      }
    }
    
    if (createdBy) {
      where.createdBy = parseInt(createdBy);
    }

    if (savedByUser) {
      const userId = parseInt(savedByUser);
      where.savedBy = {
        some: {
          userId: userId
        }
      };
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        college: {
          select: {
            id: true,
            name: true,
            city: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
      take: limit ? parseInt(limit) : undefined,
      skip: offset ? parseInt(offset) : undefined,
    });

    const total = await prisma.event.count({ where });

    res.json({
      total,
      events,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch events', error: error.message });
  }
});

// Get single event by ID (public)
app.get('/api/events/:id', async (req, res) => {
  try {
    // Validate that ID parameter exists
    if (!req.params.id || req.params.id.trim() === '') {
      return res.status(400).json({ 
        message: 'Event ID is required',
        error: 'Missing event ID parameter'
      });
    }

    // Validate ID is a number
    const eventId = parseInt(req.params.id);
    if (isNaN(eventId) || eventId <= 0) {
      return res.status(400).json({ 
        message: 'Invalid event ID. Event ID must be a positive number.',
        providedId: req.params.id
      });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        college: {
          select: {
            id: true,
            name: true,
            city: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch event', error: error.message });
  }
});

// Create event (Admin only)
app.post('/api/events', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, description, category, date, location, collegeName, collegeId, imageUrl, isPublic, tags } = req.body;

    if (!title || !description || !category || !date) {
      return res.status(400).json({ message: 'Title, description, category, and date are required' });
    }

    // Handle college - use collegeName if provided, otherwise use collegeId
    let finalCollegeId;
    if (collegeName) {
      // Find or create college by name
      let college = await prisma.college.findUnique({
        where: { name: collegeName.trim() }
      });
      
      if (!college) {
        // Create new college if it doesn't exist
        college = await prisma.college.create({
          data: { name: collegeName.trim() }
        });
      }
      finalCollegeId = college.id;
    } else if (collegeId) {
      finalCollegeId = parseInt(collegeId);
    } else {
      return res.status(400).json({ message: 'Either collegeName or collegeId is required' });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        category,
        date: new Date(date),
        location: location || null,
        imageUrl: imageUrl || null,
        collegeId: finalCollegeId,
        createdBy: req.userId,
        isPublic: isPublic !== undefined ? isPublic : true,
        tags: tags || [],
      },
      include: {
        college: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Failed to create event', error: error.message });
  }
});

// Update event (Admin only)
app.put('/api/events/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!existingEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (existingEvent.createdBy !== req.userId) {
      return res.status(403).json({ message: 'You can only edit your own events' });
    }

    const { title, description, category, date, location, collegeName, collegeId, imageUrl, isPublic, tags } = req.body;

    // Handle college update - use collegeName if provided, otherwise use collegeId
    let updateData = {
      ...(title && { title }),
      ...(description && { description }),
      ...(category && { category }),
      ...(date && { date: new Date(date) }),
      ...(location !== undefined && { location }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(isPublic !== undefined && { isPublic }),
      ...(tags !== undefined && { tags }),
    };

    if (collegeName) {
      // Find or create college by name
      let college = await prisma.college.findUnique({
        where: { name: collegeName.trim() }
      });
      
      if (!college) {
        // Create new college if it doesn't exist
        college = await prisma.college.create({
          data: { name: collegeName.trim() }
        });
      }
      updateData.collegeId = college.id;
    } else if (collegeId) {
      updateData.collegeId = parseInt(collegeId);
    }

    const event = await prisma.event.update({
      where: { id: eventId },
      data: updateData,
      include: {
        college: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update event', error: error.message });
  }
});

// Delete event (Admin only)
app.delete('/api/events/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!existingEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (existingEvent.createdBy !== req.userId) {
      return res.status(403).json({ message: 'You can only delete your own events' });
    }

    await prisma.event.delete({
      where: { id: eventId },
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete event', error: error.message });
  }
});

// Save event (Student only)
app.post('/api/events/:id/save', authenticateToken, async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const userId = req.userId;

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if already saved
    const existing = await prisma.savedEvent.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    if (existing) {
      return res.json({ success: true, message: 'Event already saved' });
    }

    await prisma.savedEvent.create({
      data: {
        userId,
        eventId,
      },
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save event', error: error.message });
  }
});

// Register for event (Student only)
app.post('/api/events/:id/register', authenticateToken, async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const userId = req.userId;

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if already registered
    const existing = await prisma.registration.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    if (existing) {
      return res.json({ 
        registrationId: existing.id, 
        status: existing.status,
        message: 'Already registered' 
      });
    }

    const registration = await prisma.registration.create({
      data: {
        userId,
        eventId,
        status: 'registered',
      },
    });

    res.json({ 
      registrationId: registration.id, 
      status: registration.status 
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to register for event', error: error.message });
  }
});

// ==================== User APIs ====================

// Get current user
app.get('/api/users/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: {
        college: true,
        savedEvents: {
          include: {
            event: true,
          },
        },
        registrations: {
          include: {
            event: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      collegeId: user.collegeId,
      college: user.college,
      savedEvents: user.savedEvents.map(se => se.eventId),
      registrations: user.registrations,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
});

// Update user profile
app.put('/api/users/me', authenticateToken, async (req, res) => {
  try {
    const { name, collegeId, password } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (collegeId) updateData.collegeId = parseInt(collegeId);
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: updateData,
      include: {
        college: true,
      },
    });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      collegeId: user.collegeId,
      college: user.college,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
});

// Get user's saved events
app.get('/api/users/:id/saved-events', authenticateToken, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    // Users can only see their own saved events
    if (userId !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const savedEvents = await prisma.savedEvent.findMany({
      where: { userId },
      include: {
        event: {
          include: {
            college: true,
            creator: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(savedEvents.map(se => se.event));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch saved events', error: error.message });
  }
});

// ==================== College APIs ====================

// Get all colleges
app.get('/api/colleges', async (req, res) => {
  try {
    const colleges = await prisma.college.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    res.json(colleges);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch colleges', error: error.message });
  }
});

// ==================== Category APIs ====================

// Get event categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = ['Tech', 'Cultural', 'Sports', 'Workshop', 'Competition', 'Seminar', 'Conference'];
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
  }
});

// ==================== AI APIs ====================

// Generate AI caption (Admin only)
app.post('/api/ai/generate-caption', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, category } = req.body;

    // Placeholder AI caption generation
    // In production, this would call an actual AI service
    const caption = `Join us for ${title}, a ${category} event. Don't miss out on this exciting opportunity to learn, network, and grow!`;

    res.json({ caption });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate caption', error: error.message });
  }
});

// OAuth Routes
// Google OAuth
app.get('/api/auth/google', (req, res) => {
  const redirectUri = `${API_BASE_URL}/api/auth/callback/google`;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  
  if (!clientId) {
    return res.status(500).json({ message: 'Google OAuth not configured' });
  }

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `response_type=code&` +
    `scope=openid email profile&` +
    `access_type=offline&` +
    `prompt=consent`;

  res.redirect(authUrl);
});

// GitHub OAuth
app.get('/api/auth/github', (req, res) => {
  const redirectUri = `${API_BASE_URL}/api/auth/callback/github`;
  const clientId = process.env.GITHUB_CLIENT_ID;
  
  if (!clientId) {
    return res.status(500).json({ message: 'GitHub OAuth not configured' });
  }

  const authUrl = `https://github.com/login/oauth/authorize?` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `scope=user:email`;

  res.redirect(authUrl);
});

// Google OAuth Callback
app.get('/api/auth/callback/google', async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
    }

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${API_BASE_URL}/api/auth/callback/google`,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokens.access_token) {
      return res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
    }

    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const googleUser = await userResponse.json();

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email: googleUser.email } });

    if (!user) {
      // For OAuth, default to student role - user can update later
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name || googleUser.email.split('@')[0],
          password: '', // OAuth users don't need password
          role: 'student',
        },
      });
    }

    const token = generateToken(user.id);

    // Redirect to frontend with token
    res.redirect(`${FRONTEND_URL}/api/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({ id: user.id, email: user.email, name: user.name, role: user.role }))}`);
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
  }
});

// GitHub OAuth Callback
app.get('/api/auth/callback/github', async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokens.access_token) {
      return res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
    }

    // Get user info from GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const githubUser = await userResponse.json();

    // Get user email (may need separate API call)
    let email = githubUser.email;
    if (!email) {
      const emailResponse = await fetch('https://api.github.com/user/emails', {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      const emails = await emailResponse.json();
      email = emails.find(e => e.primary)?.email || emails[0]?.email;
    }

    if (!email) {
      return res.redirect(`${FRONTEND_URL}/login?error=email_required`);
    }

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // For OAuth, default to student role - user can update later
      user = await prisma.user.create({
        data: {
          email,
          name: githubUser.name || githubUser.login || email.split('@')[0],
          password: '', // OAuth users don't need password
          role: 'student',
        },
      });
    }

    const token = generateToken(user.id);

    // Redirect to frontend with token
    res.redirect(`${FRONTEND_URL}/api/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({ id: user.id, email: user.email, name: user.name, role: user.role }))}`);
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

