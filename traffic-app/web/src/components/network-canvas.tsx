"use client";

import dynamic from "next/dynamic";

const NetworkScene = dynamic(
  () => import("@/components/network-scene").then((m) => m.NetworkScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[560px] items-center justify-center rounded-[10px] bg-[#1f1f1b]">
        <p className="font-mono text-[11px] tracking-[0.14em] text-[#f43e01] uppercase">
          Compiling attention graph
        </p>
      </div>
    ),
  },
);

export function NetworkCanvas() {
  return <NetworkScene />;
}
