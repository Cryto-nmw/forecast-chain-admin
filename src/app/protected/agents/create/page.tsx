"use server";
import { AgentForm } from "../_compoents/AgentForm";
export default async function AgentFormPage() {
  return (
    <>
      {/* <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        Create Agent
        <div className="flex flex-col gap-9"></div>
      </div> */}

      <AgentForm />
    </>
  );
}
