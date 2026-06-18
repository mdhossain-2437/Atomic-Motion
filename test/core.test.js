import assert from 'node:assert/strict'
import test from 'node:test'

import {
  MOTION_ATTRIBUTES,
  createFrameScheduler,
  parseMotionElement,
  shouldReduceMotion,
} from '../src/index.js'

function fakeElement(attributes = {}) {
  return {
    style: {
      values: {},
      setProperty(name, value) {
        this.values[name] = value
      },
      removeProperty(name) {
        delete this.values[name]
      },
    },
    getAttribute(name) {
      return Object.prototype.hasOwnProperty.call(attributes, name) ? attributes[name] : null
    },
    hasAttribute(name) {
      return Object.prototype.hasOwnProperty.call(attributes, name)
    },
  }
}

test('parseMotionElement reads typed atomic motion attributes from an element', () => {
  const element = fakeElement({
    'data-am': 'reveal',
    'data-am-trigger': 'view',
    'data-am-axis': 'y',
    'data-am-distance': '32',
    'data-am-duration': '900',
    'data-am-ease': 'expo-out',
    'data-am-stagger': '80',
    'data-am-webgl-bind': 'hero-orb',
  })

  assert.deepEqual(parseMotionElement(element), {
    kind: 'reveal',
    trigger: 'view',
    axis: 'y',
    distance: 32,
    duration: 900,
    ease: 'expo-out',
    stagger: 80,
    webglBind: 'hero-orb',
  })
})

test('parseMotionElement returns null when no atomic motion attribute is present', () => {
  assert.equal(parseMotionElement(fakeElement({ class: 'hero' })), null)
})

test('parseMotionElement rejects unsafe layout animation utilities by default', () => {
  assert.throws(
    () => parseMotionElement(fakeElement({ 'data-am': 'width' })),
    /Unsafe Atomic Motion utility/
  )
})

test('createFrameScheduler runs every read before any write', () => {
  const calls = []
  const scheduler = createFrameScheduler({ autoStart: false })

  scheduler.read(() => calls.push('read:bounds'))
  scheduler.write(() => calls.push('write:transform'))
  scheduler.read(() => calls.push('read:scroll'))
  scheduler.write(() => calls.push('write:opacity'))

  scheduler.flush()

  assert.deepEqual(calls, ['read:bounds', 'read:scroll', 'write:transform', 'write:opacity'])
})

test('createFrameScheduler applies and clears temporary will-change hints', () => {
  const element = fakeElement()
  const scheduler = createFrameScheduler({ autoStart: false })

  scheduler.prepareElement(element, 'transform, opacity')
  assert.equal(element.style.values['will-change'], 'transform, opacity')

  scheduler.releaseElement(element)
  scheduler.flush()

  assert.equal(element.style.values['will-change'], undefined)
})

test('shouldReduceMotion follows matchMedia prefers-reduced-motion result', () => {
  const win = {
    matchMedia(query) {
      assert.equal(query, '(prefers-reduced-motion: reduce)')
      return { matches: true }
    },
  }

  assert.equal(shouldReduceMotion(win), true)
})

test('MOTION_ATTRIBUTES exposes the finite public attribute grammar', () => {
  assert.deepEqual(MOTION_ATTRIBUTES.slice(0, 4), [
    'data-am',
    'data-am-trigger',
    'data-am-axis',
    'data-am-distance',
  ])
})
