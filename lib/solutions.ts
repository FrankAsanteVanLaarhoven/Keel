import { briefAnswers, benchAnswers, checkAnswers, decisionAnswers } from "./server/answers";

export type TierSolution = {
  tier: number;
  name: string;
  component: string;
  role: string;
  optimalConfig: string;
  failureMode: string;
  productionRationale: string;
};

export type DecisionSolution = {
  id: string;
  title: string;
  optimalKey: string;
  optimalTitle: string;
  rationale: string;
  tradeOffs: string;
  alternativePitfalls: string;
};

export type CaseSolution = {
  sectionId: string;
  number: string;
  title: string;
  bench: {
    type: "order" | "single" | "multi" | "label";
    solutionText: string;
    pedagogy: string;
  };
  decisions: {
    questionId: string;
    optimalChoice: string;
    explanation: string;
  }[];
  architectureTakeaway: string;
};

export type FoundryMissionSolution = {
  id: string;
  name: string;
  objective: string;
  failureMechanism: string;
  optimalMitigation: string;
  sreRunbook: string[];
};

export const harborTierSolutions: TierSolution[] = [
  {
    tier: 1,
    name: "Edge Perimeter & Traffic Management",
    component: "Cloudflare Edge WAF & Anycast DNS",
    role: "Absorbs DDoS bursts, enforces IP-based rate limiting, and terminates TLS 1.3 at edge points of presence.",
    optimalConfig: "WAF rate limit configured to 100 req/min per IP with challenge heuristics; static assets served with Cache-Control immutable.",
    failureMode: "Exposing application servers directly to public DNS allows brute-force flooding and direct DDoS amplification attacks.",
    productionRationale: "Shields internal compute instances from volumetric attacks and reduces network egress latency for global traders.",
  },
  {
    tier: 2,
    name: "Session Guard & Identity Verification",
    component: "Better Auth Session Engine",
    role: "Validates authenticated sessions using cryptographic cookies and enforces role-based access control (RBAC).",
    optimalConfig: "HttpOnly, Secure, SameSite=Lax session cookies with server-side validation against distributed cache and WAL database.",
    failureMode: "Storing JWTs in localStorage exposes users to cross-site scripting (XSS) credential exfiltration; lack of revocation lists prevents kicking rogue sessions.",
    productionRationale: "Maintains zero-trust identity across all micro-routes while preventing credential leakage and session fixation.",
  },
  {
    tier: 3,
    name: "Application Compute & In-Memory Caching",
    component: "Stateless Node.js API Pods + Redis Cluster",
    role: "Executes business rules, validates bid/offer envelopes, and serves hot read traffic from memory.",
    optimalConfig: "Autoscaling container pods behind an internal Layer-7 load balancer; Redis configured with maxmemory-eviction and read replicas.",
    failureMode: "Monolithic sticky sessions that store user state in server memory crash all connected traders when a single container reboots.",
    productionRationale: "Stateless pods can scale from 2 to 50 replicas in seconds during harbor market opening hours without losing active sessions.",
  },
  {
    tier: 4,
    name: "Transactional Core & Read Scaling",
    component: "PostgreSQL Primary + Streaming Read Replicas",
    role: "Maintains strict ACID transactional integrity for cargo ownership deeds, payment escrow, and trade ledgers.",
    optimalConfig: "Single primary for writes with synchronous WAL streaming to standby; PgBouncer connection pooling; read queries routed to replicas.",
    failureMode: "Directly writing to multiple uncoordinated master databases causes split-brain data corruption and double-spending of harbor cargo.",
    productionRationale: "Guarantees that once a freight manifest or auction trade is committed, it cannot be duplicated, lost, or corrupted.",
  },
  {
    tier: 5,
    name: "Asynchronous Event Backbone",
    component: "Apache Kafka / Redpanda Distributed Log",
    role: "Decouples synchronous checkout requests from downstream warehouse dispatch, audit archiving, and notification pipelines.",
    optimalConfig: "Partitioned topics with replication factor of 3; at-least-once delivery with idempotent consumer handlers.",
    failureMode: "Executing third-party payment callbacks, warehouse dispatch, and email notifications synchronously inside the HTTP request loop causes connection timeouts and cascading thread pool exhaustion.",
    productionRationale: "Traders receive sub-50ms order confirmations while slow physical fulfillment operations process reliably in the background.",
  },
];

