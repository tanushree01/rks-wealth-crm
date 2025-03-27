"use client";

import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import {
  Menu,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  SortAsc,
  SortDesc,
  FileSpreadsheet,
  Settings,
  SlidersHorizontal,
  Download,
} from "lucide-react";
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
import { Skeleton } from "@/Components/ui/skeleton";
import { useRouter } from "next/router";
import { Card } from "@/Components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import Header from "../Header/Header";
import PaginationComponent from "../PaginationComponent/PaginationComponent";
import DownloadFile from "@/utils/Filedownload";

const ClientDairy = () => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [diaryData, setDiaryData] = useState<any[]>([]);
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
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params: any = { page: currentPage, limit: 10, ...searchParams };
        const response = await axios.get(`/api/client/diary`, {
          params, headers: {
            Authorization: `Bearer ${token}`, // Adding the token
          },
        });
        const data = response.data?.data || [];
        setDiaryData(data);
        setTotalPages(response.data?.totalPages || 1);
        setLoading(false);
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
  }, [currentPage, searchParams, columns]);


  const onDownload = async () => {
    if(token)
    DownloadFile(`/api/client/diary/download`, token, searchParams);
   }

  const allHeaders =
    columns.length > 0
      ? columns
      : diaryData.length > 0
        ? Object.keys(diaryData[0])
        : [];
  const displayedHeaders = allHeaders.filter((header) =>
    visibleColumns.includes(header)
  );

  const filteredData = diaryData.filter((entry: any) =>
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
    <div className="h-screen flex flex-col bg-[#f7f7f7]">
      {/* Full-width Header */}
      <Header />
      <div className="flex flex-1">
        {/* Sidebar (Fixed Width) */}
        {isSidebarOpen && (
          <div className="w-64 bg-[#34466e] text-white">
            <Sidebar isSidebarOpen={isSidebarOpen} />
          </div>
        )}
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
              Client Dairy
            </h3>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Button
                  variant="outline"
                  onClick={() => setManageColumnsOpen(!manageColumnsOpen)}
                >
                  <SlidersHorizontal size={20} className="text-gray-600" />
                </Button>
                {manageColumnsOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <h3 className="text-l font-bold text-center bg-gray-50 rounded-lg border border-gray-300 p-3 m-4 text-[#34466e]">
                      Manage Columns
                    </h3>
                    <ul className="p-2 bg-white shadow-lg rounded-md border border-gray-200 max-h-[250px] overflow-y-auto">
                      {allHeaders.map((header, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-3 p-2 hover:bg-gray-200 rounded-md transition duration-200"
                        >
                          <input
                            type="checkbox"
                            id={`${header}_column`}
                            checked={visibleColumns.includes(header)}
                            onChange={() =>
                              handleColumnVisibilityChange(header)
                            }
                            className="hidden"
                          />
                          <label
                            htmlFor={`${header}_column`}
                            className="flex items-center gap-3 cursor-pointer"
                          >
                            {/* Custom Checkbox */}
                            <div
                              className={`w-4 h-4 flex items-center justify-center border-2 rounded-sm bg-white ${visibleColumns.includes(header)
                                ? "border-[#9bae58]"
                                : "border-gray-400"
                                }`}
                            >
                              {visibleColumns.includes(header) && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3.5 w-3.5 text-[#9bae58]"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span className="text-gray-700 text-sm font-medium">
                              {header}
                            </span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <Button variant="outline" className="p-2" onClick={onDownload}>
                <FileSpreadsheet size={20} className="text-gray-600" />
              </Button>
            </div>
          </div>

          <main className="p-0 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div
              className="flex-1 p-6"
              style={{
                width: isSidebarOpen
                  ? "calc(100vw - 300px)"
                  : "calc(100vw - 40px)",
              }}
            >
              <div className="overflow-x-auto">
                <Card className="shadow-lg rounded-2xl overflow-hidden border border-gray-200">
                  <Table className="w-full">
                    <TableHeader className="bg-[#9bae58] text-white">
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
                      {loading
                        ? Array.from({ length: 5 }).map((_, index) => (
                          <TableRow key={index}>
                            {displayedHeaders.map((_, idx) => (
                              <TableCell key={idx}>
                                <Skeleton className="w-full h-10 mb-2" />
                              </TableCell>
                            ))}
                          </TableRow>
                        )) : (
                          <>
                            {sortedData.map((entry: any, index: number) => (
                              <TableRow
                                key={index}
                                className={`transition hover:bg-gray-100 cursor-pointer ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                  }`}
                                onClick={() => {
                                  const query = {
                                    PAN: entry.PAN,
                                    FAMILY_HEAD: entry.FAMILY_HEAD,
                                    IWELL_CODE: entry.IWELL_CODE,
                                    page: 1,
                                    limit: 10,
                                  };
                                  router.push({ pathname: "/client/diary", query });
                                }}
                              >
                                {displayedHeaders.map((header, idx) => (
                                  <TableCell
                                    key={idx}
                                    className="py-4 px-6 border-b border-gray-200 text-gray-800"
                                  >
                                    {entry[header]}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </>)}
                    </TableBody>
                  </Table>
                </Card>
              </div>

              <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
                renderPagination={renderPagination}
              />
            </div>
          </main>
        </div>
      </div>{" "}
    </div>
  );
};

export default ClientDairy;
