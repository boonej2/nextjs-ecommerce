const fs = require('fs')
const path = require('path')

// Copy Prisma binaries to .next directory after build
const sourceDir = path.join(__dirname, '..', 'generated', 'prisma')
const targetDir = path.join(__dirname, '..', '.next', 'server', 'generated', 'prisma')

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true })
}

// Copy all .node files (query engines)
const files = fs.readdirSync(sourceDir)
files.forEach(file => {
  if (file.endsWith('.node')) {
    const sourceFile = path.join(sourceDir, file)
    const targetFile = path.join(targetDir, file)
    fs.copyFileSync(sourceFile, targetFile)
    console.log(`Copied ${file} to .next/server/generated/prisma/`)
  }
})

// Also copy the entire generated/prisma directory structure to .next
const copyRecursiveSync = (src, dest) => {
  const exists = fs.existsSync(src)
  const stats = exists && fs.statSync(src)
  const isDirectory = exists && stats.isDirectory()
  
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
    fs.copyFileSync(src, dest)
  }
}

const fullTargetDir = path.join(__dirname, '..', '.next', 'generated', 'prisma')
copyRecursiveSync(sourceDir, fullTargetDir)
console.log('Copied Prisma generated files to .next/generated/prisma/')