export const harborDecisionsBreakdown: DecisionSolution[] = [
  {
    id: "tools",
    title: "01. Engineering Tools & Collaboration",
    optimalKey: "shared",
    optimalTitle: "Shared Version Control & Issue Tracking",
    rationale: "Trunk-based development with peer code reviews and automated CI checks ensures full traceability of every system change.",
    tradeOffs: "Requires initial discipline and pipeline configuration, but eliminates 'it works on my machine' divergence.",
    alternativePitfalls: "Paper records cause operational blindness; isolated personal setups guarantee siloed knowledge and deployment chaos.",
  },
  {
    id: "platforms",
    title: "02. Platform & Client Architecture",
    optimalKey: "same",
    optimalTitle: "Unified Core Application Engine",
    rationale: "A single responsive Next.js application core shares business logic, types, and validation rules across mobile, handheld, and desktop views.",
    tradeOffs: "Responsive layout requires careful CSS breakpoint testing across devices.",
    alternativePitfalls: "Building separate bespoke codebases for each device triples engineering overhead and introduces divergent business bugs.",
  },
  {
    id: "design",
    title: "03. Interface & Workflow Design",
    optimalKey: "task",
    optimalTitle: "Task-Oriented High-Density Workspace",
    rationale: "Dock workers and harbor traders need immediate clarity on order status, cargo manifest, and dispatch queues rather than decorative animations.",
    tradeOffs: "Less flashy initial marketing aesthetic, but orders-of-magnitude higher operational speed and zero operator distraction.",
    alternativePitfalls: "Prioritizing decorative branding or complex animations creates latency and obscures critical cargo mismatch errors.",
  },
  {
    id: "tiers",
    title: "04. Tiered Boundary Enforcement",
    optimalKey: "application",
    optimalTitle: "Application Server Authoritative Validation",
    rationale: "All permissions, rate limits, credit checks, and transactional invariants must be verified on the server before reaching the database.",
    tradeOffs: "Requires rigorous server-side DTO parsing and validation schemas.",
    alternativePitfalls: "Relying on client-side browser checks allows malicious users to bypass pricing and quantity caps via curl or script injection.",
  },
  {
    id: "integration",
    title: "05. Continuous Integration & Quality Gating",
    optimalKey: "block",
    optimalTitle: "Automated Blocking Test Suites",
    rationale: "Pull requests cannot merge unless all unit, integration, and security tests pass cleanly in an automated sandbox.",
    tradeOffs: "Builds take 2-4 minutes before merge, requiring fast test runners.",
    alternativePitfalls: "Skipping CI or allowing broken builds into staging causes silent regressions that propagate straight to production.",
  },
  {
    id: "deployment",
    title: "06. Production Deployment Strategy",
    optimalKey: "small",
    optimalTitle: "Small Canary Releases with Instant Rollback",
    rationale: "Deploying tiny, incremental releases to 5% of traffic allows automated telemetry to verify zero spikes in error rate before full rollout.",
    tradeOffs: "Requires backward-compatible database migrations and canary routing.",
    alternativePitfalls: "Big-bang releases on Friday night inevitably trigger extended downtime, missing rollback runbooks, and high panic.",
  },
  {
    id: "maintain",
    title: "07. Long-Term Maintainability",
    optimalKey: "apart",
    optimalTitle: "Decoupled Domain Modularization",
    rationale: "Isolating trade ledger, inventory storage, and billing into clear modules with strict interface contracts prevents spaghetti dependencies.",
    tradeOffs: "Initial boundary definition takes architecture design meetings.",
    alternativePitfalls: "Tightly coupling all tables and functions into an entangled monolith prevents any team from changing code without breaking other features.",
  },
  {
    id: "scale",
    title: "08. Scalability & Performance Engineering",
    optimalKey: "exact",
    optimalTitle: "Precision Bottleneck Profiling Before Scaling",
    rationale: "Measure CPU, memory, database query duration, and network I/O before throwing expensive hardware or blind caching at the problem.",
    tradeOffs: "Demands instrumentation and APM profiling skills.",
    alternativePitfalls: "Guessing bottlenecks leads to premature optimization or adding servers that simply saturate an unindexed database query even faster.",
  },
  {
    id: "observe",
    title: "09. Observability & Telemetry",
    optimalKey: "path",
    optimalTitle: "Distributed Request Tracing",
    rationale: "Tracing unique request IDs across Edge WAF, API gateway, cache, database, and event queues pinpoints the exact millisecond where delays occur.",
    tradeOffs: "Trace headers must be propagated across all internal service calls.",
    alternativePitfalls: "Relying on blind reboots or scattered unstructured logs leaves engineers guessing during high-stakes midnight outages.",
  },
  {
    id: "security",
    title: "10. Security & Threat Modeling",
    optimalKey: "own",
    optimalTitle: "Principle of Least Privilege & Scoped Credentials",
    rationale: "Each service and human operator holds only the minimum permissions required; root database credentials are never shared in code or chat.",
    tradeOffs: "Requires role-based access management and key rotation discipline.",
    alternativePitfalls: "Using shared super-admin credentials across developers guarantees credential leaks, untraceable data deletion, and compliance failure.",
  },
  {
    id: "futures",
    title: "11. Evolutionary Architecture & Sovereignty",
    optimalKey: "leave",
    optimalTitle: "Data Portability & Vendor Neutrality",
    rationale: "Design using standard SQL, open protocols (HTTP/REST, OIDC, Kafka), and local file fallback so the harbor platform can migrate cloud hosts at will.",
    tradeOffs: "Avoids seductive proprietary cloud lock-in features in favor of portable standards.",
    alternativePitfalls: "Deep reliance on closed vendor-specific databases locks the enterprise into exponential pricing hikes and impossible migration paths.",
  },
];

