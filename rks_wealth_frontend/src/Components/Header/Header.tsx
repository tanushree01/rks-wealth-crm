import {
  Search,
  User,
  ChevronDown,
  LogOut,
  Settings,
  HelpCircle,
} from "lucide-react";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";

interface User {
  firstName: string;
  lastName: string;
  email?: string;
}

const Header = () => {
  // const user = useSelector((state: RootState) => state.auth.user);
  const [user, setUser] = useState<User | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  console.log(user);
  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      const parsedData = JSON.parse(storedUser);
      setUser(parsedData.user); // Extract the user object
    }
  }, []);

  return (
    <header className="bg-[#34466e] p-4 px-6 flex justify-between items-center shadow-md w-full">
      {/* Logo and Search bar container */}
      <div className="flex items-center space-x-4">
        {/* Logo */}
        <Image
          src="/logo.jpg"
          alt="RksWealth Logo"
          width={80}
          height={80}
          className="rounded-full object-cover"
        />

        {/* Search Bar */}
        <div className="relative bg-white px-4 mx-10 py-2 rounded-full shadow-md w-96">
          <input
            type="text"
            placeholder="Global Search"
            className="w-full outline-none text-[#34466e] pr-10" // Add right padding to prevent overlap with the icon
          />
          {/* Custom Search Icon inside the search bar */}
          <Image
            src="/searchIcon.png"
            alt="Search Icon"
            width={92} // Adjust size directly here
            height={92}
            className="absolute left-79 top-1/2 -translate-y-1/2"
          />
        </div>
      </div>

      {/* User Profile & Dropdown */}
      <div className="relative">
        <div
          className="flex items-center space-x-2 text-white cursor-pointer"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <div className="w-8 h-8 bg-black text-white border border-white rounded-full flex items-center justify-center font-bold uppercase">
            {user?.firstName?.charAt(0)}
            {user?.lastName?.charAt(0)}
          </div>

          <span className="text-sm">
            {user?.firstName} {user?.lastName}
          </span>
          <ChevronDown className="w-4 h-4 text-white" />
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-[#ffffff] shadow-lg rounded-md border border-[#dbdbdb] z-50">
            <ul className="text-[#34466e]">
              <li className="px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer">
                <Link href="/profile" className="flex items-center w-full">
                  <User className="w-4 h-4 mr-2" /> Profile
                </Link>
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer">
                <Link href="/register" className="flex items-center w-full">
                  <User className="w-4 h-4 mr-2" /> Register
                </Link>
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer">
                <Settings className="w-4 h-4 mr-2" /> Admin
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer">
                <HelpCircle className="w-4 h-4 mr-2" /> Support
              </li>
              <hr className="border-[#dbdbdb]" />
              <li className="px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer text-[#ff3131]">
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
