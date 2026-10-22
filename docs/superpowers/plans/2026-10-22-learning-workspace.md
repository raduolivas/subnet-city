# Subnet City Learning Workspace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Deliver the six-lesson beginner journey and unrestricted isometric sandbox backed by the same accurate local-network simulator.

**Architecture:** A pure domain and simulation core produces deterministic traces. A React reducer manages editing, progression, and playback; the isometric renderer consumes state and events. Lessons and sandbox share the workspace but retain separate saved topologies.

**Tech Stack:** Vite, React, strict TypeScript, Three.js, React Three Fiber, Vitest, React Testing Library, ESLint; browser local storage. Node 26.8.1 and npm 11.19.0 are installed. Check current package compatibility during execution and commit a lockfile.

**Spec:** `docs/superpowers/specs/2026-10-22-subnet-city-learning-workspace-design.md`. Read it and AGENTS.md plus the five original docs before execution.

## Global Constraints

- Local-first browser application; no account, backend, payments, native packaging, or real network access.
- Computers have one Ethernet port; switches have eight. Only computers and switches ship in this release.
- Pure deterministic simulation; rendering and animation timing never decide reachability.
- Each Send starts with empty ARP and switch learning tables. Replay uses recorded events.
- Only the first lesson is initially unlocked; sandbox exposes every implemented component immediately.
- Validate current topology revision before accepting challenge results.
- Preserve accessibility, keyboard alternatives, reduced motion, existing palette, and readable explanations.
- Run relevant tests, lint, typecheck, and build after each milestone. Never label unsupported behavior functional.

## Review Focus

1. Editing after a successful send must invalidate completion evidence and playback: Task 5.
2. Disconnected malformed devices must not block an unrelated valid exchange: Task 3.
3. Corrupt saves must survive automatic-save attempts until explicit recovery: Task 6.
4. Invalid numeric text must remain editable without NaN entering topology: Task 7.
5. WebGL unavailable or narrow screens must retain usable network controls and explanations: Tasks 8–9.

## File and Interface Map

- `src/domain/types.ts`: `Device`, `NetworkInterface`, `Link`, `Topology { revision: number; devices: Device[]; links: Link[] }`; endpoint references use deviceId/interfaceId, never coordinates.
- `src/domain/ipv4.ts`: `parseIPv4(text: string): number | null`, `networkAddress(ip: number, prefix: number): number`, `isOnLink(source: number, prefix: number, destination: number): boolean`, `validateHostAddress(address: string, prefix: number, pointToPoint: boolean): string | null`.
- `src/domain/topology.ts`: device factories with injected IDs/MACs; `validateTopology(topology: Topology): TopologyIssue[]`, immutable edit helpers; `TopologyIssue { code: string; deviceIds: string[]; linkIds: string[] }`.
- `src/simulation/types.ts`: `SendAction { sourceDeviceId: string; destinationIp: string }`, `SimulationEvent { sequence: number; type: string; deviceIds: string[]; interfaceIds: string[]; linkIds: string[]; reasonCode?: string; detail: Record<string,string> }`, `RuntimeState { arp: Record<string,Record<string,string>>; macTables: Record<string,Record<string,string>> }`, `SimulationResult { revision: number; action: SendAction; outcome: 'delivered' | 'failed'; reasonCode: string; events: SimulationEvent[]; runtime: RuntimeState }`.
- `src/simulation/engine.ts`: `simulate(topology: Topology, action: SendAction, options?: { maxEvents?: number }): SimulationResult`; default maxEvents 10000, minimum 1; fresh runtime per invocation.
- `src/challenges/types.ts`, `lessons.ts`, `evaluate.ts`: `LessonId` union of `cables | switches | ipv4 | subnets | arp | troubleshooting`; `LessonDefinition` contains prerequisite, explanation, guided steps, experiment/challenge seeds, hints, required ordered host-pair checks, and answer keys; `evaluateChallenge(lesson: LessonDefinition, topology: Topology, results: SimulationResult[], answers: Record<string,string>): ChallengeEvaluation`; `ChallengeEvaluation { complete: boolean; unmet: string[] }`.
- `src/state/types.ts`, `reducer.ts`, `selectors.ts`: `AppState` includes active mode/lesson/phase, separate workspaces, completed lesson IDs, answers, selected device, playback, and current-revision results; `appReducer(state: AppState, action: AppAction): AppState` is the sole transition authority.
- `src/persistence/storage.ts`: `SavedSession` is version 1 durable subset of AppState; `loadSession(storage: Storage): LoadResult`, `saveSession(storage: Storage, session: SavedSession): SaveResult`; discriminated results distinguish missing, valid, corrupt, incompatible, and unavailable states.
- `src/components/`: accessible panels, editing, simulation controls, timeline, recovery UI.
- `src/world/`: replaceable scene, device meshes, links, subnet overlays, event highlights, and accessible HTML fallback.
- `src/App.tsx`, `src/main.tsx`, `src/styles.css`: composition, persistence wiring, brand, responsive layout.

