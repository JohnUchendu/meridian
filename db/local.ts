import { readFileSync } from "node:fs";
import path from "node:path";
import type { PGlite } from "@electric-sql/pglite";
import { splitStatements } from "./split-statements";

// Local, zero-config Postgres (WASM) used when DATABASE_URL is not set.
// Data is persisted to .pglite/ so the admin account and any activity survive
// a dev-server restart. In production, set DATABASE_URL (Neon) and this file
// is never imported at runtime.
const globalForDb = globalThis as unknown as {
  __meridianLocalDb?: Promise<PGlite>;
};

export function getLocalDb(): Promise<PGlite> {
  if (!globalForDb.__meridianLocalDb) {
    globalForDb.__meridianLocalDb = initLocalDb();
  }
  return globalForDb.__meridianLocalDb;
}

/** Closes the embedded database so CLI scripts can exit cleanly. */
export async function closeLocalDb(): Promise<void> {
  if (!globalForDb.__meridianLocalDb) return;
  const db = await globalForDb.__meridianLocalDb;
  await db.close();
  globalForDb.__meridianLocalDb = undefined;
}

async function initLocalDb(): Promise<PGlite> {
  const { PGlite } = await import("@electric-sql/pglite");
  const dataDir = process.env.PGLITE_DATA_DIR ?? path.join(process.cwd(), ".pglite");
  const db = new PGlite(dataDir);
  await db.waitReady;

  // Apply the schema on first boot. Everything in schema.sql is idempotent,
  // so this is safe on every start.
  const schema = readFileSync(path.join(process.cwd(), "db", "schema.sql"), "utf8");
  for (const statement of splitStatements(schema)) {
    await db.exec(statement);
  }
  return db;
}
