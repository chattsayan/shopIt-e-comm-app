import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getPriceQueryParams } from "../../utils/helpers";
import { PRODUCT_CATEGORIES } from "../../utils/constants";
import StarRatings from "react-star-ratings";

const Filter = () => {
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();

  useEffect(() => {
    searchParams.has("min") && setMin(searchParams.get("min"));
    searchParams.has("max") && setMax(searchParams.get("max"));
  }, []);

  // Handle Price Filter
  const handleButtonClick = (e) => {
    e.preventDefault();

    searchParams = getPriceQueryParams(searchParams, "min", min);
    searchParams = getPriceQueryParams(searchParams, "max", max);
    const path = window.location.pathname + "?" + searchParams.toString();
    navigate(path);
  };

  // Handle Category & Rating Filter
  const handleClick = (checkbox) => {
    const checkboxes = document.getElementsByName(checkbox.name);

    checkboxes.forEach((item) => {
      if (item !== checkbox) item.checked = false;
    });

    if (checkbox.checked === false) {
      // Delete filter from query
      if (searchParams.has(checkbox.name)) {
        searchParams.delete(checkbox.name);
        const path = window.location.pathname + "?" + searchParams.toString();
        navigate(path);
      }
    } else {
      // set new filter value if already there
      if (searchParams.has(checkbox.name)) {
        searchParams.set(checkbox.name, checkbox.value);
      } else {
        // Append new filter
        searchParams.append(checkbox.name, checkbox.value);
      }

      const path = window.location.pathname + "?" + searchParams.toString();
      navigate(path);
    }
  };

  const defaultCheckHandler = (checkboxType, checkboxValue) => {
    const value = searchParams.get(checkboxType);

    if (checkboxValue === value) return true;
    return false;
  };

  return (
    <div className="bg-white overflow-hidden border border-gray-200 h-fit">
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Filters</h3>
        <hr />

        <div className="space-y-4 mt-4">
          {/* Price Section */}
          <div>
            <h5 className="text-md font-medium text-gray-700 mb-3">Price</h5>
            <form className="pl-1 pr-1" onSubmit={handleButtonClick}>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Min ($)"
                    name="min"
                    value={min}
                    onChange={(e) => setMin(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Max ($)"
                    name="max"
                    value={max}
                    onChange={(e) => setMax(e.target.value)}
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full px-3 py-2 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors text-sm cursor-pointer"
                  >
                    GO
                  </button>
                </div>
              </div>
            </form>
          </div>

          <hr className="border-gray-200" />

          {/* Category Section */}
          <div>
            <h5 className="text-md font-medium text-gray-700 mb-3">Category</h5>
            <div className="space-y-2">
              {PRODUCT_CATEGORIES?.map((category) => (
                <div className="flex items-center">
                  <input
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    type="checkbox"
                    name="category"
                    id="check4"
                    value={category}
                    defaultChecked={defaultCheckHandler("category", category)}
                    onClick={(e) => handleClick(e.target)}
                  />
                  <label
                    className="ml-2 text-sm text-gray-700 cursor-pointer"
                    htmlFor="check4"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Ratings Section */}
          <div>
            <h5 className="text-md font-medium text-gray-700 mb-3">Ratings</h5>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div className="flex items-center">
                  <input
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    type="checkbox"
                    name="ratings"
                    id="check7"
                    value={rating}
                    defaultChecked={defaultCheckHandler(
                      "ratings",
                      rating?.toString()
                    )}
                    onClick={(e) => handleClick(e.target)}
                  />
                  <label
                    className="ml-2 text-sm text-gray-700 cursor-pointer"
                    htmlFor="check7"
                  >
                    <StarRatings
                      rating={rating}
                      starRatedColor="#ffb829"
                      starEmptyColor="#e5e7eb"
                      starDimension="16px"
                      starSpacing="1px"
                      numberOfStars={5}
                      name="rating"
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