export const caseSolutionsList: CaseSolution[] = [
  {
    sectionId: "tools",
    number: "01",
    title: "Workspaces, Version Control & History",
    bench: {
      type: "order",
      solutionText: "Name → Open → Change → Save → Show",
      pedagogy: "Software construction follows a rigorous cycle: establish the identity/branch, inspect current state, apply modification, persist changes, and verify output.",
    },
    decisions: [
      { questionId: "where", optimalChoice: "shared", explanation: "Shared version control prevents accidental overwrites and ensures collaborative visibility." },
      { questionId: "memory", optimalChoice: "history", explanation: "Git commit history serves as an immutable log of architectural decisions." },
      { questionId: "fail", optimalChoice: "stop", explanation: "Failing builds must halt immediately rather than shipping broken code to downstream users." },
    ],
    architectureTakeaway: "Reliability begins in the developer environment: reproducible, shared, and versioned.",
  },
  {
    sectionId: "platforms",
    number: "02",
    title: "Platform Form Factors & Unified Core",
    bench: {
      type: "label",
      solutionText: "Rider → Phone, Inspector → Handheld, Night Dispatch → Desk",
      pedagogy: "Map specialized UI workflows to the ergonomic realities of the physical workplace (dockside mobile vs warehouse scanner vs desktop control room).",
    },
    decisions: [
      { questionId: "rider", optimalChoice: "phone", explanation: "Mobile view provides lightweight ergonomics for couriers and drivers on the move." },
      { questionId: "same", optimalChoice: "records", explanation: "All clients must query the same authoritative source of truth for freight records." },
      { questionId: "avoid", optimalChoice: "one", explanation: "Avoid building separate fragmented platforms when a responsive design system can serve all." },
    ],
    architectureTakeaway: "Unify the backend domain logic while adapting presentation to the user's physical environment.",
  },
  {
    sectionId: "design",
    number: "03",
    title: "Task-Centric UI & Ergonomic Clarity",
    bench: {
      type: "single",
      solutionText: "Sequence",
      pedagogy: "Complex data entry must be broken down into structured, verifiable sequential steps to eliminate human data entry error.",
    },
    decisions: [
      { questionId: "first", optimalChoice: "task", explanation: "Prioritize user task completion before aesthetic decoration." },
      { questionId: "error", optimalChoice: "plain", explanation: "Error messages must state clearly what failed and what the user can do to fix it in plain language." },
      { questionId: "access", optimalChoice: "keyboard", explanation: "High-speed warehouse operators rely on keyboard navigation and accessibility standards for rapid entry." },
    ],
    architectureTakeaway: "Software exists to empower human labor; ergonomic usability directly impacts operational error rates.",
  },
  {
    sectionId: "tiers",
    number: "04",
    title: "Three-Tier Architecture & Trust Boundaries",
    bench: {
      type: "label",
      solutionText: "See → Browser, Decide → Application, Remember → Database",
      pedagogy: "Strict separation of concerns: browser presents and captures, application computes and validates, database persists and indexes.",
    },
    decisions: [
      { questionId: "allowed", optimalChoice: "application", explanation: "Authorization checks must occur on the application server where credentials cannot be tampered with." },
      { questionId: "remember", optimalChoice: "database", explanation: "Only ACID databases provide durable persistence across system reboots." },
      { questionId: "public", optimalChoice: "browser", explanation: "Only sanitized presentation assets belong in the public client bundle." },
    ],
    architectureTakeaway: "Never trust the client. Enforce business rules and integrity at the server tier.",
  },
  {
    sectionId: "integration",
    number: "05",
    title: "Continuous Integration & Automated Testing",
    bench: {
      type: "order",
      solutionText: "Change → Checks → Review → Merge",
      pedagogy: "The path to production requires automated verification before human peer review, ensuring only tested code reaches main.",
    },
    decisions: [
      { questionId: "night", optimalChoice: "block", explanation: "Automated test failures must block integration, regardless of deadline pressure." },
      { questionId: "who", optimalChoice: "two", explanation: "Require at least two pairs of eyes (author + reviewer) on all production code." },
      { questionId: "secret", optimalChoice: "never", explanation: "Secrets and credentials must never be committed to repository logs." },
    ],
    architectureTakeaway: "Quality is an automated gate, not an afterthought.",
  },
  {
    sectionId: "deployment",
    number: "06",
    title: "Zero-Downtime Deployments & Canary Releases",
    bench: {
      type: "single",
      solutionText: "Small",
      pedagogy: "Deploy small, frequent changes to limit the blast radius of any individual regression.",
    },
    decisions: [
      { questionId: "size", optimalChoice: "small", explanation: "Small releases make root cause analysis trivial if an issue arises." },
      { questionId: "back", optimalChoice: "yes", explanation: "Every deployment must have an automated rollback plan tested in staging." },
      { questionId: "tell", optimalChoice: "staff", explanation: "Keep operations staff informed of deployment schedules and feature switches." },
    ],
    architectureTakeaway: "Release frequency reduces risk; big-bang deployments amplify it.",
  },
  {
    sectionId: "maintain",
    number: "07",
    title: "Domain Boundaries & Clean Architecture",
    bench: {
      type: "single",
      solutionText: "Apart",
      pedagogy: "Decouple systems into independent modules to prevent cascading change failures.",
    },
    decisions: [
      { questionId: "letter", optimalChoice: "apart", explanation: "Keep distinct business domains isolated with defined boundary interfaces." },
      { questionId: "owner", optimalChoice: "named", explanation: "Every service and critical path must have a named owner responsible for its health." },
      { questionId: "words", optimalChoice: "written", explanation: "Document architectural decisions in written RFCs/ADRs rather than relying on tribal memory." },
    ],
    architectureTakeaway: "Maintainability is designed into architecture via explicit boundaries and clear ownership.",
  },
  {
    sectionId: "scale",
    number: "08",
    title: "Capacity Planning, Caching & Bottlenecks",
    bench: {
      type: "single",
      solutionText: "Exact",
      pedagogy: "Identify exact performance bottlenecks through telemetry before applying scaling remedies.",
    },
    decisions: [
      { questionId: "first", optimalChoice: "exact", explanation: "Measure and benchmark baseline latency before altering caching or threading." },
      { questionId: "line", optimalChoice: "queue", explanation: "Use asynchronous message queues to buffer spiky incoming workloads." },
      { questionId: "cache", optimalChoice: "public", explanation: "Cache public, read-heavy data aggressively at the edge." },
    ],
    architectureTakeaway: "Premature scaling creates complexity. Measure first, isolate the bottleneck, then scale horizontally.",
  },
  {
    sectionId: "observe",
    number: "09",
    title: "Telemetry, Metrics, Logs & Tracing",
    bench: {
      type: "label",
      solutionText: "One → Trace, Count → Metric, Story → Log",
      pedagogy: "The three pillars of observability: traces follow individual requests, metrics aggregate trends over time, logs tell the detailed story.",
    },
    decisions: [
      { questionId: "night", optimalChoice: "trace", explanation: "Use distributed request tracing to locate which service is stalling during an incident." },
      { questionId: "alert", optimalChoice: "action", explanation: "Alerts must be actionable; alerts that don't require human action become alert fatigue noise." },
      { questionId: "quiet", optimalChoice: "no", explanation: "System telemetry must never be turned off during production operations." },
    ],
    architectureTakeaway: "You cannot debug what you cannot observe. Invest in structured telemetry from day zero.",
  },
  {
    sectionId: "security",
    number: "10",
    title: "Least Privilege & Defense-in-Depth",
    bench: {
      type: "multi",
      solutionText: "Shared + URL + Laptop",
      pedagogy: "Audit the three primary attack vectors: shared credentials, unauthenticated URL endpoints, and unencrypted laptops.",
    },
    decisions: [
      { questionId: "who", optimalChoice: "own", explanation: "Every operator authenticates with their own personal credentials with multi-factor authentication." },
      { questionId: "grades", optimalChoice: "role", explanation: "Role-based access control restricts sensitive grade and student records to authorized staff." },
      { questionId: "leak", optimalChoice: "least", explanation: "Enforce least privilege so compromised tokens cannot access global tables." },
    ],
    architectureTakeaway: "Security is not a product; it is a discipline of least privilege and continuous verification.",
  },
  {
    sectionId: "futures",
    number: "11",
    title: "Vendor Independence & Long-Term Data Rights",
    bench: {
      type: "single",
      solutionText: "Leave",
      pedagogy: "Architect systems so that your organization retains the technical ability to migrate or leave any cloud vendor.",
    },
    decisions: [
      { questionId: "keep", optimalChoice: "record", explanation: "Maintain durable, human-readable records and database dump archives." },
      { questionId: "prepare", optimalChoice: "exit", explanation: "Prepare an exit strategy before signing multi-year proprietary vendor contracts." },
      { questionId: "refuse", optimalChoice: "only", explanation: "Refuse single-vendor proprietary database formats when standard SQL alternatives exist." },
    ],
    architectureTakeaway: "Enterprise sovereignty depends on data portability and open standards.",
  },
];

