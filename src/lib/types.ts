export type Role = "admin" | "manager" | "employee";

export type EmployeeStatus = "active" | "onboarding" | "inactive";

export interface Department {
  id: string;
  name: string;
  head?: string; // employee id
}

export interface OnboardingTask {
  label: string;
  done: boolean;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  password: string; // demo only — never do this in production
  role: Role;
  title: string;
  departmentId: string;
  managerId?: string;
  joinDate: string; // ISO
  salary: number; // annual
  status: EmployeeStatus;
  avatarColor: string;
  leaveBalance: number; // days remaining
  onboarding: OnboardingTask[];
}

export type LeaveType = "annual" | "sick" | "casual" | "unpaid";
export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: LeaveType;
  from: string;
  to: string;
  days: number;
  reason: string;
  status: ApprovalStatus;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  clockIn: string;
  clockOut: string;
  hours: number;
}

export type PayrollStatus = "draft" | "approved" | "paid";

export interface PayslipLine {
  employeeId: string;
  gross: number;
  tax: number;
  pf: number; // provident fund / deductions
  net: number;
}

export interface PayrollRun {
  id: string;
  period: string; // e.g. "2026-07"
  status: PayrollStatus;
  createdAt: string;
  lines: PayslipLine[];
}

export interface Goal {
  id: string;
  title: string;
  progress: number; // 0-100
}

export interface PerformanceReview {
  id: string;
  employeeId: string;
  cycle: string;
  rating: number; // 1-5
  summary: string;
  goals: Goal[];
  reviewer: string;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
}

export interface InvoiceItem {
  description: string;
  qty: number;
  rate: number;
}

export type InvoiceStatus = "paid" | "unpaid" | "overdue";

export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  taxRate: number; // percent
  status: InvoiceStatus;
}

export type ExpenseCategory =
  | "travel"
  | "meals"
  | "software"
  | "office"
  | "training"
  | "other";

export interface Expense {
  id: string;
  employeeId: string;
  date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  receiptName?: string;
  status: ApprovalStatus;
}

export interface Activity {
  id: string;
  at: string;
  actor: string;
  text: string;
  kind: "hr" | "finance" | "system";
}

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  emailSent: boolean;
  createdAt: string;
}

export interface Database {
  departments: Department[];
  employees: Employee[];
  leave: LeaveRequest[];
  attendance: AttendanceRecord[];
  payroll: PayrollRun[];
  reviews: PerformanceReview[];
  clients: Client[];
  invoices: Invoice[];
  expenses: Expense[];
  activity: Activity[];
}
