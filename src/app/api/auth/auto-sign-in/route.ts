import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { createSessionForUser } from "@/lib/auth/session";
import { env } from "@/env";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderUuid = searchParams.get("order");
  const token = searchParams.get("token");

  if (!orderUuid || !token) {
    return NextResponse.redirect(`${env.NEXT_PUBLIC_BASE_URL}/`);
  }

  // Verify the token matches the order (simple security check)
  const order = await db.order.findUnique({
    where: { uuid: orderUuid },
    include: { user: true },
  });

  if (!order || !order.user) {
    return NextResponse.redirect(
      `${env.NEXT_PUBLIC_BASE_URL}/ordini/${orderUuid}?success=true`
    );
  }

  // Verify the token (use order uuid + user id as a simple verification)
  const expectedToken = Buffer.from(`${orderUuid}:${order.user.id}`).toString(
    "base64"
  );
  if (token !== expectedToken) {
    return NextResponse.redirect(
      `${env.NEXT_PUBLIC_BASE_URL}/ordini/${orderUuid}?success=true`
    );
  }

  // Create session and set cookie
  const sessionCookie = await createSessionForUser(order.user.id);
  const cookieStore = await cookies();
  cookieStore.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.options
  );

  // Redirect back to order page
  return NextResponse.redirect(
    `${env.NEXT_PUBLIC_BASE_URL}/ordini/${orderUuid}?success=true`
  );
}

