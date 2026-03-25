import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrders, cancelOrder, type Order } from "@/service/orderService";
import { toast } from "react-toastify";
import OrderItemCard from "./components/OrderItemCard";
import { MoveLeft } from "lucide-react";

export default function OrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrders();
      // Sort orders by newest first
      const sorted = (data.orders || []).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(sorted);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      setCancelingId(orderId);
      const data = await cancelOrder(orderId);
      toast.success(data.message || "Order cancelled successfully");
      
      // Update local state to reflect cancellation without full refetch
      setOrders(orders.map(o => 
        o._id === orderId ? { ...o, status: "cancelled" } : o
      ));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancelingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-gray-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-500 font-medium">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] bg-gray-50 flex flex-col items-center justify-center p-8">
        <div className="bg-white p-8 rounded-xl shadow-sm text-center max-w-md w-full">
          <p className="text-red-500 font-medium mb-4">{error}</p>
          <button 
            onClick={fetchOrders}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium mb-6 transition-colors no-underline">
            <MoveLeft size={16} /> Back to Home
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 pb-4 border-b border-gray-200">
            Your Orders
          </h1>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center max-w-2xl mx-auto mt-8">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📦</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No orders yet</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              You haven't placed any orders. Start exploring our products and find something you love!
            </p>
            <Link 
              to="/search" 
              className="inline-block px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg focus:ring-4 focus:ring-blue-100 outline-none"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-8 max-w-5xl">
            {orders.map((order) => (
              <OrderItemCard 
                key={order._id} 
                order={order} 
                onCancel={handleCancelOrder}
                isCanceling={cancelingId === order._id}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
