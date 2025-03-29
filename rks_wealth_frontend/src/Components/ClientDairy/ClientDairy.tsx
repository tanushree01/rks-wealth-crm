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
} from "lucide-react";
import { Input } from "@/Components/ui/input";
import {
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
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
import DownloadFile from "@/utils/Filedownload";
import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import PageLayout from "../PageLayout/PageLayout";

const ClientDairy = () => {
  const router = useRouter();
  const dispatch = useDispatch();
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

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchData = async () => {
    setLoading(true);
    try {
      const params: any = { page: currentPage, limit: 10, ...searchParams };
      const response = await axios.get(`/api/client/diary`, {
        params, headers: {
          Authorization: `Bearer ${token}`,
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
      setLoading(false)
      setError(err.message);
      if (err.status === 401) {
        dispatch(logout());
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
        router.replace("/login");
      }
    }
  };


  useEffect(() => {
    fetchData();
  }, [currentPage, searchParams, columns]);


  const onDownload = async () => {
    if (token)
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
  const headers = diaryData.length > 0 ? Object.keys(diaryData[0]) : [];

  return (
    <PageLayout
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      allHeaders={allHeaders}
      visibleColumns={visibleColumns}
      handleColumnVisibilityChange={handleColumnVisibilityChange}
      pageName="Client Dairy"
      currentPage={currentPage}
      totalPages={totalPages}
      handlePageChange={handlePageChange}
      renderPagination={renderPagination}
      onDownload={onDownload}
    >
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
                      {(diaryData || []).length > 0 ? sortedData.map((entry: any, index: number) => (
                        <TableRow
                          key={index}
                          className={`transition hover:bg-gray-100 cursor-pointer ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                            }`}
                          onClick={() => {   
                            const query = {
                            IWELL_CODE: entry.IWELL_CODE,
                            page: 1,
                            limit: 10,
                          };
                          router.push({ pathname: "/client/diary", query });}}
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
                      )) : (
                        <TableRow>
                          <TableCell colSpan={headers.length} className="text-center py-4">
                            No data available
                          </TableCell>
                        </TableRow>
                      )}
                      </>)}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default ClientDairy;
