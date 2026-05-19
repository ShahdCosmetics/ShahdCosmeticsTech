"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { getAuthToken } from "@/lib/auth";
import ProtectedRoute from "@/components/protected-route";
import CheckoutSummary from "@/components/checkout-summary";

export default function CheckoutPage() {
  const { cart, clearCart }             = useCart();
  const router                          = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handlePlaceOrder() {
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const token = getAuthToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message ?? "Failed to place order. Please try again.");
        return;
      }

      // Clear local cart state — backend already cleared the DB cart on order creation
      clearCart();
      router.push(`/orders/confirmation/${data.id}`);
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-white">
        <nav className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <a href="/products" className="text-sm text-zinc-500 hover:underline">
            Back to Products
          </a>
          <h1 className="text-lg font-bold">Checkout</h1>
        </nav>

        <main className="max-w-2xl mx-auto py-10 px-6">
          {cart.items.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-zinc-500 mb-4">Your cart is empty.</p>
              <a
                href="/products"
                className="text-sm font-medium underline text-zinc-600 dark:text-zinc-400"
              >
                Browse products
              </a>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <CheckoutSummary
                items={cart.items}
                totalAmount={cart.totalAmount}
              />

              {errorMessage && (
                <p className="text-red-500 text-sm text-center">
                  {errorMessage}
                </p>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full bg-black dark:bg-white dark:text-black text-white py-4 rounded-xl font-medium text-sm hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Placing order..." : "Place Order"}
              </button>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}