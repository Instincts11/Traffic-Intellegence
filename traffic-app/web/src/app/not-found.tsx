import Link from "next/link";

export default function NotFound() {
  return (
    <section className="bg-bone">
      <div className="mx-auto max-w-[800px] px-5 py-28 md:px-8">
        <p className="eyebrow">404</p>
        <h1 className="mt-4 text-[56px] font-light tracking-[-0.03em]">
          This edge is not on the graph.
        </h1>
        <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-stone">
          The node you requested was never extracted from OpenStreetMap. It is
          not Palayam, not a PPO corridor, not a YOLO still. Return to a page
          that exists — or start the loop from Predict.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex rounded-pill bg-ember px-5 py-2.5 text-[15px] text-white"
          >
            Back to Traffic
          </Link>
          <Link
            href="/predict"
            className="inline-flex rounded-pill bg-[#2d2f33] px-5 py-2.5 text-[15px] text-[#f3f3ee]"
          >
            Open Predict
          </Link>
          <Link
            href="/map"
            className="inline-flex rounded-pill border border-khaki px-5 py-2.5 text-[15px] text-foreground"
          >
            Open Map
          </Link>
        </div>
        <ul className="mt-16 space-y-3 text-[15px] leading-relaxed text-stone">
          <li>
            <strong className="font-medium text-foreground">Predict</strong> —
            scenario speeds at named TVM places, then a PPO corridor.
          </li>
          <li>
            <strong className="font-medium text-foreground">Map</strong> — OSM
            geometry, shortest / fastest / balanced, grey crow-flies line.
          </li>
          <li>
            <strong className="font-medium text-foreground">Influence</strong> —
            coupling near a place, not jam color.
          </li>
          <li>
            <strong className="font-medium text-foreground">Detect</strong> —
            on-device YOLOv8n: car, truck, bike, bus.
          </li>
        </ul>
      </div>
    </section>
  );
}
