"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { fetchAgent } from "@/utils/db";
import Spinner from "@/assets/animation/loading-101.gif";
import Image from "next/image";

export const AgentStatusIndicator = ({
  agentId,
  state,
}: {
  agentId: number | string;
  state: string;
}) => {
  const [currentState, setCurrentState] = useState(state);
  const [loading, setLoading] = useState(false);

  const fetchAgentStatus = async () => {
    const agentID = Number(agentId);
    setLoading(true);
    try {
      let agent;
      try {
        agent = await fetchAgent(agentID);
        // @ts-ignore
        setCurrentState(agent.state); // assuming API returns { state: "active" }
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
          onClick={fetchAgentStatus}
          className={cn(
            "max-w-fit cursor-pointer select-none rounded-full px-3.5 py-1 text-sm font-medium transition-colors",
            {
              "bg-[#219653]/[0.08] text-[#219653]": currentState === "active",
              "bg-[#D34053]/[0.08] text-[#D34053]": currentState === "inactive",
              "bg-[#FFA70B]/[0.08] text-[#FFA70B]": currentState === "pending",
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
