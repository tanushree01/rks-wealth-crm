// import React, { useEffect, useMemo, useState } from "react";
// import { useRouter } from "next/router";
// import { Card, CardContent } from "@/Components/ui/card";
// import { Separator } from "@/Components/ui/separator";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/Components/ui/tabs";
// import Transaction from "@/Components/ClientDairy/Tabs/Transaction";
// import Folios from "./Tabs/Folios";
// import Longterm from "./Tabs/Longterm";

// interface DynamicData {
//   [key: string]: any;
// }

// const ProfileDashboard = () => {
//   const router = useRouter();
// const {
//   data,
//   PAN,
//   FAMILY_HEAD,
//   page = "1",
//   limit = "100",
// } = useMemo(() => router.query, [router.query]);

//   const [dynamicData, setDynamicData] = useState<DynamicData | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!FAMILY_HEAD) return;

//     let isMounted = true;

//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(
//           `/api/client/diary/one?PAN=${PAN}&page=${page}&limit=${limit}`
//         );

//         if (!response.ok) throw new Error("Failed to fetch data");

//         const result = await response.json();
//         if (isMounted) {
//           setDynamicData(result || null);
//           setLoading(false);
//         }
//       } catch (error: any) {
//         if (isMounted) setError(error.message);
//       }
//     };

//     fetchData();

//     return () => {
//       isMounted = false;
//     };
//   }, [FAMILY_HEAD, page, limit]);

//   let userData;
//   try {
//     userData = data ? JSON.parse(decodeURIComponent(data as string)) : {};
//   } catch (e) {
//     userData = {};
//   }

//   const mergedData = { ...userData, ...dynamicData };

//   // Filter out null/undefined/empty values
//   const filteredData = Object.entries(mergedData || {}).filter(
//     ([, value]) => value !== null && value !== undefined && value !== ""
//   );

//   return (
//     <div className="w-full min-h-screen p-6">
//       <Card className="w-full p-6">
//         <h2 className="text-3xl font-semibold mb-6 text-left">
//           Welcome {dynamicData?.NAME}
//         </h2>
//         <Separator className="mb-6" />
//         <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           {loading ? (
//             <p className="text-center">Loading...</p>
//           ) : error ? (
//             <p className="text-red-500 text-center">Error: {error}</p>
//           ) : (
//             filteredData.length > 0 &&
//             filteredData.map(([key, value]: any) => (
//               <div key={key} className=" rounded-lg shadow-sm p-2">
//                 <strong className="capitalize block text-gray-700">
//                   {key.replace(/_/g, " ")}:
//                 </strong>
//                 <span className="text-gray-900">{value}</span>
//               </div>
//             ))
//           )}
//         </CardContent>
//       </Card>
//       <Card className="w-full p-6 mt-4">
//         <Tabs defaultValue="foliomaster">
//           <TabsList className="flex justify-center mb-6">
//             <TabsTrigger value="foliomaster">Folio Master</TabsTrigger>
//             <TabsTrigger value="longterm">Long Term</TabsTrigger>
//             <TabsTrigger value="transaction">90 Days Transaction</TabsTrigger>
//           </TabsList>
//           <TabsContent value="foliomaster">
//             <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <Folios isHeader={false} />
//             </CardContent>
//           </TabsContent>
//           <TabsContent value="longterm">
//             <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <Longterm />
//             </CardContent>
//           </TabsContent>
//           <TabsContent value="transaction">
//             <CardContent>
//               <Transaction />
//             </CardContent>
//           </TabsContent>
//         </Tabs>
//       </Card>
//     </div>
//   );
// };

// export default ProfileDashboard;

import { ArrowLeft, User } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "../ui/button";

