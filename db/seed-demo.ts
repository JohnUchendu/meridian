// Creates a demo CLIENT user (not admin) with sample balances and
// transactions so you can see the client-facing dashboard populated.
// Run: npm run db:seed-demo
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

const DEMO_EMAIL = process.env.DEMO_EMAIL ?? "demo@meridian.example";
const DEMO_PASSWORD = process.env.DEMO_PASSWORD ?? "demopassword123";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const sql = neon(url);

  const existing = await sql`select id from users where email = ${DEMO_EMAIL}`;
  let userId: string;

  if (existing.length > 0) {
    userId = existing[0].id as string;
    await sql`
      update users set
        balance_available = 74210.00,
        balance_trading = 48410.60,
        balance_bonus = 500.00,
        tier = 'Standard',
        kyc_status = 'Verified'
      where id = ${userId}
    `;
    console.log(`Updated existing demo user ${DEMO_EMAIL}.`);
  } else {
    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);
    const rows = await sql`
      insert into users (first_name, last_name, email, password_hash, role, tier, kyc_status, balance_available, balance_trading, balance_bonus)
      values ('Sofia', 'Reyes', ${DEMO_EMAIL}, ${passwordHash}, 'client', 'Standard', 'Verified', 74210.00, 48410.60, 500.00)
      returning id
    `;
    userId = rows[0].id as string;
    console.log(`Created demo user ${DEMO_EMAIL} / password: ${DEMO_PASSWORD}`);
  }

  // Seed a few sample transactions so /dashboard and /dashboard/deposit
  // history aren't empty.
  const existingTx = await sql`select count(*)::int as count from transactions where user_id = ${userId}`;
  if (existingTx[0].count === 0) {
    await sql`
      insert into transactions (user_id, type, amount, method, status) values
      (${userId}, 'Deposit', 5000.00, 'Card', 'Completed'),
      (${userId}, 'Withdrawal', 1200.00, 'Bank wire', 'Completed'),
      (${userId}, 'Deposit', 2500.00, 'Crypto', 'Pending')
    `;
    console.log("Seeded sample transactions.");
  }

  console.log(`\nDemo login: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
