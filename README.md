# Krono ⏳

**Master your coding timeline.**

Krono is a comprehensive mobile application designed for competitive programmers to track their progress and stay updated with upcoming contests across multiple platforms.

![Krono Dashboard](https://via.placeholder.com/800x400?text=Krono+Dashboard+Preview)

## ✨ Features

- **Unified Dashboard**: View your profiles and stats from **Codeforces**, **LeetCode**, **CodeChef**, and **AtCoder** in one place.
- **Premium Timeline**: A sleek, vertical timeline view of all upcoming contests, ensuring you never miss a match.
- **Detailed Statistics**: Track your ratings, max ratings, ranks, and total problems solved.
- **Modern UI**: Built with a sophisticated "Premium Midnight" theme (Slate/Zinc & Indigo) featuring glassmorphism and smooth gradients.
- **Offline Support**: Caches contest and profile data for key information access without a network.
- **Synthetic Forecasting**: Automatically forecasts future contest dates for platforms with limited API schedules (e.g., AtCoder).

## 🛠️ Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) (SDK 50+)
- **Router**: [Expo Router](https://docs.expo.dev/router/introduction/) (v3)
- **Language**: TypeScript
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Database**: [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- **UI Components**: [React Native Paper](https://callstack.github.io/react-native-paper/)
- **Styling**: Standard StyleSheet + Expo Linear Gradient

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/krono.git
   cd krono
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   npx expo install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

4. **Run on device/simulator**
   - Press `a` for Android Emulator
   - Press `i` for iOS Simulator
   - Scan the QR code with the Expo Go app on your physical device.

## 📱 Platforms Supported

- **Codeforces**: Full profile stats & contest schedule.
- **LeetCode**: Contest rating, ranking, and solved count.
- **CodeChef**: Current rating, stars, and contests.
- **AtCoder**: Rating, history, and contest schedule (with auto-forecast).

## 📄 License

This project is licensed under the MIT License.
