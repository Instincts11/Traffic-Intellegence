import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { PredictStudio } from "@/components/predict-studio";
import { Prose } from "@/components/prose";
import { Eyebrow } from "@/components/eyebrow";
import { ContentBand, NumberedBand, PageFaq, QuoteBand, SplitEssay, StatStrip } from "@/components/page-content";

export const metadata: Metadata = {
  title: "Predict",
  description:
    "Predict place-level speeds and PPO corridors for Thiruvananthapuram — date, time, scenario, start and end places.",
};

export default function PredictPage() {
  return (
    <>
      <PageHero
        kicker="Prediction studio"
        title="Watch the next hour arrive early."
        lede="Set date, time, and scenario for Thiruvananthapuram. Ranked place speeds at Palayam, Kowdiar, Technopark, Medical College. Then choose start and end for a PPO corridor — named in English, graded in minutes, repeatable whenever the same hour is asked again."
        primary={{ href: "/map", label: "Open the map" }}
        secondary={{ href: "/research", label: "Error tables" }}
      />

      <section className="bg-parchment">
        <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-8">
          <PredictStudio />
        </div>
      </section>

      <section className="bg-bone">
        <div className="mx-auto max-w-[800px] px-5 py-20 md:px-8">
          <Prose>
            <Eyebrow>How to use this</Eyebrow>
            <h2>Two sections, one city hour.</h2>
            <p>
              <strong>Hybrid forecast</strong> — pick date, time, and scenario
              (normal, rain, event, accident, heavy, clear). Press Predict. You
              get ranked speeds for places across Thiruvananthapuram: Palayam,
              Kowdiar, Technopark, Medical College, and more.
            </p>
            <p>
              <strong>PPO route</strong> — search start and end places (OSM-backed
              list with debounce). The agent recommends the best corridor between
              them using the latest predicted speeds, and names the places in plain
              language — not only raw road IDs.
            </p>
            <h3>What the scenarios do</h3>
            <p>
              Normal is the baseline. Rain and heavy traffic lower speeds. Accident
              drops them further around the graph. Clear raises them. The same
              inputs always produce the same demo forecast, so demos and reports
              stay repeatable.
            </p>
            <h3>Where speed comes from</h3>
            <p>
              This running app uses a lightweight demo predictor keyed by date,
              time, and scenario — not live city sensors. It is built to feel like
              peak-hour and weather effects on the real OSM graph. The full
              GAT–LSTM stack exists in the project for heavier lab runs; this page
              is the interactive face of that idea.
            </p>
            <h3>What the numbers mean</h3>
            <p>
              Place cards show km/h at the nearest snapped road. Green-ish values
              are freer flow; lower numbers are congested. After PPO, the note
              describes the recommended corridor between your two places and the
              predicted speed along that recommendation.
            </p>
            <h2>After you believe the forecast</h2>
            <p>
              Open Map and generate the same start–end under the same scenario to
              see the speeds drawn on the city. Open Influence and load a heat map
              near one of your places to see which nearby roads are strongly linked
              in the model. Detect can add a camera count when you have a photo.
            </p>
            <h2>Limits we label</h2>
            <p>
              Speeds are not live Google traffic. Places come from OSM plus a
              curated list. YOLO is separate and only runs when you upload an
              image on Detect. Use this studio to think and demo; treat numbers as
              a consistent simulation on a real capital-city graph.
            </p>
            <h2>A corridor is a story with a clock</h2>
            <p>
              Palayam at 09:10 is not Palayam at 21:40. The demo predictor encodes
              that grammar: morning tightening, rain as a multiplier, accident as a
              harsher drop, clear as relief. If you need a slide that “looks live,”
              you will be disappointed on purpose. If you need a slide that a
              committee can rerun next Tuesday, this is the instrument.
            </p>
            <h3>Hybrid forecast, in practice</h3>
            <p>
              Ranked place cards are snapped to the nearest OSM road. A high km/h
              is freer flow; a low number is the city holding its breath. Sort
              mentally by the commute you care about — Technopark is not a vanity
              pin; Medical College is not an afterthought. The list is a census of
              the hour, not a leaderboard of neighborhoods.
            </p>
            <h3>PPO corridor, in practice</h3>
            <p>
              Start and end are places, not raw edge IDs. The agent recommends a
              corridor using the latest predicted speeds for that timestamp and
              scenario. The note should speak Kowdiar and Pattom, not only R-indexes.
              If the Flask sidecar is asleep, the studio still emits a
              PPO-style corridor from the same demo field so the page never dies
              as HTML.
            </p>
            <h3>How this page talks to Map and Influence</h3>
            <p>
              Predict writes the hour. Map paints it. Influence asks which nearby
              roads are coupled when that hour is believed. Running all three on
              the same scenario is the difference between a screenshot and a
              rehearsal.
            </p>
            <h2>What a good demo sounds like</h2>
            <p>
              “On this OSM graph of Thiruvananthapuram, with 09:00 rain, Palayam
              slows and the Airport → Secretariat fastest path diverges from the
              shortest. Here is the corridor the policy prefers. These speeds are
              scenario forecasts, not live probes. The research MAE/R² are on the
              Research page.” That paragraph is the product.
            </p>
          </Prose>
        </div>
      </section>

      <StatStrip
        tone="dark"
        items={[
          { v: "6", l: "Scenario knobs" },
          { v: "Same in → same out", l: "Deterministic demo" },
          { v: "OSM places", l: "Nominatim + catalog" },
          { v: "PPO note", l: "Named corridor, not IDs" },
        ]}
      />

      <SplitEssay
        eyebrow="Two instruments"
        title="Forecast is a census. Routing is a decision."
        left={
          <>
            <p>
              <strong>Hybrid forecast</strong> answers: how fast will named places
              move in this hour? It is the city’s pulse taken at Palayam,
              Kowdiar, Technopark, Ulloor, East Fort. Without it, PPO has nothing
              honest to minimize.
            </p>
            <p>
              Scenarios are policy language. Rain is monsoon honesty. Accident is
              a shock. Heavy is the 18:00 IT outflow. Clear is the night the
              graph remembers how to breathe. Normal is the control.
            </p>
          </>
        }
        right={
          <>
            <p>
              <strong>PPO route</strong> answers: given those speeds, which
              corridor should a vehicle rehearse? Dijkstra photographs distance.
              The agent rehearses time. The recommended path can look wrong on
              paper and right on a clock.
            </p>
            <p>
              Copy the place names into Map. Generate under the same scenario.
              If the studio and the map disagree, you found a bug. If they
              agree, you found a demo.
            </p>
          </>
        }
      />

      <NumberedBand
        tone="parchment"
        eyebrow="Studio ritual"
        title="Five minutes, six proofs."
        body="Each step is a claim you can show a skeptical engineer without a GPU."
        steps={[
          {
            t: "Lock the clock",
            d: "Pick a date and 09:00. Everything downstream inherits this hour.",
          },
          {
            t: "Rain, then clear",
            d: "Predict twice. Technopark and Palayam should move. If they do not, the knob is broken.",
          },
          {
            t: "Name two places",
            d: "East Fort → Secretariat, or Airport → Palayam. Search until OSM places appear.",
          },
          {
            t: "Ask PPO",
            d: "Read the corridor note. It should be English place names and a predicted speed, not a mystery index.",
          },
          {
            t: "Repeat once",
            d: "Same inputs, same ranked speeds. Determinism is the anti-magic.",
          },
          {
            t: "Hand off",
            d: "Open Map with the same pair. Open Influence on one endpoint. The loop is the product.",
          },
        ]}
      />

      <QuoteBand
        quote="Dijkstra is a photograph. The agent is a rehearsal. Predict exists so the rehearsal has an hour to believe."
        attrib="Prediction studio · Traffic"
      />

      <ContentBand
        eyebrow="Sample workflows"
        title="Three demos you can run in five minutes."
        tone="parchment"
        items={[
          {
            t: "Rain vs clear",
            d: "Predict 09:00 rain, note Technopark speed. Switch to clear, predict again. Speeds should rise — same places, different scenario.",
          },
          {
            t: "Office commute",
            d: "PPO from East Fort to Secretariat at 10:00 normal. Copy the place names into Map and generate for the same pair.",
          },
          {
            t: "IT corridor",
            d: "Predict heavy traffic, then PPO Kazhakkoottam → Pattom. Check the recommended corridor note uses real place names.",
          },
          {
            t: "Medical belt",
            d: "Forecast near Medical College / Ulloor. Lower evening speeds show rush-hour logic in the demo predictor.",
          },
          {
            t: "Airport run",
            d: "Airport → Palayam under accident scenario. Expect harsher speeds; then open Influence at Airport to see local road links.",
          },
          {
            t: "Repeatability check",
            d: "Run the same date/time/scenario twice. Ranked place speeds should match — that proves the demo is deterministic.",
          },
          {
            t: "Secretariat pulse",
            d: "Morning normal vs evening heavy at Palayam / Statue. The clock is a feature, not a timestamp decoration.",
          },
          {
            t: "Two-wheeler city",
            d: "Forecasts here are speeds, not mode share. For mix, Detect a junction photo — cars, trucks, bikes labeled separately.",
          },
          {
            t: "What to say out loud",
            d: "“Scenario forecast on real OSM.” Never “live TVM traffic.” Research MAE lives on another page.",
          },
        ]}
      />

      <PageFaq
        dark
        items={[
          {
            q: "Why do place speeds change with scenario?",
            a: "Rain, accident, and heavy traffic lower the base speed field on purpose. Clear raises it. That is how you demo policy without live sensors.",
          },
          {
            q: "What does PPO need?",
            a: "A start place and an end place. It uses the latest prediction window for that timestamp and scenario when available.",
          },
          {
            q: "Can I search any OSM place?",
            a: "Yes — type at least a couple of characters. Results come from Nominatim plus a cached Overpass catalog for Thiruvananthapuram.",
          },
          {
            q: "Is the chart real validation error?",
            a: "Treat on-screen series as a studio instrument. Published MAE/R² live on Research for the trained model families.",
          },
          {
            q: "The API returned HTML / 502. Is Predict broken?",
            a: "The hosted Flask sidecar can sleep. The studio falls back to the same deterministic demo field so you still get place speeds and a corridor — not a JSON parse error.",
          },
          {
            q: "Is this the GAT–LSTM model?",
            a: "The public studio is the interactive face of that idea. Full hybrid weights belong to the research track. Do not cite demo km/h as the MAE table.",
          },
        ]}
      />
    </>
  );
}
