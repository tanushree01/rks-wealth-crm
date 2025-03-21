import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination"; // Import Pagination component
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/router";

const ClientDairy = () => {
  const router = useRouter();

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
          `http://localhost:5000/api/client/diary`
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
          <PaginationLink
            className={currentPage === page ? "" : "text-black"}
            onClick={() => handlePageChange(page)}
            isActive={currentPage === page}
          >
            {page}
          </PaginationLink>
        ) : (
          <PaginationEllipsis />
        )}
      </PaginationItem>
    ));
  };
  const headers = diaryData.length > 0 ? Object.keys(diaryData[0]) : [];

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
            <div
              className="overflow-x-auto"
              style={{ width: "calc(100vw - 300px)" }}
            >
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
                  <div className="w-full h-full overflow-auto">
                    <div className="overflow-x-auto max-h-full">
                      <table className="w-full min-w-max border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-[#74A82E] text-white sticky top-0 z-10">
                            {headers.map((header, index) => (
                              <th
                                key={index}
                                className="py-3 px-5 border-b border-gray-400 text-left uppercase"
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {diaryData.map((entry: any, index: number) => (
                            <tr
                              key={index}
                              className={`text-black ${index % 2 === 0 ? "bg-gray-100" : "bg-white"
                                } hover:bg-gray-200 cursor-pointer transition`}
                              onClick={() => {
                                const query = {
                                  FolioPAN: entry.PAN,
                                  MintPAN: entry.PAN,
                                  EMAIL: entry.EMAIL,
                                  MOBILE: entry.MOBILE,
                                };

                                router.push({
                                  pathname: "/foliomaster", // Adjust this to your dashboard page's path
                                  query,
                                });
                              }}
                            >
                              {headers.map((header, idx) => (
                                <td key={idx} className="py-3 px-5 border-b border-gray-300">
                                  {entry[header]}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      className="text-black"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    />
                  </PaginationItem>
                  {renderPagination()}
                  <PaginationItem>
                    <PaginationNext
                      className="text-black"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    />
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

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const DiaryTable = () => {
//   const [diaryData, setDiaryData] = useState([]);

//   useEffect(() => {
//     axios.get("http://localhost:5000/api/client/diary")
//       .then(response => setDiaryData(response.data.data || []))
//       .catch(error => console.error("Error fetching data:", error));
//   }, []);

//   const headers = diaryData.length > 0 ? Object.keys(diaryData[0]) : [];

//   return (
//     <div className="overflow-x-auto">
//       <table className="min-w-full bg-white border border-gray-300">
//         <thead>
// <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
//   {headers.map((header, index) => (
//     <th key={index} className="py-2 px-4 border-b border-gray-300">{header}</th>
//   ))}
// </tr>
//         </thead>
// <tbody className="text-gray-600 text-sm font-light">
//   {diaryData.map((entry, index) => (
//     <tr key={index} className="border-b border-gray-300 hover:bg-gray-100">
//       {headers.map((header, idx) => (
//         <td key={idx} className="py-2 px-4 border-b border-gray-300">{entry[header]}</td>
//       ))}
//     </tr>
//   ))}
// </tbody>
//       </table>
//     </div>
//   );
// };

// export default DiaryTable;
