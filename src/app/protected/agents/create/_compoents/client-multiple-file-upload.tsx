"use client";
import {
  useRef,
  useState,
  type RefObject,
  type Dispatch,
  type SetStateAction,
} from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";

type FileUploadProps = {
  // inputRef: RefObject<HTMLInputElement | null>;
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
};
import { FilesList } from "./client-files-list";
export const ClientMultipleFilesUploadButton = ({
  files,
  setFiles,
}: FileUploadProps) => {
  const inputRef = useRef(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);

    setFiles((prev) => [...prev, ...selectedFiles]);
    // Reset input so user can reselect same file later if needed
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <ShowcaseSection title="File upload" className="space-y-5.5 !p-6.5">
        <InputGroup
          type="file"
          fileStyleVariant="style1"
          label="Attach file"
          placeholder="Attach file"
          name="files"
          multiple={true}
          ref={inputRef}
          handleChange={handleFileChange}
          accept=".doc,.docx,.pdf,.png,.jpg,.jpeg"
        />
        <FilesList removeFile={handleRemoveFile} files={files} />
      </ShowcaseSection>
    </>
  );
};
