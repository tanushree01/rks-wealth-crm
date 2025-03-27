import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import {
  ChevronDown,
  ChevronUp,
  SortAsc,
  SortDesc,
  FileSpreadsheet,
  Menu,
  SlidersHorizontal,
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
             Top Schemes
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
                                  handleColumnSearchChange(header, e.target.value)
                                }
                                className="mt-2 w-full"
                              />
                            )}
                          </TableHead>
                        ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sortedData.length > 0 ? (
                            sortedData.map((entry: any, index: number) => (
                              <TableRow
                                key={index}
                                className="border-b hover:bg-gray-100"
                              >
                                {displayedHeaders.map((header, idx) => (
                                  <TableCell
                                    key={idx}
                                    className="py-3 px-6"
                                  >
                                    {entry[header]}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={displayedHeaders.length}
                                className="text-center py-4"
                              >
                                No Data Available
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </Card>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <Pagination className="flex justify-center gap-2">
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    
                  >
                    Previous
                  </PaginationPrevious>
                  <PaginationContent>
                    {renderPagination()}
                  </PaginationContent>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </PaginationNext>
                </Pagination>
              </div>
        </div>
      </div>
    </div>
  );
};

export default TopSchemes;

