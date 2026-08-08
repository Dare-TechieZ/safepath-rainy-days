# Safe Route Navigator

Build a Complete Working Website: RainSafeRoute

Build a complete, polished, responsive web application called RainSafeRoute — a flood-aware, safety-first navigation platform for monsoon-prone regions of India.

This must be a fully functional frontend prototype, not just a static UI/mockup. Every major button, input, filter, modal, map interaction, route selection, report submission, simulation control, and dashboard interaction must work.

Use HTML5, CSS3, and vanilla JavaScript. Keep the project simple enough to run by opening index.html, while structuring the code cleanly so it can later be connected to a Node.js/Express/Supabase backend.

1. CORE PRODUCT IDEA

RainSafeRoute is different from Google Maps, Apple Maps, and MapMyIndia.

Normal navigation apps optimize primarily for:

Fastest route / shortest route

RainSafeRoute optimizes for:

Safest route during rainfall and flooding

The application should simulate a realistic monsoon navigation experience using:

Real-world interactive map

Real roads

Realistic route paths

Simulated live rainfall

Historical flood hotspots

Simulated community waterlogging reports

Hospitals and medical aid

Indian emergency helpline information

Multiple vehicle modes

Flood-risk calculations

Route comparison

Safety recommendations

Analytics

Admin monitoring

Clearly label simulated/demo information wherever real backend data is not available.

2. TECHNOLOGY REQUIREMENTS

Use:

Frontend

HTML5

CSS3

Vanilla JavaScript

Map

Use Leaflet.js with OpenStreetMap tiles.

The map must be a REAL interactive map, not a fake/static map.

Include:

Zoom controls

Pan

Markers

Popups

Route polylines

Different route colors

Map legend

Current location simulation

Hotspot markers

Community report markers

Hospital markers

Do NOT create a fake map using CSS.

Use Leaflet CDN.

3. MAIN APPLICATION LAYOUT

Create a professional modern dashboard/navigation interface.

Layout:

Top navigation bar

Logo:

🌧️ RainSafeRoute

Navigation:

Navigation

Live Rainfall

Community Reports

Safety

Analytics

Admin

Right side:

🌧️ Rain status

Simulation indicator

User/location indicator

4. HERO / NAVIGATION PANEL

The primary screen should contain:

"Find Your Safest Route"

Inputs:

Source

Placeholder:

Enter starting location

Destination

Placeholder:

Enter destination

Vehicle

Dropdown:

🚗 Car

🏍️ Bike

🚚 Truck

🚑 Emergency Vehicle

🚒 Fire & Rescue

🏫 School Bus

📦 Delivery

Button:

FIND SAFE ROUTES

When clicked:

Validate source and destination.

Geocode the locations.

Display them on the real map.

Generate 3 realistic route alternatives.

Calculate route distance.

Calculate ETA.

Calculate flood-risk score.

Calculate safety score.

Find nearest hotspot.

Display rainfall conditions.

Recommend the safest route.

Display all 3 routes on the map.

Do not make the button decorative.

5. ROUTES

Display exactly 3 primary route alternatives:

ROUTE 1 — FASTEST

Color:

🔴 RED

Show:

Fastest

Distance

ETA

Flood Risk Score

Safety Score

Nearest hotspot

Rainfall

Recommendation

Example:

🔴 Fastest Route
8.4 km
22 min
Flood Risk: 72/100
Safety Score: 28/100
Nearest hotspot: 180 m

ROUTE 2 — SAFEST

Color:

🟢 GREEN

Show:

Safest Route

Distance

ETA

Flood Risk Score

Safety Score

Nearest hotspot

Rainfall

Recommendation

Example:

🟢 Safest Route
9.8 km
28 min
Flood Risk: 18/100
Safety Score: 82/100
Nearest hotspot: 780 m

This should be automatically selected/recommended when it has the best safety score.

Display:

⭐ RECOMMENDED SAFEST ROUTE

ROUTE 3 — ALTERNATIVE

Color:

⚫ BLACK

Show:

Alternative Route

Distance

ETA

Flood Risk Score

Safety Score

Nearest hotspot

Rainfall

Example:

⚫ Alternative Route
10.2 km
31 min
Flood Risk: 43/100
Safety Score: 57/100

6. REAL ROUTING

Do not simply draw random straight lines.

