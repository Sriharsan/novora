import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { q } from "./db.js";
import { hash, compare, sign, auth } from "./auth.js";

dotenv.config();
const app = express();
app.use(express.json({ limit: "2mb" }));
app.use(
  cors({
    origin: (process.env.CORS_ORIGIN || "http://localhost:5173").split(","),
  })
);

// ---------- serializers (DB row -> frontend shape) ----------
const sEmployee = (r) => ({
  id: r.id, name: r.name, email: r.email, role: r.role, title: r.title,
  departmentId: r.department_id, managerId: r.manager_id,
  joinDate: r.join_date, salary: Number(r.salary), status: r.status,
  avatarColor: r.avatar_color, leaveBalance: r.leave_balance, onboarding: r.onboarding,
});
const sLeave = (r) => ({
  id: r.id, employeeId: r.employee_id, type: r.type, from: r.from_date, to: r.to_date,
  days: r.days, reason: r.reason, status: r.status, createdAt: r.created_at,
});
const sAtt = (r) => ({
  id: r.id, employeeId: r.employee_id, date: r.date, clockIn: r.clock_in,
  clockOut: r.clock_out, hours: Number(r.hours),
});
const sPay = (r) => ({ id: r.id, period: r.period, status: r.status, createdAt: r.created_at, lines: r.lines });
const sRev = (r) => ({
  id: r.id, employeeId: r.employee_id, cycle: r.cycle, rating: r.rating,
  summary: r.summary, reviewer: r.reviewer, goals: r.goals, createdAt: r.created_at,
});
const sInv = (r) => ({
  id: r.id, number: r.number, clientId: r.client_id, issueDate: r.issue_date,
  dueDate: r.due_date, taxRate: Number(r.tax_rate), status: r.status, items: r.items,
});
const sExp = (r) => ({
  id: r.id, employeeId: r.employee_id, date: r.date, category: r.category,
  description: r.description, amount: Number(r.amount), receiptName: r.receipt_name, status: r.status,
});

// ---------- health ----------
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// ---------- auth ----------
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  const { rows } = await q("select * from employees where lower(email)=lower($1)", [email]);
  const u = rows[0];
  if (!u || !compare(password, u.password_hash))
    return res.status(401).json({ error: "Invalid email or password." });
  res.json({ token: sign(u), user: sEmployee(u) });
});

const DEFAULT_ONBOARDING = [
  { label: "Sign offer letter", done: false },
  { label: "Submit ID & bank details", done: false },
  { label: "IT setup & accounts", done: false },
  { label: "Assign buddy", done: false },
  { label: "First-week orientation", done: false },
];

app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });
  const exists = await q("select 1 from employees where lower(email)=lower($1)", [email]);
  if (exists.rowCount) return res.status(409).json({ error: "Email already registered" });
  const id = "e-" + Date.now().toString(36);
  const { rows } = await q(
    `insert into employees (id,name,email,password_hash,role,title,department_id,join_date,salary,status,avatar_color,leave_balance,onboarding)
     values ($1,$2,$3,$4,'employee','New joiner',null,now(),0,'onboarding','#6d5ef6',20,$5::jsonb) returning *`,
    [id, name, email, hash(password), JSON.stringify(DEFAULT_ONBOARDING)]
  );
  res.json({ token: sign(rows[0]), user: sEmployee(rows[0]) });
});

// ---------- full state ----------
app.get("/api/state", auth(), async (_req, res) => {
  const [dep, emp, lv, att, pay, rev, cli, inv, exp, act] = await Promise.all([
    q("select * from departments order by name"),
    q("select * from employees order by created_at"),
    q("select * from leave_requests order by created_at desc"),
    q("select * from attendance order by date desc"),
    q("select * from payroll_runs order by created_at desc"),
    q("select * from performance_reviews order by created_at desc"),
    q("select * from clients order by name"),
    q("select * from invoices order by created_at desc"),
    q("select * from expenses order by created_at desc"),
    q("select * from activity_log order by at desc limit 40"),
  ]);
  res.json({
    departments: dep.rows.map((r) => ({ id: r.id, name: r.name, head: r.head_id })),
    employees: emp.rows.map(sEmployee),
    leave: lv.rows.map(sLeave),
    attendance: att.rows.map(sAtt),
    payroll: pay.rows.map(sPay),
    reviews: rev.rows.map(sRev),
    clients: cli.rows.map((r) => ({ id: r.id, name: r.name, email: r.email })),
    invoices: inv.rows.map(sInv),
    expenses: exp.rows.map(sExp),
    activity: act.rows.map((r) => ({ id: r.id, at: r.at, actor: r.actor, text: r.text, kind: r.kind })),
  });
});

