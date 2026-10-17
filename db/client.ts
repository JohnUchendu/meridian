import { neon } from "@neondatabase/serverless";

type Row = Record<string, unknown>;

export type SqlClient = (
  strings: TemplateStringsArray | string,
  ...values: unknown[]
) => Promise<Row[]>;

/**
 * Tagged-template SQL client — no ORM.
 *
 *   const rows = await sql`select * from users where id = ${id}`;
 *
 * When DATABASE_URL is set the app talks to Neon over its HTTP driver.
 * When it isn't (local development / demos) queries are served by an
 * embedded PGlite database persisted to .pglite/. Both speak Postgres.
 */
export const sql: SqlClient = process.env.DATABASE_URL
  ? (neon(process.env.DATABASE_URL) as unknown as SqlClient)
  : createLocalSql();

function createLocalSql(): SqlClient {
  return async (strings, ...values) => {
    const db = await (await import("./local")).getLocalDb();

    if (typeof strings === "string") {
      const result = await db.query(strings);
      return result.rows as Row[];
    }

    const text = strings.reduce(
      (query, chunk, index) =>
        query + chunk + (index < values.length ? `$${index + 1}` : ""),
      "",
    );
    const result = await db.query(text, values);
    return result.rows as Row[];
  };
}
