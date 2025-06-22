import SideMenu from "./SideMenu";

const UserLayout = ({ children }) => {
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
            <SideMenu />
          </div>
          <div className="md:col-span-3 md:ml-10">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
