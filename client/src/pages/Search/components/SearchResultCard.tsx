import { Star, Shield, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "@/service/productService";

interface SearchResultCardProps {
  product: Product;
}

const SearchResultCard = ({ product }: SearchResultCardProps) => {
  const { _id, name, image, price, priceDiscount, avgRating, reviewCount, brand, warranty, shippingFee } = product;

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p);

  const hasDiscount = priceDiscount != null && priceDiscount > 0 && price > priceDiscount;
  const finalPrice = hasDiscount ? priceDiscount : price;
  const discountPct = hasDiscount ? Math.round(((price - priceDiscount!) / price) * 100) : 0;
  const rating = Math.round(avgRating || 0);
  const isFreeShipping =
    !shippingFee ||
    shippingFee === "0" ||
    shippingFee.toLowerCase().includes("miễn phí") ||
    shippingFee.toLowerCase().includes("free");

  return (
    <Link
      to={`/product/${_id}`}
      className="flex gap-5 py-5 px-2 border-b border-gray-100 hover:bg-gray-50 transition-colors group no-underline text-inherit"
    >
      {/* Image */}
      <div className="w-44 h-44 flex-shrink-0 bg-white rounded-xl border border-gray-100 flex items-center justify-center p-3 overflow-hidden">
        <img
          src={image || "https://placehold.co/300?text=No+Image"}
          alt={name}
          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
        />
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col gap-1.5 py-1">
        <h3 className="text-sm font-medium text-gray-800 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug">
          {name}
        </h3>

        {/* Stars */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={12}
                className={i < rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}
              />
            ))}
          </div>
          {reviewCount != null && (
            <span className="text-xs text-blue-600 hover:underline cursor-pointer">
              {reviewCount.toLocaleString()}
            </span>
          )}
        </div>

        {/* Price */}
        {finalPrice != null && finalPrice > 0 && (
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-lg font-bold text-gray-900">{formatPrice(finalPrice)}</span>
            {hasDiscount && (
              <>
                <span className="text-xs text-gray-400 line-through">{formatPrice(price)}</span>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                  -{discountPct}%
                </span>
              </>
            )}
          </div>
        )}
        {hasDiscount && (
          <p className="text-xs text-gray-400">
            M.R.P: <span className="line-through">{formatPrice(price)}</span>
          </p>
        )}

        {/* Meta */}
        <div className="flex flex-col gap-1 mt-1">
          {brand && (
            <p className="text-xs text-gray-500">
              Brand: <span className="font-semibold text-gray-700">{brand}</span>
            </p>
          )}
          {warranty && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Shield size={11} className="text-gray-400" />
              {warranty}
            </div>
          )}
          <div className="flex items-center gap-1 text-xs">
            <Truck size={11} className={isFreeShipping ? "text-green-500" : "text-gray-400"} />
            <span className={isFreeShipping ? "text-green-600 font-medium" : "text-gray-500"}>
              {isFreeShipping ? "Free Delivery" : `Shipping: ${shippingFee}`}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SearchResultCard;
