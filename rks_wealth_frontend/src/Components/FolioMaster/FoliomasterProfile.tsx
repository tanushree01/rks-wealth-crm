import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/Components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/Components/ui/table";

interface DynamicData {
  [key: string]: any;
}

const FoliomasterProfile: React.FC = () => {
  const router = useRouter();
  const { FolioPAN, MintPAN, EMAIL, MOBILE } = router.query;
  console.log("FolioPAN:", FolioPAN, "MintPAN:", MintPAN);

  const [dynamicData, setDynamicData] = useState<DynamicData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady) {
      console.log("Router is not ready yet");
      return;
    }
    // Ensure router is ready
    if (!FolioPAN || !MintPAN) return; // Ensure necessary params are available

    const fetchData = async () => {
      try {
        setLoading(true);
        const apiUrl = `http://localhost:5000/api/client/foliomaster?FolioPAN=${FolioPAN}&MintPAN=${MintPAN}&page=1&limit=10`;

        console.log("Fetching API:", apiUrl); // Debugging

        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("API Response:", result); // Debugging

        setDynamicData(result?.data ?? []);
      } catch (error: any) {
        console.error("API Error:", error.message); // Debugging
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router.isReady, FolioPAN, MintPAN]);

  return (
    <div className="p-6 bg-gradient-to-r from-blue-100 to-purple-200 min-h-screen">
      <header className="bg-white shadow-lg rounded-xl p-6 flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">User Dashboard</h1>
        <span className="text-gray-600">Welcome, User!</span>
      </header>

      {loading ? (
        <p className="text-center text-gray-600 mt-6 text-lg animate-pulse">
          Loading...
        </p>
      ) : error ? (
        <p className="text-center text-red-600 mt-6 text-lg">Error: {error}</p>
      ) : dynamicData.length === 0 ? (
        <p className="text-center text-gray-600 mt-6 text-lg">
          No data available.
        </p>
      ) : (
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Investment Details
          </h2>
          <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
            <Table>
              <TableHead>
                <TableRow className="bg-gray-100">
                  {Object.keys(dynamicData[0]).map((header, index) => (
                    <TableCell
                      key={index}
                      className="font-bold text-gray-700 p-3"
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {dynamicData.map((row, rowIndex) => (
                  <TableRow key={rowIndex} className="hover:bg-gray-50">
                    {Object.keys(row).map((key, colIndex) => (
                      <TableCell key={colIndex} className="p-3">
                        {row[key]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      )}
    </div>
  );
};

export default FoliomasterProfile;
