import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://novora:novora@localhost:5432/novora",
});

export const q = (text, params) => pool.query(text, params);
