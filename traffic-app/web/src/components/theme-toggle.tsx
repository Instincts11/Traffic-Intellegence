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

/** Dual theme pills — shown in footer on screens ≤600px */
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
      className={cn(
        "flex items-center justify-center gap-2",
        className,
      )}
      role="group"
      aria-label="Theme"
    >
      <button
        type="button"
        onClick={() => select("parchment")}
        aria-pressed={theme === "parchment"}
        className={cn(
          "rounded-pill border px-4 py-2 font-mono text-[11px] tracking-[0.08em] uppercase transition-colors",
          theme === "parchment"
            ? "border-graphite bg-[#2a2a25] text-[#f3f3ee]"
            : "border-khaki bg-transparent text-stone hover:border-graphite",
        )}
      >
        Parchment
      </button>
      <button
        type="button"
        onClick={() => select("obsidian")}
        aria-pressed={theme === "obsidian"}
        className={cn(
          "rounded-pill border px-4 py-2 font-mono text-[11px] tracking-[0.08em] uppercase transition-colors",
          theme === "obsidian"
            ? "border-graphite bg-[#2a2a25] text-[#f3f3ee]"
            : "border-khaki bg-transparent text-stone hover:border-graphite",
        )}
      >
        Obsidian
      </button>
    </div>
  );
}
