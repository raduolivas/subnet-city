# Subnet City — instructions for coding agents

You are implementing **Subnet City**, an educational isometric network engineering simulator. Read `docs/PRODUCT.md`, `docs/ARCHITECTURE.md`, `docs/LEARNING.md`, and `docs/BRAND.md` before proposing or implementing changes. The two images in `brand/` are visual references; do not blindly trust text rendered in those images. Written specs take precedence.

## Operating principles
- Work iteratively, with small verifiable increments and clear commits.
- Use TypeScript with strict types. Start with a local-first browser app; no account, backend, payments, or real lab network access in MVP.
- Keep networking domain/simulation logic pure and separate from Three.js/React rendering. Visuals consume simulation events; they don't decide network behavior.
- Do not claim simulation features are functional if they are just animations or hardcoded paths.
- Write deterministic unit tests for IPv4/CIDR, same-subnet decisions, ARP resolution, L2 switching basics, and first challenge evaluation.
- Explain newly introduced command flags and networking terminology in readable documentation/UI.
- Treat all simulation operations as synthetic; never run Nmap, connect to real IPs, or sniff live network traffic from simulator mode.
- Respect accessibility: clear text contrast, keyboard operations where feasible, reduced-motion support.
- Avoid unnecessary dependencies. Document rationale for significant architectural choices.
- After each milestone run relevant tests, lint, typecheck and build; report what passed and what is still stubbed.

## Initial task
Bootstrap the project and implement the MVP milestone described in `docs/IMPLEMENTATION.md`. If the current directory contains an existing app, inspect it first and integrate without overwriting work. Ask before destructive operations.
