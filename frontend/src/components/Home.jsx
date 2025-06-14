import MetaData from "./Layout/MetaData";
import { useGetProductsQuery } from "../redux/api/productApi";
import ProductItem from "./product/ProductItem";
import Loader from "./Layout/Loader";
import { useEffect } from "react";
import toast from "react-hot-toast";

const Home = () => {
  const { data, isLoading, error, isError } = useGetProductsQuery();

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }
  }, [isError]);

  if (isLoading) return <Loader />;

  return (
    <>
      <MetaData title={"Buy Best Products Online"} />
      <div className="w-full">
        <div className="w-full">
          <h1
            id="products_heading"
            className="text-gray-600 text-2xl md:text-3xl font-semibold"
          >
            Latest Products
          </h1>

          <section id="products" className="mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {data?.products?.map((product, index) => (
                <ProductItem key={index} product={product} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Home;