## Task 1: Runnable shell and verification tooling

**Files:** Create `package.json`, `package-lock.json`, `.gitignore`, `index.html`, `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`, `eslint.config.js`, `src/main.tsx`, `src/App.tsx`, `src/styles.css`, `src/test/setup.ts`, `src/App.test.tsx`. Modify `README.md`.

**Interfaces:** Produces React entry point and scripts `dev`, `test` (vitest run), `lint`, `typecheck`, `build`. Add only dependencies needed by tasks below; preserve original docs/assets.

- [ ] Configure the minimum toolchain and add a failing shell test: `expect(screen.getByRole('heading', {name: 'Subnet City'})).toBeVisible()` and assert Learn/Sandbox navigation buttons exist.
- [ ] Run `npm test -- src/App.test.tsx`; confirm an assertion/module failure, not a broken test runner.
- [ ] Implement the branded shell and README launch commands. Use system font fallbacks without requiring external font requests.
- [ ] Run `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`; all exit 0.
- [ ] Commit explicitly named task files with `chore: bootstrap typed Subnet City application`.

## Task 2: Addressing and topology model

**Files:** Create `src/domain/{types,ipv4,topology}.ts`, `src/domain/{ipv4,topology}.test.ts`.

**Interfaces:** Produces domain interfaces/functions from the map. Host kind is `host`, switch kind `switch`; interface has id, name, mac, optional ipv4/prefix; link endpoints reference interfaces and include up:boolean. Device includes name and x/y position. Factories accept identity data so tests never depend on randomness.

- [ ] Add failing tests: parsing `192.168.1.10` succeeds; `256.1.1.1`, missing octets, fractional prefixes and prefixes outside 0–32 fail; /0 and /32 masks are correct; `192.168.1.10/24` includes `.200` but excludes `192.168.2.15`; /16 versus /24 gives directional membership; /31 direct endpoints work; subnet network/broadcast, loopback, multicast, unspecified and limited broadcast host assignments fail. Topology tests assert one/eight ports, occupied/dangling endpoints rejected, removal clears attached links, valid edits increment revision.
- [ ] Run `npm test -- src/domain`; confirm failures identify absent behavior.
- [ ] Implement unsigned IPv4 bit arithmetic and immutable topology edits. Prefix text validation stays in UI; domain accepts only finite integer prefixes. Generate locally administered unicast MACs at the application boundary and persist them.
- [ ] Run domain tests plus lint/typecheck/build, expecting exit 0.
- [ ] Commit `feat: add IPv4 and topology domain` with the five task files.

## Task 3: Deterministic direct-link delivery and failure reasons

**Files:** Create `src/simulation/{types,engine,fixtures}.ts`, `src/simulation/engine.test.ts`.

**Interfaces:** Consumes Task 2; produces simulate and result/event/runtime contracts. Event types include run-start, arp-request, arp-reply, frame-forward, delivered, failed. Never accept screen positions as path input.

- [ ] Add failing fixture tests: two direct hosts `192.168.1.10/24` and `.200/24` deliver with ordered ARP request/reply/delivery; no cable, down cable, missing source configuration, malformed destination, duplicate address in the active domain, absent local recipient and off-subnet recipient each return distinct reason codes. Assert /31 direct success, /32 off-host routing-required, directional-prefix outcomes, deterministic deep equality across repeated sends, and a malformed disconnected host does not invalidate a good exchange.
- [ ] Run `npm test -- src/simulation/engine.test.ts`, confirming failures.
- [ ] Implement source-reachable-domain validation and direct Ethernet/ARP processing with fresh runtime. Results carry topology revision and exact action. Bound event generation and return event-budget-exceeded without exceeding the specified maximum; include terminal failure by reserving a slot.
- [ ] Run simulation/domain tests and lint/typecheck/build, expecting exit 0.
- [ ] Commit `feat: simulate direct Ethernet and ARP delivery`.

## Task 4: Learning switches and observable event paths

**Files:** Create `src/simulation/{switching,switching.test}.ts`; modify `engine.ts`, `fixtures.ts`, `engine.test.ts`.

**Interfaces:** Consumes Task 3 result/runtime types. `forwardFrame(topology: Topology, runtime: RuntimeState, ingress: { deviceId: string; interfaceId: string }, frame: { sourceMac: string; destinationMac: string }): { runtime: RuntimeState; egressInterfaceIds: string[] }` performs deterministic ingress learning and forwarding; engine owns traversal/event budget.

