# 🚦 Traffic Intelligence

> **Predict congestion before it forms — then rewrite the route.**

🏙️ Built for **Thiruvananthapuram (TVM), Kerala**  
🧠 Hybrid AI: **LSTM · GAT · YOLOv8 · PPO**  
🗺️ Real city graph from **OpenStreetMap**  
🖥️ Full-stack: **Flask API + Next.js studios**

📦 Repo → [Instincts11/Traffic-Intellegence](https://github.com/Instincts11/Traffic-Intellegence)

---

## ✨ Highlights

| 🔖 | Capability |
| --- | --- |
| 🔮 | **Forecast** corridor speeds from time, weather, and scenario |
| 🕸️ | **Graph attention** across coupled TVM road segments |
| 👁️ | **Detect** vehicles in uploaded frames with YOLOv8 |
| 🧭 | **Route** with PPO vs Dijkstra (shortest / fastest / balanced) |
| 🔥 | **Influence** heat maps — how one road’s speed pulls on another |
| 📍 | **Places** search over OSM landmarks (Palayam → Technopark and beyond) |
| 🎨 | **Parchment / Obsidian** UI themes across every studio |

---

## 🤖 AI stack — what each model does

```text
                    ┌─────────────────────────────┐
                    │     📡 City signals         │
                    │  time · weather · density   │
                    └──────────────┬──────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              ▼                    ▼                    ▼
       ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
       │ 🧠 LSTM     │      │ 🌐 GAT      │      │ 🚗 YOLOv8   │
       │ temporal    │◄────►│ spatial     │      │ vision      │
       │ speed memory│      │ road links  │      │ counts      │
       └──────┬──────┘      └──────┬──────┘      └──────┬──────┘
              │                    │                    │
              └──────────┬─────────┘                    │
                         ▼                              │
                 ┌───────────────┐                      │
                 │ 🧬 Hybrid     │◄─────────────────────┘
                 │ prediction    │
                 └───────┬───────┘
                         │
           ┌─────────────┼─────────────┐
           ▼             ▼             ▼
    ┌────────────┐ ┌───────────┐ ┌────────────┐
    │ 🗺️ Map     │ │ 🔥 Influ. │ │ 🎯 PPO     │
    │ routes     │ │ coupling  │ │ adaptive   │
    └────────────┘ └───────────┘ └────────────┘
```

| 🧩 Model | 🎯 Job in this repo | 🧪 Typical use |
| --- | --- | --- |
| **LSTM** | Reads recent speed history as a sequence | “What will MG Road feel like in 30–60 min?” |
| **GAT** | Learns which neighboring edges move together | “Does a jam at East Fort bleed into Kowdiar?” |
| **Hybrid (LSTM+GAT)** | Joint spatio-temporal forecast on the TVM graph | Studio **Predict** + colored city map |
| **YOLOv8** | Counts vehicles / classes in a frame | Studio **Detect** — feed density into ops narratives |
| **PPO** | Policy that prefers lower future cost, not just short distance | Studio **Map** alternatives vs Dijkstra |
| **OSMnx graph** | Real topology (nodes / edges / geometry) | Snapping places, path finding, influence labels |

---

## 🧠 AI-specific use cases

### 🏙️ For city & mobility teams
- 📊 **Peak-hour rehearsal** — run morning / evening / rain scenarios before signals change
- 🧩 **Corridor triage** — rank segments by predicted slowdown, not only live GPS lag
- 🔗 **Spillover awareness** — influence heat map shows coupling strength (not “more traffic”)
- 📷 **Camera audit** — YOLO on junction stills to sanity-check density claims

### 🚚 For operators & logistics
- ⏱️ **ETA stress-test** — shortest vs fastest vs balanced under the same forecast
- 📏 **Direct vs drive** — grey dashed Euclidean line vs graph path length / time
- 📍 **Landmark routing** — start/end from OSM places (LMS, Vattiyoorkavu, Technopark…)

### 🔬 For ML / research demos
- 📉 Compare **hybrid forecast** vs naive baselines in Research copy
- 🧮 Inspect **attention-style coupling** between place-labeled roads
- 🔁 Show **RL routing** cutting travel time vs pure Dijkstra in evaluation ranges
- 🧪 Swap scenarios without rebuilding the graph

### 👩‍💻 For developers integrating AI
- 🔌 Call Flask `/api/*` from the Next proxy for predict, map, influence, detect, places
- 🧳 Keep weights offline in `models/` for demos without cloud GPUs
- 🗺️ Reuse `map_payload` + Leaflet overlays for custom dashboards

---

## 🖥️ Product studios

| 🖼️ Page | 🧭 Path | 🤖 AI touchpoint |
| --- | --- | --- |
| Predict | `/predict` | Hybrid speed forecast by scenario |
| Map | `/map` | Graph routes + direct line + PPO modes |
| Influence | `/influence` | Coupling heat map near selected places |
| Detect | `/detect` | YOLOv8 on uploaded imagery |
| Network | `/network` | Graph / city presentation |
| Technology | `/technology` | LSTM · GAT · YOLO · PPO narrative |
| Research | `/research` | Metrics & evaluation framing |
| Developers | `/developers` | API-oriented notes |

---

## 🛠️ Tech stack

| 🧱 Layer | 🧰 Tools |
| --- | --- |
| 🔙 API | Flask · Gunicorn-ready |
| 🎨 UI | Next.js 16 · React 19 · Tailwind 4 |
| 🗺️ Maps | Leaflet · OpenStreetMap · OSMnx |
| 🧮 ML | PyTorch · torch-geometric · Ultralytics · Stable-Baselines3 |
| 📐 Geo | GeoPandas · edge CSVs · Overpass / Nominatim places |

---

## 🚀 Quick start

### ① Backend — `:5000`

```bash
cd traffic-app
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
# source .venv/bin/activate

pip install -r requirements.txt
python app.py
```

### ② Frontend — `:3000`

```bash
cd traffic-app/web
npm install
npm run dev
```

🌐 Open **http://localhost:3000**  
⚠️ Keep Flask alive — Next proxies `/api/*` → `localhost:5000`.

---

## 📡 Typical AI request flow

```text
Browser (Next.js studio)
        │
        │  /api/predict | /api/map | /api/influence | /api/detect | /api/places
        ▼
Next rewrite / proxy
        │
        ▼
Flask app.py
        │
        ├──► hybrid_model (+ graph features)  → speeds / colors
        ├──► map_payload (Dijkstra / modes)   → path_line · alternatives
        ├──► influence matrix                 → heat cells + road labels
        ├──► YOLOv8                           → boxes · counts
        └──► places (catalog + Nominatim)     → lat/lon snaps
```

---

## 📝 Operator notes

- 📍 Places: local OSM catalog + live Nominatim fallback; first boot may warm cache  
- ➖ Map grey dashed line = **direct** distance; colored dashes = **driving** routes after Generate  
- 💾 Keep `models/*.pt` if you need offline inference  
- 🖼️ Detect uploads stay local (ignored by git)  
- 🎨 UI themes: parchment (light) · Obsidian (dark)

---

## 📜 Credit

Research / portfolio system centered on **Thiruvananthapuram** mobility.

🗺️ Map data © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors  
🤖 Demo metrics in the product UI are evaluation / studio figures unless you connect live feeds
