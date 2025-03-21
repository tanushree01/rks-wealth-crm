import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/Components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/Components/ui/table";

// Define the type of the data you expect
interface DynamicData {
  [key: string]: any; // Replace `any` with specific types if known
}

const FoliomasterProfile: React.FC = () => {
  const router = useRouter();
  const { FolioPAN, MintPAN, EMAIL, MOBILE } = router.query;

  // Explicitly type dynamicData as an array of objects
  const [dynamicData, setDynamicData] = useState<DynamicData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (FolioPAN && MintPAN && EMAIL && MOBILE) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await fetch(
            `http://localhost:5000/api/client/foliomaster?FolioPAN=${FolioPAN}&MintPAN=${MintPAN}&EMAIL=${EMAIL}&MOBILE=${MOBILE}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }
          const data = await response.json();
          console.log("API Response:", data);

          // Ensure the response is an array
          if (Array.isArray(data)) {
            setDynamicData(data);
          } else {
            console.error("Unexpected API response format:", data);
            setDynamicData([]); // Fallback to an empty array
          }
        } catch (error: any) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [FolioPAN, MintPAN, EMAIL, MOBILE]);

  // Extract table headers from the first object in the array
  const tableHeaders = dynamicData.length > 0 ? Object.keys(dynamicData[0]) : [];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow rounded-lg p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Dashboard</h1>
        <div>
          <span className="text-gray-500">Welcome, || "User"!</span>
        </div>
      </header>

      {loading ? (
        <p className="text-center text-gray-600 mt-6">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600 mt-6">Error: {error}</p>
      ) : dynamicData.length == 0 ? (
        <p className="text-center text-gray-600 mt-6">No data available.</p>
      ) : (
        <>
          {/* Dynamic Data Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {Object.entries(dynamicData[0]).map(([key, value], index) => (
              <Card key={index} className="bg-white shadow rounded-lg p-4">
                <CardContent>
                  <h2 className="text-sm font-medium text-gray-500 mb-1">{key}</h2>
                  <p className="text-base font-semibold">{value}</p>
                </CardContent>
              </Card>
            ))}
          </section>

          {/* Dynamic Investment Table */}
          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Investment Details</h2>
            <div className="overflow-x-auto bg-white shadow rounded-lg">
              <Table>
                <TableHead>
                  <TableRow>
                    {tableHeaders.map((header, index) => (
                      <TableCell key={index} className="font-bold text-gray-700">
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dynamicData.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {tableHeaders.map((header, colIndex) => (
                        <TableCell key={colIndex}>{row[header]}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default FoliomasterProfile;
