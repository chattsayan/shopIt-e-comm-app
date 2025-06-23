import React, { useEffect, useState } from "react";
import { useForgotPasswordMutation } from "../../redux/api/userApi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);

  const [forgotPassword, { isLoading, error, isSuccess }] =
    useForgotPasswordMutation();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }

    if (error) {
      toast.error(error?.data?.message);
    }

    if (isSuccess) {
      toast.success("Email sent. Please check your inbox.");
    }
  }, [error, isAuthenticated, isSuccess]);

  const submitHandler = (e) => {
    e.preventDefault();
    forgotPassword({ email });
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] py-8 px-2">
      <div className="w-full max-w-md rounded-xl shadow-lg p-8">
        <form onSubmit={submitHandler}>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-start">
            Forgot Password
          </h2>
          <div className="mb-5">
            <label
              htmlFor="email_field"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Enter Email
            </label>
            <input
              type="email"
              id="email_field"
              className="block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-800 bg-gray-50"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-orange-500 text-white font-semibold rounded-md shadow hover:bg-orange-600 transition-colors cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Email"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
