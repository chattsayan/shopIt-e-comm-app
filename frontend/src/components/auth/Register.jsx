import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../redux/api/authApi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import MetaData from "../Layout/MetaData";

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const { name, email, password } = user;

  const [register, { isLoading, error, data }] = useRegisterMutation();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Register successful!");
      navigate("/");
    }

    if (error) {
      toast.error(error?.data?.message);
    }
  }, [error]);

  const submitHandler = (e) => {
    e.preventDefault();

    const signUpData = { name, email, password };
    register(signUpData);
  };

  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <>
      <MetaData title={"Register"} />
      <div className="flex items-center justify-center min-h-[80vh] py-8 px-2">
        <div className="w-full max-w-md rounded-xl shadow-lg p-8">
          <form onSubmit={submitHandler}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-start">
              Register
            </h2>

            <div className="mb-5">
              <label
                htmlFor="name_field"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name_field"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-800 bg-gray-50"
                name="name"
                value={name}
                onChange={onChange}
              />
            </div>

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
                onChange={onChange}
                autoComplete="email"
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
                onChange={onChange}
                autoComplete="current-password"
              />
            </div>

            <div className="flex justify-between items-center mb-6">
              <Link
                to="/login"
                className="text-sm font-semibold text-blue-600 hover:underline"
              >
                Already have an account?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-orange-500 text-white font-semibold rounded-md shadow hover:bg-orange-600 transition-colors cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "REGISTER"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
