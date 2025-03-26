import { useState } from "react";
import { Button } from "@/Components/ui/button";
import { Menu } from "lucide-react";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar open by default

  return (
    <div className="h-screen flex flex-col bg-[#f7f7f7]">
      {/* Full-width Header */}
      <Header />

      {/* Main Layout with Sidebar & Content */}
      <div className="flex flex-1">
        {/* Sidebar (Fixed Width) */}
        {isSidebarOpen && (
          <div className="w-64 bg-[#34466e] text-white">
            <Sidebar isSidebarOpen={isSidebarOpen} />
          </div>
        )}

        {/* Main Content (Takes Remaining Space) */}
        <div className="flex-1 flex flex-col">
          {/* Sidebar Toggle Button */}
          <div className="bg-[#f7f7f7] p-4 px-6 flex justify-between items-center shadow-md text-[#34466e]">
            {/* Sidebar Toggle Button */}
            <Button
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              variant="outline"
              className=" bg-[#f7f7f7] text-[#9bae58] shadow-lg rounded-none"
            >
              <Menu style={{ width: "20px", height: "40px" }} />
            </Button>

            {/* Portfolio Overview (Centered) */}
            <h3 className="text-xl font-bold text-center flex-1">
              Portfolio Overview
            </h3>
          </div>

          {/* Dashboard Content */}
          <main>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 mx-10">
              {/* Total Investments */}
              <div className="p-6 bg-[#9bae58] text-white shadow-md text-center">
                <h4 className="text-lg font-semibold">Total Investments</h4>
                <p className="text-2xl font-bold">$50,245</p>
              </div>

              {/* Monthly Returns */}
              <div className="p-6 bg-[#34466e] text-white shadow-md text-center">
                <h4 className="text-lg font-semibold">Monthly Returns</h4>
                <p className="text-2xl font-bold">$5,430</p>
              </div>

              {/* Active Clients */}
              <div className="p-6 bg-[#9bae58] text-white  shadow-md text-center">
                <h4 className="text-lg font-semibold">Active Clients</h4>
                <p className="text-2xl font-bold">345</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
