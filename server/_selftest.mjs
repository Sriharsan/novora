// Backend self-test: runs the real schema + representative queries on pg-mem.
// Not shipped to prod; used to validate SQL/queries without a live server.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { newDb } from "pg-mem";
import bcrypt from "bcryptjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mem = newDb();
const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
mem.public.none(schema);
const { Pool } = mem.adapters.createPg();
const pool = new Pool();
const q = (t, p) => pool.query(t, p);
const J = (v) => JSON.stringify(v ?? []);
let pass = 0, fail = 0;
const ok = (n) => { pass++; console.log("  ✓", n); };
const bad = (n, e) => { fail++; console.log("  ✗", n, "→", e.message); };

try {
  // seed a couple rows
  await q("insert into departments (id,name,head_id) values ($1,$2,$3)", ["d1", "Engineering", "e2"]);
  const pwHash = bcrypt.hashSync("admin123", 10);
  await q(
    `insert into employees (id,name,email,password_hash,role,title,department_id,manager_id,join_date,salary,status,avatar_color,leave_balance,onboarding)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14::jsonb)`,
    ["e1","Sri Harsan","admin@novora.app",pwHash,"admin","Admin","d1",null,"2023-01-10",4200000,"active","#6d5ef6",18,J([{label:"x",done:true}])]
  );
  ok("schema applies + employee insert with jsonb");

  // login flow
  const { rows } = await q("select * from employees where lower(email)=lower($1)", ["ADMIN@novora.app"]);
  if (rows[0] && bcrypt.compareSync("admin123", rows[0].password_hash)) ok("login select + bcrypt verify");
  else bad("login", new Error("no match"));

  // invoice with jsonb items
  await q("insert into invoices (id,number,client_id,issue_date,due_date,tax_rate,status,items) values ($1,$2,$3,$4,$5,$6,$7,$8::jsonb)",
    ["i1","NOV-1001",null,"2026-07-02","2026-07-20",18,"paid",J([{description:"x",qty:1,rate:1000}])]);
  ok("invoice insert with jsonb items");

  // upsert (PUT employee on conflict do update)
  await q(
    `insert into employees (id,name,email,password_hash,role,title,department_id,manager_id,join_date,salary,status,avatar_color,leave_balance,onboarding)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14::jsonb)
     on conflict (id) do update set name=$2,salary=$10`,
    ["e1","Sri H. Updated","admin@novora.app",pwHash,"admin","Admin","d1",null,"2023-01-10",5000000,"active","#6d5ef6",18,J([])]
  );
  const upd = await q("select name,salary from employees where id=$1", ["e1"]);
  if (upd.rows[0].name === "Sri H. Updated" && Number(upd.rows[0].salary) === 5000000) ok("employee upsert (on conflict update)");
  else bad("upsert", new Error("not updated"));

  // leave insert + status update
  await q(`insert into leave_requests (id,employee_id,type,from_date,to_date,days,reason,status) values ($1,$2,$3,$4,$5,$6,$7,$8)`,
    ["l1","e1","annual","2026-08-05","2026-08-08",4,"trip","pending"]);
  await q("update leave_requests set status=$2 where id=$1", ["l1","approved"]);
  const lv = await q("select status from leave_requests where id=$1", ["l1"]);
  if (lv.rows[0].status === "approved") ok("leave insert + approve"); else bad("leave", new Error("status"));

  // state aggregate selects
  const cnt = await q("select count(*)::int c from employees");
  if (cnt.rows[0].c === 1) ok("state select (employee count)"); else bad("count", new Error("count " + cnt.rows[0].c));

  console.log(`\n${fail === 0 ? "ALL PASS" : "FAILURES"}: ${pass} passed, ${fail} failed`);
  process.exit(fail === 0 ? 0 : 1);
} catch (e) {
  console.error("HARNESS ERROR:", e.message);
  process.exit(1);
}
