import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Prose } from "@/components/prose";
import { Eyebrow } from "@/components/eyebrow";
import { ContentBand, PageFaq } from "@/components/page-content";

export const metadata: Metadata = {
  title: "Technology",
  description:
    "LSTM for time, GAT for space, YOLOv8 for density, PPO for the path. The hybrid stack behind Traffic.",
};

const stack = [
  {
    id: "lstm",
    name: "LSTM",
    role: "Temporal memory",
    body: "A road is a time series before it is a place. The LSTM is trained on 5-minute samples across 60 days. It learns the grammar of peak: the Monday that is not a Friday, the rain that is not a holiday. Standalone, it posts MAE 0.5354, RMSE 0.7880, R² 0.9766 — a strong univariable singer.",
  },
  {
    id: "gat",
    name: "GAT",
    role: "Spatial attention",
    body: "Graph Attention refuses the fiction that an edge is alone. Each node queries its neighbors and writes an attention coefficient. Congestion becomes a rumor with a source. The hybrid LSTM–GAT posts MAE 1.3447 and R² 0.9309 — numerically louder error, spatially better truth. Routing needs the second number.",
  },
  {
    id: "yolo",
    name: "YOLOv8",
    role: "Density from pixels",
    body: "Loop detectors lie by omission. A camera does not. YOLOv8n detects bicycle, car, motorcycle, bus, truck. Counts become a feature, not a screenshot. On slim hosts the detector can sleep; the rest of the stack does not wait for it.",
  },
  {
    id: "ppo",
    name: "PPO",
    role: "Adaptive policy",
    body: "Predicted speeds become living weights. Proximal Policy Optimization learns a routing policy that is allowed to look foolish on a paper map if it is wise on a stopwatch. Versus Dijkstra: 10–25% less travel time, smoother load, fewer heroic U-turns.",
  },
];

