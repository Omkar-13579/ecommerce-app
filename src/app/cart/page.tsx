
"use client";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { cart, removeFromCart } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-gray-50 px-8 py-12">
      <h1 className="text-3xl font-bold">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="mt-6 text-gray-600">
          Your cart is empty.
        </p>
      ) : (
        <div className="mt-8 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border bg-white p-6"
            >
              <div>
                <h2 className="font-semibold">{item.name}</h2>
                <p className="text-gray-600">
                  ₹{item.price.toLocaleString("en-IN")} × {item.quantity}
                </p>
              </div>

              <p className="font-bold">
                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
              </p>

              <Button
                variant="destructive"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </Button>
            </div>
          ))}

          <div className="flex items-center justify-between pt-4">
            <h2 className="text-xl font-bold">Total</h2>
            <p className="text-xl font-bold">
              ₹{total.toLocaleString("en-IN")}
            </p>
          </div>

          <Button className="mt-4">Proceed to Checkout</Button>
        </div>
      )}
    </main>
  );
}
