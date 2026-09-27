import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

// 1. Client / Touchpoint Node Icon (Modern Multi-Surface Client Interface with CLI Prompt)
export function IconClient({ size = 18, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Modern viewport bezel */}
      <rect x="2" y="3" width="20" height="15" rx="2.5" />
      {/* Window titlebar partition */}
      <line x1="2" y1="7.5" x2="22" y2="7.5" strokeWidth="1.25" />
      {/* High-density status beacons */}
      <circle cx="5" cy="5.25" r="0.75" fill="currentColor" />
      <circle cx="7.5" cy="5.25" r="0.75" fill="currentColor" />
      <circle cx="10" cy="5.25" r="0.75" fill="currentColor" />
      {/* Client prompt terminal cursor */}
      <path d="m5.5 11.5 2 2-2 2" strokeWidth="1.5" />
      <line x1="9.5" y1="13.5" x2="13.5" y2="13.5" strokeWidth="1.5" />
      {/* UI split layout frame */}
      <rect x="15" y="10" width="4.5" height="5.5" rx="1" strokeWidth="1" strokeDasharray="1.5 1.5" />
      {/* Precision stand */}
      <path d="M8 18v3" strokeWidth="1.5" />
      <path d="M16 18v3" strokeWidth="1.5" />
      <path d="M5 21h14" strokeWidth="1.5" />
    </svg>
  );
}

// 2. API Gateway / Ingress WAF Icon (Reverse-Proxy Routing Hub with Downstream Fanout)
export function IconGateway({ size = 18, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Perimeter edge firewall brackets */}
      <path d="M3 8V5a2 2 0 0 1 2-2h3" strokeWidth="1.5" />
      <path d="M16 3h3a2 2 0 0 1 2 2v3" strokeWidth="1.5" />
      <path d="M21 16v3a2 2 0 0 1-2 2h-3" strokeWidth="1.5" />
      <path d="M8 21H5a2 2 0 0 1-2-2v-3" strokeWidth="1.5" />
      {/* Central reverse proxy routing hub */}
      <circle cx="12" cy="12" r="3" strokeWidth="1.75" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      {/* Ingress traffic vector from public edge */}
      <path d="M12 2v4" strokeWidth="1.75" />
      <path d="m10 5 2 2 2-2" strokeWidth="1.5" />
      {/* Downstream load-balanced distribution channels */}
      <path d="M9.8 14.2 6.5 17.5" strokeWidth="1.5" />
      <circle cx="5.5" cy="18.5" r="1.5" strokeWidth="1.25" />
      <path d="M14.2 14.2 17.5 17.5" strokeWidth="1.5" />
      <circle cx="18.5" cy="18.5" r="1.5" strokeWidth="1.25" />
      <path d="M12 15v3.5" strokeWidth="1.5" />
      <circle cx="12" cy="19.5" r="1.5" strokeWidth="1.25" />
    </svg>
  );
}

// 3. Auth & Security Guard Icon (Zero-Trust Cryptographic Token Shield & Cipher Key)
export function IconAuth({ size = 18, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Precision zero-trust faceted defense shield */}
      <path d="M12 2.5 4 6v6.2c0 5.2 3.4 10.1 8 11.5 4.6-1.4 8-6.3 8-11.5V6L12 2.5z" strokeWidth="1.75" />
      {/* Cryptographic key / token verification core */}
      <circle cx="12" cy="10" r="2.5" strokeWidth="1.5" />
      <path d="M12 12.5v5" strokeWidth="1.75" />
      <line x1="10" y1="15" x2="14" y2="15" strokeWidth="1.5" />
      <line x1="10.5" y1="17.5" x2="13.5" y2="17.5" strokeWidth="1.5" />
      <circle cx="12" cy="7" r="0.75" fill="currentColor" />
    </svg>
  );
}

