import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const PAYFAST_URL =
  process.env.PAYFAST_SANDBOX === "false"
    ? "https://www.payfast.co.za/eng/process"
    : "https://sandbox.payfast.co.za/eng/process";

// PayFast requires params in submission order, URL-encoded, then MD5 hashed.
// Passphrase is appended before hashing if configured.
function buildSignature(params: Record<string, string>, passphrase?: string): string {
  const parts = Object.entries(params)
    .filter(([, v]) => v !== "")
    .map(([k, v]) => `${k}=${encodeURIComponent(v).replace(/%20/g, "+")}`);

  const str = parts.join("&") + (passphrase ? `&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, "+")}` : "");
  return crypto.createHash("md5").update(str).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const { amountZar, firstName, lastName, email, orderId } = await req.json();

    if (!amountZar || !firstName || !email || !orderId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const merchantId  = process.env.PAYFAST_MERCHANT_ID  ?? "10000100";
    const merchantKey = process.env.PAYFAST_MERCHANT_KEY ?? "46f0cd694581a";
    const passphrase  = process.env.PAYFAST_PASSPHRASE;
    const base        = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

    // Parameters must remain in this exact order for PayFast signature validation
    const params: Record<string, string> = {
      merchant_id:   merchantId,
      merchant_key:  merchantKey,
      return_url:    `${base}/checkout/success?payment=payfast`,
      cancel_url:    `${base}/checkout/cancel?payment=payfast`,
      notify_url:    `${base}/api/checkout/payfast/notify`,
      name_first:    firstName,
      name_last:     lastName || "-",
      email_address: email,
      m_payment_id:  String(orderId),
      amount:        Number(amountZar).toFixed(2),
      item_name:     "Stryde Shoes Order",
    };

    const signature = buildSignature(params, passphrase);

    return NextResponse.json({
      url: PAYFAST_URL,
      params: { ...params, signature },
    });
  } catch {
    return NextResponse.json({ error: "Failed to generate PayFast payment" }, { status: 500 });
  }
}
