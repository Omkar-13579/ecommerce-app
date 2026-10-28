
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">

      <section className="px-8 py-20 text-center">
        <h1 className="text-4xl font-bold">
          Find Your Next Favorite
        </h1>

        <p className="mt-4 text-gray-600">
          Discover products you'll love.
        </p>
        
        <Button className="mt-6">Shop Now</Button>
      </section>
    </main>
  );
}
