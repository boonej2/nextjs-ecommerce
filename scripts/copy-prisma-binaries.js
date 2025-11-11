const fs = require('fs')
const path = require('path')

const sourceDir = path.join(__dirname, '..', 'generated', 'prisma')
const nextDir = path.join(__dirname, '..', '.next')

if (!fs.existsSync(sourceDir)) {
  console.error('Source directory does not exist:', sourceDir)
  process.exit(1)
}

// Find all .node files (query engines)
const files = fs.readdirSync(sourceDir).filter(file => file.endsWith('.node'))

if (files.length === 0) {
  console.warn('No .node files found in', sourceDir)
  process.exit(0)
}

// Copy binaries to multiple locations where Prisma might look
const copyRecursiveSync = (src, dest) => {
  const exists = fs.existsSync(src)
  if (!exists) return
  
  const stats = fs.statSync(src)
  const isDirectory = stats.isDirectory()
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true })
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      )
    })
  } else {
    const destDir = path.dirname(dest)
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true })
    }
    fs.copyFileSync(src, dest)
  }
}

// 1. Copy entire generated/prisma to .next/generated/prisma
const targetDir1 = path.join(nextDir, 'generated', 'prisma')
copyRecursiveSync(sourceDir, targetDir1)
console.log('✓ Copied to .next/generated/prisma/')

// 2. Copy entire generated/prisma to .next/server/generated/prisma
const targetDir2 = path.join(nextDir, 'server', 'generated', 'prisma')
copyRecursiveSync(sourceDir, targetDir2)
console.log('✓ Copied to .next/server/generated/prisma/')

// 3. Copy binaries to each API route directory
const apiRoutesDir = path.join(nextDir, 'server', 'app', 'api')
if (fs.existsSync(apiRoutesDir)) {
  const copyToApiRoutes = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    entries.forEach(entry => {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        // Copy binaries to this directory
        files.forEach(file => {
          const sourceFile = path.join(sourceDir, file)
          const targetFile = path.join(fullPath, file)
          fs.copyFileSync(sourceFile, targetFile)
        })
        // Recursively process subdirectories
        copyToApiRoutes(fullPath)
      }
    })
  }
  copyToApiRoutes(apiRoutesDir)
  console.log('✓ Copied binaries to API route directories')
}

// 4. Copy binaries to .next/server root
files.forEach(file => {
  const sourceFile = path.join(sourceDir, file)
  const targetFile = path.join(nextDir, 'server', file)
  fs.copyFileSync(sourceFile, targetFile)
})
console.log('✓ Copied binaries to .next/server/')

console.log('Prisma binaries copied successfully!')

