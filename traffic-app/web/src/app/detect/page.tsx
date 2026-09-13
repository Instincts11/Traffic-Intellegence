import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { DetectStudio } from "@/components/detect-studio";
import { Prose } from "@/components/prose";
import { Eyebrow } from "@/components/eyebrow";
import { ContentBand, NumberedBand, PageFaq, QuoteBand, SplitEssay, StatStrip } from "@/components/page-content";

export const metadata: Metadata = {
  title: "Detect",
  description:
    "Upload a road photo. YOLOv8n runs in the browser and labels car, truck, bike, and bus — a density instrument for Thiruvananthapuram, not a fine.",
};

export default function DetectPage() {
  return (
    <>
      <PageHero
        kicker="Vehicle detection"
        title="Pixels are a sensor. Treat them like one."
        lede="Upload a street or junction photo. YOLOv8n runs on-device (one 640 pass, no zoom tiles) and labels car, truck, bike, and bus so density can sit beside history — useful when a camera sees the stalled bus last Thursday’s average cannot."
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
              or parking queue. Submit. YOLOv8n runs in your browser via ONNX
              Runtime and returns boxes plus class counts — car, truck, bike, bus.
              The hosted Flask detector is not required; a sleeping API must not
              block a frame.
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
              bins: how busy is this view. Detection runs YOLOv8n in the browser,
              so a sleeping API does not block counts.
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
            <h2>Car, truck, bike — not a generic “vehicle”</h2>
            <p>
              Kerala streets are a mix. A hatchback is not a truck. A scooter is
              not a car. The detector scores COCO bicycle and motorcycle as{" "}
              <strong>bike</strong>, and keeps car / truck / bus as first-class
              labels. If truck only barely beats car, we keep car — that is how
              a white hatchback behind a parking sign stops becoming a false
              lorry.
            </p>
            <h3>One full-image pass</h3>
            <p>
              Inference is a single letterboxed 640 pass. We do not tile, do not
              zoom, do not invent extra boxes from overlapping crops. Duplicate
              stacks and random trucks were a worse crime than a missed occluded
              bumper. The box you see had to survive confidence, NMS, and
              class-aware suppression.
            </p>
            <h3>What the colors mean</h3>
            <p>
              Ember for cars, blue for trucks, gold for bikes, purple for buses.
              Color is class, not congestion. Congestion colors live on Map.
              Coupling colors live on Influence. Mixing those legends is how a
              demo loses the room.
            </p>
            <h2>Ethics, in one paragraph</h2>
            <p>
              No plates. No faces as a product. No fine. A still is density for
              the hour you already forecasted. If you point this at live CCTV,
              you owe a retention rule and a civic sentence before you owe a
              model. The page accepts uploads because consent is the file you
              chose.
            </p>
          </Prose>
        </div>
      </section>

      <StatStrip
        tone="dark"
        items={[
          { v: "YOLOv8n", l: "On-device ONNX" },
          { v: "640", l: "Full-image letterbox" },
          { v: "Car · truck · bike", l: "Class-first labels" },
          { v: "No tiles", l: "No invented zooms" },
        ]}
      />

      <SplitEssay
        eyebrow="Live frame, demo city"
        title="Counts are true for the photo. Speeds remain a studio hour."
        left={
          <>
            <p>
              Detection is the only surface that runs a neural net on your
              machine in this deployment. The first visit downloads the ONNX
              weights. After that, a sleeping Render sidecar cannot 503 your
              junction.
            </p>
            <p>
              A count of 12 cars and 9 bikes is a density prior for that still.
              It does not recolor MG Road. Wiring counts into the forecast is a
              product conversation, not a silent side effect.
            </p>
          </>
        }
        right={
          <>
            <p>
              Upload wide, daytime, vehicles occupying real pixels. Tight crops
              of logos, night selfies, and screenshots of other maps under-count
              or invent nothing useful. One stalled bus in two lanes is exactly
              the sentence a Thursday average cannot write.
            </p>
            <p>
              If a box looks wrong, it is an argument you can have with the
              frame — not a hallucination from a zoom tile. We would rather miss
              a half-hidden bumper than stamp a truck on a sign.
            </p>
          </>
        }
      />

      <NumberedBand
        tone="parchment"
        eyebrow="How to read a still"
        title="From file to density sentence."
        steps={[
          {
            t: "Choose the view",
            d: "Junction approach, flyover, queue — not a portrait, not a billboard.",
          },
          {
            t: "Wait for the model",
            d: "First run fetches YOLOv8n. Later runs are local.",
          },
          {
            t: "Read class, not just count",
            d: "A truck in a car lane is a different delay than ten bikes. Labels are the point.",
          },
          {
            t: "Ignore non-vehicles",
            d: "People, umbrellas, parking signs are not traffic density.",
          },
          {
            t: "Return to the graph",
            d: "Predict or Map still hold the city hour. Detect holds the camera check.",
          },
          {
            t: "Say the limit",
            d: "“Live for this image. Not city-wide CCTV.” Then sit down.",
          },
        ]}
      />

      <QuoteBand
        quote="A forecast knows last Thursday. A camera knows the stalled bus that ate two lanes. Treat pixels like a sensor, or do not bother hanging them."
        attrib="Detect · on-device YOLOv8n"
      />

      <ContentBand
        eyebrow="What gets counted"
        title="Classes the detector is allowed to see."
        tone="parchment"
        items={[
          { t: "Car", d: "Private cars and similar light four-wheelers. Ember boxes. Hatchbacks stay cars unless a truck score clearly wins." },
          { t: "Bike", d: "Bicycles and motorcycles scored together — the Kerala two-wheeler class that actually delays a junction." },
          { t: "Truck", d: "Goods vehicles. Blue boxes. A weak truck-vs-car margin keeps the label as car on purpose." },
          { t: "Bus", d: "Transit and large passenger vehicles. Purple. One bus can rewrite a cycle more than six cars." },
          {
            t: "Full-image only",
            d: "No overlapping zoom tiles. One 640 letterbox pass, then NMS. Fewer duplicate stacks.",
          },
          {
            t: "Ignored on purpose",
            d: "People, umbrellas, billboards, parking signs — not treated as traffic density.",
          },
        ]}
      />

      <PageFaq
        dark
        items={[
          {
            q: "YOLO failed to load?",
            a: "Detect loads YOLOv8n in your browser. The first run downloads the model; after that, counts and boxes stay on-device even if the hosted API is down.",
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
          {
            q: "Why did a white car get missed before?",
            a: "Occlusion and signs confuse a 640 pass. We still refuse tiled zooms because they invented trucks and stacked boxes. Prefer a clearer frame over a noisier model.",
          },
          {
            q: "Car vs truck vs bike — how sure?",
            a: "Class-aware NMS and a car-vs-truck margin. Bikes keep smaller boxes. It is not a court of law; it is a density instrument that refuses generic ‘vehicle’ blobs.",
          },
        ]}
      />
    </>
  );
}
