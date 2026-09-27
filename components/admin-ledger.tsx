"use client";

import { useEffect, useState, useMemo } from "react";
import type { Messages } from "@/lib/i18n/en";
import { useKeel } from "./keel-context";
import { SolutionsBreakdown } from "./solutions-breakdown";
import { briefAnswers, decisionAnswers, benchAnswers } from "@/lib/server/answers";
import { IconCheck, IconClose } from "./icons";

type Submission = {
  userId: string;
  displayName: string;
  email: string | null;
  role: string;
  itemId: string;
  kind: string;
  score: number;
  xp: number;
  detail: string | null;
  day: string | null;
  updatedAt: number;
  teacherFeedback: string | null;
  verified: number;
};

type CohortMetrics = {
  totalSubmissions: number;
  verifiedCount: number;
  uniqueStudents: number;
  harborCompleted: number;
  avgScorePercent: number;
};

export function AdminLedger({ m }: { m: Messages }) {
  const { me } = useKeel();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [metrics, setMetrics] = useState<CohortMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [kindFilter, setKindFilter] = useState<string>("all");
  const [verificationFilter, setVerificationFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState<"ledger" | "rubric">("ledger");

  // Selected Submission for Review Drawer
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [editScore, setEditScore] = useState<number>(1);
  const [editXp, setEditXp] = useState<number>(0);
  const [editFeedback, setEditFeedback] = useState<string>("");
  const [editVerified, setEditVerified] = useState<boolean>(true);
  const [savePending, setSavePending] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/submissions");
      if (res.status === 403 || res.status === 401) {
        setError("Teacher or Super Admin privileges are required to view the practical evaluation ledger.");
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setError("Failed to load submissions from ledger.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setSubmissions(data.submissions || []);
      setMetrics(data.cohort || null);
    } catch {
      setError("Network error connecting to evaluation portal.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  function openReview(sub: Submission) {
    setSelectedSub(sub);
    setEditScore(sub.score);
    setEditXp(sub.xp);
    setEditFeedback(sub.teacherFeedback || "");
    setEditVerified(sub.verified === 1);
    setSaveMessage(null);
  }

  async function handleSaveEvaluation(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSub) return;
    setSavePending(true);
    setSaveMessage(null);

    try {
      const res = await fetch("/api/admin/grade", {
        method: "POST",
        headers: { "content-type": "application/json", "x-keel": "1" },
        body: JSON.stringify({
          userId: selectedSub.userId,
          itemId: selectedSub.itemId,
          kind: selectedSub.kind,
          score: editScore,
          xp: editXp,
          teacherFeedback: editFeedback,
          verified: editVerified ? 1 : 0,
        }),
      });

      if (!res.ok) {
        setSaveMessage("Failed to save teacher evaluation override.");
        setSavePending(false);
        return;
      }

      setSaveMessage("Evaluation successfully recorded & verified.");
      // Update local state
      setSubmissions((prev) =>
        prev.map((s) =>
          s.userId === selectedSub.userId && s.itemId === selectedSub.itemId && s.kind === selectedSub.kind
            ? {
                ...s,
                score: editScore,
                xp: editXp,
                teacherFeedback: editFeedback,
                verified: editVerified ? 1 : 0,
                updatedAt: Date.now(),
              }
            : s
        )
      );
      if (selectedSub) {
        setSelectedSub({
          ...selectedSub,
          score: editScore,
          xp: editXp,
          teacherFeedback: editFeedback,
          verified: editVerified ? 1 : 0,
        });
      }
    } catch {
      setSaveMessage("Network error during evaluation save.");
    } finally {
      setSavePending(false);
    }
  }

  // Filtered Submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      if (kindFilter !== "all" && sub.kind !== kindFilter) return false;
      if (verificationFilter === "verified" && sub.verified !== 1) return false;
      if (verificationFilter === "pending" && sub.verified === 1) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = sub.displayName.toLowerCase().includes(q);
        const matchesEmail = sub.email ? sub.email.toLowerCase().includes(q) : false;
        const matchesItem = sub.itemId.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesItem) return false;
      }
      return true;
    });
  }, [submissions, kindFilter, verificationFilter, searchQuery]);

  // Parse details helper
  function parseDetail(detailStr: string | null) {
    if (!detailStr) return null;
    try {
      return JSON.parse(detailStr) as Record<string, unknown>;
    } catch {
      return { raw: detailStr };
    }
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-16">
        <div className="border border-danger/40 bg-danger/5 p-6">
          <p className="kicker text-danger">Access Restricted</p>
          <h1 className="mt-2 text-2xl font-medium tracking-tight text-ink">Super Admin & Teacher Evaluation Portal</h1>
          <p className="mt-3 text-sm leading-relaxed text-soft">{error}</p>
          <div className="mt-6 flex gap-4">
            <a href="/account" className="border border-ink bg-ink px-4 py-2 text-sm text-paper">
              Check Account Role
            </a>
            <a href="/sign-in" className="border border-line px-4 py-2 text-sm">
              Sign In with Staff Account
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-line pb-8 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-copper" />
            <p className="kicker">Pedagogical Oversight & Quality Gate</p>
          </div>
          <h1 className="mt-2 text-3xl font-medium tracking-tight md:text-4xl">
            Super Admin & Teacher Capstone Evaluation Portal
          </h1>
          <p className="mt-2 text-sm text-soft">
            Audit cohort practical outcomes, inspect student architectural decisions, and manually verify capstone results.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveView("ledger")}
            className={`border px-4 py-2 text-sm font-medium ${
              activeView === "ledger" ? "border-ink bg-ink text-paper" : "border-line bg-paper text-soft hover:text-ink"
            }`}
          >
            Submissions Ledger
          </button>
          <button
            type="button"
            onClick={() => setActiveView("rubric")}
            className={`border px-4 py-2 text-sm font-medium ${
              activeView === "rubric" ? "border-ink bg-ink text-paper" : "border-line bg-paper text-soft hover:text-ink"
            }`}
          >
            Master Key Rubric
          </button>
          <button
            type="button"
            onClick={() => void loadData()}
            className="border border-line px-3 py-2 text-sm text-soft hover:text-ink"
            title="Refresh Ledger"
          >
            ↻
          </button>
        </div>
      </div>

      {/* Cohort KPI Stat Cards */}
      {metrics && (
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
          <div className="border border-line bg-paper p-4">
            <p className="text-xs uppercase tracking-wider text-soft">Total Submissions</p>
            <p className="mt-2 text-2xl font-mono font-bold text-ink">{metrics.totalSubmissions}</p>
            <p className="mt-1 text-xs text-soft">Cohort practical entries</p>
          </div>
          <div className="border border-line bg-paper p-4">
            <p className="text-xs uppercase tracking-wider text-copper">Verified by Teacher</p>
            <p className="mt-2 text-2xl font-mono font-bold text-copper">{metrics.verifiedCount}</p>
            <p className="mt-1 text-xs text-soft">
              {metrics.totalSubmissions > 0
                ? `${Math.round((metrics.verifiedCount / metrics.totalSubmissions) * 100)}% audited`
                : "0% audited"}
            </p>
          </div>
          <div className="border border-line bg-paper p-4">
            <p className="text-xs uppercase tracking-wider text-good">Harbor Capstone Passes</p>
            <p className="mt-2 text-2xl font-mono font-bold text-good">{metrics.harborCompleted}</p>
            <p className="mt-1 text-xs text-soft">Full architecture briefs</p>
          </div>
          <div className="border border-line bg-paper p-4">
            <p className="text-xs uppercase tracking-wider text-soft">Active Learners</p>
            <p className="mt-2 text-2xl font-mono font-bold text-ink">{metrics.uniqueStudents}</p>
            <p className="mt-1 text-xs text-soft">Unique student profiles</p>
          </div>
          <div className="border border-line bg-paper p-4">
            <p className="text-xs uppercase tracking-wider text-soft">Cohort Pass Rate</p>
            <p className="mt-2 text-2xl font-mono font-bold text-ink">{metrics.avgScorePercent}%</p>
            <p className="mt-1 text-xs text-soft">Accepted on first attempt</p>
          </div>
        </div>
      )}

      {/* TAB 1: SUBMISSIONS LEDGER */}
      {activeView === "ledger" && (
        <div className="mt-8">
          {/* Controls Bar */}
          <div className="flex flex-col gap-3 border border-line bg-raised p-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-soft">Filter Kind:</label>
                <select
                  value={kindFilter}
                  onChange={(e) => setKindFilter(e.target.value)}
                  className="ms-2 border border-line bg-paper px-2 py-1 text-xs"
                >
                  <option value="all">All Components</option>
                  <option value="brief">Harbor Capstone Brief</option>
                  <option value="case">Cases 01–11</option>
                  <option value="bench">Benches 01–11</option>
                  <option value="foundry">Foundry Missions</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-soft">Audit Status:</label>
                <select
                  value={verificationFilter}
                  onChange={(e) => setVerificationFilter(e.target.value)}
                  className="ms-2 border border-line bg-paper px-2 py-1 text-xs"
                >
                  <option value="all">All Statuses</option>
                  <option value="verified">Verified by Teacher</option>
                  <option value="pending">Pending Cross-Check</option>
                </select>
              </div>
            </div>

            <div>
              <input
                type="text"
                placeholder="Search student name, email, or item..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-line bg-paper px-3 py-1.5 text-xs md:w-64"
              />
            </div>
          </div>

          {/* Submissions Table */}
          <div className="mt-4 overflow-x-auto border border-line bg-paper">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-line bg-raised font-mono uppercase text-soft">
                <tr>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Component</th>
                  <th className="px-4 py-3">Outcome</th>
                  <th className="px-4 py-3">Score & XP</th>
                  <th className="px-4 py-3">Audit Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-soft">
                      Loading submissions from ledger...
                    </td>
                  </tr>
                ) : filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-soft">
                      No matching student submissions recorded in this view.
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((sub) => (
                    <tr key={`${sub.userId}-${sub.itemId}-${sub.kind}`} className="hover:bg-raised/40">
                      <td className="px-4 py-3 font-medium">
                        <div>
                          <span className="text-ink">{sub.displayName}</span>
                          <span className="ms-2 rounded bg-line px-1.5 py-0.5 text-[10px] text-soft">
                            {sub.role}
                          </span>
                        </div>
                        {sub.email && <p className="text-[11px] text-soft">{sub.email}</p>}
                      </td>
                      <td className="px-4 py-3 font-mono">
                        <span className="font-semibold text-ink">{sub.itemId}</span>
                        <span className="ms-1.5 text-soft">({sub.kind})</span>
                      </td>
                      <td className="px-4 py-3">
                        {sub.score === 1 ? (
                          <span className="inline-flex items-center gap-1 font-medium text-good">
                            <span className="h-1.5 w-1.5 rounded-full bg-good" /> Accepted
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-soft">
                            <span className="h-1.5 w-1.5 rounded-full bg-soft" /> Not Yet
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono">
                        <span className="font-bold text-ink">{sub.score} pt</span> ·{" "}
                        <span className="text-copper">{sub.xp} XP</span>
                      </td>
                      <td className="px-4 py-3">
                        {sub.verified === 1 ? (
                          <span className="rounded bg-good/10 px-2 py-0.5 text-[11px] font-semibold text-good">
                            ✓ Verified
                          </span>
                        ) : (
                          <span className="rounded bg-line px-2 py-0.5 text-[11px] text-soft">
                            Pending Review
                          </span>
                        )}
                        {sub.teacherFeedback && (
                          <span className="ms-2 text-[10px] text-soft" title={sub.teacherFeedback}>
                            [Has Feedback]
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-soft">
                        {new Date(sub.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => openReview(sub)}
                          className="border border-line bg-paper px-3 py-1 font-medium text-ink hover:border-ink"
                        >
                          Review & Grade
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: MASTER KEY RUBRIC VIEW */}
      {activeView === "rubric" && (
        <div className="mt-8">
          <SolutionsBreakdown defaultOpen={true} />
        </div>
      )}

      {/* INSPECTION & GRADING DRAWER */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-xs">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col border border-line bg-paper shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <div>
                <p className="kicker">Teacher Evaluation & Cross-Check</p>
                <h3 className="text-lg font-medium">
                  {selectedSub.displayName} — {selectedSub.itemId} ({selectedSub.kind})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSub(null)}
                className="border border-line px-2.5 py-1 text-sm text-soft hover:text-ink"
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 text-xs">
              {/* Student choices vs Master Key Ground Truth */}
              {(() => {
                const detail = parseDetail(selectedSub.detail);
                const choices = (detail?.choices as Record<string, string>) || {};
                const note = (detail?.note as string) || "";

                // Retrieve ground truth if available
                let groundTruth: Record<string, string> | null = null;
                if (selectedSub.kind === "brief") {
                  groundTruth = briefAnswers;
                } else if (selectedSub.kind === "case") {
                  groundTruth = decisionAnswers[selectedSub.itemId as keyof typeof decisionAnswers] || null;
                }

                return (
                  <div className="space-y-4">
                    {/* Choices Comparison */}
                    {groundTruth ? (
                      <div>
                        <h4 className="font-semibold uppercase tracking-wider text-copper">
                          Decisions Audit: Student vs Optimal Ground Truth
                        </h4>
                        <div className="mt-2 divide-y divide-line/60 border border-line bg-raised">
                          {Object.entries(groundTruth).map(([qKey, optimalVal]) => {
                            const studentVal = choices[qKey];
                            const match = studentVal === optimalVal;
                            return (
                              <div key={qKey} className="flex items-center justify-between p-2">
                                <span className="font-mono text-soft">{qKey}</span>
                                <div className="flex items-center gap-3 font-mono">
                                  <span className={match ? "font-bold text-good" : "text-danger"}>
                                    Student: {studentVal || "(empty)"}
                                  </span>
                                  <span className="text-soft">· Optimal: {optimalVal}</span>
                                  {match ? (
                                    <span className="text-good font-bold">✓</span>
                                  ) : (
                                    <span className="text-danger font-bold">✗</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : detail ? (
                      <div>
                        <h4 className="font-semibold uppercase tracking-wider text-copper">Submitted Payload</h4>
                        <pre className="mt-2 max-h-40 overflow-auto border border-line bg-raised p-3 font-mono text-[11px]">
                          {JSON.stringify(detail, null, 2)}
                        </pre>
                      </div>
                    ) : null}

                    {/* Student Written Note */}
                    {note && (
                      <div>
                        <h4 className="font-semibold uppercase tracking-wider text-copper">
                          Student's Submitted Engineering Rationale ({note.length} chars)
                        </h4>
                        <div className="mt-2 border border-line bg-raised p-3 leading-relaxed text-ink italic">
                          "{note}"
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Evaluation Form */}
              <form onSubmit={handleSaveEvaluation} className="border-t border-line pt-4 space-y-4">
                <h4 className="font-semibold uppercase tracking-wider text-ink">Teacher Override & Grading Controls</h4>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-soft">Outcome Grade:</label>
                    <select
                      value={editScore}
                      onChange={(e) => setEditScore(Number(e.target.value))}
                      className="mt-1 w-full border border-line bg-paper px-3 py-2 text-xs"
                    >
                      <option value={1}>Accepted (1.0 - Pass)</option>
                      <option value={0}>Needs Revision (0.0 - Fail)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-soft">XP Awarded:</label>
                    <input
                      type="number"
                      min={0}
                      max={500}
                      value={editXp}
                      onChange={(e) => setEditXp(Number(e.target.value))}
                      className="mt-1 w-full border border-line bg-paper px-3 py-2 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editVerified}
                      onChange={(e) => setEditVerified(e.target.checked)}
                      className="h-4 w-4"
                    />
                    <span className="font-medium text-ink">Mark as Teacher Verified & Cross-Checked</span>
                  </label>
                  <p className="mt-1 text-[11px] text-soft">
                    Signals to other staff and the student that this practical submission has been manually inspected against the architectural ground truth.
                  </p>
                </div>

                <div>
                  <label className="block font-medium text-soft">Teacher Feedback & Pedagogical Notes:</label>
                  <textarea
                    rows={3}
                    placeholder="Provide constructive feedback or explain grading rationale to the student..."
                    value={editFeedback}
                    onChange={(e) => setEditFeedback(e.target.value)}
                    className="mt-1 w-full border border-line bg-paper p-2 text-xs"
                  />
                </div>

                {saveMessage && (
                  <p className="text-xs font-medium text-copper">{saveMessage}</p>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSub(null)}
                    className="border border-line px-4 py-2 text-xs text-soft hover:text-ink"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savePending}
                    className="border border-ink bg-ink px-4 py-2 text-xs font-medium text-paper disabled:opacity-50"
                  >
                    {savePending ? "Saving..." : "Save Evaluation"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
