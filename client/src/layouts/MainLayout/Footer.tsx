import { Instagram, Facebook, Twitter, Youtube, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#e9e9ea] pt-16 pb-6 mt-0">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-7">
            <h3 className="font-bold text-lg mb-6">Cateogry</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 text-sm text-gray-700">
              <span>Mobile and computers</span>
              <span>Car</span>
              <span>Mobile and computers</span>

              <span>TV, Appliances, Electronics</span>
              <span>Motor Bikes</span>
              <span>TV, Appliances, Electronics</span>

              <span>Men�s Fashion</span>
              <span>Book</span>
              <span>Men�s Fashion</span>

              <span>Home</span>
              <span>Video Games</span>
              <span>Home</span>

              <span>Kitchen</span>
              <span>Shoes</span>
              <span>Kitchen</span>

              <span>Beauty</span>
              <span>Toys</span>
              <span>Beauty</span>

              <span>Health</span>
              <span>Consoles</span>
              <span>Health</span>

              <span>Sports</span>
              <span>Accessories</span>
              <span>Sports</span>

              <span>Baby Products</span>
              <span>Groceries</span>
              <span>Baby Products</span>
            </div>
          </div>

          <div className="hidden md:block md:col-span-1 relative">
            <div className="absolute left-1/2 top-0 h-full w-px bg-gray-400"></div>
          </div>

          <div className="md:col-span-4">
            <h3 className="font-bold text-lg mb-6">Payment Partners</h3>
          </div>
        </div>

        <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <p className="text-center font-semibold md:text-left">� 2022 - 2023 FreshCart eCommerce. All rights reserved. Powered by eCommerce.</p>

          <div className="flex items-center gap-4">
            <span className="mr-2 text-black font-medium">Lets get social</span>
            <div className="flex gap-4 text-black">
              <Instagram className="w-5 h-5 cursor-pointer hover:text-gray-600 transition" />
              <Facebook className="w-5 h-5 cursor-pointer hover:text-gray-600 transition" />
              <Twitter className="w-5 h-5 cursor-pointer hover:text-gray-600 transition" />
              <Youtube className="w-5 h-5 cursor-pointer hover:text-gray-600 transition" />
              <Linkedin className="w-5 h-5 cursor-pointer hover:text-gray-600 transition" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
