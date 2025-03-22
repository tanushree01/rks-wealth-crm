import { useRouter } from "next/router";
import React, { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/Components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/Components/ui/table";
import TableHeader from "./TabHeader";

interface DynamicData {
  [key: string]: any;
}

const ClientDiaryProfile: React.FC = () => {
  const router = useRouter();

  // Memoize query params to avoid unnecessary renders
  const { FAMILY_HEAD, page = 1, limit = 100 } = useMemo(() => router.query, [router.query]);

  const [dynamicData, setDynamicData] = useState<DynamicData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!FAMILY_HEAD) return;

    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/client/diary?page=${page}&limit=${limit}&FAMILY_HEAD=${encodeURIComponent(
            FAMILY_HEAD as string
          )}`
        );

        if (!response.ok) throw new Error("Failed to fetch data");

        const result = await response.json();

        if (isMounted) {
          setDynamicData(Array.isArray(result?.data) ? result.data : []);
          setLoading(false);
        }
      } catch (error: any) {
        if (isMounted) setError(error.message);
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Cleanup function
    };
  }, [FAMILY_HEAD, page, limit]);

  const tableHeaders = dynamicData.length > 0 ? Object.keys(dynamicData[0]) : [];

  return (
    <div className="p-6 bg-gradient-to-r from-[#d4e8c7] to-[#c5d4e0] min-h-screen">
      <header className="bg-gradient-to-r from-green-500 to-blue-500 shadow-lg rounded-lg p-6 flex justify-between items-center mb-6 text-white">
        <h1 className="text-3xl font-bold">Client Diary</h1>
      </header>

      {loading ? (
        <p className="text-center text-gray-700 text-lg animate-pulse">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600 text-lg">Error: {error}</p>
      ) : dynamicData.length === 0 ? (
        <p className="text-center text-gray-700 text-lg">No data available.</p>
      ) : (
        <>
          <section className="mt-6">
            <Card className="bg-white shadow-xl rounded-lg p-6 border-l-4 border-blue-500">
              <CardContent>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Client Information</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-sm">
                  {Object.entries(dynamicData[0]).map(([key, value], index) => (
                    <div key={index} className="flex flex-col p-2 bg-blue-50 rounded-md">
                      <span className="text-blue-700 font-medium uppercase">{key}:</span>
                      <span className="text-gray-800 truncate font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* <section className="mt-8">
            <TableHeader />
          </section>
           */}
        </>
      )}
    </div>
  );
};

export default ClientDiaryProfile;
