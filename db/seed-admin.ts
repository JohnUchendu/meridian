// Creates (or promotes) the platform admin account.
// Run: npm run db:seed-admin
//
// Credentials come from ADMIN_EMAIL / ADMIN_PASSWORD in .env.local (loaded by
// the npm script). ADMIN_EMAIL defaults to the address this deployment was
// commissioned with.
import bcrypt from "bcryptjs";
import { sql } from "./client";
import { closeLocalDb } from "./local";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "sirray812@digdig.org";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_FIRST_NAME = process.env.ADMIN_FIRST_NAME ?? "Sirray";
const ADMIN_LAST_NAME = process.env.ADMIN_LAST_NAME ?? "Admin";

async function main() {
  if (!ADMIN_PASSWORD || ADMIN_PASSWORD.length < 12) {
    throw new Error(
      "Set ADMIN_PASSWORD (12+ characters) in .env.local before seeding the admin account.",
    );
  }

  const existing = await sql`select id from users where email = ${ADMIN_EMAIL}`;

  if (existing.length > 0) {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await sql`
      update users set
        role = 'admin',
        password_hash = ${passwordHash},
        kyc_status = 'Verified'
      where email = ${ADMIN_EMAIL}
    `;
    console.log(`Promoted existing user ${ADMIN_EMAIL} to admin and reset the password.`);
    return;
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await sql`
    insert into users (first_name, last_name, email, password_hash, role, kyc_status)
    values (${ADMIN_FIRST_NAME}, ${ADMIN_LAST_NAME}, ${ADMIN_EMAIL}, ${passwordHash}, 'admin', 'Verified')
  `;
  console.log(`Created admin user ${ADMIN_EMAIL}.`);
}

main()
  .then(() => closeLocalDb())
  .catch(async (err) => {
    console.error(err);
    await closeLocalDb();
    process.exit(1);
  });
