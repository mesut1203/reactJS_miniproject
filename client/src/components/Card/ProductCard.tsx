import type { Product } from "@/types/product";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link to={`/product/${product._id}`} className="block flex-shrink-0 w-64 text-black no-underline">
      <div className="bg-white rounded-3xl shadow-md h-full transition-transform hover:-translate-y-1 hover:shadow-lg">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover rounded-t-3xl"
        />

        <div className="p-4">
          <h3 className="font-semibold text-sm line-clamp-2 min-h-[40px]">{product.name}</h3>
          <p className="font-bold text-orange-500 mt-2">${product.price.toLocaleString()}</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
