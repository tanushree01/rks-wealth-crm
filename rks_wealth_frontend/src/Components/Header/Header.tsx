import { Menu, User } from "lucide-react";
import { Button } from "../ui/button";

const Header = ({ setIsSidebarOpen }: { setIsSidebarOpen: any }) => {
  return (
    <header className="bg-white dark:bg-gray-900 p-4 px-6 flex justify-between items-center shadow-md border-b border-gray-200 dark:border-gray-700">
      <Button
        onClick={() => setIsSidebarOpen((prev: any) => !prev)}
        variant="outline"
        className="ml-2 border border-gray-300 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-white shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <Menu className="w-6 h-6" />
      </Button>

      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
        Welcome to{" "}
        <span className="text-blue-600 dark:text-blue-400">
          RKS Wealth Dashboard
        </span>
      </h2>

      <div className="flex flex-col items-center space-y-1">
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center shadow-sm">
          <User className="text-gray-800 dark:text-white w-5 h-5" />
        </div>
        <span className="text-gray-700 dark:text-gray-300 text-sm">
          RKS Wealth
        </span>
      </div>
    </header>
  );
};

export default Header;
