import type { Product } from "@/service/productService";
import { 
  Truck, 
  HandCoins, 
  RotateCcw, 
  ShieldCheck, 
  Award, 
  Package, 
  Lock 
} from "lucide-react";

export default function ProductFeaturesSection({ product }: { product: Product }) {
  // Mock features list if the API description isn't a list
  const descriptionLines = product.description 
    ? product.description.split('\n').filter(line => line.trim() !== '')
    : [
        "Industry-Leading noise-cancellation-two processors control 8 microphones for unprecedented noise cancellation.",
        "Industry-leading call quality with our Precise Voice Pickup Technology.",
        "Magnificent Sound, engineered to perfection with the new Integrated Processor V1.",
        "Crystal clear hands-free calling with 4 beamforming microphones.",
        "Up to 40-hour battery life for continuous music playtime.",
        "Ultra-comfortable, lightweight design with soft fit leather.",
        "Multipoint connection allows you to quickly switch between devices."
      ];

  const policyIcons = [
    { icon: <Truck size={28} className="text-gray-500 mb-2" strokeWidth={1.5} />, label: "Free Delivery" },
    { icon: <HandCoins size={28} className="text-gray-500 mb-2" strokeWidth={1.5} />, label: "Pay on Delivery" },
    { icon: <RotateCcw size={28} className="text-gray-500 mb-2" strokeWidth={1.5} />, label: "10 days Return & Exchange" },
    { icon: <ShieldCheck size={28} className="text-gray-500 mb-2" strokeWidth={1.5} />, label: "1 Year Warranty" },
    { icon: <Award size={28} className="text-gray-500 mb-2" strokeWidth={1.5} />, label: "Top Brand" },
    { icon: <Package size={28} className="text-gray-500 mb-2" strokeWidth={1.5} />, label: "Sony Delivered" },
    { icon: <Lock size={28} className="text-gray-500 mb-2" strokeWidth={1.5} />, label: "Secure transaction" },
  ];

  return (
    <div className="flex flex-col gap-10">
      {/* About this item */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">About this item</h3>
        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 leading-relaxed md:grid md:grid-cols-2 md:gap-x-12">
          {descriptionLines.map((line, idx) => (
            <li key={idx} className="break-words">{line.replace(/^-\s*/, '')}</li>
          ))}
        </ul>
      </div>

      {/* Feature Icons Section */}
      <div className="bg-[#f0f2f5] -mx-4 px-4 py-8 overflow-hidden relative">
        <div className="max-w-[1280px] mx-auto flex gap-[4%] overflow-x-auto no-scrollbar justify-start md:justify-center">
          {policyIcons.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center text-center w-24 shrink-0 px-2 group">
              <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center border border-gray-200 group-hover:border-orange-400 group-hover:text-orange-500 transition-colors">
                {item.icon}
              </div>
              <span className="text-xs text-blue-600 mt-3 font-medium hover:underline cursor-pointer">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
