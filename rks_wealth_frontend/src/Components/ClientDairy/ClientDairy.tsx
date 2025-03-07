import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";

const ClientDairy = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="bg-white dark:bg-gray-800 p-4 px-6 flex justify-between items-center shadow-md">
          <Button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            variant="outline"
            className="ml-2"
          >
            <Menu />
          </Button>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Welcome to RKS Wealth Dashboard
          </h2>
          <div className="text-sm text-gray-600 dark:text-gray-300">User</div>
        </header>

        <main className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
          <div className="flex-1 p-6">
            {/* Scrollable Table Container */}
            <div className="w-290 overflow-x-auto">
              <div className="max-w-screen overflow-x-auto">
                <table className="w-full min-w-max border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-[#74A82E] text-white">
                      <th className="p-2 border">RM</th>
                      <th className="p-2 border">SUB BROKER</th>
                      <th className="p-2 border">FAMILY HEAD</th>
                      <th className="p-2 border">NAME</th>
                      <th className="p-2 border">PAN</th>
                      <th className="p-2 border">IW_AUM</th>
                      <th className="p-2 border">Referred By</th>
                      <th className="p-2 border">EMAIL</th>
                      <th className="p-2 border">MOBILE</th>
                      <th className="p-2 border">DATE OF BIRTH</th>
                      <th className="p-2 border">IW_CREATION DATE</th>
                      <th className="p-2 border">IW_LAST LOGIN</th>
                      <th className="p-2 border">IW_USERNAME</th>
                      <th className="p-2 border">IWELL CODE</th>
                      <th className="p-2 border">CITY_STATE</th>
                      <th className="p-2 border">FULL_ADDRESS</th>
                      <th className="p-2 border">AGE</th>
                      <th className="p-2 border">EQUITY</th>
                      <th className="p-2 border">HYBRID</th>
                      <th className="p-2 border">Debt</th>
                      <th className="p-2 border">RKS_AUM</th>
                      <th className="p-2 border">Debt %</th>
                      <th className="p-2 border">Equity %</th>
                      <th className="p-2 border">Hybrid %</th>
                      <th className="p-2 border">RKS_M1</th>
                      <th className="p-2 border">RKS_M2</th>
                      <th className="p-2 border">RKS_M3</th>
                      <th className="p-2 border">RKS_M4</th>
                      <th className="p-2 border">OTHER_M1</th>
                      <th className="p-2 border">OTHER_M2</th>
                      <th className="p-2 border">OTHER_M3</th>
                      <th className="p-2 border">OTHER_M4</th>
                      <th className="p-2 border">INVESTMENT</th>
                      <th className="p-2 border">SWITCH IN</th>
                      <th className="p-2 border">REDEMPTION</th>
                      <th className="p-2 border">SWITCH OUT</th>
                      <th className="p-2 border">DIVIDEND PAYOUT</th>
                      <th className="p-2 border">NET INVESTMENT</th>
                      <th className="p-2 border">PURCHASE VALUE</th>
                      <th className="p-2 border">CURRENT VALUE</th>
                      <th className="p-2 border">AVG HOLDING DAYS</th>
                      <th className="p-2 border">GAIN</th>
                      <th className="p-2 border">ABSOLUTE RETURN</th>
                      <th className="p-2 border">CAGR</th>
                      <th className="p-2 border">SIP_Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white text-black">
                      <td className="p-2 border">TARUN JAIN</td>
                      <td className="p-2 border">XYZ Broker</td>
                      <td className="p-2 border">AAKANKSHA JAIN</td>
                      <td className="p-2 border">aakanksha jain</td>
                      <td className="p-2 border">AZLPJ0165D</td>
                      <td className="p-2 border">258019</td>
                      <td className="p-2 border">Referral 1</td>
                      <td className="p-2 border">aakankshajain560@gmail.com</td>
                      <td className="p-2 border">9713062290</td>
                      <td className="p-2 border">14/02/1992</td>
                      <td className="p-2 border">04/06/2024</td>
                      <td className="p-2 border">20/02/2025</td>
                      <td className="p-2 border">AAKANKSHA</td>
                      <td className="p-2 border">327223113</td>
                      <td className="p-2 border">GWALIOR, MADHYAPRADESH</td>
                      <td className="p-2 border">
                        men 56 shinde ki chawani Lashkar Gwalior Ajaypur Gwalior
                        Madhya Pradesh
                      </td>
                      <td className="p-2 border">33</td>
                      <td className="p-2 border">258019</td>
                      <td className="p-2 border">0</td>
                      <td className="p-2 border">0</td>
                      <td className="p-2 border">258019</td>
                      <td className="p-2 border">0</td>
                      <td className="p-2 border">100</td>
                      <td className="p-2 border">0</td>
                      <td className="p-2 border">4000</td>
                      <td className="p-2 border">4000</td>
                      <td className="p-2 border">4000</td>
                      <td className="p-2 border">2000</td>
                      <td className="p-2 border">-</td>
                      <td className="p-2 border">-</td>
                      <td className="p-2 border">-</td>
                      <td className="p-2 border">-</td>
                      <td className="p-2 border">47998</td>
                      <td className="p-2 border">0</td>
                      <td className="p-2 border">0</td>
                      <td className="p-2 border">0</td>
                      <td className="p-2 border">0</td>
                      <td className="p-2 border">47998</td>
                      <td className="p-2 border">190000</td>
                      <td className="p-2 border">258019</td>
                      <td className="p-2 border">710</td>
                      <td className="p-2 border">68019</td>
                      <td className="p-2 border">36</td>
                      <td className="p-2 border">17</td>
                      <td className="p-2 border">same</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientDairy;
