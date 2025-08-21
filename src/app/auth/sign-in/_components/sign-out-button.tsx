"use server";
import { signOutAdmin } from "@/utils/misc";
import { auth } from "@/auth";
import { Button } from "@/components/ui-elements/button";

export const SignOutAdminBtn = async () => {
  const session = await auth();

  if (!session?.user) {
    return <></>;
  } else {
    return (
      <form action={signOutAdmin}>
        <Button
          label="Sign Out"
          variant="outlinePrimary"
          shape="rounded"
          {...{ type: "submit" }}
        />
      </form>
    );
  }
};
