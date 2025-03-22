import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Transaction from "@/Components/ClientDairy/Tabs/Transaction";
import Folios from "./Tabs/Folios";
import Longterm from "./Tabs/Longterm";

interface DynamicData {
  [key: string]: any;
}

const ProfileDashboard = () => {
  const router = useRouter();
  const { data, FAMILY_HEAD, page = "1", limit = "100" } = useMemo(() => router.query, [router.query]);

  const [dynamicData, setDynamicData] = useState<DynamicData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!FAMILY_HEAD) return;

    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/client/diary/one?PAN=AQQPK6748P&IWELL_CODE=311772238&page=${page}&limit=${limit}`
        );

        if (!response.ok) throw new Error("Failed to fetch data");

        const result = await response.json();
        console.log(result,"result?.data")
        if (isMounted) {
          setDynamicData(result || null);
          setLoading(false);
        }
      } catch (error: any) {
        if (isMounted) setError(error.message);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [FAMILY_HEAD, page, limit]);

  let userData;
  try {
    userData = data ? JSON.parse(decodeURIComponent(data as string)) : {};
  } catch (e) {
    userData = {};
  }

  const mergedData = { ...userData, ...dynamicData };

  // Filter out null/undefined/empty values
  const filteredData = Object.entries(mergedData || {}).filter(
    ([, value]) => value !== null && value !== undefined && value !== ""
  );

  console.log(filteredData,"filteredDatafilteredData")

  return (
    <div className="w-full min-h-screen p-6">
      <Card className="w-full p-6">
        <h2 className="text-3xl font-semibold mb-6 text-left">Welcome {dynamicData?.NAME}</h2>
        <Separator className="mb-6" />
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : error ? (
            <p className="text-red-500 text-center">Error: {error}</p>
          ) : (
            filteredData.length > 0 &&
            filteredData.map(([key, value]) => (
              <div key={key} className=" rounded-lg shadow-sm">
                <strong className="capitalize block text-gray-700">{key.replace(/_/g, " ")}:</strong> 
                <span className="text-gray-900">{value}</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
      <Card className="w-full p-6 mt-4">
      <Tabs defaultValue="foliomaster" >
          <TabsList className="flex justify-center mb-6">
            <TabsTrigger value="foliomaster">Folio Master</TabsTrigger>
            <TabsTrigger value="longterm">Long Term</TabsTrigger>
            <TabsTrigger value="transaction">90 Days Transaction</TabsTrigger>
          </TabsList>
          <TabsContent value="foliomaster" >
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Folios/>
            </CardContent>
          </TabsContent>
          <TabsContent value="longterm">
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Longterm/>
            </CardContent>
          </TabsContent>
          <TabsContent value="transaction">
            <CardContent> 
             <Transaction/>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default ProfileDashboard;
