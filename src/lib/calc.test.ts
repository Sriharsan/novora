import { describe, it, expect } from "vitest";
import { payslipFor, daysBetween, netProfit } from "./calc";
import { invoiceTotal, inr, initials } from "./format";

describe("payroll", () => {
  it("computes gross/tax/pf/net from annual salary", () => {
    const p = payslipFor(1200000); // 1,00,000 / month
    expect(p.gross).toBe(100000);
    expect(p.tax).toBe(10000);
    expect(p.pf).toBe(12000);
    expect(p.net).toBe(78000);
  });
  it("net always = gross - tax - pf", () => {
    const p = payslipFor(2350000);
    expect(p.net).toBe(p.gross - p.tax - p.pf);
  });
});

describe("leave days", () => {
  it("counts inclusive days", () => {
    expect(daysBetween("2026-08-05", "2026-08-08")).toBe(4);
  });
  it("single day is at least 1", () => {
    expect(daysBetween("2026-08-05", "2026-08-05")).toBe(1);
  });
});

describe("invoice totals", () => {
  it("computes subtotal, tax and total", () => {
    const t = invoiceTotal([{ qty: 2, rate: 1000 }, { qty: 1, rate: 500 }], 18);
    expect(t.sub).toBe(2500);
    expect(t.tax).toBe(450);
    expect(t.total).toBe(2950);
  });
});

describe("finance", () => {
  it("net profit is positive for the seeded demo book", () => {
    expect(netProfit(5200000, 2600000, 40000)).toBeGreaterThan(0);
  });
});

describe("formatters", () => {
  it("formats INR without decimals", () => {
    expect(inr(100000)).toContain("1,00,000");
  });
  it("builds initials", () => {
    expect(initials("Sri Harsan")).toBe("SH");
  });
});
