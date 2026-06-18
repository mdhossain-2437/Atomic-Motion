import { DEFAULT_VIEW_OPTIONS } from '../core/constants.js'
import { parseMotionElement } from '../core/parser.js'
import { createFrameScheduler } from './scheduler.js'
import { applyMotionStyles, shouldReduceMotion } from './styles.js'

export function initAtomicMotion(root = globalThis.document, options = {}) {
  const scheduler = createFrameScheduler(options)

  if (!root || typeof root.querySelectorAll !== 'function') {
    return { elements: [], scheduler, destroy: () => {} }
  }

  const selector = '[data-am], [data-am-preset]'
  const elements = Array.from(root.querySelectorAll(selector))
    .map((element) => ({ element, config: parseMotionElement(element) }))
    .filter((entry) => entry.config !== null)
  const reduceMotion = options.reduceMotion ?? shouldReduceMotion(options.window)
  const observers = []

  for (const { element, config } of elements) {
    scheduler.prepareElement(element)
    applyMotionStyles(element, config, { reduceMotion })
  }

  if (!reduceMotion) {
    setupViewObserver(elements, scheduler, options, observers)
  }

  function destroy() {
    for (const observer of observers) observer.disconnect()
    for (const { element } of elements) scheduler.releaseElement(element)
  }

  return { elements, scheduler, destroy }
}

function setupViewObserver(elements, scheduler, options, observers) {
  const ViewObserver = options.IntersectionObserver ?? globalThis.IntersectionObserver
  if (typeof ViewObserver !== 'function') return

  const viewEntries = elements.filter(({ config }) => (config.trigger ?? 'view') === 'view')
  if (viewEntries.length === 0) return

  const entryByElement = new Map(viewEntries.map((entry) => [entry.element, entry]))
  const observer = new ViewObserver((intersectionEntries) => {
    for (const intersectionEntry of intersectionEntries) {
      if (!intersectionEntry.isIntersecting) continue

      const motionEntry = entryByElement.get(intersectionEntry.target)
      if (!motionEntry) continue

      scheduler.write(() => {
        applyMotionStyles(motionEntry.element, motionEntry.config, { active: true })
        scheduler.releaseElement(motionEntry.element)
      })

      if (typeof observer.unobserve === 'function') {
        observer.unobserve(motionEntry.element)
      }
    }
  }, normalizeViewOptions(options.view))

  for (const { element } of viewEntries) observer.observe(element)
  observers.push(observer)
}

function normalizeViewOptions(view = {}) {
  return {
    threshold: view.threshold ?? DEFAULT_VIEW_OPTIONS.threshold,
    rootMargin: view.rootMargin ?? DEFAULT_VIEW_OPTIONS.rootMargin,
  }
}
