# AI Agent Guide

Atomic Motion is built to be a safe compile target for AI-generated motion. Agents should prefer local markup edits over imperative animation code.

## Golden rules

- Use `data-am-*` attributes instead of hand-written animation orchestration.
- Keep animation utilities finite and documented.
- Do not invent new attributes without updating `src/core/constants.js`, tests, and docs.
- Do not animate layout properties by default.
- Prefer `transform` and `opacity`.
- Run validation before committing.

## Recommended workflow for agents

1. Identify the exact DOM node/component that should move.
2. Add the smallest appropriate `data-am-*` attributes.
3. Run:

```bash
npm test
npm run lint
npm run validate:motion
```

4. If validation fails, fix the attributes instead of bypassing the validator.

## Safe examples

```html
<div data-am="fade" data-am-trigger="view">...</div>

<h2
  data-am="reveal-up"
  data-am-trigger="view"
  data-am-distance="32"
  data-am-duration="700"
  data-am-ease="expo-out"
>
  Section heading
</h2>
```

## Unsafe examples

```text
Do not create layout animation utilities:
data-am="width"

Unknown attributes should be rejected:
data-am-top="24"
```

## Future MCP server shape

The future MCP server should expose:

Resources:

- `atomic-motion://attributes`
- `atomic-motion://utilities`
- `atomic-motion://performance-rules`
- `atomic-motion://examples`

Tools:

- `validate_motion_attributes`
- `inject_motion_attributes`
- `scan_project_motion`
- `generate_reveal_sequence`

Prompts:

- `add-accessible-motion`
- `create-cinematic-hero`
- `audit-motion-performance`
