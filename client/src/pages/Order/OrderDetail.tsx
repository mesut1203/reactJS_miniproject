import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById, cancelOrder, type Order } from "@/service/orderService";
import { toast } from "react-toastify";
import TrackingInfoBox from "./components/TrackingInfoBox";
import OrderDetailProduct from "./components/OrderDetailProduct";

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchOrderDetails(id);
    }
  }, [id]);

  const fetchOrderDetails = async (orderId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrderById(orderId);
      setOrder(data.order);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    try {
      setCancelingId(order._id);
      const data = await cancelOrder(order._id);
      toast.success(data.message || "Order cancelled successfully");
      setOrder({ ...order, status: "cancelled" });
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
        <p className="text-gray-500 font-medium">Loading details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[70vh] bg-gray-50 flex flex-col items-center justify-center p-8">
        <div className="bg-white p-8 rounded-xl shadow-sm text-center max-w-md w-full">
          <p className="text-red-500 font-medium mb-4">
            {error || "Order not found"}
          </p>
          <button
            onClick={() => navigate("/orders")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="bg-white px-8 py-10 rounded-xl border border-gray-200">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-4 mb-10 pb-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
            <span className="text-gray-500 font-medium text-lg">
              #{order._id.toUpperCase()}
            </span>
          </div>

          <div className="flex flex-col gap-12 lg:gap-16">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col lg:flex-row gap-8 lg:gap-12 justify-between pb-10 border-b border-gray-100 last:border-0 last:pb-0"
              >
                {/* Left Side: Tracking Info */}
                <div className="flex-1">
                  <TrackingInfoBox
                    status={order.status}
                    trackingId={order.trackingId}
                  />
                </div>

                {/* Right Side: Product Image & Actions */}
                <div className="flex-1">
                  <OrderDetailProduct
                    item={item}
                    status={order.status}
                    isCanceling={cancelingId === order._id}
                    onCancel={handleCancelOrder}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