export default function TechnologyPage() {
  return (
    <>
      <PageHero
        kicker="Technology"
        title="Four models. One closed loop."
        lede="We did not invent a new kind of car. We invented a new kind of honesty about the next hour of road. The stack is classical on purpose: memory, attention, vision, policy — each named, each measured, none hiding behind a slogan."
        primary={{ href: "/research", label: "See benchmarks" }}
        secondary={{ href: "/developers", label: "API surface" }}
      />

      <section className="bg-parchment">
        <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-8">
          <div className="grid gap-4">
            {stack.map((s) => (
              <article
                key={s.id}
                id={s.id}
                className="scroll-mt-24 rounded-[10px] bg-bone p-8 md:grid md:grid-cols-[200px_1fr] md:gap-10"
              >
                <div>
                  <p className="eyebrow">{s.role}</p>
                  <h2 className="mt-2 text-[32px] font-light tracking-[-0.02em]">
                    {s.name}
                  </h2>
                </div>
                <p className="mt-4 text-[16px] leading-relaxed text-stone md:mt-0">
                  {s.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bone">
        <div className="mx-auto max-w-[800px] px-5 py-20 md:px-8">
          <Prose>
            <Eyebrow>Architecture</Eyebrow>
            <h2>How the hour is written.</h2>
            <p>
              Data arrives as OSM topology via OSMnx and NetworkX, and as a 60-day
              multivariate stream: speed, flow, congestion, weather, density.
              Preprocessing is unromantic and non-negotiable — missing values,
              outlier interpolation, time sync, min-max, graph index mapping.
            </p>
            <p>
              The LSTM consumes the temporal window. Its hidden state is the city’s
              short-term memory. The GAT consumes the same moment as a graph: each
              road asking its neighbors how much of their present should become its
              future. Fusion is the hybrid forecast. That tensor is not a chart. It
              is an edge-weight field.
            </p>
            <h3>From speed to policy</h3>
            <p>
              Dynamic weights enter the PPO environment. The agent proposes a path.
              Reward is the negative of experienced time, with penalties for
              re-entering a predicted jam. The clip in PPO is the adult in the room:
              updates stay proximal so a noisy afternoon cannot unteach a month.
            </p>
            <h3>Why hybrid error can be higher</h3>
            <p>
              A univariate LSTM can hug a single series until the residual is tiny
              and the route is still stupid. GAT spends capacity on neighbors. That
              shows up as MAE you can quote against us, and as detours you can
              actually drive. We print both numbers. The Ember CTA is the routing
              one.
            </p>
            <h2>Systems, not slides</h2>
            <p>
              PyTorch for the nets. Ultralytics for detection. Stable-Baselines3 for
              PPO. Folium for the scientific map. Three.js on this site for the
              public graph — a cousin of the adjacency matrix, not a replacement.
              Flask remains the lab server. Next.js 16 is the instrument face.
            </p>
            <p>
              Nothing in this stack is a secret sauce. The sauce is the closed loop
              and the refusal to ship a predictor that cannot move a vehicle.
            </p>
            <h2>Constraints we keep</h2>
            <p>
              Five-minute bins, because finer is vanity without sensors. A real
              capital graph beats a synthetic grid. Optional YOLO, because not
              every host should download weights to say hello. Ember only on
              actions, because a technology page that shouts has already lost the
              argument.
            </p>
            <h2>What each public page uses</h2>
            <p>
              Predict and Map consume demo edge speeds + OSM geometry + place
              search (Nominatim / Overpass catalog). Influence builds a local
              attention-style matrix from those speeds near a place. Detect calls
              YOLOv8 when weights are present. Network is a Three.js teaching
              graph. Keeping the stack named this way stops “AI traffic” from
              becoming a single vague button.
            </p>
          </Prose>
        </div>
      </section>

      <section className="bg-[#1f1f1b] text-[#f3f3ee]">
        <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-8">
          <Eyebrow>Data path</Eyebrow>
          <ol className="mt-10 grid gap-8 md:grid-cols-4">
            {[
              ["Acquire", "OSMnx extracts Thiruvananthapuram. Drive graph, weather, density, 5-minute stride."],
              ["Clean", "Interpolate, sync, normalize, map nodes to graph indices. No silent NaNs into the LSTM."],
              ["Predict", "LSTM memory + GAT attention (+ YOLO density) write future speeds onto edges."],
              ["Act", "PPO reads weights, emits a route, Folium and Three.js both tell the truth."],
            ].map(([t, d], i) => (
              <li key={t}>
                <p className="font-mono text-[12px] tracking-[0.14em] text-ember">
                  0{i + 1}
                </p>
                <h3 className="mt-2 text-[24px] font-light">{t}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#b8b8ae]">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ContentBand
        eyebrow="Glossary"
        title="Short definitions for the stack words."
        tone="parchment"
        items={[
          {
            t: "Edge / road segment",
            d: "A directed piece of road between intersections in the OSM graph.",
          },
          {
            t: "Attention",
            d: "How much a road listens to a neighbor when writing a forecast.",
          },
          {
            t: "Horizon",
            d: "How far ahead you ask the model to speak, usually in 5-minute steps.",
          },
          {
            t: "Policy (PPO)",
            d: "A learned chooser of next roads that optimizes time under predicted speeds.",
          },
          {
            t: "Density",
            d: "How many vehicles a camera (or estimate) sees — a feature, not a fine.",
          },
          {
            t: "Demo predictor",
            d: "Lightweight speed field used in this deployment so demos run without a GPU.",
          },
        ]}
      />

      <PageFaq
        dark
        items={[
          {
            q: "Why keep LSTM and GAT separate in the story?",
            a: "LSTM is memory of time. GAT is memory of neighbors. Naming both stops “AI” from becoming one blurry box.",
          },
          {
            q: "Is PPO always better than Dijkstra?",
            a: "On time, research showed 10–25% gains in the evaluated setting. Distance-only Dijkstra can still win if you only care about kilometres.",
          },
          {
            q: "Where is code?",
            a: "Flask scientific runtime and Next.js UI both live under traffic-app. Developers page lists the HTTP surface.",
          },
        ]}
      />
    </>
  );
}
