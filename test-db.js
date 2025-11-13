const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

async function testConnection() {
  try {
    console.log('🔄 Testing database connection...')
    
    // Test simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Database connection successful:', result)
    
    // Test count projects
    const projectCount = await prisma.project.count()
    console.log(`✅ Found ${projectCount} projects in database`)
    
    // Test count rooms
    const roomCount = await prisma.room.count()
    console.log(`✅ Found ${roomCount} rooms in database`)
    
  } catch (error) {
    console.error('❌ Database connection failed:', error)
  } finally {
    await prisma.$disconnect()
    console.log('🔌 Disconnected from database')
  }
}

testConnection()
