import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ContactForm } from "@/components/contact-form";
import { Prose } from "@/components/prose";
import { Eyebrow } from "@/components/eyebrow";
import { ContentBand, NumberedBand, PageFaq, QuoteBand, SplitEssay, StatStrip } from "@/components/page-content";

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
            <h2>Who we answer, and how</h2>
            <p>
              Cities: one industrial park or one flyover approach. Labs: TVM
              statistics, not private frames; weights need a protocol. Builders:
              fork traffic-app/web and the Flask sibling together. Press: bone
              and graphite, not a neon screenshot. Awards desks: the visual
              system is named variants in CSS — please do not call graphite
              black.
            </p>
            <h3>What a bad brief sounds like</h3>
            <p>
              “We want AI traffic for the whole metro, live CCTV, and a consumer
              app like the maps on our phones, by next month.” That is a vision
              deck. Send a clock instead.
            </p>
            <h3>What a good brief sounds like</h3>
            <p>
              “Airport → Secretariat fails at 09:10 in rain. We have OSM, no
              loops, two pole cameras with a 24-hour retention rule. We need a
              student demo this term and an operator board next. We already ran
              Predict and Map; fastest diverged from shortest; here is the
              screenshot.” That is a lab partner.
            </p>
          </Prose>
        </div>
      </section>

      <StatStrip
        tone="dark"
        items={[
          { v: "1 corridor", l: "Not a metro ocean" },
          { v: "1 clock", l: "The failing hour" },
          { v: "OSM / loops / cam", l: "Say which sensors" },
          { v: "A sentence back", l: "No drip campaign" },
        ]}
      />

      <SplitEssay
        eyebrow="After send"
        title="A human reads. Ember completes. Nothing drips."
        left={
          <>
            <p>
              If it is a fit, you get a datasheet and a time to walk the graph.
              If it is not, you get a sentence. We would rather five clear
              lines than a twenty-page deck with no clock.
            </p>
            <p>
              Press kits: ask for theme tokens (bone, parchment, ember) and the
              Thiruvananthapuram case paragraph. Do not screenshot a dark band
              and call the brand black. It is graphite. The paper is bone.
            </p>
          </>
        }
        right={
          <>
            <p>
              Try the product first. Predict a pair. Map it in rain. Load
              Influence. Detect a still if you have one. Tell us what surprised
              you. That surprise is the brief.
            </p>
            <p>
              Studios: Thiruvananthapuram, Kerala. Craft conversation: South Park
              adjacent, San Francisco. The dataset is the first city. The
              standard is the second.
            </p>
          </>
        }
      />

      <NumberedBand
        tone="parchment"
        eyebrow="Brief, in order"
        title="Fill these, then press send."
        steps={[
          {
            t: "Name the city or campus",
            d: "If it is not TVM, say so. Portability is a later chapter.",
          },
          {
            t: "Name the failing clock",
            d: "Place → place, time, weather. Example: Airport → Secretariat, 09:00, rain.",
          },
          {
            t: "Name the sensors",
            d: "OSM only, loops, cameras. Retention rule if cameras.",
          },
          {
            t: "Name the job",
            d: "Student demo, research compare, operator pilot, fleet desk.",
          },
          {
            t: "Name the surprise",
            d: "What happened when you ran Predict / Map / Influence yourselves.",
          },
          {
            t: "Name the timeline",
            d: "This term, this quarter, this monsoon. Honesty over ambition.",
          },
        ]}
      />

      <QuoteBand
        quote="Send a clock, not a vision deck. We answer like a lab: short, technical, on parchment."
        attrib="Contact · Traffic"
      />

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
          {
            t: "Press / awards",
            d: "Need: token names, TVM case paragraph, honesty line (OSM + demo speeds). Do not want: neon crop of a dark band.",
          },
          {
            t: "Camera partner",
            d: "Poles at ___ . Retention: ___ hours. Consent path: ___ . Detect is density only — confirm that in writing.",
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
          {
            q: "Can students write?",
            a: "Yes. Fork both directories, name the course and the blocker, and we would rather debug a real studio than read a generic AI pitch.",
          },
          {
            q: "Do I need cameras?",
            a: "No. OSM + scenarios already run Predict, Map, Influence, and routing. Cameras are optional density.",
          },
        ]}
      />
    </>
  );
}
