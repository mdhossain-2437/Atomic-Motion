import {
  ATTRIBUTE_TO_CONFIG_KEY,
  MOTION_ATTRIBUTES,
  NUMBER_ATTRIBUTES,
  SAFE_UTILITIES,
} from './constants.js'

export function parseMotionElement(element) {
  if (!element || typeof element.getAttribute !== 'function') {
    throw new TypeError('parseMotionElement expects a DOM-like element with getAttribute().')
  }

  const kind = element.getAttribute('data-am')
  const preset = element.getAttribute('data-am-preset')

  if (kind === null && preset === null) {
    return null
  }

  if (kind !== null && !SAFE_UTILITIES.has(kind)) {
    throw new Error(
      `Unsafe Atomic Motion utility "${kind}". Atomic Motion only animates transform and opacity by default.`
    )
  }

  const config = {}

  for (const attribute of MOTION_ATTRIBUTES) {
    const raw = element.getAttribute(attribute)
    if (raw === null) continue

    const key = ATTRIBUTE_TO_CONFIG_KEY[attribute]
    config[key] = NUMBER_ATTRIBUTES.has(attribute) ? Number(raw) : raw
  }

  return config
}
