import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

// Tagged-template SQL client — no ORM.
// Usage: const rows = await sql`select * from users where id = ${id}`;
export const sql = neon(process.env.DATABASE_URL);
