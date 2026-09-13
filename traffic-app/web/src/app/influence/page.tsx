import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { InfluenceStudio } from "@/components/influence-studio";
import { Prose } from "@/components/prose";
import { Eyebrow } from "@/components/eyebrow";
import { ContentBand, NumberedBand, PageFaq, QuoteBand, SplitEssay, StatStrip } from "@/components/page-content";

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
        lede="Pick a place in Thiruvananthapuram. About thirty nearby roads become a heat map of coupling. Deeper orange is a louder vote — not more jam. Map is speed. This page is rumor with a source you can point at."
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
            <h2>Attention, without the mysticism</h2>
            <p>
              GAT attention is a vote. Each road asks its neighbors how much of
              their present should become its future. This page is that vote as a
              spreadsheet you can point at. Deep orange is a loud vote. Pale is a
              neighbor who is topologically present but electorally quiet.
            </p>
            <h3>Thirty roads, not the whole capital</h3>
            <p>
              A city-scale attention tensor is not a public instrument. We clip
              to about thirty nearest OSM edges so a human can finish a sentence
              about Palayam without a PhD in heat maps. The R-index suffix exists
              because several edges share a place name. Uniqueness is courtesy.
            </p>
            <h3>Self-links and diagonals</h3>
            <p>
              Top-left after the labels is often a road affecting itself. That is
              not a bug. Memory of one’s own last speed is allowed. The
              interesting cells are the off-diagonal rumors: Connemara writing
              Palayam, a feeder writing a flyover, an industrial capillary
              inheriting the highway twelve minutes late.
            </p>
            <h2>How to brief Influence</h2>
            <p>
              “This is not jam. Map is jam. This is who is coupled near this
              place under the same demo hour.” If someone still says “why is
              everything orange,” they skipped the legend. Sit with them on one
              cell until the number means a sentence.
            </p>
          </Prose>
        </div>
      </section>

      <StatStrip
        items={[
          { v: "~30×30", l: "Local road matrix" },
          { v: "Deeper orange", l: "Stronger coupling" },
          { v: "Not jam", l: "Jam lives on Map" },
          { v: "R-index", l: "Edges near one place" },
        ]}
      />

      <SplitEssay
        eyebrow="Two legends"
        title="If you remember one rule, remember this."
        tone="parchment"
        left={
          <>
            <p>
              <strong>Map</strong> paints predicted speed: green free, orange
              tightening, red held. That is the hour as a city.
            </p>
            <p>
              <strong>Influence</strong> paints connection strength between
              nearby roads. A pale cell can sit on a very jammed road. A deep
              cell can sit on a quiet feeder that merely writes the future of a
              louder one.
            </p>
          </>
        }
        right={
          <>
            <p>
              Load Palayam, then East Fort, then Technopark. Neighborhoods have
              different coupling textures. Fort is a braid. Technopark is an
              outflow. Palayam is pulse. If all three matrices look identical,
              the focus failed.
            </p>
            <p>
              Speeds in the list under the grid are the same demo field as
              Predict. Coupling is derived from that field locally — a teaching
              attention, not a raw exported GAT tensor from a GPU run.
            </p>
          </>
        }
      />

      <NumberedBand
        eyebrow="Read one neighborhood"
        title="From search box to a single cell you can defend."
        steps={[
          {
            t: "Search a place",
            d: "Palayam, Kowdiar, Medical College. Dropdown after a few characters.",
          },
          {
            t: "Load heat map",
            d: "Wait for the grid. Read the guide box before you argue color.",
          },
          {
            t: "Find a deep cell",
            d: "Row is affected. Column is influencer. Say both names out loud.",
          },
          {
            t: "Check the list",
            d: "Place, highway type, distance, predicted km/h — so the matrix has geography.",
          },
          {
            t: "Open Map",
            d: "Same place as a pin. Confirm you have not confused coupling with speed.",
          },
          {
            t: "Change scenario",
            d: "If Predict was rain, reload Influence in that hour. The neighborhood should still be that neighborhood.",
          },
        ]}
      />

      <QuoteBand
        quote="Congestion is a rumor with a source. Influence is how we print the source instead of shouting at the whole map."
        attrib="Influence studio · GAT as a spreadsheet"
      />

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
          {
            t: "Self link",
            d: "A road may affect itself. That is memory, not vanity. Hunt the off-diagonals for rumor.",
          },
          {
            t: "Neighborhood texture",
            d: "Fort braid, Palayam pulse, Technopark outflow — matrices should not be identical.",
          },
          {
            t: "Demo hour",
            d: "Same date/time/scenario as Predict when you share a window. Otherwise a default demo set is minted.",
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
          {
            q: "Is this the raw GAT tensor?",
            a: "It is an attention-style local matrix for teaching and ops briefing. Research GAT lives in the training loop. Do not cite a cell as a published coefficient unless you exported weights.",
          },
          {
            q: "Why only ~30 roads?",
            a: "A human can finish a sentence about thirty neighbors. A capital-scale tensor is a lab artifact, not a public page.",
          },
        ]}
      />
    </>
  );
}
