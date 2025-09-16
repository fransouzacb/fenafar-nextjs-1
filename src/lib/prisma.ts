import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const DATABASE_URL = process.env.DATABASE_URL
const pgbouncerSafeUrl = DATABASE_URL 
  ? `${DATABASE_URL}${DATABASE_URL.includes('?') ? '&' : '?'}pgbouncer=true&connection_limit=1&sslmode=require` 
  : ''

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  errorFormat: 'pretty',
  datasources: {
    db: {
      url: pgbouncerSafeUrl,
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