// 4. Compute / App Logic Server Tier Icon (Containerized Pod Cluster with Mesh Interconnect)
export function IconCompute({ size = 18, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Cluster chassis node */}
      <rect x="3" y="3" width="18" height="18" rx="3" strokeWidth="1.75" />
      {/* 4 Execution Pod Cores */}
      <rect x="6" y="6" width="4.5" height="4.5" rx="1" strokeWidth="1.5" />
      <rect x="13.5" y="6" width="4.5" height="4.5" rx="1" strokeWidth="1.5" />
      <rect x="6" y="13.5" width="4.5" height="4.5" rx="1" strokeWidth="1.5" />
      <rect x="13.5" y="13.5" width="4.5" height="4.5" rx="1" strokeWidth="1.5" />
      {/* Inter-pod high-speed service mesh routing */}
      <line x1="8.25" y1="10.5" x2="8.25" y2="13.5" strokeWidth="1.25" />
      <line x1="15.75" y1="10.5" x2="15.75" y2="13.5" strokeWidth="1.25" />
      <line x1="10.5" y1="8.25" x2="13.5" y2="8.25" strokeWidth="1.25" />
      <line x1="10.5" y1="15.75" x2="13.5" y2="15.75" strokeWidth="1.25" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

// 5. Distributed Cache (Redis) Icon (Multi-Bank In-Memory RAM Registers with Low-Latency Strobe)
export function IconCache({ size = 18, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Multi-bank RAM cache line registers */}
      <rect x="3" y="4" width="18" height="4" rx="1.5" strokeWidth="1.5" />
      <rect x="3" y="10" width="18" height="4" rx="1.5" strokeWidth="1.5" />
      <rect x="3" y="16" width="18" height="4" rx="1.5" strokeWidth="1.5" />
      {/* Low-latency memory cell address pins */}
      <circle cx="6.5" cy="6" r="0.75" fill="currentColor" />
      <circle cx="9.5" cy="6" r="0.75" fill="currentColor" />
      <circle cx="12.5" cy="6" r="0.75" fill="currentColor" />
      <circle cx="6.5" cy="12" r="0.75" fill="currentColor" />
      <circle cx="9.5" cy="12" r="0.75" fill="currentColor" />
      <circle cx="12.5" cy="12" r="0.75" fill="currentColor" />
      <circle cx="6.5" cy="18" r="0.75" fill="currentColor" />
      <circle cx="9.5" cy="18" r="0.75" fill="currentColor" />
      <circle cx="12.5" cy="18" r="0.75" fill="currentColor" />
      {/* High-speed direct-access memory bus */}
      <path d="M17.5 3v18" strokeWidth="1.75" />
      <polyline points="15.5 5 17.5 3 19.5 5" strokeWidth="1.25" />
      <polyline points="15.5 19 17.5 21 19.5 19" strokeWidth="1.25" />
    </svg>
  );
}

// 6. Authoritative Database (PostgreSQL) Icon (Tiered ACID Storage Engine with Sharded WAL Spine)
export function IconDatabase({ size = 18, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Top durable storage disk platter */}
      <ellipse cx="12" cy="5" rx="8" ry="3" strokeWidth="1.75" />
      <ellipse cx="12" cy="5" rx="3.5" ry="1.3" strokeWidth="1" strokeDasharray="1.5 1.5" />
      {/* Partitioned persistence cylinder platters */}
      <path d="M4 5v5.5c0 1.66 3.58 3 8 3s8-1.34 8-3V5" strokeWidth="1.5" />
      <path d="M4 10.5v5.5c0 1.66 3.58 3 8 3s8-1.34 8-3v-5.5" strokeWidth="1.5" />
      <path d="M4 16v3c0 1.66 3.58 3 8 3s8-1.34 8-3v-3" strokeWidth="1.5" />
      {/* ACID consistency write-ahead-log (WAL) spine */}
      <line x1="12" y1="8" x2="12" y2="22" strokeWidth="1" strokeDasharray="2 2" />
    </svg>
  );
}

