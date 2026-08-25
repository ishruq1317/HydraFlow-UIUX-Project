# 💧 HydraFlow — Adaptive Hydration Intelligence

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live%2024%2F7-black?logo=vercel&style=for-the-badge)](https://hydra-flow-uiux-project.vercel.app)
[![React](https://img.shields.io/badge/React-19.0-61dafb?logo=react&style=for-the-badge)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?logo=typescript&style=for-the-badge)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff?logo=vite&style=for-the-badge)](https://vitejs.dev/)
[![Weather API](https://img.shields.io/badge/Weather-Open--Meteo%20API-orange?style=for-the-badge)](https://open-meteo.com/)

> **HydraFlow** is an intelligent, real-world adaptive hydration platform that dynamically calculates medical-grade fluid and electrolyte targets based on **body biometrics**, **daily occupation & workout routine**, and **real-time ambient GPS weather**.

---

## 🌐 Live Web Application & Demonstration

| Resource | Link |
| :--- | :--- |
| 🚀 **Live 24/7 Web App (Vercel)** | [https://hydra-flow-uiux-project.vercel.app](https://hydra-flow-uiux-project.vercel.app) |
| 📱 **GitHub Pages Backup** | [https://ishruq1317.github.io/HydraFlow-UIUX-Project/](https://ishruq1317.github.io/HydraFlow-UIUX-Project/) |
| 🎥 **Demo Video** | [Watch Demo Video (Google Drive)](https://drive.google.com/file/d/1-eQ4JXZpHr4ltcvJ3L1T2TFHFHIazq5S/view?usp=drive_link) |
| 🎨 **Figma Prototype** | [View Figma Project](https://distort-salt-54882236.figma.site/) |

---

## ✨ Key Real-World Features

### 📍 1. Real Device GPS & Live Open-Meteo Weather
* Automatically requests device GPS coordinates to resolve your exact city (e.g. Dhaka, London, New York).
* Calls **Open-Meteo API** in real-time to fetch ambient temperature, humidity %, UV index, and weather condition codes.
* Dynamically recalculates physiological sweat rate and fluid compensation ($+X\%$ heat surge).

### 🔐 2. Secure User Authentication & Local Database
* **Sign Up / Sign In**: Supports full registration with username uniqueness checks and real-time password strength meter.
* **SHA-256 Encryption**: Encrypts credentials with Web Crypto API before storing in browser persistent storage.
* **In-App Password Manager**: Change your password anytime in the Profile settings.
* **1-Click Sample Account**: Instant shortcut for evaluators to test without typing.

### 💧 3. Interactive Water Logging & Glowing Progress Ring
* **1-Tap Quick Log**: Instant `+250 mL` (Glass) or `+500 mL` (Mug) logging.
* **Custom Beverage Drawer**: Choose Pure Water, Electrolyte Solution, or Herbal Tea.
* **Animated SVG Gauge**: Smooth circular progress arc with emerald green celebration badge on 100% daily goal achievement.

### 🍾 4. Connected Smart Bottle Interface
* **Take a Sip (-200 mL)**: Drops water level inside the animated bottle SVG and automatically logs fluid to your daily intake on the dashboard.
* **Refill Action**: Resets bottle capacity to 750 mL.
* **Bluetooth Sync**: Simulates sensor telemetry sync with verified drink history.

### 📅 5. In-App Plan Recalibration & Schedule Builder
* **Interactive Schedule Manager**: Toggle activities (Lecture, Gym, Commute, Evening Study) or add custom events with custom mL fluid needs.
* **Biometrics Editor**: Update weight (kg), height (cm), age, work style (Desk, Standing, Outdoor, Athlete), and workout minutes anytime without creating a new account.
* **Re-Run Setup Wizard**: Re-take the 5-step onboarding walkthrough anytime directly in settings.

### 📊 6. Predictive Forecast & Weekly Health Analytics
* **Hourly Demand Curves**: Compares recommended intake vs. environmental demand spikes.
* **Weather Scenario Simulator**: Switch between Live GPS, Heatwave (36°C), Mild (22°C), and Rain (18°C) to see targets adjust live.
* **Weekly Insights**: 7-day intake chart with dynamic today volume, goal consistency matrix, and active day streak tracker.

---

## 🛠️ Technology Stack

* **Frontend Framework**: React 19, TypeScript
* **Styling**: Tailwind CSS, Custom Glassmorphism UI, Responsive Mobile Frame Chassis
* **Build System**: Vite 6, pnpm
* **APIs**:
  * Browser Geolocation API (`navigator.geolocation`)
  * Open-Meteo Global Weather API
  * BigDataCloud Reverse Geocoding API
  * Web Crypto API (SubtleCrypto SHA-256)
* **Hosting**: Vercel Global Edge Network (24/7/365 Permanent Uptime)

---

## 🚀 Local Development Setup

To run the project locally on your machine:

```bash
# 1. Clone repository
git clone https://github.com/ishruq1317/HydraFlow-UIUX-Project.git
cd HydraFlow-UIUX-Project

# 2. Install dependencies
pnpm install

# 3. Start local development server
pnpm dev
```

Open `http://localhost:8443` in your browser.

---

## 👨‍💻 Author

**Hasin Ishruq** — [@ishruq1317](https://github.com/ishruq1317)