Use a real routing service such as:

OpenRouteService

or another publicly accessible routing API.

If an API key is required, structure the JavaScript so the key can easily be inserted through:

const ORS_API_KEY = "YOUR_API_KEY";


If no routing API key is available, implement a realistic demo fallback using predefined road-coordinate datasets for Delhi/Indian locations.

The website must still work without an API key.

The fallback must not draw straight lines between source and destination.

Use realistic road-like route coordinates.

7. SOURCE / DESTINATION GEOCODING

Use:

Nominatim / OpenStreetMap

for geocoding.

Example:

User enters:

India Gate

and

IGDTUW

The application should find their coordinates and move the map to the selected area.

Add autocomplete/search suggestions if possible.

If API requests fail, provide a graceful fallback using predefined locations such as:

India Gate

Connaught Place

IGDTUW

Kashmere Gate

Anand Vihar

Lajpat Nagar

Saket

Rohini

Dwarka

Noida

Gurugram

8. REAL INTERACTIVE MAP

The map is the central part of the application.

Use Leaflet.

Map must display:

Source marker

🟢

Destination marker

🔴

Route 1

Red polyline

Route 2

Green polyline

Route 3

Black polyline

Historical flood hotspots

⚠️ Water/flood icon

Community reports

📢 Marker

Hospitals

🏥 Marker

9. MAP LEGEND

Add a floating legend:

🟢 Safest Route
🔴 Fastest / High Risk
⚫ Alternative Route
⚠️ Historical Flood Hotspot
📢 Community Report
🏥 Hospital / Medical Aid

10. SIMULATED LIVE RAINFALL

Create a realistic rainfall simulation.

The UI should contain a:

LIVE RAINFALL SIMULATOR

Display:

Rainfall: 18.4 mm/hr

Intensity: Heavy Rain

Last Updated: 2 min ago

Include a button:

▶ Simulate Rainfall

And controls:

Light Rain

Moderate Rain

Heavy Rain

Extreme Rain

Also include:

Auto Simulation

When simulation is running, rainfall should gradually change every few seconds.

For example:

0 → 3 → 7 → 12 → 18 → 25 → 32 mm/hr

The route risk scores must automatically update when rainfall changes.

Add an animated rainfall indicator / rain particles or visual effect.

Clearly label:

DEMO SIMULATION

when using simulated rainfall.

11. OPEN-METEO INTEGRATION

Structure the code to support the real Open-Meteo API.

Fetch rainfall using the selected source coordinates.

Poll/update approximately every 15 minutes in real deployment.

For this frontend demo, provide a simulation fallback so the website works even when the API is unavailable.

Display:

Rainfall mm/hr

Temperature

Weather condition

Rain intensity

Last updated

12. FLOOD RISK SCORE

Implement this exact formula:

Flood Risk Score =
(w1 × Rainfall Factor)
+
(w2 × Proximity Factor)
+
(w3 × Community Factor)


Weights:

w1 = 0.40
w2 = 0.35
w3 = 0.25


13. RAINFALL FACTOR

Calculate Rainfall Factor from 0–100.

Use:

0 mm/hr → 0

0–5 mm/hr → linear 0–20

5–15 mm/hr → linear 20–50

15–30 mm/hr → linear 50–80

30+ mm/hr → 100


Implement this using JavaScript interpolation.

Do NOT hardcode the final risk score.

14. PROXIMITY FACTOR

Calculate distance from the route to the nearest historical flood hotspot.

Use:

0–100m → 100
100–300m → 75
300–500m → 50
500m–1km → 25
>1km → 0


Display:

Nearest hotspot: 240 m

and:

Proximity Risk: 75/100

For demo mode, create realistic historical hotspot coordinates around Delhi/Indian cities.

Clearly label them as:

Historical / Demo Flood Hotspot

15. COMMUNITY FACTOR

Implement:

No reports within 500m during last 2 hours → 0

1 unverified report → 40

2+ reports OR 1 verified report → 80

3+ verified reports → 100


Use simulated community reports initially.

Every report must contain:

Location

Timestamp

Severity

Verification status

Optional image indicator

Description

Example:

Waterlogging reported
14 min ago
Knee-level
Verified

16. RISK CLASSIFICATION

Based on Flood Risk Score:

