import type { Product } from "@/service/productService";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { addToCart } from "@/service/cartService";
import { toast } from "react-toastify";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { _id, name, image, price, priceDiscount, avgRating, reviewCount } = product;

  // Format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const safePrice = price ?? 0;
  const safeDiscount = priceDiscount ?? 0;
  const discountPercentage = safePrice > 0 && safeDiscount > 0 ? Math.round(((safePrice - safeDiscount) / safePrice) * 100) : 0;

  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();
    try {
      setIsAdding(true);
      await addToCart(_id, 1);
      toast.success("Added to cart");
      navigate("/cart");
    } catch (error: any) {
      if (error?.response?.status === 401) {
        toast.error("Please login to buy products");
        navigate("/auth/login");
      } else {
        toast.error(error?.response?.data?.message || "Failed to add to cart");
      }
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Link 
      to={`/product/${_id}`}
      className="group flex flex-col relative w-full h-full bg-white rounded-2xl p-4 overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 block text-current no-underline"
    >
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          -{discountPercentage}%
        </div>
      )}

      {/* Image Container */}
      <div className="aspect-square w-full rounded-xl bg-gray-50 mb-4 overflow-hidden relative flex items-center justify-center">
        <img
          src={image || "https://placehold.co/400?text=No+Image"}
          alt={name}
          className="object-contain w-full h-full p-4 mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow">
        <h3 className="font-semibold text-sm md:text-base text-gray-900 line-clamp-2 mb-2 min-h-[40px] md:min-h-[48px]">
          {name}
        </h3>

        <div className="flex items-center gap-1 mb-2">
          {avgRating > 0 && (
            <div className="flex items-center text-yellow-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-medium ml-1 text-gray-700">{avgRating.toFixed(1)}</span>
            </div>
          )}
          {reviewCount > 0 && (
            <span className="text-sm text-gray-500">({reviewCount})</span>
          )}
        </div>

        <div className="mt-auto flex flex-col md:flex-row md:items-end justify-between gap-3 pt-2">
          <div>
            <div className="text-lg font-bold text-gray-900 leading-none">
              {safePrice > 0 ? formatPrice(safeDiscount || safePrice) : "Liên hệ"}
            </div>
            {safeDiscount > 0 && safeDiscount < safePrice && (
              <div className="text-xs text-gray-500 line-through mt-1">
                {formatPrice(safePrice)}
              </div>
            )}
          </div>

          <Button 
            className="w-full md:w-auto bg-gray-900 hover:bg-gray-800 text-white text-xs py-1 h-8 rounded-lg opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleBuyNow}
            disabled={isAdding}
          >
            {isAdding ? "Adding..." : "Buy Now"}
          </Button>
        </div>
      </div>
    </Link>
  );
}
