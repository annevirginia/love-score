# Forever Us ❤️ — Premium Romantic Multiplayer Couple Game

A luxurious, interactive romantic multiplayer game where couples can connect **from different mobile phones anywhere in the world** or play together on a single device. Discover your compatibility inside a **large, glowing red animated heart ❤️**, unlock personalized romantic Love Letters, reveal secret Love Notes, track your relationship milestones on the Memory Wall, and share beautiful certificates directly to WhatsApp!

---

## 💕 Key Features

### 1. 💍 Unified Single 20-Question Master Module
- **No More Disconnected Modes**: Replaced the 6 separate modules with one grand, comprehensive 20-question couple experience.
- **5 Diverse Question Formats**:
  - 🌹 **Romantic Scenarios**: Richly detailed choices covering dream moments, home aesthetics, and future visions.
  - ⚡ **This or That**: Rapid romantic dilemmas (e.g., Fancy rooftop cocktails vs Cozy movie & blanket cuddle).
  - ⭐ **1–5 Love Scales**: Clickable heart ratings evaluating destiny, intimacy priority, and playful silliness.
  - 🎭 **Who is More Likely to...**: Nominating Partner 1, Partner 2, or "Both of us equally! 💕".
  - 🥰 **Empathy & Perspective**: Predicting each other's emotional comfort cravings and habits.
- **5 Core Relationship Dimensions**:
  - 💖 Romantic Passion & Chemistry
  - 🥰 Emotional Intimacy & Empathy
  - 😂 Playful Connection & Humor
  - 🌹 Future Vision & Life Goals
  - ✨ Daily Devotion & Couple Rhythm

### 2. 💌 Secret Partner Passage & Suggestions Box
- **Heartfelt Partner Suggestions**: Each partner writes a private message, sweet date ideas, relationship suggestions, or habits to start together.
- **Inspiration Starters & Theme Tags**: Choose from tags like *🌹 Romantic Wish*, *🍯 Sweet Habit*, *✨ Dream Date Idea*, *🫂 Comfort & Care Tip*, or tap quick romantic starters.
- **Interactive Wax-Sealed Envelope Reveal**:
  - Passages remain secretly sealed until both partners have completed the quiz.
  - Interactive wax seal button with animated break & celebration chimes.
  - Luxury gold-foil stationery card displaying partner words, date stamp, and theme pill.
  - Easy toggle between "{name1}'s suggestions for {name2}" and "{name2}'s suggestions for {name1}".
  - One-tap copying, WhatsApp sharing, and preservation in the Relationship Memory Wall.

### 3. 🌟 AI Couple Coach & Growth Insights
- **Couple Superpower**: Dynamically identifies your partnership's core strength (e.g. *Telepathic Emotional Resonance* or *Soulmate Synchronicity*).
- **Tailored Date Night Idea**: Generates a custom date night plan matching your specific answers.
- **Intimacy & Love Language Advice**: Practical couple advice based on your stress and devotion answers.
- **Weekend Couple Challenge**: A fun, tangible challenge for the coming weekend.

### 4. 🎭 "Where We Matched vs Differed" 20-Question Explorer
- Interactive accordion view comparing both partners' answers for all 20 questions side-by-side.
- Filters for *✨ 100% Perfect Matches* and *💘 Distinct Perspectives*.

### 5. ❤️ Smart Love Score System
- **Intelligent Compatibility Engine**: Compares both partners' choices across all 20 questions to measure emotional harmony.
- **Glowing Red Liquid Heart**: Final score animates inside a glowing crimson liquid heart (`#FF0844`) with pulsing rose-purple auras.
- **5 Result Tiers**:
  - `90–100%`: **Soulmate Connection 💍**
  - `75–89%`: **Perfect Love Birds 💕**
  - `50–74%`: **Growing Together 🌷**
  - `25–49%`: **Opposites Attract 💘**
  - `0–24%`: **Mystery Love Story 💫**

### 6. 📱 Real-Time Multiplayer & Same-Phone Modes
- **2 Different Phones (Multiplayer)**: Real-time room synchronization with live progress tracker and simultaneous passage reveal.
- **1 Device (Pass the Phone)**: Smooth handoff with "No Peeking" privacy screen and passage entry before the big reveal.
- **Downloadable Keepsake Certificate**: PNG certificate featuring couple avatars, score, and your partner's sweet suggestions excerpt.

---

## 🏗️ Project Architecture

