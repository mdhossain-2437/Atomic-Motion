# Atomic Motion

Atomic Motion is an open-source experiment in AI-native, utility-first motion for the web.

The project goal is to make high-quality web animation easier for both humans and AI coding agents by replacing scattered imperative animation code with a small declarative grammar based on HTML data attributes.

Instead of asking an AI agent to write lifecycle-sensitive animation code, Atomic Motion gives the agent a finite set of safe attributes to attach directly to the target DOM node.

```html
<section
  data-am="reveal"
  data-am-trigger="view"
  data-am-axis="y"
  data-am-distance="32"
  data-am-duration="900"
  data-am-ease="expo-out"
  data-am-stagger="80"
>
  <h1>AI-native motion for the web</h1>
</section>
```

## Why this exists

Modern AI agents are good at editing markup, but they often struggle with imperative animation code that requires selectors, refs, component lifecycle cleanup, scroll-trigger disposal, and cross-file state management.

Atomic Motion treats animation as a constrained compile target:

- Declarative data attributes instead of imperative orchestration.
- A centralized frame scheduler for read/write batching.
- Transform and opacity first, avoiding layout-triggering properties by default.
- Temporary `will-change` management to avoid long-lived GPU memory bloat.
- Future MCP resources, tools, and prompts for agent-safe design-to-code workflows.
- Future WebGL/Three.js adapters for DOM-to-3D synchronization.

## Current status

This repository is in early setup/MVP stage.

Implemented now:

- Public data-attribute grammar.
- DOM-like element parser.
- Safe utility validation.
- Central frame scheduler with read-before-write ordering.
- Temporary `will-change` helper.
- `prefers-reduced-motion` helper.
- Node test suite using the built-in `node:test` runner.

Planned next:

- Browser runtime that applies reveal, fade, parallax, and stagger presets.
- CLI validator for unsafe motion attributes.
- MCP server exposing utilities, examples, prompts, and AST-safe mutation tools.
- React/Vue/Svelte/Astro adapters.
- Optional WebGL/Three.js synchronization package.

## Install from source

```bash
git clone https://github.com/mdhossain-2437/Atomic-Motion.git
cd Atomic-Motion
npm test
npm run lint
```

## API preview

```js
import {
  createFrameScheduler,
  initAtomicMotion,
  parseMotionElement,
  shouldReduceMotion,
} from 'atomic-motion'

const { elements, scheduler } = initAtomicMotion(document)
```

## Attribute grammar preview

| Attribute | Purpose |
| --- | --- |
| `data-am` | Motion utility name, for example `reveal`, `fade`, `parallax` |
| `data-am-trigger` | Trigger strategy, for example `view`, `scroll`, `hover` |
| `data-am-axis` | Axis for transform-based movement: `x` or `y` |
| `data-am-distance` | Numeric transform distance |
| `data-am-duration` | Numeric duration in milliseconds |
| `data-am-ease` | Named easing token |
| `data-am-stagger` | Numeric stagger delay in milliseconds |
| `data-am-webgl-bind` | Future WebGL/DOM binding id |
| `data-am-scroll` | Future scroll synchronization mode |
| `data-am-preset` | Named higher-level preset |

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
