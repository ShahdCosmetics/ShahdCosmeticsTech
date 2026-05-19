interface CartItem {
  itemId:       number;
  productName:  string;
  primaryImage: string | null;
  basePrice:    string;
  quantity:     number;
  subtotal:     string;
}

interface CheckoutSummaryProps {
  items:       CartItem[];
  totalAmount: string;
}

export default function CheckoutSummary({
  items,
  totalAmount,
}: CheckoutSummaryProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-lg font-semibold text-black dark:text-white">
          Order Summary
        </h2>
      </div>

      <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {items.map((item) => (
          <li key={item.itemId} className="flex gap-4 p-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
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
            <div className="flex-1 flex flex-col justify-center gap-1">
              <p className="text-sm font-medium text-black dark:text-white">
                {item.productName}
              </p>
              <p className="text-xs text-zinc-500">
                ${item.basePrice} x {item.quantity}
              </p>
            </div>
            <div className="flex items-center">
              <p className="text-sm font-semibold text-black dark:text-white">
                ${item.subtotal}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
        <span className="text-sm text-zinc-500">Total</span>
        <span className="text-xl font-bold text-black dark:text-white">
          ${totalAmount}
        </span>
      </div>
    </div>
  );
}