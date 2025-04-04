import { useEffect, useState } from "react";
import {
  Menu,
  ArrowLeft,
  SlidersHorizontal,
  UploadCloud,
} from "lucide-react";
import { Button } from "../ui/button";
import { DOWNLOAD_ALLOWED_USER_TYPES } from "@/Constraints/constraints";

interface ComponentsHeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  allHeaders: string[];
  visibleColumns: string[];
  handleColumnVisibilityChange: (header: string) => void;
  pageName: any;
  onDownload: any;
}

const ComponentsHeader: React.FC<ComponentsHeaderProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  allHeaders,
  visibleColumns,
  handleColumnVisibilityChange,
  pageName,
  onDownload,
}) => {
  const [manageColumnsOpen, setManageColumnsOpen] = useState(false);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      const parsedData = JSON.parse(storedUser);
      setUser(parsedData.user);
    }
  }, []);

  return (
    <div className="bg-[#f7f7f7] p-4 px-6 flex justify-between items-center shadow-md text-[#34466e]">
      {/* Sidebar Toggle Button */}
      <Button
        onClick={() => setIsSidebarOpen((prev) => !prev)}
        variant="outline"
        className="bg-[#f7f7f7] text-[#9bae58] shadow-lg rounded-none"
      >
        {isSidebarOpen ? (
          <ArrowLeft style={{ width: "20px", height: "40px" }} />
        ) : (
          <Menu style={{ width: "20px", height: "40px" }} />
        )}
      </Button>

      {/* Page Title */}
      <h3 className="text-xl font-bold text-center flex-1">{pageName}</h3>

      <div className="flex items-center gap-3">
        {/* Filter/Column Visibility */}
        <div className="relative">
          <button
            onClick={() => setManageColumnsOpen(!manageColumnsOpen)}
            className="p-2 rounded-md hover:bg-gray-200"
          >
            <SlidersHorizontal size={23} className="text-[#34466e]" />
          </button>

          {manageColumnsOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <ul className="p-2 max-h-[250px] overflow-y-auto">
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
                        className={`w-4 h-4 flex items-center justify-center border-2 rounded-sm bg-white ${
                          visibleColumns.includes(header)
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

        {/* XLS Download Icon Only */}
        {DOWNLOAD_ALLOWED_USER_TYPES.includes(user?.userType) && (
          <button
            onClick={onDownload}
            title="Download XLS"
            className="p-0 m-0 border-none bg-transparent hover:opacity-80"
            style={{ outline: "none" }}
          >
            <img
              src="/xls-download.svg"
              alt="Download XLS"
              className="w-15 h-15 object-contain"
            />
          </button>
        )}

        {/* Upload Button */}
        <label className="cursor-pointer">
          <input
            type="file"
            accept=".xlsx,.csv"
            className="hidden"
            onChange={(e) =>
              console.log("Selected file:", e.target.files?.[0])
            }
          />
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-md border group transition-all duration-300"
            style={{
              backgroundColor: "#dbdbdb",
              color: "#34466e",
              borderColor: "#959595",
              borderWidth: "1px",
              borderStyle: "solid",
            }}
          >
            <span className="text-sm font-medium group-hover:text-white transition-all duration-300">
              Upload
            </span>
            <UploadCloud
              size={18}
              className="group-hover:text-white transition-all duration-300"
            />
          </div>
          <style jsx>{`
            label:hover div {
              background-color: #9bae58 !important;
              color: white !important;
            }
            label:hover div span {
              color: white !important;
            }
            label:hover div svg {
              color: white !important;
            }
          `}</style>
        </label>
      </div>
    </div>
  );
};

export default ComponentsHeader;
