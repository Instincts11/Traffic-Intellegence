import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { InfluenceStudio } from "@/components/influence-studio";
import { Prose } from "@/components/prose";
import { Eyebrow } from "@/components/eyebrow";
import { ContentBand, PageFaq } from "@/components/page-content";

export const metadata: Metadata = {
  title: "Influence",
  description:
    "Heat map of road-to-road links near a Thiruvananthapuram place. Stronger color = stronger connection in the prediction model — not more traffic jam.",
};

export default function InfluencePage() {
  return (
    <>
      <PageHero
        kicker="Influence"
        title="Which roads affect each other."
        lede="Pick a place in Thiruvananthapuram. The heat map shows which nearby roads are strongly linked in the speed model. Deeper orange = stronger link — not more jam."
        primary={{ href: "/predict", label: "Predict first" }}
        secondary={{ href: "/map", label: "Open map" }}
      />
      <section className="bg-parchment">
        <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-8">
          <InfluenceStudio />
        </div>
      </section>
      <section className="bg-bone">
        <div className="mx-auto max-w-[800px] px-5 py-16 md:px-8">
          <Prose>
            <Eyebrow>In plain words</Eyebrow>
            <h2>What does this page do?</h2>
            <p>
              You choose a place — Palayam, Technopark, Kowdiar, Medical College.
              The page finds about 30 roads closest to that place, then draws a
              color table of how strongly those roads are linked when predicting
              speed.
            </p>
            <h3>What is the heat map?</h3>
            <p>
              A heat map here is a grid. Each row is a road being affected. Each
              column is a road that may affect it. One colored box = one pair.
            </p>
            <h3>What does stronger / darker color mean?</h3>
            <p>
              <strong>Deeper orange + higher number = stronger link.</strong> If
              road B’s predicted speed changes, road A’s prediction is expected to
              move with it more.{" "}
              <strong>Pale box + lower number = weaker link.</strong>
            </p>
            <p>
              This is <em>not</em> more cars or more jam. Jam and speed colors live
              on the Map page (green / orange / red). Here color only means “how
              connected in the model.”
            </p>
            <h3>How to read one cell</h3>
            <p>
              Example: row “Palayam · primary” and column “Connemara · …” with
              value 0.09 means Connemara affects Palayam’s predicted speed more
              than a pale 0.03 cell nearby. Top-left after the labels is often a
              road affecting itself (self link).
            </p>
            <h3>How to use it</h3>
            <p>
              1. Search a place (dropdown appears after you type). 2. Click Load
              heat map. 3. Read the guide box. 4. Scan for deep orange cells. 5.
              Use the road list under the grid for place name, road type, distance,
              and predicted km/h.
            </p>
            <h3>Where the speeds come from</h3>
            <p>
              Same demo forecasts as Predict and Map: date, time, and scenario —
              not live sensors. If you already ran Predict, Influence reuses that
              window; otherwise it generates a default demo set.
            </p>
            <h2>Why this matters in Thiruvananthapuram</h2>
            <p>
              A jam near East Fort does not stay on East Fort. It can rewrite
              speeds toward Overbridge and Palayam. Influence makes that rumor
              visible for one neighborhood at a time, so operators and students
              can see who is coupled to whom before they look at a route.
            </p>
          </Prose>
        </div>
      </section>

      <ContentBand
        eyebrow="Worked example"
        title="Reading one cell without fear."
        body="Suppose you loaded Influence near Palayam. Rows and columns are nearby roads labeled with place and road type."
        tone="parchment"
        items={[
          {
            t: "Row = affected",
            d: "“Palayam · primary · R12” means we are asking about that road’s predicted speed.",
          },
          {
            t: "Column = influencer",
            d: "“Connemara · primary · R45” means we measure how much that road pulls on the row.",
          },
          {
            t: "High number / deep orange",
            d: "Strong link: if the column road’s forecast moves, the row road is expected to move with it more.",
          },
          {
            t: "Low number / pale",
            d: "Weak link: mostly independent in this local matrix.",
          },
          {
            t: "Not jam",
            d: "A deep cell is not “more traffic.” Map page green/orange/red is for speed. Influence is for connection.",
          },
          {
            t: "List under the grid",
            d: "Shows place, highway type, distance from focus, and predicted km/h for each road in the matrix.",
          },
        ]}
      />

      <PageFaq
        dark
        items={[
          {
            q: "Does darker always mean stronger?",
            a: "After the color fix: pale = weaker, deep orange = stronger. Also trust the number in the cell — higher means stronger link.",
          },
          {
            q: "Why are many labels similar?",
            a: "Several OSM edges can sit near the same place name. The R-index suffix keeps each column unique.",
          },
          {
            q: "What if I load with no place?",
            a: "The API defaults around city center so you still get a matrix. Prefer searching a place for a meaningful focus.",
          },
          {
            q: "Same speeds as Map?",
            a: "Yes when you share the last prediction window. Otherwise Influence builds a default demo forecast first.",
          },
        ]}
      />
    </>
  );
}
