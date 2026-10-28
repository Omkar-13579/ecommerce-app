
"use client";

import Link from "next/link";
import { ShoppingCart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

export default function Navbar() {
  const { cart } = useCart();

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <nav className="flex items-center justify-between border-b bg-white px-6 py-4">
      <Link href="/" className="text-2xl font-bold">
        MyStore
      </Link>

      <div className="hidden items-center gap-6 md:flex">
        <Link href="/">Home</Link>
        <Link href="/products">Products</Link>
        <Link href="/about">About</Link>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          aria-label={`Shopping cart, ${cartCount} items`}
        >
          <ShoppingCart />
          <span>{cartCount}</span>
        </Button>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger
                className="inline-flex size-9 items-center justify-center rounded-md border"
                aria-label="Open menu"
                >
                <Menu />
            </SheetTrigger>

            <SheetContent>
              <SheetTitle>Menu</SheetTitle>
              <div className="mt-6 flex flex-col gap-4">
                <Link href="/">Home</Link>
                <Link href="/products">Products</Link>
                <Link href="/about">About</Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
