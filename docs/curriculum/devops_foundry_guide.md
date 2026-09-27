# Keel Operational Foundry: DevOps Handbook & Phoenix Project Mapping

This guide provides the complete pedagogical and architectural cross-reference between **Keel** and the canonical DevOps literature:
1. **The DevOps Handbook: How to Create World-Class Agility, Reliability, & Security in Technology Organizations** (Gene Kim, Jez Humble, Patrick Debois, John Willis).
2. **The Phoenix Project: A Novel About IT, DevOps, and Helping Your Business Win** (Gene Kim, Kevin Behr, George Spafford).

Keel translates the rigorous engineering disciplines described in these texts into a clear, humane, and accessible learning foundry designed specifically for **students, staff, and non-developers** operating client-facing systems backed by internet services.

---

## 1. The Core Philosophy: The Systems Foundry for Non-Developers

In *The Phoenix Project*, Parts Unlimited faces catastrophic failure not because its engineers cannot write code, but because **the organisation misunderstands how systems operate**: work is invisible, handoffs create delays, a single overburdened expert ("Brent") becomes an existential bottleneck, releases are chaotic gambles, and unplanned work drowns the team in emergency firefighting.

*The DevOps Handbook* formalises the antidote through **The Three Ways** and the **Four Types of Work**. Keel adopts this exact operational mindset:
- It strips away ephemeral tooling jargon to focus on **timeless operational principles**.
- It demonstrates how small reversible steps, automated verification, disciplined tier separation, and pervasive telemetry protect people from catastrophe.
- Every section pairs an accessible conceptual grounding with a real-world case study and an interactive, graded evaluation bench.

---

## 2. Core DevOps Principles Mapped to Keel

### The Three Ways

