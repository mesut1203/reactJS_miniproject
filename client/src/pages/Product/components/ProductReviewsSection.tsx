import type { Review, RatingStat } from "@/service/productService";
import { Star } from "lucide-react";

interface Props {
  reviews: Review[];
  reviewsStats: { avgRating: number; total: number; ratingStats: RatingStat[] } | null;
  isLoading: boolean;
}

export default function ProductReviewsSection({ reviews, reviewsStats, isLoading }: Props) {
  if (isLoading) {
    return <div className="py-8 text-center animate-pulse">Loading reviews...</div>;
  }

  // Ensure safe defaults
  const avgRating = reviewsStats?.avgRating || 0;
  const total = reviewsStats?.total || 0;
  // Stats from API might not match exactly 1 to 5, let's format it.
  const statMap: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  if (reviewsStats?.ratingStats) {
    reviewsStats.ratingStats.forEach(s => {
      statMap[s.star] = s.percent;
    });
  }

  return (
    <div className="flex flex-col gap-6 bg-[#f8f9fa] p-6 rounded-2xl">
      <h3 className="text-xl font-bold text-gray-900">Customer Review</h3>
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Stats */}
        <div className="lg:w-1/3 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="flex text-yellow-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.round(avgRating) ? "fill-current" : "fill-gray-300 text-gray-300"}`} />
              ))}
            </div>
            <span className="font-semibold text-gray-900">{avgRating.toFixed(1)} out of 5</span>
          </div>
          <p className="text-sm text-gray-500">{total.toLocaleString()} global ratings</p>

          <div className="flex flex-col gap-3">
            {[5, 4, 3, 2, 1].map((star) => {
              const percent = statMap[star] || 0;
              return (
                <div key={star} className="flex items-center gap-3 text-sm">
                  <span className="text-blue-600 hover:underline cursor-pointer w-[45px] shrink-0 font-medium">
                    {star} star
                  </span>
                  <div className="flex-1 h-4 bg-gray-200 rounded-sm overflow-hidden border border-gray-300 relative">
                    <div 
                      className="absolute left-0 top-0 h-full bg-yellow-400" 
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="text-gray-600 w-10 text-right">{percent}%</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <h4 className="font-semibold text-gray-900">Review the Product</h4>
            <p className="text-sm text-gray-500 mb-2">Share your thoughts with our customers</p>
            <button className="w-full py-2 bg-white border border-gray-300 rounded-full font-medium hover:bg-gray-50 transition-colors shadow-sm">
              Write a product review
            </button>
          </div>
        </div>

        {/* Right Reviews List */}
        <div className="lg:w-2/3 flex flex-col gap-6">
          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet.</p>
          ) : (
            reviews.map((r, i) => (
              <div key={i} className="flex flex-col gap-2 border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold text-sm">
                    {r.user?.email?.[0].toUpperCase() || "U"}
                  </div>
                  <span className="font-semibold text-sm text-gray-900">{r.user?.email || "Anonymous"}</span>
                </div>
                
                <div className="flex gap-2 items-center">
                  <div className="flex text-yellow-500">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} className={`w-3.5 h-3.5 ${idx < r.rating ? "fill-current text-yellow-500" : "fill-gray-200 text-gray-200"}`} />
                    ))}
                  </div>
                  <span className="font-bold text-gray-900 text-sm">{r.title}</span>
                </div>
                
                <p className="text-gray-500 text-xs">Reviewed in India on 29 July 2023</p>
                
                <p className="text-gray-800 text-sm mt-1 whitespace-pre-wrap leading-relaxed">
                  {r.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