- [ ] Add failing tests for three hosts through a switch, chained switches, ingress exclusion, ARP broadcast reaching all other active branches, learned unicast reply returning through the correct port, unknown-unicast flooding, down links, repeated cold runs, cycle detection including parallel switch links, maxEvents 1 and 10 termination, and unrelated disconnected loops not breaking a valid source domain.
- [ ] Run `npm test -- src/simulation`, confirming new tests fail.
- [ ] Implement stable traversal ordered by interface/link ID, source MAC learning, flooding/known forwarding and pre-run active-domain cycle rejection. Include the actual traversed link/interface identifiers in each event. Reject unsupported /31 switch networks explicitly.
- [ ] Run all tests and lint/typecheck/build; inspect a three-host trace for broadcast versus unicast paths.
- [ ] Commit `feat: add deterministic learning-switch forwarding`.

## Task 5: Six lessons, progression, and workspace transitions

**Files:** Create `src/challenges/{types,lessons,evaluate,evaluate.test}.ts`, `src/state/{types,reducer,selectors,reducer.test}.ts`.

**Interfaces:** Consumes Tasks 2–4; produces lesson/evaluation/reducer contracts from map. Actions cover mode, lesson, experiment/challenge phase, topology edits, simulation results, prediction answers, completion, playback and resets. Guided experiments and independent challenges keep distinct topologies. Completion is explicit Check challenge; evaluator checks configuration plus current-revision successful sends, never triggers animation-dependent logic.

- [ ] Add failing tests for every lesson seed failing its independent challenge and a repaired fixture passing; only cables initially unlocked; predecessor completion unlocks the next; sandbox cannot complete lessons; revisits retain progress; workspace reset preserves completion; topology edit clears results/stops playback; stale revisions cannot complete; mode/lesson switches retain their workspaces. For switches require all three unordered host pairs in canonical direction; troubleshooting uses four hosts and requires all six unordered pairs; subnets requires both directions. ARP requires correct predictions for request/reply/delivery and a matching trace. Checking before playing an animation still evaluates correctly.
- [ ] Run `npm test -- src/challenges src/state`, confirming failures.
- [ ] Implement six deterministic definitions matching the spec table, including supplied early-lesson addresses, hints, success copy and challenge objectives. Troubleshooting uses four hosts so disconnected link, duplicate IP and subnet mismatch are independent repair targets; require all six unordered pairs there. Keep domain errors separate from lesson feedback.
- [ ] Run all tests and lint/typecheck/build, expecting exit 0.
- [ ] Commit `feat: add progressive lessons and shared workspace state`.

## Task 6: Durable sessions and explicit recovery

**Files:** Create `src/persistence/{storage,storage.test}.ts`; extend state types/reducer only for recovery if needed.

**Interfaces:** Consumes durable Task 5 state; produces load/save contracts from map. Storage key `subnet-city.session.v1`; version 1, sandbox, per-lesson phase workspaces, completed lesson IDs and answers; omit selection, traces, playback and caches.

- [ ] Add failing tests for missing save, exact roundtrip including MACs, malformed JSON, unknown version, dangling graph references, duplicate IDs, invalid lesson IDs, impossible nonsequential progress, throwing storage getter/setter, and corrupt save remaining unchanged until explicit reset. Invalid IP text represented in lesson challenges remains allowed; structural corruption does not.
- [ ] Run `npm test -- src/persistence`, confirming failures.
- [ ] Implement runtime structural validation, discriminated errors, and recovery gating. Corrupt/incompatible loads disable automatic writing until explicit reset; unavailable storage permits memory-only editing. Workspace reset and clear-progress actions remain separate, the latter confirmed in UI.
- [ ] Run all tests and lint/typecheck/build, expecting exit 0.
- [ ] Commit `feat: persist validated workspaces and learner progress`.

## Task 7: Accessible build, lesson, and simulation panels

**Files:** Create `src/components/{DevicePalette,DeviceInspector,ConnectionEditor,LessonPanel,SimulationControls,EventTimeline,SessionRecovery}.tsx`, `src/components/workspace.test.tsx`, `src/simulation/explanations.ts`; modify `App.tsx`, `styles.css`.

**Interfaces:** Consume state and dispatch AppAction; panels never calculate delivery. `explainEvent(event: SimulationEvent): { title: string; explanation: string; nextStep?: string }` maps reason codes to educational text. Inspector holds invalid numeric input locally until a validated edit can be dispatched.

