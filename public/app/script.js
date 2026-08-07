/* =====================================================================
   RainSafeRoute — flood-aware navigation prototype
   Frontend only. Real APIs used when reachable, demo fallback otherwise.
   ===================================================================== */

/* Insert an OpenRouteService key here to use ORS instead of public OSRM. */
const ORS_API_KEY = "YOUR_API_KEY";

const OSRM_URL = "https://router.project-osrm.org/route/v1/driving/";
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

const STORE_KEY = "rsr_state_v1";

/* =====================================================================
   DEMO DATA
   ===================================================================== */
const PRESET_LOCATIONS = [
  { name: "IGDTUW, Kashmere Gate", lat: 28.6664, lng: 77.2308 },
  { name: "India Gate", lat: 28.6129, lng: 77.2295 },
  { name: "Connaught Place", lat: 28.6315, lng: 77.2167 },
  { name: "Kashmere Gate", lat: 28.6675, lng: 77.2281 },
  { name: "Anand Vihar", lat: 28.6469, lng: 77.3159 },
  { name: "Lajpat Nagar", lat: 28.5677, lng: 77.2433 },
  { name: "Saket", lat: 28.5245, lng: 77.2066 },
  { name: "Rohini", lat: 28.7361, lng: 77.1223 },
  { name: "Dwarka", lat: 28.5921, lng: 77.046 },
  { name: "Noida Sector 18", lat: 28.5708, lng: 77.3260 },
  { name: "Gurugram Cyber City", lat: 28.4949, lng: 77.0895 },
  { name: "Karol Bagh", lat: 28.6519, lng: 77.1909 },
  { name: "Nehru Place", lat: 28.5494, lng: 77.2519 },
  { name: "Chandni Chowk", lat: 28.6562, lng: 77.2301 },
];

const HOTSPOTS = [
  { name: "Minto Bridge Underpass", lat: 28.6338, lng: 77.2225, severity: "Extreme", source: "Historical/Demo" },
  { name: "ITO Crossing", lat: 28.6289, lng: 77.2412, severity: "High", source: "Historical/Demo" },
  { name: "Pul Prahladpur Underpass", lat: 28.5017, lng: 77.2871, severity: "Extreme", source: "Historical/Demo" },
  { name: "Zakhira Underpass", lat: 28.6672, lng: 77.1546, severity: "High", source: "Historical/Demo" },
  { name: "Azadpur Mandi Road", lat: 28.7075, lng: 77.1758, severity: "Moderate", source: "Historical/Demo" },
  { name: "Ring Road, Bhairon Marg", lat: 28.6153, lng: 77.2447, severity: "High", source: "Historical/Demo" },
  { name: "Moolchand Underpass", lat: 28.5673, lng: 77.2378, severity: "High", source: "Historical/Demo" },
  { name: "Okhla Underpass", lat: 28.5501, lng: 77.2775, severity: "Moderate", source: "Historical/Demo" },
  { name: "Rajghat Ring Road", lat: 28.6412, lng: 77.2495, severity: "Moderate", source: "Historical/Demo" },
  { name: "Tilak Bridge", lat: 28.6252, lng: 77.2418, severity: "High", source: "Historical/Demo" },
  { name: "Jangpura Underpass", lat: 28.5842, lng: 77.2465, severity: "Moderate", source: "Historical/Demo" },
  { name: "Dhaula Kuan Loop", lat: 28.5915, lng: 77.1610, severity: "Moderate", source: "Historical/Demo" },
];

const HOSPITALS = [
  { name: "LNJP Hospital (Demo)", lat: 28.6395, lng: 77.2337, emergency: true },
  { name: "AIIMS Trauma Centre (Demo)", lat: 28.5672, lng: 77.2100, emergency: true },
  { name: "Ram Manohar Lohia Hospital (Demo)", lat: 28.6262, lng: 77.2050, emergency: true },
  { name: "Safdarjung Hospital (Demo)", lat: 28.5680, lng: 77.2064, emergency: true },
  { name: "GTB Hospital (Demo)", lat: 28.6836, lng: 77.3116, emergency: true },
  { name: "Hindu Rao Hospital (Demo)", lat: 28.6740, lng: 77.2074, emergency: false },
  { name: "Max Saket (Demo)", lat: 28.5279, lng: 77.2148, emergency: true },
  { name: "Fortis Noida (Demo)", lat: 28.5698, lng: 77.3260, emergency: true },
];

const HELPLINES = [
  { n: "112", label: "Unified Emergency" },
  { n: "108", label: "Ambulance" },
  { n: "101", label: "Fire" },
  { n: "100", label: "Police" },
  { n: "1098", label: "Child Helpline" },
  { n: "181", label: "Women Helpline" },
];

const SEED_REPORTS = [
  { id: "seed1", location: "Minto Bridge Underpass", lat: 28.6340, lng: 77.2229, severity: "Road completely blocked", status: "verified", desc: "Underpass fully submerged, traffic diverted.", photo: true, ts: Date.now() - 14 * 60000, own: false },
  { id: "seed2", location: "ITO Crossing", lat: 28.6291, lng: 77.2415, severity: "Knee-level", status: "pending", desc: "Water rising near the signal.", photo: false, ts: Date.now() - 38 * 60000, own: false },
  { id: "seed3", location: "Ring Road, Bhairon Marg", lat: 28.6150, lng: 77.2450, severity: "Ankle-level", status: "verified", desc: "Slow moving traffic, shallow water.", photo: false, ts: Date.now() - 75 * 60000, own: false },
  { id: "seed4", location: "Moolchand Underpass", lat: 28.5675, lng: 77.2381, severity: "Waist-level", status: "pending", desc: "Two-wheelers stranded.", photo: true, ts: Date.now() - 26 * 60000, own: false },
];

const VEHICLE_PROFILES = {
  car:       { label: "🚗 Car", note: "Standard routing with flood-risk weighting.", riskMul: 1.0, banner: "" },
  bike:      { label: "🏍️ Bike", note: "🏍️ Avoiding high-risk roads and severe waterlogging.", riskMul: 1.25, banner: "" },
  truck:     { label: "🚚 Truck", note: "🚚 Avoiding narrow roads, low-clearance stretches and severe flood areas.", riskMul: 1.15, banner: "" },
  ambulance: { label: "🚑 Emergency Vehicle", note: "🚑 Emergency Priority Mode Active — safety and reliability prioritised.", riskMul: 0.9, banner: "🚑 Emergency Priority Mode Active" },
  fire:      { label: "🚒 Fire & Rescue", note: "🚒 Avoiding flooded and low-clearance routes.", riskMul: 0.95, banner: "" },
  school:    { label: "🏫 School Bus", note: "🏫 School Safety Mode — strict safety thresholds applied.", riskMul: 1.4, banner: "🏫 School Safety Mode" },
  delivery:  { label: "📦 Delivery", note: "📦 Balancing safety, ETA and route efficiency.", riskMul: 1.05, banner: "" },
};

/* =====================================================================
   STATE + LOCAL STORAGE
   ===================================================================== */
const defaultState = () => ({
  reports: SEED_REPORTS.map((r) => ({ ...r })),
  vehicle: "car",
  lastSource: "IGDTUW, Kashmere Gate",
  lastDest: "India Gate",
  simRunning: false,
  rainfall: 18.6,
  rainSource: "Simulated",
  temp: 29.4,
  condition: "Heavy Rain",
  updatedAt: Date.now(),
  rainHistory: [0, 2.4, 5.1, 8.3, 11.2, 14.9, 18.6],
  analytics: { routes: 1248, safe: 824, risky: 287, reportsCount: 34 },
});

