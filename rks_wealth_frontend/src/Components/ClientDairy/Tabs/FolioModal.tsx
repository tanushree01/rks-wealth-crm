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
import { DialogTitle } from "@radix-ui/react-dialog";
import axios from "axios";
import { ArrowLeft, Search, X } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const FolioModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const router = useRouter();

  const [diaryData, setDiaryData] = useState<any[]>([]);
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
        const params: any = {
          page: currentPage,
          limit: 10,
          ...searchParams,
          ...router.query,
        };
        delete params.IWELL_CODE;
        params.FolioPAN = params.PAN;
        params.MintPAN = params.PAN;
        delete params.PAN;

        const response = await axios.get(`/api/client/foliomaster`, { params });
        setDiaryData(response.data?.data || []);
        setTotalPages(response.data?.totalPages || 1);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, searchParams]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const headers = diaryData.length > 0 ? Object.keys(diaryData[0]) : [];

  const handleSearch = () => {
    if (searchColumn && searchValue) {
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-5xl w-full h-[80vh] mx-auto p-6 rounded-2xl shadow-lg bg-white overflow-hidden">
        {/* Header */}
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h2 className="text-xl font-bold text-center flex-1">
              FOLIO MASTER
            </h2>
            <div className="w-6"></div>
          </div>
        </DialogHeader>

        {/* Search Controls */}
        <div className="flex items-center gap-4 mt-4 mb-4">
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
              className="w-60"
            />
            {searchValue && (
              <X
                className="absolute right-3 top-3 cursor-pointer text-gray-500 hover:text-gray-700 transition"
                size={18}
                onClick={handleClearSearch}
              />
            )}
          </div>

          <Button onClick={handleSearch} className="bg-blue-500 text-white">
            <Search size={18} className="mr-1" />
            Search
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-auto max-h-[calc(100%-150px)]">
          {loading ? (
            <Skeleton className="w-full h-10 mb-2" />
          ) : (
            <Card className="shadow-md">
              <Table>
                <TableHeader className="bg-green-700 text-white">
                  <TableRow>
                    {headers.map((header, index) => (
                      <TableHead key={index} className="py-2 px-4">
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {diaryData.map((entry, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      {headers.map((header) => (
                        <TableCell key={header} className="py-2 px-4">
                          {entry[header]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
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

export default FolioModal;
