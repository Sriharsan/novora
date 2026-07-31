// Ensures the target database exists before migrating.
// Connects to the maintenance "postgres" database and CREATE DATABASE if missing.
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/novora";
const parsed = new URL(url);
const dbName = decodeURIComponent(parsed.pathname.replace(/^\//, "")) || "novora";

// Same connection, but pointed at the default "postgres" database.
const adminUrl = new URL(url);
adminUrl.pathname = "/postgres";

const admin = new pg.Client({ connectionString: adminUrl.toString() });

try {
  await admin.connect();
  const { rowCount } = await admin.query("select 1 from pg_database where datname=$1", [dbName]);
  if (rowCount) {
    console.log(`✓ database "${dbName}" already exists`);
  } else {
    // identifier can't be parameterised; dbName comes from local config, not user input
    await admin.query(`create database "${dbName.replace(/"/g, '""')}"`);
    console.log(`✓ created database "${dbName}"`);
  }
} catch (e) {
  console.error("Could not ensure database:", e.message);
  console.error("→ Make sure PostgreSQL is running and DATABASE_URL in server/.env is correct.");
  process.exit(1);
} finally {
  await admin.end();
}
