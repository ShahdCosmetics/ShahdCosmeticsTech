"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface Category {
  id: string;
  name: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selected: string;
  onSelect: string;
}

export default function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSelect = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoryId) {
      params.set("categoryId", categoryId);
    } else {
      params.delete("categoryId");
    }
    params.set("page", "1");
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => handleSelect("")}
        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
          selected === ""
            ? "bg-black text-white dark:bg-white dark:text-black"
            : "border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleSelect(cat.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
            selected === cat.id
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}