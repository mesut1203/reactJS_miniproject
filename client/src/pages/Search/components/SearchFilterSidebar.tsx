import { Star, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const SearchFilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (value === null) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  const clearFilter = (key: string | string[]) => {
    const next = new URLSearchParams(searchParams);
    (Array.isArray(key) ? key : [key]).forEach((k) => next.delete(k));
    setSearchParams(next);
  };

  const currentMinRating = searchParams.get("minRating") || "";
  const currentDiscount = searchParams.get("discount") || "";
  const currentSort = searchParams.get("sort") || "";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";

  const hasFilters = !!(currentMinRating || currentDiscount || currentSort || currentMinPrice || currentMaxPrice);

  const reviews = [
    { value: "4", label: "4 Stars & Up" },
    { value: "3", label: "3 Stars & Up" },
    { value: "2", label: "2 Stars & Up" },
    { value: "1", label: "1 Stars & Up" },
  ];

  const priceRanges = [
    { label: "Under ₹5,000", min: "0", max: "5000" },
    { label: "₹5,000 - ₹10,000", min: "5000", max: "10000" },
    { label: "₹10,000 - ₹20,000", min: "10000", max: "20000" },
    { label: "Over ₹20,000", min: "20000", max: "" },
  ];

  const discounts = [
    { value: "10", label: "10% Off and more" },
    { value: "25", label: "25% Off and more" },
    { value: "35", label: "35% Off and more" },
    { value: "50", label: "50% Off and more" },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest Arrivals" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "review_avg", label: "Avg. Customer Review" },
  ];

  const SectionHeader = ({ title }: { title: string }) => (
    <h5 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest">{title}</h5>
  );

  return (
    <aside className="w-full flex flex-col gap-6 bg-white border-r border-gray-100 sticky top-20 self-start">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Filters</h4>
        {hasFilters && (
          <button
            onClick={() => clearFilter(["minRating", "discount", "sort", "minPrice", "maxPrice"])}
            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
          >
            <X size={12} />
            Clear all
          </button>
        )}
      </div>

      <div className="w-full h-px bg-gray-100" />

      {/* Sort */}
      <section>
        <SectionHeader title="Sort By" />
        <div className="flex flex-col gap-2">
          {sortOptions.map((o) => (
            <button
              key={o.value}
              onClick={() => updateParam("sort", currentSort === o.value ? null : o.value)}
              className={`text-sm text-left transition-colors flex items-center gap-2 ${
                currentSort === o.value
                  ? "text-blue-600 font-semibold"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              <span className={`w-2 h-2 rounded-full border-2 ${currentSort === o.value ? "bg-blue-600 border-blue-600" : "border-gray-300"}`} />
              {o.label}
            </button>
          ))}
        </div>
      </section>

      <div className="w-full h-px bg-gray-100" />

      {/* Customer Reviews */}
      <section>
        <SectionHeader title="Customer Reviews" />
        <div className="flex flex-col gap-2">
          {reviews.map((r) => (
            <button
              key={r.value}
              onClick={() => updateParam("minRating", currentMinRating === r.value ? null : r.value)}
              className={`flex items-center gap-2 text-sm transition-colors ${
                currentMinRating === r.value ? "text-blue-600 font-medium" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              <div className="flex text-yellow-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className={i < parseInt(r.value) ? "fill-current" : "fill-gray-200 text-gray-200"}
                  />
                ))}
              </div>
              <span>& Up</span>
            </button>
          ))}
        </div>
      </section>

      <div className="w-full h-px bg-gray-100" />

      {/* Price Range */}
      <section>
        <SectionHeader title="Price" />
        <div className="flex flex-col gap-2 mb-3">
          {priceRanges.map((p) => (
            <button
              key={p.label}
              onClick={() => {
                const next = new URLSearchParams(searchParams);
                if (currentMinPrice === p.min && currentMaxPrice === p.max) {
                  next.delete("minPrice");
                  next.delete("maxPrice");
                } else {
                  next.set("minPrice", p.min);
                  if (p.max) next.set("maxPrice", p.max);
                  else next.delete("maxPrice");
                }
                setSearchParams(next);
              }}
              className={`text-sm text-left transition-colors ${
                currentMinPrice === p.min ? "text-blue-600 font-medium" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={currentMinPrice || ""}
            onChange={(e) => updateParam("minPrice", e.target.value || null)}
            className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-blue-400"
          />
          <span className="text-gray-400 text-xs">–</span>
          <input
            type="number"
            placeholder="Max"
            value={currentMaxPrice || ""}
            onChange={(e) => updateParam("maxPrice", e.target.value || null)}
            className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-blue-400"
          />
        </div>
      </section>

      <div className="w-full h-px bg-gray-100" />

      {/* Discount */}
      <section>
        <SectionHeader title="Discount" />
        <div className="flex flex-col gap-2">
          {discounts.map((d) => (
            <button
              key={d.value}
              onClick={() => updateParam("discount", currentDiscount === d.value ? null : d.value)}
              className={`text-sm text-left transition-colors ${
                currentDiscount === d.value ? "text-blue-600 font-medium" : "text-gray-600 hover:text-blue-600"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </section>
    </aside>
  );
};

export default SearchFilterSidebar;
