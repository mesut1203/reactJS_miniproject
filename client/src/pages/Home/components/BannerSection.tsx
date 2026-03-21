import { Button } from "@/components/ui/button";

export default function BannerSection() {
  return (
    <section className="py-8 bg-white border-y border-gray-100 my-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row gap-6 h-auto md:h-[400px]">
          
          {/* Main Large Banner */}
          <div className="flex-1 w-full bg-[#1A1A1A] rounded-2xl relative overflow-hidden group">
            {/* Using a placeholder or generic image to represent Sony headphones banner */}
            <img 
              src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=1400" 
              alt="Promo Headphones" 
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute inset-0 p-8 flex flex-col justify-end md:justify-center items-start">
              <h3 className="text-white text-3xl md:text-5xl font-bold mb-4">SONY</h3>
              <p className="text-gray-300 text-sm md:text-base max-w-sm mb-6 hidden md:block">
                Industry Leading Wireless Noise Cancelling Headphones
              </p>
              <Button className="bg-white text-black hover:bg-gray-200">
                Explore The Range
              </Button>
            </div>
            {/* Small text block bottom left */}
            <div className="absolute bottom-4 left-8 hidden md:block">
              <p className="text-[10px] text-gray-400">
                *As of 2023, based on headband style of noise cancelling headphones.
              </p>
            </div>
          </div>

          {/* Side Promo Card - Smartwatches */}
          <div className="w-full md:w-[350px] bg-[#F7F8F9] rounded-2xl p-8 flex flex-col items-center justify-between text-center group cursor-pointer border border-gray-100 hover:shadow-lg transition-shadow">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                Bluetooth Calling Smartwatch starts at <span className="text-red-500">2,990đ</span>
              </h3>
            </div>
            <div className="relative w-[200px] h-[200px] my-4">
              <img 
                src="https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=600" 
                alt="Smartwatch" 
                className="w-full h-full object-contain mix-blend-darken group-hover:-translate-y-2 transition-transform duration-500"
              />
            </div>
            <div className="w-full text-left">
              <a href="#" className="text-blue-600 font-medium text-sm hover:underline">
                Shop now &rarr;
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
