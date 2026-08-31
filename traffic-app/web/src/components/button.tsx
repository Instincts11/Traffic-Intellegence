import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "ember" | "graphite" | "ghost" | "dark";

const styles: Record<Variant, string> = {
  ember:
    "bg-ember text-white hover:bg-ember-hover active:bg-ember-active",
  graphite:
    "bg-[#2d2f33] text-white hover:bg-[#1f1f1b]",
  dark:
    "bg-[#2a2a25] text-[#f3f3ee] hover:bg-[#1f1f1b]",
  ghost:
    "bg-transparent border border-khaki hover:border-graphite",
};

export function Button({
  href,
  children,
  variant = "ember",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-pill px-5 py-2.5 text-[15px] font-normal tracking-[-0.02em] transition-colors",
        styles[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}