| The DevOps Principle (*DevOps Handbook*) | Industrial Meaning | Keel Section & Implementation | Case Study / Applied Scenario |
| :--- | :--- | :--- | :--- |
| **The First Way: Principles of Flow** (Left-to-Right) | Make work visible, reduce Work-in-Progress (WIP), decrease batch sizes, build quality in, eliminate handoffs and bottlenecks. | **Section 01 (Tools)**: Standardising the shared workbench.<br>**Section 05 (Integration)**: Small commits, continuous integration.<br>**Section 06 (Deployment)**: Reversible small batch releases. | **Case RC-01 (Riverside Clinic)**: Eliminating the single-laptop silo.<br>**Case NS-05 (North School)**: Small CI increments before results morning.<br>**Case SB-06 (St. Brigid's)**: Rehearsed ward-by-ward rollouts. |
| **The Second Way: Principles of Feedback** (Right-to-Left) | Fast feedback loops, automated telemetry, stopping the line when defects emerge (Andon cord), swarming on problems. | **Section 05 (Integration)**: The CI checklist as an Andon cord (red means stop immediately).<br>**Section 08 (Scale)**: Load protection and backpressure.<br>**Section 09 (Observability)**: Metrics, logs, traces, actionable alerts. | **Case NS-05**: Red build blocks release even at 21:00.<br>**Case LF-08 (Lantern Festival)**: Queues & caching protect database room.<br>**Case PF-09 (Pine Forest Delivery)**: 02:14 AM triage via metrics and logs. |
| **The Third Way: Continual Learning & Experimentation** | Psychological safety, blameless post-mortems, institutionalising knowledge, resilient system design. | **Section 07 (Maintain)**: Documentation, decoupling, eliminating "Brent" dependency.<br>**Section 11 (Futures)**: Data sovereignty, surviving technology shifts. | **Case SC-07 (Spark Charity)**: Modularising code so new volunteers can change receipts safely.<br>**Case WL-11 (Westfield Library)**: Portable, vendor-independent records. |

---

### The Four Types of Work (*The Phoenix Project*)

*The Phoenix Project* identifies that IT organisations handle four types of work, with the fourth being the silent destroyer of velocity:

1. **Business Projects**: Delivering direct value to users (e.g., Harbor Market public board, Citizen Benefits renewals).
2. **Internal Projects**: Building the foundational infrastructure (e.g., setting up automated CI checks, establishing shared workbenches).
3. **Changes**: Updates and deployments to existing systems (e.g., updating holiday stall hours, adding a nurse shift-swap button).
4. **Unplanned Work / Firefighting**: Emergency fixes caused by untested releases, missing rollbacks, or system outages (e.g., 02:14 AM parcel tracking failures, database locks at festival opening).

**How Keel Teaches This**:
Keel teaches learners that **unplanned work is not bad luck—it is the direct consequence of skipping the first three disciplines**. When Riverside Clinic keeps its only records on a single receptionist's laptop, Monday morning becomes unplanned panic. When St. Brigid Hospital deploys without a rollback path, nurse shift swaps become unplanned chaos. Keel provides the structural disciplines to keep unplanned work near zero.

---

### The Theory of Constraints & The "Brent" Problem

In *The Phoenix Project*, Brent is the lead engineer who must approve, fix, or understand every change. He is the constraint through which all work must flow, causing massive company-wide stagnation.

**How Keel Solves This**:
- **Section 01 (The Workbench)**: Replaces "the one machine that only one person knows how to open" with a versioned, shared workbench that any trained team member can operate on their first morning.
- **Section 07 (The Next Person)**: Explicitly attacks the single-hero anti-pattern: *"The expensive failure is a system that only runs on the machine of the person who left."* Systems must be decoupled and mapped so that someone arriving in six months can safely change one thing without needing a "Brent".

---

## 3. Comprehensive Module-by-Module Foundry Breakdown

### Module 01: The Workbench (`tools`)
* **DevOps Alignment**: *The DevOps Handbook* Chapter 6 ("Predictable and Repeatable Environments"), Version Control for everything.
* **Core Concept**: Eliminating local configuration drift and "it worked on my machine". An environment is distinct from tools. Version control is the collective memory of the system.
* **Case Study**: **Riverside Clinic (RC-01)**. Patient appointments are locked on a receptionist's private laptop. When they take ill, staff resort to paper chaos.
* **Operational Rule**: Work lives on a shared workbench with full commit history; secrets and private screen state must never be prerequisites for operating the system.

### Module 02: Platforms (`platforms`)
* **DevOps Alignment**: *The DevOps Handbook* Chapter 5 ("Designing for Loosely Coupled Architectures").
* **Core Concept**: Supporting diverse client interfaces (mobile, handheld, desktop) without duplicating backend state. One authoritative system of record behind multiple user-facing doors.
* **Case Study**: **City Hopper Transit (CH-02)**. Riders, inspectors, and depot night managers all interact with ticket records from different devices.
* **Operational Rule**: Multiple client surfaces may present the work, but they must all communicate with the same underlying authoritative records over clean network boundaries.

### Module 03: Design for People (`design`)
* **DevOps Alignment**: User-Centred Design, Cognitive Load Reduction, Error Prevention (Lean Product Development).
* **Core Concept**: System design is fundamentally human. Error states must communicate recovery steps in plain language rather than opaque technical codes.
* **Case Study**: **Citizen Benefits Renewal (CB-03)**. Stressed citizens renewing municipal support are confronted with a monolithic, failing 12-question form.
* **Operational Rule**: Break complex tasks into achievable stages; error messages must state what failed, what the user can do, and how to recover without losing progress.

### Module 04: Three Rooms (`tiers`)
* **DevOps Alignment**: *The DevOps Handbook* Chapter 5 ("Architecting for Fast, Safe Deployments"), Multitier Separation of Concerns.
* **Core Concept**: Strict separation of the three rooms:
  1. *Presentation Room* (Browser / Client): What the person sees.
  2. *Application Room* (Logic & Authorization): Where rules and policy run.
  3. *Database Room* (Persistence): Where truth is remembered.
* **Case Study**: **Harbor Market Stall Book (HM-04)**. A developer proposes running all editing and validation rules in the client browser to avoid hosting backend services.
* **Operational Rule**: Business rules and authorization must never reside solely in the client; if the deciding room goes down, the presentation room must honestly report unavailable status rather than inventing false data.

### Module 05: The Checklist That Runs (`integration`)
* **DevOps Alignment**: *The DevOps Handbook* Chapter 9 ("Enable Automated Testing") & Chapter 10 ("Continuous Integration").
* **Core Concept**: Automated CI pipelines as the team's automated quality gate and Andon cord. Every change triggers automated compilation, testing, and secret leak scanning.
* **Case Study**: **North School (NS-05)**. At 21:00 on the eve of national results day, an author offers a "tiny" unreviewed layout change that breaks mark privacy.
* **Operational Rule**: Red means stop. No matter the urgency, a failing build is blocked; morning opens on the last known-good green version. Secrets in logs constitute an automatic build failure.

### Module 06: Releasing Carefully (`deployment`)
* **DevOps Alignment**: *The DevOps Handbook* Chapter 11 ("Automate and Enable Low-Risk Releases"), Blue-Green / Canary Deployments, Feature Toggles.
* **Core Concept**: Decoupling deployment from release. Deploying in small, incremental batches with an automated, rehearsed rollback pathway. Communicating changes clearly to operational staff.
* **Case Study**: **St. Brigid's Hospital (SB-06)**. A new nurse shift-swap button is ready. Deploying to the entire hospital at once risks stranding ICU wards without staffing.
* **Operational Rule**: Roll out progressively (canary ward first); never release without a verified, rehearsed way back that night coordinators can execute without engineering assistance.

### Module 07: The Next Person (`maintain`)
* **DevOps Alignment**: *The Phoenix Project* Chapter 30+, Reducing Technical Debt, Loosely Coupled Modular Systems.
* **Core Concept**: Designing systems to survive personnel turnover. Decoupling customer-facing UI changes from core financial or transaction records.
* **Case Study**: **Spark Charity (SC-07)**. A small non-profit has donor thank-you notes tangled directly with payment gateway processing. A volunteer editing a thank-you note risks taking down donations.
* **Operational Rule**: Separate presentation text from transaction invariants; maintain a clear architecture map so a newcomer can safely update one component without risking catastrophic side-effects.

### Module 08: When the Line Gets Long (`scale`)
* **DevOps Alignment**: *The DevOps Handbook* Chapter 14 ("Telemetry to Enable Feedback"), Load Shedding, Queuing Theory.
* **Core Concept**: Scalability under sudden traffic spikes. Differentiating read workloads (which can be cached at the edge) from write workloads (which must be queued and serialized to preserve consistency).
* **Case Study**: **Lantern Festival (LF-08)**. 1,000,000 citizens attempt to purchase tickets at exactly 10:00 AM.
* **Operational Rule**: Cache public announcements and timetables; protect the transaction database by queuing write requests and applying backpressure rather than letting concurrent locks crash the persistence layer.

### Module 09: Seeing the System (`observe`)
* **DevOps Alignment**: *The DevOps Handbook* Chapter 14 & 15 ("Telemetry to Anticipate Problems", "Feedback to Enable Safe Operations").
* **Core Concept**: Observability through the three pillars of telemetry: Structured Logs, Metrics, and Distributed Traces. Detecting anomalies before end-users report them; eliminating alert fatigue.
* **Case Study**: **Pine Forest Delivery (PF-09)**. At 02:14 AM, driver package location tracking freezes.
* **Operational Rule**: An actionable alert must specify what is broken and what action to take; non-critical anomalies (e.g., one slow thumbnail) must not page on-call staff in the middle of the night.

### Module 10: Who, and What They May Do (`security`)
* **DevOps Alignment**: *The DevOps Handbook* Part V ("Integrating Information Security, Change Management, and Compliance" / DevSecOps).
* **Core Concept**: Security as an intrinsic daily discipline. Principle of least privilege, strict separation between identity authentication and resource authorization, audit trails, and encrypted data at rest.
* **Case Study**: **Westfield College (WC-10)**. A gradebook system exposes student exam marks to other students and shares administrative credentials across faculty.
* **Operational Rule**: Users must authenticate individually; access rights are governed by explicit roles; credentials must never be shared; administrative operations must leave an unalterable audit log.

### Module 11: What Changes, What Holds (`futures`)
* **DevOps Alignment**: Continual Learning, Architecture Evolution, Data Sovereignty, Antifragility.
* **Core Concept**: Navigating technological changes (AI assistance, serverless runtimes, edge computing) without sacrificing foundational operational invariants. Avoiding vendor lock-in.
* **Case Study**: **Westfield Public Library (WL-11)**. A vendor pitches a proprietary AI voice booking system that requires migrating all community membership records into a locked cloud silo.
* **Operational Rule**: Embrace modern interfaces and automation, but ensure core organizational records remain exportable, standard, and sovereign.

---

## 4. The Capstone: Harbor Market End-to-End Foundry

The **Harbor Market Brief** serves as the capstone evaluation for the entire curriculum, synthesising all 11 disciplines into an interconnected municipal operating system:

1. **The Shared Workbench**: Market office staff and contractors operate from a single version-controlled repository with automated linting and tests, rather than scattered personal laptops.
2. **The Three Doors**: Shoppers (mobile web), stallholders (phone management), and market administrators (desktop accounting) interact with the market through tailored interfaces backed by a single authoritative database.
3. **Humane Design**: The public board provides instant, accessible answers regarding open stalls, market hours, and stallholder notices in clear language.
4. **Three-Tier Architecture**: The public board displays cached read-only stall listings; stall modifications are routed through the secure application layer; the database holds the durable system of record.
5. **Continuous Integration**: The automated CI suite validates schema migrations, security policies, and markup integrity on every pull request, halting builds that fail quality gates.
6. **Rehearsed Rollouts**: Board layout updates are released canary-style during off-peak hours with verified rollback procedures before Saturday market rushes.
7. **Maintainable Decoupling**: Market notice updates are decoupled from Saturday evening accounting ledgers, allowing volunteers to update news without touching payment reconciliation.
8. **Scalable Resilience**: When festival crowds surge on weekend mornings, edge caching serves public stall listings while order queues buffer stallholder status updates.
9. **Actionable Observability**: Telemetry tracks request latencies and database pool health; automated alerts notify market staff only when critical business functions are impaired.
10. **Role-Based Security**: Stallholders can only edit their designated stalls; financial summaries are restricted to market directors; passwords and session tokens adhere to modern cryptographic standards.
11. **Future Adaptability**: New client experiences (voice interfaces, AI tutors, SMS dispatch) can be integrated via standard APIs without relinquishing ownership of market data.

By completing this brief, learners demonstrate that they do not merely know technical buzzwords—they possess the operational judgment required to build and sustain real-world systems that people depend upon.
