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
import { DownloadIcon, PreviewIcon } from "@/assets/icons2";
import { TrashIcon } from "@/assets/icons";
import { SecretAgentIcon } from "@/assets/icons";
import type { RowDataPacket } from "mysql2";
import ContractFilterForm from "./_components/contract-filter-form";

import { connectToDB, getAgentPrimaryKey } from "@/utils/db";
import { OVERALL_PAGINATION_PER_PAGE_SIZE } from "@/utils/config";
import Link from "next/link";

const PAGE_SIZE = Number(OVERALL_PAGINATION_PER_PAGE_SIZE);

type AgentDeployedContractRow = {
  id: number;
  agent_id: string;
  agent_name: string; // from join with agents table
  agent_pk_id: number; // from join with agents table
  contract_name: string;
  contract_address: string;
  state: "active" | "inactive" | "archived" | "destroyed";
  chain_id: string;
  network_name: string;
  deploy_tx_hash: string;
  deployed_at: string;
  abi_json: string;
  constructor_args_json: string | null;
};

type DeployedContractsSearchParams = {
  agentName?: string; // optional search by agent name
  startDate?: string; // optional, ISO date string
  endDate?: string; // optional, ISO date string
  page?: number; // for pagination
};

export default async function DeployedContractsPage(props: {
  searchParams: Promise<DeployedContractsSearchParams>;
}) {
  const searchParams = await props.searchParams;

  const agentName = searchParams.agentName ?? "";
  const startDate = searchParams.startDate ?? "";
  const endDate = searchParams.endDate ?? "";
  const page = searchParams.page ?? "1";
  const pageNumber = Number(page) ? Number(page) : 0;

  const offset = (pageNumber - 1) * PAGE_SIZE;

  const conn = await connectToDB();

  // base query
  let sql = `
    SELECT adc.id, adc.agent_id, a.name as agent_name, a.id as agent_pk_id, adc.contract_name,
           adc.contract_address, adc.state, adc.chain_id, adc.network_name,
           adc.deploy_tx_hash, adc.deployed_at
    FROM agent_deployed_contracts adc
    JOIN agents a ON adc.agent_id = a.agent_id
    WHERE 1=1
  `;

  let countSql = `SELECT COUNT(*) AS total FROM agent_deployed_contracts adc
    JOIN agents a ON adc.agent_id = a.agent_id
    WHERE 1=1`;

  const values: any[] = [];
  const countValue: any[] = [];

  if (agentName) {
    sql += ` AND a.name LIKE ?`;
    countSql += ` AND a.name LIKE ?`;
    values.push(`%${agentName}%`);
    countValue.push(`%${agentName}%`);
  }

  if (startDate) {
    sql += ` AND adc.deployed_at >= ?`;
    countSql += ` AND adc.deployed_at >= ?`;
    values.push(startDate);
    countValue.push(startDate);
  }

  if (endDate) {
    sql += ` AND adc.deployed_at <= ?`;
    countSql += ` AND adc.deployed_at <= ?`;
    values.push(endDate);
    countValue.push(endDate);
  }

  sql += ` ORDER BY adc.deployed_at DESC LIMIT ? OFFSET ?`;

  values.push(PAGE_SIZE, offset);

  console.log("Executed SQL:", countSql);
  console.log("With values:", countValue);

  // Get contracts with LIMIT and OFFSET
  const [rows] = await conn.execute<RowDataPacket[]>(`${sql}`, values);

  const data = rows as AgentDeployedContractRow[];

  // Get total count for pagination
  const [countRows]: any = await conn.execute(`${countSql}`, countValue);
  const total = countRows[0].total;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <>
      <ContractFilterForm />
      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
        <Table>
          <TableHeader>
            <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
              <TableHead className="min-w-[155px] xl:pl-7.5">
                Agent Name
              </TableHead>
              <TableHead>Ctr.</TableHead>
              <TableHead>Deploy at</TableHead>
              <TableHead>State</TableHead>
              <TableHead className="text-right xl:pr-7.5">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.isArray(data) && rows.length > 0 ? (
              data.map((contract) => {
                return (
                  <TableRow
                    key={contract.id}
                    className="border-[#eee] dark:border-dark-3"
                  >
                    <TableCell>
                      <h5 className="text-dark dark:text-white">
                        {contract.agent_name}
                      </h5>
                    </TableCell>
                    <TableCell className="min-w-[155px] xl:pl-7.5">
                      <h5 className="text-dark dark:text-white">
                        {contract.contract_name}
                      </h5>
                      <p className="mt-[3px] text-body-sm font-medium">
                        <a
                          href={`https://${contract.network_name.toLowerCase()}.etherscan.io/address/${contract.contract_address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {contract.contract_address}
                        </a>
                      </p>
                    </TableCell>

                    <TableCell>
                      <p className="text-dark dark:text-white">
                        {dayjs(contract.deployed_at).format("MMM DD, YYYY")}
                      </p>
                    </TableCell>

                    <TableCell>
                      <div
                        className={cn(
                          "max-w-fit rounded-full px-3.5 py-1 text-sm font-medium",
                          {
                            "bg-[#219653]/[0.08] text-[#219653]":
                              contract.state === "active",
                            "bg-[#D34053]/[0.08] text-[#D34053]":
                              contract.state === "destroyed",
                            "bg-[#FFA70B]/[0.08] text-[#FFA70B]":
                              contract.state === "inactive",
                          },
                        )}
                      >
                        {contract.state}
                      </div>
                    </TableCell>

                    <TableCell className="xl:pr-7.5">
                      <div className="flex items-center justify-end gap-x-3.5">
                        <button className="hover:text-primary">
                          <span className="sr-only">View Agent</span>
                          <Link
                            href={`/protected/agents/${contract.agent_pk_id}`}
                          >
                            <SecretAgentIcon />
                          </Link>
                        </button>

                        {/* <button className="hover:text-primary">
                          <span className="sr-only">Delete Invoice</span>
                          <TrashIcon />
                        </button>

                        <button className="hover:text-primary">
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
                  No deployed contracts found.
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
                href={`/protected/contracts?page=${pageNumber - 1}&agentName=${agentName}&startDate=${startDate}&endDate=${endDate}`}
                className="rounded border px-3 py-1 hover:bg-gray-100"
              >
                Previous
              </Link>
            )}
            {pageNumber < totalPages && (
              <Link
                href={`/protected/contracts?page=${pageNumber + 1}&agentName=${agentName}&startDate=${startDate}&endDate=${endDate}`}
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
