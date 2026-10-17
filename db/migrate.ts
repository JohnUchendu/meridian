// Applies db/schema.sql to the configured database.
// Run: npm run db:push
//
// DATABASE_URL (Neon) is used when present; otherwise the embedded local
// database in .pglite/ is migrated.
import { readFileSync } from "node:fs";
import { sql } from "./client";
import { closeLocalDb } from "./local";
import { splitStatements } from "./split-statements";

async function main() {
  const schema = readFileSync(new URL("./schema.sql", import.meta.url), "utf8");

  // One statement per call keeps this compatible with Neon's HTTP driver.
  const statements = splitStatements(schema);

  for (const stmt of statements) {
    await sql(stmt);
    console.log("OK:", stmt.slice(0, 60).replace(/\s+/g, " ") + "...");
  }
  console.log("Schema applied.");
}

main()
  .then(() => closeLocalDb())
  .catch(async (err) => {
    console.error(err);
    await closeLocalDb();
    process.exit(1);
  });
