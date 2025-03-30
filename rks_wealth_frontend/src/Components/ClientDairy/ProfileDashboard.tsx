import { ArrowLeft, User } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "../ui/button";
import ProfileModal from "./Modal/ProfileModal";
import { url } from "inspector";
import { toast } from "react-toastify";
import { Skeleton } from "../ui/skeleton";

const ProfileDashboard = () => {
  const router = useRouter();
  const {
    data,
    IWELL_CODE,
    PAN,
    page = "1",
    limit = "100",
  } = useMemo(() => router.query, [router.query]);

  const [dynamicData, setDynamicData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    url: "",
    title: "",
    condition:{},
    onRowClick:(row?:any) => {},
  })
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!IWELL_CODE) return;

    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/client/diary/one?IWELL_CODE=${IWELL_CODE}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch data");

        const result = await response.json();
        if (isMounted) {
          setDynamicData(result || null);
          setLoading(false);
        }
      } catch (error: any) {
        if (isMounted) setError(error.message);
        toast.error(error.response?.data?.message || "An error occurred.");
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [IWELL_CODE, page, limit]);

  let userData;
  try {
    userData = data ? JSON.parse(decodeURIComponent(data as string)) : {};
  } catch (e) {
    userData = {};
  }


  function LoadingSkeleton() {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-50 w-full" />
          <Skeleton className="h-50 w-full" />
          <Skeleton className="h-50 w-full" />
          <Skeleton className="h-50 w-full" />
          <Skeleton className="h-50 w-full" />
          <Skeleton className="h-50 w-full" />
        </div>
      </div>
    );
  }

  if (!dynamicData) {
    return <LoadingSkeleton />;
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
              {
                label: "BIRTHDAY DOB",
                value: dynamicData?.DATE_OF_BIRTH,
                isInput: "date",
              },
              { label: "PAN", value: dynamicData?.PAN },
              {
                label: "KYC STATUS",
                value: dynamicData?.KYC_STATUS || "",
                // isInput: "text",
              },
              { label: "RM", value: dynamicData?.RM },
              { label: "SUB BROKER", value: dynamicData?.SUB_BROKER || "N/A" },
              { label: "SRM", value: dynamicData?.SRM || "N/A" },
              { label: "REFERRED BY", value: dynamicData?.REFERRED_BY },
            ].map((item, index) => (
              <div key={index} className="flex text-black">
                <span className="font-semibold text-[#34466e] min-w-[160px]">
                  {item.label} :
                </span>
                {item.isInput ? (
                  <input
                    type={item.isInput}
                    className="ml-2 border border-gray-300 px-2 py-1 rounded"
                    value={item.value || ""}
                    disabled
                    onChange={(e) =>
                      console.log(`${item.label} changed:`, e.target.value)
                    }
                  />
                ) : (
                  <span className="ml-2">{item.value || "N/A"}</span>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="w-full md:w-2/3 mt-7">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "FAMILY HEAD", value: dynamicData?.FAMILY_HEAD },
              { title: "FAMILY AUM", value: "N/A" },
              { title: "FAMILY SIP", value: "N/A" },
              { title: "FAMILY LAST 365 DAYS", value: "N/A" },
              { title: "AUM RKS", value: dynamicData?.RKS_AUM },
              { title: "AUM TOTAL", value: dynamicData?.IW_AUM },
              { title: "EXTRA AUM", value: dynamicData?.EXTRA_AUM },
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
                heading: ["SIP RKS"],
                data: [
                  { label: "RKS M1", value: dynamicData?.RKS_M1 },
                  { label: "RKS M2", value: dynamicData?.RKS_M2 },
                  { label: "RKS M3", value: dynamicData?.RKS_M3 },
                  { label: "RKS M4", value: dynamicData?.RKS_M4 },
                ],
              },
              {
                heading: ["SIP OTHERS"],
                data: [
                  { label: "OTHERS M1", value: dynamicData?.OTHER_M1 },
                  { label: "OTHERS M2", value: dynamicData?.OTHER_M2 },
                  { label: "OTHERS M3", value: dynamicData?.OTHER_M3 },
                  { label: "OTHERS M4", value: dynamicData?.OTHER_M4 },
                ],
              },
            ].map((card, index) => (
              <Card key={index} className="border p-1 rounded-none">
                <div className="flex justify-between font-semibold text-[#9bae58] border-b px-5 pb-1 text-center">
                  <span>{card.heading[0]}</span>
                </div>
                <CardContent className="text-sm p-0">
                  {card.data.map((item, idx) => (
                    <div key={idx} className="flex justify-between px-5 py-1">
                      <span className="text-black-500">{item.label}</span>
                      <span className="font-medium text-gray-700">
                        {item.value || "N/A"}
                      </span>
                    </div>
                  ))}
                </CardContent>

                <div className="bg-gray-200 p-2 text-lg font-semibold rounded-xl text-gray-800 text-center">
                  SIP STATUS -{" "}
                  {card.heading[0] === "SIP RKS"
                    ? dynamicData?.SIP_STATUS
                    : dynamicData?.OTHER_SIP_STATUS}
                </div>
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
                    label: "PURCHASE",
                    value: dynamicData?.PURCHASE_VALUE,
                  },
                  { label: "SWITCH IN", value: dynamicData?.SWITCH_IN },
                  { label: "SWITCH OUT", value: dynamicData?.SWITCH_OUT },
                  {
                    label: "DIVIDENT PAYOUT",
                    value: dynamicData?.DIVIDENT_PAYOUT,
                  },
                  {
                    label: "NET SWITCH",
                    value: dynamicData?.NET_SWITCH,
                  },
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
                  { label: "GAIN", value: dynamicData?.GAIN },
                  { label: "ABS. RETURN", value: dynamicData?.ABSOLUTE_RETURN },
                  { label: "CAGR", value: dynamicData?.CAGR },
                  {
                    label: "AVG HOLDING DAY",
                    value: dynamicData?.AVG_HOLDING_DAYS,
                  },
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
            {[
              {
                title: "FOLIO MASTER",
                condition: {IWELL_CODE: IWELL_CODE},
                url:"foliomaster",
                onRowClick: (row:any) => {
                  setModalOpen(true)
                  setModalConfig({url:"transaction", title:`FOLIO NO. ${row?.FOLIO_NO} TR. 90 DAYS`, condition:{FOLIO_NO: row.FOLIO_NO},onRowClick:() => {}})
                } 
              },{
                title: "LONG TERM",
                condition: {IWELL_CODE: IWELL_CODE},
                url:"longterm",
                onRowClick: () => {} 
              },{
                title: "TR. 90 DAYS",
                condition: {IWELL_CODE: IWELL_CODE},
                url:"transaction",
                onRowClick: () => {} 
              },
            ].map((config, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full p-7 bg-gray-100"
                onClick={() => {
                  setModalOpen(true)
                  setModalConfig(config)
                }}
              >
                {config?.title}
              </Button>
            ))}
          </div>
          <ProfileModal onRowClick={modalConfig.onRowClick} open={isModalOpen} setOpen={setModalOpen} title={modalConfig.title} condition={modalConfig.condition}  url={modalConfig.url}/>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
