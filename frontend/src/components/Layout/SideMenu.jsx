import { Link, useLocation } from "react-router-dom";

const SideMenu = ({ menuItems }) => {
  const location = useLocation();

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
