#  RainSafeRoute

### Smart Flood-Aware Route Navigation

**Navigate Smarter. Stay Safer.**

RainSafeRoute is a flood-aware navigation web application designed to help people make safer travel decisions during heavy rainfall and monsoon conditions.

Instead of focusing only on the fastest route, RainSafeRoute considers rainfall intensity, known flood hotspots, and community-reported waterlogging to estimate route risk and highlight a safer alternative.

🌐 **Live Demo:** https://safepath-rainy-days.vercel.app/

---



## 🧭 About the Project

RainSafeRoute is a web-based flood-aware navigation system built for monsoon travel.

The application allows users to:

- Enter a source and destination
- Select their vehicle type
- Generate real road routes
- Compare route distance and estimated travel time
- Calculate flood-risk scores
- Identify nearby flood hotspots
- View live rainfall conditions
- See rainfall intensity on a map
- View community waterlogging reports
- Find nearby medical assistance
- Access Indian emergency helplines
- Follow monsoon travel safety precautions

The goal is simple:

> **Don't just find the fastest route. Find a route that is safer during rain and flooding.**

---

## ⚠️ The Problem

During heavy monsoon rainfall, a route that looks optimal under normal navigation conditions may become unsafe because of:

- Waterlogging
- Flood-prone underpasses
- Heavy rainfall
- Poor drainage
- Road blockages
- Rapidly changing local conditions

Traditional navigation systems primarily optimize for distance and travel time.

RainSafeRoute adds a safety perspective by considering rainfall, flood hotspots and community reports while evaluating available routes.

---

## 🚀 How RainSafeRoute Works

### Step 1 — Enter Your Journey

Users enter:

- Source
- Destination
- Vehicle type

Supported vehicle modes include:

- 🚗 Car
- 🏍️ Bike
- 🚚 Truck
- 🚑 Emergency Vehicle
- 🚒 Fire & Rescue
- 🏫 School Bus
- 📦 Delivery

### Step 2 — Generate Real Road Routes

RainSafeRoute uses real road network data to generate alternative routes between the selected locations.

The application uses **OSRM** for road routing and **Nominatim** for location search and geocoding.

### Step 3 — Evaluate Flood Risk

Each route is evaluated using multiple factors:

- Current rainfall
- Distance from known flood hotspots
- Nearby community waterlogging reports
- Vehicle-specific safety requirements

### Step 4 — Compare Routes

Routes are categorized as:

🟢 **Safest Route**

🔴 **Fastest / Higher Risk Route**

⚫ **Alternative Route**

The interface displays route distance, ETA, flood risk and safety score.

### Step 5 — Make a Safer Decision

The user can compare the available routes and choose the option that best balances travel time and safety.

---

## 🧠 Route Risk Analysis

RainSafeRoute calculates a flood-risk score for each route.

The risk engine considers:

### 🌧️ Rainfall Factor

Higher rainfall intensity increases the potential flood risk.

### ⚠️ Flood Hotspot Proximity

Routes passing close to known flood-prone locations receive a higher risk score.

### 📢 Community Reports

Recent community waterlogging reports near a route contribute to its risk assessment.

### 🚗 Vehicle Profile

Different vehicles receive different safety priorities.

For example:

- Bikes are given stricter waterlogging avoidance.
- School buses use stricter safety thresholds.
- Emergency vehicles prioritize speed while still avoiding extreme-risk roads.
- Delivery vehicles balance ETA and safety.

The final result produces:

- Flood Risk %
- Safety Score / 100
- Nearest Flood Hotspot
- Number of nearby reports
- Route classification

---

# ✨ Key Features

## 1. 🗺️ Flood-Aware Navigation

- Source and destination search
- Real road routing
- Multiple route alternatives
- Route comparison
- Distance and ETA
- Safest route identification
- Fastest route identification
- Flood-risk scoring

---

## 2. 🌧️ Live Rainfall

The application retrieves current rainfall and temperature information using the Open-Meteo API.

Users can view:

- Current rainfall
- Rainfall intensity
- Temperature
- Weather condition
- Last updated time
- Rainfall trend

A rainfall heatmap can also be displayed on the map.

---

## 3. 📍 Flood Hotspots

The map displays known flood-prone locations using severity levels such as:

- Moderate
- High
- Extreme

Examples include:

- Minto Bridge Underpass
- ITO Crossing
- Pul Prahladpur Underpass
- Zakhira Underpass
- Moolchand Underpass
- Okhla Underpass

---

## 4. 📢 Community Waterlogging Reports

Users can report waterlogging incidents by providing:

- Location
- Waterlogging severity
- Description
- Optional photo
- Optional video

Reports can be filtered by:

- All
- Recent
- Severe
- Verified
- My Reports

Reports also have a simple verification/progress workflow.

---

## 5. 🗣️ Community Forum

The built-in community forum allows users to:

- Start discussions
- Mention a locality
- Share current road conditions
- Search discussions
- Sort discussions by popularity or newest posts

This helps users share local information that may change faster than traditional datasets.

---

## 6. 🛡️ Travel Safety

The Safety section provides practical monsoon travel precautions, including:

- Checking rainfall intensity before travelling
- Avoiding flooded underpasses
- Avoiding roads with unknown water depth
- Keeping phones charged
- Carrying emergency supplies
- Maintaining safe braking distance
- Avoiding moving water
- Following traffic and local authority instructions

---

## 7. 🚨 Emergency Support

RainSafeRoute provides Indian emergency helpline information, including:

- 112 — Unified Emergency
- 108 — Ambulance
- 101 — Fire
- 100 — Police
- 1098 — Child Helpline
- 181 — Women Helpline