export const foundryMissionSolutions: FoundryMissionSolution[] = [
  {
    id: "traffic-spike",
    name: "Mission 1: Ingress Surge & Circuit Breaking",
    objective: "Mitigate a 10x traffic spike without degrading core transaction processing.",
    failureMechanism: "Excessive simultaneous connections exhaust Node.js event loop threads and pool connections to the primary database.",
    optimalMitigation: "Activate client-side throttling at Tier 1 (Cloudflare WAF rate limiting), serve cached market catalog responses from Redis (Tier 3), and trip the circuit breaker on non-essential recommendation engines.",
    sreRunbook: [
      "1. Inspect Tier 1 Edge ingress graph for abnormal source IP concentrations.",
      "2. Enable WAF rate limit threshold of 100 req/min per client.",
      "3. Verify Redis hit ratio exceeds 94% on /catalog and /prices endpoints.",
      "4. Ensure primary PostgreSQL CPU load stabilizes under 65%.",
    ],
  },
  {
    id: "node-failover",
    name: "Mission 2: Server Outage & Self-Healing Failover",
    objective: "Simulate sudden node failure and verify zero dropped trades.",
    failureMechanism: "Sudden hardware failure of an API worker pod drops in-flight TCP sockets if connections are not gracefully drained.",
    optimalMitigation: "Kubelet / container supervisor detects unfulfilled liveness probes within 5 seconds, immediately reroutes traffic via Layer-7 load balancer to healthy replicas, and spins up a replacement pod.",
    sreRunbook: [
      "1. Inject fault into worker pod (simulate process SIGKILL).",
      "2. Confirm reverse proxy returns 502 to zero users due to automated retry on next healthy backend.",
      "3. Inspect pod health matrix; verify replacement pod reaches 'Ready' status within 8 seconds.",
    ],
  },
  {
    id: "cache-invalidation",
    name: "Mission 3: Thundering Herd Cache Stampede",
    objective: "Prevent database collapse when a hot cache key expires during peak trading.",
    failureMechanism: "Thousands of concurrent requests miss the expired Redis key simultaneously and fire identical expensive queries at PostgreSQL.",
    optimalMitigation: "Implement probabilistic early expiration (XFetch algorithm) or a distributed Redis mutex lock so only 1 worker regenerates the cache while others await the result.",
    sreRunbook: [
      "1. Flush hot market cache key '/harbor/active-bids'.",
      "2. Verify distributed mutex lock acquires on first requesting pod.",
      "3. Observe database connection pool: max connections must remain below threshold without connection timeouts.",
    ],
  },
  {
    id: "write-saturation",
    name: "Mission 4: Write Saturation & Replica Lag",
    objective: "Manage heavy trade settlement bursts without blocking read queries.",
    failureMechanism: "High-volume synchronous database inserts cause disk I/O saturation on the primary, leading to replication lag on read replicas.",
    optimalMitigation: "Buffer trade settlement events into the Tier 5 Kafka stream. Defer analytical updates and route all search/catalog queries exclusively to read replicas.",
    sreRunbook: [
      "1. Verify Kafka topic lag metrics stay bounded under 500 messages.",
      "2. Route reporting queries to read replica with read-committed isolation.",
      "3. Ensure primary disk write latency stays under 8ms.",
    ],
  },
  {
    id: "session-revocation",
    name: "Mission 5: Security Compromise & Immediate Token Revocation",
    objective: "Instantly invalidate compromised credentials across all distributed pods.",
    failureMechanism: "Stateless JWT tokens cannot be revoked before expiration without a centralized distributed blocklist.",
    optimalMitigation: "Better Auth session validator publishes token revocation to Redis pub/sub. All API pods invalidate local cache entry within 200ms.",
    sreRunbook: [
      "1. Flag compromised session ID in Admin Security Console.",
      "2. Verify session deletion broadcast over Redis pub/sub.",
      "3. Test subsequent request with compromised token; confirm immediate 401 Unauthorized response.",
    ],
  },
];
