import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getUserFromDb } from "./utils/db";
import { signInSchema } from "./utils/zod";
import { verifyPassword } from "./utils/misc";
import { DbUser } from "./utils/types";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user: DbUser | null = null;

        // const { username, password } =
        //   await signInSchema.parseAsync(credentials);

        const parseResult = signInSchema.safeParse(credentials);

        if (!parseResult.success) {
          const fieldErrors: { [key: string]: string } = {};

          parseResult.error.issues.forEach((issue) => {
            const fieldName = issue.path[0];
            if (typeof fieldName === "string" && !fieldErrors[fieldName]) {
              fieldErrors[fieldName] = issue.message;
            }
          });

          throw new Error("VALIDATION_ERROR:" + JSON.stringify(fieldErrors));
        }

        // logic to verify if the user exists
        user = await getUserFromDb(credentials.username);

        if (!user) {
          // No user found, so this is their first attempt to login
          // Optionally, this is also the place you could do a user registration
          throw new Error("Invalid credentials.");
        } else {
          let plainPassword;
          let hashedPassword;
          if (typeof credentials.password === "string") {
            plainPassword = credentials.password;
          } else {
            plainPassword = "";
          }

          if (typeof user.password_hash === "string") {
            hashedPassword = user.password_hash;
          } else {
            hashedPassword = "";
          }
          const passwordMatched = await verifyPassword(
            plainPassword,
            hashedPassword,
          );
          if (!passwordMatched) {
            // throw new Error(
            //   `Invalid credentials: Password not match.=> ${plainPassword} vs ${hashedPassword}`,
            // );
            return null;
          }
        }

        // return user object with their profile data
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/auth/sign-in", // Redirect here on error
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      // When user logs in, attach their DB id/admin_id into the token
      if (user) {
        token.id = user.id; // or user.admin_id if your DB column is admin_id
      }
      return token;
    },
    async session({ session, token }) {
      // Expose the id in the session so `auth()` can access it
      if (token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // You can override redirects dynamically
      // If url is relative, keep it
      if (url.startsWith("/protected")) return url;
      // Otherwise, default to baseUrl
      return baseUrl;
    },
  },
});