let state = load();
let routes = [];
let selectedRouteId = null;
let simTimer = null;
let simStep = 0;
const SIM_SEQUENCE = [0, 3, 7, 12, 18, 25, 32, 25, 18, 12, 7, 3];

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return defaultState();
    return Object.assign(defaultState(), JSON.parse(raw));
  } catch (e) {
    return defaultState();
  }
}
function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* storage full / blocked */ }
}

/* =====================================================================
   HELPERS
   ===================================================================== */
const $ = (id) => document.getElementById(id);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (x, x0, x1, y0, y1) => y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);

function toast(msg, type = "info") {
  const el = document.createElement("div");
  el.className = "toast " + type;
  el.textContent = msg;
  $("toastWrap").appendChild(el);
  setTimeout(() => el.remove(), 4200);
}

function haversine(a, b) {
  const R = 6371000, toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}
function minDistanceToPath(point, path) {
  let min = Infinity;
  for (let i = 0; i < path.length; i++) {
    const d = haversine(point, path[i]);
    if (d < min) min = d;
  }
  return min;
}
function timeAgo(ts) {
  const m = Math.round((Date.now() - ts) / 60000);
  if (m < 1) return "just now";
  if (m < 60) return m + " min ago";
  const h = Math.floor(m / 60);
  return h + " hr " + (m % 60) + " min ago";
}

/* =====================================================================
   FLOOD RISK ENGINE
   ===================================================================== */
function calculateRainfallFactor(rainfall) {
  const r = Math.max(0, Number(rainfall) || 0);
  if (r === 0) return 0;
  if (r <= 5) return lerp(r, 0, 5, 0, 20);
  if (r <= 15) return lerp(r, 5, 15, 20, 50);
  if (r <= 30) return lerp(r, 15, 30, 50, 80);
  return 100;
}
function calculateProximityFactor(distanceMeters) {
  const d = Number(distanceMeters);
  if (!isFinite(d)) return 0;
  if (d <= 100) return 100;
  if (d <= 300) return 75;
  if (d <= 500) return 50;
  if (d <= 1000) return 25;
  return 0;
}
function calculateCommunityFactor(reports) {
  const active = reports.filter((r) => r.status !== "rejected");
  const verified = active.filter((r) => r.status === "verified").length;
  if (verified >= 3) return 100;
  if (active.length >= 2 || verified >= 1) return 80;
  if (active.length === 1) return 40;
  return 0;
}
function calculateFloodRisk(rainfallFactor, proximityFactor, communityFactor) {
  return clamp(0.4 * rainfallFactor + 0.35 * proximityFactor + 0.25 * communityFactor, 0, 100);
}
function calculateSafetyScore(floodRisk) {
  return clamp(100 - floodRisk, 0, 100);
}
function classifyRisk(score) {
  if (score <= 25) return { label: "LOW", icon: "🟢" };
  if (score <= 50) return { label: "MODERATE", icon: "🟡" };
  if (score <= 75) return { label: "HIGH", icon: "🟠" };
  return { label: "EXTREME", icon: "🔴" };
}

/* =====================================================================
   MAP
   ===================================================================== */
let map, layers = {};

function emojiIcon(emoji, size = 26) {
  return L.divIcon({ html: `<div class="pin">${emoji}</div>`, className: "", iconSize: [size, size], iconAnchor: [size / 2, size / 2] });
}

