"use client";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

type ProductCardProps = {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
};

export default function ProductCard({
  id,
  name,
  price,
  category,
  image,
}: ProductCardProps) {
  const { addToCart } = useCart();
  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <img
        src={image}
        alt={name}
        className="h-56 w-full object-cover"
      />

      <div className="p-6">
        <p className="text-sm text-gray-500">{category}</p>

        <h2 className="mt-2 text-xl font-semibold">
          {name}
        </h2>

        <p className="mt-3 font-bold">
          ₹{price.toLocaleString("en-IN")}
        </p>

        <Button
          className="mt-4 w-full"
          onClick={() =>
            addToCart({
            id: id ,
            name,
            price,
          })
         }
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
