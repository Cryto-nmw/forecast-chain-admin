// /app/protected/layout.tsx
import { auth } from "@/auth";
import { Sidebar } from "@/components/Layouts/sidebar";
import { Header } from "@/components/Layouts/public-header";

import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Correct: pass cookies() directly, do NOT await

  const session = await auth();

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  return (
    <>
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
          <Header />

          <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
