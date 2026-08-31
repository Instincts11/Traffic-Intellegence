import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Prose } from "@/components/prose";
import { Eyebrow } from "@/components/eyebrow";
import { ContentBand, PageFaq } from "@/components/page-content";

export const metadata: Metadata = {
  title: "Product",
  description:
    "A single surface for prediction, detection, attention, and adaptive routing — built like a speed lab notebook.",
};

const modules = [
  {
    n: "01",
    t: "Prediction studio",
    d: "Forecast link speeds on any corridor in the Thiruvananthapuram graph. Switch LSTM and hybrid LSTM–GAT. Stretch the horizon from twenty minutes to two hours. The chart is not decoration — it is the contract the router will honor.",
  },
  {
    n: "02",
    t: "Detection rail",
    d: "YOLOv8 reads CCTV the way a loop detector never could. Cars, buses, trucks, motorcycles. Counts become a density channel. When the camera disagrees with history, the model listens to the camera.",
  },
  {
    n: "03",
    t: "Attention map",
    d: "GAT does not average neighbors. It votes. The influence page is the vote made visible: which upstream edges are writing the future of the edge you care about.",
  },
  {
    n: "04",
    t: "Adaptive routing",
    d: "PPO consumes predicted speeds as living edge weights. The policy is trained to minimize time, not distance. The recommended path can look wrong on a paper map and right on a clock.",
  },
];

