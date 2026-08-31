import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { MapStudio } from "@/components/map-studio";
import { Prose } from "@/components/prose";
import { Eyebrow } from "@/components/eyebrow";
import { ContentBand, PageFaq } from "@/components/page-content";

export const metadata: Metadata = {
  title: "Map",
  description:
    "Full Thiruvananthapuram traffic map colored by predicted speed, with start/end markers, direct line, and shortest / fastest / balanced routes.",
};

export default function MapPage() {
  return (
    <>
      <PageHero
        kicker="Map"
        title="The graph, drawn as a city."
        lede="Pick start and end places in Thiruvananthapuram, choose a scenario, then generate. You get the full city speed map plus a clear route view between your two places."
        primary={{ href: "/predict", label: "Run prediction first" }}
        secondary={{ href: "/influence", label: "Open influence" }}
      />
      <section className="bg-parchment">
        <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-8">
          <MapStudio />
        </div>
      </section>
      <section className="bg-bone">
        <div className="mx-auto max-w-[800px] px-5 py-16 md:px-8">
          <Prose>
            <Eyebrow>How to use this page</Eyebrow>
            <h2>Three maps, one trip.</h2>
            <p>
              1. Search an OSM place for start (example: East Fort). 2. Search an
              end place (example: Ulloor or Technopark). 3. Pick a scenario such
              as normal or rain. 4. Choose primary route style — fastest,
              shortest, or balanced. 5. Click Generate maps.
            </p>
            <h3>What you will see</h3>
            <p>
              <strong>Full city</strong> — major roads colored by predicted speed.
              Green is 25 km/h and above. Orange is 18–25. Red is slower. Blue is
              the fastest road on that view.
            </p>
            <p>
              <strong>Direct path</strong> — a grey dashed line straight from start
              to end, with green START and black END pins. That is crow-flies
              distance, not the driving path.
            </p>
            <p>
              <strong>Your route</strong> — roads along the recommended drive, plus
              colored dashed alternatives: shortest (blue), fastest (ember),
              balanced (green). Cards under the map list km and estimated minutes.
            </p>
            <Eyebrow>Legend</Eyebrow>
            <h2>Colors are speed or route type — not influence.</h2>
            <p>
              On this page, road colors mean predicted speed. Influence-page colors
              mean connection strength between roads. Do not mix the two legends.
            </p>
            <h3>Where the speeds come from</h3>
            <p>
              Speeds are demo forecasts from date, time, and scenario — not live
              GPS probes. The road lines and place coordinates come from
              OpenStreetMap. Change rain or accident and regenerate to see slower
              corridors and different fastest paths.
            </p>
            <h3>Useful Thiruvananthapuram pairs to try</h3>
            <p>
              East Fort → Ulloor · Palayam → Technopark · Airport → Secretariat ·
              Kowdiar → Medical College · Kazhakkoottam → Pattom. Compare shortest
              vs fastest under rain to see why time and distance disagree.
            </p>
          </Prose>
        </div>
      </section>

      <ContentBand
        eyebrow="Map glossary"
        title="Words you will see on this page."
        tone="parchment"
        items={[
          {
            t: "Predicted speed",
            d: "Demo km/h for a road under the chosen time and scenario. Not a live probe.",
          },
          {
            t: "Direct / grey line",
            d: "Straight line between pins. Useful for distance; not a driveable path.",
          },
          {
            t: "Shortest route",
            d: "Minimizes driving distance on the OSM graph.",
          },
          {
            t: "Fastest route",
            d: "Minimizes estimated time using predicted speeds (traffic-aware).",
          },
          {
            t: "Balanced route",
            d: "Mix of distance and time so the path is neither the longest detour nor the slowest short cut.",
          },
          {
            t: "Scenario",
            d: "Knob such as rain or accident that regenerates speeds before routing.",
          },
        ]}
      />

      <PageFaq
        dark
        items={[
          {
            q: "Why is the grey line not on the roads?",
            a: "It is the direct (crow-flies) path between start and end. Driving paths are the colored dashed lines that follow OSM roads.",
          },
          {
            q: "Why do fastest and shortest differ?",
            a: "A short road can be slow. Fastest uses predicted speeds; shortest ignores speed and only counts kilometres.",
          },
          {
            q: "Why are some roads missing?",
            a: "The full-city view samples major highways for performance. The route view focuses on edges along your path.",
          },
          {
            q: "Do I need Predict first?",
            a: "Helpful but not required. Map can generate a demo forecast for the scenario you pick if none is stored yet.",
          },
        ]}
      />
    </>
  );
}
