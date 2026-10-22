# Codex implementation assignment — first playable vertical slice

## Sprint 1 — scaffold + functioning lesson
1. Inspect current directory and tool versions; prefer Node 22+ (Node 24 LTS is fine).
2. Scaffold Vite React + TypeScript in the current repo if empty. Set up linting and Vitest.
3. Build app shell using Subnet City palette. Include a 3D orthographic isometric scene or document why you chose a temporary 2D fallback.
4. Place, select and move a host or switch. Provide device palette, edit host IP/prefix via inspector, and connect links between available ports.
5. Implement an independent, deterministic pure TypeScript engine to validate same-subnet connected-host reachability via a switch; return structured ARP and delivery events and clear failures.
6. Build simulation button and timeline/log, with visual path animation based on engine results.
7. Seed first challenge with validation and hints. Store topology in browser local storage with a version key.
8. Unit-test minimum cases: valid IPv4, invalid IPv4, same/different subnet, duplicate IP, no link, two-host-switch success, destination IP absent.
9. Run lint, typecheck, tests and production build and report results. Don't declare incomplete placeholders as completed features.

## Definition of done
New user can start the app locally, understand what the main controls do, construct the challenge topology, get success/failure for networking reasons, and read a plausible synthetic packet trace. No real network scans, sockets or intrusive capabilities.

## Suggested startup request to Codex
"Read AGENTS.md and all docs. Inspect the repository and environment. Propose a brief implementation plan, then implement Sprint 1 as a tested, playable vertical slice. Keep the simulation pure and separate from rendering. Explain what works, what is still mocked, and provide launch instructions. Avoid destructive changes."
