import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const skip = (page - 1) * limit;

  // Get users with cart items, aggregated
  const cartsWithItems = await db.user.findMany({
    where: {
      cart_items: {
        some: {},
      },
    },
    select: {
      id: true,
      uuid: true,
      email: true,
      name: true,
      cart_items: {
        include: {
          product: {
            select: {
              price: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      updated_at: "desc",
    },
    skip,
    take: limit,
  });

  const totalCount = await db.user.count({
    where: {
      cart_items: {
        some: {},
      },
    },
  });

  const carts = cartsWithItems.map((user) => {
    const itemCount = user.cart_items.reduce((sum, item) => sum + item.quantity, 0);
    const total = user.cart_items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const latestUpdate = user.cart_items.reduce(
      (latest, item) => (item.updated_at > latest ? item.updated_at : latest),
      new Date(0)
    );

    return {
      user_id: user.id,
      user_uuid: user.uuid,
      email: user.email,
      name: user.name,
      item_count: itemCount,
      total,
      updated_at: latestUpdate,
    };
  });

  // Sort by latest cart update
  carts.sort((a, b) => b.updated_at.getTime() - a.updated_at.getTime());

  return NextResponse.json({
    carts,
    pagination: {
      page,
      limit,
      total: totalCount,
      total_pages: Math.ceil(totalCount / limit),
    },
  });
}

