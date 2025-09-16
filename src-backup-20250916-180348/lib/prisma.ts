import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Ensure PgBouncer-safe connection params are present to avoid prepared statement issues
function getPgBouncerSafeUrl(): string | undefined {
  const rawUrl = process.env.DATABASE_URL
  if (!rawUrl) return rawUrl

  try {
    const url = new URL(rawUrl)

    // Disable prepared statements via Prisma by signaling PgBouncer usage
    if (!url.searchParams.has('pgbouncer')) {
      url.searchParams.set('pgbouncer', 'true')
    }

    // Limit per-client connections when behind PgBouncer transaction pooling
    if (!url.searchParams.has('connection_limit')) {
      url.searchParams.set('connection_limit', '1')
    }

    // Always require SSL when connecting to managed Postgres like Supabase
    if (!url.searchParams.has('sslmode')) {
      url.searchParams.set('sslmode', 'require')
    }

    return url.toString()
  } catch {
    // If URL parsing fails, fallback to the raw value
    return rawUrl
  }
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  errorFormat: 'pretty',
  datasources: {
    db: {
      url: getPgBouncerSafeUrl()
    }
  }
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
