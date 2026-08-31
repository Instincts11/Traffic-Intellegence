import { Eyebrow } from "@/components/eyebrow";

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
