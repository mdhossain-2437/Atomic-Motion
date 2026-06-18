# Contributing to Atomic Motion

Thanks for helping build Atomic Motion.

## Development

```bash
npm test
npm run lint
```

The project currently avoids required runtime dependencies. Keep the core small and browser-safe.

## Engineering rules

- Prefer declarative data attributes over imperative animation setup.
- Do not add unsafe default animation properties such as `width`, `height`, `top`, `left`, `margin`, or `padding`.
- Per-frame runtime work must use read-before-write batching.
- Respect `prefers-reduced-motion`.
- Keep WebGL and framework adapters optional.
- Add tests for new public behavior.

## Commit style

Use concise imperative messages, for example:

```text
Add frame scheduler MVP
Document attribute grammar
```
