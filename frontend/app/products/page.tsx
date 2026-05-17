import ProductGrid from "@/components/product-grid";
import CategoryFilter from "@/components/category-filter";
import SearchBar from "@/components/search-bar";
import Pagination from "@/components/pagination";
import CartNavIcon from "@/components/cart-nav-icon";
import { Suspense } from "react";

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

interface ProductsResponse {
  data: Product[];
  meta: {
    total:      number;
    page:       number;
    limit:      number;
    totalPages: number;
  };
}

async function getProducts(
  search: string,
  categoryId: string,
  page: number
): Promise<ProductsResponse> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", "9");
  if (search)     params.set("search",     search);
  if (categoryId) params.set("categoryId", categoryId);

  try {
    const res = await fetch(
      `${process.env.API_URL}/products?${params.toString()}`,
      { cache: "no-store" }
    );
    if (!res.ok)
      return { data: [], meta: { total: 0, page: 1, limit: 9, totalPages: 0 } };
    return res.json();
  } catch {
    return { data: [], meta: { total: 0, page: 1, limit: 9, totalPages: 0 } };
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${process.env.API_URL}/categories`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

interface PageProps {
  searchParams: Promise<{
    search?:     string;
    categoryId?: string;
    page?:       string;
  }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const {
    search = "",
    categoryId = "",
    page: pageParam = "1",
  } = await searchParams;

  const page = Number(pageParam);

  const [{ data: products, meta }, categories] = await Promise.all([
    getProducts(search, categoryId, page),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-white">
      <nav className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tighter">ShahdCosmetics</h1>
        {/* Cart icon — wrapped in Suspense as it is a Client Component */}
        <Suspense fallback={null}>
          <CartNavIcon />
        </Suspense>
      </nav>

      <main className="max-w-6xl mx-auto py-10 px-6">
        <h2 className="text-4xl font-extrabold mb-8">Products</h2>

        {/*
          SearchBar, CategoryFilter, Pagination use useSearchParams().
          Next.js requires them wrapped in Suspense boundaries.
        */}
        <Suspense fallback={null}>
          <SearchBar onSearch={search} />
        </Suspense>

        <Suspense fallback={null}>
          <CategoryFilter categories={categories} selected={categoryId} />
        </Suspense>

        <ProductGrid products={products} />

        <Suspense fallback={null}>
          <Pagination currentPage={page} totalPages={meta.totalPages} />
        </Suspense>
      </main>
    </div>
  );
}