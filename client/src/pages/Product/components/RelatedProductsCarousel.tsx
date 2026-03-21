import { useRef } from "react";
import type { Product } from "@/service/productService";
import ProductCard from "@/components/ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function RelatedProductsCarousel({ title, products, isLoading }: { title: string, products: Product[], isLoading: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return <div className="py-4 animate-pulse h-[300px] bg-gray-100 rounded-xl w-full"></div>;
  }

  if (!products || products.length === 0) {
    return null; // hide if no related products
  }

  return (
    <div className="flex flex-col gap-4 relative py-4">
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      
      <div className="relative group">
        <button 
          onClick={scrollLeft}
          className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-gray-300 bg-white shadow-md flex items-center justify-center z-10 text-gray-600 hover:text-black hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth py-2"
        >
          {products.map(product => (
            <div key={product._id} className="min-w-[220px] max-w-[220px] shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <button 
          onClick={scrollRight}
          className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-gray-300 bg-white shadow-md flex items-center justify-center z-10 text-gray-600 hover:text-black hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
