import { useEffect, useState } from "react";
import StarRatings from "react-star-ratings";
import {
  useCanUserReviewQuery,
  useSubmitReviewMutation,
} from "../../redux/api/productApi";
import toast from "react-hot-toast";

const NewReview = ({ productId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [open, setOpen] = useState(false);

  const [submitReview, { error, isSuccess }] = useSubmitReviewMutation();

  const { data } = useCanUserReviewQuery(productId);
  const canReview = data?.canReview;

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (isSuccess) {
      toast.success("Review posted.");
    }
  }, [error, isSuccess]);

  const submitHandler = () => {
    const reviewData = {
      rating,
      comment,
      productId,
    };

    submitReview(reviewData);
    setOpen(false);
  };

  return (
    <div>
      {canReview && (
        <button
          type="button"
          className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-2 rounded-full transition mb-4 cursor-pointer mt-4"
          onClick={() => setOpen(true)}
        >
          Submit Your Review
        </button>
      )}

      {/* Modal Overlay */}
      {open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center backdrop-blur-xs transition-opacity">
          {/* Modal Content */}
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 relative animate-fadeIn">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
              Submit Review
            </h3>
            <form onSubmit={submitHandler}>
              <div className="flex flex-col items-center gap-4">
                <StarRatings
                  rating={rating}
                  starRatedColor="#ffb829"
                  starEmptyColor="#e5e7eb"
                  starDimension="28px"
                  starSpacing="2px"
                  numberOfStars={5}
                  name="rating"
                  changeRating={setRating}
                />
                <textarea
                  name="review"
                  id="review"
                  className="w-full min-h-[90px] border border-gray-300 rounded-md p-3 text-gray-700 focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
                  placeholder="Enter your comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md shadow transition disabled:opacity-60"
                  disabled={rating === 0 || comment.trim() === ""}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewReview;
