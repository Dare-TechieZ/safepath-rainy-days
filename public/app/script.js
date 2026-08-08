/* =====================================================================
   RainSafeRoute — flood-aware navigation
   Frontend only. Uses OSRM (roads), Nominatim, Open-Meteo, Overpass.
   ===================================================================== */

/* Optional: put an OpenRouteService key here to use ORS instead of OSRM. */
const ORS_API_KEY = "YOUR_API_KEY";

const OSRM_URL = "https://router.project-osrm.org/route/v1/driving/";
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

const STORE_KEY = "rsr_state_v2";
const SESSION_KEY = "rsr_session_v2";

/* =====================================================================
   REFERENCE DATA
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
  { name: "Noida Sector 18", lat: 28.5708, lng: 77.326 },
  { name: "Gurugram Cyber City", lat: 28.4949, lng: 77.0895 },
  { name: "Karol Bagh", lat: 28.6519, lng: 77.1909 },
  { name: "Nehru Place", lat: 28.5494, lng: 77.2519 },
  { name: "Chandni Chowk", lat: 28.6562, lng: 77.2301 },
];

const HOTSPOTS = [
  { name: "Minto Bridge Underpass", lat: 28.6338, lng: 77.2225, severity: "Extreme" },
  { name: "ITO Crossing", lat: 28.6289, lng: 77.2412, severity: "High" },
  { name: "Pul Prahladpur Underpass", lat: 28.5017, lng: 77.2871, severity: "Extreme" },
  { name: "Zakhira Underpass", lat: 28.6672, lng: 77.1546, severity: "High" },
  { name: "Azadpur Mandi Road", lat: 28.7075, lng: 77.1758, severity: "Moderate" },
  { name: "Ring Road, Bhairon Marg", lat: 28.6153, lng: 77.2447, severity: "High" },
  { name: "Moolchand Underpass", lat: 28.5673, lng: 77.2378, severity: "High" },
  { name: "Okhla Underpass", lat: 28.5501, lng: 77.2775, severity: "Moderate" },
  { name: "Rajghat Ring Road", lat: 28.6412, lng: 77.2495, severity: "Moderate" },
  { name: "Tilak Bridge", lat: 28.6252, lng: 77.2418, severity: "High" },
  { name: "Jangpura Underpass", lat: 28.5842, lng: 77.2465, severity: "Moderate" },
  { name: "Dhaula Kuan Loop", lat: 28.5915, lng: 77.161, severity: "Moderate" },
];

const HOSPITALS = [
  { name: "LNJP Hospital", lat: 28.6395, lng: 77.2337, emergency: true },
  { name: "AIIMS Trauma Centre", lat: 28.5672, lng: 77.21, emergency: true },
  { name: "Ram Manohar Lohia Hospital", lat: 28.6262, lng: 77.205, emergency: true },
  { name: "Safdarjung Hospital", lat: 28.568, lng: 77.2064, emergency: true },
  { name: "GTB Hospital", lat: 28.6836, lng: 77.3116, emergency: true },
  { name: "Hindu Rao Hospital", lat: 28.674, lng: 77.2074, emergency: false },
  { name: "Max Saket", lat: 28.5279, lng: 77.2148, emergency: true },
  { name: "Fortis Noida", lat: 28.5698, lng: 77.326, emergency: true },
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
  { id: "seed1", location: "Minto Bridge Underpass", lat: 28.634, lng: 77.2229, severity: "Road completely blocked", status: "verified", desc: "Underpass fully submerged, traffic diverted.", photo: true, video: false, ts: Date.now() - 14 * 60000, own: false, by: "commuter_92" },
  { id: "seed2", location: "ITO Crossing", lat: 28.6291, lng: 77.2415, severity: "Knee-level", status: "pending", desc: "Water rising near the signal.", photo: false, video: true, ts: Date.now() - 38 * 60000, own: false, by: "rider_delhi" },
  { id: "seed3", location: "Ring Road, Bhairon Marg", lat: 28.615, lng: 77.245, severity: "Ankle-level", status: "verified", desc: "Slow moving traffic, shallow water.", photo: false, video: false, ts: Date.now() - 75 * 60000, own: false, by: "sonia_k" },
  { id: "seed4", location: "Moolchand Underpass", lat: 28.5675, lng: 77.2381, severity: "Waist-level", status: "pending", desc: "Two-wheelers stranded.", photo: true, video: false, ts: Date.now() - 26 * 60000, own: false, by: "amit.r" },
];

const SEED_THREADS = [
  { id: "t1", area: "Lajpat Nagar", title: "Water near metro gate 3 — is it passable?", body: "Ankle deep at 8am, seems to be draining slowly. Anyone crossing right now?", by: "sonia_k", ts: Date.now() - 52 * 60000, votes: 14, replies: [{ by: "amit.r", text: "Crossed 10 min back, fine for cars, not for bikes.", ts: Date.now() - 40 * 60000 }] },
  { id: "t2", area: "Minto Bridge", title: "Avoid Minto Bridge completely today", body: "Pump station is overwhelmed again. Traffic police diverting everyone.", by: "commuter_92", ts: Date.now() - 120 * 60000, votes: 41, replies: [{ by: "rider_delhi", text: "Confirmed, took Ranjit Singh flyover instead.", ts: Date.now() - 95 * 60000 }, { by: "neha_v", text: "Thanks, saved me an hour.", ts: Date.now() - 60 * 60000 }] },
  { id: "t3", area: "Noida Sector 18", title: "Rain has stopped, roads clearing", body: "Only puddles left near the Atta market side.", by: "neha_v", ts: Date.now() - 30 * 60000, votes: 8, replies: [] },
];

const VEHICLE_PROFILES = {
  car: { label: "🚗 Car", riskMul: 1.0, safetyWeight: 0.55, banner: "" },
  bike: { label: "🏍️ Bike", riskMul: 1.3, safetyWeight: 0.8, banner: "🏍️ Two-wheeler mode — waterlogged stretches avoided aggressively" },
  truck: { label: "🚚 Truck", riskMul: 1.15, safetyWeight: 0.6, banner: "🚚 Heavy-vehicle mode — narrow and low-clearance stretches deprioritised" },
  ambulance: { label: "🚑 Emergency Vehicle", riskMul: 0.85, safetyWeight: 0.3, banner: "🚑 Emergency Priority Mode — fastest viable route with acceptable risk" },
  fire: { label: "🚒 Fire & Rescue", riskMul: 0.9, safetyWeight: 0.35, banner: "🚒 Rescue mode — speed prioritised, extreme-risk roads still avoided" },
  school: { label: "🏫 School Bus", riskMul: 1.45, safetyWeight: 0.92, banner: "🏫 School Safety Mode — strictest safety thresholds applied" },
  delivery: { label: "📦 Delivery", riskMul: 1.05, safetyWeight: 0.45, banner: "📦 Delivery mode — balancing safety with ETA" },
};

/* =====================================================================
   TRANSLATIONS
   ===================================================================== */
