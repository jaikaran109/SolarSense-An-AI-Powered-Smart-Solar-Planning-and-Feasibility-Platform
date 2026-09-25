const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

const solarRoutes = require('./routes/solar.routes');
const financialRoutes = require('./routes/financial.routes');
const reportRoutes = require('./routes/report.routes');
const installerRoutes = require('./routes/installer.routes');
const assistantRoutes = require('./routes/assistant.routes'); 
const { getDatabaseStatus } = require('./config/db');

const app = express();

// Render (and most PaaS proxies) forwards client IPs via X-Forwarded-For.
// express-rate-limit refuses to run behind a proxy unless this is set.
app.set('trust proxy', 1);

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
      // Allow requests with no origin (like mobile apps, curl, server-to-server, same-origin)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        allowedOrigins.includes('*') ||
        origin.startsWith('http://localhost:') ||
        origin.startsWith('http://127.0.0.1:') ||
        // On Render the frontend may live on *.onrender.com — reflect any https
        // origin when no explicit allowlist is configured (same as dev default).
        (process.env.ALLOWED_ORIGINS ? false : origin.startsWith('https://'))
      ) {
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

// ==========================================
// 5. Optional static frontend (single-service Render deploy)
// Serves client/dist when it exists (copied in at build time).
// API routes + /api/health above take precedence.
// ==========================================
const clientDistCandidates = [
  // Standard single-service layout: server/ and client/ are siblings
  path.join(__dirname, '..', '..', 'client', 'dist'),
  // Fallback if built files are copied into the server package
  path.join(__dirname, '..', 'public'),
];

const clientDistDir = clientDistCandidates.find(
  (dir) => fs.existsSync(dir) && fs.existsSync(path.join(dir, 'index.html'))
);

if (clientDistDir) {
  app.use(express.static(clientDistDir, { maxAge: '1d', index: false }));
  // SPA fallback — any non-/api GET serves index.html.
  // NOTE: plain middleware (no '*' route pattern) so this works on
  // Express 4 and Express 5 (path-to-regexp v8 rejects '*' strings).
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api')) return next();
    return res.sendFile(path.join(clientDistDir, 'index.html'));
  });
  console.log(`🖥️  Serving frontend static build from: ${clientDistDir}`);
}

// 404 Handler (API + unmatched routes when no static build is present)
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: `Route ${req.originalUrl} not found on SolarSense server.` });
  }
  if (clientDistDir) {
    return res.sendFile(path.join(clientDistDir, 'index.html'));
  }
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
