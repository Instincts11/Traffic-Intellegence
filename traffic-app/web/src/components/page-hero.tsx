import { Eyebrow } from "@/components/eyebrow";
import { Button } from "@/components/button";

export function PageHero({
  kicker,
  title,
  lede,
  primary,
  secondary,
}: {
  kicker: string;
  title: string;
  lede: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="border-b border-khaki bg-bone">
      <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-8 md:py-28">
        <Eyebrow>{kicker}</Eyebrow>
        <h1 className="mt-5 max-w-4xl text-[40px] font-light leading-[1.05] tracking-[-0.03em] text-foreground md:text-[64px] lg:text-[80px]">
          {title}
        </h1>
        <p className="mt-8 max-w-2xl text-[18px] leading-relaxed text-stone">
          {lede}
        </p>
        {(primary || secondary) && (
          <div className="mt-10 flex w-full min-w-0 flex-nowrap items-center gap-2 max-[361px]:gap-1.5 sm:gap-3">
            {primary && (
              <Button
                href={primary.href}
                className="whitespace-nowrap max-[361px]:min-w-0 max-[361px]:flex-1 max-[361px]:px-3.5 max-[361px]:py-2 max-[361px]:text-[12px]"
              >
                {primary.label}
              </Button>
            )}
            {secondary && (
              <Button
                href={secondary.href}
                variant="dark"
                className="whitespace-nowrap max-[361px]:min-w-0 max-[361px]:flex-1 max-[361px]:px-3.5 max-[361px]:py-2 max-[361px]:text-[12px]"
              >
                {secondary.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
