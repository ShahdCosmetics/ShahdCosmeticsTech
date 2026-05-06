import Link from "next/link";

interface Product {
    id: number;
    name: string;
    price: number;
    image?: string;
    category?: string;
}

export default function ProductCard({ product }: { product: Product }) {
    return (
        <Link href={`/products/${product.id}`}>
            <div className="group border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl hover:shadow-xl transition-all cursor-pointer">
                <div className="aspect-square bg-zinc-100 dark:bg-zinc-900 rounded-xl mb-4 overflow-hidden">
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-400">
                            No Image
                        </div>
                    )}
                </div>
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-zinc-500">${product.price}</p>
                {product.category && (
                    <span className="text-xs text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-full mt-2 inline-block">
                        {product.category}
                    </span>
                )}
            </div>
        </Link>
    );
}