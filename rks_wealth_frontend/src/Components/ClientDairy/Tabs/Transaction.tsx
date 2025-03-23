import React, { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/Components/ui/pagination";
import axios from "axios";
import { Skeleton } from "@/Components/ui/skeleton"
import { useRouter } from "next/router";
import { Card } from "@/Components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components//ui/table";

const Transaction = () => {
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [diaryData, setDiaryData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchColumn, setSearchColumn] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchParams, setSearchParams] = useState<{ [key: string]: string }>(
    {}
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params: any = { page: currentPage, limit: 10, ...searchParams,...router.query };
        delete params.IWELL_CODE
        const response = await axios.get(
          `/api/client/transaction`,
          { params }
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
  }, [currentPage, searchParams]);

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

  const handleSearch = () => {
    if (searchColumn.trim() && searchValue.trim()) {
      setSearchParams({ [searchColumn]: searchValue });
      setCurrentPage(1);
    }
  };

  const handleClearSearch = () => {
    setSearchColumn("");
    setSearchValue("");
    setSearchParams({});
    setCurrentPage(1);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        <main className="p-0 bg-gray-50 dark:bg-gray-900 min-h-screen">
          <div className="flex-1 ps-6 pse-6 pt-2">
            {/* Scrollable Table Container */}
            <div
              className="overflow-x-auto"
              style={{ width: "calc(100vw - 300px)" }}
            >
              <div className="flex flex-wrap items-center gap-4 mb-4 bg-white p-4 rounded-lg shadow-md">
                <select
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                  value={searchColumn}
                  onChange={(e) => setSearchColumn(e.target.value)}
                >
                  <option value="">Select Column</option>
                  {headers.map((header, index) => (
                    <option key={index} value={header}>
                      {header}
                    </option>
                  ))}
                </select>

                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search value..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 pr-10 w-60 focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                  />
                  {searchValue && (
                    <X
                      className="absolute right-3 top-3 cursor-pointer text-gray-500 hover:text-gray-700 transition"
                      size={18}
                      onClick={handleClearSearch}
                    />
                  )}
                </div>

                <Button
                  variant="outline"
                  onClick={handleSearch}
                  className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md hover:shadow-lg hover:opacity-90 transition"
                >
                  <Search />
                  Search
                </Button>
              </div>

              {loading ? (
                <>
                  <Skeleton className="w-full h-10 mb-2" />
                  <Skeleton className="w-full h-10 mb-2" />
                  <Skeleton className="w-full h-10 mb-2" />
                  <Skeleton className="w-full h-10 mb-2" />
                  <Skeleton className="w-full h-10 mb-2" />
                  <Skeleton className="w-full h-10 mb-2" />
                  <Skeleton className="w-full h-10 mb-2" />
                </>
              ) : (
                <div className="overflow-x-auto">
                  <Card className="shadow-md rounded-xl overflow-hidden p-0">
                    <Table className="w-full overflow-hidden">
                      <TableHeader className="bg-[#74A82E] text-white">
                        <TableRow>
                          {headers.map((header, index) => (
                            <TableHead
                              key={index}
                              className="py-1 px-5 text-left uppercase text-white"
                            >
                              {header}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(diaryData || []).length > 0? diaryData.map((entry: any, index: any) => (
                          <TableRow
                            key={index}
                            className={`transition hover:bg-gray-100 cursor-pointer ${
                              index % 2 === 0 ? "bg-gray-50" : "bg-white"
                            }`}
                            // onClick={() => {
                            //   const query = {
                            //     FAMILY_HEAD: entry.FAMILY_HEAD,
                            //     page: 1,
                            //     limit: 10
                            //   };
                            //   router.push({ pathname: "/client/diary", query });
                            // }}
                          >
                            {headers.map((header, idx) => (
                              <TableCell
                                key={idx}
                                className="py-3 px-5 border-b border-gray-300"
                              >
                                {entry[header]}
                              </TableCell>
                            ))}
                          </TableRow>
                        )):<div className="flex justify-center items-center h-[20vh]">No transaction data</div>}
                      </TableBody>
                    </Table>
                  </Card>
                </div>
              )}
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <button
                      className="text-black disabled:opacity-50"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <PaginationPrevious />
                    </button>
                  </PaginationItem>
                  {renderPagination()}
                  <PaginationItem>
                    <button
                      className="text-black disabled:opacity-50"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <PaginationNext />
                    </button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>

            </div>
          </div>
        </main>
    </div>
  );
};

export default Transaction;