The application also displays nearby medical assistance on the map.

> Emergency information should always be verified with the appropriate official service for the user's location.

---

## 8. 📊 Analytics Dashboard

The Analytics section provides visual insights including:

- Total routes analysed
- Safe routes
- High-risk routes
- Active waterlogging reports
- Flood hotspots tracked
- Average rainfall
- Route risk distribution
- Rainfall trends
- Community reports over time
- Safe vs risky routes
- Flood hotspot severity distribution

Users can view analytics for:

- Last 7 days
- Last 14 days
- Last 30 days

---

## 9. 🔐 User & Admin Modes

RainSafeRoute includes:

- User login
- Admin login
- CAPTCHA security check
- Session-based interface
- Admin monitoring dashboard
- Community report moderation interface

The admin interface allows monitoring of:

- Active users
- Routes calculated
- Reports received
- Verified reports
- Forum discussions
- High-risk areas
- Current rainfall

---

## 10. 🌐 Hindi & English

The interface supports:

🇬🇧 English

🇮🇳 Hindi

Users can switch the application language from the navigation bar.

---

## 11. 🌙 Dark & Light Experience

The application supports theme switching for a more comfortable user experience.

---

## 12. ❓ Built-in FAQ

The application includes a Frequently Asked Questions section containing the project's FAQ document.

Users can read the FAQ directly inside the application or open it in a new browser tab.

---

# 🛠️ Technology Stack

| Category | Technology |
|---|---|
| Frontend | HTML5, CSS3, JavaScript |
| Maps | Leaflet.js |
| Map Data | OpenStreetMap |
| Routing | OSRM |
| Geocoding | Nominatim |
| Weather | Open-Meteo |
| Map Heatmap | Leaflet.heat |
| Storage | Browser LocalStorage |
| Deployment | Vercel |

---

# 🧩 Application Architecture

```text
                    ┌─────────────────────────┐
                    │      RainSafeRoute       │
                    │      Web Application     │
                    └────────────┬────────────┘
                                 │
                 ┌───────────────┼────────────────┐
                 │               │                │
                 ▼               ▼                ▼
          ┌─────────────┐ ┌─────────────┐ ┌──────────────┐
          │   Leaflet   │ │    Route    │ │   Weather    │
          │     Map     │ │    Engine   │ │     Data     │
          └──────┬──────┘ └──────┬──────┘ └──────┬───────┘
                 │               │                │
                 ▼               ▼                ▼
          OpenStreetMap        OSRM          Open-Meteo
                 │
                 ▼
             Nominatim
             Geocoding

                         │
                         ▼
                ┌──────────────────┐
                │  Flood Risk      │
                │  Engine          │
                │                  │
                │ Rainfall         │
                │ Hotspots         │
                │ Community Reports│
                │ Vehicle Profile  │
                └────────┬─────────┘
                         │
                         ▼
               ┌────────────────────┐
               │ Route Risk & Safety│
               │      Scores        │
               └────────────────────┘

```
# 📊 Data Flow
```
User enters Source + Destination
              │
              ▼
        Nominatim Search
              │
              ▼
       Coordinates obtained
              │
              ▼
        OSRM Route Engine
              │
              ▼
      Multiple road routes
              │
              ▼
 ┌──────────────────────────────┐
 │ Flood Risk Evaluation        │
 │                              │
 │ • Rainfall                   │
 │ • Flood hotspot proximity    │
 │ • Community reports          │
 │ • Vehicle profile            │
 └──────────────┬───────────────┘
                │
                ▼
        Risk + Safety Scores
                │
                ▼
      Route Comparison UI
                │
                ▼
       Safest Route Suggested
```
## ⚙️ Getting Started

### Prerequisites

You need:

- Node.js
- npm
- A modern web browser
- Internet connection

### Installation

Clone the repository:

```bash
git clone https://github.com/Dare-TechieZ/safepath-rainy-days.git
```

Move into the project directory:

```bash
cd safepath-rainy-days
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

---

## 🌐 External Services

RainSafeRoute uses publicly accessible services for its core functionality:

### OpenStreetMap

Provides map tiles and geographic map data.

### Nominatim

Used for location search and geocoding.

### OSRM

Used to calculate routes over real road networks.

### Open-Meteo

Provides current rainfall, temperature, and precipitation information.

> These services may have usage limits or availability restrictions.

---

## 💾 Data & Privacy

The current prototype stores application state and session information in the browser using `localStorage`.

This means that community reports, forum activity, and some analytics data are currently associated with the local browser rather than being stored in a centralized production database.

The project is therefore intended as a functional prototype/demo rather than a production-grade emergency navigation service.

---

## 🔮 Future Scope

### 1. Government Flood Sensor Integration

Integrate live government and municipal flood sensors for real-time water-level information.

### 2. Live Traffic Integration

Add real-time traffic congestion data to improve route selection.

### 3. Push Notifications

Send alerts about:

- Heavy rainfall
- Waterlogging
- Flood-risk changes
- Route changes

### 4. Offline Emergency Navigation

Provide essential navigation and emergency information when internet connectivity is unavailable.

### 5. Mobile Applications

Develop dedicated Android and iOS applications.

### 6. Municipal Integration

Integrate with municipal flood-control and disaster-management systems.

### 7. Historical Monsoon Analytics

Use historical rainfall and flood data to identify recurring high-risk zones.

### 8. Expansion to More Indian Cities

Extend flood-aware routing beyond Delhi NCR to other Indian cities affected by monsoon flooding.
