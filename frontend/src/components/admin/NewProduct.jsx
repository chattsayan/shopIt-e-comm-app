import { useNavigate } from "react-router-dom";
import AdminLayout from "../Layout/AdminLayout";
import { PRODUCT_CATEGORIES } from "../../utils/constants";
import { useEffect, useState } from "react";
import { useCreateProductMutation } from "../../redux/api/productApi";
import toast from "react-hot-toast";
import MetaData from "../Layout/MetaData";

const NewProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    seller: "",
  });
  const navigate = useNavigate();

  const { name, description, price, category, stock, seller } = product;

  const [createProduct, { isLoading, error, isSuccess }] =
    useCreateProductMutation();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (isSuccess) {
      toast.success("Product created.");
      navigate("/admin/products");
    }
  }, [error, isSuccess]);

  const onChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    createProduct(product);
  };

  return (
    <AdminLayout>
      <MetaData title="Add Product" />
      <div className="flex justify-center items-center">
        <div className="w-full max-w-3xl p-8">
          <form onSubmit={submitHandler} className="space-y-6">
            <div className="mb-3">
              <label
                htmlFor="name_field"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name_field"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-200"
                name="name"
                value={name}
                onChange={onChange}
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="description_field"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                className="block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-200"
                id="description_field"
                rows="8"
                name="description"
                value={description}
                onChange={onChange}
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-3">
                <label
                  htmlFor="price_field"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Price
                </label>
                <input
                  type="text"
                  id="price_field"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  name="price"
                  value={price}
                  onChange={onChange}
                />
              </div>

              <div className="mb-3">
                <label
                  htmlFor="stock_field"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Stock
                </label>
                <input
                  type="number"
                  id="stock_field"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  name="stock"
                  value={stock}
                  onChange={onChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-3">
                <label
                  htmlFor="category_field"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Category
                </label>
                <select
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  id="category_field"
                  name="category"
                  value={category}
                  onChange={onChange}
                >
                  {PRODUCT_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label
                  htmlFor="seller_field"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Seller Name
                </label>
                <input
                  type="text"
                  id="seller_field"
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  name="seller"
                  value={seller}
                  onChange={onChange}
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-orange-500 text-white font-semibold rounded-md shadow hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create"}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default NewProduct;
