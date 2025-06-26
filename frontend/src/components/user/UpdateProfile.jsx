import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUpdateUserMutation } from "../../redux/api/userApi";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import UserLayout from "../Layout/UserLayout";
import MetaData from "../Layout/MetaData";

const UpdateProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const [updateUser, { isLoading, error, isSuccess }] = useUpdateUserMutation();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (user) {
      setName(user?.name);
      setEmail(user?.email);
    }

    if (error) {
      toast.error(error?.data?.message);
    }

    if (isSuccess) {
      toast.success("Profile Updated Successfully!");
      navigate("/me/profile");
    }
  }, [user, error, isSuccess]);

  const submitHandler = (e) => {
    e.preventDefault();

    const userData = { name, email };
    updateUser(userData);
  };

  return (
    <UserLayout>
      <MetaData title={"Update Profile"} />
      <div className="flex justify-center items-center">
        <div className="w-full max-w-3xl p-8">
          <form onSubmit={submitHandler} className="space-y-6">
            <div>
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
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="email_field"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email_field"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-200"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-orange-500 text-white font-semibold rounded-md shadow hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
      </div>
    </UserLayout>
  );
};

export default UpdateProfile;
