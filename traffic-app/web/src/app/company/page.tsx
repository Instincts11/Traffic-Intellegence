import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Prose } from "@/components/prose";
import { Eyebrow } from "@/components/eyebrow";
import { Button } from "@/components/button";
import { ContentBand, PageFaq } from "@/components/page-content";

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
          </Prose>
          <div className="mt-12">
            <Button href="/contact">Start a conversation</Button>
          </div>
        </div>
      </section>

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
        ]}
      />
    </>
  );
}
