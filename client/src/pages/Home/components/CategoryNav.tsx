import { useSelector } from "react-redux";
import type { RootState } from "@/stores/store";
import { Menu } from "lucide-react";

export default function CategoryNav() {
  const { categories } = useSelector((state: RootState) => state.product);

  return (
    <div className="w-full bg-#FFFFFF border-b border-gray-100 py-4 shadow-sm sticky top-[64px] z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-center gap-4">
        
        {/* Horizontal scroll container for categories */}
        <div className="flex overflow-x-auto no-scrollbar gap-3 md:gap-4 py-1 items-center max-w-[80vw]">
          {categories.length > 0 ? categories.map((cat, idx) => (
            <button 
              key={idx}
              className="whitespace-nowrap rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium px-5 py-2 transition-colors"
            >
              {cat}
            </button>
          )) : (
            // Skeletons if loading or empty
            [...Array(6)].map((_, i) => (
              <div key={i} className="min-w-[100px] h-9 bg-gray-100 animate-pulse rounded-full"></div>
            ))
          )}
        </div>
        
        {/* Hamburger icon like design */}
        <button className="flex-shrink-0 ml-2 p-2 hover:bg-gray-100 rounded-full transition-colors hidden md:block">
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}
