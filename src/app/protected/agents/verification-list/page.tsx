import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import dayjs from "dayjs";
import { SecretAgentIcon } from "@/assets/icons";
import type { RowDataPacket } from "mysql2";
import AVTFilterForm from "../_compoents/avt-filter-form";
import { AVTStatusIndicator } from "../_compoents/avt-status";

import { SendVerificationBtn } from "../_compoents/send-verification-btn";

import { connectToDB, getAgentPrimaryKey } from "@/utils/db";
import { OVERALL_PAGINATION_PER_PAGE_SIZE } from "@/utils/config";
import Link from "next/link";

const PAGE_SIZE = Number(OVERALL_PAGINATION_PER_PAGE_SIZE);

export type AgentVerificationTokenRow = {
  token_id: number;
  agent_id: number;
  token: string;
  token_status: "PENDING" | "USED" | "REVOKED";
  token_is_used: 0 | 1;
  token_created_at: string; // timestamp string from MySQL
  token_expires_at: string; // timestamp string from MySQL
  token_used_at: string | null;

  agent_name: string | null;
  agent_email: string | null;
  agent_phone: string | null;
  agent_state: "active" | "pending" | "inactive" | null;
  email_verify_status: 0 | 1 | null;
  phone_verify_status: 0 | 1 | null;
  agent_created_at: string | null;
};

export type ListSearchParams = {
  agentName?: string; // optional search by agent name
  state?: "active" | "pending" | "inactive"; // optional filter by state
  startDate?: string; // optional, ISO date string (created_at lower bound)
  endDate?: string; // optional, ISO date string (created_at upper bound)
  page?: number; // for pagination
};

export default async function SendVerificationEmail(props: {
  searchParams: Promise<ListSearchParams>;
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
    avt.id AS token_id,
    avt.agent_id,
    avt.token,
    avt.status AS token_status,
    avt.is_used AS token_is_used,
    avt.created_at AS token_created_at,
    avt.expires_at AS token_expires_at,
    avt.used_at AS token_used_at,
    a.name AS agent_name,
    a.email AS agent_email,
    a.phone AS agent_phone,
    a.state AS agent_state,
    a.email_verify_status,
    a.phone_verify_status,
    a.created_at AS agent_created_at
  FROM agent_verification_tokens avt
  LEFT JOIN agents a
    ON avt.agent_id = a.id
  WHERE 1=1
`;

  // Count query for pagination
  let countSql = `
  SELECT COUNT(*) AS total
  FROM agent_verification_tokens avt
  LEFT JOIN agents a
    ON avt.agent_id = a.id
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
    sql += ` AND avt.created_at >= ?`;
    countSql += ` AND avt.created_at >= ?`;
    values.push(startDate);
    countValue.push(startDate);
  }

  if (endDate) {
    sql += ` AND avt.created_at <= ?`;
    countSql += ` AND avt.created_at <= ?`;
    values.push(endDate);
    countValue.push(endDate);
  }

  if (state) {
    sql += ` AND avt.status = ?`;
    countSql += ` AND avt.status = ?`;
    values.push(state);
    countValue.push(state);
  }

  sql += ` ORDER BY avt.created_at DESC LIMIT ? OFFSET ?`;

  console.log("Executed SQL:", countSql);
  console.log("With values:", countValue);

  values.push(PAGE_SIZE, offset);
  // Get contracts with LIMIT and OFFSET

  const [rows] = await conn.execute<RowDataPacket[]>(`${sql}`, values);

  const data = rows as AgentVerificationTokenRow[];

  // Get total count for pagination
  const [countRows]: any = await conn.execute(`${countSql}`, countValue);
  const total = countRows[0].total;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <>
      <AVTFilterForm />
      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
        <Table>
          <TableHeader>
            <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
              <TableHead className="min-w-[155px] xl:pl-7.5">
                Agent Name
              </TableHead>
              <TableHead>Email</TableHead>
              <TableHead>created at</TableHead>
              <TableHead>State</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.isArray(data) && rows.length > 0 ? (
              data.map((avt) => {
                return (
                  <TableRow
                    key={avt.token_id}
                    className="border-[#eee] dark:border-dark-3"
                  >
                    <TableCell>
                      <h5 className="text-dark dark:text-white">
                        {avt.agent_name}
                      </h5>
                    </TableCell>
                    <TableCell className="min-w-[155px] xl:pl-7.5">
                      <h5 className="text-dark dark:text-white">
                        {avt.agent_email}
                      </h5>
                    </TableCell>

                    <TableCell>
                      <p className="text-dark dark:text-white">
                        {dayjs(avt.token_created_at).format("MMM DD, YYYY")}
                      </p>
                    </TableCell>

                    <TableCell>
                      <AVTStatusIndicator
                        state={avt.token_status}
                        tokenId={avt.token_id}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                  No records found.
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
                href={`/protected/agents/verification-list?page=${pageNumber - 1}&agentName=${agentName}&startDate=${startDate}&endDate=${endDate}`}
                className="rounded border px-3 py-1 hover:bg-gray-100"
              >
                Previous
              </Link>
            )}
            {pageNumber < totalPages && (
              <Link
                href={`/protected/agents/verification-list?page=${pageNumber + 1}&agentName=${agentName}&startDate=${startDate}&endDate=${endDate}`}
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
