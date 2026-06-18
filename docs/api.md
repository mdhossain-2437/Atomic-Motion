# Atomic Motion API Reference

## `initAtomicMotion(root, options)`

Scans a DOM root for Atomic Motion attributes and initializes the runtime.

```js
const runtime = initAtomicMotion(document, {
  view: {
    threshold: 0.1,
    rootMargin: '0px 0px -15% 0px',
  },
})

runtime.destroy()
```

Returns:

```js
{
  elements,   // Array<{ element, config }>
  scheduler,  // Frame scheduler
  destroy,    // Cleanup function
}
```

Options:

| Option | Type | Description |
| --- | --- | --- |
| `autoStart` | boolean | If false, queued scheduler work runs only when `scheduler.flush()` is called. Useful for tests. |
| `requestAnimationFrame` | function | Custom frame callback. Useful for tests or non-browser environments. |
| `IntersectionObserver` | class/function | Custom observer implementation. Useful for tests. |
| `reduceMotion` | boolean | Force reduced-motion behavior. |
| `window` | object | Window-like object for `matchMedia`. |
| `view.threshold` | number | Intersection threshold. Default: `0.1`. |
| `view.rootMargin` | string | Intersection root margin. Default: `0px 0px -15% 0px`. |

## `parseMotionElement(element)`

Parses a DOM-like element into a motion config.

```js
const config = parseMotionElement(element)
```

Returns `null` when the element has no `data-am` or `data-am-preset` attribute.

Throws if `data-am` is not a safe utility.

## `validateMotionAttributes(attributes)`

Validates an object of attributes without throwing.

```js
const diagnostics = validateMotionAttributes({
  'data-am': 'reveal-up',
  'data-am-duration': '900',
})
```

Diagnostic shape:

```js
{
  code: 'unknown-attribute' | 'unsafe-utility' | 'invalid-number',
  attribute: 'data-am-duration',
  value: 'slow',
  message: 'data-am-duration must be a finite number.',
}
```

## `createFrameScheduler(options)`

Creates a small read/write scheduler.

```js
const scheduler = createFrameScheduler()
scheduler.read(() => measure())
scheduler.write(() => mutate())
```

Methods:

| Method | Description |
| --- | --- |
| `read(task)` | Queue a read task. |
| `write(task)` | Queue a write task. |
| `flush()` | Run all queued reads before writes. |
| `prepareElement(element, value)` | Set temporary `will-change`. |
| `releaseElement(element)` | Queue removal of temporary `will-change`. |

## `applyMotionStyles(element, config, options)`

Writes initial or active compositor-safe styles.

```js
applyMotionStyles(element, config)
applyMotionStyles(element, config, { active: true })
applyMotionStyles(element, config, { reduceMotion: true })
```

## `shouldReduceMotion(windowLike)`

Returns whether `prefers-reduced-motion: reduce` is active.

## Constants

- `MOTION_ATTRIBUTES`
- `SAFE_UTILITIES`
- `NUMBER_ATTRIBUTES`
- `DEFAULT_VIEW_OPTIONS`
