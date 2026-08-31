import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Prose } from "@/components/prose";
import { Eyebrow } from "@/components/eyebrow";
import { ContentBand, PageFaq } from "@/components/page-content";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Measured results from Thiruvananthapuram: LSTM vs hybrid LSTM–GAT, PPO vs Dijkstra, and the methodology behind the numbers.",
};

const rows = [
  ["LSTM", "0.5354", "0.7880", "0.9766"],
  ["Hybrid LSTM–GAT", "1.3447", "2.0056", "0.9309"],
];

export default function ResearchPage() {
  return (
    <>
      <PageHero
        kicker="Research"
        title="Print the residuals. Then print the route."
        lede="A city does not grade you on mean absolute error. It grades you on whether a bus clears East Fort before the school bell. These tables are the lab. The policy is the field."
        primary={{ href: "/network", label: "Open the graph" }}
        secondary={{ href: "/technology", label: "Methods" }}
      />

      <section className="bg-parchment">
        <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-8">
          <Eyebrow>Traffic prediction</Eyebrow>
          <h2 className="mt-3 text-[36px] font-light tracking-[-0.02em]">
            Error is not the only score.
          </h2>
          <div className="mt-10 overflow-x-auto rounded-[10px] bg-bone">
            <table className="w-full min-w-[560px] text-left text-[15px]">
              <thead>
                <tr className="border-b border-khaki font-mono text-[11px] tracking-[0.12em] uppercase text-ash">
                  <th className="px-6 py-4">Model</th>
                  <th className="px-6 py-4">MAE</th>
                  <th className="px-6 py-4">RMSE</th>
                  <th className="px-6 py-4">R²</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r[0]} className="border-b border-khaki last:border-0">
                    {r.map((c) => (
                      <td key={c} className="px-6 py-4 font-light">
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-stone">
            The standalone LSTM is the better univariate student. The hybrid is
            the better cartographer. We refuse to hide the first fact to advertise
            the second.
          </p>
        </div>
      </section>

      <section className="bg-[#2d2f33] text-[#f3f3ee]">
        <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-8">
          <Eyebrow>Adaptive routing</Eyebrow>
          <h2 className="mt-4 max-w-3xl text-[40px] font-light tracking-[-0.03em]">
            PPO versus Dijkstra, in the only unit that matters.
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {[
              ["10–25%", "Reduction in experienced travel time"],
              ["Dynamic", "Routes rewrite as predicted speeds move"],
              ["Load", "Traffic redistributes instead of stampeding"],
              ["Policy", "Learned — not a one-shot shortest path"],
            ].map(([v, l]) => (
              <div key={l}>
                <p className="text-[32px] font-light tracking-[-0.03em]">{v}</p>
                <p className="mt-2 text-[15px] text-[#b8b8ae]">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="methods" className="scroll-mt-24 bg-bone">
        <div className="mx-auto max-w-[800px] px-5 py-20 md:px-8">
          <Prose>
            <Eyebrow>Methods</Eyebrow>
            <h2>The case is Thiruvananthapuram, not a cartoon.</h2>
            <p>
              Topology comes from OpenStreetMap via OSMnx around Palayam: the
              capital’s drive graph, Kerala’s hills and coastal approach.
              Simulation covers the same 5-minute cadence of speed, flow,
              congestion, weather, and density.
            </p>
            <h3>Why this graph</h3>
            <p>
              Thiruvananthapuram is a stress test dressed as a capital. Secretariat
              pulse. NH 66 pins the west. Coastal roads lie about capacity. A
              model that only works on a grid with four neighbors has not met a
              city.
            </p>
            <h3>Training honesty</h3>
            <p>
              Windows are causal. Features are normalized with statistics that
              cannot see the test week. GAT attention is computed on the true
              adjacency, not a fully connected fantasy. YOLO classes are limited
              to the vehicle set the municipal question actually asks.
            </p>
            <h3>What we do not claim</h3>
            <p>
              We do not claim a world-best MAE. We do not claim live Kerala
              CCTV on every pole. We do not claim PPO is a replacement for
              signal timing, transit, or politics. We claim a measured loop from
              forecast to path on a real industrial graph, and a product face
              that does not insult the reader with gradients.
            </p>
            <h2>Reproducibility posture</h2>
            <p>
              The Flask application, edge CSV, preprocessing utilities, and hybrid
              model code live beside this site in <strong>traffic-app</strong>.
              This Next.js 16 surface is the public narrative and the interactive
              instrument. Both should be able to point at the same numbers without
              blinking.
            </p>
            <p>
              Future work is written in the same voice as the present: live APIs,
              multi-camera fusion, signal policies, Jetson-class edge, fuel as a
              second reward, multimodal legs. None of that is a promise. It is a
              queue.
            </p>
            <h2>How to read the R²</h2>
            <p>
              0.9766 on LSTM means the series is learnable. 0.9309 on hybrid means
              the spatial tax is real and still high. If your procurement sheet
              only has one cell, put the routing delta in it. If it has two, put
              both. If it has a paragraph, you are already on this page.
            </p>
            <h2>How this site uses the research</h2>
            <p>
              The public Predict / Map / Influence tools currently run a
              deterministic demo predictor so anyone can explore Thiruvananthapuram
              without a GPU. The tables above are the measured lab story for the
              hybrid stack. When you demo the site, say both sentences: the graph
              is real OSM; the interactive speeds are scenario demos; the published
              MAE/R² are from the trained models on the research track.
            </p>
            <h3>Suggested reading order</h3>
            <p>
              Technology (stack) → this page (scores) → Predict (touch the city) →
              Map (see a route) → Influence (see links) → Detect (optional camera).
              That order matches how the loop was designed.
            </p>
          </Prose>
        </div>
      </section>

      <ContentBand
        eyebrow="How to cite these results"
        title="Say what was measured — and what was demoed."
        tone="parchment"
        items={[
          {
            t: "Prediction table",
            d: "Report MAE, RMSE, R² for LSTM vs hybrid on the Thiruvananthapuram research split.",
          },
          {
            t: "Routing delta",
            d: "Report PPO travel-time reduction vs Dijkstra as a range (10–25%) with the setting named.",
          },
          {
            t: "Interactive site",
            d: "Describe demo speeds as scenario forecasts on OSM — not as the same evaluation set unless you re-ran weights.",
          },
          {
            t: "Graph claim",
            d: "Cite OSMnx-derived topology for the capital; do not imply every Kerala district is loaded.",
          },
          {
            t: "Vision claim",
            d: "YOLO counts on uploads; do not imply city-wide live CCTV coverage.",
          },
          {
            t: "Limitations",
            d: "Always include: no claim of world-best MAE; no replacement for signal timing or transit policy.",
          },
        ]}
      />

      <PageFaq
        dark
        items={[
          {
            q: "Why is hybrid MAE worse than LSTM?",
            a: "Spatial models spend capacity on neighbors. Univariate fit can look better while routes stay naive. We publish both.",
          },
          {
            q: "Can I reproduce locally?",
            a: "Yes — traffic-app holds Flask, edges, and web UI. Research weights and full training may need the ML track scripts.",
          },
          {
            q: "What is the unit of success?",
            a: "Minutes saved on a corridor people actually drive — not only a prettier residual plot.",
          },
        ]}
      />
    </>
  );
}