0–25 → LOW
26–50 → MODERATE
51–75 → HIGH
76–100 → EXTREME


Use clear visual indicators.

Example:

🟢 LOW RISK

🟡 MODERATE RISK

🟠 HIGH RISK

🔴 EXTREME RISK

17. SAFETY SCORE

Calculate:

Safety Score = 100 - Flood Risk Score


Display both.

Example:

Flood Risk: 22/100
Safety Score: 78/100


18. ROUTE RECOMMENDATION

Automatically recommend the route with the highest safety score.

Show:

⭐ RECOMMENDED

Example:

Green Route is recommended because it has 67% lower flood risk than the fastest route.

The recommendation must dynamically change when rainfall/community reports change.

19. VEHICLE MODES

Implement different route behavior based on vehicle type.

Car

Normal routing.

Bike

Avoid:

High-risk roads

Severe waterlogging

Truck

Avoid:

Narrow roads

Severe flood areas

Low-clearance roads

Emergency Vehicle

Prioritize:

Safety

Reliability

Emergency accessibility

Display:

🚑 Emergency Priority Mode Active

Fire & Rescue

Avoid:

Flooded roads

Low-clearance routes

School Bus

Use strict safety thresholds.

Display:

🏫 School Safety Mode

Delivery

Balance:

Safety

ETA

Route efficiency

20. SAFETY PRECAUTION CARD

After route calculation, show a prominent:

🛡️ TRAVEL SAFETY CARD

Include:

Before travelling

Check rainfall intensity.

Avoid flooded underpasses.

Do not enter roads where water depth is unknown.

Keep phone charged.

Carry emergency supplies.

Inform someone about your route.

During heavy rainfall

Reduce speed.

Maintain extra braking distance.

Avoid driving through moving water.

Do not stop under trees or unsafe structures.

Follow local authorities.

Emergency warning

⚠️ If water is moving rapidly across the road, DO NOT attempt to cross.

21. INDIAN EMERGENCY HELPLINES

Create a clearly visible emergency section.

Include commonly used India emergency numbers:

112 — Unified Emergency Number
108 — Ambulance
101 — Fire
100 — Police
1098 — Child Helpline
181 — Women Helpline


Make phone numbers clickable using:

<a href="tel:112">112</a>


Clearly indicate that availability can vary by region/service and users should use the appropriate official emergency service.

22. NEAREST HOSPITALS / MEDICAL AID

When source and destination are selected:

Find and display nearby hospitals/medical facilities.

Use OpenStreetMap/Overpass where practical.

If unavailable, use realistic demo hospital data.

Display:

🏥 Hospital Name
📍 Distance
🚑 Emergency availability
📞 Call button
🗺️ View on map

Example:

Nearby Medical Aid
Hospital A — 1.2 km
Hospital B — 2.4 km

Clicking a hospital should:

Show its marker.

Open its popup.

Show distance.

Allow "Navigate" / map focus.

Do not invent real hospital phone numbers.

If using demo hospital data, clearly label:

DEMO DATA

23. COMMUNITY WATERLOGGING REPORTING

Create:

📢 REPORT WATERLOGGING

Form:

Location
Severity:

Ankle-level

Knee-level

Waist-level

Road completely blocked

Description

Photo upload

Button:

SUBMIT REPORT

When submitted:

Validate form.

Add report to the map.

Add report to the community list.

Generate timestamp.

Update Community Factor.

Recalculate route risk.

Show success notification.

Example:

✅ Report submitted successfully.

The user must be able to delete their own demo report.

24. LIVE COMMUNITY REPORT PANEL

Display:

LIVE WATERLOGGING REPORTS

Each report:

📍 Location
⏱️ Time
🌊 Severity
✅ Verified / Unverified

Allow filters:

All

Recent

Severe

Verified

Clicking a report should center the map on its location.

25. HISTORICAL FLOOD HOTSPOTS

Create a dataset of demo historical flood hotspots.

Each hotspot should contain:

{
  name: "...",
  lat: ...,
  lng: ...,
  severity: "...",
  source: "Historical/Demo"
}


Show them on the map.

Clicking a hotspot should show:

Name

Historical risk

Distance from route

Severity

Data source

26. SAFETY RECOMMENDATION PANEL

After route generation display:

⚠️ TRAVEL ADVISORY

Example:

