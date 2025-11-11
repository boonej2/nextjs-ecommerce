const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const prismaDir = path.join(__dirname, '..', 'node_modules', '.prisma')

// Clean the .prisma directory if it exists
if (fs.existsSync(prismaDir)) {
  console.log('Cleaning existing .prisma directory...')
  fs.rmSync(prismaDir, { recursive: true, force: true })
}

// Run prisma generate
console.log('Generating Prisma Client...')
try {
  execSync('npx prisma generate', { stdio: 'inherit', cwd: path.join(__dirname, '..') })
  console.log('✓ Prisma Client generated successfully')
} catch (error) {
  console.error('✗ Failed to generate Prisma Client')
  process.exit(1)
}