// 7. Message Broker / Queue (Kafka) Icon (Partitioned Sequential FIFO Event Stream)
export function IconQueue({ size = 18, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* FIFO buffer boundary rails */}
      <path d="M2 6.5h20" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M2 17.5h20" strokeWidth="1.75" strokeLinecap="round" />
      {/* Buffered FIFO message payload blocks with stream depth */}
      <rect x="4.5" y="8.5" width="3.5" height="7" rx="1" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
      <rect x="10.25" y="8.5" width="3.5" height="7" rx="1" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
      <rect x="16" y="8.5" width="3.5" height="7" rx="1" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
      {/* Consumer offset stream cursor */}
      <path d="m20.5 10 2 2-2 2" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="1" y1="12" x2="2.5" y2="12" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

// 8. CI/CD Pipeline Runner Icon (Commit -> Automated Test Gate -> Deployment Target Container)
export function IconCI({ size = 18, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Commit source node */}
      <circle cx="4" cy="12" r="2.5" strokeWidth="1.75" />
      <circle cx="4" cy="12" r="1" fill="currentColor" />
      {/* Verified test & quality gate */}
      <rect x="9.5" y="8.5" width="5" height="7" rx="1.5" strokeWidth="1.5" />
      <path d="m11 12 1 1 1.5-2" strokeWidth="1.25" />
      {/* Deployment release target */}
      <circle cx="20" cy="12" r="2.5" strokeWidth="1.75" />
      <path d="m19 12 1 1 1.5-1.5" strokeWidth="1" />
      {/* Pipeline execution conduit lines */}
      <line x1="6.5" y1="12" x2="9.5" y2="12" strokeWidth="1.5" />
      <line x1="14.5" y1="12" x2="17.5" y2="12" strokeWidth="1.5" />
      {/* Automated CI/CD feedback loop arc */}
      <path d="M4 9.5V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3.5" strokeWidth="1.25" strokeDasharray="2 2" />
    </svg>
  );
}

// 9. Telemetry & SRE Agent Icon (SRE Observability Station with Waveform Pulse & Metric Lights)
export function IconTelemetry({ size = 18, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Precision telemetry monitor bezel */}
      <rect x="2" y="3" width="20" height="15" rx="2.5" strokeWidth="1.75" />
      {/* Live latency & trace span pulse wave */}
      <path d="M4 11.5h3l1.5-4 2.5 8 2-5 1.5 3h2.5" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      {/* SRE telemetry health beacons */}
      <circle cx="18.5" cy="7.5" r="1" fill="currentColor" />
      <circle cx="18.5" cy="11.5" r="1" fill="currentColor" />
      <circle cx="18.5" cy="15.5" r="1" fill="currentColor" />
      {/* Stand & baseline */}
      <path d="M9 18v3" strokeWidth="1.5" />
      <path d="M15 18v3" strokeWidth="1.5" />
      <path d="M7 21h10" strokeWidth="1.5" />
    </svg>
  );
}

// 10. Pointer / Select Tool Icon (Precision CAD Anchor Cursor)
export function IconPointer({ size = 16, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="m3.5 3.5 7 17 2.8-7.2 7.2-2.8L3.5 3.5z" strokeWidth="1.75" strokeLinejoin="round" />
      <circle cx="14" cy="14" r="1.5" fill="currentColor" />
      <line x1="15.5" y1="15.5" x2="20" y2="20" strokeWidth="1.5" />
    </svg>
  );
}

