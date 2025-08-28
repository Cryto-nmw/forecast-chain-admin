"use client";
import type { StaticImageData } from "next/image";
import LogoPng from "@/assets/logos/png.png";
import LogoFile from "@/assets/logos/file.png";
import LogoPdf from "@/assets/logos/pdf.png";
import LogoJpg from "@/assets/logos/jpg.png";
import LogoDoc from "@/assets/logos/doc.png";
import { TrashIcon } from "@/assets/icons";
import { Button } from "@/components/ui-elements/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { compactFormat, standardFormat } from "@/lib/format-number";
import { cn } from "@/lib/utils";
import Image from "next/image";

type AllowedFileType = "png" | "jpg" | "doc" | "pdf";
type FileDescriptor = {
  name: string;
  size: number; // KB
  type: StaticImageData | string; // actual imported image object
};

export function FilesList({
  className,
  removeFile,
  files,
}: {
  className?: string;
  removeFile: (index: number) => void;
  files?: File[];
}) {
  let data: FileDescriptor[] = [];
  const fileData: FileDescriptor[] = [];
  files?.map((file, index) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    let logo: StaticImageData = LogoFile;
    if (
      ext === "png" ||
      ext === "jpg" ||
      ext === "doc" ||
      ext === "docx" ||
      ext === "pdf"
    ) {
      if (ext === "jpg") {
        logo = LogoJpg;
      } else if (ext === "doc" || ext === "docx") {
        logo = LogoDoc;
      } else if (ext === "png") {
        logo = LogoPng;
      } else {
        logo = LogoPdf;
      }
    }
    fileData.push({
      name: file.name,
      size: Math.round(file.size / 1024),
      type: logo,
    });
  });

  data = [...data, ...fileData];

  //   {file.name} ({Math.round(file.size / 1024)} KB)

  return (
    <div
      className={cn(
        "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <h2 className="mb-4 text-body-2xlg font-bold text-dark dark:text-white">
        Files List
      </h2>

      <Table>
        <TableHeader>
          <TableRow className="border-none uppercase [&>th]:text-center">
            <TableHead className="min-w-[120px] !text-left">
              File Name
            </TableHead>

            <TableHead className="!text-right">File Size</TableHead>
            <TableHead className="!text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((file, i) => (
            <TableRow
              className="text-center text-base font-medium text-dark dark:text-white"
              key={file.name + i}
            >
              <TableCell className="flex min-w-fit items-center gap-3">
                <Image
                  src={file.type}
                  className="size-8 rounded-full object-cover"
                  width={40}
                  height={40}
                  alt={file.name + " Logo"}
                  role="presentation"
                />
                <div className="">{file.name}</div>
              </TableCell>

              <TableCell className="!text-right text-green-light-1">
                {standardFormat(file.size)}
              </TableCell>
              <TableCell className="!text-right text-green-light-1">
                <Button
                  label="Del"
                  variant="outlinePrimary"
                  shape="full"
                  size="small"
                  onClick={(e) => removeFile(i)}
                  icon={<TrashIcon />}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
