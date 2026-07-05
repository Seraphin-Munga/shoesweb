import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const PAYFAST_IPS = [
  "197.97.145.144", "197.97.145.145", "197.97.145.146", "197.97.145.147",
  "196.33.227.224",  "196.33.227.225",  "196.33.227.226",  "196.33.227.227",
  // sandbox
  "197.97.145.148",
];

function verifySignature(params: URLSearchParams, passphrase?: string): boolean {
  const received = params.get("signature") ?? "";
  const copy = new URLSearchParams(params);
  copy.delete("signature");

  const str =
    [...copy.entries()]
      .map(([k, v]) => `${k}=${encodeURIComponent(v).replace(/%20/g, "+")}`)
      .join("&") +
    (passphrase ? `&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, "+")}` : "");

  const computed = crypto.createHash("md5").update(str).digest("hex");
  return computed === received;
}

export async function POST(req: NextRequest) {
  // Verify request originates from PayFast (skip in sandbox)
  if (process.env.PAYFAST_SANDBOX !== "true") {
    const forwarded = req.headers.get("x-forwarded-for") ?? "";
    const ip = forwarded.split(",")[0].trim();
    if (!PAYFAST_IPS.includes(ip)) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  const body = await req.text();
  const params = new URLSearchParams(body);

  if (!verifySignature(params, process.env.PAYFAST_PASSPHRASE)) {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const paymentStatus = params.get("payment_status");
  const mPaymentId    = params.get("m_payment_id"); // our order ID

  if (paymentStatus === "COMPLETE" && mPaymentId) {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";
      // Update order status to Processing (1)
      await fetch(`${base}/orders/${mPaymentId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: 1 }),
      });
    } catch {
      // Log silently — PayFast needs a 200 even if our update fails
    }
  }

  // PayFast requires a 200 OK response to confirm ITN receipt
  return new NextResponse("OK", { status: 200 });
}
