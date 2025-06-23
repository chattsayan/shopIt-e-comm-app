import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../redux/api/authApi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import MetaData from "../Layout/MetaData";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [login, { isLoading, error }] = useLoginMutation();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Login successful!");
      navigate("/");
    }

    if (error) {
      toast.error(error?.data?.message);
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message || "Login Failed. Please try again.");
    }
  }, [error]);

  const submitHandler = (e) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <>
      <MetaData title={"Login"} />
      <div className="flex items-center justify-center min-h-[80vh] py-8 px-2">
        <div className="w-full max-w-md rounded-xl shadow-lg p-8">
          <form onSubmit={submitHandler}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-start">
              Login
            </h2>
            <div className="mb-5">
              <label
                htmlFor="email_field"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email_field"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-800 bg-gray-50"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

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
                autoComplete="current-password"
                required
              />
            </div>

            <div className="flex justify-between items-center mb-6">
              <Link
                to="/password/forgot"
                className="text-sm font-semibold text-blue-600 hover:underline"
              >
                Forgot Password?
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold text-gray-600 hover:text-blue-600 hover:underline"
              >
                New User?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-orange-500 text-white font-semibold rounded-md shadow hover:bg-orange-600 transition-colors cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Authenticating..." : "LOGIN"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
