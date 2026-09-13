import Link from "next/link";
import { ThemePills } from "@/components/theme-toggle";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/product", label: "Platform" },
      { href: "/predict", label: "Prediction studio" },
      { href: "/detect", label: "Vehicle detection" },
      { href: "/map", label: "Traffic map" },
      { href: "/influence", label: "GAT influence" },
      { href: "/network", label: "Road network" },
    ],
  },
  {
    title: "Science",
    links: [
      { href: "/technology", label: "Architecture" },
      { href: "/research", label: "Benchmarks" },
      { href: "/developers", label: "API" },
      { href: "/technology#ppo", label: "Routing agent" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/company", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/company#labs", label: "Labs" },
      { href: "/research#methods", label: "Methods" },
      { href: "/developers", label: "Datasheet" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-khaki bg-parchment">
      <div className="mx-auto max-w-[1200px] px-5 pb-4 pt-16 md:px-8">
        <p className="max-w-3xl text-[22px] font-light leading-snug tracking-[-0.03em] text-foreground md:text-[28px]">
          Thiruvananthapuram as a graph. Demo hours you can rerun. Detection on
          the still you chose. Routing graded in minutes.
        </p>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-stone">
          Speeds on Predict, Map, and Influence are scenario forecasts on real
          OSM geometry — not live Google traffic. Research MAE and PPO deltas
          live on their own page. Ember is for actions. The paper is bone.
        </p>
      </div>
      <div className="mx-auto grid max-w-[1200px] gap-12 px-5 py-16 md:grid-cols-4 md:px-8">
        <div>
          <p className="text-[18px] font-medium tracking-[-0.03em]">Traffic</p>
          <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-stone">
            Predictive congestion intelligence for cities that refuse to wait
            for the jam to form. LSTM memory, GAT attention, on-device YOLOv8n,
            PPO policy — one closed loop.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <p className="font-mono text-[12px] tracking-[0.12em] uppercase text-ash">
              {col.title}
            </p>
            <ul className="mt-4 space-y-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[15px] text-stone hover:text-ember"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-khaki">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-3 px-5 py-6 text-[13px] text-ash md:flex-row md:items-center md:justify-between md:px-8">
          <p>© {new Date().getFullYear()} Traffic. Thiruvananthapuram, Kerala · San Francisco.</p>
          <ThemePills className="max-[600px]:flex min-[601px]:hidden" />
          <p className="hidden font-mono tracking-[0.08em] uppercase min-[601px]:block">
            Parchment · Ember · Obsidian
          </p>
        </div>
      </div>
    </footer>
  );
}
