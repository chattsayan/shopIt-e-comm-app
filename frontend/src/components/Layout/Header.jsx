import { useEffect, useRef, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { LuShoppingCart } from "react-icons/lu";
import { PiUserCircle } from "react-icons/pi";
import { RiArrowDownSLine } from "react-icons/ri";
import { HiOutlineMenu, HiX } from "react-icons/hi";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-gray-800 text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between py-2 sm:py-3 px-3 sm:px-5">
        {/* Logo */}
        <div className="flex-shrink-0">
          <img
            src="../images/shopit_logo.png"
            alt="logo"
            className="h-8 sm:h-10 md:h-12 w-auto"
          />
        </div>

        {/* Search */}
        <div className="hidden sm:flex flex-1 max-w-xl mx-4">
          <form className="flex items-center w-full">
            <input
              type="text"
              placeholder="Enter Product Name ..."
              name="keyword"
              className="h-9 sm:h-10 p-2 sm:p-3 bg-white text-black rounded-l-full w-full text-sm sm:text-base"
            />
            <button
              type="submit"
              className="h-9 sm:h-10 bg-amber-500 p-2 sm:p-2.5 rounded-r-full hover:bg-amber-600"
            >
              <IoSearchOutline size={18} />
            </button>
          </form>
        </div>

        {/* Right side: Desktop */}
        <div className="hidden sm:flex items-center gap-2 sm:gap-3">
          <div className="relative hover:bg-gray-700 rounded-full p-1.5 sm:p-2 cursor-pointer transition-all">
            <LuShoppingCart size={20} className="sm:w-6 sm:h-6" />
            <p className="absolute right-[-2px] top-[3px] w-4 text-center leading-4 bg-orange-600 text-white aspect-square rounded-full text-[9px] font-bold">
              0
            </p>
          </div>

          {/* Dropdown */}
          <div
            className="relative inline-block text-left align-middle"
            ref={dropdownRef}
          >
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex items-center gap-1 p-1.5 sm:p-2 rounded-full hover:bg-gray-700 cursor-pointer"
              aria-haspopup="true"
              aria-expanded={isDropdownOpen}
            >
              <PiUserCircle size={24} className="sm:w-7 sm:h-7" />
              <p className="hidden md:block">User</p>
              <RiArrowDownSLine className="hidden md:block" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg z-10 rounded-md">
                <ul className="py-1">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Dashboard
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Orders
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Profile
                  </li>
                  <hr className="mx-2" />
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>

          <button className="bg-amber-500 px-4 sm:px-6 py-1 rounded-md hover:bg-amber-600 transition text-sm sm:text-base">
            Login
          </button>
        </div>

        {/* Hamburger icon: Mobile only */}
        <div className="sm:hidden">
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="p-1 hover:bg-gray-700 rounded-full"
          >
            {isMobileMenuOpen ? <HiX size={24} /> : <HiOutlineMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-gray-700 text-white px-4 py-3 space-y-3">
          <form className="flex items-center">
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 h-9 p-2 rounded-l-full bg-white text-black text-sm"
            />
            <button
              type="submit"
              className="h-9 bg-amber-500 p-2 rounded-r-full hover:bg-amber-600"
            >
              <IoSearchOutline size={18} />
            </button>
          </form>

          <div className="flex items-center gap-3 py-2">
            <div className="relative">
              <LuShoppingCart size={20} />
              <p className="absolute right-[-2px] top-[3px] w-4 text-center leading-4 bg-orange-600 text-white aspect-square rounded-full text-[9px] font-bold">
                0
              </p>
            </div>
            <span>Cart (0)</span>
          </div>

          {/* <div className="flex items-center gap-3 py-2">
            <PiUserCircle size={20} />
            <span>User</span>
          </div> */}

          <div>
            <button
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              className="w-full flex justify-between items-center gap-2 py-2 bg-gray-700 rounded-md"
            >
              <div className="flex items-center gap-2">
                <PiUserCircle size={24} />
                <span>User</span>
              </div>
              <RiArrowDownSLine
                size={20}
                className={`transform transition-transform ${
                  isUserMenuOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {/* Dropdown menu */}
            {isUserMenuOpen && (
              <ul className="mt-2 ml-8 text-sm space-y-2">
                <li className="hover:text-amber-400 cursor-pointer">
                  Dashboard
                </li>
                <li className="hover:text-amber-400 cursor-pointer">Orders</li>
                <li className="hover:text-amber-400 cursor-pointer">Profile</li>
                <hr className="my-1 border-gray-600" />
                <li className="hover:text-amber-400 cursor-pointer">Logout</li>
              </ul>
            )}
          </div>

          <button className="w-full bg-amber-500 py-2 rounded-md hover:bg-amber-600 cursor-pointer">
            Login
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
