const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const prismaDir = path.join(__dirname, '..', 'node_modules', '.prisma')
const clientDir = path.join(prismaDir, 'client')

// Always clean the .prisma/client directory to ensure fresh generation
// This is especially important on Vercel to ensure correct binary targets
if (fs.existsSync(clientDir)) {
  console.log('Cleaning existing .prisma/client directory...')
  try {
    fs.rmSync(clientDir, { recursive: true, force: true })
  } catch (error) {
    // If removal fails, try removing the parent directory
    if (fs.existsSync(prismaDir)) {
      fs.rmSync(prismaDir, { recursive: true, force: true })
    }
  }
}

// Run prisma generate
console.log('Generating Prisma Client...')
try {
  execSync('npx prisma generate', { 
    stdio: 'inherit', 
    cwd: path.join(__dirname, '..'),
    env: { ...process.env }
  })
  console.log('✓ Prisma Client generated successfully')
} catch (error) {
  console.error('✗ Failed to generate Prisma Client')
  console.error(error)
  process.exit(1)
}

