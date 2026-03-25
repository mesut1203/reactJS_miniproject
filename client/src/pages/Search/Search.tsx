import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts, type Product } from "@/service/productService";
import SearchFilterSidebar from "./components/SearchFilterSidebar";
import SearchResultCard from "./components/SearchResultCard";
import SearchBanner from "./components/SearchBanner";

export default function Search() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const q = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const minRating = searchParams.get("minRating") || "";
  const discount = searchParams.get("discount") || "";
  const sort = searchParams.get("sort") || "";
  const page = searchParams.get("page") || "1";

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const params: any = {
          limit: 20,
          page: parseInt(page),
          sort,
        };

        if (q) params.q = q;
        if (category) params.category = category;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (minRating) params.minRating = minRating;
        if (discount) params.discount = discount;

        const data = await getProducts(params);
        setProducts(data.products || []);
        setTotal(data.pagination?.total || 0);
      } catch (err: any) {
        setError(err.message || "Failed to fetch search results");
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
    window.scrollTo(0, 0);
  }, [q, category, minPrice, maxPrice, minRating, discount, sort, page]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <SearchFilterSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Status Header */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {q ? `Results for "${q}"` : "Search Results"}
            </h2>
            <p className="text-sm text-gray-500">
              {loading
                ? "Searching..."
                : `${total.toLocaleString()} results found`}
            </p>
          </div>

          <SearchBanner />

          {/* Product List */}
          <div className="flex flex-col border-t border-gray-100">
            {loading && products.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                <p className="text-gray-500">Searching for products...</p>
              </div>
            ) : error ? (
              <div className="py-20 text-center text-red-500">{error}</div>
            ) : products.length > 0 ? (
              <>
                <div className="flex flex-col divide-y divide-gray-100">
                  {products.map((product) => (
                    <SearchResultCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Second Banner half-way down (if more than 5 items) */}
                {products.length > 5 && (
                  <div className="my-8">
                    <div className="bg-blue-600 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between text-white shadow-xl shadow-blue-100">
                      <div className="md:max-w-md mb-6 md:mb-0">
                        <h3 className="text-2xl font-bold mb-2">
                          #1 Earwear brand in India
                        </h3>
                        <p className="text-blue-100 mb-4 opacity-90 leading-relaxed text-sm">
                          BoAt is the world's 5th largest wearable brand and has
                          been the recipient of several accolades.
                        </p>
                        <button className="px-6 py-2 bg-yellow-400 text-gray-900 rounded-lg font-bold hover:bg-yellow-500 transition-colors shadow-lg">
                          Buy Now
                        </button>
                      </div>
                      <div className="w-32 h-32 md:w-48 md:h-48 flex items-center justify-center p-4 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
                        <img
                          src="https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=400&q=80"
                          alt="Wireless Earbuds"
                          className="max-w-full max-h-full object-contain filter drop-shadow-2xl brightness-110"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Remaining products after middle banner */}
                {/* No, just rendering list with search results. Usually banner is inserted in middle of array for better UX. But let's keep it simple. */}
              </>
            ) : (
              <div className="py-20 text-center">
                <p className="text-lg font-medium text-gray-900 mb-2">
                  No products found
                </p>
                <p className="text-gray-500">
                  Try adjusting your filters or search query.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
