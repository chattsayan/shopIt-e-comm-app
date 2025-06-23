import { Link } from "react-router-dom";
import StarRatings from "react-star-ratings";
import MetaData from "../Layout/MetaData";

const ProductItem = ({ product }) => {
  return (
    <>
      <MetaData title={"Product Item"} />
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4">
          <div className="relative group">
            <img
              className="w-full h-48 object-contain transition-transform duration-300 group-hover:scale-105"
              src={
                product?.images[0]
                  ? product?.images[0]?.url
                  : "/images/default_product.png"
              }
              alt={product?.name}
            />
          </div>
          <div className="mt-4 space-y-3">
            <h5 className="text-lg font-medium line-clamp-2">
              <Link
                to={`/product/${product?._id}`}
                className="text-gray-800 hover:text-amber-500 transition-colors duration-300"
              >
                {product?.name}
              </Link>
            </h5>
            <div className="flex items-center">
              <div className="flex">
                <StarRatings
                  rating={product?.ratings}
                  starRatedColor="#008000"
                  starEmptyColor="#e5e7eb"
                  starDimension="21px"
                  starSpacing="1px"
                  numberOfStars={5}
                  name="rating"
                />
              </div>
              <span className="ml-2 text-gray-600 text-sm">
                ({product?.numOfReviews} reviews)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-gray-700 font-semibold text-lg">
                $ {product?.price?.toFixed(2)}
              </p>
              {/* <span className="text-sm text-gray-500">
              {product?.stock > 0
                ? `${product.stock} in stock`
                : "Out of stock"}
            </span> */}
            </div>
            <Link
              to={`/product/${product?._id}`}
              className="block w-full text-center bg-amber-500 text-white py-2.5 rounded-md hover:bg-amber-600 transition-all duration-300 font-medium shadow-sm hover:shadow-md"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductItem;
