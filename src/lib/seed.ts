import type {
  Database,
  Employee,
  Invoice,
  Expense,
  LeaveRequest,
  PayrollRun,
  PerformanceReview,
  AttendanceRecord,
  Activity,
} from "./types";

const colors = [
  "#6d5ef6",
  "#12d8b6",
  "#f59e0b",
  "#ef4444",
  "#3b82f6",
  "#ec4899",
  "#10b981",
  "#8b5cf6",
  "#f97316",
  "#06b6d4",
];

const departments = [
  { id: "d1", name: "Engineering", head: "e2" },
  { id: "d2", name: "Finance", head: "e3" },
  { id: "d3", name: "People & HR", head: "e4" },
  { id: "d4", name: "Sales", head: "e5" },
  { id: "d5", name: "Design", head: "e6" },
];

function onboarding(done: boolean) {
  return [
    { label: "Sign offer letter", done: true },
    { label: "Submit ID & bank details", done: true },
    { label: "IT setup & accounts", done: done },
    { label: "Assign buddy", done: done },
    { label: "First-week orientation", done: false },
  ];
}

const rawEmployees: Omit<Employee, "avatarColor">[] = [
  { id: "e1", name: "Sri Harsan", email: "admin@novora.app", password: "admin123", role: "admin", title: "Founder / Admin", departmentId: "d3", joinDate: "2023-01-10", salary: 4200000, status: "active", leaveBalance: 18, onboarding: onboarding(true) },
  { id: "e2", name: "Aarav Mehta", email: "aarav@novora.app", password: "manager123", role: "manager", title: "Engineering Manager", departmentId: "d1", managerId: "e1", joinDate: "2023-03-15", salary: 3600000, status: "active", leaveBalance: 12, onboarding: onboarding(true) },
  { id: "e3", name: "Priya Nair", email: "priya@novora.app", password: "manager123", role: "manager", title: "Finance Manager", departmentId: "d2", managerId: "e1", joinDate: "2023-02-20", salary: 3300000, status: "active", leaveBalance: 9, onboarding: onboarding(true) },
  { id: "e4", name: "Kabir Shah", email: "kabir@novora.app", password: "manager123", role: "manager", title: "HR Manager", departmentId: "d3", managerId: "e1", joinDate: "2023-05-05", salary: 2800000, status: "active", leaveBalance: 14, onboarding: onboarding(true) },
  { id: "e5", name: "Meera Iyer", email: "meera@novora.app", password: "manager123", role: "manager", title: "Sales Lead", departmentId: "d4", managerId: "e1", joinDate: "2023-06-12", salary: 3000000, status: "active", leaveBalance: 11, onboarding: onboarding(true) },
  { id: "e6", name: "Rohan Das", email: "rohan@novora.app", password: "employee123", role: "employee", title: "Product Designer", departmentId: "d5", managerId: "e2", joinDate: "2024-01-08", salary: 1800000, status: "active", leaveBalance: 15, onboarding: onboarding(true) },
  { id: "e7", name: "Ananya Rao", email: "ananya@novora.app", password: "employee123", role: "employee", title: "Frontend Engineer", departmentId: "d1", managerId: "e2", joinDate: "2024-02-19", salary: 2100000, status: "active", leaveBalance: 16, onboarding: onboarding(true) },
  { id: "e8", name: "Vikram Sinha", email: "vikram@novora.app", password: "employee123", role: "employee", title: "Backend Engineer", departmentId: "d1", managerId: "e2", joinDate: "2024-04-01", salary: 2200000, status: "active", leaveBalance: 13, onboarding: onboarding(true) },
  { id: "e9", name: "Isha Gupta", email: "isha@novora.app", password: "employee123", role: "employee", title: "Accountant", departmentId: "d2", managerId: "e3", joinDate: "2024-03-11", salary: 1400000, status: "active", leaveBalance: 17, onboarding: onboarding(true) },
  { id: "e10", name: "Dev Patel", email: "dev@novora.app", password: "employee123", role: "employee", title: "Account Executive", departmentId: "d4", managerId: "e5", joinDate: "2024-07-22", salary: 1600000, status: "active", leaveBalance: 12, onboarding: onboarding(true) },
  { id: "e11", name: "Sara Khan", email: "sara@novora.app", password: "employee123", role: "employee", title: "QA Engineer", departmentId: "d1", managerId: "e2", joinDate: "2024-09-02", salary: 1500000, status: "active", leaveBalance: 18, onboarding: onboarding(true) },
  { id: "e12", name: "Arjun Verma", email: "arjun@novora.app", password: "employee123", role: "employee", title: "DevOps Engineer", departmentId: "d1", managerId: "e2", joinDate: "2025-01-15", salary: 2000000, status: "active", leaveBalance: 20, onboarding: onboarding(true) },
  { id: "e13", name: "Nisha Menon", email: "nisha@novora.app", password: "employee123", role: "employee", title: "HR Associate", departmentId: "d3", managerId: "e4", joinDate: "2025-03-03", salary: 1200000, status: "active", leaveBalance: 19, onboarding: onboarding(true) },
  { id: "e14", name: "Farhan Ali", email: "farhan@novora.app", password: "employee123", role: "employee", title: "Sales Associate", departmentId: "d4", managerId: "e5", joinDate: "2025-05-19", salary: 1100000, status: "active", leaveBalance: 20, onboarding: onboarding(true) },
  { id: "e15", name: "Tara Joshi", email: "tara@novora.app", password: "employee123", role: "employee", title: "UI Designer", departmentId: "d5", managerId: "e6", joinDate: "2026-06-01", salary: 1300000, status: "onboarding", leaveBalance: 20, onboarding: onboarding(false) },
  { id: "e16", name: "Karan Bose", email: "karan@novora.app", password: "employee123", role: "employee", title: "Data Analyst", departmentId: "d2", managerId: "e3", joinDate: "2026-07-14", salary: 1700000, status: "onboarding", leaveBalance: 20, onboarding: onboarding(false) },
];

