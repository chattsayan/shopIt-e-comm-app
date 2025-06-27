import { useEffect, useState } from "react";
import AdminLayout from "../Layout/AdminLayout";
import Loader from "../Layout/Loader";
import { IoMdTrash } from "react-icons/io";
import {
  useDeleteReviewMutation,
  useLazyGetProductReviewsQuery,
} from "../../redux/api/productApi";
import toast from "react-hot-toast";
import MetaData from "../Layout/MetaData";
import { TransactionsTable } from "../Layout/Table";

const ProductReviews = () => {
  const [productId, setProductId] = useState("");

  const [getProductReviews, { data, isLoading, error }] =
    useLazyGetProductReviewsQuery();

  const [
    deleteReview,
    { isLoading: isDeleteLoading, error: deleteError, isSuccess },
  ] = useDeleteReviewMutation();

  useEffect(() => {
    if (error) toast.error(error?.data?.message);

    if (deleteError) toast.error(deleteError?.data?.message);

    if (isSuccess) toast.success("Review Deleted");
  }, [error, deleteError, isSuccess]);

  const submitHandler = (e) => {
    e.preventDefault();
    getProductReviews(productId);
  };

  const deleteReviewHandler = (id) => {
    deleteReview({ productId, id });
  };

  const headers = ["Review ID", "Rating", "Comment", "User", "Actions"];

  const rows = data?.reviews?.map((review) => ({
    reviewid: review?._id,
    rating: review?.rating,
    comment: review?.comment,
    user: review?.user.name,
    actions: (
      <div className="flex gap-3">
        <button
          className="border p-1 rounded-sm border-red-400 hover:border-red-500 bg-red-400 hover:bg-red-500 cursor-pointer"
          disabled={isDeleteLoading}
          onClick={() => deleteReviewHandler(review?._id)}
        >
          <IoMdTrash size={20} className="text-white" />
        </button>
      </div>
    ),
  }));

  if (isLoading) return <Loader />;

  return (
    <AdminLayout>
      <MetaData title="Product Reviews" />
      <div className="flex justify-center my-10">
        <div className="w-full max-w-md">
          <form onSubmit={submitHandler}>
            <div className="mb-4">
              <label
                htmlFor="productId_field"
                className="block text-gray-700 font-medium mb-2"
              >
                Enter Product ID
              </label>
              <input
                type="text"
                id="productId_field"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </div>

            <button
              id="search_button"
              type="submit"
              className="w-full py-2 bg-orange-500 text-white font-semibold rounded hover:bg-orange-600 transition duration-200"
            >
              SEARCH
            </button>
          </form>
        </div>
      </div>

      {data?.reviews?.length > 0 ? (
        <div className="overflow-x-auto mt-6">
          <TransactionsTable rows={rows} headers={headers} />
        </div>
      ) : (
        <p className="mt-5 text-center">No Reviews Found</p>
      )}
    </AdminLayout>
  );
};

export default ProductReviews;
