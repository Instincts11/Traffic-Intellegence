import Link from "next/link";

export default function NotFound() {
  return (
    <section className="bg-bone">
      <div className="mx-auto max-w-[800px] px-5 py-28 md:px-8">
        <p className="eyebrow">404</p>
        <h1 className="mt-4 text-[56px] font-light tracking-[-0.03em]">
          This edge is not on the graph.
        </h1>
        <p className="mt-6 max-w-md text-[16px] text-stone">
          The node you requested was never extracted from OSM. Return to the
          notebook.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-pill bg-ember px-5 py-2.5 text-[15px] text-white"
        >
          Back to Traffic
        </Link>
      </div>
    </section>
  );
}
