import { q } from "./db.js";
import { notify, notifyRole } from "./notify.js";

const ONBOARDING_REMINDER_AFTER_DAYS = 3;

async function checkOverdueInvoices() {
  const { rows } = await q(
    `select i.*, c.name as client_name from invoices i
     left join clients c on c.id = i.client_id
     where i.status = 'unpaid' and i.due_date < current_date`
  );
  for (const inv of rows) {
    await q("update invoices set status='overdue' where id=$1", [inv.id]);
    const dueDate = new Date(inv.due_date).toISOString().slice(0, 10);
    await notifyRole(["admin"], {
      id: `n-inv-overdue-${inv.id}`,
      type: "invoice_overdue",
      title: `Invoice ${inv.number} is now overdue`,
      message: `Invoice ${inv.number} for ${inv.client_name || "a client"} passed its due date (${dueDate}) and is still unpaid.`,
      link: "/invoices",
    });
  }
}

async function checkStaleOnboarding() {
  const { rows } = await q(
    `select * from employees
     where status = 'onboarding'
       and join_date <= current_date - interval '${ONBOARDING_REMINDER_AFTER_DAYS} days'`
  );
  const today = new Date().toISOString().slice(0, 10);
  for (const emp of rows) {
    const pending = (emp.onboarding || []).filter((t) => !t.done);
    if (pending.length === 0) continue;
    const joinDate = new Date(emp.join_date).toISOString().slice(0, 10);
    await notify({
      id: `n-onboard-${emp.id}-${today}`,
      employeeId: emp.id,
      type: "onboarding_reminder",
      title: "Finish your onboarding checklist",
      message: `You still have ${pending.length} onboarding task(s) left: ${pending.map((t) => t.label).join(", ")}.`,
      link: "/",
    });
    await notifyRole(["admin"], {
      id: `n-onboard-admin-${emp.id}-${today}`,
      type: "onboarding_reminder",
      title: `${emp.name}'s onboarding is still incomplete`,
      message: `${emp.name} joined on ${joinDate} and still has ${pending.length} onboarding task(s) open.`,
      link: "/employees",
    });
  }
}

async function tick() {
  try {
    await checkOverdueInvoices();
    await checkStaleOnboarding();
  } catch (e) {
    console.error("[scheduler] tick failed:", e.message);
  }
}

export function startScheduler() {
  const minutes = Number(process.env.AUTOMATION_INTERVAL_MINUTES || 60);
  void tick(); // run once immediately so automation is visible right away
  setInterval(tick, minutes * 60 * 1000);
  console.log(`✓ automation scheduler running every ${minutes}m`);
}
