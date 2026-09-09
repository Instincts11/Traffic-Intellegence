"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

type Theme = "parchment" | "obsidian";

function applyTheme(theme: Theme) {
  const isDark = theme === "obsidian";
  document.documentElement.classList.toggle("dark", isDark);
  localStorage.setItem("traffic-theme", theme);
}

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("traffic-theme");
    const isDark = stored === "obsidian";
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    applyTheme(next ? "obsidian" : "parchment");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle parchment and obsidian variants"
      className="hidden h-9 items-center rounded-pill border border-khaki px-3 text-[12px] tracking-[0.08em] text-stone uppercase font-mono min-[601px]:inline-flex hover:border-graphite"
    >
      {dark ? "Obsidian" : "Parchment"}
    </button>
  );
}

/** Single circular theme toggle — shown in footer on screens ≤600px */
export function ThemePills({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("parchment");

  useEffect(() => {
    const stored = localStorage.getItem("traffic-theme");
    const next: Theme = stored === "obsidian" ? "obsidian" : "parchment";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "obsidian");
  }, []);

  function toggle() {
    const next: Theme = theme === "obsidian" ? "parchment" : "obsidian";
    setTheme(next);
    applyTheme(next);
  }

  const isObsidian = theme === "obsidian";

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <button
        type="button"
        onClick={toggle}
        aria-label={isObsidian ? "Switch to parchment theme" : "Switch to obsidian theme"}
        title={isObsidian ? "Obsidian" : "Parchment"}
        className={cn(
          "h-8 w-8 shrink-0 rounded-full border-2 transition-colors",
          isObsidian
            ? "border-mist bg-[#2a2a25]"
            : "border-khaki bg-[#f3f3ee]",
        )}
      />
    </div>
  );
}