const I18N = {
  en: {
    brandSub: "Flood-aware navigation",
    userLogin: "User Login", adminLogin: "Admin Login", username: "Username", password: "Password",
    captcha: "Security check", signIn: "SIGN IN", logout: "Logout", faq: "FAQ",
    navTab: "Navigation", rainTab: "Live Rainfall", commTab: "Community Reports", forumTab: "Forum",
    safetyTab: "Safety", analyticsTab: "Analytics", adminTab: "Admin",
    findTitle: "Find Your Safest Route", findSub: "Optimised for flood safety, not just speed.",
    source: "Source", destination: "Destination", vehicle: "Vehicle", findBtn: "FIND SAFE ROUTES",
    advisory: "⚠️ Travel Advisory", rainfall: "Rainfall", intensity: "Intensity", temp: "Temperature",
    updated: "Last updated", fetchLive: "Refresh Live Weather", heatOn: "Rainfall Heatmap: ON",
    heatOff: "Rainfall Heatmap: OFF", helplines: "Emergency Helplines",
    helplineNote: "Availability can vary by region and service. Always use the official emergency service appropriate to your situation.",
    legend: "Legend", lgSafest: "Safest Route", lgFastest: "Fastest / High Risk", lgAlt: "Alternative Route",
    lgHotspot: "Flood Hotspot", lgReport: "Community Report", lgHospital: "Hospital / Medical Aid",
    lgHeat: "Rainfall Heat Intensity",
    routesEmpty: "Enter a source and destination, then press FIND SAFE ROUTES to compare flood risk across three real road routes.",
    compare: "Route Comparison", medical: "Nearby Medical Aid", rainNow: "Live Rainfall",
    condition: "Condition", dataSource: "Data source", trendTitle: "Rainfall Trend",
    chooseDest: "Choose a destination", chooseDestLong: "Select a destination in the Navigation tab to see the rainfall trend for that location.",
    reportTitle: "📢 Report Waterlogging", location: "Location", severity: "Severity",
    description: "Description", photo: "Photo (optional)", video: "Video (optional)",
    submitReport: "SUBMIT REPORT", cancel: "CANCEL", liveReports: "Live Waterlogging Reports",
    all: "All", recent: "Recent", severe: "Severe", verified: "Verified", mine: "My reports",
    pending: "Pending", rejected: "Rejected",
    forumNew: "🗣️ Start a Discussion", area: "Area / Locality", title: "Title", message: "Message",
    post: "POST", forumFeed: "Community Forum", top: "Top", newest: "Newest",
    safetyCard: "🛡️ Travel Safety Card", beforeTravel: "Before travelling", duringRain: "During heavy rainfall",
    dangerBanner: "⚠️ If water is moving rapidly across the road, DO NOT attempt to cross.",
    helplinesIn: "Indian Emergency Helplines", hotspots: "Flood Hotspots",
    last7: "Last 7 days", last14: "Last 14 days", last30: "Last 30 days",
    riskDist: "Route Risk Distribution", rainTrend: "Rainfall Trend",
    reportsOverTime: "Community Reports Over Time", safeVsRisky: "Safe vs Risky Routes",
    hotspotDist: "Flood Hotspot Distribution by Severity",
    sysMon: "System Monitoring", commReports: "Community Reports",
    faqTitle: "❓ Frequently Asked Questions", uploadFaq: "Upload FAQ PDF", openTab: "Open in new tab",
    faqEmpty: "No FAQ PDF loaded yet. Upload your FAQ PDF to read it here, or place a file named faq.pdf next to index.html.",
    phSource: "Enter starting location", phDest: "Enter destination",
    safeA: ["Check rainfall intensity before you leave.", "Avoid flooded underpasses entirely.", "Do not enter roads where the water depth is unknown.", "Keep your phone charged and carry a power bank.", "Carry emergency supplies (water, torch, basic first aid).", "Inform someone about your route and expected arrival."],
    safeB: ["Reduce speed and switch on low-beam headlights.", "Maintain extra braking distance.", "Avoid driving through moving water.", "Do not stop under trees, hoardings or unsafe structures.", "Follow instructions from local authorities and traffic police."],
  },
  hi: {
    brandSub: "बाढ़-सजग नेविगेशन",
    userLogin: "यूज़र लॉगिन", adminLogin: "एडमिन लॉगिन", username: "उपयोगकर्ता नाम", password: "पासवर्ड",
    captcha: "सुरक्षा जाँच", signIn: "साइन इन करें", logout: "लॉगआउट", faq: "सामान्य प्रश्न",
    navTab: "नेविगेशन", rainTab: "लाइव वर्षा", commTab: "सामुदायिक रिपोर्ट", forumTab: "फ़ोरम",
    safetyTab: "सुरक्षा", analyticsTab: "विश्लेषण", adminTab: "एडमिन",
    findTitle: "अपना सबसे सुरक्षित मार्ग खोजें", findSub: "सिर्फ़ गति नहीं, बाढ़ सुरक्षा के लिए अनुकूलित।",
    source: "स्रोत", destination: "गंतव्य", vehicle: "वाहन", findBtn: "सुरक्षित मार्ग खोजें",
    advisory: "⚠️ यात्रा सलाह", rainfall: "वर्षा", intensity: "तीव्रता", temp: "तापमान",
    updated: "अंतिम अपडेट", fetchLive: "लाइव मौसम रिफ्रेश करें", heatOn: "वर्षा हीटमैप: चालू",
    heatOff: "वर्षा हीटमैप: बंद", helplines: "आपातकालीन हेल्पलाइन",
    helplineNote: "उपलब्धता क्षेत्र और सेवा के अनुसार भिन्न हो सकती है। हमेशा उपयुक्त आधिकारिक आपातकालीन सेवा का उपयोग करें।",
    legend: "संकेत", lgSafest: "सबसे सुरक्षित मार्ग", lgFastest: "सबसे तेज़ / उच्च जोखिम", lgAlt: "वैकल्पिक मार्ग",
    lgHotspot: "बाढ़ हॉटस्पॉट", lgReport: "सामुदायिक रिपोर्ट", lgHospital: "अस्पताल / चिकित्सा सहायता",
    lgHeat: "वर्षा तीव्रता",
    routesEmpty: "स्रोत और गंतव्य दर्ज करें, फिर तीन वास्तविक सड़क मार्गों की तुलना के लिए सुरक्षित मार्ग खोजें दबाएँ।",
    compare: "मार्ग तुलना", medical: "निकटतम चिकित्सा सहायता", rainNow: "लाइव वर्षा",
    condition: "स्थिति", dataSource: "डेटा स्रोत", trendTitle: "वर्षा प्रवृत्ति",
    chooseDest: "गंतव्य चुनें", chooseDestLong: "उस स्थान की वर्षा प्रवृत्ति देखने के लिए नेविगेशन टैब में गंतव्य चुनें।",
    reportTitle: "📢 जलभराव की रिपोर्ट करें", location: "स्थान", severity: "गंभीरता",
    description: "विवरण", photo: "फ़ोटो (वैकल्पिक)", video: "वीडियो (वैकल्पिक)",
    submitReport: "रिपोर्ट भेजें", cancel: "रद्द करें", liveReports: "लाइव जलभराव रिपोर्ट",
    all: "सभी", recent: "हाल की", severe: "गंभीर", verified: "सत्यापित", mine: "मेरी रिपोर्ट",
    pending: "लंबित", rejected: "अस्वीकृत",
    forumNew: "🗣️ चर्चा शुरू करें", area: "क्षेत्र / इलाक़ा", title: "शीर्षक", message: "संदेश",
    post: "पोस्ट करें", forumFeed: "सामुदायिक फ़ोरम", top: "शीर्ष", newest: "नवीनतम",
    safetyCard: "🛡️ यात्रा सुरक्षा कार्ड", beforeTravel: "यात्रा से पहले", duringRain: "भारी वर्षा के दौरान",
    dangerBanner: "⚠️ यदि सड़क पर पानी तेज़ी से बह रहा है, तो पार करने का प्रयास न करें।",
    helplinesIn: "भारतीय आपातकालीन हेल्पलाइन", hotspots: "बाढ़ हॉटस्पॉट",
    last7: "पिछले 7 दिन", last14: "पिछले 14 दिन", last30: "पिछले 30 दिन",
    riskDist: "मार्ग जोखिम वितरण", rainTrend: "वर्षा प्रवृत्ति",
    reportsOverTime: "समय के साथ सामुदायिक रिपोर्ट", safeVsRisky: "सुरक्षित बनाम जोखिम भरे मार्ग",
    hotspotDist: "गंभीरता के अनुसार हॉटस्पॉट वितरण",
    sysMon: "सिस्टम मॉनिटरिंग", commReports: "सामुदायिक रिपोर्ट",
    faqTitle: "❓ अक्सर पूछे जाने वाले प्रश्न", uploadFaq: "FAQ PDF अपलोड करें", openTab: "नए टैब में खोलें",
    faqEmpty: "अभी कोई FAQ PDF लोड नहीं है। अपनी FAQ PDF अपलोड करें, या index.html के पास faq.pdf नाम की फ़ाइल रखें।",
    phSource: "प्रारंभिक स्थान दर्ज करें", phDest: "गंतव्य दर्ज करें",
    safeA: ["निकलने से पहले वर्षा की तीव्रता जाँचें।", "जलमग्न अंडरपास से पूरी तरह बचें।", "जहाँ पानी की गहराई अज्ञात हो, वहाँ न जाएँ।", "फ़ोन चार्ज रखें और पावर बैंक साथ रखें।", "आपातकालीन सामग्री साथ रखें (पानी, टॉर्च, प्राथमिक चिकित्सा)।", "किसी को अपने मार्ग और पहुँचने के समय की जानकारी दें।"],
    safeB: ["गति कम करें और लो-बीम हेडलाइट चालू करें।", "ब्रेकिंग दूरी अधिक रखें।", "बहते पानी में वाहन न चलाएँ।", "पेड़ों, होर्डिंग या असुरक्षित संरचनाओं के नीचे न रुकें।", "स्थानीय प्रशासन और यातायात पुलिस के निर्देशों का पालन करें।"],
  },
};

let lang = localStorage.getItem("rsr_lang") || "en";
const t = (k) => (I18N[lang] && I18N[lang][k] != null ? I18N[lang][k] : I18N.en[k] || k);

/* =====================================================================
   STATE
   ===================================================================== */
