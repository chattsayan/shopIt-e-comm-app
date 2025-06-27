import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white">
      <img
        src="../images/404.svg"
        alt="404_not_found"
        className="w-[550px] h-[550px] max-w-full"
      />
      <h5 className="text-center text-lg mt-4">
        Page Not Found. Go to{" "}
        <Link to="/" className="text-blue-600 underline hover:text-blue-800">
          Homepage
        </Link>
      </h5>
    </div>
  );
};

export default NotFound;
