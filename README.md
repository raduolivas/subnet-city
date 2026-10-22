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
Image assets are inspiration, not exact component assets or authoritative technical documentation. Codex must implement working product behavior, not simply recreate a poster or screenshot. The package does not yet contain the app's implementation.
