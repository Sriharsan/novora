import { pool, q } from "./db.js";
import { hash } from "./auth.js";

const colors = ["#6d5ef6","#12d8b6","#f59e0b","#ef4444","#3b82f6","#ec4899","#10b981","#8b5cf6","#f97316","#06b6d4"];
const onboarding = (done) => [
  { label: "Sign offer letter", done: true },
  { label: "Submit ID & bank details", done: true },
  { label: "IT setup & accounts", done },
  { label: "Assign buddy", done },
  { label: "First-week orientation", done: false },
];

const departments = [
  { id: "d1", name: "Engineering", head: "e2" },
  { id: "d2", name: "Finance", head: "e3" },
  { id: "d3", name: "People & HR", head: "e4" },
  { id: "d4", name: "Sales", head: "e5" },
  { id: "d5", name: "Design", head: "e6" },
];

const employees = [
  { id:"e1", name:"Sri Harsan", email:"admin@novora.app", pw:"admin123", role:"admin", title:"Founder / Admin", dep:"d3", mgr:null, join:"2023-01-10", salary:4200000, status:"active", bal:18, ob:true },
  { id:"e2", name:"Aarav Mehta", email:"aarav@novora.app", pw:"manager123", role:"manager", title:"Engineering Manager", dep:"d1", mgr:"e1", join:"2023-03-15", salary:3600000, status:"active", bal:12, ob:true },
  { id:"e3", name:"Priya Nair", email:"priya@novora.app", pw:"manager123", role:"manager", title:"Finance Manager", dep:"d2", mgr:"e1", join:"2023-02-20", salary:3300000, status:"active", bal:9, ob:true },
  { id:"e4", name:"Kabir Shah", email:"kabir@novora.app", pw:"manager123", role:"manager", title:"HR Manager", dep:"d3", mgr:"e1", join:"2023-05-05", salary:2800000, status:"active", bal:14, ob:true },
  { id:"e5", name:"Meera Iyer", email:"meera@novora.app", pw:"manager123", role:"manager", title:"Sales Lead", dep:"d4", mgr:"e1", join:"2023-06-12", salary:3000000, status:"active", bal:11, ob:true },
  { id:"e6", name:"Rohan Das", email:"rohan@novora.app", pw:"employee123", role:"employee", title:"Product Designer", dep:"d5", mgr:"e2", join:"2024-01-08", salary:1800000, status:"active", bal:15, ob:true },
  { id:"e7", name:"Ananya Rao", email:"ananya@novora.app", pw:"employee123", role:"employee", title:"Frontend Engineer", dep:"d1", mgr:"e2", join:"2024-02-19", salary:2100000, status:"active", bal:16, ob:true },
  { id:"e8", name:"Vikram Sinha", email:"vikram@novora.app", pw:"employee123", role:"employee", title:"Backend Engineer", dep:"d1", mgr:"e2", join:"2024-04-01", salary:2200000, status:"active", bal:13, ob:true },
  { id:"e9", name:"Isha Gupta", email:"isha@novora.app", pw:"employee123", role:"employee", title:"Accountant", dep:"d2", mgr:"e3", join:"2024-03-11", salary:1400000, status:"active", bal:17, ob:true },
  { id:"e10", name:"Dev Patel", email:"dev@novora.app", pw:"employee123", role:"employee", title:"Account Executive", dep:"d4", mgr:"e5", join:"2024-07-22", salary:1600000, status:"active", bal:12, ob:true },
  { id:"e11", name:"Sara Khan", email:"sara@novora.app", pw:"employee123", role:"employee", title:"QA Engineer", dep:"d1", mgr:"e2", join:"2024-09-02", salary:1500000, status:"active", bal:18, ob:true },
  { id:"e12", name:"Arjun Verma", email:"arjun@novora.app", pw:"employee123", role:"employee", title:"DevOps Engineer", dep:"d1", mgr:"e2", join:"2025-01-15", salary:2000000, status:"active", bal:20, ob:true },
  { id:"e13", name:"Nisha Menon", email:"nisha@novora.app", pw:"employee123", role:"employee", title:"HR Associate", dep:"d3", mgr:"e4", join:"2025-03-03", salary:1200000, status:"active", bal:19, ob:true },
  { id:"e14", name:"Farhan Ali", email:"farhan@novora.app", pw:"employee123", role:"employee", title:"Sales Associate", dep:"d4", mgr:"e5", join:"2025-05-19", salary:1100000, status:"active", bal:20, ob:true },
  { id:"e15", name:"Tara Joshi", email:"tara@novora.app", pw:"employee123", role:"employee", title:"UI Designer", dep:"d5", mgr:"e6", join:"2026-06-01", salary:1300000, status:"onboarding", bal:20, ob:false },
  { id:"e16", name:"Karan Bose", email:"karan@novora.app", pw:"employee123", role:"employee", title:"Data Analyst", dep:"d2", mgr:"e3", join:"2026-07-14", salary:1700000, status:"onboarding", bal:20, ob:false },
];

