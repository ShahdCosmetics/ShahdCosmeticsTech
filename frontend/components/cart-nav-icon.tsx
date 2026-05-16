"use client";

import { useCart } from "@/context/cart-context";
import { getAuthToken } from "@/lib/auth";

export default function CartNavIcon() {
  const { cart, openCart } = useCart();

  const isAuthenticated = !!getAuthToken();
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  if (!isAuthenticated) return null;

  return (
    <button
      onClick={openCart}
      className="relative p-2 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
      aria-label="Open cart"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
        />
      </svg>

      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-black dark:bg-white text-white dark:text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  );
}