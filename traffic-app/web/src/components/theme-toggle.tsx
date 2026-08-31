"use client";

import { useEffect, useState } from "react";

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
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("traffic-theme", next ? "obsidian" : "parchment");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle parchment and obsidian variants"
      className="hidden h-9 items-center rounded-pill border border-khaki px-3 text-[12px] tracking-[0.08em] text-stone uppercase font-mono sm:inline-flex hover:border-graphite"
    >
      {dark ? "Obsidian" : "Parchment"}
    </button>
  );
}
