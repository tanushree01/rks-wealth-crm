import PaginationComponent from "@/Components/PaginationComponent/PaginationComponent";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { Dialog, DialogContent, DialogHeader } from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import {
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/Components/ui/pagination";
import { Skeleton } from "@/Components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { DOWNLOAD_ALLOWED_USER_TYPES } from "@/Constraints/constraints";
import DownloadFile from "@/utils/Filedownload";
import axios from "axios";
import { ArrowLeft, ChevronDown, ChevronUp, FileSpreadsheet, Search, SlidersHorizontal, SortAsc, SortDesc, X } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";



const ProfileModal = ({
  open,
  setOpen,
  url,
  onRowClick,
  title,
  condition,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onRowClick: (open: boolean) => void;
  url: string;
  title: string;
  condition: any;
}) => {
  const router = useRouter();

  const [ApiData, setApiData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchParams, setSearchParams] = useState<{ [key: string]: string }>(
    {}
  );
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const [manageColumnsOpen, setManageColumnsOpen] = useState<boolean>(false);

  const [searchToggles, setSearchToggles] = useState<{
    [key: string]: boolean;
  }>({});
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      const parsedData = JSON.parse(storedUser);
      setUser(parsedData.user); // Extract the user object
    }
  }, []);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {

        console.log(condition, "condition")
        const params: any = {
          page: currentPage,
          limit: 10,
          ...condition,
          ...searchParams,
        };
        delete params.IWELL_CODE;

        const response = await axios.get(`/api/client/${url}`, {
          params, headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data?.data || [];
        setApiData(data);
        setApiData(response.data?.data || []);
        setTotalPages(response.data?.totalPages || 1);
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
        setApiData([]);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, searchParams, columns,url, token, condition]);

  const allHeaders =
    columns.length > 0
      ? columns
      : ApiData.length > 0
        ? Object.keys(ApiData[0])
        : [];
  const displayedHeaders = allHeaders.filter((header) =>
    visibleColumns.includes(header)
  );


  const filteredData = ApiData.filter((entry: any) =>
    displayedHeaders.every((header) =>
      searchParams[header]
        ? String(entry[header] || "")
          .toLowerCase()
          .includes(searchParams[header].toLowerCase())
        : true
    )
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const headers = ApiData.length > 0 ? Object.keys(ApiData[0]) : [];


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

  const onDownload = async () => {
    if (token)
      DownloadFile(`/api/client/${url}/download`, token, searchParams);
  }


  const toggleColumnSearch = (header: string) => {
    setSearchToggles((prev) => ({
      ...prev,
      [header]: !prev[header],
    }));
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


  const handleColumnSearchChange = (header: string, value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      [header]: value,
    }));
    setCurrentPage(1);
  };

  const sortedData = useMemo(() => {
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-5xl w-full mx-auto p-6 rounded-2xl shadow-lg bg-white overflow-hidden">
        {/* Header */}
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h2 className="text-xl font-bold text-center flex-1">
              {title}
            </h2>
            <div className="w-6"></div>
          </div>
        </DialogHeader>

        <div className="flex items-center gap-4 justify-end">
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setManageColumnsOpen(pre => !pre)}
            >
              <SlidersHorizontal size={20} className="text-gray-600" />
            </Button>
            {manageColumnsOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-10">
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
                        onChange={() => handleColumnVisibilityChange(header)}
                        className="hidden"
                      />
                      <label
                        htmlFor={`${header}_column`}
                        className="flex items-center gap-3 cursor-pointer"
                      >
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

          {DOWNLOAD_ALLOWED_USER_TYPES.includes(user?.userType) && <Button variant="outline" className="p-2" onClick={onDownload}>
            <FileSpreadsheet size={20} className="text-gray-600" />
          </Button>}
        </div>
        {/* Table */}
        <div className="overflow-auto">
          <Card className="shadow-md">
            <Table>
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
                      {ApiData.length > 0 ? sortedData.map((entry: any, index: number) => (
                        <TableRow
                          key={index}
                          className={`transition hover:bg-gray-100 cursor-pointer ${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                            }`}
                          onClick={() => onRowClick(entry)}
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
                      )}</>)}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Pagination */}
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
          renderPagination={renderPagination}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
