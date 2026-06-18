# Roadmap

Atomic Motion is early. The current repository establishes the core grammar, parser, validator, scheduler, runtime initialization, viewport activation, and project documentation.

## Phase 1: Core runtime

Status: in progress

- [x] Finite `data-am-*` grammar.
- [x] Parser for DOM-like elements.
- [x] Attribute diagnostics.
- [x] Read/write scheduler.
- [x] Initial fade/reveal style application.
- [x] Viewport activation.
- [x] Runtime cleanup via `destroy()`.
- [ ] Stagger support.
- [ ] Hover/focus/click triggers.
- [ ] CSS easing token injection.

## Phase 2: Developer tooling

- [x] CLI validator for HTML/Markdown.
- [x] CI workflow.
- [ ] CLI project scanner with JSON output.
- [ ] Codemod helpers for simple imperative animation migration.
- [ ] TypeScript declaration files.

## Phase 3: AI-native layer

- [ ] Official AI skill/agent instructions.
- [ ] MCP resources for grammar, utilities, and examples.
- [ ] MCP validation tool.
- [ ] MCP AST mutation tool.
- [ ] Design-token mapping examples.

## Phase 4: Framework adapters

- [ ] React hook/adapter.
- [ ] Vue directive.
- [ ] Svelte action.
- [ ] Astro integration notes.

## Phase 5: Immersive/WebGL layer

- [ ] DOM proxy measurement abstraction.
- [ ] Camera calibration helpers.
- [ ] WebGL uniform/matrix state bridge.
- [ ] Three.js adapter.
- [ ] Debug overlay for DOM/WebGL alignment.

## Non-goals for the core package

- Replacing every GSAP/Framer Motion feature.
- Shipping a heavy WebGL runtime by default.
- Supporting unsafe layout animations as defaults.
- Hiding accessibility requirements behind animation presets.
