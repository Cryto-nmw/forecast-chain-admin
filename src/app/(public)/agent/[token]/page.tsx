import { verifyAgentToken } from "@/utils/verify-agent-token";

export default async function AgentVerificationPage(props: {
  params: Promise<{ token: string }>;
}) {
  const params = await props.params;
  const result = await verifyAgentToken(params.token);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="max-w-md rounded-xl p-6 text-center shadow-lg">
        <h1 className="mb-4 text-2xl font-bold">
          {result.success
            ? "✅ Verification Successful"
            : "❌ Verification Failed"}
        </h1>
        <p className="text-gray-700">{result.message}</p>
      </div>
    </div>
  );
}
