# Atomic Motion Agent Guide

Atomic Motion is an AI-native, utility-first motion framework. When editing this repository, optimize for deterministic AI-generated animation markup and runtime safety.

## Rules for AI agents

- Prefer `data-am-*` attributes over imperative animation code.
- Keep the public grammar finite and documented in README.md.
- Never introduce default animation utilities that animate layout properties: `width`, `height`, `top`, `left`, `right`, `bottom`, `margin`, or `padding`.
- Default to `transform` and `opacity`.
- Keep DOM reads and DOM writes separated through the frame scheduler.
- Respect `prefers-reduced-motion`.
- Do not add runtime dependencies to the core package unless they are essential.
- Add or update tests for every public behavior change.
- Run `npm test` and `npm run lint` before committing.

## Project direction

The runtime should stay small. Advanced capabilities should be optional packages:

- MCP server and agent tools.
- Framework adapters.
- WebGL/Three.js synchronization.
- CLI validators and codemods.
