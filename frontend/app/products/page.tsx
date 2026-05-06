"use client";

import { useEffect, useState } from "react";
import ProductGrid from "@/components/product-grid";
import CategoryFilter from "@/components/category-filter";
import SearchBar from "@/components/search-bar";
import Pagination from "@/components/pagination";

const ITEMS_PER_PAGE = 9;

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [filtered, setFiltered] = useState<any[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
            .then((res) => res.json())
            .then((data) => {
                const list = Array.isArray(data) ? data : data.products ?? [];
                setProducts(list);
                const cats = [...new Set(list.map((p: any) => p.category).filter(Boolean))] as string[];
                setCategories(cats);
            })
            .catch(() => setProducts([]));
    }, []);

    useEffect(() => {
        let result = products;

        if (selectedCategory) {
            result = result.filter((p) => p.category === selectedCategory);
        }

        if (searchQuery) {
            result = result.filter((p) =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFiltered(result);
        setCurrentPage(1);
    }, [products, selectedCategory, searchQuery]);

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-white">
            <nav className="p-6 border-b border-zinc-200 dark:border-zinc-800">
                <h1 className="text-2xl font-bold tracking-tighter">ShahdCosmetics</h1>
            </nav>

            <main className="max-w-6xl mx-auto py-10 px-6">
                <h2 className="text-4xl font-extrabold mb-8">Products</h2>

                <SearchBar onSearch={setSearchQuery} />
                <CategoryFilter
                    categories={categories}
                    selected={selectedCategory}
                    onSelect={setSelectedCategory}
                />

                <ProductGrid products={paginated} />

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </main>
        </div>
    );
}