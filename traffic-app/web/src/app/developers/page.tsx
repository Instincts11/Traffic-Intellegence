import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Prose } from "@/components/prose";
import { Eyebrow } from "@/components/eyebrow";
import { ContentBand, NumberedBand, PageFaq, QuoteBand, SplitEssay, StatStrip } from "@/components/page-content";

export const metadata: Metadata = {
  title: "Developers",
  description:
    "API and runtime notes for Traffic — predict, detect, influence, route — Next.js 16 surface with the original Flask scientific server.",
};

const endpoints = [
  {
    method: "POST",
    path: "/api/hybrid_predict",
    note: "Date, time, scenario. Flask returns predicted speeds for the OSM graph.",
  },
  {
    method: "POST",
    path: "/api/ppo_route",
    note: "Start/end edge indices + the last hybrid window. Returns recommended_route_index and predicted_speed.",
  },
  {
    method: "POST",
    path: "/api/route_map_full",
    note: "JSON polylines colored by predicted speed for the Leaflet map. Auto-runs a demo prediction if none is stored.",
  },
  {
    method: "POST",
    path: "/api/yolo_detect",
    note: "multipart image posted to Flask YOLOv8 when weights exist. Public Detect uses in-browser YOLOv8n instead — do not depend on this for the UI.",
  },
  {
    method: "GET",
    path: "/api/influence",
    note: "lat, lon, place → 30×30 attention-style matrix with place-labeled roads near that spot.",
  },
  {
    method: "GET",
    path: "/api/places",
    note: "q= search string. OSM Nominatim + Overpass catalog for Thiruvananthapuram. Debounced from the UI.",
  },
  {
    method: "GET",
    path: "/api/network",
    note: "Thiruvananthapuram OSM drive graph as Leaflet polylines (gray until you generate speeds).",
  },
  {
    method: "GET",
    path: "/api/health",
    note: "Flask liveness: city name, edge count, whether YOLO loaded.",
  },
];

