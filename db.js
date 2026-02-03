require('dotenv/config')
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3')
const { PrismaClient } = require('./generated/prisma')

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db', // or your actual DB file
})

const prisma = new PrismaClient({ adapter })

module.exports = { prisma }