const defaultState = () => ({
  reports: SEED_REPORTS.map((r) => ({ ...r })),
  threads: SEED_THREADS.map((x) => ({ ...x, replies: x.replies.map((r) => ({ ...r })) })),
  vehicle: "car",
  rainfall: 0,
  rainSource: "Open-Meteo",
  temp: null,
  condition: "No Rain",
  updatedAt: Date.now(),
  analytics: { routes: 1248, safe: 824, risky: 287, users: 342 },
});

let state = load();
let session = loadSession();
let routes = [];
let selectedRouteId = null;
let destPoint = null;
let srcPoint = null;
let destTrend = null;
let heatOn = true;

function load() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return defaultState();
    return Object.assign(defaultState(), JSON.parse(raw));
  } catch (e) { return defaultState(); }
}
function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {} }
function loadSession() { try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); } catch (e) { return null; } }
function saveSession(s) { try { localStorage.setItem(SESSION_KEY, JSON.stringify(s)); } catch (e) {} }

/* =====================================================================
   HELPERS
   ===================================================================== */
const $ = (id) => document.getElementById(id);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (x, x0, x1, y0, y1) => y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

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
  const step = Math.max(1, Math.floor(path.length / 400));
  for (let i = 0; i < path.length; i += step) {
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
  if (h < 24) return h + " hr " + (m % 60) + " min ago";
  return Math.floor(h / 24) + " d ago";
}

/* =====================================================================
   AUTH + CAPTCHA
   ===================================================================== */
let captchaCode = "";
let authRole = "user";

function newCaptcha() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  captchaCode = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  $("captchaBox").textContent = captchaCode;
  $("captchaInput").value = "";
}

function setAuthRole(role) {
  authRole = role;
  document.querySelectorAll(".auth-tab").forEach((b) => b.classList.toggle("active", b.dataset.role === role));
  $("authHint").textContent = role === "admin"
    ? "Administrator account required. Default administrator: admin / admin123"
    : "Any name with a password of at least 4 characters can sign in.";
  newCaptcha();
}

function doLogin() {
  const err = $("authError");
  err.textContent = "";
  const u = $("authUser").value.trim();
  const p = $("authPass").value;
  const c = $("captchaInput").value.trim().toUpperCase();
  if (!u) { err.textContent = "⚠️ Please enter a username."; return; }
  if (!p || p.length < 4) { err.textContent = "⚠️ Password must be at least 4 characters."; return; }
  if (c !== captchaCode) { err.textContent = "⚠️ Security code does not match."; newCaptcha(); return; }
  if (authRole === "admin" && !(u.toLowerCase() === "admin" && p === "admin123")) {
    err.textContent = "⚠️ Invalid administrator credentials.";
    newCaptcha();
    return;
  }
  session = { user: u, role: authRole, at: Date.now() };
  saveSession(session);
  applySession();
  toast(`Welcome, ${u}.`, "ok");
}

function applySession() {
  const authed = !!session;
  $("authScreen").hidden = authed;
  document.querySelector(".topbar").style.display = authed ? "" : "none";
  document.querySelector("main").style.display = authed ? "" : "none";
  if (!authed) return;
  $("whoBadge").textContent = (session.role === "admin" ? "🛡️ " : "👤 ") + session.user;
  document.querySelectorAll(".tab-admin").forEach((el) => (el.hidden = session.role !== "admin"));
  if (session.role !== "admin" && document.querySelector(".tab.active")?.dataset.tab === "admin") switchTab("navigation");
  if (map) setTimeout(() => map.invalidateSize(), 150);
}

