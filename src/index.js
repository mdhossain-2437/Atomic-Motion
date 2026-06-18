export {
  ATTRIBUTE_TO_CONFIG_KEY,
  DEFAULT_VIEW_OPTIONS,
  MOTION_ATTRIBUTES,
  MOTION_ATTRIBUTE_SET,
  NUMBER_ATTRIBUTES,
  SAFE_UTILITIES,
} from './core/constants.js'
export { parseMotionElement } from './core/parser.js'
export { validateMotionAttributes } from './core/diagnostics.js'
export { createFrameScheduler } from './runtime/scheduler.js'
export { applyMotionStyles, shouldReduceMotion } from './runtime/styles.js'
export { initAtomicMotion } from './runtime/init.js'