export default function ProductPage() {
  return (
    <>
      <PageHero
        kicker="Product"
        title="One notebook. Four instruments."
        lede="Traffic is not a dashboard bolted onto a model. It is a closed loop: see the road, remember the hour, attend to the neighborhood, then move the vehicle. Each surface is a chapter in the same lab book."
        primary={{ href: "/predict", label: "Open the studio" }}
        secondary={{ href: "/detect", label: "Watch detection" }}
      />

      <section className="bg-parchment">
        <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {modules.map((m) => (
              <article key={m.n} className="rounded-[10px] bg-bone p-8">
                <p className="font-mono text-[12px] tracking-[0.14em] text-ember">{m.n}</p>
                <h2 className="mt-3 text-[28px] font-light tracking-[-0.02em]">{m.t}</h2>
                <p className="mt-4 text-[16px] leading-relaxed text-stone">{m.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bone">
        <div className="mx-auto max-w-[800px] px-5 py-20 md:px-8">
          <Prose>
            <Eyebrow>What it is not</Eyebrow>
            <h2>Not another shortest-path toy.</h2>
            <p>
              Consumer navigation is a reaction. It notices the jam you are already
              sitting in and offers you a slightly different jam. Traffic is a
              forecast with consequences. The model writes tomorrow’s speeds onto
              today’s graph. The agent is graded on whether people arrive.
            </p>
            <p>
              The product surface is intentionally quiet. Parchment for thesis.
              Graphite for proof. Ember only when something must move. We borrowed
              that discipline from the laboratories that ship silicon, not from the
              marketing sites that ship gradients.
            </p>
            <h2>Who it is for</h2>
            <p>
              City operators who own a corridor and a clock. Fleet desks that cannot
              afford a 14-minute surprise. Researchers who want a graph that is not
              a citation. Builders who will put a camera on a pole and expect the
              API to speak density.
            </p>
            <h3>Operators</h3>
            <p>
              You get a live reading of which segments will fail in the next hour,
              which cameras already see the failure, and which detours the policy
              prefers. You do not get a 40-color heatmap that requires a legend.
            </p>
            <h3>Researchers</h3>
            <p>
              You get the Thiruvananthapuram graph, the 5-minute cadence, the hybrid
              error tables, and the PPO delta against Dijkstra. The methods page
              is long because the work is long.
            </p>
            <h3>Developers</h3>
            <p>
              You get REST for predict, detect, influence, and route. You get
              GeoJSON for the map. You get the honesty that YOLO may be dark on
              a slim host — the rest of the loop still runs.
            </p>
            <h2>The loop, in one breath</h2>
            <p>
              Historical speeds enter the LSTM. Spatial context enters the GAT.
              Frames enter YOLOv8. Predicted speeds become edge weights. PPO
              samples a path. The map draws it. A human either takes it or teaches
              the policy that the path was wrong. That is the product.
            </p>
            <h2>Pages in this build</h2>
            <p>
              <strong>Predict</strong> — place speeds + PPO corridor.{" "}
              <strong>Map</strong> — city colors, grey direct line, shortest /
              fastest / balanced routes. <strong>Influence</strong> — heat map of
              road links near a place. <strong>Detect</strong> — YOLO counts on an
              upload. <strong>Network</strong> — 3D attention metaphor.{" "}
              <strong>Research / Technology</strong> — numbers and stack. Speeds in
              the interactive demo are scenario-based forecasts on real OSM
              geometry, labeled honestly so the product remains a lab you can
              trust.
            </p>
            <h2>Deployment posture</h2>
            <p>
              The original Flask service remains the scientific runtime —
              preprocessing, hybrid inference, Folium maps, optional Ultralytics.
              This Next.js surface is the public instrument panel: the place a
              San Francisco design jury and a Kerala traffic engineer can both
              sit without either feeling talked down to.
            </p>
            <p>
              We ship parchment and obsidian as first-class variants. The orange
              does not become a theme. It remains a highlighter.
            </p>
          </Prose>
        </div>
      </section>

      <section className="bg-[#2d2f33] text-[#f3f3ee]">
        <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-8">
          <Eyebrow>Included</Eyebrow>
          <h2 className="mt-4 text-[40px] font-light tracking-[-0.03em]">
            Surfaces that share one state.
          </h2>
          <ul className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              ["Studio", "Interactive LSTM vs hybrid forecasts on named Thiruvananthapuram corridors, with MAE, R², and horizon in minutes."],
              ["Map", "Three.js graph of nodes and attention, plus the original OSM-derived topology of 250 / 598."],
              ["Detect", "Class-wise vehicle counts as a density prior, framed like a lab still — boxes, not banners."],
              ["Influence", "Which neighbors the GAT is looking at when it writes a speed."],
              ["Route", "PPO policy versus Dijkstra, reported as time saved, not distance bragged."],
              ["API", "Predict, upload, influence, route — documented like a hardware datasheet."],
            ].map(([t, d]) => (
              <li key={t}>
                <h3 className="text-[22px] font-light">{t}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#b8b8ae]">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ContentBand
        eyebrow="Operator checklist"
        title="What a corridor pilot usually needs."
        tone="parchment"
        items={[
          {
            t: "One failing clock",
            d: "Name the commute that breaks — e.g. Airport → Secretariat at 09:00 in rain.",
          },
          {
            t: "Graph coverage",
            d: "Confirm OSM roads cover that corridor. Traffic already ships a TVM drive graph.",
          },
          {
            t: "Scenario knobs",
            d: "Decide which incidents matter: rain, events, accidents, peak vs clear.",
          },
          {
            t: "Route policy",
            d: "Choose whether operators want shortest, fastest, or balanced defaults.",
          },
          {
            t: "Optional camera",
            d: "If poles exist, Detect can turn frames into density. Privacy policy first.",
          },
          {
            t: "Honesty layer",
            d: "Label demo vs live data in every slide. Cities forgive limits; they do not forgive silent fiction.",
          },
        ]}
      />

      <PageFaq
        dark
        items={[
          {
            q: "Is Traffic a consumer navigation app?",
            a: "No. It is a forecast-and-policy lab for corridors, fleets, and researchers — with a public instrument panel.",
          },
          {
            q: "Can it run without YOLO?",
            a: "Yes. Prediction, map, influence, and routing work without cameras. Detection is optional density.",
          },
          {
            q: "What city is supported today?",
            a: "Thiruvananthapuram is the shipped case. The architecture is portable to other OSM drive graphs.",
          },
          {
            q: "Where do I click first?",
            a: "Product explains modules; Predict is the working studio; Developers is the contract.",
          },
        ]}
      />
    </>
  );
}
