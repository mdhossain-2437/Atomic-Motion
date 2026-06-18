# Contributing to Atomic Motion

Thanks for helping build Atomic Motion.

## Development

```bash
npm install
npm run check
```

`npm run check` runs:

- `npm test`
- `npm run lint`
- `npm run validate:motion`

The project currently avoids runtime dependencies. Keep the core small, browser-safe, and framework-agnostic.

## Engineering rules

- Prefer declarative `data-am-*` attributes over imperative animation setup.
- Do not add unsafe default animation properties such as `width`, `height`, `top`, `left`, `right`, `bottom`, `margin`, or `padding`.
- Per-frame runtime work must use read-before-write batching.
- Respect `prefers-reduced-motion`.
- Keep WebGL and framework adapters optional.
- Add tests for new public behavior.
- Update docs when changing public attributes or runtime behavior.

## TDD expectation

For runtime behavior changes:

1. Add/adjust a failing test.
2. Run the test and confirm it fails for the expected reason.
3. Implement the minimal change.
4. Run the full check suite.

## Commit style

Use concise imperative messages, for example:

```text
Add frame scheduler MVP
Document attribute grammar
```
