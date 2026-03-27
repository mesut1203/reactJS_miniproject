import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts, type Product } from "@/service/productService";
import SearchFilterSidebar from "./components/SearchFilterSidebar";
import SearchResultCard from "./components/SearchResultCard";
import SearchBanner from "./components/SearchBanner";

const PAGE_INIT = 6; // products visible initially
const PAGE_STEP = 6; // products added each "Load more" click

export default function Search() {
  const [searchParams] = useSearchParams();
  const [allFiltered, setAllFiltered] = useState<Product[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_INIT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const q = searchParams.get("search") || "";
  const category = searchParams.get("category") || ""; // MongoDB _id
  const categoryName = searchParams.get("categoryName") || category; // display label
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const minRating = searchParams.get("minRating") || "";
  const discount = searchParams.get("discount") || "";
  const sort = searchParams.get("sort") || "";

  // Reset visible count whenever filters change
  useEffect(() => {
    setVisibleCount(PAGE_INIT);
  }, [q, category, minPrice, maxPrice, minRating, discount, sort]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        // Server-side filters (API supports these natively)
        const params: Record<string, any> = { limit: 200, page: 1 };
        if (category) params.category = category; // pass MongoDB _id directly
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (minRating) params.minRating = minRating;
        if (discount) params.discount = discount;
        if (sort) params.sort = sort;
        // category is passed as MongoDB _id (handled server-side)

        const data = await getProducts(params);
        let products: Product[] = data.products || [];

        // ── Client-side: text search ──
        if (q.trim()) {
          const kw = q.trim().toLowerCase();
          products = products.filter(
            (p) =>
              p.name?.toLowerCase().includes(kw) ||
              p.brand?.toLowerCase().includes(kw),
          );
        }

        // (category is handled server-side via ID param)

        // ── Client-side: discount % check ──
        if (discount) {
          const pct = parseFloat(discount);
          products = products.filter((p) => {
            if (!p.price || !p.priceDiscount || p.priceDiscount >= p.price)
              return false;
            return ((p.price - p.priceDiscount) / p.price) * 100 >= pct;
          });
        }

        // ── Client-side: minRating check ──
        if (minRating) {
          const rating = parseFloat(minRating);
          products = products.filter((p) => (p.avgRating || 0) >= rating);
        }

        // ── Client-side: sort ──
        if (sort) {
          products = [...products].sort((a, b) => {
            const pa =
              a.priceDiscount && a.priceDiscount < a.price
                ? a.priceDiscount
                : a.price;
            const pb =
              b.priceDiscount && b.priceDiscount < b.price
                ? b.priceDiscount
                : b.price;
            switch (sort) {
              case "price_asc":
                return (pa || 0) - (pb || 0);
              case "price_desc":
                return (pb || 0) - (pa || 0);
              case "review_avg":
                return (b.avgRating || 0) - (a.avgRating || 0);
              default:
                return 0;
            }
          });
        }

        setAllFiltered(products);
      } catch (err: any) {
        setError(err.message || "Failed to fetch search results");
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
    window.scrollTo(0, 0);
  }, [q, category, minPrice, maxPrice, minRating, discount, sort]);

  const total = allFiltered.length;
  const visible = allFiltered.slice(0, visibleCount);
  const hasMore = visibleCount < total;
  // split visible list around mid for banner insertion
  const bannerAt = Math.ceil(PAGE_INIT / 2); // after 3rd item on initial load
  const firstPart = visible.slice(0, bannerAt);
  const secondPart = visible.slice(bannerAt);

  const hasActiveFilter = !!(
    q ||
    category ||
    minPrice ||
    maxPrice ||
    minRating ||
    discount ||
    sort
  );

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-6 items-start">
        {/* ── Sidebar — independent scroll ── */}
        <div className="hidden md:block w-52 flex-shrink-0">
          <div
            className="bg-white rounded-xl border border-gray-100 shadow-sm sticky top-0"
            style={{ height: "100vh", overflowY: "auto" }}
          >
            <div className="p-4">
              <SearchFilterSidebar />
            </div>
          </div>
        </div>

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          {/* Banner */}
          <SearchBanner />

          {/* Results header */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-3 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-sm font-bold text-gray-900">
                {q ? (
                  <>
                    Results for <span className="text-orange-500">"{q}"</span>
                  </>
                ) : categoryName ? (
                  <>
                    Category:{" "}
                    <span className="text-blue-600">{categoryName}</span>
                  </>
                ) : (
                  "All Products"
                )}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {loading
                  ? "Searching..."
                  : `Showing ${Math.min(visibleCount, total).toLocaleString()} of ${total.toLocaleString()} results`}
              </p>
            </div>

            {/* Active filter chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {sort && (
                <span className="text-[11px] bg-orange-50 text-orange-600 border border-orange-200 rounded-full px-2 py-0.5 font-medium">
                  {sort === "price_asc"
                    ? "Price ↑"
                    : sort === "price_desc"
                      ? "Price ↓"
                      : sort === "review_avg"
                        ? "Top Rated"
                        : "Newest"}
                </span>
              )}
              {minRating && (
                <span className="text-[11px] bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full px-2 py-0.5 font-medium">
                  ★ {minRating}+
                </span>
              )}
              {discount && (
                <span className="text-[11px] bg-green-50 text-green-700 border border-green-200 rounded-full px-2 py-0.5 font-medium">
                  {discount}%+ off
                </span>
              )}
              {category && (
                <span className="text-[11px] bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2 py-0.5 font-medium">
                  {categoryName}
                </span>
              )}
              {(minPrice || maxPrice) && (
                <span className="text-[11px] bg-purple-50 text-purple-700 border border-purple-200 rounded-full px-2 py-0.5 font-medium">
                  ₫{minPrice || "0"} – ₫{maxPrice || "∞"}
                </span>
              )}
            </div>
          </div>

          {/* Product list */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="py-24 flex flex-col items-center justify-center gap-4">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500" />
                <p className="text-gray-400 text-sm">
                  Searching for products...
                </p>
              </div>
            ) : error ? (
              <div className="py-24 text-center text-red-500 text-sm">
                {error}
              </div>
            ) : total === 0 ? (
              <div className="py-24 text-center">
                <p className="text-4xl mb-4">🔍</p>
                <p className="text-base font-semibold text-gray-800 mb-1">
                  No products found
                </p>
                <p className="text-sm text-gray-400">
                  {hasActiveFilter
                    ? "Try adjusting your filters or search query."
                    : "No products available at the moment."}
                </p>
              </div>
            ) : (
              <>
                {/* First chunk */}
                <div className="divide-y divide-gray-50 px-2">
                  {firstPart.map((product) => (
                    <SearchResultCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Mid-page banner — only show when there's a second chunk */}
                {secondPart.length > 0 && (
                  <div className="mx-3 my-2 rounded-xl overflow-hidden bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-bold text-base">
                        #1 Earwear brand in India
                      </h3>
                      <p className="text-blue-200 text-xs mt-1 max-w-xs leading-relaxed">
                        BoAt is the world's 5th largest wearable brand and
                        recipient of several accolades.
                      </p>
                      <button className="mt-3 px-4 py-1.5 bg-yellow-400 text-gray-900 text-xs font-bold rounded-lg hover:bg-yellow-500 transition-colors">
                        Buy Now
                      </button>
                    </div>
                    <img
                      src="https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=200&q=80"
                      alt="Earbuds"
                      className="w-24 h-24 object-contain rounded-xl opacity-90 hidden sm:block"
                    />
                  </div>
                )}

                {/* Second chunk */}
                <div className="divide-y divide-gray-50 px-2">
                  {secondPart.map((product) => (
                    <SearchResultCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Load more / total count footer */}
                <div className="px-4 py-5 border-t border-gray-50 flex flex-col items-center gap-3">
                  {hasMore ? (
                    <>
                      <p className="text-xs text-gray-400">
                        Showing {Math.min(visibleCount, total)} of {total}{" "}
                        products
                      </p>
                      <button
                        onClick={() =>
                          setVisibleCount((prev) => prev + PAGE_STEP)
                        }
                        className="px-8 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-full transition-colors shadow-sm hover:shadow-md"
                      >
                        See More ({total - visibleCount} remaining)
                      </button>
                    </>
                  ) : (
                    <p className="text-xs text-gray-400">
                      All {total} products shown
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
