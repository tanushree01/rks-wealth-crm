import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination"; // Import Pagination component
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

const ClientDairy = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [diaryData, setDiaryData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/client/diary?page=${currentPage}&limit=10&orderBy=NAME`
        );
        setLoading(false);
        setDiaryData(response.data?.data);
        setTotalPages(response.data?.totalPages);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);


  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const renderPagination = () => {
    let pages = [];
    const pageLimit = 5;
    
    if (totalPages <= pageLimit) {
      pages = Array.from({ length: totalPages }, (_, index) => index + 1);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 3) pages.push("...");
      pages.push(totalPages);
    }

    return pages.map((page, index) => (
      <PaginationItem key={index}>
        {typeof page === "number" ? (
          <PaginationLink className={currentPage === page?"":"text-black"} onClick={() => handlePageChange(page)} isActive={currentPage === page}>
            {page}
          </PaginationLink>
        ) : (
          <PaginationEllipsis />
        )}
      </PaginationItem>
    ));
  };


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
            <div className="overflow-x-auto" style={{ width: "calc(100vw - 300px)" }}>
              <div className="max-w-screen overflow-x-auto">
              {loading ? (
                  <>
                    <Skeleton className="w-full h-10 mb-2" />
                    <Skeleton className="w-full h-10 mb-2" />
                    <Skeleton className="w-full h-10 mb-2" />
                    <Skeleton className="w-full h-10 mb-2" />
                    <Skeleton className="w-full h-10 mb-2" />
                    <Skeleton className="w-full h-10 mb-2" />
                    <Skeleton className="w-full h-10 mb-2" />
                    <Skeleton className="w-full h-10 mb-2" />
                    <Skeleton className="w-full h-10 mb-2" />
                    <Skeleton className="w-full h-10 mb-2" />
                  </>
                ) : (
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
                    {(diaryData || []).map((diarys: any) => (
                      <tr className="bg-white text-black">
                        <td className="p-2 border">{diarys.RM}</td>
                        <td className="p-2 border">{diarys.SUB_BROKER}</td>
                        <td className="p-2 border">{diarys.FAMILY_HEAD}</td>
                        <td className="p-2 border">{diarys.NAME}</td>
                        <td className="p-2 border">{diarys.PAN}</td>
                        <td className="p-2 border">{diarys.IW_AUM}</td>
                        <td className="p-2 border">{diarys.REFERRED_BY}</td>
                        <td className="p-2 border">{diarys.IW_USERNAME}</td>
                        <td className="p-2 border">{diarys.IWELL_CODE}</td>
                        <td className="p-2 border">{diarys.AGE}</td>
                        <td className="p-2 border">{diarys.EQUITY}</td>
                        <td className="p-2 border">{diarys.HYBRID}</td>
                        <td className="p-2 border">{diarys.DEBT}</td>
                        <td className="p-2 border">{diarys.RKS_AUM}</td>
                        <td className="p-2 border">{diarys.DEBT_PERCENTAGE}</td>
                        <td className="p-2 border">{diarys.EQUITY_PERCENTAGE}</td>
                        <td className="p-2 border">{diarys.HYBRID_PERCENTAGE}</td>
                        <td className="p-2 border">{diarys.EMAIL}</td>
                        <td className="p-2 border">{diarys.MOBILE}</td>
                        <td className="p-2 border">{diarys.DATE_OF_BIRTH}</td>
                        <td className="p-2 border">{diarys.IW_CREATION_DATE}</td>
                        <td className="p-2 border">{diarys.IW_LAST_LOGIN}</td>
                        <td className="p-2 border">{diarys.SIP_STATUS}</td>
                        <td className="p-2 border">{diarys.RKS_M1}</td>
                        <td className="p-2 border">{diarys.RKS_M2}</td>
                        <td className="p-2 border">{diarys.RKS_M3}</td>
                        <td className="p-2 border">{diarys.RKS_M4}</td>
                        <td className="p-2 border">{diarys.OTHER_M1}</td>
                        <td className="p-2 border">{diarys.OTHER_M2}</td>
                        <td className="p-2 border">{diarys.OTHER_M3}</td>
                        <td className="p-2 border">{diarys.OTHER_M4}</td>
                        <td className="p-2 border">{diarys.INVESTMENT}</td>
                        <td className="p-2 border">{diarys.SWITCH_IN}</td>
                        <td className="p-2 border">{diarys.REDEMPTION}</td>
                        <td className="p-2 border">{diarys.SWITCH_OUT}</td>
                        <td className="p-2 border">{diarys.DIVIDEND_PAYOUT}</td>
                        <td className="p-2 border">{diarys.NET_INVESTMENT}</td>
                        <td className="p-2 border">{diarys.PURCHASE_VALUE}</td>
                        <td className="p-2 border">{diarys.CURRENT_VALUE}</td>
                        <td className="p-2 border">{diarys.AVG_HOLDING_DAYS}</td>
                        <td className="p-2 border">{diarys.GAIN}</td>
                        <td className="p-2 border">{diarys.ABSOLUTE_RETURN}</td>
                        <td className="p-2 border">{diarys.CAGR}</td>
                        <td className="p-2 border">{diarys.CITY_STATE}</td>
                        <td className="p-2 border">{diarys.FULL_ADDRESS}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>)}
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious className="text-black" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                  </PaginationItem>
                  {renderPagination()}
                  <PaginationItem>
                    <PaginationNext className="text-black" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientDairy;