export type WordingMode = "industry" | "plain" | "expand";

export type Term = { industry: string; plain: string; expand: string };

export const terms: Term[] = [
  { industry: "OpenTelemetry", plain: "a shared way to send traces", expand: "OpenTelemetry: a shared way to send traces and measurements" },
  { industry: "PostgreSQL", plain: "the database that keeps the records", expand: "PostgreSQL: a database that keeps records safely" },
  { industry: "Kubernetes", plain: "the system that runs many copies of a service", expand: "Kubernetes: a system that runs and restarts many copies of a service" },
  { industry: "Prometheus", plain: "the store of measurements", expand: "Prometheus: a store of measurements from a running service" },
  { industry: "Hypertext Transfer Protocol Secure", plain: "the web request rules with a lock", expand: "Hypertext Transfer Protocol Secure: the web request rules with a locked connection" },
  { industry: "HTTPS", plain: "the web request rules with a lock", expand: "HTTPS, Hypertext Transfer Protocol Secure: the web request rules with a locked connection" },
  { industry: "HTTP", plain: "the web request rules", expand: "HTTP, Hypertext Transfer Protocol: the rules for a web request and its answer" },
  { industry: "TCP", plain: "the reliable connection", expand: "TCP, Transmission Control Protocol: it checks that packets arrived and keeps them in order" },
  { industry: "DNS", plain: "the name-to-address book", expand: "DNS, Domain Name System: it turns a name into an address" },
  { industry: "JSON", plain: "a text shape for data", expand: "JSON, JavaScript Object Notation: a text shape for data" },
  { industry: "HTML", plain: "the marks that make a page", expand: "HTML, Hypertext Markup Language: the marks that structure a page" },
  { industry: "OAuth", plain: "permission to act for someone", expand: "OAuth, Open Authorization: permission for one service to act for someone" },
  { industry: "OIDC", plain: "a way to say who someone is", expand: "OIDC, OpenID Connect: a way to say who someone is, built on OAuth" },
  { industry: "RBAC", plain: "access by job", expand: "RBAC, role-based access control: what someone may do depends on their job" },
  { industry: "GDPR", plain: "the European rules for personal data", expand: "GDPR, General Data Protection Regulation: the European rules for personal data" },
  { industry: "DDoS", plain: "a flood meant to knock a service over", expand: "DDoS, distributed denial of service: a flood meant to knock a service over" },
  { industry: "DDOS", plain: "a flood meant to knock a service over", expand: "DDoS, distributed denial of service: a flood meant to knock a service over" },
  { industry: "DevOps", plain: "building and running as one practice", expand: "DevOps: development and operations as one continuous practice" },
  { industry: "FinOps", plain: "seeing and deciding cloud cost", expand: "FinOps: the practice of seeing cloud cost and deciding what to keep" },
  { industry: "Grafana", plain: "the board of charts", expand: "Grafana: a board of charts for a running service" },
  { industry: "Kafka", plain: "a queue that holds work", expand: "Kafka: a queue that holds work until a service can take it" },
  { industry: "Redis", plain: "a fast memory store", expand: "Redis: a fast store kept in memory" },
  { industry: "CI/CD", plain: "checks, then release", expand: "CI/CD, continuous integration and continuous delivery: checks, then the path that releases a change" },
  { industry: "API", plain: "a door one program uses to ask another", expand: "API, application programming interface: a door one program uses to ask another" },
  { industry: "CDN", plain: "copies kept near the reader", expand: "CDN, content delivery network: copies of files kept near the reader" },
  { industry: "WAF", plain: "a gate that blocks harmful web requests", expand: "WAF, web application firewall: a gate that blocks harmful web requests" },
  { industry: "JWT", plain: "a signed pass", expand: "JWT, JSON Web Token: a signed pass a server can check" },
  { industry: "MFA", plain: "a second proof besides the passphrase", expand: "MFA, multi-factor authentication: a second proof besides the passphrase" },
  { industry: "TLS", plain: "the lock on a connection", expand: "TLS, Transport Layer Security: the lock on a connection" },
  { industry: "SRE", plain: "the work of keeping a service up", expand: "SRE, site reliability engineering: the work of keeping a service up" },
  { industry: "SLA", plain: "the availability promise", expand: "SLA, service level agreement: the promise of how available a service will be" },
  { industry: "SLO", plain: "the availability target", expand: "SLO, service level objective: the target for how available a service should be" },
  { industry: "IAM", plain: "who may use which cloud resource", expand: "IAM, identity and access management: who may use which cloud resource" },
  { industry: "SSH", plain: "a protected way onto a machine", expand: "SSH, Secure Shell: a protected way onto a machine" },
  { industry: "SQL", plain: "the language for asking a database", expand: "SQL, Structured Query Language: the language for asking a database" },
  { industry: "URL", plain: "the address of a page", expand: "URL, uniform resource locator: the address of a page" },
  { industry: "AES", plain: "a common way to encrypt", expand: "AES, Advanced Encryption Standard: a common way to encrypt data" },
  { industry: "TDE", plain: "encryption kept on by the database", expand: "TDE, transparent data encryption: encryption the database keeps on" },
  { industry: "OTel", plain: "a shared way to send traces", expand: "OTel, OpenTelemetry: a shared way to send traces and measurements" },
  { industry: "K8s", plain: "the system that runs many copies of a service", expand: "K8s, Kubernetes: a system that runs and restarts many copies of a service" },
  { industry: "DORA", plain: "the four delivery numbers", expand: "DORA, DevOps Research and Assessment: how often you deploy, how long a change waits, how often a deploy fails, and how long a restore takes" },
  { industry: "GitHub", plain: "a shared host for the history", expand: "GitHub: a host where Git history can be shared" },
  { industry: "Git", plain: "the history on the machine", expand: "Git: the version history kept on the machine" },
  { industry: "TCP/IP", plain: "the connection and the packet address", expand: "TCP/IP: the reliable connection and the packet address, used together" },
  { industry: "IP", plain: "the packet address", expand: "IP, Internet Protocol: it moves packets from one network to another" },
  { industry: "CI", plain: "checks before a change is shared", expand: "CI, continuous integration: checks that run before a change is shared" },
  { industry: "CD", plain: "the path that releases a change", expand: "CD, continuous delivery: the path that releases a change" },
  { industry: "RPS", plain: "requests each second", expand: "RPS, requests per second: how many requests arrive in one second" },
  { industry: "rps", plain: "requests each second", expand: "rps, requests per second: how many requests arrive in one second" },
  { industry: "ms", plain: "milliseconds", expand: "ms, milliseconds: thousandths of a second" },
];

const ordered = [...terms].sort((a, b) => b.industry.length - a.industry.length);
const pattern = new RegExp(`(?<![A-Za-z0-9])(?:${ordered.map((term) => term.industry.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})(?![A-Za-z0-9])`, "g");
const byIndustry = new Map(terms.map((term) => [term.industry, term]));

export function wordingText(text: string, mode: WordingMode): string {
  if (mode === "industry") return text;
  return text.replace(pattern, (match) => {
    const term = byIndustry.get(match);
    if (!term) return match;
    if (mode === "plain") return term.plain;
    return `${match} (${term.expand})`;
  });
}

export const roomPlain: Record<string, string> = {
  client: "The person or program that asks",
  gateway: "The front door",
  auth: "The check of who someone is",
  compute: "The application that decides",
  cache: "A fast copy kept nearby",
  database: "The records that must last",
  queue: "A line of work waiting its turn",
  ci: "The checks before a change is shared",
  telemetry: "The measurements of the running service",
};
