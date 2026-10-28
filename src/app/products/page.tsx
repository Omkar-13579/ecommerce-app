
import ProductCard from "@/components/productcard";


const products = [
  {
    id: 1,
    name: "Classic T-Shirt",
    price: 799,
    category: "Clothing",
    image: "https://placehold.co/600x400?text=T-Shirt",
  },
  {
    id: 2,
    name: "Everyday Sneakers",
    price: 2499,
    category: "Footwear",
    image: "https://placehold.co/600x400?text=Sneakers",
  },
  {
    id: 3,
    name: "Classic Backpack",
    price: 1499,
    category: "Accessories",
    image: "https://placehold.co/600x400?text=Backpack",
  },
];


export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-8 py-12">
      <h1 className="text-3xl font-bold">Our Products</h1>
      <p className="mt-2 text-gray-600">
        Explore our collection.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            price={product.price}
            category={product.category}
            image={product.image}
          />
        ))}
      </div>
    </main>
  );
}
