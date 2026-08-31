export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="prose-site space-y-5 text-[16px] leading-[1.7] text-stone [&_h2]:mt-12 [&_h2]:text-[32px] [&_h2]:font-light [&_h2]:leading-[1.2] [&_h2]:tracking-[-0.02em] [&_h2]:text-foreground [&_h3]:mt-8 [&_h3]:text-[22px] [&_h3]:font-normal [&_h3]:text-foreground [&_p]:max-w-[68ch] [&_strong]:font-medium [&_strong]:text-foreground">
      {children}
    </div>
  );
}
