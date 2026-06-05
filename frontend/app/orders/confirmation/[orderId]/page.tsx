import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import ProtectedRoute from "@/components/protected-route";
import OrderConfirmation from "@/components/order-confirmation";

interface Props {
  params: Promise<{ orderId: string }>;
}

async function fetchOrder(orderId: string, token: string) {
  try {
    const res = await fetch(
      `${process.env.API_URL}/orders/${orderId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function OrderConfirmationPage({ params }: Props) {
  const { orderId }   = await params;
  const cookieStore   = await cookies();
  const token         = cookieStore.get("auth_token")?.value ?? "";
  const order         = await fetchOrder(orderId, token);

  if (!order) return notFound();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-50 dark:bg-black text-black dark:text-white">
        <nav className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <a href="/products" className="text-sm text-zinc-500 hover:underline">
            Back to Products
          </a>
        </nav>
        <main className="max-w-2xl mx-auto py-10 px-6">
          <OrderConfirmation order={order} />
        </main>
      </div>
    </ProtectedRoute>
  );
}