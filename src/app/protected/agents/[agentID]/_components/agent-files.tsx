// Server Component
import { getAgentFiles } from "@/utils/db";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { cn } from "@/lib/utils";

import { AgentActionBtns } from "./agent-action-btns";

type Props = {
  agentId: number;
  className: string;
};

export default async function AgentFilesList({ agentId, className }: Props) {
  const files = await getAgentFiles(agentId);

  if (files.length === 0) {
    return <p className="text-gray-500">No files uploaded yet.</p>;
  }

  return (
    <>
      <div
        className={cn(
          "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
          className,
        )}
      >
        <h2 className="mb-4 text-body-2xlg font-bold text-dark dark:text-white">
          Agent Files
        </h2>

        <Table>
          <TableHeader>
            <TableRow className="border-none uppercase [&>th]:text-center">
              <TableHead className="min-w-[120px] !text-left">
                File Name
              </TableHead>
              <TableHead className="!text-right">Created At</TableHead>
              <TableHead>File Type</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {files.map((file, i) => (
              <TableRow
                className="text-center text-base font-medium text-dark dark:text-white"
                key={i}
              >
                <TableCell className="flex min-w-fit items-center gap-3">
                  <div className="">{file.filename}</div>
                </TableCell>
                <TableCell className="!text-right text-green-light-1">
                  {new Date(file.created_at).toLocaleString()}
                </TableCell>
                <TableCell>
                  {/* File preview / link */}
                  {["png", "jpg"].includes(file.file_type) ? (
                    <img
                      src={file.url}
                      alt={file.filename}
                      className="h-20 w-20 rounded-md object-cover"
                    />
                  ) : (
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View File
                    </a>
                  )}
                </TableCell>
                <TableCell>
                  <AgentActionBtns fileID={file.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
