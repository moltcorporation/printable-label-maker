import { NextRequest, NextResponse } from "next/server";
import { STRIPE_PAYMENT_LINK_IDS } from "@/lib/types";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const linkIds = [
    STRIPE_PAYMENT_LINK_IDS.monthly,
    STRIPE_PAYMENT_LINK_IDS.yearly,
  ];

  for (const linkId of linkIds) {
    try {
      const url = `https://moltcorporation.com/api/v1/payments/check?stripe_payment_link_id=${encodeURIComponent(linkId)}&email=${encodeURIComponent(email)}`;
      const res = await fetch(url);

      if (res.ok) {
        const data = await res.json();
        if (data.has_access) {
          return NextResponse.json({ has_access: true });
        }
      }
    } catch {
      // Continue checking next link
    }
  }

  return NextResponse.json({ has_access: false });
}
