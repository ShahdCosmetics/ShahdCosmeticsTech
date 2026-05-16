"use client";

import { useCart } from "@/context/cart-context";

export default function CartDrawer() {
  const { cart, isOpen, isLoading, updateItem, removeItem, closeCart } =
    useCart();

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={closeCart}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-zinc-900 z-50 shadow-2xl flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-bold text-black dark:text-white">
            Your Cart
            {totalItems > 0 && (
              <span className="ml-2 text-sm font-normal text-zinc-500">
                ({totalItems} {totalItems === 1 ? "item" : "items"})
              </span>
            )}
          </h2>
          <button
            onClick={closeCart}
            className="text-zinc-500 hover:text-black dark:hover:text-white transition-colors text-2xl leading-none"
          >
            x
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-zinc-400 text-sm">Loading cart...</p>
            </div>
          ) : cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-3">
              <p className="text-zinc-400 text-sm">Your cart is empty.</p>
              <button
                onClick={closeCart}
                className="text-sm font-medium underline text-zinc-600 dark:text-zinc-400"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="flex flex-col gap-6">
              {cart.items.map((item) => (
                <li
                  key={item.itemId}
                  className="flex gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-6 last:border-none"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
                    {item.primaryImage ? (
                      <img
                        src={item.primaryImage}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col gap-1">
                    <p className="font-medium text-sm text-black dark:text-white">
                      {item.productName}
                    </p>
                    <p className="text-zinc-500 text-sm">
                      ${item.basePrice} each
                    </p>
                    <p className="text-zinc-700 dark:text-zinc-300 text-sm font-semibold">
                      Subtotal: ${item.subtotal}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateItem(item.itemId, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        className="w-7 h-7 rounded-lg border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-sm font-bold disabled:opacity-40 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        -
                      </button>
                      <span className="text-sm font-medium w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateItem(item.itemId, item.quantity + 1)
                        }
                        className="w-7 h-7 rounded-lg border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-sm font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.itemId)}
                        className="ml-2 text-xs text-red-500 hover:text-red-700 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cart.items.length > 0 && (
          <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-500">Subtotal</span>
              <span className="text-lg font-bold text-black dark:text-white">
                ${cart.totalAmount}
              </span>
            </div>
            
              href="/checkout"
              className="w-full bg-black dark:bg-white dark:text-black text-white py-3 rounded-xl font-medium text-center text-sm block"
            <a>
              Proceed to Checkout
            </a>
            <button
              onClick={closeCart}
              className="w-full border border-zinc-300 dark:border-zinc-700 py-3 rounded-xl font-medium text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}