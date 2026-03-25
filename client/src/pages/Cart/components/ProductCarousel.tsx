import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import type { Product } from "@/service/productService";
import { Link } from "react-router-dom";

interface ProductCarouselProps {
  title: string;
  products: Product[];
}

export default function ProductCarousel({ title, products }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="py-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">{title}</h3>
      <div className="relative group">
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md border border-gray-100 text-gray-600 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
        >
          <ChevronLeft size={20} />
        </button>

        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 px-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <Link 
              to={`/product/${product._id}`} 
              key={product._id}
              className="snap-start flex-shrink-0 w-48 flex flex-col gap-3 group/item no-underline"
            >
              <div className="w-48 h-48 bg-gray-50 rounded-2xl p-4 flex items-center justify-center transition-transform group-hover/item:-translate-y-1">
                <img 
                  src={product.image || "https://placehold.co/200?text=No+Image"} 
                  alt={product.name}
                  className="max-w-full max-h-full object-contain mix-blend-multiply"
                />
              </div>
              <div>
                <h4 className="text-xs text-blue-600 font-medium line-clamp-2 leading-tight group-hover/item:underline">
                  {product.name}
                </h4>
              </div>
            </Link>
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md border border-gray-100 text-gray-600 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
