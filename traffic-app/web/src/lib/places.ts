export type Place = {
  id: string;
  name: string;
  area: string;
  lat: number;
  lon: number;
  edge_index: number;
  edge_id?: string | null;
  distance_km?: number | null;
  snap_km?: number | null;
  source?: string | null;
};

/** Fallback landmarks if Flask / OSM is offline. */
export const TVM_PLACES: Place[] = [
  // Fort / South-central
  { id: "east-fort", name: "East Fort", area: "Fort", lat: 8.4828, lon: 76.9478, edge_index: 0 },
  { id: "west-fort", name: "West Fort", area: "Fort", lat: 8.484, lon: 76.941, edge_index: 0 },
  { id: "chalai", name: "Chalai Market", area: "Fort", lat: 8.4815, lon: 76.9485, edge_index: 0 },
  { id: "attukal", name: "Attukal", area: "Fort", lat: 8.47, lon: 76.948, edge_index: 0 },
  { id: "manacaud", name: "Manacaud", area: "South", lat: 8.475, lon: 76.945, edge_index: 0 },
  { id: "killipalam", name: "Killipalam", area: "South", lat: 8.4785, lon: 76.955, edge_index: 0 },
  { id: "karamana", name: "Karamana", area: "South", lat: 8.4825, lon: 76.962, edge_index: 0 },
  { id: "thirumala", name: "Thirumala", area: "South", lat: 8.49, lon: 76.975, edge_index: 0 },
  { id: "pappanamcode", name: "Pappanamcode", area: "South", lat: 8.474, lon: 76.98, edge_index: 0 },
  { id: "nemom", name: "Nemom", area: "South", lat: 8.455, lon: 76.985, edge_index: 0 },
  { id: "balaramapuram", name: "Balaramapuram", area: "South", lat: 8.43, lon: 77.04, edge_index: 0 },
  { id: "neyyattinkara", name: "Neyyattinkara", area: "South", lat: 8.4, lon: 77.087, edge_index: 0 },
  { id: "punnakkamugal", name: "Punnakkamugal", area: "South", lat: 8.465, lon: 76.97, edge_index: 0 },
  { id: "vallakkadavu", name: "Vallakkadavu", area: "West", lat: 8.478, lon: 76.935, edge_index: 0 },
  { id: "beemapally", name: "Beemapally", area: "Coast", lat: 8.465, lon: 76.93, edge_index: 0 },
  { id: "poonthura", name: "Poonthura", area: "Coast", lat: 8.455, lon: 76.925, edge_index: 0 },

  // Thampanoor / Central
  { id: "thampanoor", name: "Thampanoor", area: "Central", lat: 8.4872, lon: 76.949, edge_index: 0 },
  { id: "railway", name: "Central Railway Station", area: "Thampanoor", lat: 8.4874, lon: 76.9492, edge_index: 0 },
  { id: "ksrtc", name: "KSRTC Bus Station", area: "Thampanoor", lat: 8.488, lon: 76.9485, edge_index: 0 },
  { id: "overbridge", name: "Overbridge", area: "Central", lat: 8.4915, lon: 76.9492, edge_index: 0 },
  { id: "general-hospital", name: "General Hospital", area: "Central", lat: 8.498, lon: 76.942, edge_index: 0 },
  { id: "sreekanteswaram", name: "Sreekanteswaram", area: "Central", lat: 8.49, lon: 76.942, edge_index: 0 },
  { id: "pazhavangadi", name: "Pazhavangadi", area: "Fort", lat: 8.4855, lon: 76.9455, edge_index: 0 },
  { id: "kaithamukku", name: "Kaithamukku", area: "Central", lat: 8.4925, lon: 76.9425, edge_index: 0 },
  { id: "trivandrum-club", name: "Trivandrum Club", area: "Central", lat: 8.5, lon: 76.948, edge_index: 0 },

  // Palayam / Museum
  { id: "statue", name: "Statue Junction", area: "Palayam", lat: 8.5022, lon: 76.9515, edge_index: 0 },
  { id: "palayam", name: "Palayam", area: "Central", lat: 8.5055, lon: 76.9518, edge_index: 0 },
  { id: "secretariat", name: "Secretariat", area: "Palayam", lat: 8.5074, lon: 76.955, edge_index: 0 },
  { id: "mg-road", name: "MG Road", area: "Palayam", lat: 8.508, lon: 76.951, edge_index: 0 },
  { id: "bakery", name: "Bakery Junction", area: "Palayam", lat: 8.5085, lon: 76.9485, edge_index: 0 },
  { id: "pmg", name: "PMG Junction", area: "Palayam", lat: 8.512, lon: 76.948, edge_index: 0 },
  { id: "museum", name: "Napier Museum", area: "Museum", lat: 8.509, lon: 76.9565, edge_index: 0 },
  { id: "zoo", name: "Zoo", area: "Museum", lat: 8.5105, lon: 76.9555, edge_index: 0 },
  { id: "kanakakunnu", name: "Kanakakunnu Palace", area: "Museum", lat: 8.5085, lon: 76.96, edge_index: 0 },
  { id: "lms", name: "LMS Junction", area: "Palayam", lat: 8.505, lon: 76.9555, edge_index: 0 },
  { id: "agh", name: "AG's Office", area: "Palayam", lat: 8.5045, lon: 76.9495, edge_index: 0 },
  { id: "university-college", name: "University College", area: "Palayam", lat: 8.5065, lon: 76.954, edge_index: 0 },
  { id: "press-club", name: "Press Club", area: "Palayam", lat: 8.5035, lon: 76.9525, edge_index: 0 },

  // East / Kowdiar belt
  { id: "vellayambalam", name: "Vellayambalam", area: "East", lat: 8.5088, lon: 76.9655, edge_index: 0 },
  { id: "kowdiar", name: "Kowdiar", area: "East", lat: 8.5244, lon: 76.961, edge_index: 0 },
  { id: "kowdiar-palace", name: "Kowdiar Palace", area: "East", lat: 8.526, lon: 76.9585, edge_index: 0 },
  { id: "sasthamangalam", name: "Sasthamangalam", area: "East", lat: 8.517, lon: 76.968, edge_index: 0 },
  { id: "vazhuthacaud", name: "Vazhuthacaud", area: "East", lat: 8.512, lon: 76.96, edge_index: 0 },
  { id: "nanthencode", name: "Nanthencode", area: "East", lat: 8.528, lon: 76.955, edge_index: 0 },
  { id: "nandancode", name: "Nandancode", area: "North", lat: 8.53, lon: 76.945, edge_index: 0 },
  { id: "kuravankonam", name: "Kuravankonam", area: "East", lat: 8.52, lon: 76.955, edge_index: 0 },
  { id: "amritha", name: "Amrita Hospital", area: "East", lat: 8.545, lon: 76.88, edge_index: 0 },
  { id: "jagathy", name: "Jagathy", area: "East", lat: 8.515, lon: 76.975, edge_index: 0 },
  { id: "pipinmoodu", name: "Pipinmoodu", area: "East", lat: 8.525, lon: 76.97, edge_index: 0 },
  { id: "peroorkada", name: "Peroorkada", area: "East", lat: 8.545, lon: 76.966, edge_index: 0 },
  { id: "vazhayila", name: "Vazhayila", area: "East", lat: 8.55, lon: 76.975, edge_index: 0 },
  { id: "mannanthala", name: "Mannanthala", area: "East", lat: 8.555, lon: 76.955, edge_index: 0 },
  { id: "vattiyoorkavu", name: "Vattiyoorkavu", area: "East", lat: 8.54, lon: 76.985, edge_index: 0 },
  { id: "kudappanakunnu", name: "Kudappanakunnu", area: "East", lat: 8.535, lon: 76.975, edge_index: 0 },
  { id: "ptp-nagar", name: "PTP Nagar", area: "East", lat: 8.505, lon: 76.975, edge_index: 0 },
  { id: "thycaud", name: "Thycaud", area: "Central", lat: 8.495, lon: 76.955, edge_index: 0 },
  { id: "vazhuthacaud-j", name: "Cotton Hill", area: "East", lat: 8.51, lon: 76.958, edge_index: 0 },

  // North / Medical College / Ulloor
  { id: "pattom", name: "Pattom", area: "North", lat: 8.5218, lon: 76.9395, edge_index: 0 },
  { id: "dpi", name: "DPI Junction", area: "Pattom", lat: 8.515, lon: 76.942, edge_index: 0 },
  { id: "kesavadasapuram", name: "Kesavadasapuram", area: "North", lat: 8.5355, lon: 76.936, edge_index: 0 },
  { id: "medical-college", name: "Medical College", area: "Ulloor", lat: 8.5238, lon: 76.928, edge_index: 0 },
  { id: "ulloor", name: "Ulloor", area: "North", lat: 8.541, lon: 76.9285, edge_index: 0 },
  { id: "plamoodu", name: "Plamoodu", area: "North", lat: 8.518, lon: 76.945, edge_index: 0 },
  { id: "murinjapalam", name: "Murinjapalam", area: "North", lat: 8.528, lon: 76.932, edge_index: 0 },
  { id: "chempazhanthy", name: "Chempazhanthy", area: "North", lat: 8.555, lon: 76.925, edge_index: 0 },
  { id: "sreekaryam", name: "Sreekaryam", area: "North", lat: 8.5485, lon: 76.9165, edge_index: 0 },
  { id: "chekkalamukku", name: "Chekkalamukku", area: "North", lat: 8.545, lon: 76.91, edge_index: 0 },
  { id: "powdikonam", name: "Powdikonam", area: "North", lat: 8.56, lon: 76.925, edge_index: 0 },
  { id: "pothencode", name: "Pothencode", area: "North", lat: 8.605, lon: 76.9, edge_index: 0 },
  { id: "attipra", name: "Attipra", area: "North", lat: 8.57, lon: 76.895, edge_index: 0 },
  { id: "anayara", name: "Anayara", area: "West", lat: 8.508, lon: 76.92, edge_index: 0 },
  { id: "kannammoola", name: "Kannammoola", area: "West", lat: 8.505, lon: 76.925, edge_index: 0 },
  { id: "pattoor", name: "Pattoor", area: "North", lat: 8.51, lon: 76.935, edge_index: 0 },
  { id: "vanchiyoor", name: "Vanchiyoor", area: "Central", lat: 8.495, lon: 76.945, edge_index: 0 },
  { id: "chalakuzhy", name: "Chalakuzhy", area: "North", lat: 8.525, lon: 76.935, edge_index: 0 },
  { id: "gnv", name: "Gowreesapattom", area: "North", lat: 8.532, lon: 76.942, edge_index: 0 },

  // West / Airport / Coast
  { id: "pettah", name: "Pettah", area: "West", lat: 8.495, lon: 76.9365, edge_index: 0 },
  { id: "chackai", name: "Chackai", area: "West", lat: 8.492, lon: 76.918, edge_index: 0 },
  { id: "airport", name: "Thiruvananthapuram Airport", area: "Chackai", lat: 8.4821, lon: 76.92, edge_index: 0 },
  { id: "shanghumugham", name: "Shanghumugham Beach", area: "Coast", lat: 8.481, lon: 76.912, edge_index: 0 },
  { id: "vellayani", name: "Vellayani", area: "South", lat: 8.44, lon: 76.99, edge_index: 0 },
  { id: "kovalam", name: "Kovalam Beach", area: "Coast", lat: 8.4004, lon: 76.9787, edge_index: 0 },
  { id: "vizhinjam", name: "Vizhinjam Port", area: "Coast", lat: 8.3765, lon: 76.991, edge_index: 0 },
  { id: "poovar", name: "Poovar", area: "Coast", lat: 8.318, lon: 77.072, edge_index: 0 },
  { id: "thumba", name: "Thumba / VSSC", area: "Coast", lat: 8.535, lon: 76.86, edge_index: 0 },
  { id: "veli", name: "Veli Tourist Village", area: "Coast", lat: 8.51, lon: 76.89, edge_index: 0 },
  { id: "akkulam", name: "Akkulam", area: "West", lat: 8.515, lon: 76.9, edge_index: 0 },
  { id: "kumarichantha", name: "Kumarichantha", area: "West", lat: 8.5, lon: 76.925, edge_index: 0 },
  { id: "sreevaraham", name: "Sreevaraham", area: "West", lat: 8.48, lon: 76.935, edge_index: 0 },
  { id: "petta-junction", name: "Enchakkal", area: "West", lat: 8.485, lon: 76.925, edge_index: 0 },

  // IT corridor / Kazhakkoottam
  { id: "kazhakoottam", name: "Kazhakkoottam", area: "IT corridor", lat: 8.5688, lon: 76.8715, edge_index: 0 },
  { id: "technopark", name: "Technopark Phase 1", area: "Kazhakkoottam", lat: 8.5583, lon: 76.8756, edge_index: 0 },
  { id: "technopark-3", name: "Technopark Phase 3", area: "Kulathoor", lat: 8.547, lon: 76.881, edge_index: 0 },
  { id: "karyavattom", name: "Karyavattom Campus", area: "University", lat: 8.564, lon: 76.8865, edge_index: 0 },
  { id: "kulathoor", name: "Kulathoor", area: "IT corridor", lat: 8.555, lon: 76.88, edge_index: 0 },
  { id: "infosys", name: "Infosys Campus", area: "Technopark", lat: 8.5455, lon: 76.878, edge_index: 0 },
  { id: "technocity", name: "Technocity", area: "Pallipuram", lat: 8.59, lon: 76.855, edge_index: 0 },
  { id: "pallipuram", name: "Pallipuram", area: "IT corridor", lat: 8.585, lon: 76.86, edge_index: 0 },
  { id: "menamkulam", name: "Menamkulam", area: "IT corridor", lat: 8.575, lon: 76.865, edge_index: 0 },
  { id: "kariavattom-jn", name: "Kariavattom Junction", area: "University", lat: 8.562, lon: 76.89, edge_index: 0 },
  { id: "engineering-college", name: "College of Engineering", area: "Kulathoor", lat: 8.545, lon: 76.905, edge_index: 0 },
  { id: "sreekaryam-jn", name: "Sreekaryam Junction", area: "North", lat: 8.55, lon: 76.91, edge_index: 0 },

  // Outer / NH / other wards
  { id: "kadakampally", name: "Kadakampally", area: "West", lat: 8.505, lon: 76.905, edge_index: 0 },
  { id: "petta-bypass", name: "Chackai Bypass", area: "West", lat: 8.495, lon: 76.91, edge_index: 0 },
  { id: "sreekaryam-medical", name: "RCC / SCTIMST", area: "Medical College", lat: 8.52, lon: 76.925, edge_index: 0 },
  { id: "satelmond", name: "Satelmond Palace", area: "East", lat: 8.52, lon: 76.96, edge_index: 0 },
  { id: "golf-links", name: "Golf Links", area: "Kowdiar", lat: 8.522, lon: 76.965, edge_index: 0 },
  { id: "vivekananda-nagar", name: "Vivekananda Nagar", area: "East", lat: 8.53, lon: 76.968, edge_index: 0 },
  { id: "pangode", name: "Pangode Military", area: "East", lat: 8.505, lon: 76.985, edge_index: 0 },
  { id: "thiruvallam", name: "Thiruvallam", area: "South", lat: 8.44, lon: 76.96, edge_index: 0 },
  { id: "kalliyoor", name: "Kalliyoor", area: "South", lat: 8.42, lon: 76.995, edge_index: 0 },
  { id: "malayinkeezhu", name: "Malayinkeezhu", area: "South", lat: 8.49, lon: 77.02, edge_index: 0 },
  { id: "vilappilsala", name: "Vilappilsala", area: "East", lat: 8.52, lon: 77.01, edge_index: 0 },
  { id: "nedumangad", name: "Nedumangad", area: "East", lat: 8.603, lon: 77.002, edge_index: 0 },
  { id: "arvikkara", name: "Aruvikkara", area: "East", lat: 8.565, lon: 77.02, edge_index: 0 },
  { id: "venjaramoodu", name: "Venjaramoodu", area: "North", lat: 8.665, lon: 76.91, edge_index: 0 },
  { id: "attingal", name: "Attingal", area: "North", lat: 8.698, lon: 76.815, edge_index: 0 },
  { id: "varkala", name: "Varkala", area: "Coast", lat: 8.7379, lon: 76.7165, edge_index: 0 },
  { id: "kazhakuttam-railway", name: "Kazhakkoottam Railway", area: "IT corridor", lat: 8.566, lon: 76.868, edge_index: 0 },
  { id: "lulu-mall", name: "Lulu Mall Trivandrum", area: "Akkulam", lat: 8.5125, lon: 76.898, edge_index: 0 },
  { id: "gorky-bhavan", name: "Gorky Bhavan", area: "Vazhuthacaud", lat: 8.511, lon: 76.9585, edge_index: 0 },
  { id: "smv", name: "SMV High School", area: "Fort", lat: 8.4845, lon: 76.946, edge_index: 0 },
  { id: "connemara", name: "Connemara Market", area: "Palayam", lat: 8.5048, lon: 76.9505, edge_index: 0 },
  { id: "ayurveda-college", name: "Ayurveda College", area: "Poojappura", lat: 8.49, lon: 76.968, edge_index: 0 },
  { id: "poojappura", name: "Poojappura", area: "South", lat: 8.488, lon: 76.97, edge_index: 0 },
  { id: "kunnukuzhy", name: "Kunnukuzhy", area: "North", lat: 8.515, lon: 76.935, edge_index: 0 },
  { id: "edapazhanji", name: "Edapazhanji", area: "East", lat: 8.505, lon: 76.97, edge_index: 0 },
  { id: "kumarapuram", name: "Kumarapuram", area: "Medical College", lat: 8.525, lon: 76.925, edge_index: 0 },
  { id: "medical-college-jn", name: "Medical College Junction", area: "Ulloor", lat: 8.522, lon: 76.93, edge_index: 0 },
  { id: "kesavadasapuram-jn", name: "Kesavadasapuram Junction", area: "North", lat: 8.536, lon: 76.935, edge_index: 0 },
  { id: "sreekaryam-bypass", name: "Sreekaryam Bypass", area: "North", lat: 8.552, lon: 76.905, edge_index: 0 },
];

