import { Search, Menu, X, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RouteNames } from "@/constants/route";
import { getProducts } from "@/service/productService";
import type { Product } from "@/service/productService";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const navigate = useNavigate();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sync input with URL when navigating between pages
  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced autocomplete fetch
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setSuggestLoading(true);
        const data = await getProducts({ search: searchQuery.trim(), limit: 6 });
        setSuggestions(data.products || []);
        setShowDropdown(true);
      } catch {
        setSuggestions([]);
      } finally {
        setSuggestLoading(false);
      }
    }, 350);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowDropdown(false);
    if (searchQuery.trim()) {
      navigate(`${RouteNames.SEARCH}?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate(RouteNames.SEARCH);
    }
  };

  const handleSelectSuggestion = (product: Product) => {
    setShowDropdown(false);
    navigate(`/product/${product._id}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <h1
            className="text-2xl font-bold cursor-pointer hover:opacity-80 transition-opacity shrink-0"
            onClick={() => navigate(RouteNames.HOME)}
          >
            CRIO
          </h1>

          {/* Search (center) */}
          <div className="hidden md:flex flex-1 mx-8 max-w-2xl" ref={wrapperRef}>
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none z-10" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
                placeholder="Search Products Here"
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {suggestLoading && (
                <Loader2 className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 animate-spin" />
              )}

              {/* Autocomplete Dropdown */}
              {showDropdown && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
                  <div className="p-2 text-xs text-gray-400 font-medium uppercase tracking-wide px-4 pt-3">
                    Suggestions
                  </div>
                  <ul>
                    {suggestions.map((product) => (
                      <li key={product._id}>
                        <button
                          type="button"
                          onClick={() => handleSelectSuggestion(product)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left group"
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-contain mix-blend-multiply"
                            />
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="text-sm text-gray-800 group-hover:text-blue-600 truncate font-medium">
                              {product.name}
                            </p>
                            {product.brand && (
                              <p className="text-xs text-gray-400">{product.brand}</p>
                            )}
                          </div>
                          {product.price != null && (
                            <span className="text-sm font-semibold text-gray-900 shrink-0">
                              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                                product.price - (product.priceDiscount || 0)
                              )}
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-gray-100 px-4 py-2.5">
                    <button
                      type="submit"
                      className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium text-left hover:underline"
                    >
                      See all results for "{searchQuery}"
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Right menu */}
          <div className="flex items-center gap-6 shrink-0">
            <span className="hidden md:block text-sm font-medium hover:text-blue-600 cursor-pointer transition-colors">Orders</span>
            <span className="hidden md:block text-sm font-medium hover:text-blue-600 cursor-pointer transition-colors">Sign up</span>
            <span className="hidden md:block text-sm font-medium hover:text-blue-600 cursor-pointer transition-colors">Log in</span>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
