# Subnet City — Codex context transfer package

This package moves the product vision, architectural constraints, lesson examples, and brand assets from ChatGPT into a repo that Codex CLI can inspect.

## Ubuntu use
1. Extract this package into a new folder such as `~/Projects/subnet-city`.
2. In terminal run `cd ~/Projects/subnet-city`, then `git init` if not already in a Git repo.
3. Check tools with `node -v`, `npm -v`, `git --version`, `codex --version`.
4. If Codex isn't installed and npm is available: `npm install -g @openai/codex`.
5. Run `codex` inside the project directory.
6. Paste the request from `docs/IMPLEMENTATION.md` under "Suggested startup request to Codex".

## Important
Image assets are inspiration, not exact component assets or authoritative technical documentation. Codex must implement working product behavior, not simply recreate a poster or screenshot. The package includes an initial app shell; the networking simulator is not implemented yet.


## App shell development

From this directory, use Node.js 22.12 or newer:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. The server binds to `127.0.0.1` (this computer only).

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

Current implementation: a responsive branded shell with Learn/Sandbox navigation and introductory networking copy. Device editing, lessons, simulation, persistence, and the isometric scene are pending. The temporary HTML workspace establishes accessible layout before scene implementation; it does not simulate a network.

Verification on 2026-10-24: after dependency installation, the shell test (1 test), lint, TypeScript check, and production build all passed. Added the Vite client type declaration for CSS imports. Browser layout and interaction verification are still pending.
# subnet-city
# subnet-city
