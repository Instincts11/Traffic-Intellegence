import Link from "next/link";

const marks = ["LSTM", "GAT", "YOLOv8", "PPO", "OSMnx", "PyTorch"];

export function StickyBar() {
  return (
    <div className="sticky bottom-0 z-40 max-w-full overflow-x-clip border-t border-khaki bg-bone/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] min-w-0 items-center justify-between gap-4 px-5 py-3 md:px-8">
        <div className="hidden min-w-0 items-center gap-6 overflow-hidden md:flex">
          {marks.map((m) => (
            <span
              key={m}
              className="font-mono text-[11px] tracking-[0.14em] uppercase text-ash"
            >
              {m}
            </span>
          ))}
        </div>
        <Link
          href="/predict"
          className="ml-auto inline-flex max-w-full items-center rounded-pill bg-[#2a2a25] px-3 py-2 text-[11px] tracking-[0.08em] text-[#f3f3ee] uppercase sm:px-4 sm:text-[12px]"
        >
          Try the speed of Traffic
        </Link>
      </div>
    </div>
  );
}