// 11. Connect Wire / Arrow Tool Icon (Directional Bus Linker with Terminal Ports)
export function IconConnect({ size = 16, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <circle cx="5" cy="19" r="2.5" strokeWidth="1.75" />
      <circle cx="19" cy="5" r="2.5" strokeWidth="1.75" />
      <path d="M7 17 17 7" strokeWidth="1.75" />
      <path d="M11 5h8v8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 12. Cut / Sever Wire Tool Icon (Precision Optical Fiber Shear Cutter)
export function IconCut({ size = 16, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <circle cx="5" cy="6" r="2.5" strokeWidth="1.75" />
      <circle cx="5" cy="18" r="2.5" strokeWidth="1.75" />
      <line x1="19" y1="4" x2="7.5" y2="15.5" strokeWidth="1.75" />
      <line x1="13.5" y1="13.5" x2="19" y2="19" strokeWidth="1.75" />
      <line x1="7.5" y1="8.5" x2="11.5" y2="12.5" strokeWidth="1.75" />
      <line x1="19" y1="10" x2="22" y2="7" strokeWidth="1.5" strokeDasharray="1 1" />
    </svg>
  );
}

// 13. Auto-Layout / Tidy Architecture Icon (Hierarchical N-Tier Architecture Alignment Matrix)
export function IconAutoLayout({ size = 16, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Tiered architectural columns */}
      <rect x="3" y="3" width="4.5" height="18" rx="1.5" strokeWidth="1.75" />
      <rect x="10" y="3" width="4" height="8" rx="1.5" strokeWidth="1.5" />
      <rect x="10" y="13" width="4" height="8" rx="1.5" strokeWidth="1.5" />
      <rect x="16.5" y="3" width="4.5" height="18" rx="1.5" strokeWidth="1.75" />
      {/* Inter-tier bus alignment conduits */}
      <line x1="7.5" y1="7" x2="10" y2="7" strokeWidth="1.25" />
      <line x1="14" y1="7" x2="16.5" y2="7" strokeWidth="1.25" />
      <line x1="7.5" y1="17" x2="10" y2="17" strokeWidth="1.25" />
      <line x1="14" y1="17" x2="16.5" y2="17" strokeWidth="1.25" />
    </svg>
  );
}

// 14. Clear / Trash Icon (Schematic Purge Canister with Seal)
export function IconClear({ size = 16, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M4 7h16" strokeWidth="1.75" />
      <path d="M9 7V4.5a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5V7" strokeWidth="1.5" />
      <path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" strokeWidth="1.75" />
      <line x1="10" y1="11" x2="10" y2="17" strokeWidth="1.5" />
      <line x1="14" y1="11" x2="14" y2="17" strokeWidth="1.5" />
    </svg>
  );
}

// 15. AI Architect / Architectural Advisor Icon (Precision Drafting Calipers / Compass — NO generic AI sparkles)
export function IconArchitect({ size = 18, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Precision compass pivot joint */}
      <circle cx="12" cy="3.5" r="2" strokeWidth="1.75" />
      <circle cx="12" cy="3.5" r="0.75" fill="currentColor" />
      {/* Caliper measuring legs */}
      <path d="m10.5 5-6 16" strokeWidth="1.75" strokeLinecap="round" />
      <path d="m13.5 5 6 16" strokeWidth="1.75" strokeLinecap="round" />
      {/* Vernier scale arc & alignment vertex */}
      <path d="M7.5 14.5a8 8 0 0 1 9 0" strokeWidth="1.5" />
      <line x1="12" y1="10" x2="12" y2="14.5" strokeWidth="1.25" />
      <circle cx="12" cy="14.5" r="1" fill="currentColor" />
    </svg>
  );
}

// 16. Traffic Surge Icon (Precision Step Load & Capacity Ceiling Ingress Telemetry)
export function IconSurge({ size = 16, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Telemetry coordinate grid */}
      <path d="M3 20h18" strokeWidth="1.75" />
      <path d="M3 4v16" strokeWidth="1.75" />
      {/* Rated SLA threshold ceiling line */}
      <line x1="3" y1="8" x2="21" y2="8" strokeWidth="1" strokeDasharray="2 2" />
      {/* Stepped traffic surge trajectory */}
      <path d="M3 17h5v-4h5v-7h5" strokeWidth="1.75" />
      {/* Directional ingress delta indicator */}
      <path d="m16 4 2.5 2L16 8" strokeWidth="1.5" />
      <circle cx="18" cy="6" r="1" fill="currentColor" />
    </svg>
  );
}

