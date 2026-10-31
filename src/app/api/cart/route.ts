
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { cart, cartItem } from "@/db/cart-schema";

async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user ?? null;
}

async function getUserCart(userId: string) {
  return db.query.cart.findFirst({
    where: eq(cart.userId, userId),
  });
}

// GET: Fetch the logged-in user's cart
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please log in first" },
        { status: 401 }
      );
    }

    const userCart = await getUserCart(user.id);

    if (!userCart) {
      return NextResponse.json([]);
    }

    const items = await db.query.cartItem.findMany({
      where: eq(cartItem.cartId, userCart.id),
    });

    return NextResponse.json(
      items.map((item) => ({
        id: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }))
    );
  } catch (error) {
    console.error("Fetch cart failed:", error);

    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

// POST: Add a product to the cart
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please log in first" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, name, price, quantity = 1 } = body;

    if (
      !Number.isSafeInteger(productId) ||
      typeof name !== "string" ||
      !name.trim() ||
      !Number.isSafeInteger(price) ||
      price < 0 ||
      !Number.isSafeInteger(quantity) ||
      quantity < 1
    ) {
      return NextResponse.json(
        { error: "Invalid cart item" },
        { status: 400 }
      );
    }

    let userCart = await getUserCart(user.id);

    if (!userCart) {
      const [createdCart] = await db
        .insert(cart)
        .values({ userId: user.id })
        .returning();

      userCart = createdCart;
    }

    const existingItem = await db.query.cartItem.findFirst({
      where: and(
        eq(cartItem.cartId, userCart.id),
        eq(cartItem.productId, productId)
      ),
    });

    if (existingItem) {
      await db
        .update(cartItem)
        .set({
          quantity: existingItem.quantity + quantity,
          name,
          price,
        })
        .where(eq(cartItem.id, existingItem.id));
    } else {
      await db.insert(cartItem).values({
        cartId: userCart.id,
        productId,
        name: name.trim(),
        price,
        quantity,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Add to cart failed:", error);

    return NextResponse.json(
      { error: "Failed to add item" },
      { status: 500 }
    );
  }
}

// PATCH: Change a product's quantity
export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please log in first" },
        { status: 401 }
      );
    }

    const { productId, quantity } = await request.json();

    if (
      !Number.isSafeInteger(productId) ||
      !Number.isSafeInteger(quantity) ||
      quantity < 1
    ) {
      return NextResponse.json(
        { error: "Invalid product or quantity" },
        { status: 400 }
      );
    }

    const userCart = await getUserCart(user.id);

    if (!userCart) {
      return NextResponse.json(
        { error: "Cart not found" },
        { status: 404 }
      );
    }

    const result = await db
      .update(cartItem)
      .set({ quantity })
      .where(
        and(
          eq(cartItem.cartId, userCart.id),
          eq(cartItem.productId, productId)
        )
      )
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update cart failed:", error);

    return NextResponse.json(
      { error: "Failed to update quantity" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a product from the cart
export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Please log in first" },
        { status: 401 }
      );
    }

    const { productId } = await request.json();

    if (!Number.isSafeInteger(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const userCart = await getUserCart(user.id);

    if (!userCart) {
      return NextResponse.json(
        { error: "Cart not found" },
        { status: 404 }
      );
    }

    await db
      .delete(cartItem)
      .where(
        and(
          eq(cartItem.cartId, userCart.id),
          eq(cartItem.productId, productId)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Remove cart item failed:", error);

    return NextResponse.json(
      { error: "Failed to remove item" },
      { status: 500 }
    );
  }
}
