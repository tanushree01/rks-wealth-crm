import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Card } from "@/Components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";

interface DynamicData {
  [key: string]: any;
}

const LongTermProfile: React.FC = () => {
  const router = useRouter();
  const { PAN } = router.query;

  const [dynamicData, setDynamicData] = useState<DynamicData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady || !PAN) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        // const apiUrl = `http://localhost:5000/api/client/longterm?PAN=${PAN}&page=1&limit=10`;
        const apiUrl = `http://localhost:5000/api/client/longterm?PAN=AQQPK6748P&page=1&limit=10`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const result = await response.json();
        setDynamicData(result?.data ?? []);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router.isReady, PAN]);

  // Define headers based on expected API response
  const headers = dynamicData.length > 0 ? Object.keys(dynamicData[0]) : [];

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
            <Card className="shadow-md rounded-xl overflow-hidden p-0">
              <Table className="w-full">
                <TableHeader className="bg-[#74A82E] text-white">
                  <TableRow>
                    {headers.map((header, index) => (
                      <TableHead
                        key={index}
                        className="py-1 px-5 text-left uppercase text-white"
                      >
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dynamicData.map((entry: DynamicData, index: number) => (
                    <TableRow
                      key={index}
                      className={`transition hover:bg-gray-100 cursor-pointer ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      {headers.map((header, idx) => (
                        <TableCell
                          key={idx}
                          className="py-3 px-5 border-b border-gray-300"
                        >
                          {entry[header]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        </section>
      )}
    </div>
  );
};

export default LongTermProfile;
