import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const required = [
  'package.json',
  'README.md',
  'LICENSE',
  'src/index.js',
  'test/core.test.js',
]

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)))

if (missing.length > 0) {
  console.error(`Missing required project files: ${missing.join(', ')}`)
  process.exit(1)
}

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))

if (pkg.name !== 'atomic-motion') {
  console.error('package.json name must be atomic-motion')
  process.exit(1)
}

if (!pkg.scripts?.test) {
  console.error('package.json must define a test script')
  process.exit(1)
}

console.log('Project metadata looks valid.')
