interface CartSubtotalProps {
  totalItems: number;
  totalPrice: number;
  onProceedToBuy: () => void;
  disabled?: boolean;
}

const formatPrice = (p: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(p);
};

export default function CartSubtotal({ totalItems, totalPrice, onProceedToBuy, disabled }: CartSubtotalProps) {
  return (
    <div className="bg-white p-6 flex flex-col md:flex-row items-center justify-between border-t border-gray-100 md:border-t-0 md:rounded-xl shadow-sm">
      <h2 className="text-xl md:text-2xl text-gray-900 mb-4 md:mb-0">
        Subtotal ({totalItems} items): <span className="font-bold">{formatPrice(totalPrice)}</span>
      </h2>
      <button
        onClick={onProceedToBuy}
        disabled={disabled}
        className="w-full md:w-auto px-8 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 text-sm font-bold rounded-full transition-colors focus:ring-2 focus:ring-yellow-300 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {disabled ? "Processing..." : "Proceed to buy"}
      </button>
    </div>
  );
}
