"use client";

import { useEffect, useState } from "react";

interface SearchBarProps {
    onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [value, setValue] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(value);
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