function initMap() {
  map = L.map("map", { zoomControl: true }).setView([28.64, 77.23], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  layers.routes = L.layerGroup().addTo(map);
  layers.points = L.layerGroup().addTo(map);
  layers.hotspots = L.layerGroup().addTo(map);
  layers.reports = L.layerGroup().addTo(map);
  layers.hospitals = L.layerGroup().addTo(map);

  drawHotspots();
  drawReports();
  drawHospitals(HOSPITALS.slice(0, 5));
}

function drawHotspots() {
  layers.hotspots.clearLayers();
  HOTSPOTS.forEach((h) => {
    const m = L.marker([h.lat, h.lng], { icon: emojiIcon("⚠️") }).addTo(layers.hotspots);
    h._marker = m;
    m.bindPopup(hotspotPopup(h));
    L.circle([h.lat, h.lng], { radius: 300, color: "#f59e0b", weight: 1, fillOpacity: 0.07 }).addTo(layers.hotspots);
  });
}
function hotspotPopup(h) {
  let extra = "";
  const best = routes.find((r) => r.id === selectedRouteId) || routes[0];
  if (best) extra = `<br/>Distance from selected route: <b>${Math.round(minDistanceToPath(h, best.path))} m</b>`;
  return `<b>⚠️ ${h.name}</b><br/>Historical risk: <b>${h.severity}</b><br/>Severity: ${h.severity}${extra}<br/><small>Source: ${h.source}</small>`;
}

function drawReports() {
  layers.reports.clearLayers();
  state.reports.filter((r) => r.status !== "rejected").forEach((r) => {
    const m = L.marker([r.lat, r.lng], { icon: emojiIcon("📢") }).addTo(layers.reports);
    r._marker = m;
    m.bindPopup(
      `<b>📢 ${r.location}</b><br/>Severity: <b>${r.severity}</b><br/>${timeAgo(r.ts)}<br/>${r.status === "verified" ? "✅ Verified" : "⏳ Unverified"}${r.photo ? "<br/>📷 Photo attached" : ""}<br/><small>${r.desc || ""}</small><br/><small>DEMO COMMUNITY DATA</small>`
    );
  });
}

function drawHospitals(list) {
  layers.hospitals.clearLayers();
  list.forEach((h) => {
    const m = L.marker([h.lat, h.lng], { icon: emojiIcon("🏥") }).addTo(layers.hospitals);
    h._marker = m;
    m.bindPopup(`<b>🏥 ${h.name}</b><br/>${h.emergency ? "🚑 Emergency services available" : "Outpatient / limited emergency"}${h._dist ? "<br/>📍 " + (h._dist / 1000).toFixed(1) + " km from source" : ""}<br/><small>DEMO DATA — call 112 or 108 in an emergency</small>`);
  });
}

/* =====================================================================
   GEOCODING
   ===================================================================== */
function presetMatches(q) {
  const s = q.trim().toLowerCase();
  if (!s) return [];
  return PRESET_LOCATIONS.filter((p) => p.name.toLowerCase().includes(s)).slice(0, 6);
}

async function geocode(query) {
  const q = query.trim();
  if (!q) throw new Error("empty");
  try {
    const res = await fetch(`${NOMINATIM_URL}?format=json&limit=1&countrycodes=in&q=${encodeURIComponent(q)}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error("http");
    const data = await res.json();
    if (data && data.length) {
      return { name: data[0].display_name.split(",").slice(0, 3).join(","), lat: +data[0].lat, lng: +data[0].lon, live: true };
    }
    throw new Error("nores");
  } catch (e) {
    const local = presetMatches(q)[0] || PRESET_LOCATIONS.find((p) => p.name.toLowerCase().startsWith(q.toLowerCase()));
    if (local) return { ...local, live: false };
    throw new Error("notfound");
  }
}

function wireAutocomplete(inputId, boxId) {
  const input = $(inputId), box = $(boxId);
  let timer = null;
  input.addEventListener("input", () => {
    const q = input.value.trim();
    clearTimeout(timer);
    if (q.length < 2) { box.classList.remove("show"); return; }
    render(presetMatches(q));
    timer = setTimeout(async () => {
      try {
        const res = await fetch(`${NOMINATIM_URL}?format=json&limit=5&countrycodes=in&q=${encodeURIComponent(q)}`);
        if (!res.ok) return;
        const data = await res.json();
        render(
          data.map((d) => ({ name: d.display_name.split(",").slice(0, 3).join(","), lat: +d.lat, lng: +d.lon }))
            .concat(presetMatches(q)).slice(0, 7)
        );
      } catch (e) { /* offline: keep preset suggestions */ }
    }, 450);
  });
  input.addEventListener("blur", () => setTimeout(() => box.classList.remove("show"), 180));

  function render(items) {
    box.innerHTML = "";
    if (!items.length) { box.classList.remove("show"); return; }
    items.forEach((it) => {
      const d = document.createElement("div");
      d.textContent = it.name;
      d.onclick = () => { input.value = it.name; box.classList.remove("show"); };
      box.appendChild(d);
    });
    box.classList.add("show");
  }
}

/* =====================================================================
   ROUTING
   ===================================================================== */
function decodePolyline(str, precision = 5) {
  let index = 0, lat = 0, lng = 0, coords = [], factor = Math.pow(10, precision);
  while (index < str.length) {
    let b, shift = 0, result = 0;
    do { b = str.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lat += result & 1 ? ~(result >> 1) : result >> 1;
    shift = 0; result = 0;
    do { b = str.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lng += result & 1 ? ~(result >> 1) : result >> 1;
    coords.push({ lat: lat / factor, lng: lng / factor });
  }
  return coords;
}

function offsetVia(a, b, ratio) {
  const mid = { lat: (a.lat + b.lat) / 2, lng: (a.lng + b.lng) / 2 };
  const dx = b.lng - a.lng, dy = b.lat - a.lat;
  return { lat: mid.lat + dx * ratio, lng: mid.lng - dy * ratio };
}

async function osrmRoute(points) {
  const coords = points.map((p) => `${p.lng},${p.lat}`).join(";");
  const res = await fetch(`${OSRM_URL}${coords}?overview=full&alternatives=true&steps=false`);
  if (!res.ok) throw new Error("routing");
  const data = await res.json();
  if (!data.routes || !data.routes.length) throw new Error("noroute");
  return data.routes.map((r) => ({
    path: decodePolyline(r.geometry),
    distance: r.distance,
    duration: r.duration,
  }));
}

async function orsRoute(a, b, via) {
  const coordinates = via ? [[a.lng, a.lat], [via.lng, via.lat], [b.lng, b.lat]] : [[a.lng, a.lat], [b.lng, b.lat]];
  const res = await fetch("https://api.openrouteservice.org/v2/directions/driving-car/geojson", {
    method: "POST",
    headers: { Authorization: ORS_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ coordinates }),
  });
  if (!res.ok) throw new Error("ors");
  const data = await res.json();
  const f = data.features[0];
  return {
    path: f.geometry.coordinates.map((c) => ({ lat: c[1], lng: c[0] })),
    distance: f.properties.summary.distance,
    duration: f.properties.summary.duration,
  };
}

/* Demo fallback: a road-like curved corridor (never a straight line). */
function demoPath(a, b, bend) {
  const pts = [];
  const steps = 48;
  const dx = b.lng - a.lng, dy = b.lat - a.lat;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const arc = Math.sin(t * Math.PI) * bend;
    // grid-like jitter mimics city blocks instead of a smooth straight line
    const jitter = Math.sin(t * Math.PI * 9) * 0.0016 * (1 - Math.abs(0.5 - t) * 1.2);
    pts.push({
      lat: a.lat + dy * t + dx * arc + jitter,
      lng: a.lng + dx * t - dy * arc + jitter * 0.6,
    });
  }
  return pts;
}
function pathLength(path) {
  let d = 0;
  for (let i = 1; i < path.length; i++) d += haversine(path[i - 1], path[i]);
  return d;
}

async function buildRoutes(src, dst) {
  let raw = [];
  const usingOrs = ORS_API_KEY && ORS_API_KEY !== "YOUR_API_KEY";
  try {
    if (usingOrs) {
      const bends = [0, 0.12, -0.12];
      raw = await Promise.all(bends.map((bnd) => orsRoute(src, dst, bnd ? offsetVia(src, dst, bnd) : null)));
    } else {
      raw = await osrmRoute([src, dst]);
      if (raw.length < 3) {
        const extras = await Promise.all(
          [0.14, -0.14].map((bnd) => osrmRoute([src, offsetVia(src, dst, bnd), dst]).then((r) => r[0]).catch(() => null))
        );
        extras.filter(Boolean).forEach((r) => raw.push(r));
      }
    }
  } catch (e) {
    toast("Routing service unavailable — using demo road corridors.", "warn");
    raw = [];
  }

  if (raw.length < 3) {
    const bends = [0.02, 0.13, -0.11];
    for (let i = raw.length; i < 3; i++) {
      const path = demoPath(src, dst, bends[i]);
      const dist = pathLength(path);
      raw.push({ path, distance: dist, duration: (dist / 1000 / 24) * 3600, demo: true });
    }
  }

  raw = raw.slice(0, 3).sort((a, b) => a.duration - b.duration);
  return raw;
}

/* =====================================================================
   RISK SCORING PER ROUTE
   ===================================================================== */
function scoreRoute(r) {
  const mul = VEHICLE_PROFILES[state.vehicle].riskMul;
  let nearest = Infinity, nearestName = "—";
  HOTSPOTS.forEach((h) => {
    const d = minDistanceToPath(h, r.path);
    if (d < nearest) { nearest = d; nearestName = h.name; }
  });
  const nearbyReports = state.reports.filter(
    (rep) => rep.status !== "rejected" && Date.now() - rep.ts <= 2 * 3600000 && minDistanceToPath(rep, r.path) <= 500
  );
  const rainF = calculateRainfallFactor(state.rainfall);
  const proxF = calculateProximityFactor(nearest);
  const commF = calculateCommunityFactor(nearbyReports);
  const risk = clamp(calculateFloodRisk(rainF, proxF, commF) * mul, 0, 100);
  return Object.assign(r, {
    nearestHotspot: nearest,
    nearestHotspotName: nearestName,
    reportCount: nearbyReports.length,
    rainFactor: rainF,
    proxFactor: proxF,
    commFactor: commF,
    floodRisk: Math.round(risk),
    safety: Math.round(calculateSafetyScore(risk)),
  });
}

function rescoreAll(redraw = true) {
  if (!routes.length) return;
  routes.forEach(scoreRoute);
  assignRoles();
  if (redraw) { renderRouteCards(); renderComparison(); renderAdvisory(); drawRoutePolylines(); }
}

function assignRoles() {
  const byTime = [...routes].sort((a, b) => a.duration - b.duration);
  const bySafety = [...routes].sort((a, b) => b.safety - a.safety);
  routes.forEach((r) => (r.role = "alt"));
  byTime[0].role = "fastest";
  const safest = bySafety.find((r) => r.role !== "fastest") || bySafety[0];
  if (safest.safety >= byTime[0].safety) safest.role = "safest";
  else byTime[0].role = "fastest";
  if (!routes.some((r) => r.role === "safest")) bySafety[0].role = "safest";
  const recommended = [...routes].sort((a, b) => b.safety - a.safety)[0];
  routes.forEach((r) => (r.recommended = r === recommended));
  if (!selectedRouteId || !routes.some((r) => r.id === selectedRouteId)) selectedRouteId = recommended.id;
}

const ROLE_META = {
  fastest: { name: "FASTEST", color: "#ef4444", dot: "🔴", cls: "rc-fastest" },
  safest: { name: "SAFEST", color: "#22c55e", dot: "🟢", cls: "rc-safest" },
  alt: { name: "ALTERNATIVE", color: "#111827", dot: "⚫", cls: "rc-alt" },
};

/* =====================================================================
   RENDERING — ROUTES
   ===================================================================== */
function drawRoutePolylines() {
  layers.routes.clearLayers();
  routes.forEach((r) => {
    const meta = ROLE_META[r.role];
    const selected = r.id === selectedRouteId;
    L.polyline(r.path.map((p) => [p.lat, p.lng]), {
      color: meta.color,
      weight: selected ? 8 : 4.5,
      opacity: selected ? 0.95 : 0.55,
    })
      .addTo(layers.routes)
      .bindPopup(`<b>${meta.dot} ${meta.name} route</b><br/>${(r.distance / 1000).toFixed(1)} km · ${Math.round(r.duration / 60)} min<br/>Flood risk: <b>${r.floodRisk}/100</b> · Safety: <b>${r.safety}/100</b>`)
      .on("click", () => selectRoute(r.id));
  });
}

function selectRoute(id) {
  selectedRouteId = id;
  renderRouteCards();
  drawRoutePolylines();
  const r = routes.find((x) => x.id === id);
  if (r) {
    map.fitBounds(L.latLngBounds(r.path.map((p) => [p.lat, p.lng])), { padding: [40, 40] });
    toast(`${ROLE_META[r.role].dot} ${ROLE_META[r.role].name} route selected — safety ${r.safety}/100.`, r.safety >= 60 ? "ok" : "warn");
  }
}

function renderRouteCards() {
  const wrap = $("routeCards");
  if (!routes.length) {
    wrap.innerHTML = '<div class="empty-state">Enter a source and destination, then press <b>FIND SAFE ROUTES</b>.</div>';
    return;
  }
  const order = { fastest: 0, safest: 1, alt: 2 };
  const sorted = [...routes].sort((a, b) => order[a.role] - order[b.role]);
  wrap.innerHTML = sorted
    .map((r, i) => {
      const meta = ROLE_META[r.role];
      const cls = classifyRisk(r.floodRisk);
      return `
      <div class="route-card ${meta.cls} ${r.id === selectedRouteId ? "selected" : ""}">
        <div class="rc-head">
          <div>
            <div class="rc-index">ROUTE 0${i + 1}</div>
            <div class="rc-type">${meta.dot} ${meta.name}</div>
          </div>
          ${r.recommended ? '<span class="rc-star">⭐ RECOMMENDED</span>' : ""}
        </div>
        <div class="rc-main">
          <div>${(r.distance / 1000).toFixed(1)}<small>kilometres</small></div>
          <div>${Math.round(r.duration / 60)}<small>minutes ETA</small></div>
        </div>
        <div class="rc-metrics">
          <div><span>Flood Risk</span><b>${r.floodRisk} / 100</b></div>
          <div><span>Safety Score</span><b>${r.safety} / 100</b></div>
          <div><span>Nearest Hotspot</span><b>${Math.round(r.nearestHotspot)} m</b></div>
          <div><span>Rainfall</span><b>${state.rainfall.toFixed(1)} mm/hr</b></div>
          <div><span>Proximity Risk</span><b>${r.proxFactor}/100</b></div>
          <div><span>Community Risk</span><b>${r.commFactor}/100</b></div>
        </div>
        <div class="risk-pill risk-${cls.label}">${cls.icon} ${cls.label} RISK</div>
        <div class="rc-reco">${routeRecommendationText(r)}</div>
        <button class="btn btn-block ${r.id === selectedRouteId ? "btn-info" : "btn-ghost"}" data-select="${r.id}">
          ${r.id === selectedRouteId ? "VIEWING ROUTE" : r.role === "safest" ? "SELECT ROUTE" : "VIEW ROUTE"}
        </button>
      </div>`;
    })
    .join("");
  wrap.querySelectorAll("[data-select]").forEach((b) => (b.onclick = () => selectRoute(b.dataset.select)));
}

function routeRecommendationText(r) {
  const fastest = routes.find((x) => x.role === "fastest");
  if (r.recommended) {
    if (fastest && fastest !== r && fastest.floodRisk > 0) {
      const cut = Math.round(((fastest.floodRisk - r.floodRisk) / fastest.floodRisk) * 100);
      const extra = Math.max(0, Math.round((r.duration - fastest.duration) / 60));
      return `Recommended: ${cut}% lower flood risk than the fastest route${extra ? `, +${extra} min travel time` : ""}.`;
    }
    return "Recommended: highest safety score for current conditions.";
  }
  if (r.nearestHotspot < 300) return `Passes within ${Math.round(r.nearestHotspot)} m of ${r.nearestHotspotName}.`;
  if (r.reportCount) return `${r.reportCount} active waterlogging report(s) within 500 m.`;
  return "Viable alternative if the recommended route is congested.";
}

function renderComparison() {
  if (!routes.length) return;
  $("compareCard").hidden = false;
  const order = { fastest: 0, safest: 1, alt: 2 };
  const sorted = [...routes].sort((a, b) => order[a.role] - order[b.role]);
  $("compareTable").innerHTML =
    `<thead><tr><th>Route</th><th>Distance</th><th>ETA</th><th>Flood Risk</th><th>Safety</th><th>Nearest Hotspot</th><th>Class</th></tr></thead><tbody>` +
    sorted
      .map((r) => {
        const m = ROLE_META[r.role], c = classifyRisk(r.floodRisk);
        return `<tr><td>${m.dot} ${m.name}${r.recommended ? " ⭐" : ""}</td><td>${(r.distance / 1000).toFixed(1)} km</td><td>${Math.round(r.duration / 60)} min</td><td>${r.floodRisk}</td><td>${r.safety}</td><td>${Math.round(r.nearestHotspot)} m</td><td>${c.icon} ${c.label}</td></tr>`;
      })
      .join("") +
    "</tbody>";
}

function renderAdvisory() {
  if (!routes.length) return;
  const fastest = routes.find((r) => r.role === "fastest");
  const best = routes.find((r) => r.recommended);
  const cls = classifyRisk(best.floodRisk);
  const cut = fastest.floodRisk > 0 ? Math.round(((fastest.floodRisk - best.floodRisk) / fastest.floodRisk) * 100) : 0;
  const extra = Math.max(0, Math.round((best.duration - fastest.duration) / 60));
  const banner = VEHICLE_PROFILES[state.vehicle].banner;
  $("advisoryCard").hidden = false;
  $("advisoryBody").innerHTML = `
    ${banner ? `<p><b>${banner}</b></p>` : ""}
    <p>${state.rainSource === "Live" ? "Live" : "Simulated"} rainfall in this area is <b>${state.rainfall.toFixed(1)} mm/hr</b> (${state.condition}).</p>
    <p>The fastest route passes within <b>${Math.round(fastest.nearestHotspot)} m</b> of ${fastest.nearestHotspotName} (historical/demo hotspot).</p>
    <p>${best === fastest
      ? "The fastest route is currently also the safest option."
      : `Consider the ${ROLE_META[best.role].dot} ${ROLE_META[best.role].name.toLowerCase()} route. It adds ${extra} minute(s) but reduces estimated flood risk by ${cut}%.`}</p>
    <p>Current classification for the recommended route: <b>${cls.icon} ${cls.label} RISK</b> (${best.floodRisk}/100).</p>`;
}

/* =====================================================================
   HOSPITALS
   ===================================================================== */
async function loadHospitals(center) {
  let list = [];
  try {
    const q = `[out:json][timeout:12];(node["amenity"="hospital"](around:6000,${center.lat},${center.lng}););out 12;`;
    const res = await fetch("https://overpass-api.de/api/interpreter", { method: "POST", body: q });
    if (!res.ok) throw new Error("overpass");
    const data = await res.json();
    list = (data.elements || [])
      .filter((e) => e.tags && e.tags.name)
      .map((e) => ({ name: e.tags.name, lat: e.lat, lng: e.lon, emergency: e.tags.emergency === "yes" }));
    if (!list.length) throw new Error("empty");
    $("hospitalTag").textContent = "LIVE OSM DATA";
    $("hospitalTag").className = "tag tag-safe";
  } catch (e) {
    list = HOSPITALS.map((h) => ({ ...h }));
    $("hospitalTag").textContent = "DEMO DATA";
    $("hospitalTag").className = "tag tag-warn";
  }
  list.forEach((h) => (h._dist = haversine(center, h)));
  list.sort((a, b) => a._dist - b._dist);
  list = list.slice(0, 6);
  drawHospitals(list);
  $("hospitalCard").hidden = false;
  $("hospitalList").innerHTML = list
    .map(
      (h, i) => `<div class="item">
      <div><h5>🏥 ${h.name}</h5>
        <p>📍 ${(h._dist / 1000).toFixed(1)} km from source</p>
        <p>🚑 ${h.emergency ? "Emergency availability listed" : "Emergency availability not confirmed"}</p>
      </div>
      <div class="actions">
        <a class="btn btn-danger" href="tel:108">📞 Call 108</a>
        <button class="btn btn-ghost" data-hosp="${i}">🗺️ View on map</button>
      </div></div>`
    )
    .join("");
  $("hospitalList").querySelectorAll("[data-hosp]").forEach((b) => {
    b.onclick = () => {
      const h = list[+b.dataset.hosp];
      map.setView([h.lat, h.lng], 15);
      if (h._marker) h._marker.openPopup();
      toast(`${h.name} — ${(h._dist / 1000).toFixed(1)} km away.`, "info");
    };
  });
}

/* =====================================================================
   WEATHER (Open-Meteo) + RAINFALL SIMULATION
   ===================================================================== */
const INTENSITY = (r) =>
  r === 0 ? "No Rain" : r < 2.5 ? "Light Rain" : r < 7.6 ? "Moderate Rain" : r < 20 ? "Heavy Rain" : "Extreme Rain";

function setRainfall(mm, source) {
  state.rainfall = Math.max(0, +(+mm).toFixed(1));
  state.condition = INTENSITY(state.rainfall);
  state.rainSource = source || "Simulated";
  state.updatedAt = Date.now();
  state.rainHistory.push(state.rainfall);
  if (state.rainHistory.length > 12) state.rainHistory.shift();
  save();
  renderWeather();
  rescoreAll();
  drawCharts();
}

function renderWeather() {
  const live = state.rainSource === "Live";
  $("rainValue").textContent = state.rainfall.toFixed(1);
  $("rainIntensity").textContent = state.condition;
  $("rainTemp").textContent = state.temp ? state.temp.toFixed(1) + " °C" : "—";
  $("rainUpdated").textContent = timeAgo(state.updatedAt);
  $("rainBarFill").style.width = clamp((state.rainfall / 35) * 100, 2, 100) + "%";
  $("rainBadge").textContent = `🌧️ ${state.rainfall.toFixed(1)} mm/hr`;
  $("rainSourceTag").textContent = live ? "LIVE WEATHER DATA" : "SIMULATED";
  $("rainSourceTag").className = live ? "tag tag-safe" : "tag tag-warn";
  $("rf2Value").textContent = state.rainfall.toFixed(1) + " mm/hr";
  $("rf2Intensity").textContent = state.condition;
  $("rf2Condition").textContent = state.condition;
  $("rf2Temp").textContent = state.temp ? state.temp.toFixed(1) + " °C" : "—";
  $("rf2Source").textContent = live ? "Open-Meteo (live)" : "Simulated demo";
  $("rf2Updated").textContent = timeAgo(state.updatedAt);
  $("modeBadge").textContent = live ? "🔵 LIVE + DEMO MODE" : "🟢 DEMO MODE";
  renderRainFx();
}

let rainDropsBuilt = false;
function renderRainFx() {
  const fx = $("rainFx");
  if (!rainDropsBuilt) {
    for (let i = 0; i < 60; i++) {
      const s = document.createElement("span");
      s.style.left = Math.random() * 100 + "%";
      s.style.animationDuration = 0.6 + Math.random() * 0.8 + "s";
      s.style.animationDelay = Math.random() * 2 + "s";
      fx.appendChild(s);
    }
    rainDropsBuilt = true;
  }
  fx.classList.toggle("on", state.rainfall > 0.5);
  fx.style.filter = `opacity(${clamp(state.rainfall / 25, 0.25, 1)})`;
}

async function fetchLiveWeather(coords) {
  const c = coords || { lat: 28.6448, lng: 77.216 };
  try {
    const res = await fetch(`${OPEN_METEO_URL}?latitude=${c.lat}&longitude=${c.lng}&current=precipitation,rain,temperature_2m,weather_code`);
    if (!res.ok) throw new Error("weather");
    const d = await res.json();
    state.temp = d.current.temperature_2m;
    setRainfall(d.current.rain != null ? d.current.rain : d.current.precipitation || 0, "Live");
    toast("Live weather loaded from Open-Meteo.", "ok");
    return true;
  } catch (e) {
    toast("Weather API unavailable — continuing with simulated rainfall.", "warn");
    setRainfall(state.rainfall, "Simulated");
    return false;
  }
}

function startSim() {
  if (simTimer) return;
  state.simRunning = true;
  save();
  updateSimUi();
  simTimer = setInterval(() => {
    simStep = (simStep + 1) % SIM_SEQUENCE.length;
    setRainfall(SIM_SEQUENCE[simStep], "Simulated");
    if (Math.random() < 0.18) autoGenerateReport();
    state.analytics.routes += Math.floor(Math.random() * 3);
    save();
    renderAnalytics();
    renderAdmin();
  }, 5000);
  toast("Rainfall simulation started.", "ok");
}
function pauseSim() {
  clearInterval(simTimer);
  simTimer = null;
  state.simRunning = false;
  save();
  updateSimUi();
  toast("Simulation paused.", "info");
}
function updateSimUi() {
  const running = !!simTimer;
  $("simBadge").textContent = running ? "▶ Simulation running" : "⏸ Simulation paused";
  $("simToggle").textContent = running ? "⏸ Pause Rainfall" : "▶ Simulate Rainfall";
  $("simToggle2").textContent = running ? "⏸ Pause Auto Simulation" : "▶ Auto Simulation";
}

/* =====================================================================
   COMMUNITY REPORTS
   ===================================================================== */
let reportFilter = "all";

function autoGenerateReport() {
  const h = HOTSPOTS[Math.floor(Math.random() * HOTSPOTS.length)];
  const sev = ["Ankle-level", "Knee-level", "Waist-level", "Road completely blocked"][Math.floor(Math.random() * 4)];
  state.reports.unshift({
    id: "auto" + Date.now(),
    location: h.name,
    lat: h.lat + (Math.random() - 0.5) * 0.004,
    lng: h.lng + (Math.random() - 0.5) * 0.004,
    severity: sev,
    status: Math.random() < 0.3 ? "verified" : "pending",
    desc: "Auto-generated demo report from simulated community feed.",
    photo: Math.random() < 0.4,
    ts: Date.now(),
    own: false,
  });
  state.analytics.reportsCount++;
  save();
  refreshReports();
}

function refreshReports() {
  drawReports();
  renderReportList();
  renderAdmin();
  rescoreAll();
  renderAnalytics();
}

function filteredReports() {
  let list = [...state.reports].sort((a, b) => b.ts - a.ts);
  if (reportFilter === "recent") list = list.filter((r) => Date.now() - r.ts < 2 * 3600000);
  if (reportFilter === "severe") list = list.filter((r) => r.severity === "Waist-level" || r.severity === "Road completely blocked");
  if (reportFilter === "verified") list = list.filter((r) => r.status === "verified");
  return list;
}

function renderReportList() {
  const list = filteredReports();
  $("reportList").innerHTML = list.length
    ? list
        .map(
          (r) => `<div class="item" data-focus="${r.id}">
        <div>
          <h5>📍 ${r.location}</h5>
          <p>⏱️ ${timeAgo(r.ts)} · 🌊 ${r.severity}${r.photo ? " · 📷 photo" : ""}</p>
          <p>${r.desc || ""}</p>
          <span class="chip chip-${r.status}">${r.status === "verified" ? "✅ Verified" : r.status === "rejected" ? "❌ Rejected" : "⏳ Unverified"}</span>
        </div>
        <div class="actions">
          ${r.own ? `<button class="btn btn-danger" data-del="${r.id}">Delete</button>` : ""}
        </div></div>`
        )
        .join("")
    : '<div class="empty-state">No reports match this filter.</div>';

  $("reportList").querySelectorAll("[data-focus]").forEach((el) => {
    el.onclick = (ev) => {
      if (ev.target.dataset.del) return;
      const r = state.reports.find((x) => x.id === el.dataset.focus);
      if (!r) return;
      switchTab("navigation");
      map.setView([r.lat, r.lng], 15);
      if (r._marker) r._marker.openPopup();
    };
  });
  $("reportList").querySelectorAll("[data-del]").forEach((b) => {
    b.onclick = (ev) => {
      ev.stopPropagation();
      state.reports = state.reports.filter((x) => x.id !== b.dataset.del);
      save();
      refreshReports();
      toast("Your demo report was deleted.", "ok");
    };
  });
}

async function submitReport() {
  const loc = $("repLocation").value.trim();
  const err = $("repError");
  err.textContent = "";
  if (!loc) { err.textContent = "⚠️ Please enter the location of the waterlogging."; return; }
  let coords;
  try {
    coords = await geocode(loc);
  } catch (e) {
    err.textContent = "⚠️ We couldn't find that location. Try a nearby landmark or city.";
    return;
  }
  const rep = {
    id: "u" + Date.now(),
    location: coords.name || loc,
    lat: coords.lat,
    lng: coords.lng,
    severity: $("repSeverity").value,
    status: "pending",
    desc: $("repDesc").value.trim() || "Waterlogging reported by a community user.",
    photo: !!$("repPhoto").files.length,
    ts: Date.now(),
    own: true,
  };
  state.reports.unshift(rep);
  state.analytics.reportsCount++;
  save();
  clearReportForm();
  refreshReports();
  toast("✅ Report submitted successfully. Route risk recalculated.", "ok");
}
function clearReportForm() {
  $("repLocation").value = "";
  $("repDesc").value = "";
  $("repPhoto").value = "";
  $("repSeverity").value = "Ankle-level";
  $("repError").textContent = "";
}

/* =====================================================================
   HOTSPOT LIST (SAFETY VIEW)
   ===================================================================== */
function renderHotspotList() {
  $("hotspotList").innerHTML = HOTSPOTS.map(
    (h, i) => `<div class="item" data-hot="${i}">
      <div><h5>⚠️ ${h.name}</h5>
      <p>Historical severity: <b>${h.severity}</b></p>
      <p>Source: ${h.source}</p></div>
      <div class="actions"><button class="btn btn-ghost">View on map</button></div>
    </div>`
  ).join("");
  $("hotspotList").querySelectorAll("[data-hot]").forEach((el) => {
    el.onclick = () => {
      const h = HOTSPOTS[+el.dataset.hot];
      switchTab("navigation");
      map.setView([h.lat, h.lng], 15);
      if (h._marker) { h._marker.setPopupContent(hotspotPopup(h)); h._marker.openPopup(); }
    };
  });
}

/* =====================================================================
   ANALYTICS
   ===================================================================== */
let analyticsRange = 7;

function renderAnalytics() {
  const a = state.analytics;
  const active = state.reports.filter((r) => r.status !== "rejected").length;
  const avgRain = state.rainHistory.reduce((s, v) => s + v, 0) / state.rainHistory.length;
  $("kpiGrid").innerHTML = [
    ["Total Routes Analysed", a.routes.toLocaleString()],
    ["Safe Routes", a.safe.toLocaleString()],
    ["High Risk Routes", a.risky.toLocaleString()],
    ["Active Waterlogging Reports", active],
    ["Flood Hotspots", HOTSPOTS.length + 45],
    ["Average Rainfall", avgRain.toFixed(1) + " mm/hr"],
  ]
    .map(([k, v]) => `<div class="kpi"><span>${k}</span><b>${v}</b></div>`)
    .join("");
  drawCharts();
}

function seriesFor(days, base, spread, seed) {
  const out = [];
  for (let i = 0; i < days; i++) {
    const s = Math.sin((i + seed) * 1.7) * spread + Math.cos((i + seed) * 0.6) * spread * 0.5;
    out.push(Math.max(0, Math.round(base + s)));
  }
  return out;
}

function barChart(canvasId, labels, values, colors) {
  const c = $(canvasId);
  if (!c) return;
  const dpr = window.devicePixelRatio || 1;
  const w = c.clientWidth, h = 220;
  c.width = w * dpr; c.height = h * dpr;
  const ctx = c.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const max = Math.max(...values, 1) * 1.15;
  const pad = 30, bw = (w - pad * 2) / values.length;
  ctx.strokeStyle = "rgba(148,163,184,.18)";
  for (let i = 0; i <= 4; i++) {
    const y = 20 + ((h - 50) / 4) * i;
    ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(w - pad / 2, y); ctx.stroke();
  }
  values.forEach((v, i) => {
    const bh = ((h - 50) * v) / max;
    ctx.fillStyle = Array.isArray(colors) ? colors[i % colors.length] : colors;
    const x = pad + i * bw + bw * 0.18, y = h - 30 - bh;
    ctx.beginPath();
    ctx.roundRect(x, y, bw * 0.64, bh, 6);
    ctx.fill();
    ctx.fillStyle = "#9db0cd";
    ctx.font = "10px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(labels[i], x + bw * 0.32, h - 12);
    ctx.fillStyle = "#eaf0fa";
    ctx.fillText(String(v), x + bw * 0.32, y - 5);
  });
}

function lineChart(canvasId, labels, values, color) {
  const c = $(canvasId);
  if (!c) return;
  const dpr = window.devicePixelRatio || 1;
  const w = c.clientWidth, h = 220;
  c.width = w * dpr; c.height = h * dpr;
  const ctx = c.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const max = Math.max(...values, 1) * 1.2, pad = 32;
  const px = (i) => pad + ((w - pad * 1.5) * i) / Math.max(1, values.length - 1);
  const py = (v) => h - 30 - ((h - 50) * v) / max;
  ctx.strokeStyle = "rgba(148,163,184,.18)";
  for (let i = 0; i <= 4; i++) { const y = 20 + ((h - 50) / 4) * i; ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(w - pad / 2, y); ctx.stroke(); }
  const grad = ctx.createLinearGradient(0, 20, 0, h - 30);
  grad.addColorStop(0, color + "66"); grad.addColorStop(1, color + "00");
  ctx.beginPath(); ctx.moveTo(px(0), py(values[0]));
  values.forEach((v, i) => ctx.lineTo(px(i), py(v)));
  ctx.lineTo(px(values.length - 1), h - 30); ctx.lineTo(px(0), h - 30); ctx.closePath();
  ctx.fillStyle = grad; ctx.fill();
  ctx.beginPath(); ctx.moveTo(px(0), py(values[0]));
  values.forEach((v, i) => ctx.lineTo(px(i), py(v)));
  ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.stroke();
  ctx.fillStyle = color;
  values.forEach((v, i) => { ctx.beginPath(); ctx.arc(px(i), py(v), 3, 0, Math.PI * 2); ctx.fill(); });
  ctx.fillStyle = "#9db0cd"; ctx.font = "10px system-ui"; ctx.textAlign = "center";
  labels.forEach((l, i) => { if (i % Math.ceil(labels.length / 8) === 0) ctx.fillText(l, px(i), h - 12); });
}

function drawCharts() {
  const d = analyticsRange;
  const dayLabels = Array.from({ length: d }, (_, i) => "D" + (i + 1));
  const riskBuckets = [0, 0, 0, 0];
  if (routes.length) {
    routes.forEach((r) => {
      const c = classifyRisk(r.floodRisk).label;
      riskBuckets[["LOW", "MODERATE", "HIGH", "EXTREME"].indexOf(c)] += 1;
    });
  }
  const scale = Math.max(1, Math.round(state.analytics.routes / 40));
  barChart("riskChart", ["Low", "Moderate", "High", "Extreme"],
    [riskBuckets[0] * scale + 210, riskBuckets[1] * scale + 340, riskBuckets[2] * scale + 180, riskBuckets[3] * scale + 96],
    ["#22c55e", "#facc15", "#f97316", "#ef4444"]);

  lineChart("rainChart", dayLabels, seriesFor(d, 12, 8, 2), "#38bdf8");
  lineChart("rainTrendChart", state.rainHistory.map((_, i) => "T" + (i + 1)), state.rainHistory, "#38bdf8");
  barChart("reportChart", dayLabels, seriesFor(d, 18, 10, 5), "#a78bfa");
  const safe = state.analytics.safe, risky = state.analytics.risky;
  barChart("safeChart", ["Safe routes", "Risky routes"], [safe, risky], ["#22c55e", "#ef4444"]);
  const sev = ["Extreme", "High", "Moderate"].map((s) => HOTSPOTS.filter((h) => h.severity === s).length);
  barChart("hotspotChart", ["Extreme", "High", "Moderate"], sev, ["#ef4444", "#f97316", "#facc15"]);
}

/* =====================================================================
   ADMIN
   ===================================================================== */
let adminFilter = "all";

function renderAdmin() {
  const verified = state.reports.filter((r) => r.status === "verified").length;
  const active = state.reports.filter((r) => r.status !== "rejected").length;
  $("adminGrid").innerHTML = [
    ["Active users", (312 + (state.analytics.routes % 97)).toString()],
    ["Routes calculated", state.analytics.routes.toLocaleString()],
    ["Reports received", state.reports.length],
    ["Verified reports", verified],
    ["High-risk areas", HOTSPOTS.filter((h) => h.severity !== "Moderate").length],
    ["Current rainfall", state.rainfall.toFixed(1) + " mm/hr"],
    ["Weather API", state.rainSource === "Live" ? "🟢 Live" : "🟡 Simulated"],
    ["Routing API", routes.length && !routes[0].demo ? "🟢 Online" : "🟡 Demo fallback"],
    ["Active reports", active],
  ]
    .map(([k, v]) => `<div class="kpi"><span>${k}</span><b>${v}</b></div>`)
    .join("");

  let list = [...state.reports].sort((a, b) => b.ts - a.ts);
  if (adminFilter !== "all") list = list.filter((r) => r.status === adminFilter);
  $("adminTable").innerHTML =
    `<thead><tr><th>Location</th><th>Time</th><th>Severity</th><th>Status</th><th>Action</th></tr></thead><tbody>` +
    (list.length
      ? list
          .map(
            (r) => `<tr>
        <td>${r.location}</td><td>${timeAgo(r.ts)}</td><td>${r.severity}</td>
        <td><span class="chip chip-${r.status}">${r.status}</span></td>
        <td>
          <button class="btn btn-safe" data-verify="${r.id}">Verify</button>
          <button class="btn btn-danger" data-reject="${r.id}">Reject</button>
          <button class="btn btn-ghost" data-view="${r.id}">View on map</button>
        </td></tr>`
          )
          .join("")
      : `<tr><td colspan="5">No reports for this filter.</td></tr>`) +
    "</tbody>";

  $("adminTable").querySelectorAll("[data-verify]").forEach((b) => (b.onclick = () => setStatus(b.dataset.verify, "verified")));
  $("adminTable").querySelectorAll("[data-reject]").forEach((b) => (b.onclick = () => setStatus(b.dataset.reject, "rejected")));
  $("adminTable").querySelectorAll("[data-view]").forEach((b) => {
    b.onclick = () => {
      const r = state.reports.find((x) => x.id === b.dataset.view);
      if (!r) return;
      switchTab("navigation");
      map.setView([r.lat, r.lng], 15);
      if (r._marker) r._marker.openPopup();
    };
  });
}

function setStatus(id, status) {
  const r = state.reports.find((x) => x.id === id);
  if (!r) return;
  r.status = status;
  if (status === "verified") state.analytics.safe = Math.max(0, state.analytics.safe - 1), state.analytics.risky++;
  save();
  refreshReports();
  toast(`Report "${r.location}" marked ${status}. Community factor and risk scores updated.`, status === "verified" ? "ok" : "warn");
}

/* =====================================================================
   MAIN FLOW
   ===================================================================== */
async function findRoutes() {
  const err = $("formError");
  err.textContent = "";
  const s = $("srcInput").value.trim();
  const d = $("dstInput").value.trim();
  if (!s) { err.textContent = "⚠️ Please enter a starting location."; return; }
  if (!d) { err.textContent = "⚠️ Please enter a destination."; return; }
  if (s.toLowerCase() === d.toLowerCase()) { err.textContent = "⚠️ Source and destination cannot be the same."; return; }

  const btn = $("findBtn");
  btn.disabled = true;
  btn.textContent = "FINDING SAFE ROUTES…";

  let src, dst;
  try { src = await geocode(s); } catch (e) { err.textContent = "⚠️ We couldn't find that source location. Try a nearby landmark or city."; btn.disabled = false; btn.textContent = "FIND SAFE ROUTES"; return; }
  try { dst = await geocode(d); } catch (e) { err.textContent = "⚠️ We couldn't find that destination. Try a nearby landmark or city."; btn.disabled = false; btn.textContent = "FIND SAFE ROUTES"; return; }
  if (haversine(src, dst) < 300) { err.textContent = "⚠️ Source and destination are too close for a meaningful route."; btn.disabled = false; btn.textContent = "FIND SAFE ROUTES"; return; }

  state.lastSource = s; state.lastDest = d; save();

  try {
    const raw = await buildRoutes(src, dst);
    routes = raw.map((r, i) => Object.assign(r, { id: "r" + i }));
    selectedRouteId = null;
    routes.forEach(scoreRoute);
    assignRoles();

    layers.points.clearLayers();
    L.marker([src.lat, src.lng], { icon: emojiIcon("🟢", 28) }).addTo(layers.points).bindPopup(`<b>Source</b><br/>${src.name || s}`);
    L.marker([dst.lat, dst.lng], { icon: emojiIcon("🔴", 28) }).addTo(layers.points).bindPopup(`<b>Destination</b><br/>${dst.name || d}`);

    drawRoutePolylines();
    renderRouteCards();
    renderComparison();
    renderAdvisory();
    map.fitBounds(L.latLngBounds(routes[0].path.map((p) => [p.lat, p.lng])), { padding: [50, 50] });

    $("locBadge").textContent = "📍 " + (src.name || s).split(",")[0];
    state.analytics.routes += 3;
    const best = routes.find((r) => r.recommended);
    if (best.safety >= 60) state.analytics.safe += 1; else state.analytics.risky += 1;
    save();
    renderAnalytics(); renderAdmin();

    loadHospitals(src);
    fetchLiveWeather(src);
    toast(`3 routes analysed. ⭐ ${ROLE_META[best.role].name} route recommended (safety ${best.safety}/100).`, "ok");
  } catch (e) {
    err.textContent = "⚠️ We couldn't calculate routes right now. Please check your connection and try again.";
    toast("Routing failed — please retry.", "err");
  } finally {
    btn.disabled = false;
    btn.textContent = "FIND SAFE ROUTES";
  }
}

/* =====================================================================
   TABS + UI WIRING
   ===================================================================== */
function switchTab(name) {
  document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t.dataset.tab === name));
  document.querySelectorAll(".view").forEach((v) => v.classList.toggle("active", v.id === "view-" + name));
  $("tabs").classList.remove("open");
  if (name === "navigation" && map) setTimeout(() => map.invalidateSize(), 120);
  if (name === "analytics" || name === "rainfall") setTimeout(drawCharts, 60);
}

function renderHelplines() {
  const html = HELPLINES.map((h) => `<div class="helpline"><a href="tel:${h.n}">${h.n}</a><span>${h.label}</span></div>`).join("");
  $("helplines").innerHTML = html;
  $("helplines2").innerHTML = html;
}

function applyVehicle() {
  const p = VEHICLE_PROFILES[state.vehicle];
  $("vehicleNote").textContent = p.note;
  rescoreAll();
}

function resetDemo() {
  if (!confirm("Reset all demo data? This clears your submitted reports, saved locations, vehicle preference and analytics counters.")) return;
  localStorage.removeItem(STORE_KEY);
  state = defaultState();
  routes = [];
  selectedRouteId = null;
  pauseSim();
  save();
  bootUiFromState();
  layers.routes.clearLayers();
  layers.points.clearLayers();
  refreshReports();
  renderRouteCards();
  $("compareCard").hidden = true;
  $("advisoryCard").hidden = true;
  $("hospitalCard").hidden = true;
  toast("Demo data reset.", "ok");
}

function bootUiFromState() {
  $("srcInput").value = state.lastSource;
  $("dstInput").value = state.lastDest;
  $("vehicleSelect").value = state.vehicle;
  $("vehicleNote").textContent = VEHICLE_PROFILES[state.vehicle].note;
  renderWeather();
  renderReportList();
  renderHotspotList();
  renderAnalytics();
  renderAdmin();
}

function init() {
  initMap();
  renderHelplines();
  wireAutocomplete("srcInput", "srcSuggest");
  wireAutocomplete("dstInput", "dstSuggest");
  bootUiFromState();

  $("hamburger").onclick = () => $("tabs").classList.toggle("open");
  document.querySelectorAll(".tab").forEach((t) => (t.onclick = () => switchTab(t.dataset.tab)));

  $("findBtn").onclick = findRoutes;
  $("srcInput").addEventListener("keydown", (e) => { if (e.key === "Enter") findRoutes(); });
  $("dstInput").addEventListener("keydown", (e) => { if (e.key === "Enter") findRoutes(); });
  $("vehicleSelect").onchange = (e) => { state.vehicle = e.target.value; save(); applyVehicle(); toast(VEHICLE_PROFILES[state.vehicle].note, "info"); };

  document.querySelectorAll("[data-rain]").forEach((b) => {
    b.onclick = () => {
      const map = { light: 2.0, moderate: 6.5, heavy: 18.6, extreme: 32 };
      setRainfall(map[b.dataset.rain], "Simulated");
      toast(`Simulated ${b.dataset.rain} rain: ${map[b.dataset.rain]} mm/hr.`, "info");
    };
  });
  const toggle = () => (simTimer ? pauseSim() : startSim());
  $("simToggle").onclick = toggle;
  $("simToggle2").onclick = toggle;
  $("simPause2").onclick = pauseSim;
  $("adminStart").onclick = startSim;
  $("adminPause").onclick = pauseSim;
  $("fetchLive").onclick = () => fetchLiveWeather();

  $("repSubmit").onclick = submitReport;
  $("repCancel").onclick = () => { clearReportForm(); toast("Report cancelled.", "info"); };
  $("reportFilters").querySelectorAll("[data-filter]").forEach((b) => {
    b.onclick = () => {
      reportFilter = b.dataset.filter;
      $("reportFilters").querySelectorAll(".btn-chip").forEach((x) => x.classList.toggle("active", x === b));
      renderReportList();
    };
  });
  $("adminFilters").querySelectorAll("[data-af]").forEach((b) => {
    b.onclick = () => {
      adminFilter = b.dataset.af === "pending" ? "pending" : b.dataset.af;
      $("adminFilters").querySelectorAll(".btn-chip").forEach((x) => x.classList.toggle("active", x === b));
      renderAdmin();
    };
  });
  $("analyticsFilters").querySelectorAll("[data-range]").forEach((b) => {
    b.onclick = () => {
      analyticsRange = +b.dataset.range;
      $("analyticsFilters").querySelectorAll(".btn-chip").forEach((x) => x.classList.toggle("active", x === b));
      drawCharts();
    };
  });
  $("resetDemo").onclick = resetDemo;

  window.addEventListener("resize", () => drawCharts());
  setInterval(() => { $("rainUpdated").textContent = timeAgo(state.updatedAt); $("rf2Updated").textContent = timeAgo(state.updatedAt); }, 30000);

  updateSimUi();
  if (state.simRunning) startSim();
  drawCharts();
  toast("Demo scenario ready: IGDTUW → India Gate. Press FIND SAFE ROUTES.", "info");
}

document.addEventListener("DOMContentLoaded", init);