const employees: Employee[] = rawEmployees.map((e, i) => ({
  ...e,
  avatarColor: colors[i % colors.length],
}));

const clients = [
  { id: "c1", name: "Brightwave Retail", email: "ap@brightwave.com" },
  { id: "c2", name: "Nimbus Logistics", email: "billing@nimbus.io" },
  { id: "c3", name: "Orchid Health", email: "finance@orchidhealth.com" },
  { id: "c4", name: "Quartz Media", email: "accounts@quartzmedia.co" },
  { id: "c5", name: "Vantage Fintech", email: "ap@vantage.com" },
  { id: "c6", name: "Kova Industries", email: "billing@kova.io" },
];

// Healthy, profitable book: strong paid revenue, a little receivable.
const invoices: Invoice[] = [
  { id: "i1", number: "NOV-1001", clientId: "c1", issueDate: "2026-07-02", dueDate: "2026-07-20", taxRate: 18, status: "paid", items: [{ description: "Enterprise platform — annual", qty: 1, rate: 1450000 }, { description: "Onboarding & migration", qty: 1, rate: 180000 }] },
  { id: "i2", number: "NOV-1002", clientId: "c5", issueDate: "2026-07-04", dueDate: "2026-07-22", taxRate: 18, status: "paid", items: [{ description: "Growth plan (120 seats)", qty: 120, rate: 7500 }] },
  { id: "i3", number: "NOV-1003", clientId: "c6", issueDate: "2026-07-06", dueDate: "2026-07-24", taxRate: 18, status: "paid", items: [{ description: "Custom integration suite", qty: 1, rate: 620000 }, { description: "Premium support — Q3", qty: 1, rate: 150000 }] },
  { id: "i4", number: "NOV-1004", clientId: "c3", issueDate: "2026-07-08", dueDate: "2026-07-26", taxRate: 18, status: "paid", items: [{ description: "Annual license (80 seats)", qty: 80, rate: 9500 }] },
  { id: "i5", number: "NOV-1005", clientId: "c2", issueDate: "2026-07-12", dueDate: "2026-08-12", taxRate: 18, status: "paid", items: [{ description: "Platform subscription — July", qty: 1, rate: 340000 }] },
  { id: "i6", number: "NOV-1006", clientId: "c4", issueDate: "2026-07-18", dueDate: "2026-08-18", taxRate: 18, status: "unpaid", items: [{ description: "Consulting — July sprint", qty: 90, rate: 4500 }] },
  { id: "i7", number: "NOV-1007", clientId: "c1", issueDate: "2026-07-22", dueDate: "2026-08-22", taxRate: 18, status: "unpaid", items: [{ description: "Add-on module — analytics", qty: 1, rate: 220000 }] },
  { id: "i8", number: "NOV-1008", clientId: "c3", issueDate: "2026-06-15", dueDate: "2026-07-15", taxRate: 18, status: "overdue", items: [{ description: "Implementation services", qty: 1, rate: 180000 }] },
];

const expenses: Expense[] = [
  { id: "x1", employeeId: "e7", date: "2026-07-12", category: "travel", description: "Client visit — cab & flight", amount: 18400, status: "approved", receiptName: "cab-flight.pdf" },
  { id: "x2", employeeId: "e10", date: "2026-07-20", category: "meals", description: "Team lunch after demo", amount: 4200, status: "pending", receiptName: "lunch.jpg" },
  { id: "x3", employeeId: "e6", date: "2026-07-15", category: "software", description: "Figma annual seat", amount: 12500, status: "approved", receiptName: "figma.pdf" },
  { id: "x4", employeeId: "e8", date: "2026-07-22", category: "training", description: "Backend performance course", amount: 8900, status: "pending", receiptName: "course.pdf" },
  { id: "x5", employeeId: "e12", date: "2026-07-24", category: "office", description: "Mechanical keyboard", amount: 6500, status: "rejected", receiptName: "keyboard.jpg" },
  { id: "x6", employeeId: "e14", date: "2026-07-26", category: "travel", description: "Sales roadshow fuel", amount: 3100, status: "pending", receiptName: "fuel.jpg" },
];