export default function DevelopersPage() {
  return (
    <>
      <PageHero
        kicker="Developers"
        title="Datasheet energy. City consequences."
        lede="The public site is Next.js 16 with Tailwind v4, App Router, and Three.js. The scientific runtime is Flask. You are allowed to love both. This page is the contract between them."
        primary={{ href: "/contact", label: "Request keys" }}
        secondary={{ href: "/product", label: "Product map" }}
      />

      <section className="bg-parchment">
        <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-8">
          <Eyebrow>Surface</Eyebrow>
          <div className="mt-8 overflow-hidden rounded-[10px] bg-bone">
            {endpoints.map((e) => (
              <div
                key={e.path}
                className="grid gap-2 border-b border-khaki px-6 py-5 last:border-0 md:grid-cols-[88px_220px_1fr] md:items-baseline"
              >
                <span className="font-mono text-[12px] tracking-[0.12em] text-ember">
                  {e.method}
                </span>
                <code className="font-mono text-[14px] text-foreground">{e.path}</code>
                <p className="text-[15px] text-stone">{e.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bone">
        <div className="mx-auto max-w-[800px] px-5 py-20 md:px-8">
          <Prose>
            <Eyebrow>Stack you can clone</Eyebrow>
            <h2>Next.js 16 in traffic-app/web.</h2>
            <p>
              App Router. React 19. Tailwind CSS v4 with an inline <strong>@theme</strong> of
              named variants: bone, parchment, khaki, mist, ash, stone, graphite,
              obsidian, ember, vapor. Space Grotesk and IBM Plex Mono via{" "}
              <strong>next/font</strong>. Three.js through React Three Fiber, loaded
              with <strong>ssr: false</strong> so the graph never tries to render
              in Node.
            </p>
            <p>
              Useful platform features in use: Metadata API, Open Graph defaults,
              sitemap and robots, sticky layout, client islands only where the
              instrument must move (theme, studio, detection, canvas).
            </p>
            <h3>Run both processes</h3>
            <p>
              Terminal 1, from <strong>traffic-app</strong>:{" "}
              <strong>python app.py</strong> (Flask on port 5000). Terminal 2,
              from <strong>traffic-app/web</strong>: <strong>npm run dev</strong>{" "}
              (Next.js on port 3000). The UI calls <strong>/api/*</strong>; Next
              proxies every request to Flask. YOLO images are served from{" "}
              <strong>/static/uploads</strong>.
            </p>
            <h2>Auth and tenancy</h2>
            <p>
              City deployments should put a gateway in front of predict and
              upload. Do not hang raw weights on the public internet. Do not log
              frames longer than the civic policy. The contact form on this site
              is a brief, not a backdoor.
            </p>
            <h2>Errors we want you to see</h2>
            <p>
              If YOLO is dark, the API should say so. If a corridor is unknown,
              return the list. If PPO is untrained for a subgraph, fall back to
              Dijkstra and label the fallback. Silent success is how cities lose
              months.
            </p>
            <h2>Places and maps</h2>
            <p>
              <strong>GET /api/places?q=</strong> searches OSM (Nominatim + cached
              Overpass catalog for Thiruvananthapuram) with optional lat/lon.
              Empty query returns no dump — the UI only opens after debounced
              search. <strong>POST /api/route_map_full</strong> accepts start/end
              lat/lon, scenario, and route_mode (shortest | fastest | balanced)
              and returns city roads plus route path_line, alternatives, and
              distance_km. <strong>GET /api/influence</strong> accepts lat, lon,
              place and returns a labeled 30×30 matrix with road_details.
            </p>
            <h3>About predicted speeds</h3>
            <p>
              Current <strong>app.py</strong> uses{" "}
              <strong>generate_demo_predictions(date, time, scenario)</strong> —
              deterministic synthetic speeds on the OSM edge count. Same inputs →
              same outputs. Heavier hybrid weights can be wired later; do not
              document demo speeds as live Kerala traffic.
            </p>
            <h2>Fetch like a datasheet, not like a tutorial GIF</h2>
            <p>
              Next proxies <strong>/api/*</strong> to Flask. If the sidecar
              returns HTML 502/503, <strong>fetchJson</strong> on the client
              refuses to parse it as JSON. Predict and Map then use the
              deterministic demo field. Influence can mint a default window.
              Detect never needed that proxy for boxes — ONNX lives in
              <strong>public/models/yolov8n.onnx</strong>.
            </p>
            <h3>Places</h3>
            <p>
              Empty query returns no dump. Debounce in the UI. Nominatim plus
              cached Overpass catalog. If the network is rude, a curated TVM
              list still lets Palayam exist. Do not json() HTML from
              <strong>/api/places</strong>.
            </p>
            <h3>What to log. What never to log.</h3>
            <p>
              Log scenario, timestamp, start/end place names, route_mode. Do not
              log uploaded frames longer than civic policy. Do not hang raw
              weights on the public internet. The contact form is a brief, not a
              backdoor.
            </p>
            <h2>Errors we want you to see</h2>
            <p>
              If YOLO is dark on Flask, the API should say 503 with a sentence.
              If a corridor is unknown, return the list. If PPO is untrained for
              a subgraph, fall back to Dijkstra and label the fallback. Silent
              success is how cities lose months.
            </p>
          </Prose>
        </div>
      </section>

      <StatStrip
        tone="dark"
        items={[
          { v: "Next 16", l: "Instrument face" },
          { v: "Flask", l: "Scientific runtime" },
          { v: "/api/*", l: "Proxy contract" },
          { v: "ONNX", l: "Browser YOLO" },
        ]}
      />

      <SplitEssay
        eyebrow="Two processes"
        title="Love both, or fork neither."
        left={
          <>
            <p>
              Flask owns edges, demo prediction, PPO indices, Folium, optional
              Ultralytics. Next owns parchment, App Router, Three.js islands,
              Metadata, the studios. The UI calls <strong>/api/*</strong>. Next
              proxies to port 5000.
            </p>
            <p>
              Production on Render may run a slim Flask without YOLO. The public
              Detect page does not care. Do not document 503 HTML as a JSON
              contract.
            </p>
          </>
        }
        right={
          <>
            <p>
              Theme tokens live in Tailwind v4 <strong>@theme</strong>: bone,
              parchment, khaki, mist, ash, stone, graphite, obsidian, ember,
              vapor. Space Grotesk at 300. IBM Plex Mono for serials. Client
              islands only where the instrument must move.
            </p>
            <p>
              City tenancy wants a gateway. Open CORS is for local demos. Keys
              are a conversation on Contact, not a header you scrape from this
              page.
            </p>
          </>
        }
      />

      <NumberedBand
        tone="parchment"
        eyebrow="Minimum viable city"
        title="From clone to a corridor you can screenshot."
        steps={[
          {
            t: "Install",
            d: "Python deps in traffic-app. npm install in web. Optional ultralytics only if you insist on Flask YOLO.",
          },
          {
            t: "Boot Flask",
            d: "python app.py — health should name Thiruvananthapuram and an edge count.",
          },
          {
            t: "Boot Next",
            d: "npm run dev. Open /predict. If Flask sleeps, demo fallback still paints places.",
          },
          {
            t: "Hit map",
            d: "POST /api/route_map_full with lat/lon, scenario rain, route_mode fastest.",
          },
          {
            t: "Hit influence",
            d: "GET /api/influence?lat=&lon=&place=Palayam — 30×30 plus road_details.",
          },
          {
            t: "Detect without Flask",
            d: "Open /detect, upload a still. Model is /models/yolov8n.onnx in public.",
          },
        ]}
      />

      <QuoteBand
        quote="Silent success is how cities lose months. If YOLO is dark, say 503. If PPO is untrained, label the Dijkstra fallback."
        attrib="Developers · Traffic"
      />

      <section className="bg-[#1f1f1b] text-[#f3f3ee]">
        <div className="mx-auto max-w-[1200px] px-5 py-16 md:px-8">
          <Eyebrow>Example</Eyebrow>
          <pre className="mt-6 overflow-x-auto rounded-[10px] bg-[#141412] p-6 font-mono text-[13px] leading-relaxed text-[#cecebf]">
{`POST /api/predict
{
  "corridor": "MG Road",
  "horizon": 12,
  "family": "hybrid"
}

→ series[], mae, rmse, r2, generated_at`}
          </pre>
        </div>
      </section>

      <ContentBand
        eyebrow="Local recipe"
        title="Minimum commands to see the city."
        tone="parchment"
        items={[
          {
            t: "Install Python deps",
            d: "From traffic-app, install Flask, numpy, pandas, and optional ultralytics if you want Detect.",
          },
          {
            t: "Start Flask",
            d: "python app.py → http://127.0.0.1:5000 — watch for OSM places loaded and YOLO status.",
          },
          {
            t: "Start Next",
            d: "cd web && npm install && npm run dev → http://localhost:3000",
          },
          {
            t: "Health check",
            d: "GET /api/health should report city Thiruvananthapuram and edge counts.",
          },
          {
            t: "First map",
            d: "POST /api/route_map_full with start/end lat lon, scenario rain, route_mode fastest.",
          },
          {
            t: "Refresh OSM catalog",
            d: "GET /api/places/catalog?refresh=true rebuilds data/tvm_osm_places.json from Overpass when online.",
          },
          {
            t: "Do not parse HTML",
            d: "502/503 from Render is an HTML page. Treat non-JSON as failure and use demo fallback.",
          },
          {
            t: "ONNX path",
            d: "web/public/models/yolov8n.onnx — first Detect visit downloads it; later visits are local.",
          },
          {
            t: "Theme tokens",
            d: "bone, parchment, khaki, ash, stone, graphite, obsidian, ember. One orange. No extra chrome.",
          },
        ]}
      />

      <PageFaq
        dark
        items={[
          {
            q: "UI works but maps are empty?",
            a: "Flask is probably down. Next proxies /api to port 5000 — both processes must run for full GeoJSON. Demo fallback still covers Predict speeds.",
          },
          {
            q: "Places search empty?",
            a: "Type a query (dropdown is search-only). Ensure Flask can reach Nominatim or has the Overpass cache file.",
          },
          {
            q: "CORS?",
            a: "Flask adds open CORS for local demos. Put a gateway in front for production.",
          },
          {
            q: "Why does /api/yolo_detect 503?",
            a: "Slim hosts skip Ultralytics. The public Detect page uses in-browser YOLOv8n and does not need that route.",
          },
          {
            q: "Is generate_demo_predictions the research model?",
            a: "No. Same inputs, same outputs, OSM edge count. Cite Research for MAE/R². Cite this function for the public studio.",
          },
        ]}
      />
    </>
  );
}
