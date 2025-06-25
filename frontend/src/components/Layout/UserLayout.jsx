import SideMenu from "./SideMenu";
import { ImUser } from "react-icons/im";
import { RxUpdate } from "react-icons/rx";
import { FaImagePortrait } from "react-icons/fa6";
import { RiLockPasswordFill } from "react-icons/ri";

const UserLayout = ({ children }) => {
  const menuItems = [
    {
      name: "Profile",
      url: "/me/profile",
      icon: <ImUser size={20} />,
    },
    {
      name: "Update Profile",
      url: "/me/update_profile",
      icon: <RxUpdate size={20} />,
    },
    {
      name: "Upload Avatar",
      url: "/me/upload_avatar",
      icon: <FaImagePortrait size={20} />,
    },
    {
      name: "Update Password",
      url: "/me/update_password",
      icon: <RiLockPasswordFill size={20} />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mt-2 mb-4 py-4">
        <h2 className="text-center text-gray-600 text-2xl md:text-3xl font-semibold mb-7">
          User Settings
        </h2>
      </div>

      <div className="w-full px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <SideMenu menuItems={menuItems} />
          </div>
          <div className="md:col-span-3 md:ml-10">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
