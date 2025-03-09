import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";

const ClientDairy = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [clientData, setClientData] = useState<any[]>([]);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/client/diary"
        );
        if (data?.data) {
          setClientData([data.data]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchClientData();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <div className="flex-1 flex flex-col">
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
          <div className="overflow-x-auto">
            <table className="w-full min-w-max border-collapse border border-gray-200">
              <thead>
                <tr className="bg-[#74A82E] text-white">
                  {[
                    "RM",
                    "SUB BROKER",
                    "FAMILY HEAD",
                    "NAME",
                    "PAN",
                    "IW_AUM",
                    "Referred By",
                    "EMAIL",
                    "MOBILE",
                    "DATE OF BIRTH",
                    "IW_CREATION DATE",
                    "IW_LAST LOGIN",
                    "IW_USERNAME",
                    "IWELL CODE",
                    "CITY_STATE",
                    "FULL_ADDRESS",
                    "AGE",
                    "EQUITY",
                    "HYBRID",
                    "Debt",
                    "RKS_AUM",
                    "Debt percentage",
                    "Equity percentage",
                    "Hybrid percentage",
                    "RKS_M1",
                    "RKS_M2",
                    "RKS_M3",
                    "RKS_M4",
                    "OTHER_M1",
                    "OTHER_M2",
                    "OTHER_M3",
                    "OTHER_M4",
                    "INVESTMENT",
                    "SWITCH IN",
                    "REDEMPTION",
                    "SWITCH OUT",
                    "DIVIDEND PAYOUT",
                    "NET INVESTMENT",
                    "PURCHASE VALUE",
                    "CURRENT VALUE",
                    "AVG HOLDING DAYS",
                    "GAIN",
                    "ABSOLUTE RETURN",
                    "CAGR",
                    "SIP_Status",
                  ].map((header) => (
                    <th key={header} className="p-2 border">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {clientData.map((client, index) => (
                  <tr key={index} className="bg-white text-black">
                    {[
                      "RM",
                      "SUB BROKER",
                      "FAMILY HEAD",
                      "NAME",
                      "PAN",
                      "IW_AUM",
                      "Referred By",
                      "EMAIL",
                      "MOBILE",
                      "DATE OF BIRTH",
                      "IW_CREATION DATE",
                      "IW_LAST LOGIN",
                      "IW_USERNAME",
                      "IWELL CODE",
                      "CITY_STATE",
                      "FULL_ADDRESS",
                      "AGE",
                      "EQUITY",
                      "HYBRID",
                      "Debt",
                      "RKS_AUM",
                      "Debt percentage",
                      "Equity percentage",
                      "Hybrid percentage",
                      "RKS_M1",
                      "RKS_M2",
                      "RKS_M3",
                      "RKS_M4",
                      "OTHER_M1",
                      "OTHER_M2",
                      "OTHER_M3",
                      "OTHER_M4",
                      "INVESTMENT",
                      "SWITCH IN",
                      "REDEMPTION",
                      "SWITCH OUT",
                      "DIVIDEND PAYOUT",
                      "NET INVESTMENT",
                      "PURCHASE VALUE",
                      "CURRENT VALUE",
                      "AVG HOLDING DAYS",
                      "GAIN",
                      "ABSOLUTE RETURN",
                      "CAGR",
                      "SIP_Status",
                    ].map((field) => (
                      <td key={field} className="p-2 border">
                        {client[field] || "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientDairy;
