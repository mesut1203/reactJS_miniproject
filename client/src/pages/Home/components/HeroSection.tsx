export default function HeroSection() {
  return (
    <section className="bg-#F7F7F7 py-12 md:py-24 border-b border-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-left space-y-4 max-w-2xl">
          <p className="text-gray-500 font-medium">#Big Fashion Sale</p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
            Limited Time Offer!<br />
            Up to 50% OFF!
          </h1>
          <p className="text-lg text-gray-600 pb-4">
            Redefine Your Everyday Style
          </p>
          {/* We don't have a specific CTA in the design but leaving space or just an empty block if needed */}
        </div>
      </div>
    </section>
  );
}
