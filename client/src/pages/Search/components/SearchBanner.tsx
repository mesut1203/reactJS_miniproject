const SearchBanner = () => {
  return (
    <div className="w-full bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm mb-8">
      <div className="flex flex-col md:flex-row items-center">
        {/* Left Side: Text Content */}
        <div className="p-8 md:w-1/2 flex flex-col gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            India's first headphone brand by a 3x Grammy Winner
          </h2>
          <div className="w-16 h-1 bg-blue-600 rounded-full"></div>
          <p className="text-gray-600 text-sm">
            Experience the sound of perfection with our latest noise-cancelling technology.
          </p>
          <button className="w-fit px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Shop Now
          </button>
        </div>

        {/* Right Side: Featured Product Layout */}
        <div className="md:w-1/2 flex items-center justify-center p-8 bg-gray-50">
          <div className="flex bg-white rounded-2xl shadow-lg p-6 max-w-sm border border-gray-200 gap-6">
            <div className="w-1/2 aspect-square flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80" 
                alt="Headphones" 
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="w-1/2 flex flex-col justify-center">
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Featured</p>
              <h4 className="text-sm font-bold text-gray-900 line-clamp-2 mb-2 leading-tight">
                Sony WH-1000XM4 Industry Leading Wireless
              </h4>
              <div className="flex text-yellow-500 mb-2">
                {"★".repeat(5)}
                <span className="text-[10px] text-gray-400 ml-1 ml-1 self-center">12</span>
              </div>
              <p className="text-xs font-bold text-blue-600">$229.00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBanner;
