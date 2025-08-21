"use client";
import { PasswordIcon, UserIcon } from "@/assets/icons";
import Link from "next/link";
import React, { useState } from "react";
import InputGroup from "../FormElements/InputGroup";
import { Checkbox } from "../FormElements/checkbox";
import { signIn } from "next-auth/react";
import { signInSchema } from "@/utils/zod";
import { Alert } from "@/components/ui-elements/alert";
import { useSearchParams } from "next/navigation";
import { Spinner } from "@/assets/animation/animations";

type ToValidateFormData = {
  username: string;
  password: string;
};

export default function SigninWithPassword() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error"); // error query from NextAuth
  const [loading, setLoading] = useState(false);

  const [formErrors, setFormErrors] = useState<
    Partial<ToValidateFormData> & { general?: string }
  >({});

  const credentialsAction = async (formData: FormData) => {
    // Validate with Zod
    console.log(`execute credential login`);

    const result = signInSchema.safeParse(
      Object.fromEntries(formData.entries()),
    );

    if (!result.success) {
      // Collect errors keyed by field name
      const fieldErrors: Partial<ToValidateFormData> = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];
        if (typeof fieldName === "string") {
          fieldErrors[fieldName as keyof ToValidateFormData] = issue.message;
        }
      });
      setFormErrors(fieldErrors);
      setLoading(false);
      return;
    }
    const data = Object.fromEntries(formData.entries()); // Convert FormData to object

    await signIn("credentials", {
      ...data,
      callbackUrl: "/protected/dashboard",
    });
  };

  return (
    <form action={credentialsAction}>
      <InputGroup
        type="text"
        label="Username"
        className="mb-4 [&_input]:py-[15px]"
        placeholder="Enter your Username"
        name="username"
        // handleChange={handleChange}
        // value={data.email}
        icon={<UserIcon />}
      />

      {formErrors.username && (
        <Alert
          variant="error"
          title={"Invalid"}
          description={formErrors.username}
        />
      )}

      <InputGroup
        type="password"
        label="Password"
        className="mb-5 [&_input]:py-[15px]"
        placeholder="Enter your password"
        name="password"
        // handleChange={handleChange}
        // value={data.password}
        icon={<PasswordIcon />}
      />

      {formErrors.password && (
        <Alert
          variant="error"
          title={"Invalid"}
          description={formErrors.password}
        />
      )}

      <div className="mb-6 flex items-center justify-between gap-2 py-2 font-medium">
        <Checkbox
          label="Remember me"
          name="remember"
          withIcon="check"
          minimal
          radius="md"
          // onChange={(e) =>
          //   setData({
          //     ...data,
          //     remember: e.target.checked,
          //   })
          // }
        />

        <Link
          href="/auth/forgot-password"
          className="hover:text-primary dark:text-white dark:hover:text-primary"
        >
          Forgot Password?
        </Link>
      </div>

      <div className="mb-4.5">
        <button
          type="submit"
          onClick={() => setLoading(true)}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
        >
          Sign In
          {loading && <Spinner />}
        </button>
        {error && (
          <>
            <br />
            <Alert
              variant="error"
              title={"Invalid"}
              description="Invalid credentials"
            />
          </>
        )}
      </div>
    </form>
  );
}