const clients = [
  { id:"c1", name:"Brightwave Retail", email:"ap@brightwave.com" },
  { id:"c2", name:"Nimbus Logistics", email:"billing@nimbus.io" },
  { id:"c3", name:"Orchid Health", email:"finance@orchidhealth.com" },
  { id:"c4", name:"Quartz Media", email:"accounts@quartzmedia.co" },
  { id:"c5", name:"Vantage Fintech", email:"ap@vantage.com" },
  { id:"c6", name:"Kova Industries", email:"billing@kova.io" },
];

const invoices = [
  { id:"i1", number:"NOV-1001", client:"c1", issue:"2026-07-02", due:"2026-07-20", tax:18, status:"paid", items:[{description:"Enterprise platform — annual",qty:1,rate:1450000},{description:"Onboarding & migration",qty:1,rate:180000}] },
  { id:"i2", number:"NOV-1002", client:"c5", issue:"2026-07-04", due:"2026-07-22", tax:18, status:"paid", items:[{description:"Growth plan (120 seats)",qty:120,rate:7500}] },
  { id:"i3", number:"NOV-1003", client:"c6", issue:"2026-07-06", due:"2026-07-24", tax:18, status:"paid", items:[{description:"Custom integration suite",qty:1,rate:620000},{description:"Premium support — Q3",qty:1,rate:150000}] },
  { id:"i4", number:"NOV-1004", client:"c3", issue:"2026-07-08", due:"2026-07-26", tax:18, status:"paid", items:[{description:"Annual license (80 seats)",qty:80,rate:9500}] },
  { id:"i5", number:"NOV-1005", client:"c2", issue:"2026-07-12", due:"2026-08-12", tax:18, status:"paid", items:[{description:"Platform subscription — July",qty:1,rate:340000}] },
  { id:"i6", number:"NOV-1006", client:"c4", issue:"2026-07-18", due:"2026-08-18", tax:18, status:"unpaid", items:[{description:"Consulting — July sprint",qty:90,rate:4500}] },
  { id:"i7", number:"NOV-1007", client:"c1", issue:"2026-07-22", due:"2026-08-22", tax:18, status:"unpaid", items:[{description:"Add-on module — analytics",qty:1,rate:220000}] },
  { id:"i8", number:"NOV-1008", client:"c3", issue:"2026-06-15", due:"2026-07-15", tax:18, status:"overdue", items:[{description:"Implementation services",qty:1,rate:180000}] },
];

const expenses = [
  { id:"x1", emp:"e7", date:"2026-07-12", cat:"travel", desc:"Client visit — cab & flight", amt:18400, status:"approved", rc:"cab-flight.pdf" },
  { id:"x2", emp:"e10", date:"2026-07-20", cat:"meals", desc:"Team lunch after demo", amt:4200, status:"pending", rc:"lunch.jpg" },
  { id:"x3", emp:"e6", date:"2026-07-15", cat:"software", desc:"Figma annual seat", amt:12500, status:"approved", rc:"figma.pdf" },
  { id:"x4", emp:"e8", date:"2026-07-22", cat:"training", desc:"Backend performance course", amt:8900, status:"pending", rc:"course.pdf" },
  { id:"x5", emp:"e12", date:"2026-07-24", cat:"office", desc:"Mechanical keyboard", amt:6500, status:"rejected", rc:"keyboard.jpg" },
  { id:"x6", emp:"e14", date:"2026-07-26", cat:"travel", desc:"Sales roadshow fuel", amt:3100, status:"pending", rc:"fuel.jpg" },
];

const leave = [
  { id:"l1", emp:"e7", type:"annual", from:"2026-08-05", to:"2026-08-08", days:4, reason:"Family trip", status:"pending" },
  { id:"l2", emp:"e8", type:"sick", from:"2026-07-24", to:"2026-07-25", days:2, reason:"Fever", status:"approved" },
  { id:"l3", emp:"e11", type:"casual", from:"2026-08-12", to:"2026-08-12", days:1, reason:"Personal errand", status:"pending" },
  { id:"l4", emp:"e10", type:"annual", from:"2026-07-15", to:"2026-07-18", days:4, reason:"Vacation", status:"approved" },
  { id:"l5", emp:"e13", type:"unpaid", from:"2026-09-01", to:"2026-09-03", days:3, reason:"Relocation", status:"pending" },
];

const reviews = [
  { id:"r1", emp:"e7", cycle:"H1 2026", rating:4, summary:"Strong delivery on the dashboard revamp; great collaboration.", reviewer:"Aarav Mehta", goals:[{id:"g1",title:"Ship design system v2",progress:80},{id:"g2",title:"Reduce bundle size 20%",progress:55}] },
  { id:"r2", emp:"e8", cycle:"H1 2026", rating:5, summary:"Exceptional ownership of the payments service.", reviewer:"Aarav Mehta", goals:[{id:"g3",title:"99.9% API uptime",progress:95}] },
  { id:"r3", emp:"e10", cycle:"H1 2026", rating:3, summary:"Solid quarter; focus on pipeline hygiene next.", reviewer:"Meera Iyer", goals:[{id:"g4",title:"Close 12 deals",progress:60}] },
];

