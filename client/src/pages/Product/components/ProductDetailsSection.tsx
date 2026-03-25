import { useState, useEffect } from "react";
import type { Product } from "@/service/productService";
import { addToCart } from "@/service/cartService";
import { toast } from "react-toastify";

const StarRating = ({ rating, count }: { rating: number; count?: number }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center text-yellow-500 text-sm">
        <span className="font-semibold text-black mr-1">{rating.toFixed(1)}</span>
        {"★".repeat(Math.round(rating))}
        {"☆".repeat(5 - Math.round(rating))}
      </div>
      {count !== undefined && (
        <span className="text-blue-500 text-xs hover:underline cursor-pointer">
          {count} ratings
        </span>
      )}
    </div>
  );
};

export default function ProductDetailsSection({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.image);

  // Sync state when product changes (navigation)
  useEffect(() => {
    setActiveImage(product.image);
    setQuantity(1);
  }, [product._id, product.image]);

  const gallery =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : [product.image];

  const handleAddToCart = async () => {
    try {
      await addToCart(product._id, quantity);
      toast.success("Added to cart successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  };

  // price and priceDiscount are optional in the API
  const hasPrice = product.price != null && product.price > 0;
  const finalPrice = hasPrice ? product.price! - (product.priceDiscount || 0) : null;
  const discountPct =
    hasPrice && product.priceDiscount && product.priceDiscount > 0
      ? Math.round((product.priceDiscount / product.price!) * 100)
      : 0;

  return (
    <div className="flex flex-col md:flex-row gap-10">
      {/* Left side: Images */}
      <div className="flex flex-col-reverse md:flex-row gap-4 flex-shrink-0 md:w-1/2">
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar md:h-[500px] w-full md:w-20 shrink-0">
          {gallery.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(img)}
              className={`border-2 rounded-lg p-1 w-16 h-16 shrink-0 bg-gray-50 flex items-center justify-center transition-all ${
                activeImage === img
                  ? "border-orange-500"
                  : "border-transparent hover:border-gray-300"
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx}`}
                className="max-w-full max-h-full object-contain mix-blend-multiply"
              />
            </button>
          ))}
        </div>
        <div className="flex-1 bg-gray-50 rounded-2xl p-6 flex items-center justify-center min-h-[300px] md:h-[500px]">
          <img
            src={activeImage}
            alt={product.name}
            className="max-w-full max-h-full object-contain mix-blend-multiply drop-shadow-lg"
          />
        </div>
      </div>

      {/* Right side: Info */}
      <div className="flex flex-col flex-1">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 leading-tight">
          {product.name}
        </h1>

        {product.brand && (
          <p className="text-sm text-gray-500 mb-2">
            Brand:{" "}
            <span className="font-medium text-gray-900">{product.brand}</span>
          </p>
        )}

        <div className="mb-4">
          <StarRating
            rating={product.avgRating || 0}
            count={product.reviewCount || 0}
          />
        </div>

        <div className="border-t border-gray-100 my-4" />

        {/* Price — only render when API provides it */}
        {hasPrice && finalPrice != null && (
          <div className="mb-6 flex flex-col gap-1">
            <div className="flex items-center gap-3">
              {discountPct > 0 && (
                <span className="text-red-600 text-3xl font-light">
                  -{discountPct}%
                </span>
              )}
              <span className="text-3xl font-semibold text-gray-900">
                ₹{finalPrice.toLocaleString("en-IN")}
              </span>
            </div>
            {product.priceDiscount && product.priceDiscount > 0 && (
              <p className="text-gray-500 text-sm flex items-center gap-1">
                M.R.P:{" "}
                <span className="line-through">
                  ₹{product.price!.toLocaleString("en-IN")}
                </span>
              </p>
            )}
          </div>
        )}

        {/* Warranty / Shipping chips */}
        <div className="flex flex-wrap gap-3 mb-6">
          {product.warranty && (
            <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full font-medium">
              🛡️ Bảo hành: {product.warranty}
            </span>
          )}
          {product.shippingFee && (
            <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full font-medium">
              🚚 Giao hàng: {product.shippingFee}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 mb-8">
          <label className="text-sm font-medium text-gray-700">Quantity:</label>
          <div className="flex items-center border border-gray-300 rounded-md">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              readOnly
              className="w-12 text-center py-1 border-x border-gray-300 text-sm focus:outline-none"
            />
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-auto">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black py-3 px-6 rounded-full font-medium transition-colors shadow-sm"
          >
            Add to Cart
          </button>
          <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-full font-medium transition-colors shadow-sm">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
