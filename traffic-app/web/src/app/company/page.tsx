import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Prose } from "@/components/prose";
import { Eyebrow } from "@/components/eyebrow";
import { Button } from "@/components/button";
import { ContentBand, NumberedBand, PageFaq, QuoteBand, SplitEssay, StatStrip } from "@/components/page-content";

export const metadata: Metadata = {
  title: "Company",
  description:
    "Traffic is a research-built intelligence layer for urban movement, with roots in Thiruvananthapuram, Kerala and a San Francisco standard for craft.",
};

export default function CompanyPage() {
  return (
    <>
      <PageHero
        kicker="Company"
        title="A lab notebook that ships."
        lede="We are not a marketplace for rides. We are not a paint job on Dijkstra. We are the team that treated congestion as a sequence, a graph, a picture, and a policy — then put all four on the same desk."
        primary={{ href: "/contact", label: "Work with us" }}
        secondary={{ href: "/research", label: "Read the work" }}
      />

      <section className="bg-[#2d2f33] text-[#f3f3ee]">
        <div className="mx-auto max-w-[1200px] px-5 py-20 md:px-8">
          <Eyebrow>Places</Eyebrow>
          <div className="mt-8 grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-[36px] font-light tracking-[-0.03em]">
                Thiruvananthapuram
              </h2>
              <p className="mt-4 max-w-md text-[16px] leading-relaxed text-[#b8b8ae]">
                The graph is here. The 60 days are here. The flyover that lies and
                the industrial road that does not — here. Kerala is not a
                backdrop. It is the dataset.
              </p>
            </div>
            <div>
              <h2 className="text-[36px] font-light tracking-[-0.03em]">
                San Francisco
              </h2>
              <p className="mt-4 max-w-md text-[16px] leading-relaxed text-[#b8b8ae]">
                The standard of craft is here. Parchment, not sterile white.
                Space Grotesk at 300, not a shout. One orange. If it would not
                hang in a South Park studio, it does not ship.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-bone">
        <div className="mx-auto max-w-[800px] px-5 py-20 md:px-8">
          <Prose>
            <Eyebrow>Why we exist</Eyebrow>
            <h2>Reactive maps are a polite way to be late.</h2>
            <p>
              Every major navigation product will tell you about the jam you can
              already see through the windshield. That is a weather app for a
              storm that has started. We wanted the hour before — and a policy
              that does something with it besides a red polyline.
            </p>
            <p>
              The work began as a hybrid deep-learning framework: LSTM, GAT,
              YOLOv8, PPO. It remains that. The company is the decision to treat
              the framework as infrastructure, not a semester.
            </p>
            <h2>How we design</h2>
            <p>
              Groq taught the industry that speed can look like paper. We took
              that lesson literally. Bone and parchment for reading. Graphite
              bands for proof. Ember reserved for the thing you press. IBM Plex
              Mono for the serial numbers. No drop shadows. No decorative chrome.
              Variants — parchment and obsidian — instead of a carnival of
              themes.
            </p>
            <h3>What we will not do</h3>
            <p>
              We will not hide a worse route behind a prettier chart. We will not
              pretend a synthetic grid is a city. We will not use vapor pink as
              a personality. It exists for a rare mark, then it sits down.
            </p>
            <div id="labs" className="scroll-mt-24">
              <h2>Labs</h2>
              <p>
                The lab still runs Flask, PyTorch, OSMnx, Folium. The public face
                runs Next.js 16, Tailwind v4, React 19, Three.js. Both directories
                live under traffic-app because splitting the story from the
                experiment is how numbers go soft.
              </p>
            </div>
            <h2>People</h2>
            <p>
              Operators, researchers, and engineers in the same review. If a
              sentence cannot survive all three, it does not go on the site. If a
              model cannot change a path, it does not go in the loop.
            </p>
            <p>
              We hire for taste in residuals and taste in type. If you have only
              one, teach the other here.
            </p>
            <h2>What we build for Thiruvananthapuram</h2>
            <p>
              Named places from OpenStreetMap. A drive graph you can color by
              predicted speed. Scenarios for rain and incidents. Routes that can
              optimize time, not only distance. An influence view that shows which
              nearby roads are linked. A detect rail for camera density. The
              capital is the case study; the loop is the product.
            </p>
            <h3>Honesty about data</h3>
            <p>
              Interactive speeds in this deployment are demo forecasts (date + time
              + scenario), not a live city feed. Geometry and places are real OSM.
              Detection on uploaded photos is real inference for that image. We
              label that on purpose so students and operators do not confuse a lab
              with a municipal CCTV wall.
            </p>
            <h2>Taste, as a hiring filter</h2>
            <p>
              We hire for residuals and type. If you have only one, teach the
              other here. A sentence that cannot survive an operator, a
              researcher, and an engineer does not go on the site. A model that
              cannot change a path does not go in the loop.
            </p>
            <h3>What we will not become</h3>
            <p>
              A marketplace for rides. A paint job on Dijkstra. A neon dashboard
              that needs a legend to apologize. A detector that issues fines. A
              company that hides LSTM’s prettier MAE to advertise the hybrid.
            </p>
            <h3>Craft, named</h3>
            <p>
              Bone and parchment for reading. Graphite bands for proof. Ember
              reserved for the thing you press. IBM Plex Mono for serial numbers.
              No drop shadows. Variants — parchment and obsidian — instead of a
              carnival of themes. If it would not hang in a quiet studio, it
              does not ship.
            </p>
          </Prose>
          <div className="mt-12">
            <Button href="/contact">Start a conversation</Button>
          </div>
        </div>
      </section>

      <StatStrip
        items={[
          { v: "TVM", l: "The graph" },
          { v: "SF craft", l: "The standard" },
          { v: "4 models", l: "One desk" },
          { v: "1 orange", l: "Ember only" },
        ]}
      />

      <SplitEssay
        eyebrow="Two cities, one notebook"
        title="Kerala is the dataset. Quiet type is the discipline."
        left={
          <>
            <p>
              Thiruvananthapuram is not a backdrop. The flyover that lies, the
              industrial road that does not, the school-run at Palayam, the
              Technopark outflow — that is the work. Portability is earned after
              this capital graph works, not before.
            </p>
            <p>
              We exist because reactive maps are a polite way to be late. The
              hour before, plus a policy that does something besides a red
              polyline, is the company.
            </p>
          </>
        }
        right={
          <>
            <p>
              San Francisco here is a standard of craft, not a relocation rumor.
              Parchment, not sterile white. Space Grotesk at 300, not a shout.
              If it would not hang in a South Park studio, it does not ship.
            </p>
            <p>
              Labs still run Flask, PyTorch, OSMnx, Folium. The public face runs
              Next.js 16. Both directories live under traffic-app because
              splitting the story from the experiment is how numbers go soft.
            </p>
          </>
        }
      />

      <NumberedBand
        eyebrow="How we review"
        title="If it cannot survive three chairs, it does not ship."
        steps={[
          {
            t: "Operator chair",
            d: "Can a corridor owner use this at 09:00 without a legend apology?",
          },
          {
            t: "Research chair",
            d: "Are both errors printed? Is the graph real? Is the split causal?",
          },
          {
            t: "Engineering chair",
            d: "Does a sleeping sidecar become HTML parsed as JSON, or a labeled fallback?",
          },
          {
            t: "Design chair",
            d: "Is ember only on actions? Is vapor sitting down? Is the type 300?",
          },
          {
            t: "Ethics chair",
            d: "Is Detect density, not a fine? Are frames retained only as policy allows?",
          },
          {
            t: "Honesty chair",
            d: "Does every demo say OSM geometry + scenario speeds, out loud?",
          },
        ]}
      />

      <QuoteBand
        quote="Reactive maps are a polite way to be late. We wanted the hour before — and a policy that does something with it besides a red polyline."
        attrib="Company · Traffic"
      />

      <ContentBand
        eyebrow="Principles"
        title="Rules we keep when the slide deck gets loud."
        tone="parchment"
        items={[
          {
            t: "Print both errors",
            d: "Univariate and spatial scores both appear. Hiding one to win a procurement cell is not allowed.",
          },
          {
            t: "Label demo data",
            d: "Interactive speeds are scenario forecasts unless a live feed is explicitly connected.",
          },
          {
            t: "One orange",
            d: "Ember is for actions. The rest of the UI stays parchment and graphite.",
          },
          {
            t: "City before slogan",
            d: "Thiruvananthapuram is the case. Portability is earned after the capital graph works.",
          },
          {
            t: "Camera humility",
            d: "Detection is density, not policing. Privacy and retention are part of the product conversation.",
          },
          {
            t: "Route is the grade",
            d: "If a forecast cannot change a path, it is a chart — not infrastructure.",
          },
          {
            t: "Three chairs",
            d: "Operator, researcher, engineer in the same review. One missing chair is how slogans ship.",
          },
          {
            t: "Capital first",
            d: "Other OSM cities are a later chapter. Thiruvananthapuram is the case that must remain hard.",
          },
        ]}
      />

      <PageFaq
        dark
        items={[
          {
            q: "Are you a ride-hail company?",
            a: "No. We build prediction, attention, detection, and routing policy for corridors and labs.",
          },
          {
            q: "Where are you based?",
            a: "The graph and case study are Thiruvananthapuram. Craft standards borrow from rigorous product design culture — parchment, not noise.",
          },
          {
            q: "How do we start?",
            a: "Use the site, then Contact with one failing clock and whether you have cameras or only OSM.",
          },
          {
            q: "Do you hide the LSTM score?",
            a: "Never. Hybrid MAE is louder. LSTM R² is prettier. Both print. Routing is the grade.",
          },
          {
            q: "Is Detect policing?",
            a: "No. Density for a still you chose. No plates as a product. Privacy is part of the conversation.",
          },
        ]}
      />
    </>
  );
}
