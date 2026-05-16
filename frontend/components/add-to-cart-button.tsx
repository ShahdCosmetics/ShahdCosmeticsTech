"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";

interface AddToCartButtonProps {
  variantId:       string;
  isAuthenticated: boolean;
}

export default function AddToCartButton({
  variantId,
  isAuthenticated,
}: AddToCartButtonProps) {
  const { addItem, openCart } = useCart();
  const router                = useRouter();

  async function handleAddToCart() {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    await addItem(variantId, 1);
    openCart();
  }

  return (
    <button
      onClick={handleAddToCart}
      className="mt-4 w-full bg-black dark:bg-white dark:text-black text-white py-3 rounded-xl font-medium hover:opacity-80 transition-opacity"
    >
      {isAuthenticated ? "Add to Cart" : "Login to add to cart"}
    </button>
  );
}