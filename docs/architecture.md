# Atomic Motion Architecture

Atomic Motion is designed as a small, framework-agnostic motion runtime with an AI-friendly public surface. The repository separates stable public contracts from runtime implementation details so the project can grow into optional packages without making the core heavy.

## Goals

- Provide a finite data-attribute grammar that AI agents can generate reliably.
- Keep default animation writes compositor-safe: `transform`, `opacity`, transition metadata, and CSS custom properties.
- Batch runtime writes through a central frame scheduler.
- Keep browser runtime, diagnostics, future MCP tooling, and future WebGL adapters cleanly separated.
- Keep the core dependency-free.

## Current module layout

```text
src/
  index.js                  Public exports
  core/
    constants.js            Attribute grammar, safe utilities, defaults
    parser.js               DOM attribute parser
    diagnostics.js          Attribute validator for humans/AI/CLI
  runtime/
    scheduler.js            Read/write frame scheduler and will-change lifecycle
    styles.js               Compositor-safe style writer and reduced-motion helper
    init.js                 DOM scanner, IntersectionObserver activation, destroy()
scripts/
  validate-package.js       Project metadata/files sanity check
  validate-motion.js        HTML/Markdown data-am-* validator CLI
test/
  core.test.js              Public behavior tests
examples/
  basic.html                Minimal browser example
```

## Public runtime flow

1. `initAtomicMotion(root, options)` scans for `[data-am], [data-am-preset]`.
2. `parseMotionElement(element)` turns attributes into a typed config object.
3. Runtime applies initial styles through `applyMotionStyles()`.
4. The scheduler temporarily applies `will-change: transform, opacity`.
5. View-triggered elements are observed with `IntersectionObserver`.
6. On intersection, the active-state write is queued through the scheduler.
7. After activation, the element is unobserved and temporary `will-change` is released.
8. `destroy()` disconnects observers and releases temporary style hints for SPA teardown.

## AI-native design decisions

The data-attribute grammar is intentionally finite. AI agents should mutate local markup, not generate imperative animation orchestration. The validator gives agents and CI a deterministic way to reject hallucinated attributes such as `data-am-top` or unsafe utilities such as `data-am="width"`.

## Performance constraints

Default runtime behavior must avoid layout-triggering animation. Do not introduce default utilities that animate:

- `width`
- `height`
- `top`, `right`, `bottom`, `left`
- `margin`, `padding`

If a future feature needs layout-affecting motion, it should be explicit, opt-in, documented as unsafe, and covered by tests.

## Extension roadmap

Future expansion should happen through optional modules/packages:

- `@atomic-motion/mcp`: MCP server, resources, tools, and prompts.
- `@atomic-motion/react`: React lifecycle adapter.
- `@atomic-motion/vue`: Vue directive/plugin adapter.
- `@atomic-motion/webgl`: DOM/WebGL binding primitives.
- `@atomic-motion/three`: Three.js adapter.

The core package should remain useful without any of these additions.
