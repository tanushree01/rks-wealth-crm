import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Home,
  BarChart,
  Folder,
  Clock,
  TrendingUp,
  FileText,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar = ({ isSidebarOpen }: { isSidebarOpen: any }) => {
  return (
    <motion.aside
      initial={{ x: -200 }}
      animate={{ x: isSidebarOpen ? 0 : -200 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "bg-white text-black w-64 p-4 space-y-4",
        !isSidebarOpen && "hidden"
      )}
    >
      <div className="flex justify-center">
        <Image src="/logo.jpg" alt="RksWealth Logo" width={150} height={80} />
      </div>
      <h2 className="text-xl font-bold text-center">Dashboard</h2>
      <nav className="space-y-2">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 p-2 hover:bg-[#74A82E] rounded"
        >
          <Home size={18} /> Home
        </Link>
        <Link
          href="/clientdairy"
          className="flex items-center gap-2 p-2 hover:bg-[#74A82E] rounded"
        >
          <BarChart size={18} /> Client Dairy
        </Link>
        <Link
          href="/settings"
          className="flex items-center gap-2 p-2 hover:bg-[#74A82E] rounded"
        >
          <Folder size={18} /> Folio Master
        </Link>
        <Link
          href="/settings"
          className="flex items-center gap-2 p-2 hover:bg-[#74A82E] rounded"
        >
          <Clock size={18} /> Long Term
        </Link>
        <Link
          href="/settings"
          className="flex items-center gap-2 p-2 hover:bg-[#74A82E] rounded"
        >
          <TrendingUp size={18} /> Top Scheme
        </Link>
        <Link
          href="/settings"
          className="flex items-center gap-2 p-2 hover:bg-[#74A82E] rounded"
        >
          <FileText size={18} /> Transaction 90 days
        </Link>
        <Link
          href="/login"
          className="flex items-center gap-2 p-2 hover:bg-[#74A82E] rounded"
        >
          <LogOut size={18} /> Logout
        </Link>
      </nav>
    </motion.aside>
  );
};

export default Sidebar;
