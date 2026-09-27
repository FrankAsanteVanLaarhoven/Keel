"use client";

import { useState } from "react";
import {
  harborTierSolutions,
  harborDecisionsBreakdown,
  caseSolutionsList,
  foundryMissionSolutions,
  type TierSolution,
  type DecisionSolution,
  type CaseSolution,
  type FoundryMissionSolution,
} from "@/lib/solutions";
import { IconCheck, IconClose } from "./icons";

export function SolutionsBreakdown({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const [activeTab, setActiveTab] = useState<"harbor" | "cases" | "foundry">("harbor");
  const [selectedSection, setSelectedSection] = useState<string>("tools");

  return (
    <div className="mt-12 rounded-none border border-line bg-raised p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-copper" />
            <p className="kicker">Architectural Solutions & Outcomes</p>
          </div>
          <h2 className="mt-1 text-2xl font-medium tracking-tight">Capstone Master Key & Production Breakdown</h2>
          <p className="mt-1 text-sm text-soft">
            Comprehensive breakdown of optimal systems architecture, engineering trade-offs, and failure mode mitigations.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="self-start rounded-none border border-ink bg-ink px-4 py-2 text-sm font-medium text-paper transition-all hover:bg-opacity-90 md:self-auto"
        >
          {open ? "Hide Solutions Breakdown" : "Reveal Full Breakdown"}
        </button>
      </div>

      {open && (
        <div className="mt-8 border-t border-line pt-6">
          {/* Section Navigation Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-line pb-4">
            <button
              type="button"
              onClick={() => setActiveTab("harbor")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "harbor"
                  ? "border-b-2 border-copper bg-paper text-ink"
                  : "text-soft hover:text-ink"
              }`}
            >
              Harbor Market Capstone (5 Tiers & 11 Decisions)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("cases")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "cases"
                  ? "border-b-2 border-copper bg-paper text-ink"
                  : "text-soft hover:text-ink"
              }`}
            >
              11 Case Benches & Decisions
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("foundry")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "foundry"
                  ? "border-b-2 border-copper bg-paper text-ink"
                  : "text-soft hover:text-ink"
              }`}
            >
              Interactive Foundry SRE Playbooks
            </button>
          </div>

          {/* TAB 1: HARBOR CAPSTONE */}
          {activeTab === "harbor" && (
            <div className="mt-6 space-y-10">
              {/* 5 Architectural Tiers */}
              <div>
                <h3 className="text-lg font-medium">The 5 Harbor Architecture Tiers</h3>
                <p className="mt-1 text-sm text-soft">
                  Authoritative production tier topology designed for high-concurrency harbor auction trading.
                </p>
                <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {harborTierSolutions.map((t) => (
                    <div key={t.tier} className="border border-line bg-paper p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-copper">TIER 0{t.tier}</span>
                        <span className="text-xs font-medium text-soft">{t.component}</span>
                      </div>
                      <h4 className="mt-2 text-base font-medium">{t.name}</h4>
                      <p className="mt-2 text-xs leading-relaxed text-soft">{t.role}</p>

                      <div className="mt-3 border-t border-line/60 pt-3">
                        <p className="text-xs font-semibold text-ink">Optimal Production Config:</p>
                        <p className="mt-1 text-xs text-soft">{t.optimalConfig}</p>
                      </div>

                      <div className="mt-3 border-t border-line/60 pt-3">
                        <p className="text-xs font-semibold text-danger">Failure Mode If Neglected:</p>
                        <p className="mt-1 text-xs text-danger/90">{t.failureMode}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 11 Decisions Matrix */}
              <div>
                <h3 className="text-lg font-medium">11 Architectural Decisions — Master Key</h3>
                <p className="mt-1 text-sm text-soft">
                  Optimal choices, deep engineering rationale, and trade-offs for each system domain.
                </p>
                <div className="mt-4 space-y-4">
                  {harborDecisionsBreakdown.map((d) => (
                    <div key={d.id} className="border border-line bg-paper p-5">
                      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                        <h4 className="text-base font-medium">{d.title}</h4>
                        <span className="self-start rounded bg-copper/10 px-2.5 py-1 text-xs font-mono font-semibold text-copper sm:self-auto">
                          Optimal Choice: {d.optimalTitle} ({d.optimalKey})
                        </span>
                      </div>

                      <div className="mt-3 grid gap-4 text-xs md:grid-cols-3">
                        <div>
                          <p className="font-semibold text-ink">Engineering Rationale:</p>
                          <p className="mt-1 leading-relaxed text-soft">{d.rationale}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-ink">Trade-Offs & Costs:</p>
                          <p className="mt-1 leading-relaxed text-soft">{d.tradeOffs}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-danger">Alternative Pitfalls:</p>
                          <p className="mt-1 leading-relaxed text-danger/90">{d.alternativePitfalls}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 11 CASE BENCHES */}
          {activeTab === "cases" && (
            <div className="mt-6">
              {/* Case selector tabs */}
              <div className="flex flex-wrap gap-1 border-b border-line pb-2">
                {caseSolutionsList.map((c) => (
                  <button
                    key={c.sectionId}
                    type="button"
                    onClick={() => setSelectedSection(c.sectionId)}
                    className={`px-3 py-1.5 text-xs font-mono transition-colors ${
                      selectedSection === c.sectionId
                        ? "border border-ink bg-ink text-paper"
                        : "border border-line bg-paper text-soft hover:text-ink"
                    }`}
                  >
                    {c.number}. {c.sectionId.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Selected Case Content */}
              {(() => {
                const c = caseSolutionsList.find((item) => item.sectionId === selectedSection) || caseSolutionsList[0];
                return (
                  <div className="mt-6 space-y-6">
                    <div className="border border-line bg-paper p-5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-copper">CASE {c.number}</span>
                        <h3 className="text-lg font-medium">{c.title}</h3>
                      </div>
                      <p className="mt-2 text-xs italic text-soft">Takeaway: {c.architectureTakeaway}</p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Bench Solution */}
                      <div className="border border-line bg-paper p-5">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold uppercase tracking-wider text-copper">Bench Solution</h4>
                          <span className="text-xs font-mono text-soft">Type: {c.bench.type}</span>
                        </div>
                        <div className="mt-3 rounded border border-line/60 bg-raised p-3">
                          <p className="font-mono text-sm font-bold text-ink">{c.bench.solutionText}</p>
                        </div>
                        <p className="mt-3 text-xs leading-relaxed text-soft">{c.bench.pedagogy}</p>
                      </div>

                      {/* Case Decisions */}
                      <div className="border border-line bg-paper p-5">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-copper">Decisions Master Key</h4>
                        <div className="mt-3 space-y-3">
                          {c.decisions.map((d, idx) => (
                            <div key={d.questionId} className="border-b border-line/60 pb-3 last:border-b-0 last:pb-0">
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-xs text-soft">Question #{idx + 1} ({d.questionId})</span>
                                <span className="rounded bg-good/10 px-2 py-0.5 text-xs font-bold text-good">
                                  {d.optimalChoice}
                                </span>
                              </div>
                              <p className="mt-1 text-xs text-soft">{d.explanation}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 3: FOUNDRY LABS */}
          {activeTab === "foundry" && (
            <div className="mt-6 space-y-6">
              <p className="text-sm text-soft">
                Authoritative SRE incident response runbooks and architectural failure mitigations for Interactive Systems Foundry.
              </p>
              <div className="grid gap-6 md:grid-cols-2">
                {foundryMissionSolutions.map((m) => (
                  <div key={m.id} className="border border-line bg-paper p-5">
                    <span className="text-xs font-mono text-copper">SRE PLAYBOOK</span>
                    <h4 className="mt-1 text-base font-medium">{m.name}</h4>
                    <p className="mt-2 text-xs text-soft"><span className="font-semibold text-ink">Objective:</span> {m.objective}</p>

                    <div className="mt-3 border-t border-line/60 pt-3">
                      <p className="text-xs font-semibold text-danger">Root Failure Mechanism:</p>
                      <p className="mt-1 text-xs text-danger/90">{m.failureMechanism}</p>
                    </div>

                    <div className="mt-3 border-t border-line/60 pt-3">
                      <p className="text-xs font-semibold text-ink">Optimal Mitigation Pattern:</p>
                      <p className="mt-1 text-xs text-soft">{m.optimalMitigation}</p>
                    </div>

                    <div className="mt-3 border-t border-line/60 pt-3">
                      <p className="text-xs font-semibold text-copper">Operator SRE Runbook:</p>
                      <ul className="mt-1 space-y-1">
                        {m.sreRunbook.map((step) => (
                          <li key={step} className="font-mono text-[11px] text-soft">{step}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