Heavy rainfall is currently simulated in this area.

The fastest route passes within 180m of a historical flood hotspot.

Consider the green route. It adds 6 minutes but reduces estimated flood risk by 64%.

Make this dynamically generated from actual calculated values.

27. ANALYTICS DASHBOARD

Create a separate Analytics section.

Show cards:

Total Routes Analysed

Example:

1,248

Safe Routes

824

High Risk Routes

287

Active Waterlogging Reports

34

Flood Hotspots

57

Average Rainfall

14.8 mm/hr

Use JavaScript charts or simple CSS/Canvas charts.

Include:

Route risk distribution

Rainfall trend

Community reports over time

Flood hotspot distribution

Safe vs risky routes

Use realistic demo data.

28. ADMIN DASHBOARD

Create an Admin section.

Show:

System Monitoring

Active users

Routes calculated

Reports received

Verified reports

High-risk areas

Current rainfall

API status

Community Reports Table

Columns:

Location
Time
Severity
Status
Action


Actions:

Verify

Reject

View on map

These buttons must actually work.

When "Verify" is clicked:

Change report status to Verified.

Update Community Factor.

Update risk score.

Update analytics.

29. DATA SIMULATION

Create a JavaScript demo-data layer.

The application should simulate:

Rainfall

Changes dynamically.

Community reports

New reports can appear.

Route requests

Analytics counters change.

Risk scores

Recalculate automatically.

Hotspots

Remain visible on map.

Use:

setInterval()


where appropriate.

But do not make the simulation annoying or overly fast.

Provide:

Start Simulation

Pause Simulation

controls.

30. LOCAL STORAGE

Use localStorage so the demo persists:

User reports

Selected vehicle

Last source

Last destination

Simulation state

Analytics counters

When the page is refreshed, previously submitted demo reports should remain.

Provide:

Reset Demo Data

button.

Ask for confirmation before clearing data.

31. RESPONSIVE DESIGN

The website must work on:

Desktop

Laptop

Tablet

Mobile

On mobile:

Map should remain usable.

Route cards should stack vertically.

Navigation should collapse.

Safety card should remain readable.

Emergency numbers should be easy to tap.

32. UI DESIGN

Use a modern emergency/safety technology aesthetic.

Suggested visual style:

Dark navy / charcoal background

White cards

Green = safe

Red = dangerous

Yellow/orange = warning

Blue = information

Use:

Rounded cards

Soft shadows

Clean typography

Glass-like panels where appropriate

Smooth transitions

Hover effects

Status badges

Icons

Do NOT overuse animations.

The map should remain the visual centerpiece.

33. IMPORTANT INTERACTIONS

EVERY BUTTON MUST WORK.

Implement functionality for:

Find Safe Routes

Source search

Destination search

Vehicle selection

Route selection

Show safest route

Show fastest route

Show alternative route

Simulate rainfall

Pause simulation

Light rain

Moderate rain

Heavy rain

Extreme rain

Auto simulation

Report waterlogging

Submit report

Cancel report

View report

Verify report

Reject report

View hospital

Call emergency number

Analytics filters

Admin filters

Reset demo data

Navigation tabs

Map controls

Hospital markers

Hotspot markers

Community markers

No dead buttons.

34. ERROR HANDLING

Handle:

Empty source

Empty destination

Same source and destination

Invalid location

Geocoding failure

Routing API failure

Weather API failure

Network failure

Missing API key

Invalid report

Missing report location

Show friendly messages.

Example:

⚠️ We couldn't find that location. Try a nearby landmark or city.

Never leave the UI blank after an error.

35. DEMO MODE

Because this is a frontend-only project, implement:

🟢 DEMO MODE

at the top.

Demo mode should automatically provide:

Simulated rainfall

Demo hotspots

Demo community reports

Demo hospital data

Fallback routes

Analytics data

The user should be able to demonstrate the entire application without configuring a backend.

Clearly distinguish:

LIVE API DATA

from

SIMULATED DEMO DATA

36. REALISTIC DEMO SCENARIO

On first load, provide a demo scenario around Delhi.

Example:

Source:

IGDTUW

Destination:

India Gate

Vehicle:

Car

When user clicks:

FIND SAFE ROUTES

automatically show:

🔴 Fastest Route

High flood risk

🟢 Safest Route

