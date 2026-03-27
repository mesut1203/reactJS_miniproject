import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getCategoriesWithId, type Category } from "@/service/productService";
import { Star } from "lucide-react";

const PRICE_RANGES = [
  { label: "Under ₫200,000", min: "", max: "200000" },
  { label: "₫200,000 – ₫500,000", min: "200000", max: "500000" },
  { label: "₫500,000 – ₫1,000,000", min: "500000", max: "1000000" },
  { label: "₫1,000,000 – ₫5,000,000", min: "1000000", max: "5000000" },
  { label: "Over ₫5,000,000", min: "5000000", max: "" },
];

const SORT_OPTIONS = [
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Avg. Customer Review", value: "review_avg" },
  { label: "Newest Arrivals", value: "newest" },
];

const DISCOUNTS = [10, 20, 30, 40, 50, 70];

const SearchFilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [catLoading, setCatLoading] = useState(true);

  // URL stores categoryId (for API) and categoryName (for display)
  const activeCategoryId   = searchParams.get("category") || "";
  const minPrice  = searchParams.get("minPrice")  || "";
  const maxPrice  = searchParams.get("maxPrice")  || "";
  const minRating = searchParams.get("minRating") || "";
  const discount  = searchParams.get("discount")  || "";
  const sort      = searchParams.get("sort")      || "";

  useEffect(() => {
    getCategoriesWithId()
      .then(setCategories)
      .catch(() => {})
      .finally(() => setCatLoading(false));
  }, []);

  const updateFilters = (updates: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") newParams.delete(key);
      else newParams.set(key, value);
    });
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    const q = searchParams.get("search");
    const newParams = new URLSearchParams();
    if (q) newParams.set("search", q);
    setSearchParams(newParams);
  };

  const activePriceRange = PRICE_RANGES.find(
    (r) => r.min === minPrice && r.max === maxPrice,
  );

  const handleCategoryClick = (cat: Category) => {
    if (activeCategoryId === cat._id) {
      // deselect
      updateFilters({ category: null, categoryName: null });
    } else {
      updateFilters({
        // If we have a real ID use it for API, else fallback to name
        category: cat._id || cat.name,
        categoryName: cat.name,
      });
    }
  };

  return (
    <aside className="flex flex-col gap-1">
      {/* Header */}
      <div className="flex items-center justify-between py-3 px-1 border-b border-gray-200 mb-2">
        <span className="text-base font-bold text-gray-900">Filter</span>
        <button
          onClick={clearFilters}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Customer Reviews */}
      <div className="py-4 border-b border-gray-100">
        <h4 className="text-sm font-bold text-gray-900 mb-3">Customer Reviews</h4>
        <div className="flex flex-col gap-2">
          {[4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() =>
                updateFilters({ minRating: minRating === r.toString() ? null : r.toString() })
              }
              className={`flex items-center gap-1.5 group transition-all text-left ${
                minRating === r.toString() ? "opacity-100" : "opacity-70 hover:opacity-100"
              }`}
            >
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className={
                      i < r
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }
                  />
                ))}
              </div>
              <span
                className={`text-xs font-medium ml-0.5 ${
                  minRating === r.toString()
                    ? "text-orange-600 font-bold"
                    : "text-gray-600 group-hover:text-gray-900"
                }`}
              >
                &amp; Up
              </span>
              {minRating === r.toString() && (
                <span className="ml-auto text-orange-500 text-xs">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="py-4 border-b border-gray-100">
        <h4 className="text-sm font-bold text-gray-900 mb-3">Price Range</h4>
        <div className="flex flex-col gap-2">
          {PRICE_RANGES.map((range) => {
            const isActive = activePriceRange?.label === range.label;
            return (
              <button
                key={range.label}
                onClick={() =>
                  updateFilters(
                    isActive
                      ? { minPrice: null, maxPrice: null }
                      : { minPrice: range.min, maxPrice: range.max },
                  )
                }
                className={`text-left text-xs py-0.5 transition-all font-medium ${
                  isActive
                    ? "text-orange-600 font-bold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {isActive && "✓ "}
                {range.label}
              </button>
            );
          })}
        </div>

        {/* Custom price inputs */}
        <div className="flex items-center gap-2 mt-3">
          <input
            type="number"
            placeholder="Min ₫"
            value={minPrice}
            onChange={(e) => updateFilters({ minPrice: e.target.value })}
            className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:border-orange-400 transition"
          />
          <span className="text-gray-400 text-xs flex-shrink-0">–</span>
          <input
            type="number"
            placeholder="Max ₫"
            value={maxPrice}
            onChange={(e) => updateFilters({ maxPrice: e.target.value })}
            className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:border-orange-400 transition"
          />
        </div>
        {(minPrice || maxPrice) && (
          <button
            onClick={() => updateFilters({ minPrice: null, maxPrice: null })}
            className="mt-2 text-xs text-blue-600 hover:underline"
          >
            Clear price range
          </button>
        )}
      </div>

      {/* Discount */}
      <div className="py-4 border-b border-gray-100">
        <h4 className="text-sm font-bold text-gray-900 mb-3">Discount</h4>
        <div className="flex flex-col gap-2">
          {DISCOUNTS.map((d) => (
            <button
              key={d}
              onClick={() =>
                updateFilters({ discount: discount === d.toString() ? null : d.toString() })
              }
              className={`text-left text-xs py-0.5 transition-all font-medium ${
                discount === d.toString()
                  ? "text-orange-600 font-bold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {discount === d.toString() && "✓ "}
              {d}% off and more
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="py-4 border-b border-gray-100">
        <h4 className="text-sm font-bold text-gray-900 mb-3">Sort</h4>
        <div className="flex flex-col gap-2">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() =>
                updateFilters({ sort: sort === opt.value ? null : opt.value })
              }
              className={`text-left text-xs py-0.5 transition-all font-medium ${
                sort === opt.value
                  ? "text-orange-600 font-bold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {sort === opt.value && "✓ "}
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div className="py-4">
        <h4 className="text-sm font-bold text-gray-900 mb-3">Category</h4>
        <div className="flex flex-col gap-2">
          {catLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-3 bg-gray-100 rounded-full animate-pulse" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <p className="text-xs text-gray-400">No categories found</p>
          ) : (
            categories.map((cat) => {
              const isActive = activeCategoryId === (cat._id || cat.name);
              return (
                <button
                  key={cat._id || cat.name}
                  onClick={() => handleCategoryClick(cat)}
                  className={`text-left text-xs py-0.5 transition-all font-medium ${
                    isActive
                      ? "text-orange-600 font-bold"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {isActive && "✓ "}
                  {cat.name}
                </button>
              );
            })
          )}
        </div>
      </div>
    </aside>
  );
};

export default SearchFilterSidebar;
