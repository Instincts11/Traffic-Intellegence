import { city } from "@/lib/city";
import { generateDemoSpeeds, placeSpeedIndex } from "@/lib/demo-predict";
import { TVM_PLACES, haversineKm, type Place } from "@/lib/places";

export type DemoMapRoad = {
  index: number;
  color: string;
  coordinates: [number, number][];
  tooltip: string;
  speed?: number;
};

type GraphEdge = { a: number; b: number; km: number; id: number };

type Graph = {
  nodes: Place[];
  adj: { to: number; km: number; id: number }[][];
  edges: GraphEdge[];
};

const CORRIDORS: string[][] = [
  ["airport", "chackai", "petta-bypass", "pettah", "thampanoor", "overbridge", "statue", "palayam", "secretariat"],
  [
    "east-fort",
    "pazhavangadi",
    "thampanoor",
    "thycaud",
    "palayam",
    "pmg",
    "pattom",
    "kesavadasapuram",
    "ulloor",
    "sreekaryam",
    "sreekaryam-jn",
    "karyavattom",
    "kazhakoottam",
    "technopark",
  ],
  ["palayam", "museum", "vellayambalam", "kowdiar", "sasthamangalam"],
  ["medical-college", "ulloor", "sreekaryam", "chekkalamukku", "engineering-college"],
  ["kovalam", "vizhinjam", "thiruvallam", "karamana", "killipalam", "east-fort"],
  ["airport", "shanghumugham", "veli", "akkulam", "lulu-mall", "kadakampally"],
];

const MODE_COLORS: Record<string, string> = {
  shortest: "#2563eb",
  fastest: "#f43e01",
  balanced: "#16a34a",
};

function speedColor(speed: number) {
  if (speed >= 25) return "#16a34a";
  if (speed >= 18) return "#d97706";
  return "#dc2626";
}

function nearestIndex(lat: number, lon: number, nodes: Place[]) {
  let best = 0;
  let bestKm = Infinity;
  nodes.forEach((p, i) => {
    const d = haversineKm(lat, lon, p.lat, p.lon);
    if (d < bestKm) {
      bestKm = d;
      best = i;
    }
  });
  return best;
}

let cachedGraph: Graph | null = null;

function buildGraph(): Graph {
  if (cachedGraph) return cachedGraph;
  const nodes = TVM_PLACES;
  const n = nodes.length;
  const byId = new Map(nodes.map((p, i) => [p.id, i]));
  const seen = new Set<string>();
  const edges: GraphEdge[] = [];

  function addEdge(a: number, b: number) {
    if (a === b) return;
    const lo = Math.min(a, b);
    const hi = Math.max(a, b);
    const key = `${lo}-${hi}`;
    if (seen.has(key)) return;
    seen.add(key);
    edges.push({
      a: lo,
      b: hi,
      km: haversineKm(nodes[lo].lat, nodes[lo].lon, nodes[hi].lat, nodes[hi].lon),
      id: edges.length,
    });
  }

  for (const chain of CORRIDORS) {
    for (let i = 1; i < chain.length; i++) {
      const a = byId.get(chain[i - 1]);
      const b = byId.get(chain[i]);
      if (a != null && b != null) addEdge(a, b);
    }
  }

  const parent = Array.from({ length: n }, (_, i) => i);
  function find(x: number): number {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }
  function unite(a: number, b: number) {
    const pa = find(a);
    const pb = find(b);
    if (pa === pb) return false;
    parent[pa] = pb;
    return true;
  }

  const pairs: { a: number; b: number; km: number }[] = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const km = haversineKm(nodes[i].lat, nodes[i].lon, nodes[j].lat, nodes[j].lon);
      if (km <= 14) pairs.push({ a: i, b: j, km });
    }
  }
  pairs.sort((x, y) => x.km - y.km);
  for (const e of edges) unite(e.a, e.b);
  for (const p of pairs) {
    if (unite(p.a, p.b)) addEdge(p.a, p.b);
  }

  for (let i = 0; i < n; i++) {
    const near = nodes
      .map((p, j) => ({ j, km: j === i ? Infinity : haversineKm(nodes[i].lat, nodes[i].lon, p.lat, p.lon) }))
      .sort((a, b) => a.km - b.km)
      .slice(0, 3);
    for (const nbor of near) {
      if (nbor.km <= 8) addEdge(i, nbor.j);
    }
  }

  const adj: Graph["adj"] = Array.from({ length: n }, () => []);
  for (const e of edges) {
    adj[e.a].push({ to: e.b, km: e.km, id: e.id });
    adj[e.b].push({ to: e.a, km: e.km, id: e.id });
  }

  cachedGraph = { nodes, adj, edges };
  return cachedGraph;
}

