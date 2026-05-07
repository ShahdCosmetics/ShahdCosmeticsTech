"use client";

import { useEffect, useState } from "react";
import ProductGrid from "@/components/product-grid";
import CategoryFilter from "@/components/category-filter";
import SearchBar from "@/components/search-bar";
import Pagination from "@/components/pagination";

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const params = new URLSearchParams();
        params.set("page", String(currentPage));
        params.set("limit", "9");
        if (searchQuery) params.set("search", searchQuery);
        if (selectedCategory) params.set("categoryId", selectedCategory);

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?${params.toString()}`)
            .then((res) => res.json())
            .then((data) => {
                setProducts(data.data ?? []);
                setTotalPages(data.meta?.totalPages ?? 1);

                // extract unique categoryIds for filter
                const cats = [...new Set((data.data ?? []).map((p: any) => p.categoryId).filter(Boolean))] as string[];
                setCategories(cats);
            })
            .catch(() => setProducts([]));
    }, [currentPage, searchQuery, selectedCategory]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const handleCategory = (cat: string) => {
        setSelectedCategory(cat);
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-white">
            <nav className="p-6 border-b border-zinc-200 dark:border-zinc-800">
                <h1 className="text-2xl font-bold tracking-tighter">ShahdCosmetics</h1>
            </nav>

            <main className="max-w-6xl mx-auto py-10 px-6">
                <h2 className="text-4xl font-extrabold mb-8">Products</h2>

                <SearchBar onSearch={handleSearch} />
                <CategoryFilter
                    categories={categories}
                    selected={selectedCategory}
                    onSelect={handleCategory}
                />

                <ProductGrid products={products} />

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </main>
        </div>
    );
}