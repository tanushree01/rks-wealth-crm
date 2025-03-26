import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Home,
  BarChart,
  TrendingUp,
  User,
  LogOut,
  Folder,
  Calendar,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/authSlice";

const Sidebar = ({ isSidebarOpen }: { isSidebarOpen: boolean }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    router.replace("/login");
  };

  const menuItems = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/client", label: "Client Dairy", icon: BarChart },
    { href: "/topschemes", label: "Top Scheme", icon: TrendingUp },
    { href: "/folio-master", label: "Folio Master", icon: Folder },
    { href: "/long-term", label: "Long Term", icon: Calendar },
    { href: "/90-days-transaction", label: "90 Days Transaction", icon: Clock },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <motion.aside
      initial={{ x: -200 }}
      animate={{ x: isSidebarOpen ? 0 : -200 }}
      transition={{ duration: 0.3 }}
      className="bg-[#f7f7f7] text-black w-64 p-4 flex flex-col h-full"
    >
      {/* Dashboard Title */}
      <h3 className="text-xl font-bold text-center bg-gray-50 rounded-lg border border-gray-300 p-3 text-[#34466e]">
        Dashboard
      </h3>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto space-y-2 mt-4">
        {menuItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 p-2 rounded transition",
              router.pathname === href
                ? "bg-[#9bae58] text-white font-semibold"
                : "hover:bg-[#9bae58]"
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Logout Button at Bottom */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 p-2 rounded transition text-red-600 hover:bg-red-100 w-full"
        aria-label="Logout"
      >
        <LogOut size={18} />
        Logout
      </button>
    </motion.aside>
  );
};

export default Sidebar;