```
love-score/
├── frontend/                       # Next.js 16 (App Router + Turbopack)
│   ├── app/
│   │   ├── page.jsx                # "Forever Us ❤️" Home & 6 Game Modes
│   │   ├── multiplayer/page.jsx    # Real-time 2-phone multiplayer room
│   │   ├── profile/page.jsx        # Couple Profile, Anniversary & Memory Wall
│   │   ├── quiz/page.jsx           # Single-device 2-player pass-the-phone mode
│   │   └── result/page.jsx         # Single-device results & certificates
│   ├── components/
│   │   ├── ScoreHeart.jsx          # Large glowing red liquid heart meter
│   │   ├── HeartsJoiningLoader.jsx # Two hearts joining loading animation
│   │   ├── LoveLetterModal.jsx     # Love letter & surprise note modal
│   │   ├── QuestionCard.jsx        # Interactive question card with 3D feel
│   │   ├── HeartProgress.jsx       # Animated heart progress bar
│   │   ├── ConfettiHearts.jsx      # Canvas celebratory confetti
│   │   ├── CategoryBreakdown.jsx   # Alignment breakdown bars
│   │   └── Navbar.jsx              # Header, audio mute toggle & theme
│   ├── lib/
│   │   ├── gameEngine.js           # 6 game modes, smart scoring, letters & notes
│   │   ├── profileStorage.js       # Profile, anniversary, history & badges
│   │   ├── multiplayer.js          # Dual sync (Firebase + FastAPI WebSocket)
│   │   ├── firebase.js             # Firebase Realtime Database SDK client
│   │   └── audio.js                # Web Audio API chime synthesizer
│   ├── data/
│   │   └── questions.json          # 30+ brand-new creative questions
│   └── styles/
│       └── globals.css             # Red, pink, purple & rose-gold theme
├── backend/                        # Python FastAPI Backend
│   ├── main.py                     # WebSocket & REST multiplayer endpoints
│   ├── scoring.py                  # Server-side 5-tier scoring algorithm
│   ├── sheets.py                   # Google Sheets logging & local fallback
│   └── requirements.txt            # Python dependencies
├── database.rules.json             # Firebase Realtime Database Security Rules
├── firestore.rules                 # Cloud Firestore Security Rules
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ (tested on Node.js 24)
- Python 3.10+ (tested on Python 3.12)

### 1. Start the Backend Server
```bash
cd backend
# Create virtual environment if needed:
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt

# Start FastAPI Uvicorn server:
python -m uvicorn main:app --port 8000
```
Backend will be live at `http://localhost:8000` (Health check: `http://localhost:8000/api/health`).

### 2. Start the Frontend Web App
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser to experience **"Forever Us ❤️"**.

---

## 🔐 Firebase Setup & Security Rules

The application works instantly out-of-the-box using the local FastAPI WebSocket synchronization engine. To enable **serverless global multiplayer across different phones without running your own server**, connect Firebase Realtime Database:

### Step 1: Create a Firebase Project
1. Visit the [Firebase Console](https://console.firebase.google.com/) and create a project (e.g. `forever-us-game`).
2. Add a **Web App** (`</>`) to obtain your Firebase credentials.
3. In the Firebase console sidebar, navigate to **Build > Realtime Database** and click **Create Database**.

### Step 2: Configure Environment Variables
In `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=forever-us-game.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://forever-us-game-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=forever-us-game
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=forever-us-game.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### Step 3: Deploy Security Rules
In Firebase Console > Realtime Database > **Rules**, paste the rules from [`database.rules.json`](./database.rules.json):
```json
{
  "rules": {
    "love_rooms": {
      "$roomId": {
        ".read": true,
        ".write": true,
        ".validate": "newData.hasChildren(['code', 'status'])",
        "code": {
          ".validate": "newData.isString() && newData.val().length >= 4 && newData.val().length <= 12"
        },
        "mode": {
          ".validate": "newData.isString()"
        },
        "status": {
          ".validate": "newData.val() === 'waiting' || newData.val() === 'ready' || newData.val() === 'completed'"
        }
      }
    }
  }
}
```

---

## 📱 Playing on Different Phones via Local Wi-Fi
If you want to test from two physical phones on the same Wi-Fi network:
1. Find your computer's local IP address (run `ipconfig` in terminal, e.g. `192.168.1.15`).
2. Run Next.js with host flag:
   ```bash
   cd frontend
   npm run dev -- -H 0.0.0.0
   ```
3. Open `http://<your-computer-ip>:3000` on both phones!

---

## 💖 Made with Passion for Couples Everywhere
Enjoy creating unforgettable romantic memories with **Forever Us ❤️**!
