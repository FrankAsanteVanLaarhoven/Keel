import { describe, expect, it } from "vitest";
import {
  cscWeeks,
  decomposeOrders,
  freshStudents,
  innerLoans,
  junctionReady,
  leftLoans,
  matchTriples,
  orderLines,
  quorumRead,
  retrieve,
  runSql,
  seekPath,
  selectClass,
  patrons,
  transfer,
  tiers,
} from "../lib/csc1033";

describe("CSC1033", () => {
  it("lists twelve weeks and eight tiers", () => {
    expect(cscWeeks).toHaveLength(12);
    expect(new Set(cscWeeks.map((week) => week.id)).size).toBe(12);
    expect(tiers).toHaveLength(8);
    expect(cscWeeks[0].practicalTitle).toContain("None");
    expect(cscWeeks[1].practicalTitle).toContain("E-R");
    expect(cscWeeks[1].lectureTitle).toContain("6/10/26");
    for (const week of cscWeeks) {
      expect(week.checkOptions).toHaveLength(4);
      expect(week.checkAnswer).toBeGreaterThanOrEqual(0);
      expect(week.checkAnswer).toBeLessThan(4);
    }
  });

  it("rejects a duplicate primary key and keeps a new one", () => {
    const first = runSql("INSERT INTO Students VALUES (103, 'Sam Okonkwo', '10B')", freshStudents());
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    const second = runSql("INSERT INTO Students VALUES (101, 'Copy', '10A')", first.tables);
    expect(second.ok).toBe(false);
    expect(second.message).toContain("Primary key uniqueness");
    const selected = runSql("SELECT Name FROM Students WHERE Class = '10A'", freshStudents());
    expect(selected.ok).toBe(true);
    if (selected.ok) expect(selected.rows.map((row) => row[0])).toEqual(["Alex Mercer", "Elena Rostova"]);
  });

  it("filters patrons, keeps an unmatched left row, and splits a repeated city", () => {
    expect(selectClass(patrons, "10A")).toHaveLength(2);
    expect(innerLoans().some((row) => row.Name === "Elena Rostova")).toBe(false);
    expect(leftLoans().find((row) => row.Name === "Elena Rostova")?.LoanID).toBeNull();
    const split = decomposeOrders(orderLines);
    expect(split.customers).toHaveLength(1);
    expect(split.orders).toHaveLength(2);
    expect(split.orders[0]).not.toHaveProperty("city");
  });

  it("seeks a key, rolls a transfer back, and answers the later studios", () => {
    expect(seekPath(72).hops[1]).toContain("65");
    expect(seekPath(72).seeks).toBeLessThan(seekPath(72).scans);
    const crashed = transfer(1000, 250, 200, true);
    expect(crashed).toMatchObject({ a: 1000, b: 250, committed: false });
    const committed = transfer(1000, 250, 200, false);
    expect(committed).toMatchObject({ a: 800, b: 450, committed: true });
    expect(retrieve("borrow books").map((note) => note.id)).toEqual(["D1"]);
    expect(matchTriples({ s: "*", p: "copyOf", o: "work:ledger" })).toHaveLength(2);
    expect(quorumRead(2).ok).toBe(true);
    expect(quorumRead(1).ok).toBe(false);
    expect(junctionReady({ junction: "Loans", studentFk: true, bookFk: true })).toBe(true);
    expect(junctionReady({ junction: "Books", studentFk: true, bookFk: true })).toBe(false);
  });
});
