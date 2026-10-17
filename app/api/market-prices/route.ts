import { NextResponse } from "next/server";
import { getLivePrices } from "@/lib/live-prices";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = await getLivePrices();
  return NextResponse.json(snapshot, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
