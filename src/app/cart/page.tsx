
"use client";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();

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
            <h2 className="font-semibold">{item.name}</h2>

            <p className="text-gray-600">
                ₹{item.price.toLocaleString("en-IN")} each
            </p>

            <div className="mt-3 flex items-center gap-3">
                <Button
                variant="outline"
                size="sm"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity === 1}
                >
                −
                </Button>

                <span>{item.quantity}</span>

                <Button
                variant="outline"
                size="sm"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                +
                </Button>

                <Button
                    variant="destructive"
                    onClick={() => removeFromCart(item.id)}
                    >
                    Remove
                </Button>
            </div>
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