function km(aLat: number, aLon: number, bLat: number, bLon: number) {
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLon = ((bLon - aLon) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) *
      Math.cos((bLat * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.min(1, Math.sqrt(x)));
}

export function filterPlaces(
  query = "",
  origin?: { lat: number; lon: number } | null,
  limit = 20,
): Place[] {
  // Search-only: no query → no results (dropdown stays closed until user types)
  const raw = query.trim();
  const q = raw.includes(" · ") ? raw.split(" · ")[0].trim().toLowerCase() : raw.toLowerCase();
  if (!q) return [];

  let rows = TVM_PLACES.map((p) => ({
    ...p,
    distance_km: origin ? km(origin.lat, origin.lon, p.lat, p.lon) : null,
  }));
  rows = rows.filter(
    (p) =>
      p.name.toLowerCase().includes(q) || p.area.toLowerCase().includes(q),
  );
  rows.sort((a, b) => {
    const aName = a.name.toLowerCase().startsWith(q)
      ? 0
      : a.name.toLowerCase().includes(q)
        ? 1
        : 2;
    const bName = b.name.toLowerCase().startsWith(q)
      ? 0
      : b.name.toLowerCase().includes(q)
        ? 1
        : 2;
    if (aName !== bName) return aName - bName;
    return (a.distance_km ?? 0) - (b.distance_km ?? 0) || a.name.localeCompare(b.name);
  });
  return limit > 0 ? rows.slice(0, limit) : rows;
}

export function nearestListedPlace(origin: {
  lat: number;
  lon: number;
}): Place | null {
  if (!TVM_PLACES.length) return null;
  let best = TVM_PLACES[0];
  let bestKm = km(origin.lat, origin.lon, best.lat, best.lon);
  for (const p of TVM_PLACES.slice(1)) {
    const d = km(origin.lat, origin.lon, p.lat, p.lon);
    if (d < bestKm) {
      best = p;
      bestKm = d;
    }
  }
  return { ...best, distance_km: Math.round(bestKm * 10) / 10 };
}

export async function searchPlacesOsm(
  query: string,
  origin?: { lat: number; lon: number } | null,
  limit = 25,
): Promise<Place[]> {
  const q = query.trim();
  if (!q) return [];
  try {
    const params = new URLSearchParams({
      q,
      limit: String(limit),
    });
    if (origin) {
      params.set("lat", String(origin.lat));
      params.set("lon", String(origin.lon));
    }
    const res = await fetch(`/api/places?${params.toString()}`);
    const data = await res.json();
    if (!res.ok || data.error) {
      return filterPlaces(q, origin, limit);
    }
    const rows = (data.places || []) as Place[];
    return rows.map((p) => ({
      id: p.id,
      name: p.name,
      area: p.area || "OSM",
      lat: Number(p.lat),
      lon: Number(p.lon),
      edge_index: Number(p.edge_index ?? 0),
      edge_id: p.edge_id ?? null,
      distance_km: p.distance_km ?? null,
      snap_km: p.snap_km ?? null,
      source: p.source ?? "osm",
    }));
  } catch {
    return filterPlaces(q, origin, limit);
  }
}

export async function snapPlace(place: Place): Promise<Place> {
  try {
    const params = new URLSearchParams({
      lat: String(place.lat),
      lon: String(place.lon),
    });
    const res = await fetch(`/api/nearest?${params.toString()}`);
    const data = await res.json();
    const origin = data.origin as Place | undefined;
    if (res.ok && origin) {
      return {
        ...place,
        edge_index: origin.edge_index,
        edge_id: origin.edge_id,
        snap_km: origin.snap_km,
      };
    }
  } catch {
    /* Flask optional for listing; lat/lon still route */
  }
  return place;
}

export function watchLiveLocation(
  onFix: (coords: { lat: number; lon: number }) => void,
  onError: (message: string) => void,
) {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    onError("Geolocation is not available in this browser.");
    return () => undefined;
  }
  const id = navigator.geolocation.watchPosition(
    (pos) => onFix({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
    (err) => onError(err.message || "Location permission denied."),
    { enableHighAccuracy: true, maximumAge: 15000, timeout: 12000 },
  );
  return () => navigator.geolocation.clearWatch(id);
}
