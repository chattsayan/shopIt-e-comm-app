import MetaData from "../Layout/MetaData";
import UserLayout from "../Layout/UserLayout";
import { useSelector } from "react-redux";

const Profile = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <UserLayout>
      <MetaData title={"Profile"} />
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mt-5">
        {/* Avatar Section */}
        <div className="flex-shrink-0 flex flex-col items-center w-full md:w-1/3">
          <img
            className="rounded-full w-50 h-50 object-cover border-4 border-gray-200"
            src={
              user?.avatar?.url
                ? user?.avatar?.url
                : "../images/default_avatar.jpg"
            }
            alt={user?.name}
          />
        </div>

        {/* Info Section */}
        <div className="flex-1 w-full md:w-2/3">
          <div className="mb-8">
            <h4 className="text-gray-600 font-bold mb-1">Full Name</h4>
            <p className="text-lg text-gray-800">{user?.name}</p>
          </div>

          <div className="mb-8">
            <h4 className="text-gray-600 font-bold mb-1">Email Address</h4>
            <p className="text-lg text-gray-800">{user?.email}</p>
          </div>

          <div>
            <h4 className="text-gray-600 font-bold mb-1">Joined On</h4>
            <p className="text-lg text-gray-800">
              {user?.createdAt?.split("T")[0]}
            </p>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default Profile;
