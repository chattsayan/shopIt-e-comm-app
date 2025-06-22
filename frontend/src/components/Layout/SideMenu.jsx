import { Link, useLocation } from "react-router-dom";
import { ImUser } from "react-icons/im";
import { RxUpdate } from "react-icons/rx";
import { FaImagePortrait } from "react-icons/fa6";
import { RiLockPasswordFill } from "react-icons/ri";

const SideMenu = () => {
  const location = useLocation();

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
    <div className="mt-5 pl-4">
      {menuItems.map((item, index) => {
        const isActive = location.pathname === item.url;

        return (
          <Link
            key={index}
            to={item.url}
            className={`flex items-center gap-4 font-medium px-4 py-2 rounded transition
              ${
                isActive
                  ? "bg-gray-200 text-orange-500 hover:bg-gray-200"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            aria-current={isActive ? "page" : undefined}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default SideMenu;
