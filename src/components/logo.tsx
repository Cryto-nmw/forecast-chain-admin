// import darkLogo from "@/assets/logos/dark.svg";
// import logo from "@/assets/logos/main.svg";
// import DarkLogo from "@/assets/logos/dark.svg";
import MainLogo from "@/assets/logos/logo.png";
import Image from "next/image";

export function Logo() {
  return (
    <div className="relative h-8 max-w-[10.847rem]">
      <Image
        src={MainLogo}
        // fill
        height={32}
        className="dark:hidden"
        alt="NextAdmin logo - "
        role="presentation"
        quality={100}
      />

      {/* <Image
        src={DarkLogo}
        fill
        className="hidden dark:block"
        alt="NextAdmin logo *"
        role="presentation"
        quality={100}
      /> */}
    </div>
  );
}
