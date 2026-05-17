"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import { getAuthToken } from "@/lib/auth";

interface CartItem {
  itemId:       number;
  variantId:    string;
  productName:  string;
  basePrice:    string;
  primaryImage: string | null;
  quantity:     number;
  subtotal:     string;
}

interface Cart {
  cartId:      number | null;
  totalAmount: string;
  items:       CartItem[];
}

interface CartState {
  cart:      Cart;
  isOpen:    boolean;
  isLoading: boolean;
}

type CartAction =
  | { type: "SET_CART";    payload: Cart }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" };

interface CartContextValue {
  cart:       Cart;
  isOpen:     boolean;
  isLoading:  boolean;
  addItem:    (variantId: string, quantity: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  openCart:   () => void;
  closeCart:  () => void;
}

const EMPTY_CART: Cart = { cartId: null, totalAmount: "0.00", items: [] };

const initialState: CartState = {
  cart:      EMPTY_CART,
  isOpen:    false,
  isLoading: false,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_CART":
      return { ...state, cart: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "OPEN_CART":
      return { ...state, isOpen: true };
    case "CLOSE_CART":
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const fetchCart = useCallback(async () => {
    const token = getAuthToken();
    if (!token) return;

    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        dispatch({ type: "SET_CART", payload: data });
      }
    } catch {
      // Non-critical — cart stays empty if fetch fails
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  // Hydrate cart on mount if user is authenticated
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  async function addItem(variantId: string, quantity: number) {
    const token = getAuthToken();
    if (!token) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/items`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ variantId, quantity }),
        }
      );
      if (res.ok) await fetchCart();
    } catch {
      // Silent fail — user can retry
    }
  }

  async function updateItem(itemId: number, quantity: number) {
    const token = getAuthToken();
    if (!token) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/items/${itemId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity }),
        }
      );
      if (res.ok) await fetchCart();
    } catch {
      // Silent fail — user can retry
    }
  }

  async function removeItem(itemId: number) {
    const token = getAuthToken();
    if (!token) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/cart/items/${itemId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) await fetchCart();
    } catch {
      // Silent fail — user can retry
    }
  }

  return (
    <CartContext.Provider
      value={{
        cart:      state.cart,
        isOpen:    state.isOpen,
        isLoading: state.isLoading,
        addItem,
        updateItem,
        removeItem,
        openCart:  () => dispatch({ type: "OPEN_CART" }),
        closeCart: () => dispatch({ type: "CLOSE_CART" }),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside a CartProvider");
  }
  return context;
}