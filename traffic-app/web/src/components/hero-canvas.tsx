"use client";

import dynamic from "next/dynamic";

const HeroScene = dynamic(
  () => import("@/components/hero-scene").then((m) => m.HeroScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[420px] items-end rounded-[10px] bg-[#2a2a25] p-5 md:h-[520px]">
        <p className="font-mono text-[11px] tracking-[0.14em] text-[#cecebf] uppercase">
          Loading graph runtime
        </p>
      </div>
    ),
  },
);

export function HeroCanvas() {
  return <HeroScene />;
}
