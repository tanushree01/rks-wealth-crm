import { useState } from "react";
import { Button } from "@/Components/ui/button";
import { Menu } from "lucide-react";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar closed by default

  return (
    <div className="flex h-screen bg-[#f7f7f7]">
      {/* Sidebar */}
      {isSidebarOpen && <Sidebar isSidebarOpen={isSidebarOpen} />}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header with Sidebar Toggle */}
        <Header setIsSidebarOpen={setIsSidebarOpen} />
        <div className="bg-[#f7f7f7] p-4 px-6 flex justify-between items-center shadow-md text-[#34466e]">
          {/* Sidebar Toggle Button */}
          <Button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            variant="outline"
            className="border-[#959595] bg-[#f7f7f7] text-[#9bae58] shadow-lg hover:bg-gray-300"
          >
            <Menu className="w-6 h-6" />
          </Button>

          {/* Portfolio Overview (Centered) */}
          <h3 className="text-xl font-bold text-center flex-1">
            Portfolio Overview
          </h3>
        </div>

        {/* Main Dashboard Content */}
        <main className="p-6">
          <h3 className="text-2xl font-bold text-[#34466e]">Dashboard</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Total Investments */}
            <div className="p-6 bg-[#9bae58] text-white rounded-lg shadow-md">
              <h4 className="text-lg font-semibold">Total Investments</h4>
              <p className="text-2xl font-bold">$50,245</p>
            </div>

            {/* Monthly Returns */}
            <div className="p-6 bg-[#34466e] text-white rounded-lg shadow-md">
              <h4 className="text-lg font-semibold">Monthly Returns</h4>
              <p className="text-2xl font-bold">$5,430</p>
            </div>

            {/* Active Clients */}
            <div className="p-6 bg-[#dbdbdb] text-[#34466e] rounded-lg shadow-md">
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
