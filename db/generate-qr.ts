// Generates the default deposit QR code served at /deposit-qr.png.
// Admins can replace it at runtime from Admin → Settings without re-running
// this script; this is only the fallback shipped with the project.
//
// Run: npm run db:seed-qr
import { mkdirSync } from "node:fs";
import path from "node:path";
import QRCode from "qrcode";

const CONTENT = process.env.DEPOSIT_QR_CONTENT ?? "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE";
const OUT = path.join(process.cwd(), "public", "deposit-qr.png");

async function main() {
  mkdirSync(path.dirname(OUT), { recursive: true });
  await QRCode.toFile(OUT, CONTENT, {
    width: 640,
    margin: 2,
    errorCorrectionLevel: "M",
    color: { dark: "#0b1220", light: "#ffffff" },
  });
  console.log(`Wrote ${OUT} (content: ${CONTENT})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
