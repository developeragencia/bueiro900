const { PrismaClient } = require('@prisma/client/edge')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

module.exports = prisma 