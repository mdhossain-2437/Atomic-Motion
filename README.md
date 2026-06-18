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
- Runtime style application for fade/reveal initial and active states.
- Viewport activation through `IntersectionObserver`.
- Runtime `destroy()` cleanup for observers and temporary `will-change` hints.
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
  applyMotionStyles,
  createFrameScheduler,
  initAtomicMotion,
  parseMotionElement,
  shouldReduceMotion,
} from 'atomic-motion'

const { elements, scheduler, destroy } = initAtomicMotion(document, {
  view: {
    threshold: 0.1,
    rootMargin: '0px 0px -15% 0px',
  },
})

// Call during SPA route/component teardown.
destroy()
```

## Viewport activation

Elements using `data-am-trigger="view"` are observed with `IntersectionObserver`. When an element intersects, Atomic Motion queues the active-state write through the central scheduler:

```html
<h2 data-am="reveal" data-am-trigger="view" data-am-distance="24">
  Scroll-safe reveal
</h2>
```

Activation writes:

```css
opacity: 1;
transform: translate3d(0, 0, 0);
--am-state: active;
```

After activation, Atomic Motion unobserves the element and schedules removal of the temporary `will-change` hint. Call `destroy()` when tearing down a route or component tree to disconnect observers and release temporary style hints.

## Runtime style behavior

`initAtomicMotion(document)` scans for `[data-am]` and `[data-am-preset]`, parses each element, applies temporary `will-change`, and writes the initial compositor-safe styles.

For a reveal utility:

```html
<h1 data-am="reveal-left" data-am-distance="32" data-am-duration="700">
  Cinematic typography
</h1>
```

Atomic Motion applies initial styles equivalent to:

```css
opacity: 0;
transform: translate3d(-32px, 0, 0);
transition: transform 700ms var(--am-ease-standard-out), opacity 700ms var(--am-ease-standard-out);
```

When activated, the runtime writes only compositor-safe values:

```css
opacity: 1;
transform: translate3d(0, 0, 0);
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
