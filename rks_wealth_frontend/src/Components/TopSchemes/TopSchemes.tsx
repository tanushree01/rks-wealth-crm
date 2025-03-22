import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import { Menu, User } from "lucide-react";
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
} from "../ui/pagination";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Card } from "../ui/card";
import router from "next/router";
import Header from "../Header/Header";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const TopSchemes = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [topSchemeData, setTopScheme] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params: any = {
          page: currentPage,
          limit: 10,
          orderBy: "SCHEMES",
          order: "ASC",
        };

        const response = await axios.get(
          `http://localhost:5000/api/client/topschemes`,
          { params }
        );
        setLoading(false);
        setTopScheme(response.data?.data);
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
  const headers = topSchemeData.length > 0 ? Object.keys(topSchemeData[0]) : [];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <Header setIsSidebarOpen={setIsSidebarOpen} />
        <main className="p-5 bg-gray-50 dark:bg-gray-900 min-h-screen">
          <div className="flex-1">
            <div
              className="overflow-x-auto"
              style={{ width: "calc(100vw - 300px)" }}
            >
              <div className="max-w-screen overflow-x-auto">
                {loading ? (
                  <>
                    <Skeleton className="w-full h-10 mb-2" />
                  </>
                ) : (
                  <div className="w-full h-full overflow-auto">
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
                          {topSchemeData.map((entry: any, index: any) => (
                            <TableRow
                              key={index}
                              className={`transition hover:bg-gray-100 cursor-pointer ${
                                index % 2 === 0 ? "bg-gray-50" : "bg-white"
                              }`}
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
                          ))}
                        </TableBody>
                      </Table>
                    </Card>
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

export default TopSchemes;
