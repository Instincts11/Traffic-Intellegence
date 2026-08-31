# Traffic — Next.js 16 + Flask

The UI is TypeScript + Tailwind in this folder. Predictions, PPO, the OSM map, GAT influence, and YOLOv8 run in **Python Flask** (`../app.py` on port 5000).

## Run both

Terminal 1 — Flask API:

```bash
cd ..
pip install flask numpy pandas
python app.py
```

Terminal 2 — Next.js (this folder):

```bash
npm install
npm run dev
```

Open **http://localhost:3000**. Next.js proxies `/api/*` to Flask and `/static/*` to YOLO uploads.

If Flask is not running, studio pages return a 503 that tells you to start `python app.py`.
