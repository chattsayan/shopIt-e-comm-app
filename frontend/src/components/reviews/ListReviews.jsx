import StarRatings from "react-star-ratings";

const ListReviews = ({ reviews }) => {
  return (
    <div className="reviews max-w-2xl mx-auto mt-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 ml-3 md:ml-0">
        Other's Reviews:
      </h3>
      <div className="space-y-6 mx-3 md:mx-0">
        {reviews?.map((review) => (
          <div
            key={review?._id}
            className="flex items-start gap-4 bg-white p-5 border border-gray-100"
          >
            <img
              src={
                review?.user?.avatar
                  ? review?.user?.avatar?.url
                  : "../images/default_avatar.jpg"
              }
              alt={review?.user?.name || "User"}
              className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 shadow-sm"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <StarRatings
                  rating={review?.rating}
                  starRatedColor="#ffb829"
                  starEmptyColor="#e5e7eb"
                  starDimension="18px"
                  starSpacing="2px"
                  numberOfStars={5}
                  name="rating"
                />
                <span className="text-sm text-gray-500 ml-2">
                  by {review?.user?.name}
                </span>
              </div>
              <p className="text-gray-700 text-base mt-1 whitespace-pre-line">
                {review?.comment}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListReviews;
