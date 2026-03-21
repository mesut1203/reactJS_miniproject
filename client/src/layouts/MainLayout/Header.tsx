import { Search, Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <h1 className="text-2xl font-bold">CRIO</h1>

          {/* Search (center) */}
          <div className="hidden md:flex flex-1 mx-8 max-w-2xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <input
                placeholder="Search Products Here"
                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50"
              />
            </div>
          </div>

          {/* Right menu */}
          <div className="flex items-center gap-6">
            <span className="hidden md:block">Orders</span>
            <span className="hidden md:block">Sign up</span>
            <span className="hidden md:block">Log in</span>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
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
