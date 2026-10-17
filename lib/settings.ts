import { sql } from "@/db/client";

export const DEFAULT_DEPOSIT_QR = "/deposit-qr.png";
export const DEFAULT_DEPOSIT_ADDRESS = "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE";
export const DEFAULT_DEPOSIT_INSTRUCTIONS =
  "Open your wallet or banking app, scan the QR code and send the amount you want to invest. Then submit the confirmation form with your payment reference so our team can verify it.";

export type DepositSettings = {
  qrImage: string;
  address: string;
  instructions: string;
};

export async function getDepositSettings(): Promise<DepositSettings> {
  try {
    const rows = await sql`
      select key, value from platform_settings
      where key in ('deposit_qr_image', 'deposit_address', 'deposit_instructions')
    `;
    const values = new Map(rows.map((row) => [String(row.key), String(row.value)]));

    return {
      qrImage: values.get("deposit_qr_image") || DEFAULT_DEPOSIT_QR,
      address: values.get("deposit_address") || DEFAULT_DEPOSIT_ADDRESS,
      instructions: values.get("deposit_instructions") || DEFAULT_DEPOSIT_INSTRUCTIONS,
    };
  } catch (error) {
    console.error("deposit settings query failed", error);
    return {
      qrImage: DEFAULT_DEPOSIT_QR,
      address: DEFAULT_DEPOSIT_ADDRESS,
      instructions: DEFAULT_DEPOSIT_INSTRUCTIONS,
    };
  }
}
