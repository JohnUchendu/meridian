// Applies db/schema.sql to the Neon database pointed at by DATABASE_URL.
// Run: npm run db:push
import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const sql = neon(url);
  const schema = readFileSync(new URL("./schema.sql", import.meta.url), "utf8");

  // Neon's http driver runs one statement per call, so split on semicolons
  // (fine here since schema.sql has no semicolons inside string literals).
  const statements = schema
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);

  for (const stmt of statements) {
    await sql(stmt);
    console.log("OK:", stmt.slice(0, 60).replace(/\s+/g, " ") + "...");
  }
  console.log("Schema applied.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
