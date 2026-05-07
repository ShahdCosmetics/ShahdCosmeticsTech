import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

async function getProduct(id: string) {
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
  const product = await getProduct(params.id);

  if (!product) return notFound();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-white">
      <nav className="p-6 border-b border-zinc-200 dark:border-zinc-800">
        <a href="/products" className="text-sm text-zinc-500 hover:underline">
          ← Back to Products
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
            {product.categoryId && (
              <span className="text-sm text-zinc-400 uppercase tracking-wide">
                {product.categoryId}
              </span>
            )}
            <p className="text-zinc-600 dark:text-zinc-400">{product.description}</p>

            <button className="mt-4 w-full bg-black dark:bg-white dark:text-black text-white py-3 rounded-xl font-medium">
              Login to add to cart
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}