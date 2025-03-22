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
          const result = await response.json();
          if (result?.data && Array.isArray(result.data)) {
            setDynamicData(result.data);
          } else {
            setDynamicData([]);
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

  const tableHeaders =
    dynamicData.length > 0 ? Object.keys(dynamicData[0]) : [];

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
        <>
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {Object.entries(dynamicData[0]).map(([key, value], index) => (
              <Card
                key={index}
                className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105 hover:shadow-xl"
              >
                <CardContent>
                  <h2 className="text-sm font-medium text-gray-500 uppercase">
                    {key}
                  </h2>
                  <p className="text-lg font-semibold text-gray-800 mt-2">
                    {value}
                  </p>
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Investment Details
            </h2>
            <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
              <Table>
                <TableHead>
                  <TableRow className="bg-gray-100">
                    {tableHeaders.map((header, index) => (
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
                      {tableHeaders.map((header, colIndex) => (
                        <TableCell key={colIndex} className="p-3">
                          {row[header]}
                        </TableCell>
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
