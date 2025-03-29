import { useEffect, useState } from "react";
import {
  Menu,
  ArrowLeft,
  SlidersHorizontal,
  FileSpreadsheet,
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
      setUser(parsedData.user); // Extract the user object
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

      {/* Portfolio Overview (Centered) */}
      <h3 className="text-xl font-bold text-center flex-1">{pageName}</h3>

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

        {DOWNLOAD_ALLOWED_USER_TYPES.includes(user?.userType) && <Button variant="outline" className="p-2" onClick={onDownload}>
          <FileSpreadsheet size={20} className="text-gray-600" />
        </Button>}
      </div>
    </div>
  );
};

export default ComponentsHeader;
