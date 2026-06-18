export function shouldReduceMotion(win = globalThis.window) {
  if (!win || typeof win.matchMedia !== 'function') return false
  return win.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function applyMotionStyles(element, config, options = {}) {
  if (!element?.style?.setProperty) {
    throw new TypeError('applyMotionStyles expects a DOM-like element with style.setProperty().')
  }

  if (options.reduceMotion) {
    setStyles(element, {
      opacity: '1',
      transform: 'none',
      transition: 'none',
      '--am-state': 'reduced',
    })
    return element
  }

  const active = options.active === true
  const duration = Number.isFinite(config.duration) ? config.duration : 600
  const ease = config.ease ?? 'standard-out'
  const transition = `transform ${duration}ms var(--am-ease-${ease}), opacity ${duration}ms var(--am-ease-${ease})`
  const transform = active ? 'translate3d(0, 0, 0)' : initialTransform(config)

  setStyles(element, {
    opacity: active ? '1' : '0',
    transform,
    transition,
    '--am-state': active ? 'active' : 'idle',
  })

  return element
}

function initialTransform(config) {
  if (config.kind === 'fade') return 'translate3d(0, 0, 0)'

  const distance = Number.isFinite(config.distance) ? config.distance : 24
  const axis = config.axis ?? axisFromUtility(config.kind)

  if (axis === 'x') return `translate3d(${distance}px, 0, 0)`
  if (axis === '-x') return `translate3d(${-distance}px, 0, 0)`
  if (axis === '-y') return `translate3d(0, ${-distance}px, 0)`
  return `translate3d(0, ${distance}px, 0)`
}

function axisFromUtility(kind) {
  if (kind === 'reveal-left') return '-x'
  if (kind === 'reveal-right') return 'x'
  if (kind === 'reveal-up') return 'y'
  if (kind === 'reveal-down') return '-y'
  return 'y'
}

function setStyles(element, styles) {
  for (const [property, value] of Object.entries(styles)) {
    element.style.setProperty(property, value)
  }
}
