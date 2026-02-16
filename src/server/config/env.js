require('dotenv').config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 3000,
  DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
  SESSION_SECRET: process.env.SESSION_SECRET,
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10,
};

/**
 * Validates that all required environment variables are set.
 * Exits the process if any are missing.
 */
function validateEnv() {
  const required = ['SESSION_SECRET'];
  const missing = required.filter((key) => !env[key]);

  if (missing.length > 0) {
    console.error(`✗ Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
}

module.exports = { env, validateEnv };
