"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui-elements/button";

import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import InputGroup from "@/components/FormElements/InputGroup";

// import { XIcon, ChevronUpIcon } from "@/assets/icons";

export default function AVTFilterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [agentName, setAgentName] = useState(
    searchParams.get("agentName") || "",
  );

  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const agentNameRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (startDateRef.current?.value) {
      params.set("startDate", startDateRef.current?.value);
    }

    if (endDateRef.current?.value)
      params.set("endDate", endDateRef.current?.value);
    if (agentNameRef.current?.value)
      params.set("agentName", agentNameRef.current?.value);

    router.push(`/protected/agents/verification-list?${params.toString()}`);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
          <div className="flex flex-col gap-9">
            <ShowcaseSection title="Date Range" className="space-y-5.5 !p-6.5">
              <DatePickerOne
                name="StartDate"
                ref={startDateRef}
                label="Start Date"
              />
              <DatePickerOne name="EndDate" ref={endDateRef} label="End Date" />
            </ShowcaseSection>
          </div>
          <div className="flex flex-col gap-9">
            <ShowcaseSection title="Agent Name" className="space-y-5.5 !p-6.5">
              <InputGroup
                label="Agent Name"
                placeholder=""
                type="text"
                ref={agentNameRef}
              />

              <Button label="Search" variant="outlinePrimary" shape="rounded" />
            </ShowcaseSection>
          </div>
        </div>
      </form>
    </>
  );
}
