import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import ProtectedRoute from "@/components/protected-route";

interface Order {
  id:          number;
  orderNumber: string;
  status:      string;
  totalAmount: string;
  currency:    string;
  createdAt:   string;
}

async function fetchOrders(token: string): Promise<Order[]> {
  try {
    const res = await fetch(
      `${process.env.API_URL}/orders`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function OrdersPage() {
  const cookieStore = await cookies();
  const token       = cookieStore.get("auth_token")?.value ?? "";
  const orders      = await fetchOrders(token);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-white">
        <nav className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <a href="/products" className="text-sm text-zinc-500 hover:underline" >
            Back to Products
          </a>
          <h1 className="text-lg font-bold">Order History</h1>
        </nav>

        <main className="max-w-2xl mx-auto py-10 px-6">
          {orders.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-zinc-500 mb-4">
                You have not placed any orders yet.
              </p>
              <Link
                href="/products"
                className="text-sm font-medium underline text-zinc-600 dark:text-zinc-400"
              >
                Start shopping
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {orders.map((order) => (
                <li key={order.id}>
                  <Link
                    href={`/orders/confirmation/${order.id}`}
                    className="block bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-black dark:text-white">
                        {order.orderNumber}
                      </p>
                      <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-semibold px-3 py-1 rounded-full">
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-zinc-500">
                      <span>
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year:  "numeric",
                          month: "long",
                          day:   "numeric",
                        })}
                      </span>
                      <span className="font-medium text-black dark:text-white">
                        ${order.totalAmount}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}