const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { env } = require('./config');
const { createSessionMiddleware } = require('./config');
const { requestLogger, errorHandler } = require('./middleware');
const apiRoutes = require('./routes');

const app = express();

// Security headers
app.use(helmet({ contentSecurityPolicy: false }));

// CORS
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(requestLogger);

// Static files
const rootDir = path.resolve(__dirname, '..', '..');
app.use(express.static(path.join(rootDir, 'public')));
app.use(express.static(path.join(rootDir, 'dist')));

// Session
app.use(createSessionMiddleware());

// API routes
app.use('/api', apiRoutes);

// SPA fallback: serve React app for all non-API GET requests
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(rootDir, 'dist', 'index.html'));
});

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;
