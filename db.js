require('dotenv/config')
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3')
const { PrismaClient } = require('./generated/prisma')

const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db'

const adapter = new PrismaBetterSqlite3({
  url: databaseUrl,
})

const prisma = new PrismaClient({ adapter })

module.exports = { prisma }
