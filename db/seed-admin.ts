// Creates (or promotes) an admin user. Run after db:push:
//   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=changeme npx tsx db/seed-admin.ts
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

async function main() {
  const url = process.env.DATABASE_URL;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!url) throw new Error("DATABASE_URL is not set");
  if (!email || !password) throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD env vars");

  const sql = neon(url);
  const existing = await sql`select id from users where email = ${email}`;

  if (existing.length > 0) {
    await sql`update users set role = 'admin' where email = ${email}`;
    console.log(`Promoted existing user ${email} to admin.`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await sql`
    insert into users (first_name, last_name, email, password_hash, role, kyc_status)
    values ('Admin', 'User', ${email}, ${passwordHash}, 'admin', 'Verified')
  `;
  console.log(`Created admin user ${email}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
