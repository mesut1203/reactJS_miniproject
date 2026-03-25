import type { Order } from "@/service/orderService";
import { Link } from "react-router-dom";
import { RouteNames } from "@/constants/route";

interface OrderItemCardProps {
  order: Order;
  onCancel: (orderId: string) => void;
  isCanceling: boolean;
}

const formatPrice = (p: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(p);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function OrderItemCard({ order, onCancel, isCanceling }: OrderItemCardProps) {
  const getStatusDisplay = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return { text: "Preparing for Shipment", color: "text-blue-600" };
      case "cancelled":
        return { text: "Cancelled", color: "text-red-500" };
      case "shipped":
        return { text: "Shipped", color: "text-indigo-600" };
      case "delivered":
        return { text: "Delivered", color: "text-green-600" };
      default:
        return { text: status.charAt(0).toUpperCase() + status.slice(1), color: "text-gray-900" };
    }
  };

  const statusDisplay = getStatusDisplay(order.status);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      {/* Grey Header */}
      <div className="bg-gray-200/50 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 text-sm">
        <div className="flex flex-wrap items-center gap-x-12 gap-y-4">
          <div className="flex flex-col">
            <span className="text-gray-500 uppercase text-xs font-semibold mb-1 tracking-wider">Order Placed</span>
            <span className="text-gray-900 font-medium">{formatDate(order.createdAt)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 uppercase text-xs font-semibold mb-1 tracking-wider">Total</span>
            <span className="text-gray-900 font-medium">{formatPrice(order.total)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 uppercase text-xs font-semibold mb-1 tracking-wider">Ship To</span>
            <span className="text-blue-600 font-medium hover:underline cursor-pointer transition-colors max-w-[150px] truncate" title={order.address}>
              {order.address || "Default Address"}
            </span>
          </div>
        </div>
        <div className="flex flex-col sm:items-end">
          <span className="text-gray-500 uppercase text-xs font-semibold mb-1 tracking-wider">Order #</span>
          <span className="text-gray-900 font-medium">{order._id.toUpperCase()}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col lg:flex-row gap-6 justify-between">
        
        {/* Left Side: Status & Items */}
        <div className="flex-1 flex flex-col gap-6">
          <h3 className={`text-xl font-bold ${statusDisplay.color}`}>
            {statusDisplay.text}
          </h3>

          <div className="flex flex-col gap-6">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row gap-6">
                <div className="w-32 h-32 flex-shrink-0 bg-gray-50 rounded-xl p-2 flex items-center justify-center">
                  <img
                    src={item.image || "https://placehold.co/200?text=No+Image"}
                    alt={item.name}
                    className="max-w-full max-h-full object-contain mix-blend-multiply drop-shadow-sm"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-center gap-2">
                  <h4 className="text-sm font-bold text-gray-900 leading-snug max-w-lg">
                    {item.name}
                  </h4>
                  <p className="text-sm font-semibold text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Buttons */}
        <div className="flex flex-col gap-3 w-full lg:w-64 shrink-0 justify-center">
          <Link to={RouteNames.ORDER_DETAIL.replace(":id", order._id)} className="w-full text-center py-2.5 px-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-sm font-bold rounded-full transition-colors focus:ring-2 focus:ring-yellow-300 outline-none shadow-sm block box-border">
            Track Package
          </Link>
          <button className="w-full py-2.5 px-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-sm font-bold rounded-full transition-colors focus:ring-2 focus:ring-yellow-300 outline-none shadow-sm">
            Get Product support
          </button>
          {order.status === "pending" && (
            <button
              onClick={() => onCancel(order._id)}
              disabled={isCanceling}
              className="w-full py-2.5 px-4 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-200 disabled:text-gray-500 text-gray-900 text-sm font-bold rounded-full transition-colors focus:ring-2 focus:ring-yellow-300 outline-none shadow-sm disabled:shadow-none"
            >
              {isCanceling ? "Canceling..." : "Cancel this delivery"}
            </button>
          )}
        </div>
        
      </div>
    </div>
  );
}
