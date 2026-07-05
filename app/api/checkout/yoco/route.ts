import { NextRequest, NextResponse } from "next/server";

const YOCO_API = "https://payments.yoco.com/api/checkouts";

export async function POST(req: NextRequest) {
  try {
    const { amountCents, orderId, currency = "ZAR" } = await req.json();

    if (!amountCents || !orderId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const secretKey = process.env.YOCO_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({ error: "Yoco not configured" }, { status: 500 });
    }

    const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

    const res = await fetch(YOCO_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify({
        amount:     amountCents,           // amount in cents (e.g. 129900 = R1299.00)
        currency,
        successUrl: `${base}/checkout/success?payment=yoco&orderId=${orderId}`,
        cancelUrl:  `${base}/checkout/cancel?payment=yoco`,
        failureUrl: `${base}/checkout/cancel?payment=yoco&error=1`,
        metadata:   { orderId: String(orderId) },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Yoco error:", err);
      return NextResponse.json({ error: "Yoco checkout creation failed" }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json({ id: data.id, redirectUrl: data.redirectUrl });
  } catch {
    return NextResponse.json({ error: "Failed to create Yoco checkout" }, { status: 500 });
  }
}
