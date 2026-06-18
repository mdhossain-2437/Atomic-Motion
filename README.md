# Atomic Motion

AI-native, utility-first motion primitives for declarative web animation.

Atomic Motion turns high-quality motion into a constrained HTML attribute grammar that humans and AI agents can both use safely.

```html
<section
  data-am="reveal-up"
  data-am-trigger="view"
  data-am-distance="32"
  data-am-duration="900"
  data-am-ease="expo-out"
>
  <h1>AI-native motion for the web</h1>
</section>
```

## Why Atomic Motion

AI agents are good at editing markup, but unreliable when asked to generate lifecycle-sensitive animation code across selectors, refs, route transitions, cleanup hooks, and scroll-trigger state.

Atomic Motion makes motion a deterministic compile target:

- Declarative `data-am-*` attributes instead of imperative orchestration.
- A small dependency-free runtime.
- Central frame scheduler with read/write separation.
- Transform/opacity-first style writes.
- `IntersectionObserver` viewport activation.
- Reduced-motion support.
- Runtime cleanup via `destroy()`.
- Attribute diagnostics for humans, AI agents, and CI.

## Current status

This is an early MVP, but the repository is structured as a real open-source project.

Implemented:

- Finite public attribute grammar.
- DOM-like parser.
- Attribute diagnostics with `validateMotionAttributes()`.
- Read/write scheduler.
- Initial and active fade/reveal style writer.
- Viewport activation.
- Temporary `will-change` lifecycle management.
- Reduced-motion behavior.
- CLI validator for HTML/Markdown files.
- Documentation and example page.
- GitHub Actions CI.

Planned:

- Stagger support.
- Hover/focus/click triggers.
- TypeScript declarations.
- MCP server for AI agents.
- Framework adapters.
- Optional WebGL/Three.js layer.

## Install from source

```bash
git clone https://github.com/mdhossain-2437/Atomic-Motion.git
cd Atomic-Motion
npm test
npm run lint
npm run validate:motion
```

## Usage

```js
import { initAtomicMotion } from 'atomic-motion'

const runtime = initAtomicMotion(document, {
  view: {
    threshold: 0.1,
    rootMargin: '0px 0px -15% 0px',
  },
})

// Call during SPA route/component teardown.
runtime.destroy()
```

## Attribute grammar

| Attribute | Purpose |
| --- | --- |
| `data-am` | Motion utility name, for example `reveal`, `fade`, `reveal-up`, `reveal-left` |
| `data-am-trigger` | Trigger strategy. Current runtime supports `view`. |
| `data-am-axis` | Axis for transform movement: `x`, `y`, `-x`, or `-y`. |
| `data-am-distance` | Numeric transform distance in pixels. |
| `data-am-duration` | Numeric duration in milliseconds. |
| `data-am-ease` | Named easing token resolved through CSS variables. |
| `data-am-stagger` | Reserved for stagger delay in milliseconds. |
| `data-am-webgl-bind` | Reserved for future DOM/WebGL binding id. |
| `data-am-scroll` | Reserved for future scroll synchronization mode. |
| `data-am-preset` | Reserved for named higher-level presets. |

## CLI validation

Scan files for unsafe or hallucinated Atomic Motion attributes:

```bash
node scripts/validate-motion.js README.md examples/basic.html
npm run validate:motion
```

The validator reports:

- unknown `data-am-*` attributes
- unsafe utilities such as `data-am="width"`
- invalid numeric values such as `data-am-duration="slow"`

## Documentation

- docs/architecture.md
- docs/api.md
- docs/ai-agents.md
- docs/roadmap.md
- examples/basic.html

## Development

```bash
npm test
npm run lint
npm run validate:motion
```

## Performance principles

Atomic Motion should:

- Prefer `transform` and `opacity`.
- Avoid animating `width`, `height`, `top`, `left`, `margin`, and `padding` by default.
- Batch layout reads before style writes.
- Respect `prefers-reduced-motion`.
- Clean up observers, animation handles, and GPU hints.
- Keep WebGL support optional and progressively enhanced.

## License

MIT
