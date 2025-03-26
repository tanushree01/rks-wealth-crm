import {
  Menu,
  Search,
  User,
  ChevronDown,
  LogOut,
  Settings,
  HelpCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import Image from "next/image";
import { useState } from "react";

const Header = ({ setIsSidebarOpen }: { setIsSidebarOpen: any }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="bg-[#34466e] p-4 px-6 flex justify-between items-center shadow-md">
      {/* Left: Logo and Menu Button */}
      <div className="flex items-center space-x-4">
        <Image
          src="/logo.jpg"
          alt="RksWealth Logo"
          width={80}
          height={80}
          className="rounded-full object-cover"
        />

        {/* <Button
          onClick={() => setIsSidebarOpen((prev: any) => !prev)}
          variant="outline"
          className="border-[#959595] bg-[#dbdbdb] text-[#34466e] shadow-sm hover:bg-gray-300"
        >
          <Menu className="w-6 h-6" />
        </Button> */}
      </div>

      {/* Center: Search Bar */}
      <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-md w-96">
        <input
          type="text"
          placeholder="Global Search"
          className="w-full outline-none text-[#34466e]"
        />
        <Search className="text-[#34466e]" />
      </div>

      {/* Right: User Profile & Dropdown */}
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
          <div className="absolute right-0 mt-2 w-48 bg-[#ffffff] shadow-lg rounded-md border border-[#dbdbdb]">
            <ul className="text-[#34466e]">
              <li className="px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer">
                <User className="w-4 h-4 mr-2" /> Profile
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
