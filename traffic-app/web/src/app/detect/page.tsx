import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { DetectStudio } from "@/components/detect-studio";
import { Prose } from "@/components/prose";
import { Eyebrow } from "@/components/eyebrow";
import { ContentBand, PageFaq } from "@/components/page-content";

export const metadata: Metadata = {
  title: "Detect",
  description:
    "Upload a road photo. YOLOv8 counts cars, buses, trucks, and motorcycles as a density signal for Thiruvananthapuram traffic demos.",
};

export default function DetectPage() {
  return (
    <>
      <PageHero
        kicker="Vehicle detection"
        title="Pixels are a sensor. Treat them like one."
        lede="Upload a street or junction photo. YOLOv8 counts vehicles so density can sit beside history — useful when a camera sees what last Thursday’s average cannot."
        primary={{ href: "/predict", label: "Back to forecast" }}
        secondary={{ href: "/technology#yolo", label: "YOLO in the stack" }}
      />

      <section className="bg-parchment">
        <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-8">
          <DetectStudio />
        </div>
      </section>

      <section className="bg-bone">
        <div className="mx-auto max-w-[800px] px-5 py-20 md:px-8">
          <Prose>
            <Eyebrow>How to use this</Eyebrow>
            <h2>Upload → count → read the frame.</h2>
            <p>
              Choose a clear photo of a Thiruvananthapuram road, flyover approach,
              or parking queue. Submit. Flask runs YOLOv8 and returns an annotated
              image plus class counts (car, bus, truck, motorcycle, bicycle).
            </p>
            <h3>Why cameras</h3>
            <p>
              A forecast knows the usual Thursday. It does not know a stalled bus
              ate two lanes at a gate unless someone tells it. A camera is that
              someone. Detection turns boxes into a density number the loop can
              use.
            </p>
            <h3>What is live vs demo</h3>
            <p>
              Detection on your uploaded image is live model inference for that
              file. City-wide map speeds elsewhere on the site remain demo
              forecasts from time and scenario. Do not mix “I counted 42 cars in
              this photo” with “every road in TVM is live right now.”
            </p>
            <h3>From box to feature</h3>
            <p>
              Counts are meant to align with the same idea as 5-minute traffic
              bins: how busy is this view. If YOLO is offline on a slim host, the
              API should say so; maps and forecasts can still run without it.
            </p>
            <h2>What this is not</h2>
            <p>
              Not number-plate policing. Not a fine. Not a claim that every pole
              in Kerala is wired. It is a density instrument with a published
              architecture and a box you can argue with.
            </p>
            <h2>Tips for better counts</h2>
            <p>
              Prefer daytime, forward-facing junction views. Avoid heavy blur.
              Night and glare reduce recall. One frame is a sample, not a full
              hour of flow — treat it as a check on density, then return to
              Predict or Map for the city graph.
            </p>
          </Prose>
        </div>
      </section>

      <ContentBand
        eyebrow="What gets counted"
        title="Classes the detector is allowed to see."
        tone="parchment"
        items={[
          { t: "Car", d: "Private cars and similar light four-wheelers in the frame." },
          { t: "Motorcycle", d: "Two-wheelers — critical for Kerala streets." },
          { t: "Bus", d: "Transit and large passenger vehicles." },
          { t: "Truck", d: "Goods vehicles that change junction delay a lot." },
          { t: "Bicycle", d: "Included when visible; not every frame will have one." },
          {
            t: "Ignored on purpose",
            d: "People, umbrellas, billboards — not treated as traffic density.",
          },
        ]}
      />

      <PageFaq
        dark
        items={[
          {
            q: "YOLO failed to load?",
            a: "Weights may be missing on a slim host. Forecasts and maps still work. Check /api/health for yolo: true/false.",
          },
          {
            q: "Can I point this at live CCTV?",
            a: "This page accepts uploads. A production CCTV pipe would need privacy policy, retention rules, and a stable mount — not only a model.",
          },
          {
            q: "Do counts change Map colors?",
            a: "Not automatically in the current demo loop. Counts are the density instrument; Map still uses scenario speeds unless you wire them together.",
          },
          {
            q: "Which photo should I try first?",
            a: "A daytime wide shot of a junction approach with visible vehicles. Cropped logos and night selfies under-count.",
          },
        ]}
      />
    </>
  );
}