// ---------- upsert helpers ----------
const J = (v) => JSON.stringify(v ?? []);

// employees
app.put("/api/employees/:id", auth(), async (req, res) => {
  const e = req.body;
  await q(
    `insert into employees (id,name,email,password_hash,role,title,department_id,manager_id,join_date,salary,status,avatar_color,leave_balance,onboarding)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14::jsonb)
     on conflict (id) do update set name=$2,email=$3,role=$5,title=$6,department_id=$7,manager_id=$8,join_date=$9,salary=$10,status=$11,avatar_color=$12,leave_balance=$13,onboarding=$14::jsonb`,
    [e.id, e.name, e.email, e.password ? hash(e.password) : hash("employee123"), e.role, e.title,
     e.departmentId, e.managerId, e.joinDate, e.salary, e.status, e.avatarColor, e.leaveBalance, J(e.onboarding)]
  );
  res.json({ ok: true });
});
app.patch("/api/employees/:id", auth(), async (req, res) => {
  const e = req.body;
  await q(
    `update employees set name=coalesce($2,name), title=coalesce($3,title), role=coalesce($4,role),
      department_id=coalesce($5,department_id), status=coalesce($6,status), salary=coalesce($7,salary),
      leave_balance=coalesce($8,leave_balance), onboarding=coalesce($9::jsonb,onboarding) where id=$1`,
    [req.params.id, e.name, e.title, e.role, e.departmentId, e.status, e.salary, e.leaveBalance,
     e.onboarding ? J(e.onboarding) : null]
  );
  res.json({ ok: true });
});
app.delete("/api/employees/:id", auth(), async (req, res) => {
  await q("delete from employees where id=$1", [req.params.id]);
  res.json({ ok: true });
});

// leave
app.put("/api/leave/:id", auth(), async (req, res) => {
  const l = req.body;
  await q(
    `insert into leave_requests (id,employee_id,type,from_date,to_date,days,reason,status,created_at)
     values ($1,$2,$3,$4,$5,$6,$7,$8,coalesce($9,now()))
     on conflict (id) do update set status=$8`,
    [l.id, l.employeeId, l.type, l.from, l.to, l.days, l.reason, l.status, l.createdAt]
  );
  res.json({ ok: true });
});

// payroll
app.put("/api/payroll/:id", auth(), async (req, res) => {
  const p = req.body;
  await q(
    `insert into payroll_runs (id,period,status,lines,created_at)
     values ($1,$2,$3,$4::jsonb,coalesce($5,now()))
     on conflict (id) do update set status=$3`,
    [p.id, p.period, p.status, J(p.lines), p.createdAt]
  );
  res.json({ ok: true });
});

// reviews
app.put("/api/reviews/:id", auth(), async (req, res) => {
  const r = req.body;
  await q(
    `insert into performance_reviews (id,employee_id,cycle,rating,summary,reviewer,goals,created_at)
     values ($1,$2,$3,$4,$5,$6,$7::jsonb,coalesce($8,now()))
     on conflict (id) do nothing`,
    [r.id, r.employeeId, r.cycle, r.rating, r.summary, r.reviewer, J(r.goals), r.createdAt]
  );
  res.json({ ok: true });
});

// invoices
app.put("/api/invoices/:id", auth(), async (req, res) => {
  const i = req.body;
  await q(
    `insert into invoices (id,number,client_id,issue_date,due_date,tax_rate,status,items)
     values ($1,$2,$3,$4,$5,$6,$7,$8::jsonb)
     on conflict (id) do update set status=$7`,
    [i.id, i.number, i.clientId, i.issueDate, i.dueDate, i.taxRate, i.status, J(i.items)]
  );
  res.json({ ok: true });
});
app.delete("/api/invoices/:id", auth(), async (req, res) => {
  await q("delete from invoices where id=$1", [req.params.id]);
  res.json({ ok: true });
});

// expenses
app.put("/api/expenses/:id", auth(), async (req, res) => {
  const x = req.body;
  await q(
    `insert into expenses (id,employee_id,date,category,description,amount,receipt_name,status)
     values ($1,$2,$3,$4,$5,$6,$7,$8)
     on conflict (id) do update set status=$8`,
    [x.id, x.employeeId, x.date, x.category, x.description, x.amount, x.receiptName, x.status]
  );
  res.json({ ok: true });
});

// activity
app.put("/api/activity/:id", auth(), async (req, res) => {
  const a = req.body;
  await q(
    `insert into activity_log (id,at,actor,text,kind) values ($1,coalesce($2,now()),$3,$4,$5)
     on conflict (id) do nothing`,
    [a.id, a.at, a.actor, a.text, a.kind]
  );
  res.json({ ok: true });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✓ Novora API on http://localhost:${PORT}`));
