import React from "react";

interface TrackingInfoBoxProps {
  status: string;
  trackingId?: string;
}

export default function TrackingInfoBox({ status, trackingId }: TrackingInfoBoxProps) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-gray-900">
        {status === "pending" ? "Preparing for Shipment" : 
         status === "cancelled" ? "Cancelled" :
         status === "shipped" ? "Shipped" :
         status === "delivered" ? "Arriving Today" : "Processing"}
      </h2>
      
      <div className="border border-gray-600 rounded-lg p-6 max-w-md">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          Tracking info provided by K. B. TRADERS
        </h3>
        
        <div className="flex flex-col gap-1 text-gray-700 font-medium text-lg">
          <p>Shipping with Delhivery</p>
          <p>Tracking ID: {trackingId || "Pending"}</p>
        </div>
      </div>
    </div>
  );
}
