# Subnet City: first learning journey and network workspace

## Intent and agreed scope

Teach computer networking from scratch through interactive construction, experiments, causal feedback, and increasingly difficult challenges. Learners unlock lessons by completing prerequisite challenges. The sandbox exposes every implemented component immediately, regardless of lesson progress. Both modes use one functional, deterministic simulation engine.

The long-term product supports increasingly complex architectures and a growing device library. This first release delivers computers, switches, Ethernet links, IPv4 addressing, subnet membership, ARP, basic Ethernet switching, and local packet delivery. Routers, routing, DNS, DHCP, VLANs, firewalls, NAT, VPNs, wireless devices, and real network access are outside this release. Do not present unsupported devices as working components.

This design expands the single-challenge scope of docs/IMPLEMENTATION.md into six short lessons. Other product, brand, accessibility, and architecture constraints continue to apply. The initial delivery remains a local-first browser application; native installation and desktop packaging are not part of this milestone.

## Learner journey

Only the first lesson is initially unlocked. Each lesson contains a concise explanation, guided experiment, independent challenge, progressively specific hints, and success feedback. Completion requires satisfying topology/configuration objectives and obtaining the required simulator result; viewing instructions or playing an animation cannot complete a challenge.

| Lesson | Guided activity and independent challenge |
| --- | --- |
| Computers and cables | Connect two computers directly and deliver a packet using supplied valid addresses. Repair a missing or disconnected link in the challenge. |
| Switches | Connect three supplied-address computers through a switch. Demonstrate delivery between all three host pairs in the challenge. |
| IPv4 addresses | Edit addresses and learn valid, unique host addressing. Correct invalid and duplicate addresses, then demonstrate delivery. |
| Subnets | Compare addresses using their prefix lengths. Repair incompatible subnet settings and deliver traffic in both directions. |
| ARP and delivery | Step through an ARP broadcast, reply, and frame delivery. Predict the purpose of each stage using interactive choices and complete a successful trace. |
| Troubleshooting | Repair a seeded network containing a disconnected link, duplicate address, and subnet mismatch. All specified host-pair checks must succeed. |

Early lessons preconfigure concepts not yet taught. Each lesson requires the previous lesson's completion; completed lessons remain replayable. Hints have no penalty. Failure never removes earned progress. Completion checks evaluate current topology and simulation results from its current revision, avoiding stale successes after edits. Sandbox activity does not unlock lessons.

## Workspace and interaction

Use the existing Subnet City palette and typography. The main area is a bright isometric workspace with a fixed orthographic view, pan and zoom. A lesson panel sits beside it; the device palette and inspector support building and configuration. A bottom timeline presents simulation events. On narrow screens panels switch into accessible tabs or drawers while retaining access to the workspace.

Learners can drag computers and switches onto the workspace, select and move devices, connect explicitly selected free Ethernet ports, remove links/devices, and edit host names, IPv4 addresses, and prefixes. Switches initially have eight ports and computers one port; endpoint connections are stored by device/interface IDs. Keyboard-accessible add, select, move, connect, and delete controls complement dragging. Removing a device removes its attached links.

The simulation controls select a source computer and destination IPv4 address, send a packet, pause/play playback, step through events, and replay the last result. Edits invalidate the displayed result and stop playback. Stable generated locally administered MAC addresses persist with devices. Labels expose addresses and port identities without depending on tiny text or color alone.

Optional subnet overlays group hosts by their calculated network address and prefix, with explicit labels. They never infer membership from position or cables. Hosts with different prefixes appear in distinct labeled groups even when address ranges overlap; the simulator evaluates each host's own local-delivery decision. Overlays do not assert physical connectivity, VLAN membership, or reachability. Invalid/unconfigured addresses receive no subnet district.

## Shared architecture and data flow

Use Vite, React, and strict TypeScript. Prefer Three.js with React Three Fiber for the orthographic scene. Keep rendering replaceable through typed topology and simulation-event inputs. Use a small React reducer for application state unless implementation demonstrates a need for another state library.

