const { env, validateEnv, connectDatabase, disconnectDatabase } = require('./config');
const logger = require('./utils/logger');
const app = require('./app');

let server;

async function start() {
  validateEnv();
  await connectDatabase();

  server = app.listen(env.PORT, () => {
    logger.info(`Server running on http://localhost:${env.PORT} [${env.NODE_ENV}]`);
  });
}

async function shutdown(signal) {
  logger.info(`${signal} received, starting graceful shutdown...`);

  // Stop accepting new connections
  if (server) {
    server.close(() => {
      logger.info('HTTP server closed');
    });
  }

  try {
    // Close database connection
    await disconnectDatabase();
    logger.info('Database connection closed');
    process.exit(0);
  } catch (err) {
    logger.error('Error during shutdown', { error: err.message });
    process.exit(1);
  }
}

// Handle termination signals
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Handle uncaught errors
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', { error: err.message, stack: err.stack });
  shutdown('uncaughtException');
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Promise Rejection', { reason });
  shutdown('unhandledRejection');
});

start().catch((err) => {
  logger.error('Failed to start server', { error: err.message });
  process.exit(1);
});