const ProfileDashboard = () => {
  const router = useRouter();
  const {
    data,
    PAN,
    FAMILY_HEAD,
    page = "1",
    limit = "100",
  } = useMemo(() => router.query, [router.query]);

  const [dynamicData, setDynamicData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!FAMILY_HEAD) return;

    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/client/diary/one?PAN=${PAN}&page=${page}&limit=${limit}`
        );

        if (!response.ok) throw new Error("Failed to fetch data");

        const result = await response.json();
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

  console.log(dynamicData);
  if (!dynamicData) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="w-full bg-white shadow-lg p-0 h-screen overflow-auto">
      <div className="flex items-center bg-[#34466e] text-white p-4">
        <ArrowLeft className="cursor-pointer" onClick={() => router.back()} />
        <h2 className="text-xl font-semibold flex-grow text-center">
          {dynamicData?.NAME?.toUpperCase() || "CLIENT NAME"}
        </h2>
      </div>

      <div className="flex flex-col md:flex-row gap-6 p-1">
        <div className="w-full md:w-1/3 bg-gray-100 p-6">
          <div className="flex items-center p-4 border border-gray-300  bg-white">
            <div className="w-20 h-20 flex items-center justify-center bg-gray-300 rounded-full">
              <User className="w-10 h-10 text-gray-600" />
            </div>
            <div className="h-16 w-px bg-gray-300 mx-4"></div>
            <div>
              <h3 className="text-black font-bold text-lg">
                {dynamicData?.NAME || "CLIENT NAME"}
              </h3>
              <p className="text-black text-base">
                +91-{dynamicData?.MOBILE || "N/A"}
              </p>
              <p className="text-black text-base">
                {dynamicData?.EMAIL || "N/A"}
              </p>
            </div>
          </div>

          <div className="mt-6 text-[16px] font-medium space-y-3">
            {[
              { label: "AGE", value: dynamicData?.AGE },
              { label: "KYC DOB", value: dynamicData?.DATE_OF_BIRTH },
              { label: "BIRTHDAY DOB", value: dynamicData?.DATE_OF_BIRTH },
              { label: "PAN", value: dynamicData?.PAN },
              { label: "KYC STATUS", value: "N/A" },
              { label: "RM", value: dynamicData?.RM },
              { label: "SUB BROKER", value: dynamicData?.SUB_BROKER || "N/A" },
              { label: "SRM", value: dynamicData?.SRM || "N/A" },
              { label: "REFERRED BY", value: dynamicData?.REFERRED_BY },
            ].map((item, index) => (
              <div key={index} className="flex text-black">
                <span className="font-semibold text-[#34466e] min-w-[160px]">
                  {item.label} :
                </span>
                <span className="ml-2">{item.value || "N/A"}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full md:w-2/3 mt-7">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "FAMILY HEAD", value: dynamicData?.FAMILY_HEAD },
              { title: "FAMILY AUM", value: dynamicData?.IW_AUM },
              { title: "FAMILY SIP", value: dynamicData?.SIP_STATUS },
              { title: "FAMILY LAST 365 DAYS", value: dynamicData?.SIP_STATUS },
              { title: "AUM RKS", value: dynamicData?.RKS_AUM },
              { title: "AUM TOTAL", value: dynamicData?.RKS_AUM },
              { title: "EXTRA AUM", value: dynamicData?.RKS_AUM },
            ].map((item, index) => (
              <div key={index} className="text-sm font-medium">
                <p className="text-[#9bae58]">{item.title}</p>
                <p className="text-black">{item.value || "N/A"}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {[
              {
                heading: ["SIP RKS", "SIP STATUS"],
                data: [
                  { label: "RKS M1", value: dynamicData?.RKS_M1 },
                  { label: "RKS M2", value: dynamicData?.RKS_M2 },
                  { label: "RKS M3", value: dynamicData?.RKS_M3 },
                  { label: "RKS M4", value: dynamicData?.RKS_M4 },
                ],
              },
              {
                heading: ["SIP OTHERS", "SIP STATUS"],
                data: [
                  { label: "OTHERS M1", value: dynamicData?.OTHER_M1 },
                  { label: "OTHERS M2", value: dynamicData?.OTHER_M2 },
                  { label: "OTHERS M3", value: dynamicData?.OTHER_M3 },
                  { label: "OTHERS M4", value: dynamicData?.OTHER_M4 },
                ],
              },
            ].map((card, index) => (
              <Card key={index} className="border p-1 rounded-none">
                <div className="flex justify-between font-semibold text-[#9bae58] border-b px-5 pb-1">
                  <span>{card.heading[0]}</span>
                  <span>{card.heading[1]}</span>
                </div>
                <CardContent className="text-sm p-0">
                  {card.data.map((item, idx) => (
                    <div key={idx} className="flex justify-between px-5 py-1">
                      <span>{item.label}</span>
                      <span className="font-medium text-gray-700">
                        {item.value || "N/A"}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {[
              {
                heading: ["CASH FLOW 365 DAYS"],
                data: [
                  {
                    label: "NET INVESTMENT",
                    value: dynamicData?.NET_INVESTMENT,
                  },
                  { label: "REDEMPTION", value: dynamicData?.REDEMPTION },
                  {
                    label: "PURCHASE VALUE",
                    value: dynamicData?.PURCHASE_VALUE,
                  },
                  { label: "SWITCH IN", value: dynamicData?.SWITCH_IN },
                  { label: "SWITCH OUT", value: dynamicData?.SWITCH_OUT },
                  { label: "NET SWITCH", value: dynamicData?.NET_SWITCH },
                ],
              },
              {
                heading: ["CURRENT PORTFOLIO"],
                data: [
                  {
                    label: "PURCHASE VALUE",
                    value: dynamicData?.PURCHASE_VALUE,
                  },
                  { label: "CURRENT VALUE", value: dynamicData?.CURRENT_VALUE },
                  {
                    label: "AVG HOLDING DAY",
                    value: dynamicData?.AVG_HOLDING_DAY,
                  },
                  { label: "CAGR", value: dynamicData?.CAGR },
                  { label: "ABS. RETURN", value: dynamicData?.ABSOLUTE_RETURN },
                ],
              },
              {
                heading: ["ASSET ALLOCATION"],
                data: [
                  { label: "EQUITY", value: dynamicData?.EQUITY },
                  { label: "EQUITY %", value: dynamicData?.EQUITY_PERCENTAGE },
                  { label: "HYBRID", value: dynamicData?.HYBRID },
                  { label: "HYBRID %", value: dynamicData?.HYBRID_PERCENTAGE },
                  { label: "DEBT", value: dynamicData?.DEBT },
                  { label: "DEBT %", value: dynamicData?.DEBT_PERCENTAGE },
                  { label: "CAGR", value: dynamicData?.CAGR },
                  { label: "ABS. RETURN", value: dynamicData?.ABSOLUTE_RETURN },
                ],
              },
            ].map((card, index) => (
              <Card key={index} className="border p-1 rounded-none">
                <div className="flex justify-between font-semibold text-[#9bae58] border-b px-4 pb-1">
                  <span>{card.heading[0]}</span>
                  <span>{card.heading[1]}</span>
                </div>
                <CardContent className="text-sm p-0">
                  {card.data.map((item, idx) => (
                    <div key={idx} className="flex justify-between px-4 py-1">
                      <span>{item.label}</span>
                      <span className="font-medium text-gray-700">
                        {item.value || "N/A"}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-2">
            {["FOLIO MASTER", "TR. 90 DAYS", "LONG TERM"].map((text, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full p-7 bg-gray-100"
              >
                {text}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
