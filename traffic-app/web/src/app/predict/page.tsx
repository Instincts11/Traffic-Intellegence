import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { PredictStudio } from "@/components/predict-studio";
import { Prose } from "@/components/prose";
import { Eyebrow } from "@/components/eyebrow";
import { ContentBand, PageFaq } from "@/components/page-content";

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
        lede="Set date, time, and scenario for Thiruvananthapuram. See predicted speeds at named places, then choose start and end for a PPO corridor recommendation."
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
              image. Use this studio to think and demo; treat numbers as a
              consistent simulation on a real capital-city graph.
            </p>
          </Prose>
        </div>
      </section>

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
        ]}
      />
    </>
  );
}
