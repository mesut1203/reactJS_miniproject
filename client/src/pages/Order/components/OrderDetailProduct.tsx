import { type OrderItem } from "@/service/orderService";

interface OrderDetailProductProps {
  item: OrderItem;
  status: string;
  isCanceling: boolean;
  onCancel: () => void;
}

export default function OrderDetailProduct({
  item,
  status,
  isCanceling,
  onCancel,
}: OrderDetailProductProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 justify-end items-start mt-6">
      {/* Product Image */}
      <div className="w-48 h-48 flex-shrink-0 flex items-center justify-center p-2">
        <img
          src={item.image || "https://placehold.co/300?text=No+Image"}
          alt={item.name}
          className="max-w-full max-h-full object-contain mix-blend-multiply drop-shadow-md"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-4 w-full sm:w-64 shrink-0">
        <button className="w-full py-3 px-6 bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-sm font-bold rounded-full transition-colors focus:ring-2 focus:ring-yellow-300 outline-none shadow-sm text-center">
          Track Package
        </button>
        <button className="w-full py-3 px-6 bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-sm font-bold rounded-full transition-colors focus:ring-2 focus:ring-yellow-300 outline-none shadow-sm text-center">
          Get Product support
        </button>
        {status === "pending" && (
          <button
            onClick={onCancel}
            disabled={isCanceling}
            className="w-full py-3 px-6 bg-white hover:bg-gray-50 text-gray-900 text-sm font-bold rounded-full border-2 border-yellow-400 focus:ring-2 focus:ring-yellow-300 outline-none shadow-sm disabled:border-gray-200 disabled:text-gray-400 text-center transition-colors"
          >
            {isCanceling ? "Canceling..." : "Cancel this delivery"}
          </button>
        )}
      </div>
    </div>
  );
}
