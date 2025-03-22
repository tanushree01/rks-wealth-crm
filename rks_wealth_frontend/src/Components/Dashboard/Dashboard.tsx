"use client";

import { useState } from "react";
import { Button } from "@/Components/ui/button";
import { Menu } from "lucide-react";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar isSidebarOpen={isSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <Header setIsSidebarOpen={setIsSidebarOpen} />

        {/* Main Dashboard Content */}
        <main className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Portfolio Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Widget 1 */}
            <div className="p-6 bg-[#74A82E] text-white rounded-lg shadow-md">
              <h4 className="text-lg font-semibold">Total Investments</h4>
              <p className="text-2xl font-bold">$50,245</p>
            </div>
            {/* Widget 2 */}
            <div className="p-6 bg-blue-600 text-white rounded-lg shadow-md">
              <h4 className="text-lg font-semibold">Monthly Returns</h4>
              <p className="text-2xl font-bold">$5,430</p>
            </div>
            {/* Widget 3 */}
            <div className="p-6 bg-yellow-600 text-white rounded-lg shadow-md">
              <h4 className="text-lg font-semibold">Active Clients</h4>
              <p className="text-2xl font-bold">345</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