function logout() {
  localStorage.removeItem(SESSION_KEY);
  session = null;
  applySession();
  newCaptcha();
  $("authUser").value = "";
  $("authPass").value = "";
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
function calculateProximityFactor(d) {
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
function calculateFloodRisk(rf, pf, cf) { return clamp(0.4 * rf + 0.35 * pf + 0.25 * cf, 0, 100); }
function classifyRisk(score) {
  if (score <= 25) return { label: "LOW", icon: "🟢" };
  if (score <= 50) return { label: "MODERATE", icon: "🟡" };
  if (score <= 75) return { label: "HIGH", icon: "🟠" };
  return { label: "EXTREME", icon: "🔴" };
}

/* =====================================================================
   MAP
   ===================================================================== */
let map, layers = {}, heatLayer = null;

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
  drawHeatmap();
}

/* ---- Rainfall heatmap ---- */
function heatPoints() {
  const base = clamp(state.rainfall / 35, 0.05, 1);
  const pts = [];
  const sevW = { Extreme: 1, High: 0.8, Moderate: 0.55 };
  HOTSPOTS.forEach((h) => {
    const w = clamp(base * (sevW[h.severity] || 0.5) + 0.08, 0.05, 1);
    pts.push([h.lat, h.lng, w]);
    for (let i = 0; i < 6; i++) {
      pts.push([h.lat + (Math.random() - 0.5) * 0.02, h.lng + (Math.random() - 0.5) * 0.02, w * 0.6]);
    }
  });
  state.reports.filter((r) => r.status !== "rejected").forEach((r) => {
    const sev = { "Ankle-level": 0.45, "Knee-level": 0.7, "Waist-level": 0.9, "Road completely blocked": 1 }[r.severity] || 0.5;
    pts.push([r.lat, r.lng, clamp(base * sev + 0.15, 0.08, 1)]);
  });
  if (destPoint) pts.push([destPoint.lat, destPoint.lng, base]);
  if (srcPoint) pts.push([srcPoint.lat, srcPoint.lng, base]);
  return pts;
}

function drawHeatmap() {
  if (!map || typeof L.heatLayer !== "function") return;
  if (heatLayer) { map.removeLayer(heatLayer); heatLayer = null; }
  if (!heatOn) return;
  heatLayer = L.heatLayer(heatPoints(), {
    radius: 38,
    blur: 26,
    maxZoom: 15,
    minOpacity: 0.25,
    gradient: { 0.2: "#38bdf8", 0.45: "#22c55e", 0.65: "#facc15", 0.82: "#f97316", 1: "#ef4444" },
  });
  heatLayer.addTo(map);
  if (layers.routes) layers.routes.eachLayer((l) => l.bringToFront && l.bringToFront());
}

function drawHotspots() {
  layers.hotspots.clearLayers();
  HOTSPOTS.forEach((h) => {
    const m = L.marker([h.lat, h.lng], { icon: emojiIcon("⚠️") }).addTo(layers.hotspots);
    h._marker = m;
    m.bindPopup(hotspotPopup(h));
    L.circle([h.lat, h.lng], { radius: 300, color: "#f59e0b", weight: 1, fillOpacity: 0.05 }).addTo(layers.hotspots);
  });
}
function hotspotPopup(h) {
  let extra = "";
  const best = routes.find((r) => r.id === selectedRouteId) || routes[0];
  if (best) extra = `<br/>Distance from selected route: <b>${Math.round(minDistanceToPath(h, best.path))} m</b>`;
  return `<b>⚠️ ${esc(h.name)}</b><br/>Recorded flood severity: <b>${h.severity}</b>${extra}`;
}

function drawReports() {
  layers.reports.clearLayers();
  state.reports.filter((r) => r.status !== "rejected").forEach((r) => {
    const m = L.marker([r.lat, r.lng], { icon: emojiIcon("📢") }).addTo(layers.reports);
    r._marker = m;
    m.bindPopup(
      `<b>📢 ${esc(r.location)}</b><br/>Severity: <b>${esc(r.severity)}</b><br/>${timeAgo(r.ts)}<br/>${r.status === "verified" ? "✅ Verified" : "⏳ Awaiting verification"}${r.photo ? "<br/>📷 Photo attached" : ""}${r.video ? "<br/>🎥 Video attached" : ""}<br/><small>${esc(r.desc || "")}</small>`
    );
  });
}

function drawHospitals(list) {
  layers.hospitals.clearLayers();
  list.forEach((h) => {
    const m = L.marker([h.lat, h.lng], { icon: emojiIcon("🏥") }).addTo(layers.hospitals);
    h._marker = m;
    m.bindPopup(`<b>🏥 ${esc(h.name)}</b><br/>${h.emergency ? "🚑 Emergency services available" : "Outpatient / limited emergency"}${h._dist ? "<br/>📍 " + (h._dist / 1000).toFixed(1) + " km from source" : ""}<br/><small>Call 112 or 108 in an emergency</small>`);
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
    const res = await fetch(`${NOMINATIM_URL}?format=json&limit=1&countrycodes=in&q=${encodeURIComponent(q)}`, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error("http");
    const data = await res.json();
    if (data && data.length) {
      return { name: data[0].display_name.split(",").slice(0, 3).join(","), lat: +data[0].lat, lng: +data[0].lon };
    }
    throw new Error("nores");
  } catch (e) {
    const local = presetMatches(q)[0] || PRESET_LOCATIONS.find((p) => p.name.toLowerCase().startsWith(q.toLowerCase()));
    if (local) return { ...local };
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
        render(data.map((d) => ({ name: d.display_name.split(",").slice(0, 3).join(","), lat: +d.lat, lng: +d.lon })).concat(presetMatches(q)).slice(0, 7));
      } catch (e) {}
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
   ROUTING — real roads via OSRM / ORS
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

async function osrmRoute(points, alternatives) {
  const coords = points.map((p) => `${p.lng},${p.lat}`).join(";");
  const alt = alternatives ? "&alternatives=3" : "";
  const res = await fetch(`${OSRM_URL}${coords}?overview=full&geometries=polyline${alt}&steps=false`);
  if (!res.ok) throw new Error("routing");
  const data = await res.json();
  if (!data.routes || !data.routes.length) throw new Error("noroute");
  return data.routes.map((r) => ({ path: decodePolyline(r.geometry), distance: r.distance, duration: r.duration }));
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
  return { path: f.geometry.coordinates.map((c) => ({ lat: c[1], lng: c[0] })), distance: f.properties.summary.distance, duration: f.properties.summary.duration };
}

/* Signature used to detect duplicate geometries so the three routes differ. */
function routeSignature(r) {
  const p = r.path;
  const pick = [0.2, 0.35, 0.5, 0.65, 0.8].map((f) => p[Math.floor(p.length * f)]);
  return pick.map((c) => c.lat.toFixed(3) + "," + c.lng.toFixed(3)).join("|");
}
function distinctRoutes(list) {
  const out = [], seen = new Set();
  list.forEach((r) => {
    if (!r || !r.path || r.path.length < 2) return;
    const sig = routeSignature(r);
    if (seen.has(sig)) return;
    const tooSimilar = out.some((o) => Math.abs(o.distance - r.distance) < 250 && midDeviation(o.path, r.path) < 220);
    if (tooSimilar) return;
    seen.add(sig);
    out.push(r);
  });
  return out;
}
function midDeviation(a, b) {
  let sum = 0, n = 0;
  for (let f = 0.15; f <= 0.85; f += 0.1) {
    sum += haversine(a[Math.floor(a.length * f)], b[Math.floor(b.length * f)]);
    n++;
  }
  return sum / n;
}

async function buildRoutes(src, dst) {
  const usingOrs = ORS_API_KEY && ORS_API_KEY !== "YOUR_API_KEY";
  let collected = [];

  if (usingOrs) {
    const bends = [0, 0.14, -0.14];
    const res = await Promise.all(bends.map((b) => orsRoute(src, dst, b ? offsetVia(src, dst, b) : null).catch(() => null)));
    collected = res.filter(Boolean);
  } else {
    try { collected = await osrmRoute([src, dst], true); } catch (e) { collected = []; }
    if (distinctRoutes(collected).length < 3) {
      const bends = [0.12, -0.12, 0.22, -0.22];
      const extras = await Promise.all(
        bends.map((b) => osrmRoute([src, offsetVia(src, dst, b), dst], false).then((r) => r[0]).catch(() => null))
      );
      collected = collected.concat(extras.filter(Boolean));
    }
  }

  const unique = distinctRoutes(collected);
  if (!unique.length) throw new Error("noroutes");
  return unique.slice(0, 3).sort((a, b) => a.duration - b.duration);
}

/* =====================================================================
   RISK SCORING + ROLE ASSIGNMENT (vehicle aware)
   ===================================================================== */
function scoreRoute(r) {
  const profile = VEHICLE_PROFILES[state.vehicle];
  let nearest = Infinity, nearestName = "—", hotspotHits = 0;
  HOTSPOTS.forEach((h) => {
    const d = minDistanceToPath(h, r.path);
    if (d < nearest) { nearest = d; nearestName = h.name; }
    if (d < 400) hotspotHits++;
  });
  const nearbyReports = state.reports.filter(
    (rep) => rep.status !== "rejected" && Date.now() - rep.ts <= 3 * 3600000 && minDistanceToPath(rep, r.path) <= 500
  );
  const rainF = calculateRainfallFactor(state.rainfall);
  const proxF = calculateProximityFactor(nearest);
  const commF = calculateCommunityFactor(nearbyReports);
  const risk = clamp((calculateFloodRisk(rainF, proxF, commF) + hotspotHits * 3) * profile.riskMul, 0, 100);
  return Object.assign(r, {
    nearestHotspot: nearest,
    nearestHotspotName: nearestName,
    hotspotHits,
    reportCount: nearbyReports.length,
    rainFactor: Math.round(rainF),
    proxFactor: proxF,
    commFactor: commF,
    floodRisk: Math.round(risk),
    safety: Math.round(clamp(100 - risk, 0, 100)),
  });
}

function assignRoles() {
  if (!routes.length) return;
  const byTime = [...routes].sort((a, b) => a.duration - b.duration);
  const bySafety = [...routes].sort((a, b) => b.safety - a.safety || a.duration - b.duration);

  routes.forEach((r) => (r.role = "alt"));
  const fastest = byTime[0];
  fastest.role = "fastest";
  const safest = bySafety.find((r) => r !== fastest) || fastest;
  safest.role = safest === fastest ? "fastest" : "safest";
  if (!routes.some((r) => r.role === "safest")) {
    const other = routes.find((r) => r !== fastest);
    if (other) other.role = "safest";
  }

  /* Vehicle profile decides the recommendation: safety vs speed trade-off. */
  const w = VEHICLE_PROFILES[state.vehicle].safetyWeight;
  const times = routes.map((r) => r.duration);
  const tMin = Math.min(...times), tMax = Math.max(...times) || tMin + 1;
  routes.forEach((r) => {
    const timeScore = tMax === tMin ? 100 : 100 - ((r.duration - tMin) / (tMax - tMin)) * 100;
    r.vehicleScore = Math.round(w * r.safety + (1 - w) * timeScore);
    if (state.vehicle === "school" && r.floodRisk > 60) r.vehicleScore -= 25;
    if ((state.vehicle === "ambulance" || state.vehicle === "fire") && r.floodRisk > 85) r.vehicleScore -= 30;
  });
  const recommended = [...routes].sort((a, b) => b.vehicleScore - a.vehicleScore || b.safety - a.safety)[0];
  routes.forEach((r) => (r.recommended = r === recommended));
  if (!selectedRouteId || !routes.some((r) => r.id === selectedRouteId)) selectedRouteId = recommended.id;
}

function rescoreAll(redraw = true) {
  if (!routes.length) return;
  routes.forEach(scoreRoute);
  assignRoles();
  if (redraw) { renderRouteCards(); renderComparison(); renderAdvisory(); drawRoutePolylines(); }
}

const ROLE_META = {
  fastest: { name: "FASTEST", color: "#ef4444", dot: "🔴", cls: "rc-fastest" },
  safest: { name: "SAFEST", color: "#22c55e", dot: "🟢", cls: "rc-safest" },
  alt: { name: "ALTERNATIVE", color: "#334155", dot: "⚫", cls: "rc-alt" },
};

/* =====================================================================
   ROUTE RENDERING
   ===================================================================== */
function drawRoutePolylines() {
  layers.routes.clearLayers();
  routes.forEach((r) => {
    const meta = ROLE_META[r.role];
    const selected = r.id === selectedRouteId;
    L.polyline(r.path.map((p) => [p.lat, p.lng]), {
      color: "#0b1220",
      weight: selected ? 11 : 7,
      opacity: 0.35,
    }).addTo(layers.routes);
    L.polyline(r.path.map((p) => [p.lat, p.lng]), {
      color: meta.color,
      weight: selected ? 7 : 4,
      opacity: selected ? 0.98 : 0.6,
      dashArray: r.role === "alt" ? "10 8" : null,
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
    wrap.innerHTML = `<div class="empty-state">${esc(t("routesEmpty"))}</div>`;
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
          <div><span>Vehicle Fit</span><b>${r.vehicleScore} / 100</b></div>
          <div><span>Reports Nearby</span><b>${r.reportCount}</b></div>
        </div>
        <div class="risk-pill risk-${cls.label}">${cls.icon} ${cls.label} RISK</div>
        <div class="rc-reco">${esc(routeRecommendationText(r))}</div>
        <button class="btn btn-block ${r.id === selectedRouteId ? "btn-info" : "btn-ghost"}" data-select="${r.id}">
          ${r.id === selectedRouteId ? "VIEWING ROUTE" : "SELECT ROUTE"}
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
      return `Best fit for ${VEHICLE_PROFILES[state.vehicle].label}: ${cut}% lower flood risk than the fastest route${extra ? `, +${extra} min travel time` : ""}.`;
    }
    return `Best fit for ${VEHICLE_PROFILES[state.vehicle].label} under current conditions.`;
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
    `<thead><tr><th>Route</th><th>Distance</th><th>ETA</th><th>Flood Risk</th><th>Safety</th><th>Vehicle Fit</th><th>Nearest Hotspot</th><th>Class</th></tr></thead><tbody>` +
    sorted
      .map((r) => {
        const m = ROLE_META[r.role], c = classifyRisk(r.floodRisk);
        return `<tr><td>${m.dot} ${m.name}${r.recommended ? " ⭐" : ""}</td><td>${(r.distance / 1000).toFixed(1)} km</td><td>${Math.round(r.duration / 60)} min</td><td>${r.floodRisk}</td><td>${r.safety}</td><td>${r.vehicleScore}</td><td>${Math.round(r.nearestHotspot)} m</td><td>${c.icon} ${c.label}</td></tr>`;
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
    ${banner ? `<p><b>${esc(banner)}</b></p>` : ""}
    <p>Rainfall in this area is <b>${state.rainfall.toFixed(1)} mm/hr</b> (${esc(state.condition)}).</p>
    <p>The fastest route passes within <b>${Math.round(fastest.nearestHotspot)} m</b> of ${esc(fastest.nearestHotspotName)}.</p>
    <p>${best === fastest
      ? "The fastest route is currently also the best fit for your vehicle."
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
    list = (data.elements || []).filter((e) => e.tags && e.tags.name).map((e) => ({ name: e.tags.name, lat: e.lat, lng: e.lon, emergency: e.tags.emergency === "yes" }));
    if (!list.length) throw new Error("empty");
    $("hospitalTag").textContent = "LIVE OSM DATA";
    $("hospitalTag").className = "tag tag-safe";
  } catch (e) {
    list = HOSPITALS.map((h) => ({ ...h }));
    $("hospitalTag").textContent = "OFFLINE LIST";
    $("hospitalTag").className = "tag tag-info";
  }
  list.forEach((h) => (h._dist = haversine(center, h)));
  list.sort((a, b) => a._dist - b._dist);
  list = list.slice(0, 6);
  drawHospitals(list);
  $("hospitalCard").hidden = false;
  $("hospitalList").innerHTML = list
    .map((h, i) => `<div class="item">
      <div><h5>🏥 ${esc(h.name)}</h5>
        <p>📍 ${(h._dist / 1000).toFixed(1)} km from source</p>
        <p>🚑 ${h.emergency ? "Emergency availability listed" : "Emergency availability not confirmed"}</p>
      </div>
      <div class="actions">
        <a class="btn btn-danger" href="tel:108">📞 Call 108</a>
        <button class="btn btn-ghost" data-hosp="${i}">🗺️ View on map</button>
      </div></div>`)
    .join("");
  $("hospitalList").querySelectorAll("[data-hosp]").forEach((b) => {
    b.onclick = () => {
      const h = list[+b.dataset.hosp];
      map.setView([h.lat, h.lng], 15);
      if (h._marker) h._marker.openPopup();
    };
  });
}

/* =====================================================================
   WEATHER
   ===================================================================== */
const INTENSITY = (r) => (r === 0 ? "No Rain" : r < 2.5 ? "Light Rain" : r < 7.6 ? "Moderate Rain" : r < 20 ? "Heavy Rain" : "Extreme Rain");

function setRainfall(mm, temp) {
  state.rainfall = Math.max(0, +(+mm).toFixed(1));
  state.condition = INTENSITY(state.rainfall);
  if (temp != null) state.temp = temp;
  state.updatedAt = Date.now();
  save();
  renderWeather();
  rescoreAll();
  drawHeatmap();
  drawCharts();
}

function renderWeather() {
  $("rainValue").textContent = state.rainfall.toFixed(1);
  $("rainIntensity").textContent = state.condition;
  $("rainTemp").textContent = state.temp != null ? state.temp.toFixed(1) + " °C" : "—";
  $("rainUpdated").textContent = timeAgo(state.updatedAt);
  $("rainBarFill").style.width = clamp((state.rainfall / 35) * 100, 2, 100) + "%";
  $("rainBadge").textContent = `🌧️ ${state.rainfall.toFixed(1)} mm/hr`;
  $("rf2Value").textContent = state.rainfall.toFixed(1) + " mm/hr";
  $("rf2Intensity").textContent = state.condition;
  $("rf2Condition").textContent = state.condition;
  $("rf2Temp").textContent = state.temp != null ? state.temp.toFixed(1) + " °C" : "—";
  $("rf2Source").textContent = state.rainSource;
  $("rf2Updated").textContent = timeAgo(state.updatedAt);
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
  const c = coords || destPoint || srcPoint || { lat: 28.6448, lng: 77.216 };
  try {
    const res = await fetch(`${OPEN_METEO_URL}?latitude=${c.lat}&longitude=${c.lng}&current=precipitation,rain,temperature_2m`);
    if (!res.ok) throw new Error("weather");
    const d = await res.json();
    state.rainSource = "Open-Meteo (live)";
    setRainfall(d.current.rain != null ? d.current.rain : d.current.precipitation || 0, d.current.temperature_2m);
    toast("Live weather loaded from Open-Meteo.", "ok");
    return true;
  } catch (e) {
    state.rainSource = "Unavailable — last known reading";
    renderWeather();
    toast("Weather service unreachable — showing last known reading.", "warn");
    return false;
  }
}

/* Rainfall trend for the selected destination */
async function loadDestinationTrend() {
  if (!destPoint) { renderTrend(); return; }
  try {
    const res = await fetch(`${OPEN_METEO_URL}?latitude=${destPoint.lat}&longitude=${destPoint.lng}&hourly=precipitation&past_days=1&forecast_days=1&timezone=auto`);
    if (!res.ok) throw new Error("trend");
    const d = await res.json();
    const times = d.hourly.time, vals = d.hourly.precipitation;
    const now = new Date();
    let idx = times.findIndex((tt) => new Date(tt) > now);
    if (idx < 0) idx = times.length - 1;
    const start = Math.max(0, idx - 12);
    destTrend = {
      labels: times.slice(start, idx).map((tt) => tt.slice(11, 16)),
      values: vals.slice(start, idx).map((v) => +(+v).toFixed(1)),
    };
  } catch (e) {
    destTrend = null;
  }
  renderTrend();
}

function renderTrend() {
  const empty = $("trendEmpty"), canvas = $("rainTrendChart");
  if (!destPoint || !destTrend || !destTrend.values.length) {
    $("trendPlace").textContent = t("chooseDest");
    empty.hidden = false;
    canvas.hidden = true;
    return;
  }
  $("trendPlace").textContent = destPoint.name;
  empty.hidden = true;
  canvas.hidden = false;
  lineChart("rainTrendChart", destTrend.labels, destTrend.values, "#38bdf8");
}

/* =====================================================================
   COMMUNITY REPORTS
   ===================================================================== */
let reportFilter = "all";

function refreshReports() {
  drawReports();
  drawHeatmap();
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
  if (reportFilter === "mine") list = list.filter((r) => r.own);
  return list;
}

function progressOf(r) {
  const steps = [
    { k: "Submitted", done: true, at: r.ts },
    { k: "Under review", done: r.status !== "pending" || Date.now() - r.ts > 10 * 60000, at: r.ts + 10 * 60000 },
    { k: r.status === "rejected" ? "Rejected by moderator" : "Verified by moderator", done: r.status !== "pending", at: r.reviewedAt || null },
    { k: "Applied to route risk engine", done: r.status === "verified", at: r.reviewedAt || null },
  ];
  return steps;
}

function renderReportList() {
  const list = filteredReports();
  $("reportList").innerHTML = list.length
    ? list
        .map((r) => {
          const steps = progressOf(r);
          const doneCount = steps.filter((s) => s.done).length;
          return `<div class="item" data-focus="${r.id}">
        <div>
          <h5>📍 ${esc(r.location)}</h5>
          <p>⏱️ ${timeAgo(r.ts)} · 🌊 ${esc(r.severity)}${r.photo ? " · 📷 photo" : ""}${r.video ? " · 🎥 video" : ""}</p>
          <p>${esc(r.desc || "")}</p>
          <p>Progress: <b>${doneCount}/4</b> — ${esc(steps.filter((s) => s.done).slice(-1)[0].k)}</p>
          <span class="chip chip-${r.status}">${r.status === "verified" ? "✅ Verified" : r.status === "rejected" ? "❌ Rejected" : "⏳ Awaiting verification"}</span>
        </div>
        <div class="actions">
          <button class="btn btn-ghost" data-copy="${r.id}">⬇️ Copy</button>
          ${r.own ? `<button class="btn btn-danger" data-del="${r.id}">Delete</button>` : ""}
        </div></div>`;
        })
        .join("")
    : '<div class="empty-state">No reports match this filter.</div>';

  $("reportList").querySelectorAll("[data-focus]").forEach((el) => {
    el.onclick = (ev) => {
      if (ev.target.dataset.del || ev.target.dataset.copy) return;
      const r = state.reports.find((x) => x.id === el.dataset.focus);
      if (!r) return;
      switchTab("navigation");
      map.setView([r.lat, r.lng], 15);
      if (r._marker) r._marker.openPopup();
    };
  });
  $("reportList").querySelectorAll("[data-copy]").forEach((b) => {
    b.onclick = (ev) => { ev.stopPropagation(); downloadReportCopy(b.dataset.copy); };
  });
  $("reportList").querySelectorAll("[data-del]").forEach((b) => {
    b.onclick = (ev) => {
      ev.stopPropagation();
      state.reports = state.reports.filter((x) => x.id !== b.dataset.del);
      save();
      refreshReports();
      toast("Your report was deleted.", "ok");
    };
  });
}

function downloadReportCopy(id) {
  const r = state.reports.find((x) => x.id === id);
  if (!r) return;
  const steps = progressOf(r);
  const lines = [
    "RAINSAFEROUTE — WATERLOGGING REPORT RECEIPT",
    "===========================================",
    `Reference ID   : ${r.id}`,
    `Reported by    : ${r.by || (session ? session.user : "user")}`,
    `Location       : ${r.location}`,
    `Coordinates    : ${r.lat.toFixed(5)}, ${r.lng.toFixed(5)}`,
    `Severity       : ${r.severity}`,
    `Submitted at   : ${new Date(r.ts).toLocaleString()}`,
    `Attachments    : ${[r.photo ? "photo" : null, r.video ? "video" : null].filter(Boolean).join(", ") || "none"}`,
    `Current status : ${r.status.toUpperCase()}`,
    "",
    "DESCRIPTION",
    "-----------",
    r.desc || "(no description)",
    "",
    "PROGRESS TRACKER",
    "----------------",
    ...steps.map((s, i) => `${s.done ? "[x]" : "[ ]"} ${i + 1}. ${s.k}${s.at && s.done ? " — " + new Date(s.at).toLocaleString() : ""}`),
    "",
    `Generated: ${new Date().toLocaleString()}`,
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `rainsaferoute-report-${r.id}.txt`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  toast("Report copy downloaded.", "ok");
}

async function submitReport() {
  const loc = $("repLocation").value.trim();
  const err = $("repError");
  err.textContent = "";
  if (!loc) { err.textContent = "⚠️ Please enter the location of the waterlogging."; return; }
  let coords;
  try { coords = await geocode(loc); } catch (e) {
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
    video: !!$("repVideo").files.length,
    ts: Date.now(),
    own: true,
    by: session ? session.user : "user",
  };
  state.reports.unshift(rep);
  save();
  clearReportForm();
  refreshReports();
  toast("✅ Report submitted. Route risk recalculated.", "ok");
}
function clearReportForm() {
  $("repLocation").value = "";
  $("repDesc").value = "";
  $("repPhoto").value = "";
  $("repVideo").value = "";
  $("repSeverity").value = "Ankle-level";
  $("repError").textContent = "";
}

/* =====================================================================
   COMMUNITY FORUM
   ===================================================================== */
let forumSort = "hot";
let forumQuery = "";

function renderForum() {
  let list = [...state.threads];
  if (forumQuery) {
    const q = forumQuery.toLowerCase();
    list = list.filter((th) => (th.area + " " + th.title + " " + th.body).toLowerCase().includes(q));
  }
  list.sort((a, b) => (forumSort === "new" ? b.ts - a.ts : b.votes - a.votes || b.ts - a.ts));

  $("forumList").innerHTML = list.length
    ? list
        .map((th) => `<div class="thread">
          <div class="thread-head">
            <div class="votes">
              <button data-up="${th.id}" title="Upvote">▲</button>
              <b>${th.votes}</b>
              <button data-down="${th.id}" title="Downvote">▼</button>
            </div>
            <div style="flex:1">
              <h5>${esc(th.title)}</h5>
              <div class="meta">📍 ${esc(th.area)} · u/${esc(th.by)} · ${timeAgo(th.ts)} · 💬 ${th.replies.length}</div>
              <p class="body">${esc(th.body)}</p>
              <div class="replies">
                ${th.replies.map((r) => `<div class="reply"><b>u/${esc(r.by)}</b> <span>${timeAgo(r.ts)}</span><br/>${esc(r.text)}</div>`).join("")}
              </div>
              <div class="reply-form">
                <input type="text" placeholder="Write a reply..." data-replyinput="${th.id}" />
                <button class="btn btn-info" data-reply="${th.id}">Reply</button>
              </div>
            </div>
          </div>
        </div>`)
        .join("")
    : '<div class="empty-state">No discussions yet for this filter. Start one!</div>';

  $("forumList").querySelectorAll("[data-up]").forEach((b) => (b.onclick = () => voteThread(b.dataset.up, 1)));
  $("forumList").querySelectorAll("[data-down]").forEach((b) => (b.onclick = () => voteThread(b.dataset.down, -1)));
  $("forumList").querySelectorAll("[data-reply]").forEach((b) => {
    b.onclick = () => {
      const input = $("forumList").querySelector(`[data-replyinput="${b.dataset.reply}"]`);
      const text = input.value.trim();
      if (!text) return;
      const th = state.threads.find((x) => x.id === b.dataset.reply);
      th.replies.push({ by: session ? session.user : "user", text, ts: Date.now() });
      save();
      renderForum();
      toast("Reply posted.", "ok");
    };
  });
}

function voteThread(id, delta) {
  const th = state.threads.find((x) => x.id === id);
  if (!th) return;
  th.votes = Math.max(0, th.votes + delta);
  save();
  renderForum();
}

function postThread() {
  const err = $("fmError");
  err.textContent = "";
  const area = $("fmArea").value.trim();
  const title = $("fmTitle").value.trim();
  const body = $("fmBody").value.trim();
  if (!area) { err.textContent = "⚠️ Please enter the area or locality."; return; }
  if (title.length < 5) { err.textContent = "⚠️ Please write a slightly longer title."; return; }
  state.threads.unshift({
    id: "t" + Date.now(),
    area, title, body: body || "(no details added)",
    by: session ? session.user : "user",
    ts: Date.now(), votes: 1, replies: [],
  });
  save();
  $("fmArea").value = ""; $("fmTitle").value = ""; $("fmBody").value = "";
  renderForum();
  toast("Discussion posted to the forum.", "ok");
}

/* =====================================================================
   HOTSPOT LIST
   ===================================================================== */
function renderHotspotList() {
  $("hotspotList").innerHTML = HOTSPOTS.map(
    (h, i) => `<div class="item" data-hot="${i}">
      <div><h5>⚠️ ${esc(h.name)}</h5>
      <p>Recorded flood severity: <b>${h.severity}</b></p></div>
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
   CHARTS
   ===================================================================== */
function chartColors() {
  const cs = getComputedStyle(document.body);
  return { muted: cs.getPropertyValue("--muted").trim() || "#9db0cd", text: cs.getPropertyValue("--text").trim() || "#eaf0fa" };
}

function barChart(canvasId, labels, values, colors) {
  const c = $(canvasId);
  if (!c || !c.clientWidth) return;
  const cc = chartColors();
  const dpr = window.devicePixelRatio || 1;
  const w = c.clientWidth, h = 220;
  c.width = w * dpr; c.height = h * dpr;
  const ctx = c.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const max = Math.max(...values, 1) * 1.15;
  const pad = 30, bw = (w - pad * 2) / values.length;
  ctx.strokeStyle = "rgba(148,163,184,.22)";
  for (let i = 0; i <= 4; i++) { const y = 20 + ((h - 50) / 4) * i; ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(w - pad / 2, y); ctx.stroke(); }
  values.forEach((v, i) => {
    const bh = ((h - 50) * v) / max;
    ctx.fillStyle = Array.isArray(colors) ? colors[i % colors.length] : colors;
    const x = pad + i * bw + bw * 0.18, y = h - 30 - bh;
    ctx.beginPath(); ctx.roundRect(x, y, bw * 0.64, bh, 6); ctx.fill();
    ctx.fillStyle = cc.muted; ctx.font = "10px system-ui"; ctx.textAlign = "center";
    ctx.fillText(labels[i], x + bw * 0.32, h - 12);
    ctx.fillStyle = cc.text;
    ctx.fillText(String(v), x + bw * 0.32, y - 5);
  });
}

function lineChart(canvasId, labels, values, color) {
  const c = $(canvasId);
  if (!c || !c.clientWidth || !values.length) return;
  const cc = chartColors();
  const dpr = window.devicePixelRatio || 1;
  const w = c.clientWidth, h = 220;
  c.width = w * dpr; c.height = h * dpr;
  const ctx = c.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const max = Math.max(...values, 1) * 1.2, pad = 32;
  const px = (i) => pad + ((w - pad * 1.5) * i) / Math.max(1, values.length - 1);
  const py = (v) => h - 30 - ((h - 50) * v) / max;
  ctx.strokeStyle = "rgba(148,163,184,.22)";
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
  ctx.fillStyle = cc.muted; ctx.font = "10px system-ui"; ctx.textAlign = "center";
  labels.forEach((l, i) => { if (i % Math.ceil(labels.length / 8) === 0) ctx.fillText(l, px(i), h - 12); });
}

/* =====================================================================
   ANALYTICS (live, continuously updating)
   ===================================================================== */
let analyticsRange = 7;
let liveSeries = { rain: [], reports: [], risk: [210, 340, 180, 96] };

function seedSeries(n, base, spread) {
  return Array.from({ length: n }, (_, i) => Math.max(0, Math.round(base + Math.sin(i * 1.7) * spread + (Math.random() - 0.5) * spread)));
}

function ensureSeries() {
  if (liveSeries.rain.length !== analyticsRange) liveSeries.rain = seedSeries(analyticsRange, 12, 8);
  if (liveSeries.reports.length !== analyticsRange) liveSeries.reports = seedSeries(analyticsRange, 18, 10);
}

function renderAnalytics() {
  ensureSeries();
  const a = state.analytics;
  const active = state.reports.filter((r) => r.status !== "rejected").length;
  const avgRain = liveSeries.rain.reduce((s, v) => s + v, 0) / liveSeries.rain.length;
  $("kpiGrid").innerHTML = [
    ["Total Routes Analysed", a.routes.toLocaleString()],
    ["Safe Routes", a.safe.toLocaleString()],
    ["High Risk Routes", a.risky.toLocaleString()],
    ["Active Waterlogging Reports", active],
    ["Flood Hotspots Tracked", HOTSPOTS.length + 45],
    ["Average Rainfall", avgRain.toFixed(1) + " mm/hr"],
  ].map(([k, v]) => `<div class="kpi"><span>${k}</span><b>${v}</b></div>`).join("");
  drawCharts();
}

function drawCharts() {
  ensureSeries();
  const dayLabels = Array.from({ length: analyticsRange }, (_, i) => "D" + (i + 1));
  const riskBuckets = [0, 0, 0, 0];
  routes.forEach((r) => { riskBuckets[["LOW", "MODERATE", "HIGH", "EXTREME"].indexOf(classifyRisk(r.floodRisk).label)] += 1; });
  const scale = Math.max(1, Math.round(state.analytics.routes / 40));
  barChart("riskChart", ["Low", "Moderate", "High", "Extreme"],
    liveSeries.risk.map((v, i) => v + riskBuckets[i] * scale),
    ["#22c55e", "#facc15", "#f97316", "#ef4444"]);
  lineChart("rainChart", dayLabels, liveSeries.rain, "#38bdf8");
  barChart("reportChart", dayLabels, liveSeries.reports, "#a78bfa");
  barChart("safeChart", ["Safe routes", "Risky routes"], [state.analytics.safe, state.analytics.risky], ["#22c55e", "#ef4444"]);
  const sev = ["Extreme", "High", "Moderate"].map((s) => HOTSPOTS.filter((h) => h.severity === s).length);
  barChart("hotspotChart", ["Extreme", "High", "Moderate"], sev, ["#ef4444", "#f97316", "#facc15"]);
  renderTrend();
}

/* Continuous live movement of analytics + admin metrics */
function tickLiveMetrics() {
  const a = state.analytics;
  a.routes += Math.floor(Math.random() * 5);
  a.safe += Math.random() < 0.6 ? Math.floor(Math.random() * 3) : 0;
  a.risky += Math.random() < 0.35 ? Math.floor(Math.random() * 2) : 0;
  a.users = clamp(a.users + Math.round((Math.random() - 0.45) * 12), 120, 900);
  ensureSeries();
  liveSeries.rain = liveSeries.rain.map((v) => clamp(Math.round(v + (Math.random() - 0.5) * 4), 0, 45));
  liveSeries.reports = liveSeries.reports.map((v) => clamp(Math.round(v + (Math.random() - 0.5) * 5), 0, 60));
  liveSeries.risk = liveSeries.risk.map((v) => clamp(Math.round(v + (Math.random() - 0.5) * 18), 40, 700));
  save();
  const activeTab = document.querySelector(".tab.active")?.dataset.tab;
  if (activeTab === "analytics") renderAnalytics();
  if (activeTab === "admin") renderAdmin();
}

/* =====================================================================
   ADMIN
   ===================================================================== */
let adminFilter = "all";

function renderAdmin() {
  const verified = state.reports.filter((r) => r.status === "verified").length;
  const active = state.reports.filter((r) => r.status !== "rejected").length;
  $("adminGrid").innerHTML = [
    ["Active users", state.analytics.users.toLocaleString()],
    ["Routes calculated", state.analytics.routes.toLocaleString()],
    ["Reports received", state.reports.length],
    ["Verified reports", verified],
    ["Forum discussions", state.threads.length],
    ["High-risk areas", HOTSPOTS.filter((h) => h.severity !== "Moderate").length],
    ["Current rainfall", state.rainfall.toFixed(1) + " mm/hr"],
    ["Weather service", state.rainSource.startsWith("Open-Meteo") ? "🟢 Online" : "🟡 Degraded"],
    ["Routing service", routes.length ? "🟢 Online" : "⚪ Idle"],
    ["Active reports", active],
  ].map(([k, v]) => `<div class="kpi"><span>${k}</span><b>${v}</b></div>`).join("");

  let list = [...state.reports].sort((a, b) => b.ts - a.ts);
  if (adminFilter !== "all") list = list.filter((r) => r.status === adminFilter);
  $("adminTable").innerHTML =
    `<thead><tr><th>Location</th><th>By</th><th>Time</th><th>Severity</th><th>Media</th><th>Status</th><th>Action</th></tr></thead><tbody>` +
    (list.length
      ? list.map((r) => `<tr>
          <td>${esc(r.location)}</td><td>${esc(r.by || "user")}</td><td>${timeAgo(r.ts)}</td><td>${esc(r.severity)}</td>
          <td>${r.photo ? "📷" : ""}${r.video ? "🎥" : ""}${!r.photo && !r.video ? "—" : ""}</td>
          <td><span class="chip chip-${r.status}">${r.status}</span></td>
          <td>
            <button class="btn btn-safe" data-verify="${r.id}">Verify</button>
            <button class="btn btn-danger" data-reject="${r.id}">Reject</button>
            <button class="btn btn-ghost" data-view="${r.id}">View on map</button>
          </td></tr>`).join("")
      : `<tr><td colspan="7">No reports for this filter.</td></tr>`) +
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
  r.reviewedAt = Date.now();
  save();
  refreshReports();
  toast(`Report "${r.location}" marked ${status}.`, status === "verified" ? "ok" : "warn");
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

  const fail = (m) => { err.textContent = m; btn.disabled = false; btn.textContent = t("findBtn"); };

  let src, dst;
  try { src = await geocode(s); } catch (e) { return fail("⚠️ We couldn't find that source location. Try a nearby landmark or city."); }
  try { dst = await geocode(d); } catch (e) { return fail("⚠️ We couldn't find that destination. Try a nearby landmark or city."); }
  if (haversine(src, dst) < 300) return fail("⚠️ Source and destination are too close for a meaningful route.");

  srcPoint = src;
  destPoint = dst;

  try {
    const raw = await buildRoutes(src, dst);
    routes = raw.map((r, i) => Object.assign(r, { id: "r" + i }));
    selectedRouteId = null;
    routes.forEach(scoreRoute);
    assignRoles();

    layers.points.clearLayers();
    L.marker([src.lat, src.lng], { icon: emojiIcon("🟢", 28) }).addTo(layers.points).bindPopup(`<b>Source</b><br/>${esc(src.name || s)}`);
    L.marker([dst.lat, dst.lng], { icon: emojiIcon("🔴", 28) }).addTo(layers.points).bindPopup(`<b>Destination</b><br/>${esc(dst.name || d)}`);

    drawRoutePolylines();
    renderRouteCards();
    renderComparison();
    renderAdvisory();
    map.fitBounds(L.latLngBounds(routes[0].path.map((p) => [p.lat, p.lng])), { padding: [50, 50] });

    $("locBadge").textContent = "📍 " + (dst.name || d).split(",")[0];
    state.analytics.routes += routes.length;
    const best = routes.find((r) => r.recommended);
    if (best.safety >= 60) state.analytics.safe += 1; else state.analytics.risky += 1;
    save();
    renderAnalytics(); renderAdmin();

    loadHospitals(src);
    await fetchLiveWeather(dst);
    loadDestinationTrend();
    drawHeatmap();
    toast(`${routes.length} distinct road routes analysed. ⭐ ${ROLE_META[best.role].name} recommended for ${VEHICLE_PROFILES[state.vehicle].label}.`, "ok");
  } catch (e) {
    fail("⚠️ We couldn't calculate routes right now. Please check your connection and try again.");
    toast("Routing service unreachable — please retry.", "err");
    return;
  } finally {
    btn.disabled = false;
    btn.textContent = t("findBtn");
  }
}

/* =====================================================================
   TABS, THEME, LANGUAGE, FAQ
   ===================================================================== */
function switchTab(name) {
  document.querySelectorAll(".tab").forEach((t2) => t2.classList.toggle("active", t2.dataset.tab === name));
  document.querySelectorAll(".view").forEach((v) => v.classList.toggle("active", v.id === "view-" + name));
  $("tabs").classList.remove("open");
  if (name === "navigation" && map) setTimeout(() => map.invalidateSize(), 120);
  if (name === "analytics" || name === "rainfall") setTimeout(drawCharts, 60);
  if (name === "forum") renderForum();
}

function renderHelplines() {
  const html = HELPLINES.map((h) => `<div class="helpline"><a href="tel:${h.n}">${h.n}</a><span>${h.label}</span></div>`).join("");
  $("helplines").innerHTML = html;
  $("helplines2").innerHTML = html;
}

function applyLanguage() {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const v = t(el.dataset.i18n);
    if (typeof v === "string") el.textContent = v;
  });
  $("srcInput").placeholder = t("phSource");
  $("dstInput").placeholder = t("phDest");
  $("safeListA").innerHTML = t("safeA").map((x) => `<li>${esc(x)}</li>`).join("");
  $("safeListB").innerHTML = t("safeB").map((x) => `<li>${esc(x)}</li>`).join("");
  $("heatToggle").textContent = heatOn ? t("heatOn") : t("heatOff");
  $("langSelect").value = lang;
  renderRouteCards();
  renderTrend();
  localStorage.setItem("rsr_lang", lang);
}

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem("rsr_theme", theme);
  $("themeToggle").textContent = theme === "dark" ? "🌙" : "☀️";
  setTimeout(drawCharts, 50);
}

const FAQ_FALLBACK = [
  ["How are routes calculated?", "Road geometry comes from the OSRM routing engine over OpenStreetMap data. Each route is then scored for flood risk using rainfall intensity, distance to known flood hotspots and nearby community reports."],
  ["What does the safety score mean?", "It is 100 minus the flood risk score. Above 75 is comfortable, 50-75 needs caution, below 50 means consider postponing the trip."],
  ["Why does my recommended route change when I change vehicle?", "Each vehicle type has a different safety-versus-speed weighting. A school bus prioritises safety heavily, while an emergency vehicle accepts more risk to arrive faster."],
  ["Where does the rainfall data come from?", "Open-Meteo current conditions and hourly history for your selected destination."],
  ["Who verifies community reports?", "Administrators review submitted reports in the Admin panel. Verified reports carry more weight in the risk engine."],
  ["Can I keep a copy of my report?", "Yes — press Copy on any report to download a receipt with its reference ID and progress tracker."],
];

function openFaq() {
  $("faqModal").hidden = false;
}

function handleFaqUpload(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try { localStorage.setItem("rsr_faq_pdf", reader.result); } catch (e) { toast("PDF too large to store — showing it for this session only.", "warn"); }
    $("faqViewer").innerHTML = `<iframe src="${reader.result}" title="FAQ PDF"></iframe>`;
    $("faqOpenTab").href = reader.result;
    toast("FAQ PDF loaded.", "ok");
  };
  reader.readAsDataURL(file);
}

/* =====================================================================
   BOOT
   ===================================================================== */
function bootUiFromState() {
  $("srcInput").value = "";
  $("dstInput").value = "";
  $("vehicleSelect").value = state.vehicle;
  $("vehicleNote").textContent = VEHICLE_PROFILES[state.vehicle].banner || "Standard routing with flood-risk weighting.";
  renderWeather();
  renderReportList();
  renderForum();
  renderHotspotList();
  renderAnalytics();
  renderAdmin();
}

function init() {
  applyTheme(localStorage.getItem("rsr_theme") || "dark");
  initMap();
  renderHelplines();
  wireAutocomplete("srcInput", "srcSuggest");
  wireAutocomplete("dstInput", "dstSuggest");
  bootUiFromState();
  applyLanguage();

  /* auth */
  document.querySelectorAll(".auth-tab").forEach((b) => (b.onclick = () => setAuthRole(b.dataset.role)));
  $("captchaRefresh").onclick = newCaptcha;
  $("authSubmit").onclick = doLogin;
  $("captchaInput").addEventListener("keydown", (e) => { if (e.key === "Enter") doLogin(); });
  $("authPass").addEventListener("keydown", (e) => { if (e.key === "Enter") doLogin(); });
  $("logoutBtn").onclick = logout;
  setAuthRole("user");
  applySession();

  /* nav */
  $("hamburger").onclick = () => $("tabs").classList.toggle("open");
  document.querySelectorAll(".tab").forEach((tb) => (tb.onclick = () => switchTab(tb.dataset.tab)));

  /* routing */
  $("findBtn").onclick = findRoutes;
  $("srcInput").addEventListener("keydown", (e) => { if (e.key === "Enter") findRoutes(); });
  $("dstInput").addEventListener("keydown", (e) => { if (e.key === "Enter") findRoutes(); });
  $("vehicleSelect").onchange = (e) => {
    state.vehicle = e.target.value;
    save();
    $("vehicleNote").textContent = VEHICLE_PROFILES[state.vehicle].banner || "Standard routing with flood-risk weighting.";
    rescoreAll();
    if (routes.length) {
      const best = routes.find((r) => r.recommended);
      selectRoute(best.id);
      toast(`Route recommendation updated for ${VEHICLE_PROFILES[state.vehicle].label}.`, "info");
    }
  };

  /* weather + heatmap */
  $("fetchLive").onclick = () => fetchLiveWeather().then(() => loadDestinationTrend());
  $("heatToggle").onclick = () => {
    heatOn = !heatOn;
    drawHeatmap();
    $("heatToggle").textContent = heatOn ? t("heatOn") : t("heatOff");
  };

  /* reports */
  $("repSubmit").onclick = submitReport;
  $("repCancel").onclick = () => { clearReportForm(); toast("Report cancelled.", "info"); };
  $("reportFilters").querySelectorAll("[data-filter]").forEach((b) => {
    b.onclick = () => {
      reportFilter = b.dataset.filter;
      $("reportFilters").querySelectorAll(".btn-chip").forEach((x) => x.classList.toggle("active", x === b));
      renderReportList();
    };
  });

  /* forum */
  $("fmPost").onclick = postThread;
  $("fmSearch").addEventListener("input", (e) => { forumQuery = e.target.value.trim(); renderForum(); });
  $("forumSort").querySelectorAll("[data-sort]").forEach((b) => {
    b.onclick = () => {
      forumSort = b.dataset.sort;
      $("forumSort").querySelectorAll(".btn-chip").forEach((x) => x.classList.toggle("active", x === b));
      renderForum();
    };
  });

  /* admin + analytics */
  $("adminFilters").querySelectorAll("[data-af]").forEach((b) => {
    b.onclick = () => {
      adminFilter = b.dataset.af;
      $("adminFilters").querySelectorAll(".btn-chip").forEach((x) => x.classList.toggle("active", x === b));
      renderAdmin();
    };
  });
  $("analyticsFilters").querySelectorAll("[data-range]").forEach((b) => {
    b.onclick = () => {
      analyticsRange = +b.dataset.range;
      liveSeries.rain = []; liveSeries.reports = [];
      $("analyticsFilters").querySelectorAll(".btn-chip").forEach((x) => x.classList.toggle("active", x === b));
      renderAnalytics();
    };
  });

  /* theme, language, faq */
  $("themeToggle").onclick = () => applyTheme(document.body.dataset.theme === "dark" ? "light" : "dark");
  $("langSelect").onchange = (e) => { lang = e.target.value; applyLanguage(); };
  $("faqBtn").onclick = openFaq;
  $("faqClose").onclick = () => ($("faqModal").hidden = true);
  $("faqModal").addEventListener("click", (e) => { if (e.target.id === "faqModal") $("faqModal").hidden = true; });


  window.addEventListener("resize", () => drawCharts());
  setInterval(() => {
    $("rainUpdated").textContent = timeAgo(state.updatedAt);
    $("rf2Updated").textContent = timeAgo(state.updatedAt);
  }, 30000);
  setInterval(tickLiveMetrics, 4000);
  setInterval(() => { if (destPoint) fetchLiveWeather(destPoint); }, 15 * 60000);

  fetchLiveWeather();
  drawCharts();
}

document.addEventListener("DOMContentLoaded", init);
