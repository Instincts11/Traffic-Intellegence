import { Eyebrow } from "@/components/eyebrow";
import type { ReactNode } from "react";

export type FaqItem = { q: string; a: string };

export function PageFaq({
  title = "Common questions",
  items,
  dark = false,
}: {
  title?: string;
  items: FaqItem[];
  dark?: boolean;
}) {
  return (
    <section className={dark ? "bg-[#2a2a25] text-[#f3f3ee]" : "bg-parchment"}>
      <div className="mx-auto max-w-[800px] px-5 py-16 md:px-8">
        <Eyebrow>{title}</Eyebrow>
        <div className="mt-8 space-y-8">
          {items.map((item) => (
            <div key={item.q}>
              <h3
                className={`text-[20px] font-light tracking-[-0.02em] ${
                  dark ? "text-[#f3f3ee]" : "text-foreground"
                }`}
              >
                {item.q}
              </h3>
              <p
                className={`mt-2 text-[15px] leading-relaxed ${
                  dark ? "text-[#b8b8ae]" : "text-stone"
                }`}
              >
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ContentBand({
  eyebrow,
  title,
  body,
  items,
  tone = "bone",
}: {
  eyebrow: string;
  title: string;
  body?: string;
  items: { t: string; d: string }[];
  tone?: "bone" | "parchment" | "dark";
}) {
  const bg =
    tone === "dark"
      ? "bg-[#2d2f33] text-[#f3f3ee]"
      : tone === "parchment"
        ? "bg-parchment"
        : "bg-bone";
  const muted = tone === "dark" ? "text-[#b8b8ae]" : "text-stone";
  const card = tone === "dark" ? "bg-[#1f1f1b]" : "bg-bone";
  const cardOnParchment = tone === "parchment" ? "bg-bone" : card;

  return (
    <section className={bg}>
      <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-8">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mt-4 max-w-3xl text-[32px] font-light tracking-[-0.02em] md:text-[40px]">
          {title}
        </h2>
        {body && (
          <p className={`mt-5 max-w-2xl text-[16px] leading-relaxed ${muted}`}>
            {body}
          </p>
        )}
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.t}
              className={`rounded-[10px] p-6 ${tone === "parchment" ? cardOnParchment : tone === "dark" ? "bg-[#1f1f1b]" : "bg-parchment"}`}
            >
              <h3 className="text-[18px] font-medium tracking-[-0.02em]">{item.t}</h3>
              <p className={`mt-2 text-[14px] leading-relaxed ${muted}`}>{item.d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function QuoteBand({ quote, attrib }: { quote: string; attrib: string }) {
  return (
    <section className="bg-[#2a2a25] text-[#f3f3ee]">
      <div className="mx-auto max-w-[960px] px-5 py-20 md:px-8 md:py-28">
        <p className="text-[28px] font-light leading-[1.25] tracking-[-0.03em] md:text-[40px]">
          “{quote}”
        </p>
        <p className="mt-8 font-mono text-[12px] tracking-[0.12em] uppercase text-[#b8b8ae]">
          {attrib}
        </p>
      </div>
    </section>
  );
}

export function StatStrip({
  items,
  tone = "bone",
}: {
  items: { v: string; l: string }[];
  tone?: "bone" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <section
      className={dark ? "bg-[#1f1f1b] text-[#f3f3ee]" : "border-y border-khaki bg-bone"}
    >
      <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-px bg-khaki md:grid-cols-4">
        {items.map((s) => (
          <div key={s.l} className={dark ? "bg-[#1f1f1b] px-5 py-8" : "bg-bone px-5 py-8"}>
            <p className="text-[26px] font-light tracking-[-0.03em] md:text-[32px]">{s.v}</p>
            <p
              className={`mt-2 font-mono text-[11px] tracking-[0.12em] uppercase ${
                dark ? "text-[#b8b8ae]" : "text-ash"
              }`}
            >
              {s.l}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SplitEssay({
  eyebrow,
  title,
  left,
  right,
  tone = "bone",
}: {
  eyebrow: string;
  title: string;
  left: ReactNode;
  right: ReactNode;
  tone?: "bone" | "parchment";
}) {
  return (
    <section className={tone === "parchment" ? "bg-parchment" : "bg-bone"}>
      <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-8">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mt-4 max-w-4xl text-[32px] font-light tracking-[-0.03em] md:text-[44px]">
          {title}
        </h2>
        <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-16">
          <div className="space-y-5 text-[16px] leading-[1.7] text-stone [&_strong]:font-medium [&_strong]:text-foreground">
            {left}
          </div>
          <div className="space-y-5 text-[16px] leading-[1.7] text-stone [&_strong]:font-medium [&_strong]:text-foreground">
            {right}
          </div>
        </div>
      </div>
    </section>
  );
}

export function NumberedBand({
  eyebrow,
  title,
  body,
  steps,
  tone = "dark",
}: {
  eyebrow: string;
  title: string;
  body?: string;
  steps: { t: string; d: string }[];
  tone?: "dark" | "parchment";
}) {
  const dark = tone === "dark";
  return (
    <section className={dark ? "bg-[#2d2f33] text-[#f3f3ee]" : "bg-parchment"}>
      <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-8">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mt-4 max-w-3xl text-[32px] font-light tracking-[-0.03em] md:text-[44px]">
          {title}
        </h2>
        {body && (
          <p
            className={`mt-5 max-w-2xl text-[16px] leading-relaxed ${
              dark ? "text-[#b8b8ae]" : "text-stone"
            }`}
          >
            {body}
          </p>
        )}
        <ol className="mt-12 grid gap-8 md:grid-cols-2">
          {steps.map((s, i) => (
            <li key={s.t} className="flex gap-4">
              <span className="font-mono text-[12px] tracking-[0.14em] text-ember">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-[20px] font-light tracking-[-0.02em]">{s.t}</h3>
                <p
                  className={`mt-2 text-[15px] leading-relaxed ${
                    dark ? "text-[#b8b8ae]" : "text-stone"
                  }`}
                >
                  {s.d}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
