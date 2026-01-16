import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userUuid: string }> }
) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userUuid } = await params;

  const user = await db.user.findUnique({
    where: { uuid: userUuid },
    select: {
      id: true,
      uuid: true,
      email: true,
      name: true,
      phone: true,
      created_at: true,
      cart_items: {
        include: {
          product: {
            select: {
              id: true,
              uuid: true,
              name: true,
              price: true,
              stock: true,
              image_url: true,
              active: true,
            },
          },
        },
        orderBy: {
          updated_at: "desc",
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const items = user.cart_items.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    updated_at: item.updated_at,
    product: {
      id: item.product.id,
      uuid: item.product.uuid,
      name: item.product.name,
      price: item.product.price,
      stock: item.product.stock,
      image_url: item.product.image_url,
      active: item.product.active,
    },
  }));

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return NextResponse.json({
    user: {
      uuid: user.uuid,
      email: user.email,
      name: user.name,
      phone: user.phone,
      created_at: user.created_at,
    },
    items,
    total,
    item_count: items.reduce((sum, item) => sum + item.quantity, 0),
  });
}

