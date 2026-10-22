# Technical architecture

## Suggested stack (adjust after inspecting environment)
- Vite + React + strict TypeScript, responsive CSS or Tailwind.
- Three.js + React Three Fiber for the isometric scene, fixed orthographic camera, orbit/pan/zoom controls limited for clarity. Consider simpler SVG/2D fallback if time-constrained.
- Zustand or a small React reducer for topology and UI state.
- Vitest for pure simulation unit tests; React Testing Library for UI tests if useful.
- Local storage for topology snapshots in MVP; schema version field for future migrations.
- Git repository from day one; no server necessary for MVP.

## Key boundaries
- `domain/`: typed topology graph (devices, interfaces, links, VLAN membership, IP address, gateways, scenario IDs).
- `simulation/`: pure deterministic step/event engine. Input: topology + source/destination + action; output: results and chronological events with reason codes.
- `world/`: isometric mesh/icon renderer that reads domain objects and simulation events; not authoritative for reachability.
- `components/`: panels/toolbars/inspector, device palette and logs.
- `challenges/`: structured objectives, hints, seed topology, validation and explanations.
- `persistence/`: versioned serialize/load functions.

## Networking accuracy for first lesson
1. Distinguish same IPv4 subnet using both addresses and CIDR mask; validate octet range and prefix length.
2. Two hosts need distinct addresses in compatible subnet, link-up ports to same switch, and correct connectivity for a successful L2-local exchange.
3. ARP resolves the recipient's IPv4 address to MAC with request broadcast and reply unicast (if ARP cache cold). Follow with synthetic frame forwarding and IP delivery.
4. No default gateway needed for same-subnet hosts. Different-subnet traffic without a router/gateway must fail.
5. Do not model broadcast packet travel across an IP-routed VPN tunnel; `tun0` is Layer 3 in the user's OffSec example.

## Domain sketches
```
type DeviceKind = 'host' | 'switch' | 'router' | 'server' | 'firewall' | 'access-point' | 'vpn-gateway';
type NetworkInterface = { id: string; name: string; mac?: string; ipv4?: string; prefix?: number; connectedLinkId?: string; vlanId?: number };
type NetworkDevice = { id: string; kind: DeviceKind; name: string; position: { x: number; y: number }; interfaces: NetworkInterface[]; defaultGateway?: string };
type Link = { id: string; a: { deviceId: string; interfaceId: string }; b: { deviceId: string; interfaceId: string }; up: boolean };
type SimulationEvent = { type: string; message: string; sourceDeviceId?: string; targetDeviceId?: string; detail?: Record<string, string> };
```
Use domain definitions that support multiple interfaces and links as requirements grow; do not bind devices together solely by screen coordinates.

## Security model
All devices and traffic are fictional in the web app. Never open actual sockets based on the canvas topology. Import/export JSON should be validated as untrusted input.
