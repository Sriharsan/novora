// Pure finance/HR calculations — unit tested in calc.test.ts

export function payslipFor(annualSalary: number) {
  const gross = Math.round(annualSalary / 12);
  const tax = Math.round(gross * 0.1);
  const pf = Math.round(gross * 0.12);
  return { gross, tax, pf, net: gross - tax - pf };
}

export function daysBetween(from: string, to: string) {
  const d = (new Date(to).getTime() - new Date(from).getTime()) / 86400000;
  return Math.max(1, Math.round(d) + 1);
}

export function netProfit(revenue: number, payrollGross: number, expenses: number) {
  return revenue - payrollGross - expenses;
}
