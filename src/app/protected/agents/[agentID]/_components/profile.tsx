import { fetchAgent } from "@/utils/db";

export default async function AgentProfilePage({
  params,
}: {
  params: { agentID: number };
}) {
  const agent = await fetchAgent(params.agentID);

  return <></>;
}
