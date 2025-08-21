"use server";
import Image from "next/image";
import { ThemeToggleButton } from "./client-theme-toggle-btn";
import { SignOutAdminBtn } from "@/app/auth/sign-in/_components/sign-out-button";

// import { ThemeToggleSwitch } from "./theme-toggle";

import Logo from "@/assets/logos/logo.png";

export async function Header() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-stroke bg-white px-4 py-5 shadow-1 dark:border-stroke-dark dark:bg-gray-dark md:px-5 2xl:px-10">
      <div className="max-xl:hidden">
        <h1 className="mb-0.5 flex justify-start text-heading-5 font-bold text-dark dark:text-white">
          <Image src={Logo} alt="Logo" width={35} height={35} /> - Forecastchain
          -
        </h1>
      </div>
      {/* <div className="flex flex-1 items-center justify-end gap-2 min-[375px]:gap-4">
        <ThemeToggleSwitch />
      </div> */}
      <ThemeToggleButton />
      <SignOutAdminBtn />
    </header>
  );
}
