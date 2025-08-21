"use client";
import { useRef, useState, type Ref } from "react";
import { z } from "zod";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { createAgent } from "@/utils/db";

import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { agentFormSchema } from "@/utils/zod";
import { ClientMultipleFilesUploadButton } from "./client-multiple-file-upload";
// import { FilesList } from "./client-files-list";
import { Spinner } from "@/assets/animation/animations";
import { Agent } from "@/types/agent";
import { redirect } from "next/navigation";
import { randomNorthKoreaMobile } from "@/utils/misc";
import { uploadFilesAndSave } from "@/utils/cloudinary";

type FormDataObject = {
  name: FormDataEntryValue | null;
  email: FormDataEntryValue | null;
  description: FormDataEntryValue | null;
  files: File[];
};

export function AgentForm() {
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);

  const [status, setStatus] = useState<string | null>(null);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  // const initialRef: HTMLInputElement | null = null;
  // const inputRef = useRef(initialRef);
  const [files, setFiles] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors(null);
    setStatus(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    let formDataObj: FormDataObject | null = null;

    const newForm = {
      name: formData.get("name"),
      email: formData.get("email"),
      description: formData.get("description"),
      files: files,
    };
    formDataObj = newForm;

    const result = agentFormSchema.safeParse(formDataObj);
    if (!result.success) {
      const tree = z.treeifyError(result.error);

      const fieldErrors: Record<string, string[]> = {};

      if (tree.properties) {
        for (const [key, value] of Object.entries(tree.properties)) {
          fieldErrors[key] = value?.errors ?? [];
        }
      }

      setErrors(fieldErrors);
    } else {
      setShowSpinner(true);
      const name = formData.get("name"); // string | File | null
      const email = formData.get("email"); // string | File | null
      const phone = formData.get("phone"); // string | File | null

      let nameStr: string = "";
      let emailStr: string = "";
      let phoneStr: string = "";

      if (typeof name === "string") {
        nameStr = name;
      }
      if (typeof email === "string") {
        emailStr = email;
      }

      if (typeof phone === "string") {
        phoneStr = phone;
      } else {
        phoneStr = await randomNorthKoreaMobile();
      }
      const agentObject: Agent = await createAgent(nameStr, emailStr, phoneStr);
      if (files.length > 0) {
        await uploadFilesAndSave(files, agentObject.id);
      }

      redirect(`/protected/agents/${agentObject.id}`);
    }

    // Pass FormData to server action
    // const res = await serverFormSubmit(formData);

    // if (!res.success) {
    //   setErrors(res.errors);
    //   return;
    // }

    // setStatus("Form submitted successfully!");
    // form.reset();
  };
  return (
    <ShowcaseSection title="New Agent Form" className="!p-6.5">
      <form onSubmit={handleSubmit}>
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <InputGroup
            label="Name"
            type="text"
            name="name"
            placeholder="Enter agent's name"
            className="w-full xl:w-1/2"
          />
          {errors?.name && (
            <p className="text-sm text-red-500">{errors.name.join(", ")}</p>
          )}
        </div>
        <InputGroup
          label="Email"
          type="email"
          placeholder="Enter your email address"
          className="mb-4.5"
          required
          name="email"
        />
        {errors?.email && (
          <p className="text-sm text-red-500">{errors.email.join(", ")}</p>
        )}
        <TextAreaGroup
          label="Other Information"
          name="description"
          placeholder="Other information"
        />
        {errors?.description && (
          <p className="text-sm text-red-500">
            {errors.description.join(", ")}
          </p>
        )}
        <ClientMultipleFilesUploadButton setFiles={setFiles} files={files} />
        <br />

        {/* <ShowcaseSection title="File upload" className="space-y-5.5 !p-6.5">
          <InputGroup
            type="file"
            fileStyleVariant="style1"
            label="Attach file"
            placeholder="Attach file"
            name="files"
            multiple={true}
          />
        </ShowcaseSection> */}
        <button
          type="submit"
          className="mt-6 flex w-full justify-center rounded-lg bg-primary p-[13px] font-medium text-white hover:bg-opacity-90"
        >
          Create Agent.
          {showSpinner ? <Spinner /> : <></>}
        </button>
      </form>
    </ShowcaseSection>
  );
}
