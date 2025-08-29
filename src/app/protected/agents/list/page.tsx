import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { SecretAgentIcon } from "@/assets/icons";
import type { RowDataPacket } from "mysql2";
import AgentFilterForm from "../_compoents/agent-filter-form";

import { SendVerificationBtn } from "../_compoents/send-verification-btn";

import { connectToDB, getAgentPrimaryKey } from "@/utils/db";
import { OVERALL_PAGINATION_PER_PAGE_SIZE } from "@/utils/config";
import Link from "next/link";

const PAGE_SIZE = Number(OVERALL_PAGINATION_PER_PAGE_SIZE);

type AgentRow = {
  id: number;
  agent_id: string;
  admin_id: number;
  agent_name: string;
  email: string;
  email_verify_status: 0 | 1;
  phone: string;
  phone_verify_status: 0 | 1;

  state: "active" | "pending" | "inactive";
  created_at: Date;
  updated_at: Date;
};

export type AgentListSearchParams = {
  agentName?: string; // optional search by agent name
  state?: "active" | "pending" | "inactive"; // optional filter by state
  startDate?: string; // optional, ISO date string (created_at lower bound)
  endDate?: string; // optional, ISO date string (created_at upper bound)
  page?: number; // for pagination
};

export default async function DeployedContractsPage(props: {
  searchParams: Promise<AgentListSearchParams>;
}) {
  const searchParams = await props.searchParams;

  const agentName = searchParams.agentName ?? "";
  const startDate = searchParams.startDate ?? "";
  const state = searchParams.state ?? "";
  const endDate = searchParams.endDate ?? "";
  const page = searchParams.page ?? "1";
  const pageNumber = Number(page) ? Number(page) : 0;

  const offset = (pageNumber - 1) * PAGE_SIZE;

  const conn = await connectToDB();

  // base query for agent listing
  let sql = `
  SELECT 
    a.id, 
    a.agent_id, 
    a.name AS agent_name, 
    a.email, 
    a.phone, 
    a.state, 
    a.phone_verify_status, 
    a.email_verify_status,
    a.created_at
  FROM agents a
  WHERE 1=1
`;

  let countSql = `
  SELECT COUNT(*) AS total 
  FROM agents a
  WHERE 1=1
`;

  const values: any[] = [];
  const countValue: any[] = [];

  if (agentName) {
    sql += ` AND a.name LIKE ?`;
    countSql += ` AND a.name LIKE ?`;
    values.push(`%${agentName}%`);
    countValue.push(`%${agentName}%`);
  }

  if (startDate) {
    sql += ` AND created_at >= ?`;
    countSql += ` AND created_at >= ?`;
    values.push(startDate);
    countValue.push(startDate);
  }

  if (endDate) {
    sql += ` AND created_at <= ?`;
    countSql += ` AND created_at <= ?`;
    values.push(endDate);
    countValue.push(endDate);
  }

  if (state) {
    sql += ` AND state = ?`;
    countSql += ` AND state = ?`;
    values.push(state);
    countValue.push(state);
  }

  sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;

  console.log("Executed SQL:", countSql);
  console.log("With values:", countValue);

  values.push(PAGE_SIZE, offset);
  // Get contracts with LIMIT and OFFSET

  const [rows] = await conn.execute<RowDataPacket[]>(`${sql}`, values);

  const data = rows as AgentRow[];

  // Get total count for pagination
  const [countRows]: any = await conn.execute(`${countSql}`, countValue);
  const total = countRows[0].total;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <>
      <AgentFilterForm />
      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
        <Table>
          <TableHeader>
            <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
              <TableHead className="min-w-[155px] xl:pl-7.5">
                Agent Name
              </TableHead>
              <TableHead>HP.</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>created at</TableHead>
              <TableHead>State</TableHead>
              <TableHead className="text-right xl:pr-7.5">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.isArray(data) && rows.length > 0 ? (
              data.map((agent) => {
                return (
                  <TableRow
                    key={agent.id}
                    className="border-[#eee] dark:border-dark-3"
                  >
                    <TableCell>
                      <h5 className="text-dark dark:text-white">
                        {agent.agent_name}
                      </h5>
                    </TableCell>
                    <TableCell>
                      <h5 className="text-dark dark:text-white">
                        {agent.phone}
                      </h5>
                    </TableCell>
                    <TableCell className="min-w-[155px] xl:pl-7.5">
                      <h5 className="text-dark dark:text-white">
                        {agent.email}
                      </h5>
                    </TableCell>

                    <TableCell>
                      <p className="text-dark dark:text-white">
                        {dayjs(agent.created_at).format("MMM DD, YYYY")}
                      </p>
                    </TableCell>

                    <TableCell>
                      <div
                        className={cn(
                          "max-w-fit rounded-full px-3.5 py-1 text-sm font-medium",
                          {
                            "bg-[#219653]/[0.08] text-[#219653]":
                              agent.state === "active",
                            "bg-[#D34053]/[0.08] text-[#D34053]":
                              agent.state === "inactive",
                            "bg-[#FFA70B]/[0.08] text-[#FFA70B]":
                              agent.state === "pending",
                          },
                        )}
                      >
                        {agent.state}
                      </div>
                    </TableCell>

                    <TableCell className="xl:pr-7.5">
                      <div className="flex items-center justify-end gap-x-3.5">
                        <button className="hover:text-primary">
                          <span className="sr-only">View Agent</span>
                          <Link href={`/protected/agents/${agent.id}`}>
                            <SecretAgentIcon />
                          </Link>
                        </button>

                        <SendVerificationBtn agentId={Number(agent.id)} />

                        {/* <button className="hover:text-primary">
                          <span className="sr-only">Download Invoice</span>
                          <DownloadIcon />
                        </button> */}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                  No Agents found.
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
        {/* Pagination controls */}
        <div className="mt-6 flex items-center justify-between">
          <div>
            Page {page} of {totalPages}
          </div>
          <div className="flex gap-2">
            {pageNumber > 1 && (
              <Link
                href={`/protected/agents/list?page=${pageNumber - 1}&agentName=${agentName}&startDate=${startDate}&endDate=${endDate}`}
                className="rounded border px-3 py-1 hover:bg-gray-100"
              >
                Previous
              </Link>
            )}
            {pageNumber < totalPages && (
              <Link
                href={`/protected/agents/list?page=${pageNumber + 1}&agentName=${agentName}&startDate=${startDate}&endDate=${endDate}`}
                className="rounded border px-3 py-1 hover:bg-gray-100"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
