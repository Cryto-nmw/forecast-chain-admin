"use client";
import { Button } from "@/components/ui-elements/button";
import { CloseIcon } from "@/assets/icons";
import { Spinner } from "@/assets/animation/animations";
import { deleteAgentFile } from "@/utils/cloudinary";
import { useState, useTransition } from "react";
import { MouseEvent } from "react";
import type { DeleteResponse } from "@/types/agent";

type AgentActionBtnsProps = {
  fileID: number; //
};

export const AgentActionBtns = ({ fileID }: AgentActionBtnsProps) => {
  const [loadingIndicator, setLoadingIncator] = useState(false);
  const [deleteIndicator, setDeleteIndicator] = useState(false);
  // const [isPending, startTransition] = useTransition();
  const handleDelete = async (e: MouseEvent<HTMLButtonElement>) => {
    setLoadingIncator(true);
    const deleteResult: DeleteResponse = await deleteAgentFile(fileID);
    if (deleteResult.success) {
      setDeleteIndicator(true);
    }
    setLoadingIncator(false);
    //
    setTimeout(() => {}, 3000);
    // setLoadingIncator(false);
  };

  return (
    <>
      {!deleteIndicator && (
        <>
          {!loadingIndicator && (
            <Button
              onClick={handleDelete}
              label="del"
              variant="red"
              size="small"
              icon={<CloseIcon />}
            />
          )}

          {loadingIndicator && <Spinner />}
        </>
      )}

      {deleteIndicator && (
        <div className="inline-block rounded-md border border-gray-200 bg-gray-100 px-2 py-1 text-xs text-gray-500 shadow-sm">
          {"File deleted"}
        </div>
      )}
    </>
  );
};