const leave: LeaveRequest[] = [
  { id: "l1", employeeId: "e7", type: "annual", from: "2026-08-05", to: "2026-08-08", days: 4, reason: "Family trip", status: "pending", createdAt: "2026-07-28" },
  { id: "l2", employeeId: "e8", type: "sick", from: "2026-07-24", to: "2026-07-25", days: 2, reason: "Fever", status: "approved", createdAt: "2026-07-23" },
  { id: "l3", employeeId: "e11", type: "casual", from: "2026-08-12", to: "2026-08-12", days: 1, reason: "Personal errand", status: "pending", createdAt: "2026-07-29" },
  { id: "l4", employeeId: "e10", type: "annual", from: "2026-07-15", to: "2026-07-18", days: 4, reason: "Vacation", status: "approved", createdAt: "2026-07-01" },
  { id: "l5", employeeId: "e13", type: "unpaid", from: "2026-09-01", to: "2026-09-03", days: 3, reason: "Relocation", status: "pending", createdAt: "2026-07-30" },
];

function buildAttendance(): AttendanceRecord[] {
  const rec: AttendanceRecord[] = [];
  const active = employees.filter((e) => e.status === "active").slice(0, 8);
  for (let d = 0; d < 5; d++) {
    const date = new Date(2026, 6, 27 + d); // week of Jul 27
    active.forEach((e, idx) => {
      const inH = 9 + (idx % 2);
      const outH = 17 + (idx % 3);
      rec.push({
        id: `a-${e.id}-${d}`,
        employeeId: e.id,
        date: date.toISOString().slice(0, 10),
        clockIn: `${String(inH).padStart(2, "0")}:${idx % 2 ? "15" : "05"}`,
        clockOut: `${String(outH).padStart(2, "0")}:${idx % 2 ? "40" : "10"}`,
        hours: outH - inH,
      });
    });
  }
  return rec;
}

function payslipFor(salary: number, employeeId: string) {
  const gross = Math.round(salary / 12);
  const tax = Math.round(gross * 0.1);
  const pf = Math.round(gross * 0.12);
  return { employeeId, gross, tax, pf, net: gross - tax - pf };
}

const payroll: PayrollRun[] = [
  {
    id: "p1",
    period: "2026-06",
    status: "paid",
    createdAt: "2026-06-28",
    lines: employees.filter((e) => e.status === "active").map((e) => payslipFor(e.salary, e.id)),
  },
  {
    id: "p2",
    period: "2026-07",
    status: "approved",
    createdAt: "2026-07-27",
    lines: employees.filter((e) => e.status === "active").map((e) => payslipFor(e.salary, e.id)),
  },
];

const reviews: PerformanceReview[] = [
  { id: "r1", employeeId: "e7", cycle: "H1 2026", rating: 4, summary: "Strong delivery on the dashboard revamp; great collaboration.", reviewer: "Aarav Mehta", createdAt: "2026-06-30", goals: [{ id: "g1", title: "Ship design system v2", progress: 80 }, { id: "g2", title: "Reduce bundle size 20%", progress: 55 }] },
  { id: "r2", employeeId: "e8", cycle: "H1 2026", rating: 5, summary: "Exceptional ownership of the payments service.", reviewer: "Aarav Mehta", createdAt: "2026-06-30", goals: [{ id: "g3", title: "99.9% API uptime", progress: 95 }] },
  { id: "r3", employeeId: "e10", cycle: "H1 2026", rating: 3, summary: "Solid quarter; focus on pipeline hygiene next.", reviewer: "Meera Iyer", createdAt: "2026-06-30", goals: [{ id: "g4", title: "Close 12 deals", progress: 60 }] },
];

const activity: Activity[] = [
  { id: "act1", at: "2026-07-30T09:12:00", actor: "Priya Nair", text: "marked invoice NOV-1005 as paid", kind: "finance" },
  { id: "act2", at: "2026-07-29T16:40:00", actor: "Kabir Shah", text: "approved sick leave for Vikram Sinha", kind: "hr" },
  { id: "act3", at: "2026-07-28T11:05:00", actor: "Ananya Rao", text: "requested 4 days annual leave", kind: "hr" },
  { id: "act4", at: "2026-07-27T18:20:00", actor: "System", text: "generated July 2026 payroll run", kind: "system" },
  { id: "act5", at: "2026-07-26T14:02:00", actor: "Farhan Ali", text: "submitted a travel expense claim", kind: "finance" },
];

export function makeSeed(): Database {
  return {
    departments,
    employees,
    leave,
    attendance: buildAttendance(),
    payroll,
    reviews,
    clients,
    invoices,
    expenses,
    activity,
  };
}
