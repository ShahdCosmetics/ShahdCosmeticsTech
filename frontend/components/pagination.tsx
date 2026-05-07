"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const handlePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => handlePage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 disabled:opacity-40"
      >
        &larr; Previous
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => handlePage(page)}
          className={`px-4 py-2 rounded-lg border transition-all ${
            page === currentPage
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "border-zinc-300 dark:border-zinc-700"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => handlePage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 disabled:opacity-40"
      >
        Next &rarr;
      </button>
    </div>
  );
}