// 17. Fault Injection Icon (Precision IEEE Circuit Breaker Relay / Contact Interrupter)
export function IconChaos({ size = 16, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Primary transmission bus terminals */}
      <line x1="2" y1="12" x2="6.5" y2="12" strokeWidth="1.75" />
      <circle cx="8" cy="12" r="1.5" strokeWidth="1.5" />
      <circle cx="16" cy="12" r="1.5" strokeWidth="1.5" />
      <line x1="17.5" y1="12" x2="22" y2="12" strokeWidth="1.75" />
      {/* Tripped mechanical breaker blade (opened circuit) */}
      <line x1="8" y1="12" x2="15" y2="5" strokeWidth="2" />
      {/* Trip actuator fault indicator */}
      <circle cx="12" cy="18" r="3.5" strokeWidth="1.25" strokeDasharray="1.5 1.5" />
      <line x1="12" y1="16" x2="12" y2="18.5" strokeWidth="1.5" />
      <circle cx="12" cy="20" r="0.6" fill="currentColor" />
    </svg>
  );
}

// 18. Auto-Heal & Restore Icon (Resilient Closed-Loop Topology Equilibrium Recovery)
export function IconAutoHeal({ size = 16, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {/* Dual-arc self-healing feedback cycle */}
      <path d="M21 12a9 9 0 0 1-15.5 6.2L3 16" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M3 12a9 9 0 0 1 15.5-6.2L21 8" strokeWidth="1.75" strokeLinecap="round" />
      <polyline points="21 3 21 8 16 8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="3 21 3 16 8 16" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      {/* Central healthy equilibrium node */}
      <circle cx="12" cy="12" r="2.5" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2" />
    </svg>
  );
}

// 19. Export Spec Icon (Architectural Package Download Vector)
export function IconExport({ size = 16, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" strokeWidth="1.75" />
      <polyline points="7 10 12 15 17 10" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="15" x2="12" y2="3" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

// 20. Refresh / Sync Icon (Continuous Bidirectional State Synchronization)
export function IconRefresh({ size = 16, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" strokeWidth="1.75" strokeLinecap="round" />
      <polyline points="3 3 3 8 8 8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" strokeWidth="1.75" strokeLinecap="round" />
      <polyline points="16 21 21 21 21 16" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 21. Checkmark Icon (Double-Angle Precision Verification)
export function IconCheck({ size = 16, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// 22. Close / Dismiss Icon
export function IconClose({ size = 14, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// 23. Engineering Mastery / XP Badge (Hexagonal Achievement Node)
export function IconXP({ size = 14, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <polygon points="12 2 20 6.5 20 17.5 12 22 4 17.5 4 6.5 12 2" strokeWidth="1.75" />
      <polyline points="8 10 12 7 16 10" strokeWidth="1.5" />
      <polyline points="8 14 12 17 16 14" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

// 24. Engineering Principle / Insight Beacon (Calibrated Focus Core)
export function IconPrinciple({ size = 16, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M9 18h6" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M10 21h4" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6h8c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7z" strokeWidth="1.75" strokeLinejoin="round" />
      <line x1="12" y1="6" x2="12" y2="10" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// 25. Vector Direction Arrow (Precision Conduit Vector)
export function IconArrowRight({ size = 14, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <line x1="4" y1="12" x2="20" y2="12" strokeWidth="1.75" strokeLinecap="round" />
      <polyline points="13 5 20 12 13 19" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 26. Play Icon (Resume Live Simulation Stream)
export function IconPlay({ size = 16, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <polygon points="6 3 20 12 6 21 6 3" strokeWidth="1.75" fill="currentColor" fillOpacity="0.15" />
    </svg>
  );
}

// 27. Pause Icon (Freeze Flow for Deep Packet Inspection)
export function IconPause({ size = 16, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <rect x="6" y="4" width="4" height="16" rx="1" strokeWidth="1.75" fill="currentColor" fillOpacity="0.15" />
      <rect x="14" y="4" width="4" height="16" rx="1" strokeWidth="1.75" fill="currentColor" fillOpacity="0.15" />
    </svg>
  );
}

// 28. Platform & System Analytics Icon
export function IconAnalytics({ size = 16, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M3 3v18h18" strokeWidth="1.75" />
      <rect x="7" y="11" width="3" height="7" rx="1" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
      <rect x="12" y="7" width="3" height="11" rx="1" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
      <rect x="17" y="13" width="3" height="5" rx="1" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
      <path d="m7 7 4-3 4 3 5-4" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
