# SLEEPZEN 🌙
> **A one-tap guided sleep and relaxation companion.**
> Built with React Native, Expo, and TypeScript for Android and cross-platform.

---

## 🌟 Executive Summary

SLEEPZEN transforms established relaxation techniques into a single, effortless bedtime routine.
- **One Question**: "How are you feeling right now?"
- **One Guided Journey**: 5, 10, or 20 minutes of gentle grounding, comfortable breath pacing, body scan or muscle relaxation, visualization, and quiet ambient tail.
- **Dark Screen**: Audio keeps playing with the screen locked or dimmed.

---

## ✨ Features

- **P0 One-Tap Session**: Start immediately from Home in 3 taps or fewer; no forced account creation or login wall.
- **4 Bedtime Mood Pathways**:
  1. *My brain won't stop thinking* (Grounding → 4-2-6 breathing → thought unloading → visualization → quiet tail)
  2. *I feel stressed or tense* (Comfortable breath → progressive muscle relaxation → sanctuary visualization → quiet tail)
  3. *My body feels restless* (Body scan → anchoring breath → non-straining muscle release → quiet tail)
  4. *I'm sleepy but can't fall asleep* (Low stimulation → minimal narration → soothing ambient loop)
- **3 Session Durations**: 5 min (quick), 10 min (recommended default), and 20 min (extended deep release).
- **Dual-Channel Audio Engine & Sound Mixer**:
  - Independent volume controls for gentle voice narration and organic ambient loops.
  - 4 High-fidelity soundscapes: **Gentle Rain**, **Moonlit Waves**, **Night Forest**, and **Soft Broadband (Pink Noise)**.
  - Smooth fade-out: Sleep timer gently fades volume down over the last 30 seconds rather than cutting off abruptly.
- **Bedside Night Comfort & Dim Mode**:
  - Pure midnight palette (`#080C16`, `#0F172A`, `#818CF8`) with high-contrast text and zero bright white flashes.
  - Interactive **Breathing Guide Orb** with smooth pacing and **Reduced Motion** accessibility mode.
  - One-tap **Screen Dimmer** that blacks out the display for completely dark bedrooms while audio continues.
- **Ethical Privacy & Honest Health Claims**:
  - Verbatim medical disclaimer and health notice per specification.
  - 100% on-device local storage with a "Delete My Data" reset button.
  - No fake sleep tracking or fabricated deep sleep percentages.
- **Standalone Sound Machine**:
  - Dedicated sound machine screen to play continuous ambient loops with customizable sleep timers (15m, 30m, 45m, 60m).

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v20)
- npm or yarn

### Installation
```bash
cd /home/sam/sleepzen
npm install
```

### Running on Android
To run on a connected Android phone or Android Virtual Device (AVD):
```bash
npm run android
```
Or scan the Expo QR code using the **Expo Go** app from Google Play Store.

### Running on Web Preview
```bash
npm run web
```
Or start the dev server:
```bash
npx expo start
```

### Verification & Testing
Run the complete session matrix verification and TypeScript typechecks:
```bash
npm test
npm run typecheck
```

---

## 📁 Project Architecture

```
sleepzen/
├── src/
│   ├── audio/
│   │   ├── AudioManager.ts        # Background audio mode, speech cues, dual volume
│   │   └── SoundSynthesizer.ts    # Web Audio synthesis for Rain, Waves, Forest, Pink Noise
│   ├── components/
│   │   ├── BreathingOrb.tsx       # Hypnotic breathing visualizer with reduced motion support
│   │   └── SoundMixerModal.tsx    # Bedside sound selector & dual-volume mixer
│   ├── context/
│   │   ├── AppContext.tsx         # Screen navigation, offline preferences, session history
│   │   └── AudioContext.tsx       # Playback state machine, timeline progress, sleep timer & fade
│   ├── data/
│   │   └── contentManifest.ts     # 4 moods, 4 ambient soundscapes, phase timelines
│   ├── screens/
│   │   ├── OnboardingScreen.tsx   # 3-step mindful introduction (< 3 taps to Home)
│   │   ├── HomeScreen.tsx         # Primary 'Start Sleep' button & mood selector chips
│   │   ├── PlayerScreen.tsx       # Guided player, phase stepper, breathing orb, dim mode
│   │   ├── FeedbackScreen.tsx     # One-question helpfulness rating & ambient continuation
│   │   ├── SoundMixerScreen.tsx   # Standalone sleep sound machine
│   │   ├── HistoryScreen.tsx      # Honest routine log (no fake sleep tracker scores)
│   │   └── SettingsScreen.tsx     # Health disclaimer, reminders, privacy data deletion
│   ├── theme/
│   │   └── colors.ts              # Midnight navy palette tokens
│   ├── types/
│   │   └── index.ts               # Complete TypeScript interface definitions
│   └── utils/
│       └── storage.ts             # AsyncStorage persistence wrapper
├── scripts/
│   └── verify-sessions.ts         # Automated test suite for session matrix
├── app.json                       # Android package & background audio configuration
└── package.json
```

---

## 📜 License
Apache-2.0
