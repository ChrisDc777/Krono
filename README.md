# ⏳ Krono - Competitive Programming Tracker

**Krono** is a beautiful, modern mobile application designed for competitive programmers. It helps you track upcoming contests across multiple platforms, sync your profile stats, and never miss a round with smart reminders.

Built with **React Native (Expo)** and **Material Design 3**.

---

## ✨ Features

- **🏆 Contest Tracking**: View upcoming contests from Codeforces, LeetCode, AtCoder, CodeChef, and more.
- **📊 Profile Sync**: Connect your profiles to see your live ratings, ranks, and problem solved counts.
- **🔔 Smart Notifications**: Get reminders 15 minutes or 1 hour before a contest starts.
- **🎨 Modern UI**: A sleek, "Neobrutalism meets Material You" aesthetic with Dark/Light mode support.
- **⚡ Background Sync**: Keeps your contest schedule updated even when you're away.

---

## 📱 Screenshots

|                     **Dashboard**                     |                 **Profile Stats**                 |                **Settings & Theme**                 |
| :---------------------------------------------------: | :-----------------------------------------------: | :-------------------------------------------------: |
| ![Dashboard](assets/images/dashboard_placeholder.png) | ![Profile](assets/images/profile_placeholder.png) | ![Settings](assets/images/settings_placeholder.png) |
|                 _Clean schedule view_                 |               _Detailed user stats_               |                _Highly customizable_                |

_(Place screenshots in `assets/images/` with the names above)_

---

## 🛠️ Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) with [Expo SDK 52](https://expo.dev/)
- **UI System**: [React Native Paper](https://callstack.github.io/react-native-paper/) (Material Design 3)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/)
- **Storage**: AsyncStorage
- **Icons**: Material Community Icons

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- iOS Simulator or Android Emulator (or physical device with Expo Go)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/krono.git
   cd krono
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the app**

   ```bash
   npm start
   ```

4. **Run on device**
   - Press `a` for Android Emulator
   - Press `i` for iOS Simulator
   - Scan the QR code with Expo Go on your phone

---

## 📝 Configuration

You can customize app behavior in `src/utils/constants.ts` or through the in-app **Settings** screen:

- Toggle Dark/Light mode
- Enable/Disable background sync
- Manage notification intervals

---

Made with ❤️ by Meet
