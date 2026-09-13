import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { MapStudio } from "@/components/map-studio";
import { Prose } from "@/components/prose";
import { Eyebrow } from "@/components/eyebrow";
import { ContentBand, NumberedBand, PageFaq, QuoteBand, SplitEssay, StatStrip } from "@/components/page-content";

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
        lede="Pick start and end places in Thiruvananthapuram, choose a scenario, then generate. Full-city speed colors, a grey crow-flies line, and shortest / fastest / balanced routes — minutes as the grade, kilometres as the alibi. Jam lives here. Coupling lives on Influence."
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
            <h2>How to brief a map without lying</h2>
            <p>
              The full-city view is a sampled major-road canvas so the browser
              stays a notebook, not a GIS workstation. The route view is the
              argument: three policies on the same OSM geometry. Cards under the
              map report kilometres and estimated minutes. Minutes are the grade.
              Kilometres are the alibi.
            </p>
            <h3>Pins, grey line, dashed alternatives</h3>
            <p>
              Green START and black END are snapped places. The grey dashed line
              is Euclidean honesty — useful when someone claims “it’s only four
              kilometres.” Driving is never that line. Blue shortest, ember
              fastest, green balanced: three answers to three different questions.
              Mixing them in a sentence is how demos go soft.
            </p>
            <h3>Color discipline</h3>
            <p>
              On Map, color is predicted speed. On Influence, color is coupling.
              On Detect, color is vehicle class. If a jury asks “why is this road
              orange,” the answer is always which page they are on. We spent ember
              as a scarce highlighter. Do not spend it as wallpaper.
            </p>
            <h2>Thiruvananthapuram pairs that teach</h2>
            <p>
              <strong>Airport → Secretariat</strong> is rain and NH rumor.{" "}
              <strong>East Fort → Ulloor</strong> is market braid into hospital
              time. <strong>Kazhakkoottam → Pattom</strong> is the IT outflow.{" "}
              <strong>Kowdiar → Medical College</strong> is residential calm that
              inherits a jam late. Run each under normal and rain. Write down
              whether fastest and shortest still agree. Disagreement is the demo.
            </p>
            <h3>Performance, on purpose</h3>
            <p>
              Sampling major highways on the city canvas is not a missing-data
              scandal. The route polylines still follow the edges that matter for
              your trip. If you need every alley, you want a GIS export, not a
              public instrument.
            </p>
          </Prose>
        </div>
      </section>

      <StatStrip
        items={[
          { v: "Green", l: "≥ 25 km/h predicted" },
          { v: "Orange", l: "18–25 km/h" },
          { v: "Red", l: "Congested forecast" },
          { v: "Blue", l: "Fastest edge on view" },
        ]}
      />

      <SplitEssay
        eyebrow="Three questions, three paths"
        title="Shortest is geometry. Fastest is the hour. Balanced is diplomacy."
        tone="parchment"
        left={
          <>
            <p>
              A short road can be a trap. East Fort’s braid looks efficient until
              rain writes a queue onto the only narrow approach. Fastest uses the
              predicted speed field — the same demo hour Predict produced — so
              the path is allowed to detour in kilometres to save minutes.
            </p>
            <p>
              Balanced exists because operators hate heroic U-turns as much as
              they hate sitting still. It is the policy that can survive a
              committee that contains both a GIS analyst and a bus driver.
            </p>
          </>
        }
        right={
          <>
            <p>
              Generate once under normal, once under rain, once under accident.
              If the fastest path never moves, the scenario knob is decoration.
              If it moves and the grey line stays put, you have taught the
              difference between distance and time.
            </p>
            <p>
              Do not need Predict first — Map can mint a demo forecast — but
              sharing the same timestamp and scenario is how the three pages
              stay one rehearsal.
            </p>
          </>
        }
      />

      <NumberedBand
        eyebrow="Generate ritual"
        title="Five steps, then argue about minutes."
        steps={[
          {
            t: "Search start",
            d: "East Fort, Palayam, Airport — wait for OSM dropdown. Pins lie if you skip search.",
          },
          {
            t: "Search end",
            d: "Secretariat, Technopark, Medical College. Two named places, one clock.",
          },
          {
            t: "Pick a scenario",
            d: "Rain is the honest monsoon. Accident is the shock. Heavy is 18:00.",
          },
          {
            t: "Choose a primary style",
            d: "Fastest for time, shortest for distance, balanced when both stakeholders are in the room.",
          },
          {
            t: "Read the cards",
            d: "km and minutes for each alternative. Then open Influence on one pin to see coupling.",
          },
          {
            t: "Say the sentence",
            d: "“Predicted demo speeds on real OSM roads.” Then sit down.",
          },
        ]}
      />

      <QuoteBand
        quote="The grey line is the lie everyone believes. The ember path is the hour the city actually offers."
        attrib="Map studio · Thiruvananthapuram"
      />

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
          {
            t: "City canvas",
            d: "Sampled major roads so the notebook stays fast. Not every alley is inked.",
          },
          {
            t: "Route view",
            d: "Edges along your trip plus dashed alternatives. This is the argument.",
          },
          {
            t: "Minutes vs km",
            d: "Cards report both. Quote minutes when the question is arrival. Quote km when the question is geometry.",
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
          {
            q: "Is orange on Map the same as orange on Influence?",
            a: "No. Map orange is slower predicted speed. Influence orange is stronger coupling. Mixing legends is the most common demo error.",
          },
          {
            q: "Are these live GPS probes?",
            a: "No. Speeds are scenario forecasts. Geometry is OSM. Repeat the inputs; the colors should match.",
          },
        ]}
      />
    </>
  );
}
