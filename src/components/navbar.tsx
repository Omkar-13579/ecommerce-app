
"use client";

import Link from "next/link";
import { ShoppingCart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

export default function Navbar() {
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
        <Button variant="outline" size="icon" aria-label="Shopping cart">
          <ShoppingCart />
        </Button>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger>
              <Button variant="outline" size="icon" aria-label="Open menu">
                <Menu />
              </Button>
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
