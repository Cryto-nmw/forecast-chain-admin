// import { object, string } from "zod";
import { object, string, any } from "zod";

export const signInSchema = object({
  username: string()
    .min(1, { message: "Username is required" })
    .min(6, { message: "Username must be at least 6 characters" })
    .regex(/^[a-zA-Z0-9]+$/, { message: "Username must be alphanumeric only" }),
  password: string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be more than 8 characters" })
    .max(32, { message: "Password must be less than 32 characters" }),
});

export const agentFormSchema = object({
  name: string().min(1, { message: "Name is required" }).trim(),
  email: string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" })
    .trim(),
  description: string().optional(),
  files: any()
    .optional()
    .refine(
      (files) =>
        !files ||
        (Array.isArray(files) && files.every((f) => f instanceof File)),
      { message: "Files must be valid uploads" },
    ),
});
