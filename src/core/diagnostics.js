import {
  MOTION_ATTRIBUTE_SET,
  NUMBER_ATTRIBUTES,
  SAFE_UTILITIES,
} from './constants.js'

export function validateMotionAttributes(attributes) {
  const diagnostics = []

  for (const [attribute, value] of Object.entries(attributes ?? {})) {
    if (!attribute.startsWith('data-am')) continue

    if (!MOTION_ATTRIBUTE_SET.has(attribute)) {
      diagnostics.push({
        code: 'unknown-attribute',
        attribute,
        value,
        message: `Unknown Atomic Motion attribute "${attribute}".`,
      })
      continue
    }

    if (attribute === 'data-am' && !SAFE_UTILITIES.has(value)) {
      diagnostics.push({
        code: 'unsafe-utility',
        attribute,
        value,
        message: `Unsafe Atomic Motion utility "${value}". Use transform/opacity-safe utilities only.`,
      })
    }

    if (NUMBER_ATTRIBUTES.has(attribute) && !Number.isFinite(Number(value))) {
      diagnostics.push({
        code: 'invalid-number',
        attribute,
        value,
        message: `${attribute} must be a finite number.`,
      })
    }
  }

  return diagnostics
}
