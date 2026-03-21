import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "@/service/productService";

interface SearchResultCardProps {
  product: Product;
}

const SearchResultCard = ({ product }: SearchResultCardProps) => {
  const {
    _id,
    name,
    image,
    price,
    priceDiscount,
    avgRating,
    reviewCount,
    brand,
    warranty,
    shippingFee,
  } = product;

  const formatPrice = (p: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(p);
  };

  const hasPrice = price != null && price > 0;
  const finalPrice = hasPrice ? price - (priceDiscount || 0) : null;
  const discountPct =
    hasPrice && priceDiscount && priceDiscount > 0
      ? Math.round((priceDiscount / price) * 100)
      : 0;

  return (
    <Link
      to={`/product/${_id}`}
      className="flex flex-col md:flex-row gap-6 p-4 bg-white border-b border-gray-100 hover:shadow-md transition-shadow group no-underline text-inherit"
    >
      {/* Product Image */}
      <div className="w-full md:w-64 h-64 flex-shrink-0 flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden p-4">
        <img
          src={image || "https://placehold.co/400?text=No+Image"}
          alt={name}
          className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col gap-2">
        <h3 className="text-lg font-medium text-blue-800 group-hover:text-orange-600 transition-colors line-clamp-2 md:max-w-2xl">
          {name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex text-yellow-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < Math.round(avgRating || 0) ? "fill-current" : "fill-gray-200 text-gray-200"}
              />
            ))}
          </div>
          <span className="text-xs text-blue-600 hover:underline cursor-pointer ml-1">
            {reviewCount?.toLocaleString() || 0}
          </span>
        </div>

        {/* Price Section */}
        {hasPrice && finalPrice != null && (
          <div className="mt-1">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">
                {formatPrice(finalPrice)}
              </span>
              {discountPct > 0 && (
                <span className="text-sm text-gray-500">
                  M.R.P: <span className="line-through">{formatPrice(price)}</span>
                  <span className="ml-2">({discountPct}% off)</span>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Other Info */}
        <div className="mt-2 space-y-1 text-sm text-gray-600">
          {brand && (
            <p>
              Brand: <span className="font-medium text-gray-900">{brand}</span>
            </p>
          )}
          {warranty && (
            <p>
              {warranty} warranty
            </p>
          )}
          {shippingFee && (
            <p className="text-gray-500">
              {shippingFee.toLowerCase() === "miễn phí" ? "Free Delivery" : `Shipping: ${shippingFee}`}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default SearchResultCard;
