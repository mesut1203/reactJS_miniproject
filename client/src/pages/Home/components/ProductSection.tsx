import ProductCard from "@/components/ProductCard";
import type { Product } from "@/service/productService";

interface ProductSectionProps {
  title: string;
  titleHighlight?: string; // Optional piece of title to have red underline, like 'Deals' in 'Today's Deals'
  products: Product[];
  isLoading?: boolean;
}

export default function ProductSection({ title, titleHighlight, products, isLoading }: ProductSectionProps) {
  return (
    <section className="py-12 bg-[#F3F4F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-1">
            {title}
            {titleHighlight && (
              <span className="relative">
                {titleHighlight}
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-red-500 rounded-full mt-1"></span>
              </span>
            )}
          </h2>
        </div>

        {/* Product List with Horizontal Scroll */}
        <div className="flex overflow-x-auto gap-4 md:gap-6 pb-4 snap-x">
          {isLoading ? (
            // Skeleton loaders
            [...Array(5)].map((_, i) => (
              <div key={i} className="flex-none w-[180px] md:w-[240px] bg-white rounded-2xl p-4 h-[350px] animate-pulse snap-start">
                <div className="w-full aspect-square bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3 mt-auto"></div>
              </div>
            ))
          ) : products.length > 0 ? (
            products.map((product) => (
              <div key={product._id || Math.random().toString()} className="flex-none w-[180px] md:w-[240px] lg:w-[calc(20%-1.2rem)] h-auto snap-start">
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <div className="w-full py-10 text-center text-gray-500 bg-white rounded-2xl border border-dashed border-gray-300">
              <p>Chưa có sản phẩm nào.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
