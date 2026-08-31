"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { nav } from "@/lib/site";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/cn";

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 max-w-full overflow-x-clip border-b border-khaki/70 bg-bone/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] min-w-0 items-center justify-between gap-2 px-5 md:px-8">
        <Link href="/" className="shrink-0 text-[18px] font-medium tracking-[-0.03em] text-foreground">
          Traffic
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-[15px] tracking-[-0.02em] transition-colors",
                pathname === item.href
                  ? "text-foreground"
                  : "text-stone hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex min-w-0 shrink items-center gap-2">
          <ThemeToggle />
          <Link
            href="/predict"
            className="hidden rounded-pill bg-[#2a2a25] px-4 py-2 text-[13px] text-[#f3f3ee] md:inline-flex"
          >
            Try the speed
          </Link>
          <Link
            href="/contact"
            className="rounded-pill bg-ember px-3 py-2 text-[12px] text-white hover:bg-ember-hover sm:px-4 sm:text-[13px]"
          >
            Start building
          </Link>
          <button
            type="button"
            className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-[5px] border border-khaki lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Open menu"
          >
            <span className="relative block h-3 w-3.5">
              <span className="absolute left-0 top-0 h-px w-full bg-foreground" />
              <span className="absolute left-0 top-1.5 h-px w-full bg-foreground" />
              <span className="absolute left-0 top-3 h-px w-full bg-foreground" />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-khaki bg-bone px-5 py-4 lg:hidden">
          <div className="flex flex-col gap-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-[16px] text-stone"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
