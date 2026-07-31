import { q } from "./db.js";
import { sendMail } from "./mailer.js";

function nid() {
  return "n-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6);
}

// Pass an explicit `id` for time-based/scheduled notifications that must fire
// at most once (e.g. "invoice X went overdue") — the insert is idempotent via
// ON CONFLICT, so a re-run of the scheduler tick is a safe no-op.
export async function notify({ id, employeeId, type, title, message, link }) {
  if (!employeeId) return;
  const finalId = id || nid();
  const { rowCount } = await q(
    `insert into notifications (id,employee_id,type,title,message,link)
     values ($1,$2,$3,$4,$5,$6) on conflict (id) do nothing`,
    [finalId, employeeId, type, title, message, link || null]
  );
  if (rowCount === 0) return; // already sent this exact notification before

  const { rows } = await q("select email from employees where id=$1", [employeeId]);
  const email = rows[0]?.email;
  if (email) {
    const sent = await sendMail({ to: email, subject: title, text: message });
    if (sent) await q("update notifications set email_sent=true where id=$1", [finalId]);
  }
}

export async function notifyRole(roles, payload) {
  const { rows } = await q("select id from employees where role = any($1)", [roles]);
  await Promise.all(rows.map((r) => notify({ ...payload, employeeId: r.id })));
}
