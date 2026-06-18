#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { validateMotionAttributes } from '../src/index.js'

const files = process.argv.slice(2)

if (files.length === 0) {
  console.error('Usage: node scripts/validate-motion.js <file...>')
  process.exit(2)
}

let totalDiagnostics = 0

for (const file of files) {
  const absolutePath = path.resolve(process.cwd(), file)
  const source = fs.readFileSync(absolutePath, 'utf8')
  const blocks = extractMotionAttributeBlocks(source)

  for (const block of blocks) {
    const diagnostics = validateMotionAttributes(block.attributes)
    totalDiagnostics += diagnostics.length

    for (const diagnostic of diagnostics) {
      console.error(
        `${file}:${block.line}: ${diagnostic.code}: ${diagnostic.message}`
      )
    }
  }
}

if (totalDiagnostics > 0) {
  process.exit(1)
}

console.log(`Atomic Motion validation passed for ${files.length} file(s).`)

export function extractMotionAttributeBlocks(source) {
  const tagPattern = /<[^>]*\sdata-am(?:[\s=>-])[^>]*>/g
  const attrPattern = /\b(data-am(?:-[\w-]+)?)\s*=\s*(?:"([^"]*)"|'([^']*)')/g
  const blocks = []

  for (const match of source.matchAll(tagPattern)) {
    const tag = match[0]
    const attributes = {}

    for (const attrMatch of tag.matchAll(attrPattern)) {
      attributes[attrMatch[1]] = attrMatch[2] ?? attrMatch[3] ?? ''
    }

    blocks.push({
      line: lineNumberAt(source, match.index ?? 0),
      attributes,
    })
  }

  return blocks
}

function lineNumberAt(source, index) {
  return source.slice(0, index).split('\n').length
}
