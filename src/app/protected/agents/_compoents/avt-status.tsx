"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { fetchAVT } from "@/utils/db";
import Spinner from "@/assets/animation/loading-101.gif";
import Image from "next/image";

export const AVTStatusIndicator = ({
  tokenId,
  state,
}: {
  tokenId: number | string;
  state: string;
}) => {
  const [currentState, setCurrentState] = useState(state);
  const [loading, setLoading] = useState(false);

  const fetchAVTStatus = async () => {
    const tokenID = Number(tokenId);
    setLoading(true);
    try {
      let avt;
      try {
        avt = await fetchAVT(tokenID);
        // @ts-ignore
        setCurrentState(avt.status); // assuming API returns { state: "active" }
      } catch (error) {
        console.error("Error fetching agent:", error);
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error("Error fetching agent status:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!loading && (
        <div
          onClick={fetchAVTStatus}
          className={cn(
            "max-w-fit cursor-pointer select-none rounded-full px-3.5 py-1 text-sm font-medium transition-colors",
            {
              "bg-[#219653]/[0.08] text-[#219653]": currentState === "PENDING",
              "bg-[#D34053]/[0.08] text-[#D34053]": currentState === "REVOKED",
              "bg-[#FFA70B]/[0.08] text-[#FFA70B]": currentState === "USED",
            },
          )}
        >
          {currentState}
        </div>
      )}
      {loading && <Image src={Spinner} height={25} width={25} alt="loading" />}
    </>
  );
};