const payLine = (salary, id) => {
  const gross = Math.round(salary / 12);
  const tax = Math.round(gross * 0.1);
  const pf = Math.round(gross * 0.12);
  return { employeeId: id, gross, tax, pf, net: gross - tax - pf };
};
const activeLines = employees.filter((e) => e.status === "active").map((e) => payLine(e.salary, e.id));
const payroll = [
  { id:"p1", period:"2026-06", status:"paid", lines: activeLines },
  { id:"p2", period:"2026-07", status:"approved", lines: activeLines },
];

const attendance = [];
const active8 = employees.filter((e) => e.status === "active").slice(0, 8);
for (let d = 0; d < 5; d++) {
  const date = new Date(2026, 6, 27 + d).toISOString().slice(0, 10);
  active8.forEach((e, idx) => {
    const inH = 9 + (idx % 2), outH = 17 + (idx % 3);
    attendance.push({ id:`a-${e.id}-${d}`, emp:e.id, date, ci:`${String(inH).padStart(2,"0")}:${idx%2?"15":"05"}`, co:`${String(outH).padStart(2,"0")}:${idx%2?"40":"10"}`, hrs:outH-inH });
  });
}

const activity = [
  { id:"act1", actor:"Priya Nair", text:"marked invoice NOV-1005 as paid", kind:"finance" },
  { id:"act2", actor:"Kabir Shah", text:"approved sick leave for Vikram Sinha", kind:"hr" },
  { id:"act3", actor:"Ananya Rao", text:"requested 4 days annual leave", kind:"hr" },
  { id:"act4", actor:"System", text:"generated July 2026 payroll run", kind:"system" },
  { id:"act5", actor:"Farhan Ali", text:"submitted a travel expense claim", kind:"finance" },
];

const J = (v) => JSON.stringify(v);

async function main() {
  console.log("Seeding Novora database…");
  await q("truncate activity_log, expenses, invoices, clients, performance_reviews, payroll_runs, attendance, leave_requests, employees, departments restart identity cascade");

  for (const d of departments) await q("insert into departments (id,name,head_id) values ($1,$2,$3)", [d.id, d.name, d.head]);

  for (const e of employees)
    await q(
      `insert into employees (id,name,email,password_hash,role,title,department_id,manager_id,join_date,salary,status,avatar_color,leave_balance,onboarding)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14::jsonb)`,
      [e.id, e.name, e.email, hash(e.pw), e.role, e.title, e.dep, e.mgr, e.join, e.salary, e.status,
       colors[employees.indexOf(e) % colors.length], e.bal, J(onboarding(e.ob))]
    );

  for (const c of clients) await q("insert into clients (id,name,email) values ($1,$2,$3)", [c.id, c.name, c.email]);
  for (const i of invoices) await q("insert into invoices (id,number,client_id,issue_date,due_date,tax_rate,status,items) values ($1,$2,$3,$4,$5,$6,$7,$8::jsonb)", [i.id, i.number, i.client, i.issue, i.due, i.tax, i.status, J(i.items)]);
  for (const x of expenses) await q("insert into expenses (id,employee_id,date,category,description,amount,receipt_name,status) values ($1,$2,$3,$4,$5,$6,$7,$8)", [x.id, x.emp, x.date, x.cat, x.desc, x.amt, x.rc, x.status]);
  for (const l of leave) await q("insert into leave_requests (id,employee_id,type,from_date,to_date,days,reason,status) values ($1,$2,$3,$4,$5,$6,$7,$8)", [l.id, l.emp, l.type, l.from, l.to, l.days, l.reason, l.status]);
  for (const a of attendance) await q("insert into attendance (id,employee_id,date,clock_in,clock_out,hours) values ($1,$2,$3,$4,$5,$6)", [a.id, a.emp, a.date, a.ci, a.co, a.hrs]);
  for (const p of payroll) await q("insert into payroll_runs (id,period,status,lines) values ($1,$2,$3,$4::jsonb)", [p.id, p.period, p.status, J(p.lines)]);
  for (const r of reviews) await q("insert into performance_reviews (id,employee_id,cycle,rating,summary,reviewer,goals) values ($1,$2,$3,$4,$5,$6,$7::jsonb)", [r.id, r.emp, r.cycle, r.rating, r.summary, r.reviewer, J(r.goals)]);
  for (const a of activity) await q("insert into activity_log (id,actor,text,kind) values ($1,$2,$3,$4)", [a.id, a.actor, a.text, a.kind]);

  console.log(`✓ Seeded ${employees.length} employees, ${invoices.length} invoices, ${expenses.length} expenses.`);
  console.log("  Logins: admin@novora.app/admin123 · aarav@novora.app/manager123 · rohan@novora.app/employee123");
  await pool.end();
}
main().catch((e) => { console.error("seed failed:", e.message); process.exit(1); });
