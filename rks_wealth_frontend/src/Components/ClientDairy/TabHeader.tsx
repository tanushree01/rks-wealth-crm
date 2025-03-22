"use client";

import { useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";

// Dynamically import components to prevent unnecessary mounting
const ClientDiaryProfile = dynamic(() => import("./ClientDiaryProfile"), {
  ssr: false,
});
const FoliomasterProfile = dynamic(
  () => import("../FolioMaster/FoliomasterProfile"),
  { ssr: false }
);

const TableHeader = () => {
  const [selectedTab, setSelectedTab] = useState("clientDiary");

  const handleTabChange = useCallback((tab: string) => {
    setSelectedTab(tab);
  }, []);

  // Memoized component rendering to avoid unnecessary re-renders
  const renderComponent = useMemo(() => {
    switch (selectedTab) {
      case "folioMaster":
        return <FoliomasterProfile />;
      // case "clientDiary":
      //   return <ClientDiaryProfile />;
      default:
        return null;
    }
  }, [selectedTab]);

  return (
    <div className="mt-1 bg-white shadow-md rounded-lg p-4">
      <div className="flex space-x-4 border-b pb-2">
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold ${
            selectedTab === "folioMaster"
              ? "bg-[#2c476a] text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => handleTabChange("folioMaster")}
        >
          Folio Master
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold ${
            selectedTab === "longTerm"
              ? "bg-[#2c476a] text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => handleTabChange("longTerm")}
        >
          Long Term
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold ${
            selectedTab === "transaction"
              ? "bg-[#2c476a] text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => handleTabChange("transaction")}
        >
          Transactions
        </button>
      </div>
      <div className="p-4">{renderComponent}</div>
    </div>
  );
};

export default TableHeader;