- `domain/`: devices, interfaces, links, IPv4/CIDR parsing, address classification, topology validation, and revision identifiers.
- `simulation/`: pure deterministic processing of topology, action, and explicit runtime state into ordered events, resulting runtime state, and outcome/reason codes.
- `world/`: device rendering, links, overlays, selection, and event-driven highlights/animations.
- `components/`: palette, inspector, lesson panel, controls, timeline, and accessible building alternatives.
- `challenges/`: six lesson definitions, seed topologies, prerequisites, guided steps, hints, knowledge choices, and objective evaluators.
- `persistence/`: versioned validation, serialization, loading, and local storage adapters.

Flow: a UI edit updates topology and its revision; a simulation command passes a snapshot into the engine; the engine returns events and outcome; rendering displays those events; challenge evaluation checks objectives against that snapshot and result; successful completion updates progression and persistence. Screen coordinates and animation timing never determine network behavior.

## Simulation contract

Support direct host-to-host links and loop-free networks of switches. A switch learns source MAC addresses on ingress, broadcasts ARP requests and floods unknown unicast frames through other active ports, and forwards known unicast through the learned port. Hosts reply to ARP requests for their own address. ARP replies are unicast; successful resolution precedes synthetic IPv4 delivery. Same-subnet delivery needs no default gateway.

Validate address octets and prefix lengths, unique endpoint addressing within the connected Ethernet domain, valid link endpoints, port occupancy, and active connectivity. Reject unspecified, loopback, multicast, limited-broadcast, and subnet network/broadcast addresses as ordinary host assignments. Recognize /31 point-to-point addressing on direct host links and /32 syntax; /32 hosts cannot reach a different host without routing, which this release does not implement.

Compare subnet membership using address bits and each sender's prefix, never fixed octet counts. A send operation represents one-way delivery; reverse delivery is checked separately where required by a lesson. Off-subnet delivery returns routing-required feedback because this release has no router. An absent recipient on the reachable local network produces unresolved ARP feedback. Missing source configuration and physical disconnection have separate reasons.

Each Send starts with empty ARP and switch learning tables for a reproducible beginner trace; explain this reset in the timeline. State evolves within that run and replay uses its recorded events. Warm caches across separate sends are deferred. Events include sequence, type, participating interface/link IDs, reason code, and explanation parameters. The UI supplies readable explanations.

Detect switch loops and return an explicit unsupported-topology explanation before playback rather than inventing successful delivery. Bound processing with a deterministic event budget and fail explicitly if exceeded. Arbitrary loop-free arrangements of the implemented devices are allowed in the sandbox; advanced unsupported behavior is explained.

## Persistence and recovery

Save a versioned sandbox topology, separate per-lesson workspaces, and lesson completion locally. Changing modes preserves both workspaces. Reload restores valid saved work and progression; transient playback and simulation caches are not persisted.

Validate saved data before use, including graph references and lesson IDs. Corrupt or incompatible data produces a readable recovery message and an explicit reset option; do not silently overwrite it. Storage failures keep the session usable in memory and clearly indicate that changes are not saved. Resetting the current workspace leaves earned progress intact. Clearing all learning progress requires a separate confirmed action.

## Accessibility and teaching feedback

Provide readable contrast, visible focus, labeled controls, keyboard alternatives, and textual outcomes. Reduced-motion mode uses discrete highlights and the same timeline without traveling packet animations. Explain networking terminology when introduced. Identify what failed, why it failed, and an actionable next step, with lesson hints revealing more detail on request.

## Verification and acceptance

Deterministic unit tests cover IPv4/CIDR validation and boundaries, same/different subnet decisions, asymmetric prefix decisions, duplicates, disconnected and occupied ports, absent recipients, direct delivery, switched delivery, ARP broadcast/reply, switch learning/flooding, loops, and event-budget termination. Test that unrelated disconnected devices do not incorrectly invalidate a valid local exchange.

Test each lesson's initial failure, valid completion, prerequisites, knowledge-choice requirements where applicable, stale-result rejection, replay, and reset behavior. Test saved-data validation and restoration, storage failure, and separation of sandbox from progress.

Browser verification covers a fresh learner completing the six-lesson journey, correct sequential unlocking, revisiting completed lessons, unrestricted sandbox access, drag and keyboard building, packet step/playback, explanatory failures, persistence after reload, and reduced-motion behavior. Run lint, typecheck, unit tests, and production build at milestones.

Release acceptance: a beginner can complete the journey, build a separate network, observe results derived from its actual configuration, resume saved work, and understand why a delivery succeeds or fails. Report any unavailable functionality explicitly.
