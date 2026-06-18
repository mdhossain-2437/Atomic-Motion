# Security Policy

## Reporting a vulnerability

Please report security issues privately by contacting the maintainer instead of opening a public issue.

Maintainer: mdhossain-2437 <delowarhossain2437@gmail.com>

## Scope

Atomic Motion is currently an early-stage open-source project. Security-sensitive areas include:

- Source-code mutation tools planned for the MCP server.
- Any future CLI that edits project files.
- Browser runtime behavior that reads DOM attributes.
- Future WebGL resource management and shader/plugin loading.

## Runtime safety principles

- Treat data attributes as configuration, not executable code.
- Do not evaluate attribute values as JavaScript.
- Validate all utility names against a finite registry.
- Keep MCP tools schema-validated and patch-previewable.
