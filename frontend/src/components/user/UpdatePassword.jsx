import { useEffect, useState } from "react";
import UserLayout from "../Layout/UserLayout";
import { useUpdatePasswordMutation } from "../../redux/api/userApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import MetaData from "../Layout/MetaData";

const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [updatePassword, { isLoading, error, isSuccess }] =
    useUpdatePasswordMutation();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (isSuccess) {
      toast.success("Password Updated Successfully!");
      navigate("/me/profile");
    }
  }, [error, isSuccess]);

  const submitHandler = (e) => {
    e.preventDefault();

    const userData = { oldPassword, password };
    updatePassword(userData);
  };

  return (
    <UserLayout>
      <MetaData title={"Update Password"} />
      <div className="flex justify-center items-center">
        <div className="w-full max-w-3xl p-8">
          <form className="space-y-6" onSubmit={submitHandler}>
            <div>
              <label
                htmlFor="old_password_field"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Old Password
              </label>
              <input
                type="password"
                id="old_password_field"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-200"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="new_password_field"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                New Password
              </label>
              <input
                type="password"
                id="new_password_field"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-orange-500 text-white font-semibold rounded-md shadow hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </UserLayout>
  );
};

export default UpdatePassword;
