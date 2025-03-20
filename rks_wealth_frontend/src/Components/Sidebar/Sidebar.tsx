import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
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

const Sidebar = ({ isSidebarOpen }: { isSidebarOpen: boolean }) => {
  const router = useRouter();

  // Define sidebar items
  const menuItems = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/clientdairy", label: "Client Dairy", icon: BarChart },
    { href: "/foliomaster", label: "Folio Master", icon: Folder },
    { href: "/longterm", label: "Long Term", icon: Clock },
    { href: "/topschemes", label: "Top Scheme", icon: TrendingUp },
    { href: "/transaction", label: "Transaction 90 days", icon: FileText },
    { href: "/login", label: "Logout", icon: LogOut },
  ];

  return (
    <motion.aside
      initial={{ x: -200 }}
      animate={{ x: isSidebarOpen ? 0 : -200 }}
      transition={{ duration: 0.3 }}
      className="bg-white text-black w-64 p-4 space-y-4"
    >
      <div className="flex justify-center">
        <Image src="/logo.jpg" alt="RksWealth Logo" width={150} height={80} />
      </div>
      <h2 className="text-xl font-bold text-center">Dashboard</h2>
      <nav className="space-y-2">
        {menuItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 p-2 rounded transition",
              router.pathname === href
                ? "bg-[#74A82E] text-white font-semibold"
                : "hover:bg-[#74A82E]"
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>
    </motion.aside>
  );
};

export default Sidebar;
