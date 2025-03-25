import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/Components/ui/pagination";
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
  renderPagination: any;
}

const PaginationComponent: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  handlePageChange,
  renderPagination,
}) => {
  return (
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
  );
};

export default PaginationComponent;
