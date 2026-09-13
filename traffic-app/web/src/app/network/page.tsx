import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { NetworkCanvas } from "@/components/network-canvas";
import { Prose } from "@/components/prose";
import { Eyebrow } from "@/components/eyebrow";
import { ContentBand, NumberedBand, PageFaq, QuoteBand, SplitEssay, StatStrip } from "@/components/page-content";

export const metadata: Metadata = {
  title: "Network",
  description:
    "Interactive Three.js graph of urban topology and GAT-style attention, modeled on Thiruvananthapuram’s OSM drive network.",
};

export default function NetworkPage() {
  return (
    <>
      <PageHero
        kicker="Network"
        title="The city as a graph you can hold."
        lede="Click a node. Watch attention light the rumor. This is not a street map for tourists. It is the adjacency the model believes — 250 intersections, 598 segments, Ember for the edge that matters."
        primary={{ href: "/predict", label: "Forecast a corridor" }}
        secondary={{ href: "/research", label: "Why 250 / 598" }}
      />

      <section className="bg-[#1f1f1b] px-5 py-12 md:px-8">
        <div className="mx-auto max-w-[1200px]">
          <NetworkCanvas />
        </div>
      </section>

      <section className="bg-parchment">
        <div className="mx-auto grid max-w-[1200px] gap-6 px-5 py-16 md:grid-cols-3 md:px-8">
          {[
            ["250", "Nodes extracted from OSM. Intersections, not landmarks."],
            ["598", "Directed-enough segments for industrial last mile and the highway pin."],
            ["5 min", "The heartbeat. Coarser is policy. Finer is a sensor you do not have."],
          ].map(([n, d]) => (
            <article key={n} className="rounded-[10px] bg-bone p-8">
              <p className="text-[40px] font-light tracking-[-0.03em]">{n}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-stone">{d}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-bone">
        <div className="mx-auto max-w-[800px] px-5 py-20 md:px-8">
          <Prose>
            <Eyebrow>How to look</Eyebrow>
            <h2>Attention is a rumor with a source.</h2>
            <p>
              When you select a node, the scene does what GAT does: it raises the
              coefficient on some neighbors and lets others go dim. That is the
              opposite of a heat map that paints everything urgent. Urgency is a
              scarce color. We spent it on Ember.
            </p>
            <p>
              Thiruvananthapuram is a capital hung on Palayam and the coast. The
              interesting failures are not the highway’s average speed. They are
              the industrial capillaries that inherit a jam twenty minutes late
              and keep it after the highway has forgotten. Spatial attention is
              how that delay becomes a first-class feature.
            </p>
            <h3>What Three.js is doing here</h3>
            <p>
              The public site cannot ship a 10-million-row tensor to a laptop fan.
              It can ship a faithful metaphor: nodes, edges, a slow orbit, a
              selected attention set. The scientific map — Folium, real geometry —
              still lives on the Flask runtime. Both are true. One is for the
              jury. One is for the GIS team.
            </p>
            <h3>Reading congestion as topology</h3>
            <p>
              A queue is a path. A gridlock is a cycle with too much flow. A
              flyover is a chord that sometimes lies about capacity. If your
              routing algorithm cannot see those as graph events, it is a travel
              agent. Traffic is not a travel agent.
            </p>
            <h2>From this page to a path</h2>
            <p>
              Predicted speeds rewrite edge weights. PPO walks the same object you
              are orbiting. The orange vehicles on the home scene are the discrete
              version of that walk. If this feels like a lab instrument, good. It
              was supposed to.
            </p>
            <h2>How this relates to Map and Influence</h2>
            <p>
              <strong>Network</strong> is the abstract graph — nodes and attention
              as a teaching instrument. <strong>Map</strong> paints real OSM
              geometry with predicted speeds and routes.{" "}
              <strong>Influence</strong> zooms to one place and shows a heat map of
              road-to-road links. Use Network to understand the idea; Map to plan a
              trip; Influence to see who is coupled near Palayam or Technopark.
            </p>
            <h3>About the numbers 250 / 598</h3>
            <p>
              Those figures describe the educational subgraph used in early
              research storytelling. The live Flask map may load a larger
              Thiruvananthapuram edge file (tens of thousands of OSM segments).
              Both tell the same story: the city is a graph, not a single street.
            </p>
            <h3>Where speed enters</h3>
            <p>
              This canvas emphasizes topology and attention. Speed colors and
              place-to-place routing live on Map after you generate a forecast.
              Speeds themselves are demo predictions keyed by time and scenario,
              on top of real OSM roads.
            </p>
            <h2>A teaching graph, not a tourist map</h2>
            <p>
              Click a node. Ember raises some neighbors and lets others go dim.
              That scarcity is the lesson: if everything glows, attention meant
              nothing. Orbit slowly. This is an instrument, not a game. When you
              need streets that a bus can drive, leave the metaphor and open Map.
            </p>
            <h3>Queue, cycle, chord</h3>
            <p>
              A queue is a path with too much flow. Gridlock is a cycle that
              cannot empty. A flyover is a chord that sometimes lies about
              capacity. If your routing algorithm cannot see those as graph
              events, it is a travel agent. Traffic is not a travel agent.
            </p>
            <h3>250 / 598 versus 15.4k / 35.3k</h3>
            <p>
              The canvas is sized for a laptop fan and a jury. The shipped OSM
              extract is larger — tens of thousands of intersections and
              segments within the capital radius. Both tell the same story: the
              city is a graph, not a single street with a speed limit painted on
              it.
            </p>
          </Prose>
        </div>
      </section>

      <StatStrip
        tone="dark"
        items={[
          { v: "250", l: "Teaching nodes" },
          { v: "598", l: "Teaching segments" },
          { v: "15.4k", l: "OSM intersections" },
          { v: "35.3k", l: "OSM segments" },
        ]}
      />

      <SplitEssay
        eyebrow="Two maps of the same idea"
        title="Three.js is the metaphor. Leaflet is the street."
        left={
          <>
            <p>
              Network cannot ship a 10-million-row tensor to a fan. It can ship
              nodes, edges, a slow orbit, a selected attention set. Ember is the
              scarce vote. Dim is still connected — just not loud.
            </p>
            <p>
              Use this page to explain GAT to a person who should not have to
              read a paper first. Then stop explaining and generate a corridor.
            </p>
          </>
        }
        right={
          <>
            <p>
              Map is real OSM geometry, predicted demo speeds, shortest / fastest
              / balanced. Influence is a 30×30 coupling matrix near a named
              place. Network is the abstract cousin of both.
            </p>
            <p>
              If WebGL context is lost (some browsers, some tabs), reload. The
              scientific Folium map on Flask does not depend on this canvas.
            </p>
          </>
        }
      />

      <NumberedBand
        tone="parchment"
        eyebrow="How to look"
        title="Hold the city. Then put it down."
        steps={[
          {
            t: "Orbit",
            d: "Drag to rotate. Scroll to zoom. Slow on purpose.",
          },
          {
            t: "Select",
            d: "Click an intersection. Watch which neighbors take the ember vote.",
          },
          {
            t: "Read dim",
            d: "Dim is not missing. Dim is a quiet neighbor in the adjacency.",
          },
          {
            t: "Name the event",
            d: "Queue, cycle, chord — say which graph event you think you are seeing.",
          },
          {
            t: "Leave for Map",
            d: "When you need pins and minutes, the metaphor has done its job.",
          },
          {
            t: "Leave for Influence",
            d: "When you need a spreadsheet of coupling, open the heat map near Palayam.",
          },
        ]}
      />

      <QuoteBand
        quote="Urgency is a scarce color. We spent it on Ember. If everything glowed, nothing would mean influence."
        attrib="Network · teaching graph"
      />

      <ContentBand
        eyebrow="Controls"
        title="How to use the 3D graph."
        tone="parchment"
        items={[
          {
            t: "Orbit",
            d: "Drag to rotate. Scroll to zoom. The slow motion is intentional — a lab instrument, not a game.",
          },
          {
            t: "Select a node",
            d: "Click an intersection. Ember highlights show which neighbors get attention in the metaphor.",
          },
          {
            t: "Read dim edges",
            d: "Dim neighbors are still connected in the graph; they are simply not the loudest vote right now.",
          },
          {
            t: "Then open Map",
            d: "When you want real street geometry and speed colors, leave this metaphor and generate a Leaflet map.",
          },
          {
            t: "250 / 598",
            d: "Educational subgraph for the canvas. Live extracts are larger. Same thesis.",
          },
          {
            t: "No speed legend here",
            d: "This canvas is topology and attention. Speed colors live on Map after you generate.",
          },
        ]}
      />

      <PageFaq
        dark
        items={[
          {
            q: "Is this the full OSM file?",
            a: "No. It is a teaching subgraph sized for the browser. Map/Flask may load a much larger edge CSV.",
          },
          {
            q: "Why Ember only on some links?",
            a: "Attention is scarce on purpose. If everything glowed, nothing would mean influence.",
          },
          {
            q: "Does clicking a node change Predict?",
            a: "No. Network is a metaphor. Predict and Map hold the hour and the route.",
          },
          {
            q: "Why is the camera orbiting?",
            a: "So the graph reads as an instrument at rest, not a paused video game. You can still drag.",
          },
        ]}
      />
    </>
  );
}
