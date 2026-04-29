const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const { PrismaClient } = require('../../../generated/prisma');
const { env } = require('./env');
const logger = require('../utils/logger');
const { PrismaPg } = require('@prisma/adapter-pg');

//const adapter = new PrismaBetterSqlite3({ url: env.DATABASE_URL });
const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

/**
 * Connects to the database and logs the result.
 */
async function connectDatabase() {
  try {
    await prisma.$connect();
    logger.info('Prisma connected successfully');
  } catch (err) {
    logger.error('Prisma connection failed', { error: err.message });
    process.exit(1);
  }
}

/**
 * Disconnects from the database gracefully.
 */
async function disconnectDatabase() {
  await prisma.$disconnect();
  logger.info('Prisma disconnected');
}

module.exports = { prisma, connectDatabase, disconnectDatabase };
