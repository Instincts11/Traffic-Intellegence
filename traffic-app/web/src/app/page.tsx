import type { Metadata } from "next";
import { Button } from "@/components/button";
import { Eyebrow } from "@/components/eyebrow";
import { HeroCanvas } from "@/components/hero-canvas";
import { ContentBand, PageFaq } from "@/components/page-content";
import { stats } from "@/lib/site";

export const metadata: Metadata = {
  title: "Traffic is the premier intelligence layer for urban movement",
};

const manifesto = [
  "Every commuter served.",
  "Every corridor priced in time.",
  "Every signal timed.",
  "Every vehicle counted.",
];

const claims = [
  {
    k: "01",
    t: "Prediction creates the possibility.",
    d: "LSTM reads the last hour as a sentence. It remembers the school-run spike, the secretariat pulse, the rain that turns MG Road into a parking lot. Without memory, routing is gossip.",
  },
  {
    k: "02",
    t: "The graph creates the truth.",
    d: "Congestion does not live on a single edge. It hops. GAT attention is how a jam at East Fort writes itself onto Kowdiar twelve minutes later — in public, as weights.",
  },
  {
    k: "03",
    t: "Routing creates the value.",
    d: "PPO does not compute the shortest path. It learns the cheapest future. Dijkstra is a photograph. The agent is a rehearsal.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="grid-paper border-b border-khaki bg-bone">
        <div className="mx-auto max-w-[1200px] px-5 pb-16 pt-16 md:px-8 md:pt-24">
          <Eyebrow>The premier intelligence layer for urban movement</Eyebrow>
          <h1 className="mt-6 max-w-5xl text-[42px] font-light leading-[0.98] tracking-[-0.035em] text-foreground md:text-[72px] lg:text-[88px]">
            Every customer served.
            <br />
            Every product sold.
            <br />
            Every commute completed.
          </h1>
          <p className="mt-8 max-w-xl text-[20px] font-light leading-snug tracking-[-0.02em] text-stone">
            That’s traffic.
          </p>
          <div className="mt-10 flex w-full min-w-0 flex-nowrap items-center gap-2 max-[361px]:gap-1.5 sm:gap-3">
            <Button
              href="/predict"
              className="whitespace-nowrap max-[361px]:min-w-0 max-[361px]:flex-1 max-[361px]:px-3.5 max-[361px]:py-2 max-[361px]:text-[12px]"
            >
              Start building
            </Button>
            <Button
              href="/network"
              variant="dark"
              className="whitespace-nowrap max-[361px]:min-w-0 max-[361px]:flex-1 max-[361px]:px-3.5 max-[361px]:py-2 max-[361px]:text-[12px]"
            >
              Try the speed of Traffic
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-[#2d2f33] text-[#f3f3ee]">
        <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-8 md:py-28">
          <Eyebrow>Manifesto</Eyebrow>
          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {manifesto.map((line) => (
              <p
                key={line}
                className="text-[32px] font-light leading-[1.15] tracking-[-0.03em] md:text-[40px]"
              >
                {line}
              </p>
            ))}
          </div>
          <p className="mt-12 max-w-2xl text-[18px] leading-relaxed text-[#b8b8ae]">
            Training creates the possibility. Inference — here, the live
            prediction of a city’s next hour — creates the value. The more we
            ask of mobility, the more prediction it takes. And prediction is
            becoming the bottleneck. Traffic was built for this.
          </p>
        </div>
      </section>

      <section className="bg-parchment">
        <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-8 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <Eyebrow>Live graph runtime</Eyebrow>
              <h2 className="mt-4 text-[40px] font-light leading-[1.1] tracking-[-0.03em] md:text-[52px]">
                Fast or affordable is no longer a tradeoff.
              </h2>
              <p className="mt-6 max-w-md text-[16px] leading-relaxed text-stone">
                We pioneered a hybrid stack: temporal memory, spatial attention,
                camera density, and a routing policy that updates as the city
                breathes. Ember marks the vehicles. Graphite holds the roads.
                The rest is silence.
              </p>
            </div>
            <HeroCanvas />
          </div>
        </div>
      </section>

      <section className="border-y border-khaki bg-bone">
        <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-px bg-khaki md:grid-cols-3 lg:grid-cols-6">
          {stats.map((s) => (
            <div key={s.label} className="bg-bone px-5 py-8">
              <p className="text-[28px] font-light tracking-[-0.03em] md:text-[32px]">
                {s.value}
              </p>
              <p className="mt-2 font-mono text-[11px] tracking-[0.12em] uppercase text-ash">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-bone">
        <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-8 md:py-28">
          <Eyebrow>Thesis · proof · evidence</Eyebrow>
          <h2 className="mt-4 max-w-3xl text-[40px] font-light tracking-[-0.03em] md:text-[56px]">
            We make inference work at city scale.
          </h2>
          <div className="mt-16 grid gap-12 md:grid-cols-3">
            {claims.map((c) => (
              <article key={c.k}>
                <p className="font-mono text-[12px] tracking-[0.14em] text-ember">
                  {c.k}
                </p>
                <h3 className="mt-3 text-[24px] font-light leading-snug tracking-[-0.02em]">
                  {c.t}
                </h3>
                <p className="mt-4 text-[16px] leading-relaxed text-stone">{c.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-parchment">
        <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-8">
          <Eyebrow>What you can do here</Eyebrow>
          <h2 className="mt-4 max-w-3xl text-[36px] font-light tracking-[-0.03em] md:text-[48px]">
            Four tools for one city hour.
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              {
                t: "Predict",
                d: "Choose date, time, and scenario (rain, accident, normal). See predicted speeds at named places like Palayam, Technopark, and Kowdiar. Then ask PPO for a start–end corridor.",
                href: "/predict",
              },
              {
                t: "Map",
                d: "Color the full Thiruvananthapuram road graph by predicted speed. Pick two places, generate a route, and compare shortest vs fastest vs balanced paths.",
                href: "/map",
              },
              {
                t: "Influence",
                d: "Focus on one place. See which nearby roads are strongly linked in the model — a heat map of connections, not jam colors.",
                href: "/influence",
              },
              {
                t: "Detect",
                d: "Upload a road photo. YOLOv8 counts cars, buses, bikes, and trucks so density can inform the next forecast.",
                href: "/detect",
              },
            ].map((item) => (
              <a
                key={item.t}
                href={item.href}
                className="rounded-[10px] bg-bone p-8 transition-colors hover:bg-surface"
              >
                <h3 className="text-[24px] font-light tracking-[-0.02em]">{item.t}</h3>
                <p className="mt-3 text-[16px] leading-relaxed text-stone">{item.d}</p>
                <p className="mt-4 font-mono text-[11px] tracking-[0.12em] uppercase text-ember">
                  Open {item.t} →
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bone">
        <div className="mx-auto max-w-[800px] px-5 py-16 md:px-8">
          <Eyebrow>About the speeds</Eyebrow>
          <h2 className="mt-4 text-[32px] font-light tracking-[-0.02em]">
            Not live Google traffic — demo forecasts you can trust to repeat.
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed text-stone">
            Speeds on Predict, Map, and Influence come from a deterministic demo
            predictor: same date, time, and scenario always produce the same road
            speeds. Rain and rush hour make corridors slower on purpose. The road
            layout and place names come from real OpenStreetMap data for
            Thiruvananthapuram. YOLO detection on uploaded photos is live for that
            image. Together, the site is a working lab for the capital’s graph —
            not a live CCTV feed of every junction.
          </p>
        </div>
      </section>

      <section className="bg-[#2a2a25] text-[#f3f3ee]">
        <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-8 md:py-28">
          <Eyebrow>Case</Eyebrow>
          <h2 className="mt-4 max-w-4xl text-[40px] font-light tracking-[-0.03em] md:text-[56px]">
            Thiruvananthapuram. Kerala’s capital, drawn from OpenStreetMap.

          </h2>
          <p className="mt-8 max-w-2xl text-[17px] leading-relaxed text-[#b8b8ae]">
            The graph is Palayam, MG Road, Kowdiar, Pattom, and the coastal
            approach — extracted with OSMnx, simulated with weather, density, and
            the ugly truth of peak hour. Against Dijkstra, the PPO agent cut
            travel time 10–25%. Against a lone LSTM, the hybrid model traded a
            little MAE for a map that actually routes.
          </p>
          <div className="mt-10 flex w-full min-w-0 flex-nowrap items-center gap-2 max-[361px]:gap-1.5 sm:gap-3">
            <Button
              href="/research"
              className="whitespace-nowrap max-[361px]:min-w-0 max-[361px]:flex-1 max-[361px]:px-3.5 max-[361px]:py-2 max-[361px]:text-[12px]"
            >
              Read the numbers
            </Button>
            <Button
              href="/technology"
              variant="ghost"
              className="border-[#69695d] text-on-dark whitespace-nowrap max-[361px]:min-w-0 max-[361px]:flex-1 max-[361px]:px-3.5 max-[361px]:py-2 max-[361px]:text-[12px]"
            >
              See the stack
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-parchment">
        <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                q: "The first time a dashboard told us a jam would exist before the cameras filled, we stopped arguing about sensors and started arguing about policy.",
                a: "Ops lead · municipal mobility",
              },
              {
                q: "It looks like a lab notebook because that is what a city is — a long experiment that should not surprise the people who live in it.",
                a: "Research partner · IISc-adjacent lab",
              },
            ].map((t) => (
              <blockquote key={t.a} className="rounded-[10px] bg-bone p-8">
                <p className="text-[40px] font-light leading-none text-ember">“</p>
                <p className="mt-2 text-[17px] leading-relaxed text-foreground">{t.q}</p>
                <footer className="mt-6 font-mono text-[12px] tracking-[0.1em] uppercase text-stone">
                  {t.a}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <ContentBand
        eyebrow="A morning in the capital"
        title="From Secretariat pulse to Technopark queue."
        body="Traffic is built around Thiruvananthapuram’s real geography: Fort markets, Palayam offices, Kowdiar residences, the medical college belt, Kazhakkoottam’s IT corridor, and the coastal approach to the airport."
        tone="bone"
        items={[
          {
            t: "07:30 · school & office rush",
            d: "MG Road and Palayam tighten. Predict with morning time + normal or heavy scenario to see place speeds drop.",
          },
          {
            t: "09:00 · rain on NH approach",
            d: "Switch scenario to rain, map Airport → Secretariat, compare shortest vs fastest. Time and distance diverge.",
          },
          {
            t: "18:00 · IT corridor outflow",
            d: "Technopark → Kesavadasapuram under heavy traffic. Influence near Kazhakkoottam shows which feeder roads are coupled.",
          },
          {
            t: "Camera check",
            d: "Upload a junction photo on Detect. Counts are live for that image; city speeds stay demo forecasts.",
          },
          {
            t: "Late night clear",
            d: "Clear scenario after 22:00 raises predicted speeds. Useful to show the model responds to clock and weather knobs.",
          },
          {
            t: "What not to claim",
            d: "Do not present demo speeds as live Google traffic. Say: real OSM graph + repeatable scenario forecasts.",
          },
        ]}
      />

      <PageFaq
        items={[
          {
            q: "Is this live traffic?",
            a: "Road layout and places are from OpenStreetMap. Speeds on Predict/Map/Influence are demo forecasts from date, time, and scenario. YOLO on Detect is live for the photo you upload.",
          },
          {
            q: "Where should I start?",
            a: "Predict a scenario, open Map with two places, then Influence near one of them. That three-step loop shows forecast → route → road links.",
          },
          {
            q: "Why Thiruvananthapuram?",
            a: "It is a real capital graph with secretariat pulse, coastal approaches, hills, and an IT corridor — harder and more honest than a toy grid.",
          },
          {
            q: "What do the research numbers mean?",
            a: "LSTM R² and PPO travel-time cuts are from the research track. The interactive site demonstrates the same loop with a lighter demo predictor so anyone can run it.",
          },
        ]}
      />

      <section className="bg-bone">
        <div className="mx-auto max-w-[1200px] px-5 py-24 text-center md:px-8">
          <Eyebrow>Start</Eyebrow>
          <h2 className="mx-auto mt-4 max-w-3xl text-[40px] font-light tracking-[-0.03em] md:text-[56px]">
            Ship the next hour of the city.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[16px] text-stone">
            Open the studio. Pick a corridor. Watch the graph attend. Then give
            the agent a destination.
          </p>
          <div className="mt-10 flex w-full min-w-0 flex-nowrap justify-center gap-2 max-[361px]:gap-1.5 sm:gap-3">
            <Button
              href="/contact"
              className="whitespace-nowrap max-[361px]:min-w-0 max-[361px]:flex-1 max-[361px]:px-3.5 max-[361px]:py-2 max-[361px]:text-[12px]"
            >
              Start building
            </Button>
            <Button
              href="/developers"
              variant="dark"
              className="whitespace-nowrap max-[361px]:min-w-0 max-[361px]:flex-1 max-[361px]:px-3.5 max-[361px]:py-2 max-[361px]:text-[12px]"
            >
              Read the API
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
