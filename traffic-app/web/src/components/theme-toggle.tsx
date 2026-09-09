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

/** Circular theme swatches — shown in footer on screens ≤600px */
export function ThemePills({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("parchment");

  useEffect(() => {
    const stored = localStorage.getItem("traffic-theme");
    const next: Theme = stored === "obsidian" ? "obsidian" : "parchment";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "obsidian");
  }, []);

  function select(next: Theme) {
    setTheme(next);
    applyTheme(next);
  }

  return (
    <div
      className={cn("flex items-center justify-center gap-3", className)}
      role="group"
      aria-label="Theme"
    >
      <button
        type="button"
        onClick={() => select("parchment")}
        aria-label="Parchment theme"
        aria-pressed={theme === "parchment"}
        title="Parchment"
        className={cn(
          "h-8 w-8 shrink-0 rounded-full border-2 transition-all",
          "bg-[#f3f3ee]",
          theme === "parchment"
            ? "border-ember scale-110 shadow-[0_0_0_3px_rgba(244,62,1,0.25)]"
            : "border-khaki opacity-70 hover:opacity-100 hover:border-graphite",
        )}
      />
      <button
        type="button"
        onClick={() => select("obsidian")}
        aria-label="Obsidian theme"
        aria-pressed={theme === "obsidian"}
        title="Obsidian"
        className={cn(
          "h-8 w-8 shrink-0 rounded-full border-2 transition-all",
          "bg-[#2a2a25]",
          theme === "obsidian"
            ? "border-ember scale-110 shadow-[0_0_0_3px_rgba(244,62,1,0.25)]"
            : "border-khaki opacity-70 hover:opacity-100 hover:border-mist",
        )}
      />
    </div>
  );
}
