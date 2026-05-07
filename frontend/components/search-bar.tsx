"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface SearchBarProps {
  onSearch: string;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(onSearch);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      params.set("page", "1");
      router.push(`/products?${params.toString()}`);
    }, 400);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <input
      type="text"
      placeholder="Search products..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="w-full border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-2 mb-6 bg-white dark:bg-zinc-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
    />
  );
}