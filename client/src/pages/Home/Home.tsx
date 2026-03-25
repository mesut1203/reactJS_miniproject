import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/stores/store";
import {
  fetchCategories,
  fetchExploreMore,
  fetchRecommended,
  fetchTodayDeals,
} from "@/stores/slices/productSlice";

import HeroSection from "./components/HeroSection";
import CategoryNav from "./components/CategoryNav";
import ProductSection from "./components/ProductSection";
import BannerSection from "./components/BannerSection";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { todayDeals, recommended, exploreMore, loading } = useSelector(
    (state: RootState) => state.product,
  );

  useEffect(() => {
    // Fetch all necessary data for the homepage
    dispatch(fetchCategories());
    dispatch(fetchTodayDeals(10));
    dispatch(fetchRecommended());
    dispatch(fetchExploreMore(20));
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <HeroSection />
      <CategoryNav />
      <ProductSection
        title="Today's "
        titleHighlight="Deals"
        products={todayDeals}
        isLoading={loading.todayDeals}
      />
      <ProductSection
        title="More Items to "
        titleHighlight="Consider"
        products={recommended}
        isLoading={loading.recommended}
      />
      <BannerSection />
      <div className="my-8"></div> {/* spacer */}
      <ProductSection
        title="Explore "
        titleHighlight="more"
        products={exploreMore}
        isLoading={loading.exploreMore}
      />
    </div>
  );
}