function edgeSpeed(graph: Graph, edge: GraphEdge, speeds: number[]) {
  const ia = placeSpeedIndex(graph.nodes[edge.a], speeds.length);
  const ib = placeSpeedIndex(graph.nodes[edge.b], speeds.length);
  return (speeds[ia] + speeds[ib]) / 2;
}

function dijkstra(
  graph: Graph,
  start: number,
  end: number,
  cost: (edge: GraphEdge) => number,
) {
  const n = graph.nodes.length;
  const dist = new Array(n).fill(Infinity);
  const prev = new Array<number>(n).fill(-1);
  const via = new Array<number>(n).fill(-1);
  dist[start] = 0;
  const used = new Array(n).fill(false);
  for (let step = 0; step < n; step++) {
    let u = -1;
    let best = Infinity;
    for (let i = 0; i < n; i++) {
      if (!used[i] && dist[i] < best) {
        best = dist[i];
        u = i;
      }
    }
    if (u < 0 || u === end) break;
    used[u] = true;
    for (const link of graph.adj[u]) {
      const edge = graph.edges[link.id];
      const next = dist[u] + cost(edge);
      if (next < dist[link.to]) {
        dist[link.to] = next;
        prev[link.to] = u;
        via[link.to] = link.id;
      }
    }
  }
  if (!Number.isFinite(dist[end])) return null;
  const nodes: number[] = [];
  const edgeIds: number[] = [];
  for (let cur = end; cur >= 0; cur = prev[cur]) {
    nodes.push(cur);
    if (via[cur] >= 0) edgeIds.push(via[cur]);
    if (cur === start) break;
  }
  nodes.reverse();
  edgeIds.reverse();
  return { nodes, edgeIds, cost: dist[end] };
}

function pathStats(graph: Graph, edgeIds: number[], speeds: number[]) {
  let km = 0;
  let hours = 0;
  for (const id of edgeIds) {
    const e = graph.edges[id];
    const spd = Math.max(edgeSpeed(graph, e, speeds), 6);
    km += e.km;
    hours += e.km / spd;
  }
  return {
    distance_km: Math.round(km * 10) / 10,
    eta_min: Math.round(hours * 60 * 10) / 10,
  };
}

export function fallbackNetwork() {
  const graph = buildGraph();
  return {
    center: city.center,
    zoom: city.zoom,
    nodes: graph.nodes.length,
    edges: graph.edges.length,
    roads: graph.edges.map((e) => ({
      index: e.id,
      color: "#9c9c90",
      coordinates: [
        [graph.nodes[e.a].lat, graph.nodes[e.a].lon],
        [graph.nodes[e.b].lat, graph.nodes[e.b].lon],
      ] as [number, number][],
      tooltip: `${graph.nodes[e.a].name} — ${graph.nodes[e.b].name}`,
    })),
    source: "studio",
  };
}

