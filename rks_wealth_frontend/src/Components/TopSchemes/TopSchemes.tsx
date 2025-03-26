import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import {
  ChevronDown,
  ChevronUp,
  SortAsc,
  SortDesc,
  FileSpreadsheet,
} from "lucide-react";import { Button } from "../ui/button";
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
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
   const [searchParams, setSearchParams] = useState<{ [key: string]: string }>(
      {}
    );
    const [searchToggles, setSearchToggles] = useState<{
        [key: string]: boolean;
      }>({});
      const [sortConfig, setSortConfig] = useState<{
        key: string;
        direction: "asc" | "desc";
      } | null>(null);
      const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
    
      const [manageColumnsOpen, setManageColumnsOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params: any = {
          page: currentPage,
          limit: 10,
          orderBy: "SCHEMES",
          order: "ASC",
          ...searchParams
        };

        const response = await axios.get(
          `/api/client/topschemes`,
          { params }
        );
        const data = response.data?.data || [];
        setLoading(false);
        setTopScheme(data);
        setTotalPages(response.data?.totalPages);
        if (data.length) {
          const newHeaders = Object.keys(data[0]);
          if (JSON.stringify(newHeaders) !== JSON.stringify(columns)) {
            setColumns(newHeaders);
            setVisibleColumns(newHeaders);
            const initialToggles = newHeaders.reduce((acc: any, header) => {
              acc[header] = false;
              return acc;
            }, {});
            setSearchToggles(initialToggles);
          }
        }
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage , searchParams, columns])
  const allHeaders =
      columns.length > 0
        ? columns
        : topSchemeData.length > 0
        ? Object.keys(topSchemeData[0])
        : [];
    const displayedHeaders = allHeaders.filter((header) =>
      visibleColumns.includes(header)
    );

  
    const filteredData = topSchemeData.filter((entry: any) =>
      displayedHeaders.every((header) =>
        searchParams[header]
          ? String(entry[header] || "")
              .toLowerCase()
              .includes(searchParams[header].toLowerCase())
          : true
      )
    );
  
    const sortedData = React.useMemo(() => {
      if (sortConfig) {
        const sorted = [...filteredData].sort((a, b) => {
          const aValue = a[sortConfig.key] || "";
          const bValue = b[sortConfig.key] || "";
          if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
          if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
          return 0;
        });
        return sorted;
      }
      return filteredData;
    }, [filteredData, sortConfig]);

    const toggleColumnSearch = (header: string) => {
      setSearchToggles((prev) => ({
        ...prev,
        [header]: !prev[header],
      }));
    };

    const handleColumnSearchChange = (header: string, value: string) => {
      setSearchParams((prev) => ({
        ...prev,
        [header]: value,
      }));
      setCurrentPage(1);
    };
  

    const handleSort = (header: string) => {
      setSortConfig((prev) => {
        if (prev && prev.key === header) {
          if (prev.direction === "asc") return { key: header, direction: "desc" };
          return null;
        }
        return { key: header, direction: "asc" };
      });
    };

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
  const handleColumnVisibilityChange = (header: string) => {
    setVisibleColumns((prev) => {
      if (prev.includes(header)) {
        return prev.filter((col) => col !== header);
      } else {
        return [...prev, header];
      }
    });
  };

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
               <div className="flex flex-wrap items-center justify-between gap-4 mb-4 bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center gap-4"></div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Button
                    variant="outline"
                    onClick={() => setManageColumnsOpen(!manageColumnsOpen)}
                  >
                    Manage Columns
                  </Button>
                  {manageColumnsOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                      <ul className="p-2">
                        {allHeaders.map((header, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded"
                          >
                            <input
                              type="checkbox"
                              id={`${header}_column`}
                              checked={visibleColumns.includes(header)}
                              onChange={() =>
                                handleColumnVisibilityChange(header)
                              }
                            />
                            <label htmlFor={`${header}_column`}>
                              <span>{header}</span>
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <Button variant="outline" className="p-2">
                  <FileSpreadsheet size={20} className="text-gray-600" />
                </Button>
              </div>
            </div>
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
                          <TableRow className="hover:bg-[#74A82E]">
                          {displayedHeaders.map((header, index) => (
                          <TableHead
                            key={index}
                            className="py-3 px-6 text-left uppercase font-semibold text-white"
                          >
                            <div className="flex items-center gap-3">
                              <span>{header}</span>
                              <button
                                onClick={() => toggleColumnSearch(header)}
                                className="text-white opacity-80"
                              >
                                {searchToggles[header] ? (
                                  <ChevronUp size={16} />
                                ) : (
                                  <ChevronDown size={16} />
                                )}
                              </button>
                              <button
                                onClick={() => handleSort(header)}
                                className="text-white opacity-80"
                              >
                                {sortConfig && sortConfig.key === header ? (
                                  sortConfig.direction === "asc" ? (
                                    <SortAsc size={16} />
                                  ) : (
                                    <SortDesc size={16} />
                                  )
                                ) : (
                                  <SortAsc size={16} className="opacity-50" />
                                )}
                              </button>
                            </div>
                            {searchToggles[header] && (
                              <Input
                                type="text"
                                placeholder={`Search ${header}...`}
                                value={searchParams[header] || ""}
                                onChange={(e) =>
                                  handleColumnSearchChange(
                                    header,
                                    e.target.value
                                  )
                                }
                                className="mt-2 w-full px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 shadow-sm"
                              />
                            )}
                          </TableHead>
                        ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sortedData.map((entry: any, index: any) => (
                            <TableRow
                              key={index}
                              className={`transition hover:bg-gray-100 cursor-pointer ${
                                index % 2 === 0 ? "bg-gray-50" : "bg-white"
                              }`}
                            >
                              {allHeaders.map((header, idx) => (
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
    </div>
  );
};

export default TopSchemes;
