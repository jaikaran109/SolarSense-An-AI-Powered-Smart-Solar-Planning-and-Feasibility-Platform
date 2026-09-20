const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const solarRoutes = require('./routes/solar.routes');
const financialRoutes = require('./routes/financial.routes');
const reportRoutes = require('./routes/report.routes');
const installerRoutes = require('./routes/installer.routes');
const assistantRoutes = require('./routes/assistant.routes');
const authRoutes = require('./routes/auth.routes');
const { getDatabaseStatus } = require('./config/db');

const app = express();

// ==========================================
// 1. HTTP Security Headers (Helmet)
// ==========================================
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://api.mapbox.com', 'https://cdn.jsdelivr.net'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://api.mapbox.com', 'https://unpkg.com'],
        imgSrc: ["'self'", 'data:', 'blob:', 'https:', 'http:'],
        connectSrc: ["'self'", 'https:', 'http://localhost:5000', 'http://localhost:5173', 'https://generativelanguage.googleapis.com', 'https://api.mapbox.com', 'https://*.tile.openstreetmap.org'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"]
      }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

// ==========================================
// 2. Hardened CORS Configuration
// ==========================================
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim())
  : ['http://localhost:5173', 'http://localhost:5000', 'http://localhost:3000', 'http://127.0.0.1:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || allowedOrigins.includes('*') || origin.startsWith('http://localhost:')) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400
  })
);

// ==========================================
// 3. Rate Limiters (DDoS & Brute Force Defense)
// ==========================================
// Global API Limiter: 300 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP. Please try again in 15 minutes.' }
});
app.use('/api', globalLimiter);

// Auth Limiter: 20 login/register attempts per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Please try again after 15 minutes.' }
});
app.use('/api/auth', authLimiter);

// AI Assistant Limiter: 45 queries per 15 minutes to prevent API quota drain
const aiAssistantLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 45,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Solar AI Assistant query limit reached. Please wait a few minutes before asking more questions.' }
});
app.use('/api/assistant', aiAssistantLimiter);

// ==========================================
// 4. Body Parsing
// ==========================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check & System Info
app.get('/api/health', (req, res) => {
  const dbStatus = getDatabaseStatus();
  return res.json({
    status: 'online',
    service: 'SolarSense Hardened API Engine',
    version: '1.0.0',
    mode: 'consumption-first',
    database: dbStatus.mode,
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/solar', solarRoutes);
app.use('/api/financial', financialRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/installers', installerRoutes);
app.use('/api/assistant', assistantRoutes);
app.use('/api/auth', authRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found on SolarSense server.` });
});

// Global Secure Error Handler (masks sensitive traces in production)
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  const isProd = process.env.NODE_ENV === 'production';
  res.status(err.status || 500).json({
    error: isProd ? 'Internal server error occurred.' : (err.message || 'Internal server error')
  });
});

module.exports = app;
