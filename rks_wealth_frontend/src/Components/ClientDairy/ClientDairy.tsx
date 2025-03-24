"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import { Menu, Search, X, ChevronDown, ChevronUp, SortAsc, SortDesc } from "lucide-react";
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

const ClientDairy = () => {
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [diaryData, setDiaryData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]); // Persistent state for headers
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Global search params for each column
  const [searchParams, setSearchParams] = useState<{ [key: string]: string }>({});
  // Toggle for showing/hiding column search input
  const [searchToggles, setSearchToggles] = useState<{ [key: string]: boolean }>({});
  // Sorting configuration: which column and direction
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  // List of columns visible in the table
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  // Manage Columns dropdown state
  const [manageColumnsOpen, setManageColumnsOpen] = useState<boolean>(false);

  // Fetch data (and update columns if new headers are returned)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Pass searchParams along with pagination
        const params: any = { page: currentPage, limit: 10, ...searchParams };
        const response = await axios.get(`/api/client/diary`, { params });
        const data = response.data?.data || [];
        setDiaryData(data);
        setTotalPages(response.data?.totalPages || 1);
        setLoading(false);

        // When data is returned (nonempty), update columns if they differ.
        if (data.length) {
          const newHeaders = Object.keys(data[0]);
          if (JSON.stringify(newHeaders) !== JSON.stringify(columns)) {
            setColumns(newHeaders);
            setVisibleColumns(newHeaders);
            // Initialize search toggles for new headers.
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

  // Use saved columns as fallback if diaryData is empty.
  const allHeaders =
    columns.length > 0 ? columns : diaryData.length > 0 ? Object.keys(diaryData[0]) : [];
  const displayedHeaders = allHeaders.filter((header) => visibleColumns.includes(header));

  // Filter data based on searchParams values for each displayed column.
  const filteredData = diaryData.filter((entry: any) =>
    displayedHeaders.every((header) =>
      searchParams[header]
        ? String(entry[header] || "")
            .toLowerCase()
            .includes(searchParams[header].toLowerCase())
        : true
    )
  );

  // Sort data if sortConfig is set.
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

  // Toggle the search input for a specific column.
  const toggleColumnSearch = (header: string) => {
    setSearchToggles((prev) => ({
      ...prev,
      [header]: !prev[header],
    }));
  };

  // Handle per-column search value change.
  const handleColumnSearchChange = (header: string, value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      [header]: value,
    }));
    setCurrentPage(1);
  };

  // Handle sorting toggle for a given column.
  const handleSort = (header: string) => {
    setSortConfig((prev) => {
      if (prev && prev.key === header) {
        // Toggle sort order or remove sorting if already desc.
        if (prev.direction === "asc") return { key: header, direction: "desc" };
        return null; // remove sort if already desc.
      }
      return { key: header, direction: "asc" };
    });
  };

  // Toggle visible columns in Manage Columns.
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
        {/* Top Navbar */}
        <Header setIsSidebarOpen={setIsSidebarOpen} />

        <main className="p-0 bg-gray-50 dark:bg-gray-900 min-h-screen">
          <div className="flex-1 p-6"  style={{ width: "calc(100vw - 300px)" }}>
            {/* Top Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 bg-white p-4 rounded-lg shadow-md">
              <div className="flex items-center gap-4"></div>
              {/* Manage Columns Dropdown */}
              <div className="relative">
                <Button variant="outline" onClick={() => setManageColumnsOpen(!manageColumnsOpen)}>
                  Manage Columns
                </Button>
                {manageColumnsOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <ul className="p-2">
                      {allHeaders.map((header, idx) => (
                        <li key={idx} className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded">
                          <input
                            type="checkbox"
                            id={`${header}_column`}
                            checked={visibleColumns.includes(header)}
                            onChange={() => handleColumnVisibilityChange(header)}
                          />
                          <label htmlFor={`${header}_column`}><span>{header}</span></label>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {loading ? (
              <Skeleton className="w-full h-10 mb-2" />
            ) : (
              <div className="overflow-x-auto">
                <Card className="shadow-md rounded-xl overflow-hidden p-0">
                  <Table className="w-full overflow-hidden">
                    <TableHeader className="bg-[#74A82E] text-white">
                      <TableRow className="hover:bg-[#74A82E]">
                        {displayedHeaders.map((header, index) => (
                          <TableHead key={index} className="py-1 px-5 text-left uppercase text-white relative">
                            <div className="flex items-center gap-2">
                              <span>{header}</span>
                              {/* Toggle search input */}
                              <button onClick={() => toggleColumnSearch(header)}>
                                {searchToggles[header] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </button>
                              {/* Sort button */}
                              <button onClick={() => handleSort(header)}>
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
                            {/* Column search input (toggle visibility) */}
                            {searchToggles[header] && (
                              <Input
                                type="text"
                                placeholder={`Search ${header}...`}
                                value={searchParams[header] || ""}
                                onChange={(e) => handleColumnSearchChange(header, e.target.value)}
                                className="mt-1 px-2 py-1 placeholder-white text-white border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500"
                              />
                            )}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedData.map((entry: any, index: number) => (
                        <TableRow
                          key={index}
                          className={`transition hover:bg-gray-100 cursor-pointer ${
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
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
                            <TableCell key={idx} className="py-3 px-5 border-b border-gray-300">
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
        </main>
      </div>
    </div>
  );
};

export default ClientDairy;
