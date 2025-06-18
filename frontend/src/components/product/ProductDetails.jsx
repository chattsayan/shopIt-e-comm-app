import { useEffect, useState } from "react";
import { useGetProductDetailsQuery } from "../../redux/api/productApi";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import StarRatings from "react-star-ratings";
import Loader from "../Layout/Loader";

const ProductDetails = () => {
  const [activeImg, setActiveImg] = useState("");
  const params = useParams();
  const { data, isLoading, error, isError } = useGetProductDetailsQuery(
    params?.id
  );

  const product = data?.product;

  useEffect(() => {
    setActiveImg(
      product?.images[0]
        ? product?.images[0]?.url
        : "/images/default_product.png"
    );
  }, [product]);

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }
  }, [isError]);

  if (isLoading) return <Loader />;

  return (
    <div className="flex flex-wrap justify-around gap-8 p-4 mt-7">
      {/* Product Images Section */}
      <div className="w-full lg:w-5/12">
        <div className="p-3">
          <img
            className="w-full h-[390px] object-contain"
            src={activeImg}
            alt={product?.name}
          />
        </div>
        <div className="flex flex-wrap gap-4 mt-5">
          {product?.images?.map((img) => (
            <div key={img.url} className="w-24">
              <button
                onClick={() => setActiveImg(img?.url)}
                className={`w-full p-3 border rounded-lg transition-all duration-300 cursor-pointer ${
                  img.url === activeImg
                    ? "border-amber-500 shadow-md"
                    : "border-gray-200 hover:border-amber-300"
                }`}
              >
                <img
                  className="w-full h-24 object-contain"
                  src={img?.url}
                  alt={img?.url}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Product Details Section */}
      <div className="w-full lg:w-5/12 mt-5 lg:mt-0">
        <h3 className="text-2xl font-semibold text-gray-800">
          {product?.name}
        </h3>
        <p className="text-gray-600 mt-1">Product # {product?._id}</p>

        <hr className="my-4" />

        <div className="flex items-center">
          <StarRatings
            rating={product?.ratings}
            starRatedColor="#008000"
            starEmptyColor="#e5e7eb"
            starDimension="24px"
            starSpacing="1px"
            numberOfStars={5}
            name="rating"
          />
          <span className="ml-2 text-gray-600">
            ({product?.numOfReviews} Reviews)
          </span>
        </div>
        <hr className="my-4" />

        <p className="text-2xl font-semibold text-gray-800">
          $ {product?.price}
        </p>

        {/* Quantity Selector */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center border rounded-lg">
            <button className="px-4 py-2 text-xl hover:bg-red-50 rounded-l-lg cursor-pointer">
              -
            </button>
            <input
              type="number"
              className="w-16 text-center py-2 border-x"
              value="1"
              readOnly
            />
            <button className="px-4 py-2 font-bold hover:bg-blue-50 rounded-r-lg cursor-pointer">
              +
            </button>
          </div>
          <button
            type="button"
            className="px-6 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            disabled={product?.stock === 0}
          >
            Add to Cart
          </button>
        </div>

        <hr className="my-4" />

        <p className="flex items-center gap-2">
          Status:{" "}
          <span
            className={`font-medium ${
              product?.stock > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {product?.stock > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </p>

        <hr className="my-4" />

        <h4 className="text-xl font-semibold text-gray-800 mt-2">
          Description:
        </h4>
        <p className="text-gray-600 mt-2">{product?.description}</p>

        <hr className="my-4" />

        <p className="text-gray-600">
          Sold by: <strong className="text-gray-800">{product?.seller}</strong>
        </p>

        <div className="mt-8 p-4 bg-red-200 text-red-700 rounded-lg">
          Login to post your review.
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
