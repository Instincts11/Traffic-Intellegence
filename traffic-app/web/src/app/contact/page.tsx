import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ContactForm } from "@/components/contact-form";
import { Prose } from "@/components/prose";
import { Eyebrow } from "@/components/eyebrow";
import { ContentBand, PageFaq } from "@/components/page-content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Request access, research collaboration, or a corridor deployment of Traffic.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        kicker="Contact"
        title="Send a brief, not a newsletter signup."
        lede="Tell us the corridor, the clock you are failing, and whether you have cameras, loops, or only OSM. We answer like a lab: short, technical, on parchment."
      />

      <section className="bg-parchment">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-5 py-16 md:grid-cols-[1.1fr_0.9fr] md:px-8">
          <ContactForm />
          <div>
            <Eyebrow>Also</Eyebrow>
            <ul className="mt-6 space-y-6 text-[16px] leading-relaxed text-stone">
              <li>
                <strong className="block font-medium text-foreground">Cities</strong>
                Start with one industrial park or one flyover approach. Do not boil
                the metropolitan ocean in the first quarter.
              </li>
              <li>
                <strong className="block font-medium text-foreground">Labs</strong>
                We share Thiruvananthapuram statistics, not private frames. If you
                want weights, bring a protocol.
              </li>
              <li>
                <strong className="block font-medium text-foreground">Builders</strong>
                The Next.js surface is in traffic-app/web. The Flask runtime is
                the sibling. Fork both or neither.
              </li>
            </ul>
            <div className="mt-10 rounded-[10px] bg-bone p-6">
              <p className="font-mono text-[12px] tracking-[0.12em] uppercase text-ash">
                Studios
              </p>
              <p className="mt-2 text-[18px] font-light">Thiruvananthapuram, Kerala</p>
              <p className="text-[18px] font-light">South Park adjacent, San Francisco</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-bone">
        <div className="mx-auto max-w-[800px] px-5 py-16 md:px-8">
          <Prose>
            <h2>What happens after send.</h2>
            <p>
              A human reads the brief. If it is a fit, you get a datasheet and a
              time to walk the graph. If it is not, you get a sentence, not a
              drip campaign. Ember is for actions that complete.
            </p>
            <p>
              Press and awards desks: the visual system is documented in the CSS
              theme as named variants. Please do not screenshot a dark band and
              call the brand black. It is graphite. The paper is bone.
            </p>
            <h2>What to include in a good brief</h2>
            <p>
              City or campus name. One corridor that fails today (example: Airport
              → Secretariat at 9:00 under rain). Whether you have cameras, loop
              counts, or only OSM. Whether you need a student demo, a research
              collaboration, or an operator pilot. Expected timeline. We would
              rather get five clear sentences than a twenty-page deck with no
              clock.
            </p>
            <h3>Try the product first</h3>
            <p>
              Before writing, open Predict with a Thiruvananthapuram place pair,
              generate a Map under rain, and load Influence near that place. Tell
              us what surprised you. That is more useful than a generic “AI
              traffic” request.
            </p>
          </Prose>
        </div>
      </section>

      <ContentBand
        eyebrow="Brief templates"
        title="Copy, fill, send."
        tone="parchment"
        items={[
          {
            t: "City ops",
            d: "Corridor: ___ . Worst clock: ___ . Sensors: OSM only / loops / cameras. Goal: forecast board / routing pilot / student demo.",
          },
          {
            t: "Research lab",
            d: "We want to compare hybrid vs LSTM on ___ graph. Need: edge CSV format, evaluation split notes, PPO reward definition.",
          },
          {
            t: "Fleet desk",
            d: "Daily runs between ___ and ___ . Pain: ___ minutes surprise delay. Willing to share anonymized traces: yes/no.",
          },
          {
            t: "Student team",
            d: "Course: ___ . We forked traffic-app. Blocker: ___ . Asking for: architecture review / dataset tips / demo script.",
          },
        ]}
      />

      <PageFaq
        dark
        items={[
          {
            q: "Will you sell us a black-box SaaS tomorrow?",
            a: "Start with a corridor brief. Many partners want the lab loop and honesty about demo vs live data first.",
          },
          {
            q: "Do you take press kits?",
            a: "Yes — ask for theme tokens (bone, parchment, ember) and the Thiruvananthapuram case paragraph, not a neon screenshot.",
          },
        ]}
      />
    </>
  );
}
