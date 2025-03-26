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
//   const {
//     data,
//     PAN,
//     FAMILY_HEAD,
//     page = "1",
//     limit = "100",
//   } = useMemo(() => router.query, [router.query]);

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
import { Button } from "../ui/button";

export default function ClientDetails() {
  return (
    <div className="w-full bg-white  shadow-lg p-0 h-screen overflow-auto">
      {/* Header */}
      <div className="flex items-center bg-[#34466e] text-white p-4">
        {/* Back Arrow */}
        <ArrowLeft className="cursor-pointer" />

        {/* Client Name - Centered */}
        <h2 className="text-xl font-semibold flex-grow text-center">
          CLIENT NAME
        </h2>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-6 p-4">
        {/* Left Section */}
        <div className="w-full md:w-1/3">
          <div className="flex items-center p-4 border rounded-lg">
            {/* User Icon */}
            <div className="w-20 h-20 flex items-center justify-center bg-gray-300 rounded-full mr-4">
              <User className="w-10 h-10 text-gray-600" />
            </div>

            {/* Client Details */}
            <div>
              <h3 className="font-semibold">CLIENT NAME</h3>
              <p>+91-7208947912</p>
              <p>laosnkanin@gmail.com</p>
            </div>
          </div>

          <div className="mt-4 text-sm font-medium space-y-2">
            {[
              { label: "AGE", value: "XYZ" },
              { label: "KYC DOB", value: "XYZ" },
              { label: "BIRTHDAY DOB", value: "XYZ" },
              { label: "PAN", value: "XYZ" },
              { label: "KYC STATUS", value: "XYZ" },
              { label: "RM", value: "XYZ" },
              { label: "SUB BROKER", value: "XYZ" },
              { label: "SRM", value: "XYZ" },
              { label: "REFERRED BY", value: "XYZ" },
            ].map((item, index) => (
              <div key={index} className="text-gray-600">
                <span className="font-semibold">{item.label}:</span>{" "}
                {item.value}
              </div>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-2/3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "FAMILY HEAD", value: "XYZ" },
              { title: "FAMILY AUM", value: "XYZ" },
              { title: "FAMILY SIP", value: "XYZ" },
              { title: "FAMILY LAST 365 DAYS", value: "XYZ" },
              { title: "AUM RKS", value: "XYZ" },
              { title: "AUM TOTAL", value: "XYZ" },
              { title: "EXTRA AUM", value: "XYZ" },
            ].map((item, index) => (
              <div key={index} className="text-sm font-medium text-green-600">
                {item.title}: <span className="text-black">{item.value}</span>
              </div>
            ))}
          </div>

          {/* SIP Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {[
              {
                title: "SIP RKS",
                data: [
                  { label: "RKS M1", value: "XYZ" },
                  { label: "RKS M2", value: "XYZ" },
                  { label: "RKS M3", value: "XYZ" },
                  { label: "RKS M4", value: "XYZ" },
                ],
              },
              {
                title: "SIP OTHERS",
                data: [
                  { label: "OTHERS M1", value: "XYZ" },
                  { label: "OTHERS M2", value: "XYZ" },
                  { label: "OTHERS M3", value: "XYZ" },
                  { label: "OTHERS M4", value: "XYZ" },
                ],
              },
            ].map((card, index) => (
              <Card key={index} className="border p-4">
                {/* Header row with SIP category and SIP STATUS */}
                <div className="flex justify-between font-semibold text-gray-600 mb-1">
                  <span>{card.title}</span>
                  <span>SIP STATUS</span>
                </div>
                <CardContent className="mt-2 text-sm">
                  {card.data.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{item.label}</span>
                      <span className="font-medium text-gray-700">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Financial Data Sections */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {[
              {
                title: "CASH FLOW 365 DAYS",
                data: [
                  { label: "NET INVESTMENT", value: "XYZ" },
                  { label: "REDEMPTION", value: "XYZ" },
                  { label: "PURCHASE VALUE", value: "XYZ" },
                  { label: "SWITCH IN", value: "XYZ" },
                  { label: "SWITCH OUT", value: "XYZ" },
                  { label: "NET SWITCH", value: "XYZ" },
                ],
              },
              {
                title: "CURRENT PORTFOLIO",
                data: [
                  { label: "PURCHASE VALUE", value: "XYZ" },
                  { label: "CURRENT VALUE", value: "XYZ" },
                  { label: "AVG. HOLDING DAY", value: "XYZ" },
                  { label: "CAGR", value: "XYZ" },
                  { label: "ABS. RETURN", value: "XYZ" },
                ],
              },
              {
                title: "ASSET ALLOCATION",
                data: [
                  { label: "EQUITY", value: "XYZ" },
                  { label: "EQUITY %", value: "XYZ" },
                  { label: "HYBRID", value: "XYZ" },
                  { label: "HYBRID %", value: "XYZ" },
                  { label: "DEBT", value: "XYZ" },
                  { label: "DEBT %", value: "XYZ" },
                ],
              },
            ].map((card, index) => (
              <Card key={index} className="border p-4">
                <h3 className="font-semibold text-green-600">{card.title}</h3>
                <CardContent className="mt-2 text-sm">
                  {card.data.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{item.label}</span>
                      <span className="font-medium text-gray-700">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Buttons aligned below the right section */}
          <div className="flex justify-center md:justify-start gap-4 mt-4">
            <Button variant="outline">FOLIO MASTER</Button>
            <Button variant="outline">TR. 90 DAYS</Button>
            <Button variant="outline">LONG TERM</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
