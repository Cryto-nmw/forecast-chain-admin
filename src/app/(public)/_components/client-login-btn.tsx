"use client";
import { Button } from "@/components/ui-elements/button";
import { UserIcon } from "@/assets/icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Spinner } from "@/assets/animation/animations";

export const RedirectToLogin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRedirect = () => {
    setLoading(true);
    router.push("/auth/sign-in");
  };

  return (
    <>
      {!loading && (
        <Button
          label="Secure Sign In Here!"
          variant="outlinePrimary"
          shape="rounded"
          onClick={handleRedirect}
          icon={<UserIcon />}
        />
      )}

      {loading && <Spinner />}
    </>
  );
};
