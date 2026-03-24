import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getCategories } from "@/service/productService";
import { Star, ChevronDown } from "lucide-react";

/**
 * SearchFilterSidebar provides a functional filtering interface for search results.
 * It interacts with the URL search parameters to trigger data fetching in the parent Search page.
 */
const SearchFilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Current filter values from URL
  const activeCategory = searchParams.get("category") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const minRating = searchParams.get("minRating") || "";
  const discount = searchParams.get("discount") || "";

  // Fetch categories on mount
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  /**
   * Updates multiple search parameters at once and resets pagination.
   */
  const updateFilters = (updates: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    // Reset to page 1 whenever filters change
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  /**
   * Resets all filters while preserving the search query.
   */
  const clearFilters = () => {
    const q = searchParams.get("search");
    const newParams = new URLSearchParams();
    if (q) newParams.set("search", q);
    setSearchParams(newParams);
  };

  const ratings = [4, 3, 2, 1];
  const discounts = [10, 20, 30, 40, 50];

  return (
    <aside className="flex flex-col gap-6">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Filters</h3>
        <button 
          onClick={clearFilters}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-wider"
        >
          Clear All
        </button>
      </div>

      {/* Category Section */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
        <h4 className="font-bold text-sm text-gray-900 mb-4 flex items-center justify-between group cursor-default">
          Category
          <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
        </h4>
        <div className="flex flex-col gap-2.5 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
          {loading ? (
             <div className="animate-pulse space-y-3">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-3.5 bg-gray-100 rounded-full w-full"></div>)}
             </div>
          ) : (
            categories.map((cat) => (
              <label key={cat} className="group flex items-center gap-3 cursor-pointer">
                <div className="relative flex items-center justify-center">
                  <input
                    type="radio"
                    name="category"
                    className="appearance-none w-4 h-4 border border-gray-300 rounded-full checked:border-blue-600 checked:bg-blue-600 transition-all cursor-pointer"
                    checked={activeCategory === cat}
                    onChange={() => updateFilters({ category: cat })}
                  />
                  {activeCategory === cat && (
                    <div className="absolute w-1.5 h-1.5 bg-white rounded-full"></div>
                  )}
                </div>
                <span className={`text-sm transition-colors ${activeCategory === cat ? 'text-blue-600 font-bold' : 'text-gray-600 group-hover:text-gray-900'}`}>
                  {cat}
                </span>
              </label>
            ))
          )}
        </div>
      </div>

      {/* Price Range Section */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
        <h4 className="font-bold text-sm text-gray-900 mb-4">Price Range</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative group">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] font-bold">₫</span>
            <input 
              type="number"
              placeholder="Min"
              className="w-full pl-6 pr-2 py-2 text-sm border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-300"
              value={minPrice}
              onChange={(e) => updateFilters({ minPrice: e.target.value })}
            />
          </div>
          <div className="relative group">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] font-bold">₫</span>
            <input 
              type="number"
              placeholder="Max"
              className="w-full pl-6 pr-2 py-2 text-sm border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-300"
              value={maxPrice}
              onChange={(e) => updateFilters({ maxPrice: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Ratings Section */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
        <h4 className="font-bold text-sm text-gray-900 mb-4">Customer Review</h4>
        <div className="flex flex-col gap-3">
          {ratings.map((r) => (
            <button
              key={r}
              onClick={() => updateFilters({ minRating: r.toString() })}
              className={`flex items-center gap-2.5 text-sm transition-all group ${minRating === r.toString() ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    className={`${i < r ? "fill-yellow-400 text-yellow-400" : "fill-gray-100 text-gray-200"} transition-colors`} 
                  />
                ))}
              </div>
              <span className={`text-[13px] ${minRating === r.toString() ? 'font-bold' : 'font-medium'}`}>& Up</span>
            </button>
          ))}
        </div>
      </div>

      {/* Discount Section */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
        <h4 className="font-bold text-sm text-gray-900 mb-4">Discount</h4>
        <div className="flex flex-col gap-2.5">
          {discounts.map((d) => (
            <button
              key={d}
              onClick={() => updateFilters({ discount: d.toString() })}
              className={`text-left text-sm transition-all py-0.5 ${discount === d.toString() ? 'text-blue-600 font-bold' : 'text-gray-600 font-medium hover:text-blue-500'}`}
            >
              {d}% off or more
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default SearchFilterSidebar;
