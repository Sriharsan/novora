-- Novora — PostgreSQL schema (plain Postgres, no external auth service)

drop table if exists activity_log, expenses, invoices, clients,
  performance_reviews, payslips, payroll_runs, attendance,
  leave_requests, employees, departments cascade;

create table departments (
  id text primary key,
  name text not null,
  head_id text
);

create table employees (
  id text primary key,
  name text not null,
  email text unique not null,
  password_hash text not null,
  role text not null default 'employee',        -- admin | manager | employee
  title text,
  department_id text references departments(id),
  manager_id text,
  join_date date,
  salary numeric default 0,
  status text default 'onboarding',
  avatar_color text default '#6d5ef6',
  leave_balance int default 20,
  onboarding jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

create table leave_requests (
  id text primary key,
  employee_id text references employees(id) on delete cascade,
  type text,
  from_date date,
  to_date date,
  days int,
  reason text,
  status text default 'pending',
  created_at timestamptz default now()
);

create table attendance (
  id text primary key,
  employee_id text references employees(id) on delete cascade,
  date date,
  clock_in text,
  clock_out text,
  hours numeric default 0
);

create table payroll_runs (
  id text primary key,
  period text,
  status text default 'draft',
  lines jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

create table performance_reviews (
  id text primary key,
  employee_id text references employees(id) on delete cascade,
  cycle text,
  rating int,
  summary text,
  reviewer text,
  goals jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

create table clients (
  id text primary key,
  name text not null,
  email text
);

create table invoices (
  id text primary key,
  number text,
  client_id text references clients(id),
  issue_date date,
  due_date date,
  tax_rate numeric default 18,
  status text default 'unpaid',
  items jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

create table expenses (
  id text primary key,
  employee_id text references employees(id) on delete cascade,
  date date,
  category text,
  description text,
  amount numeric,
  receipt_name text,
  status text default 'pending',
  created_at timestamptz default now()
);

create table activity_log (
  id text primary key,
  at timestamptz default now(),
  actor text,
  text text,
  kind text
);