export function fallbackRouteMap(input: {
  startLat: number;
  startLon: number;
  endLat: number;
  endLon: number;
  startName?: string;
  endName?: string;
  scenario?: string;
  routeMode?: string;
  date?: string;
  time?: string;
}) {
  const graph = buildGraph();
  const scenario = input.scenario || "normal";
  const routeMode = String(input.routeMode || "fastest").toLowerCase();
  const speeds = generateDemoSpeeds(
    input.date || new Date().toISOString().slice(0, 10),
    input.time || "10:00",
    scenario,
    Math.max(256, graph.edges.length + 8),
  );

  let bestIndex = 0;
  let bestSpeed = edgeSpeed(graph, graph.edges[0], speeds);
  const roads: DemoMapRoad[] = graph.edges.map((e) => {
    const speed = edgeSpeed(graph, e, speeds);
    if (speed > bestSpeed) {
      bestSpeed = speed;
      bestIndex = e.id;
    }
    return {
      index: e.id,
      speed,
      color: speedColor(speed),
      coordinates: [
        [graph.nodes[e.a].lat, graph.nodes[e.a].lon],
        [graph.nodes[e.b].lat, graph.nodes[e.b].lon],
      ],
      tooltip: `${graph.nodes[e.a].name} — ${graph.nodes[e.b].name} · ${speed.toFixed(1)} km/h`,
    };
  });
  roads[bestIndex] = { ...roads[bestIndex], color: "#2563eb" };

  const startIdx = nearestIndex(input.startLat, input.startLon, graph.nodes);
  const endIdx = nearestIndex(input.endLat, input.endLon, graph.nodes);
  const startName = input.startName || graph.nodes[startIdx].name;
  const endName = input.endName || graph.nodes[endIdx].name;
  const directKm =
    Math.round(haversineKm(input.startLat, input.startLon, input.endLat, input.endLon) * 100) /
    100;

  const modes = [
    {
      id: "shortest",
      label: "Shortest distance",
      cost: (e: GraphEdge) => e.km,
    },
    {
      id: "fastest",
      label: "Fastest (traffic-aware)",
      cost: (e: GraphEdge) => e.km / Math.max(edgeSpeed(graph, e, speeds), 6),
    },
    {
      id: "balanced",
      label: "Balanced",
      cost: (e: GraphEdge) => e.km * 0.5 + (e.km / Math.max(edgeSpeed(graph, e, speeds), 6)) * 12,
    },
  ];

  const alternatives = modes
    .map((mode) => {
      const found = dijkstra(graph, startIdx, endIdx, mode.cost);
      if (!found) return null;
      const stats = pathStats(graph, found.edgeIds, speeds);
      const path_line: [number, number][] = [
        [input.startLat, input.startLon],
        ...found.nodes.map((i) => [graph.nodes[i].lat, graph.nodes[i].lon] as [number, number]),
        [input.endLat, input.endLon],
      ];
      return {
        id: mode.id,
        label: mode.label,
        path_line,
        distance_km: stats.distance_km,
        eta_min: stats.eta_min,
        edge_count: found.edgeIds.length,
        color: MODE_COLORS[mode.id],
        selected: mode.id === routeMode,
        edgeIds: found.edgeIds,
      };
    })
    .filter((row): row is NonNullable<typeof row> => Boolean(row));

  const selected =
    alternatives.find((a) => a.id === routeMode) || alternatives[0] || null;

  const pathIndexSet = new Set(selected?.edgeIds ?? []);
  const routeRoads = roads
    .filter((r) => pathIndexSet.has(r.index))
    .map((r) => ({
      ...r,
      color: r.index === bestIndex ? "#2563eb" : r.color,
    }));

  return {
    center: city.center,
    zoom: city.zoom,
    best_index: bestIndex,
    best_speed: bestSpeed,
    best_label: `Fastest corridor in ${city.name}`,
    roads,
    edges: graph.edges.length,
    nodes: graph.nodes.length,
    source: "studio",
    route: {
      start_name: startName,
      end_name: endName,
      start_lat: input.startLat,
      start_lon: input.startLon,
      end_lat: input.endLat,
      end_lon: input.endLon,
      scenario,
      route_mode: routeMode,
      center: [
        (input.startLat + input.endLat) / 2,
        (input.startLon + input.endLon) / 2,
      ] as [number, number],
      zoom: 13,
      best_index: selected?.edgeIds[0] ?? -1,
      best_speed:
        selected?.edgeIds.length
          ? edgeSpeed(graph, graph.edges[selected.edgeIds[0]], speeds)
          : 0,
      best_label: selected ? `${startName} → ${endName}` : "Direct line",
      route_line: [
        [input.startLat, input.startLon],
        [input.endLat, input.endLon],
      ] as [number, number][],
      path_line: selected?.path_line ?? [
        [input.startLat, input.startLon],
        [input.endLat, input.endLon],
      ],
      distance_km: selected?.distance_km ?? directKm,
      direct_km: directKm,
      eta_min: selected?.eta_min ?? Math.round((directKm / 22) * 60 * 10) / 10,
      roads: routeRoads,
      road_count: routeRoads.length,
      alternatives: alternatives.map(({ edgeIds: _ids, ...alt }) => alt),
    },
  };
}
