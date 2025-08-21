"use client";
import { useSidebarContext } from "../sidebar/sidebar-context";
import { ThemeToggleSwitch } from "./theme-toggle";
export const ThemeToggleButton = () => {
  const { toggleSidebar, isMobile } = useSidebarContext();
  return (
    <div className="flex flex-1 items-center justify-end gap-2 min-[375px]:gap-4">
      <ThemeToggleSwitch />
    </div>
  );
};