- [ ] Add failing UI tests for keyboard add/select/move/connect/delete, occupied-port feedback, editable blank/invalid prefix without NaN, send source/destination selection, step/play/pause/replay, edit stopping playback, lesson lock/phase/hints/predictions/completion, sandbox access, recovery reset and confirmed progress clearing. Test that mode switching never displays another workspace's stale trace.
- [ ] Run `npm test -- src/components`, confirming failures.
- [ ] Implement panels, explicit available-port selection, announced errors, cold-cache explanation and beginner terminology. Playback advances only recorded events; reduced motion never auto-animates packet travel. Integrate persistence through an adapter/effect with recovery gate and visible saving errors.
- [ ] Run all tests and lint/typecheck/build; manually inspect focus order and label contrast.
- [ ] Commit `feat: build interactive learning and simulation controls`.

## Task 8: Isometric scene and subnet overlays

**Files:** Create `src/world/{NetworkScene,DeviceMesh,LinkMesh,SubnetOverlay,WorkspaceFallback}.tsx`, `src/world/{projection,subnets}.ts`, `src/world/{projection,subnets}.test.ts`, `src/world/WorkspaceFallback.test.tsx`; modify `App.tsx`, `DevicePalette.tsx`, `styles.css`.

**Interfaces:** Scene consumes Topology, selected device ID, current event, reduced-motion preference and edit dispatch. `groupSubnets(topology: Topology): { cidr: string; deviceIds: string[] }[]` derives valid overlays; `screenToGrid(point: {x:number;y:number}, bounds: {width:number;height:number}, camera: {zoom:number;panX:number;panY:number}): {x:number;y:number}` supports tested orthographic placement.

- [ ] Add failing pure tests for projection roundtrip with pan/zoom, subnet groups independent of positions/links, overlapping different-prefix groups remaining distinct, invalid-address exclusion. Add fallback test asserting accessible devices, configuration/connection controls and event text remain available without WebGL.
- [ ] Run `npm test -- src/world`, confirming failures.
- [ ] Implement fixed orthographic city meshes, grid, pan/zoom, drag/drop placement, moving/selecting, labeled links and optional subnet overlays. Highlight only engine-emitted paths and stop motion on edit. Use local simple geometry; inspect supplied brand images for visual direction without treating image text as requirements. Catch WebGL creation failure and show the functional HTML workspace using the same reducer/panels.
- [ ] Run all tests and lint/typecheck/build. Browser-check dragging after pan/zoom, keyboard equivalence, event highlights, and reduced motion.
- [ ] Commit `feat: render isometric network workspace and subnet districts`.

## Task 9: Complete learner-flow verification and delivery docs

**Files:** Create `docs/VERIFICATION.md`; modify `README.md`, `src/App.test.tsx`, and only files required by discovered defects. If repeatable browser coverage needs Playwright, add its configuration and `e2e/learning.spec.ts` with documented dependency rationale.

**Interfaces:** Consumes the integrated app; no new domain APIs.

- [ ] Add integration assertions for fresh progress, completing all six challenges in sequence, all required simulations, switching to sandbox, saved restoration, and separate progress reset. Run the tests before fixes and verify meaningful failure if defects exist; do not invent red tests for already working behavior.
- [ ] Start dev server and perform the entire six-lesson journey through visible controls. Verify all failure reasons, source/pair requirements, hints, predictions, unlocked/revisited lessons and sandbox editing. Test narrow viewport at 390px and desktop at 1440px, keyboard controls, reduced motion, WebGL fallback, corrupted storage and storage denial. Record actual outcomes and defects in VERIFICATION.md.
- [ ] Fix verified defects with focused failing regression tests first. Repeat only affected browser flows plus the complete journey if progression/simulation contracts changed.
- [ ] Run `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`; record actual results. Update README with launch instructions, implemented simulation semantics, loop/cache restrictions, save/recovery behavior, keyboard controls, and future device scope.
- [ ] Commit `test: verify beginner journey and document supported simulation`; request whole-change code review, resolve material issues, rerun affected checks, and deliver commit IDs and honest limitations.

## Execution checkpoints

Tasks are sequential because their interfaces build on each other. Tasks 1–4 establish a verified simulator; Tasks 5–7 make lessons playable; Tasks 8–9 complete isometric interaction and release verification. After each task, check the working tree and commit only intended files. Do not publish or configure remote hosting as part of this plan.

## Plan self-review

Coverage checked against every spec section: six lessons and unlocking (5/7/9), sandbox parity (3–9), builder/overlays/playback (7/8), simulation edge cases (2–4), persistence/recovery (6/7), accessibility (7–9), and release acceptance (9). All five review-focus conditions have owner tests. Public contracts are defined above; private helpers remain implementation choices.
