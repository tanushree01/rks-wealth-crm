'use client';

import { useState } from "react";
import ClientDairy from "./ClientDairy";
import FoliomasterProfile from "../FolioMaster/FoliomasterProfile";
import ClientDiaryProfile from "./ClientDiaryProfile";


function TableHeader() {
  const [selectedTab, setSelectedTab] = useState("clientDiary");

  const handleTabChange = (tab: any) => {
    setSelectedTab(tab);
  };

  return (
    <>
      <div className="row">
        <div className="profile-head">
          <ul className="nav nav-tabs poppins-black-italic" id="myTab" role="tablist">
            <li className="nav-item">
              <button
                className={`nav-link ${selectedTab === "clientDiary" ? "active" : ""}`}
                onClick={() => handleTabChange("clientDiary")}
              >
                Client Diary
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${selectedTab === "folioMaster" ? "active" : ""}`}
                onClick={() => handleTabChange("folioMaster")}
              >
                Folio Master
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${selectedTab === "longTerm" ? "active" : ""}`}
                onClick={() => handleTabChange("longTerm")}
              >
                Long Term
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${selectedTab === "topSchemeSubscription" ? "active" : ""}`}
                onClick={() => handleTabChange("topSchemeSubscription")}
              >
                Top Scheme Subscription
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${selectedTab === "transaction" ? "active" : ""}`}
                onClick={() => handleTabChange("transaction")}
              >
                Transaction
              </button>
            </li>
          </ul>
          <div className="container-fluid">
            <div id="myTabContent">
              {selectedTab === "folioMaster" && <ClientDiaryProfile/>}
             {selectedTab === "longTerm" && <FoliomasterProfile/>}
              {/*  {selectedTab === "topSchemeSubscription" && <LeaveHistory />}
              {selectedTab === "transaction" && <MonthlyReport />}
              {selectedTab === "clientDiary" && <MyTeam />} */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TableHeader;
