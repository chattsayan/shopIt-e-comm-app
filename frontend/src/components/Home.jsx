import React from "react";
import { FaStar } from "react-icons/fa";
import MetaData from "./Layout/MetaData";

const Home = () => {
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
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4">
                  <img
                    className="w-full h-48 object-contain"
                    src="../images/default_product.png"
                    alt="Product"
                  />
                  <div className="mt-4 space-y-2">
                    <h5 className="text-lg font-medium">
                      <a
                        href=""
                        className="text-gray-800 hover:text-amber-500 transition-colors"
                      >
                        Product Name 1
                      </a>
                    </h5>
                    <div className="flex items-center">
                      <div className="flex">
                        {[...Array(5)].map((_, index) => (
                          <FaStar
                            key={index}
                            className="text-amber-400 w-4 h-4"
                          />
                        ))}
                      </div>
                      <span
                        id="no_of_reviews"
                        className="ml-2 text-gray-600 text-sm"
                      >
                        (0)
                      </span>
                    </div>
                    <p className="text-gray-700 font-semibold">$100</p>
                    <a
                      href=""
                      id="view_btn"
                      className="block w-full text-center bg-amber-500 text-white py-2 rounded-md hover:bg-amber-600 transition-colors"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Home;
