import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const required = [
  'package.json',
  'README.md',
  'LICENSE',
  'CHANGELOG.md',
  'CONTRIBUTING.md',
  'SECURITY.md',
  'AGENTS.md',
  'src/index.js',
  'src/core/constants.js',
  'src/core/parser.js',
  'src/core/diagnostics.js',
  'src/runtime/scheduler.js',
  'src/runtime/styles.js',
  'src/runtime/init.js',
  'test/core.test.js',
  'scripts/validate-motion.js',
  'docs/feasibility-report.md',
  'docs/full-research-report.md',
  'docs/architecture.md',
  'docs/api.md',
  'docs/ai-agents.md',
  'docs/roadmap.md',
  'examples/basic.html',
  '.github/workflows/ci.yml',
]

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)))

if (missing.length > 0) {
  console.error(`Missing required project files: ${missing.join(', ')}`)
  process.exit(1)
}

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))

assertEqual(pkg.name, 'atomic-motion', 'package.json name must be atomic-motion')

for (const script of ['test', 'lint', 'validate:motion', 'check']) {
  if (!pkg.scripts?.[script]) {
    console.error(`package.json must define a ${script} script`)
    process.exit(1)
  }
}

if (!pkg.bin?.['atomic-motion-validate']) {
  console.error('package.json must expose the atomic-motion-validate bin')
  process.exit(1)
}

console.log('Project metadata looks valid.')

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    console.error(message)
    process.exit(1)
  }
}
