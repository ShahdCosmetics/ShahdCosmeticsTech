interface OrderItem {
  id:          number;
  productName: string;
  quantity:    number;
  unitPrice:   string;
  totalPrice:  string;
}

interface Order {
  id:               number;
  orderNumber:      string;
  status:           string;
  totalAmount:      string;
  currency:         string;
  paymentReference: string;
  createdAt:        string;
  items:            OrderItem[];
}

export default function OrderConfirmation({ order }: { order: Order }) {
  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year:  "numeric",
    month: "long",
    day:   "numeric",
  });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600 dark:text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-black dark:text-white mb-2">
          Order Confirmed
        </h1>
        <p className="text-zinc-500 text-sm">
          Thank you for your purchase. Here are your order details.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-xs text-zinc-400 uppercase tracking-wide mb-1">
              Order Number
            </p>
            <p className="text-sm font-semibold text-black dark:text-white">
              {order.orderNumber}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-400 uppercase tracking-wide mb-1">
              Status
            </p>
            <span className="inline-block bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-semibold px-3 py-1 rounded-full">
              {order.status}
            </span>
          </div>
          <div>
            <p className="text-xs text-zinc-400 uppercase tracking-wide mb-1">
              Payment Reference
            </p>
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              {order.paymentReference}
            </p>
          </div>
          <div>
            <p className="text-xs text-zinc-400 uppercase tracking-wide mb-1">
              Date
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {formattedDate}
            </p>
          </div>
        </div>

        <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4">
          <h3 className="text-sm font-semibold text-black dark:text-white mb-3">
            Items
          </h3>
          <ul className="flex flex-col gap-3">
            {order.items.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-zinc-600 dark:text-zinc-400">
                  {item.productName} x {item.quantity}
                </span>
                <span className="font-medium text-black dark:text-white">
                  ${item.totalPrice}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-4 flex justify-between items-center">
          <span className="text-sm text-zinc-500">Total</span>
          <span className="text-xl font-bold text-black dark:text-white">
            ${order.totalAmount}
          </span>
        </div>
      </div>

      <div className="flex gap-4">
        <a
          href="/products"
          className="flex-1 border border-zinc-300 dark:border-zinc-700 py-3 rounded-xl font-medium text-sm text-center hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-black dark:text-white"
        >
          Continue Shopping
        </a>
        <a
          href="/orders"
          className="flex-1 bg-black dark:bg-white dark:text-black text-white py-3 rounded-xl font-medium text-sm text-center hover:opacity-80 transition-opacity"
        >
          View All Orders
        </a>
      </div>
    </div>
  );
}