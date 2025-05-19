
import React from "react";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";

const ThemeLanguageControls = () => {
  return (
    <div className="flex items-center gap-4">
      <ThemeToggle />
      <LanguageToggle />
    </div>
  );
};

export default ThemeLanguageControls;
