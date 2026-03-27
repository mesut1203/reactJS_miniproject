import { Trash2 } from "lucide-react";
import type { CartItem as ICartItem } from "@/service/cartService";

interface CartItemProps {
  item: ICartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  isUpdating?: boolean;
}

const formatPrice = (p: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(p);
};

export default function CartItem({ item, onUpdateQuantity, onRemove, isUpdating = false }: CartItemProps) {
  const discountPct = item.priceDiscount > 0 ? Math.round(((item.price - item.priceDiscount) / item.price) * 100) : 0;
  const currentPrice = item.price - (item.priceDiscount || 0);

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-white border-b border-gray-100 last:border-b-0">
      <div className="w-full md:w-48 flex-shrink-0 flex items-center justify-center">
        <img
          src={item.image || "https://placehold.co/400?text=No+Image"}
          alt={item.name}
          className="max-w-full h-auto object-contain"
        />
      </div>

      <div className="flex-1 flex flex-col gap-2">
        <h3 className="text-sm font-bold text-gray-900 leading-tight md:max-w-2xl">
          {item.name}
        </h3>

        <div className="flex items-center gap-2 mt-1">
          <div className="flex text-yellow-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < Math.round(item.avgRating || 0) ? "text-yellow-400" : "text-gray-200"}>★</span>
            ))}
          </div>
          <span className="text-xs text-blue-600 hover:underline cursor-pointer">
            {item.reviewCount?.toLocaleString() || 0}
          </span>
        </div>

        <div className="flex items-center gap-3 mt-1">
          <span className="text-lg font-bold text-gray-900">{formatPrice(currentPrice)}</span>
          {discountPct > 0 && (
            <>
              <span className="text-xs text-gray-500 line-through">M.R.P: {formatPrice(item.price)}</span>
              <span className="text-xs text-gray-900 font-medium">({discountPct}% off)</span>
            </>
          )}
        </div>

        <div className="text-xs text-gray-500 space-y-1 mt-2">
          {item.brand && <p>Brand: {item.brand}</p>}
          {item.warranty && <p>{item.warranty} warranty</p>}
          <p>{item.shippingFee === 0 || item.shippingFee === "miễn phí" ? "Free Delivery" : `Shipping: ${item.shippingFee}`}</p>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center border border-gray-200 rounded-md">
            <button
              onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
              disabled={item.quantity <= 1 || isUpdating}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              −
            </button>
            <span className="px-3 py-1 text-sm font-medium border-x border-gray-200 min-w-[36px] text-center">
              {isUpdating ? (
                <span className="inline-block w-3 h-3 rounded-full border-2 border-gray-400 border-t-transparent animate-spin" />
              ) : (
                item.quantity
              )}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
              disabled={isUpdating}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              +
            </button>
          </div>
          <button
            onClick={() => onRemove(item.productId)}
            className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
