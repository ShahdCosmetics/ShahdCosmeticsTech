import { notFound } from "next/navigation";
import { cookies } from "next/headers";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  basePrice: string;
  primaryImage?: string | null;
  description?: string;
  category?: Category | null;
  inventory?: { quantity: number } | null;
}

interface Props {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${process.env.API_URL}/products/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return notFound();

  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  const isAuthenticated = !!token;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-white">
      <nav className="p-6 border-b border-zinc-200 dark:border-zinc-800">
        <a href="/products" className="text-sm text-zinc-500 hover:underline">
          &larr; Back to Products
        </a>
      </nav>

      <main className="max-w-4xl mx-auto py-10 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-square bg-zinc-100 dark:bg-zinc-900 rounded-2xl overflow-hidden">
            {product.primaryImage ? (
              <img
                src={product.primaryImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-400">
                No Image
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center gap-4">
            <h1 className="text-4xl font-extrabold">{product.name}</h1>
            <p className="text-2xl font-semibold">${product.basePrice}</p>
            {product.category && (
              <span className="text-sm text-zinc-400 uppercase tracking-wide">
                {product.category.name}
              </span>
            )}
            <p className="text-zinc-600 dark:text-zinc-400">{product.description}</p>
            <p className="text-sm text-zinc-500">
              In stock: {product.inventory?.quantity ?? "N/A"}
            </p>

            <button className="mt-4 w-full bg-black dark:bg-white dark:text-black text-white py-3 rounded-xl font-medium">
              {isAuthenticated ? "Add to Cart" : "Login to add to cart"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}