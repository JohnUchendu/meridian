/**
 * Splits db/schema.sql into individual statements.
 *
 * Used by both the CLI migration and the embedded local database. Line
 * comments are stripped first so a semicolon inside a comment can't split a
 * statement in half.
 */
export function splitStatements(schema: string): string[] {
  return schema
    .replace(/^\s*--.*$/gm, "")
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);
}
