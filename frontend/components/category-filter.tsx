"use client";

interface CategoryFilterProps {
    categories: string[];
    selected: string;
    onSelect: (category: string) => void;
}

export default function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
    return (
        <div className="flex flex-wrap gap-2 mb-6">
            <button
                onClick={() => onSelect("")}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${selected === ""
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-black dark:hover:border-white"
                    }`}
            >
                All
            </button>
            {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => onSelect(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${selected === cat
                        ? "bg-black text-white dark:bg-white dark:text-black"
                        : "border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-black dark:hover:border-white"
                        }`}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
}