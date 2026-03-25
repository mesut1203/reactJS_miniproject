import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getCart,
  removeFromCart,
  updateCartQuantity,
  getCartSuggestYouMightAlsoLike,
  getCartSuggestRecommended,
  type CartData,
} from "@/service/cartService";
import { createOrder } from "@/service/orderService";
import type { Product } from "@/service/productService";
import CartItem from "./components/CartItem";
import CartSubtotal from "./components/CartSubtotal";
import ProductCarousel from "./components/ProductCarousel";

export default function Cart() {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [mightLike, setMightLike] = useState<Product[]>([]);
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    fetchCart();
    fetchSuggestions();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCart();
      setCartData(data);
    } catch (err: any) {
      if (err?.response?.status === 401) {
        toast.error("Please login to view your cart");
        navigate("/auth/login");
      } else {
        setError("Failed to load your cart. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    try {
      setSuggestionsLoading(true);
      const [likeRes, recRes] = await Promise.all([
        getCartSuggestYouMightAlsoLike().catch(() => ({ products: [] })),
        getCartSuggestRecommended().catch(() => ({ products: [] })),
      ]);
      setMightLike(likeRes.products || []);
      setRecommended(recRes.products || []);
    } catch (error) {
      console.error("Failed to load suggestions", error);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    try {
      // Optimistic update
      if (cartData) {
        setCartData({
          ...cartData,
          items: cartData.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item,
          ),
        });
      }
      const data = await updateCartQuantity(productId, quantity);
      toast.success(data.message || "Cart updated");
      fetchCart(); // Re-fetch to get correct totals
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update quantity");
      fetchCart(); // Revert on failure
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      // Optimistic upate
      if (cartData) {
        setCartData({
          ...cartData,
          items: cartData.items.filter((item) => item.productId !== productId),
        });
      }
      const data = await removeFromCart(productId);
      toast.success(data.message || "Item removed from cart");
      fetchCart();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to remove item");
      fetchCart();
    }
  };

  const handleProceedToBuy = async () => {
    try {
      setIsCheckingOut(true);
      const data = await createOrder({ address: "Default Tracking Address" });
      toast.success(data.message || "Order placed successfully!");
      navigate("/orders");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to place order. Please try again.",
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-500 font-medium">
          Loading your shopping cart...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
        <div className="bg-white p-8 rounded-xl shadow-sm text-center max-w-md w-full">
          <p className="text-red-500 font-medium mb-4">{error}</p>
          <button
            onClick={fetchCart}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const isEmpty = !cartData?.items || cartData.items.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Main Cart Section */}
        <div className="mb-12">
          {isEmpty ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Your Shopping Cart is empty
              </h2>
              <p className="text-gray-500 mb-8">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Link
                to="/search"
                className="inline-block px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg focus:ring-4 focus:ring-blue-100 outline-none"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto flex flex-col gap-6">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Shopping Cart
                  </h1>
                </div>

                <div className="flex flex-col">
                  {cartData.items.map((item) => (
                    <CartItem
                      key={item.productId}
                      item={item}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </div>
              </div>

              {/* Subtotal Section */}
              <div className="flex justify-end">
                <div className="w-full md:w-[480px]">
                  <CartSubtotal
                    totalItems={cartData.items.length}
                    totalPrice={cartData.total}
                    onProceedToBuy={handleProceedToBuy}
                    disabled={isCheckingOut}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Suggestion Carousels */}
        <div className="max-w-7xl mx-auto flex flex-col gap-12 border-t border-gray-200 pt-12">
          {suggestionsLoading && (
            <div className="py-20 flex justify-center">
              <div className="animate-pulse flex gap-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-48 h-64 bg-gray-200 rounded-2xl"
                  ></div>
                ))}
              </div>
            </div>
          )}

          {!suggestionsLoading && mightLike.length > 0 && (
            <ProductCarousel title="You might also like" products={mightLike} />
          )}

          {!suggestionsLoading && recommended.length > 0 && (
            <ProductCarousel title="Recommended" products={recommended} />
          )}
        </div>
      </div>
    </div>
  );
}
