import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

const syncCartSchema = z.object({
  items: z.array(
    z.object({
      productId: z.number(),
      quantity: z.number().min(1),
    })
  ),
});

// Save cart to database for logged-in users
export async function POST(req: Request) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { items } = syncCartSchema.parse(body);

    // Delete existing cart items for this user
    await db.cart_item.deleteMany({
      where: { user_id: user.id },
    });

    // Insert new cart items
    if (items.length > 0) {
      await db.cart_item.createMany({
        data: items.map((item) => ({
          user_id: user.id,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }
    console.error("Cart sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync cart" },
      { status: 500 }
    );
  }
}

// Get cart from database for logged-in users
export async function GET() {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const cartItems = await db.cart_item.findMany({
      where: { user_id: user.id },
      include: {
        product: {
          select: {
            id: true,
            uuid: true,
            name: true,
            price: true,
            stock: true,
            active: true,
            image_url: true,
          },
        },
      },
    });

    // Filter out inactive products and format response
    const items = cartItems
      .filter((item) => item.product.active)
      .map((item) => ({
        product_id: item.product.id,
        product_uuid: item.product.uuid,
        name: item.product.name,
        price: item.product.price,
        stock: item.product.stock,
        image_url: item.product.image_url,
        quantity: Math.min(item.quantity, item.product.stock > 0 ? item.product.stock : item.quantity),
        out_of_stock: item.product.stock <= 0,
      }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Get cart error:", error);
    return NextResponse.json(
      { error: "Failed to get cart" },
      { status: 500 }
    );
  }
}

