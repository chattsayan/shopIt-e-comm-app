import MetaData from "./Layout/MetaData";
import { useGetProductsQuery } from "../redux/api/productApi";
import ProductItem from "./product/ProductItem";
import Loader from "./Layout/Loader";
import { useEffect } from "react";
import toast from "react-hot-toast";
import CustomPagination from "./Layout/CustomPagination";
import { useSearchParams } from "react-router-dom";
import Filter from "./Layout/Filter";

const Home = () => {
  let [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const keyword = searchParams.get("keyword") || "";
  const min = searchParams.get("min");
  const max = searchParams.get("max");
  const category = searchParams.get("category");
  const ratings = searchParams.get("ratings");

  const params = { page, keyword };

  min !== null && (params.min = min);
  max !== null && (params.max = max);
  category !== null && (params.category = category);
  ratings !== null && (params.ratings = ratings);

  const { data, isLoading, error, isError } = useGetProductsQuery(params);

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }
  }, [isError]);

  useEffect(() => {
    console.log("API Response:", {
      products: data?.products?.length,
      resultsPerPage: data?.resultsPerPage,
      filteredProductsCount: data?.filteredProductsCount,
    });
  }, [data]);

  if (isLoading) return <Loader />;

  return (
    <>
      <MetaData title={"Buy Best Products Online"} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5">
        <h1 className="text-gray-600 text-2xl md:text-3xl font-semibold mb-7">
          {keyword
            ? `${data?.products?.length} Products found with keyword: ${keyword}`
            : "Latest Products"}
        </h1>

        <section>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-start">
            {/* Filter component - only show when there's a search */}
            {keyword && <Filter />}

            {/* Product items */}
            {data?.products?.map((product) => (
              <ProductItem key={product._id} product={product} />
            ))}
          </div>
        </section>

        <div className="mt-8">
          <CustomPagination
            resultsPerPage={data?.resultsPerPage}
            filteredProductsCount={data?.filteredProductsCount}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
