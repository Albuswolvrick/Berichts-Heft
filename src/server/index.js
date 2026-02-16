const { env, validateEnv, connectDatabase } = require('./config');
const logger = require('./utils/logger');
const app = require('./app');

async function start() {
  validateEnv();
  await connectDatabase();

  app.listen(env.PORT, () => {
    logger.info(`Server running on http://localhost:${env.PORT} [${env.NODE_ENV}]`);
  });
}

start().catch((err) => {
  logger.error('Failed to start server', { error: err.message });
  process.exit(1);
});
