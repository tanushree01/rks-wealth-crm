import React, { ReactNode } from "react";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import ComponentsHeader from "../Header/ComponentHeader";
import PaginationComponent from "../PaginationComponent/PaginationComponent";

interface PageLayoutProps {
  children: ReactNode;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  allHeaders: string[];
  visibleColumns: string[];
  handleColumnVisibilityChange: (header: string) => void;
  pageName: string;
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
  renderPagination: () => any;
  onDownload: any;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  isSidebarOpen,
  setIsSidebarOpen,
  allHeaders,
  visibleColumns,
  handleColumnVisibilityChange,
  pageName,
  currentPage,
  totalPages,
  handlePageChange,
  renderPagination,
  onDownload,
}) => {
  return (
    <div className="h-screen flex flex-col bg-[#f7f7f7]">
      <Header />
      <div className="flex flex-1">
        {isSidebarOpen && (
          <div className="w-64 bg-[#34466e] text-white">
            <Sidebar isSidebarOpen={isSidebarOpen} />
          </div>
        )}
        <div className="flex-1 flex flex-col">
          <ComponentsHeader
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            allHeaders={allHeaders}
            visibleColumns={visibleColumns}
            handleColumnVisibilityChange={handleColumnVisibilityChange}
            pageName={pageName}
            onDownload={onDownload}
          />

          <main className="p-0 bg-gray-50 dark:bg-gray-900 min-h-screen">
            {children}
            <div className="mt-4">
              <PaginationComponent
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
                renderPagination={renderPagination}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
