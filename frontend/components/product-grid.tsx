import ProductCard from "./product-card";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  basePrice: string;
  primaryImage?: string | null;
  category?: Category | null;
}

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="col-span-3 text-center p-20 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
        <p className="text-zinc-500">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
}