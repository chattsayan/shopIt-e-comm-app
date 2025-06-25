import SideMenu from "./SideMenu";
import { RiDashboard2Fill } from "react-icons/ri";
import { RiAddBoxFill } from "react-icons/ri";
import { MdProductionQuantityLimits } from "react-icons/md";
import { TbInvoice } from "react-icons/tb";
import { ImUsers } from "react-icons/im";
import { TiStarFullOutline } from "react-icons/ti";

const AdminLayout = ({ children }) => {
  const menuItems = [
    {
      name: "Dashboard",
      url: "/admin/dashboard",
      icon: <RiDashboard2Fill size={20} />,
    },
    {
      name: "New Product",
      url: "/admin/product/new",
      icon: <RiAddBoxFill size={20} />,
    },
    {
      name: "Products",
      url: "/admin/products",
      icon: <MdProductionQuantityLimits size={20} />,
    },
    {
      name: "Order",
      url: "/admin/orders",
      icon: <TbInvoice size={20} />,
    },
    {
      name: "Users",
      url: "/admin/users",
      icon: <ImUsers size={20} />,
    },
    {
      name: "Reviews",
      url: "/admin/reviews",
      icon: <TiStarFullOutline size={20} />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mt-2 mb-4 py-4">
        <h2 className="text-center text-gray-600 text-2xl md:text-3xl font-semibold mb-7">
          Admin Dashboard
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

export default AdminLayout;
