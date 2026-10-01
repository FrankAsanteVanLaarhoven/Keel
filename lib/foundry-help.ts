export type HelpLink = { href: string; label: string };

export type HelpSection = {
  id: string;
  title: string;
  paragraphs: string[];
  links?: HelpLink[];
  points?: string[];
};

export const FOUNDRY_HELP: readonly HelpSection[] = [
  {
    id: "documentation",
    title: "Documentation",
    paragraphs: [
      "The Foundry guide is the documentation for the drawing desk. It covers the project, the diagrams, the check, the command line, and the extensions kept in this browser.",
      "The page you load is the class build. Load the page again to use the build that is running. This desk does not keep an archive of older copies.",
    ],
    links: [{ href: "/foundry/guide", label: "Foundry guide" }],
  },
  {
    id: "samples",
    title: "Samples",
    paragraphs: [
      "The Missions row on the desk opens a fictional class drawing. The cases stay fictional.",
      "The Template menu on the desk loads one of the sample drawings below. Place a screen, in Commands, drops the Harbor Library wireframe.",
    ],
    links: [
      { href: "/foundry?challenge=freeform", label: "Full Systems Architecture Lab" },
      { href: "/foundry?challenge=c1_security", label: "Shield the Naked Database" },
      { href: "/foundry?challenge=c2_design", label: "The Three-Tier Architecture" },
      { href: "/foundry?challenge=c3_cicd", label: "The Automated Andon Cord Pipeline" },
      { href: "/foundry?challenge=c4_scale", label: "The 10:00 AM Ticket Surge" },
      { href: "/foundry?challenge=c5_observability", label: "The 02:14 AM Observability Alert" },
      { href: "/foundry?challenge=c6_status", label: "The Status Request" },
    ],
    points: [
      "Harbor Market: 3-Tier E-Commerce",
      "Riverside Clinic: Zero-Trust Healthcare",
      "GitOps Automated CI/CD Delivery",
      "1,000,000 RPS Ticket Surge Topology",
      "Enterprise SRE Observability & Tracing",
      "Harbor Library domain",
    ],
  },
  {
    id: "extension-calls",
    title: "Extension calls",
    paragraphs: [
      "An extension calls keel.tool or keel.command. keel.tool adds a toolbox shape. keel.command receives the open diagram and can return a patch. The guide names the fields on that diagram and the limits on a patch.",
      "The script stays in this browser under keel.foundry.extensions.v1. The desk does not keep a plugin catalog, and it does not install a script from the web.",
    ],
    links: [{ href: "/foundry/guide#ext-start", label: "Extension calls in the guide" }],
  },
  {
    id: "drawing-file",
    title: "The drawing file",
    paragraphs: [
      "Export JSON writes specVersion 2.0-keel-foundry. A project holds sheets. A sheet holds shapes and links. That file is the model the desk reads and writes.",
    ],
  },
  {
    id: "questions",
    title: "Questions",
    paragraphs: [
      "This desk has no forum and no support inbox. A question about the class goes to Class. The class book is for a teacher or the super admin. Anyone else sees that sentence and a link to sign in.",
    ],
    links: [{ href: "/teach", label: "Class" }],
  },
  {
    id: "license",
    title: "License",
    paragraphs: [
      "Keel is licensed under Apache-2.0 to Frank Asante Van Laarhoven. The grant is the LICENSE file in the project.",
      "The grant has no key, no activation step, no device count, and no floating seat. The desk does not open a license manager.",
    ],
  },
];
