import Link from "next/link";

interface ProductCardProps {
  id: string;
  name: string;
  basePrice: string;
  primaryImage?: string | null;
  categoryId?: string;
}

export default function ProductCard({ id, name, basePrice, primaryImage, categoryId }: ProductCardProps) {
  return (
    <Link href={`/products/${id}`}>
      <div className="group border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl hover:shadow-xl transition-all cursor-pointer">
        <div className="aspect-square bg-zinc-100 dark:bg-zinc-900 rounded-xl mb-4 overflow-hidden">
          {primaryImage ? (
            <img src={primaryImage} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-400">
              No Image
            </div>
          )}
        </div>
        <h3 className="text-xl font-semibold">{name}</h3>
        <p className="text-zinc-500">${basePrice}</p>
        {categoryId && (
          <span className="text-xs text-zinc-400 uppercase tracking-wide">{categoryId}</span>
        )}
      </div>
    </Link>
  );
}