Slightly longer but much safer

⚫ Alternative Route

Medium risk

Show all three on the real Leaflet map.

Add realistic demo hotspots around the route.

Add community waterlogging reports.

Show rainfall such as:

18.6 mm/hr — Heavy Rain

Then calculate the risk scores using the specified formula.

37. ROUTE CARD DESIGN

Each route card should visually contain:

ROUTE 01

🔴 FASTEST

8.4 km
22 min

Flood Risk
72 / 100

Safety Score
28 / 100

Nearest Hotspot
180 m

Rainfall
18.6 mm/hr

[VIEW ROUTE]


For safest:

⭐ RECOMMENDED

🟢 SAFEST

9.8 km
28 min

Flood Risk
18 / 100

Safety Score
82 / 100

Nearest Hotspot
780 m

[SELECT ROUTE]


38. ROUTE COMPARISON

Add a comparison table:

RouteDistanceETAFlood RiskSafety🔴 Fastest8.4 km22 min7228🟢 Safest9.8 km28 min1882⚫ Alternative10.2 km31 min4357

The values must come from JavaScript calculations.

Do not hardcode the displayed values.

39. RISK CALCULATION ENGINE

Put all risk calculations into reusable JavaScript functions:

calculateRainfallFactor(rainfall)

calculateProximityFactor(distance)

calculateCommunityFactor(reports)

calculateFloodRisk(
    rainfallFactor,
    proximityFactor,
    communityFactor
)

calculateSafetyScore(floodRisk)

classifyRisk(score)


This makes the system easy to connect to a real backend later.

40. ARCHITECTURE

Create exactly these files:

rainsaferoute/
│
├── index.html
├── style.css
└── script.js


Do not require React, Node.js, npm, or a build system for the initial version.

The website should run by opening:

index.html


41. CODE QUALITY

Write complete production-style code.

Do NOT give pseudocode.

Do NOT write:

// implement later


Do NOT leave:

TODO


Do NOT create empty functions.

Do NOT create fake buttons that do nothing.

Every feature described above must have an implementation.

Use comments to clearly separate:

// MAP
// GEOCODING
// ROUTING
// WEATHER
// RAINFALL SIMULATION
// FLOOD RISK ENGINE
// COMMUNITY REPORTS
// HOSPITALS
// ANALYTICS
// ADMIN
// LOCAL STORAGE


42. EXTERNAL LIBRARIES

Use CDN versions where necessary.

At minimum:

Leaflet.js

Leaflet CSS

Optionally use:

Font Awesome or Lucide icons

Chart.js for analytics

Do not require a package manager.

43. FINAL REQUIREMENT

The final result must feel like a real product demo for a hackathon/project presentation.

It should demonstrate this complete flow:

User enters source
        ↓
User enters destination
        ↓
Selects vehicle
        ↓
Clicks FIND SAFE ROUTES
        ↓
Real map updates
        ↓
3 routes appear
        ↓
Rainfall is displayed
        ↓
Flood hotspots appear
        ↓
Community reports appear
        ↓
Risk scores calculated
        ↓
Safest route recommended
        ↓
Safety precautions shown
        ↓
Nearest hospitals shown
        ↓
Emergency numbers shown
        ↓
User can report waterlogging
        ↓
Risk recalculates
        ↓
Analytics update
        ↓
Admin dashboard updates


The final website should be visually impressive but, more importantly, actually interactive and functional.

44. IMPORTANT ACCURACY RULE

Do not claim that simulated data is live real-world data.

Use clear labels:

SIMULATED RAINFALL

DEMO COMMUNITY DATA

HISTORICAL / DEMO HOTSPOT

When real APIs are used, display:

LIVE WEATHER DATA

The application must gracefully fall back to demo data if an API is unavailable.

45. OUTPUT FORMAT

Provide the complete contents of:

index.html

style.css

script.js

Do not omit any code.

Do not shorten the code with statements such as:

"rest of the code remains the same"

Provide the entire working implementation.

At the end, provide simple instructions for:

Running locally by opening index.html.

Adding an OpenRouteService API key if required.

Deploying the project to Vercel by uploading the three files.

Explaining which features use real APIs and which use simulated demo data.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://safepath-rainy-days.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4c680e9b-82bd-442f-a0c5-6f3ac204055a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
