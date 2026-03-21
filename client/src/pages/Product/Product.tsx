import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/stores/store";
import {
  fetchProductDetail,
  fetchProductReviews,
  fetchRelatedProducts,
} from "@/stores/slices/productDetailSlice";

import ProductDetailsSection from "./components/ProductDetailsSection";
import ProductFeaturesSection from "./components/ProductFeaturesSection";
import ProductReviewsSection from "./components/ProductReviewsSection";
import RelatedProductsCarousel from "./components/RelatedProductsCarousel";

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const { product, reviews, reviewsStats, relatedProducts, loading, error } =
    useSelector((state: RootState) => state.productDetail);

  useEffect(() => {
    if (id) {
      window.scrollTo(0, 0);
      dispatch(fetchProductDetail(id));
      dispatch(fetchProductReviews(id));
      dispatch(fetchRelatedProducts(id));
    }
  }, [dispatch, id]);

  if (loading.product && !product) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error.product || !product) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-red-500 text-lg">
          {error.product || "Product not found"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="max-w-[1280px] w-full mx-auto px-4 py-8 space-y-12">
        <ProductDetailsSection key={`details-${product._id}`} product={product} />

        <div className="border-t border-gray-200" />

        <ProductFeaturesSection key={`features-${product._id}`} product={product} />

        <RelatedProductsCarousel
          title="Related Products"
          products={relatedProducts}
          isLoading={loading.relatedProducts}
        />

        <ProductReviewsSection
          reviews={reviews}
          reviewsStats={reviewsStats}
          isLoading={loading.reviews}
        />

        <RelatedProductsCarousel
          title="Related Products"
          products={relatedProducts}
          isLoading={loading.relatedProducts}
        />
      </div>
    </div>
  );
}
