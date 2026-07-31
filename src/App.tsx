import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./lib/auth";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import OrgChart from "./pages/OrgChart";
import Leave from "./pages/Leave";
import Payroll from "./pages/Payroll";
import Performance from "./pages/Performance";
import Invoices from "./pages/Invoices";
import Expenses from "./pages/Expenses";
import Reports from "./pages/Reports";
import SettingsPage from "./pages/Settings";
import type { Role } from "./lib/types";

function Guard({ roles, children }: { roles: Role[]; children: JSX.Element }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/signup" element={<Navigate to="/" replace />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/employees" element={<Guard roles={["admin", "manager"]}><Employees /></Guard>} />
        <Route path="/org" element={<Guard roles={["admin", "manager"]}><OrgChart /></Guard>} />
        <Route path="/leave" element={<Leave />} />
        <Route path="/payroll" element={<Guard roles={["admin", "manager"]}><Payroll /></Guard>} />
        <Route path="/performance" element={<Performance />} />
        <Route path="/invoices" element={<Guard roles={["admin", "manager"]}><Invoices /></Guard>} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/reports" element={<Guard roles={["admin", "manager"]}><Reports /></Guard>} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
