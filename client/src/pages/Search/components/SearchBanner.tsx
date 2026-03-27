const SearchBanner = () => {
  return (
    <div className="w-full rounded-xl overflow-hidden mb-6 relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 shadow-lg">
      <div className="flex flex-col md:flex-row items-center min-h-[140px]">
        {/* Left text */}
        <div className="flex-1 px-8 py-6 z-10">
          <p className="text-xs uppercase tracking-widest text-orange-400 font-bold mb-1">
            Grammy Award Winner
          </p>
          <h2 className="text-xl md:text-2xl font-extrabold text-white leading-tight max-w-xs">
            India's first headphone brand by a{" "}
            <span className="text-orange-400">3xGrammy Winner</span>
          </h2>
          <button className="mt-4 px-5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors shadow-md">
            Shop Now →
          </button>
        </div>

        {/* Right: product card mockup */}
        <div className="flex-shrink-0 flex items-center justify-end pr-6 py-4 gap-3">
          {/* Main product image */}
          <div className="w-28 h-28 md:w-36 md:h-36 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 flex items-center justify-center overflow-hidden p-3">
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80"
              alt="Featured Headphone"
              className="max-w-full max-h-full object-contain drop-shadow-2xl"
            />
          </div>

          {/* Featured card */}
          <div className="hidden md:flex flex-col gap-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 w-36 text-white">
            <p className="text-[9px] uppercase font-bold tracking-widest text-orange-300">
              Featured
            </p>
            <p className="text-xs font-semibold leading-snug line-clamp-2">
              Sony WH-1000XM4 Only headphone brand created by a Grammy winning artist.
            </p>
            <div className="flex text-yellow-400 text-[10px]">★★★★★</div>
            <p className="text-xs font-bold text-orange-300">₫22,990,000</p>
          </div>
        </div>
      </div>

      {/* Decorative gradient orb */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default SearchBanner;
