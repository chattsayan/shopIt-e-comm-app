import { useEffect, useState } from "react";
import { useResetPasswordMutation } from "../../redux/api/userApi";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import MetaData from "../Layout/MetaData";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const params = useParams();
  const { isAuthenticated } = useSelector((state) => state.user);

  const [resetPassword, { isLoading, error, isSuccess }] =
    useResetPasswordMutation();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }

    if (error) {
      toast.error(error?.data?.message);
    }

    if (isSuccess) {
      toast.success("Password reset successfully.");
      navigate("/login");
    }
  }, [error, isAuthenticated, isSuccess]);

  const submitHandler = (e) => {
    e.preventDefault();
    resetPassword({
      token: params?.token,
      body: { password, confirmPassword },
    });
  };

  return (
    <>
      <MetaData title={"Reset Password"} />
      <div className="flex items-center justify-center min-h-[80vh] py-8 px-2">
        <div className="w-full max-w-md rounded-xl shadow-lg p-8">
          <form onSubmit={submitHandler}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-start">
              New Password
            </h2>

            <div className="mb-5">
              <label
                htmlFor="password_field"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password_field"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-800 bg-gray-50"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label
                htmlFor="confirm_password_field"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm_password_field"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-800 bg-gray-50"
                name="confirm_password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-orange-500 text-white font-semibold rounded-md shadow hover:bg-orange-600 transition-colors cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
