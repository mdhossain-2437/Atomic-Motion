export const NUMBER_ATTRIBUTES = new Set([
  'data-am-distance',
  'data-am-duration',
  'data-am-stagger',
])

export const SAFE_UTILITIES = new Set([
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

export const MOTION_ATTRIBUTE_SET = new Set(MOTION_ATTRIBUTES)

export const ATTRIBUTE_TO_CONFIG_KEY = Object.freeze({
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
})

export const DEFAULT_VIEW_OPTIONS = Object.freeze({
  threshold: 0.1,
  rootMargin: '0px 0px -15% 0px',
})
