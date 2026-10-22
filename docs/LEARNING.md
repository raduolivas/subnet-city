# Learning design and canonical examples

## Teaching format
For each new concept: short explanation, interactive demonstration, challenge with objectives, hints, then causal feedback (why it worked/failed). Explain introduced Nmap flags/CLI options individually when shown.

## Canonical example: user's OffSec lab routing table
```text
default via 10.0.2.2 dev eth0 proto dhcp src 10.0.2.15 metric 100
10.0.2.0/24 dev eth0 proto kernel scope link src 10.0.2.15 metric 100
192.168.45.0/24 dev tun0 proto kernel scope link src 192.168.45.164
192.168.167.0/24 via 192.168.45.254 dev tun0
```
Explain: Kali runs locally as VM with `eth0 = 10.0.2.15` on VirtualBox NAT, gateway `10.0.2.2`, DNS proxy often `10.0.2.3`. Kali gets another IP, `tun0 = 192.168.45.164`, via OffSec VPN. Remote target `192.168.167.52` is reached using next hop `192.168.45.254` on `tun0`. OffSec hosts are on routed networks; Kali is a VPN client, not an OffSec-hosted VM. `10.0.2.0/24` and `192.168.45.0/24` are separate directly attached networks. Default internet traffic uses `eth0`. Remember VPN's encrypted traffic is physically transported through underlying host/NAT connectivity.

## Compare NAT versus bridged
VirtualBox NAT guest is not normally a separate host directly visible on home Wi-Fi; NAT forwards outbound traffic. Bridged mode usually assigns a LAN address to the guest (support varies with Wi-Fi adapter). Finding LAN hosts through Nmap doesn't prove guest is in same subnet; `-PR` ARP discovery applies to directly attached Ethernet targets, not routed home LAN targets.

## Same subnet example
192.168.1.10/24 and 192.168.1.200/24 can communicate on the same VLAN via switch without router; ARP obtains MAC mapping. Different subnet example 192.168.1.10/24 versus 192.168.2.15/24 requires routing and permitted firewall policy. The first two octets `192.168` alone do not define subnet membership.

## CLI explanations for optional reference lessons
- `ip -4 addr show tun0`: `-4` IPv4 only; `addr show` show addresses; `tun0` selects VPN interface.
- `ip route`: displays routes. `ip route get <ip>` shows Linux's selected path without sending a probe.
- `ip neigh show`: view IPv4 ARP and IPv6 neighbor state.
- `sudo tcpdump -ni eth0 arp`: elevated capture; `-n` disables name lookups; `-i` selects interface; `arp` filters ARP packets.
- `nmap -sn -PR <local-cidr>`: host discovery, ARP probe on a directly connected Ethernet network.
- `sudo nmap -sS -p- --open -T4 <lab-ip>`: SYN scan, all TCP ports, only open display, timing template 4.
- `nmap -sV -sC -p <port> <lab-ip>`: version probes, default NSE scripts, selected port.
- `nc -nv <ip> <port>`: `-n` numeric addresses/no DNS lookup, `-v` verbose TCP connection.
All CLI commands are explanations and examples only; app MVP does not run them.

## First challenge
**Title:** First Connections  
**Objective:** Place two hosts and a switch, cable both hosts to the switch, give them valid unique addresses in the same /24, and send a successful simulated packet.  
**Hint 1:** Two hosts need physical links to the same switch.  
**Hint 2:** Both IPv4 addresses must be in the same subnet.  
**Hint 3:** ARP resolves the destination's MAC on the local LAN.  
**Success feedback:** Show ARP request, ARP reply, Ethernet delivery and a short explanation about no router being required.  
**Failure feedback:** Show a concrete reason such as missing cable, duplicate IP, incompatible prefix/subnet, invalid host IP, or disconnected port.
