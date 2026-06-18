const NUMBER_ATTRIBUTES = new Set(['data-am-distance', 'data-am-duration', 'data-am-stagger'])

const SAFE_UTILITIES = new Set([
  'fade',
  'reveal',
  'reveal-up',
  'reveal-down',
  'reveal-left',
  'reveal-right',
  'scale',
  'parallax',
  'text-split-reveal',
  'hero-cinematic',
])

export const MOTION_ATTRIBUTES = Object.freeze([
  'data-am',
  'data-am-trigger',
  'data-am-axis',
  'data-am-distance',
  'data-am-duration',
  'data-am-ease',
  'data-am-stagger',
  'data-am-webgl-bind',
  'data-am-scroll',
  'data-am-preset',
])

const ATTRIBUTE_TO_CONFIG_KEY = {
  'data-am': 'kind',
  'data-am-trigger': 'trigger',
  'data-am-axis': 'axis',
  'data-am-distance': 'distance',
  'data-am-duration': 'duration',
  'data-am-ease': 'ease',
  'data-am-stagger': 'stagger',
  'data-am-webgl-bind': 'webglBind',
  'data-am-scroll': 'scroll',
  'data-am-preset': 'preset',
}

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

export function createFrameScheduler(options = {}) {
  const autoStart = options.autoStart !== false
  const requestFrame = options.requestAnimationFrame ?? globalThis.requestAnimationFrame

  const readQueue = []
  const writeQueue = []
  let scheduled = false

  function schedule() {
    if (!autoStart || scheduled) return
    if (typeof requestFrame !== 'function') return

    scheduled = true
    requestFrame(() => flush())
  }

  function read(task) {
    assertTask(task)
    readQueue.push(task)
    schedule()
  }

  function write(task) {
    assertTask(task)
    writeQueue.push(task)
    schedule()
  }

  function flush() {
    scheduled = false

    const reads = readQueue.splice(0)
    const writes = writeQueue.splice(0)

    for (const task of reads) task()
    for (const task of writes) task()
  }

  function prepareElement(element, value = 'transform, opacity') {
    if (!element?.style?.setProperty) return
    element.style.setProperty('will-change', value)
  }

  function releaseElement(element) {
    write(() => {
      if (element?.style?.removeProperty) {
        element.style.removeProperty('will-change')
      }
    })
  }

  return {
    read,
    write,
    flush,
    prepareElement,
    releaseElement,
  }
}

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

export function initAtomicMotion(root = globalThis.document, options = {}) {
  if (!root || typeof root.querySelectorAll !== 'function') {
    return { elements: [], scheduler: createFrameScheduler(options) }
  }

  const scheduler = createFrameScheduler(options)
  const selector = '[data-am], [data-am-preset]'
  const elements = Array.from(root.querySelectorAll(selector))
    .map((element) => ({ element, config: parseMotionElement(element) }))
    .filter((entry) => entry.config !== null)

  for (const { element, config } of elements) {
    scheduler.prepareElement(element)
    applyMotionStyles(element, config, {
      reduceMotion: options.reduceMotion ?? shouldReduceMotion(options.window),
    })
  }

  return { elements, scheduler }
}

function assertTask(task) {
  if (typeof task !== 'function') {
    throw new TypeError('Frame scheduler tasks must be functions.')
  }
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
