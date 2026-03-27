## Earthquake Live

Earthquake Live is an Expo + React Native app that tracks and visualizes real-time earthquakes using the USGS Earthquake Catalog API.

### What this project uses

- **Runtime**: Expo (React Native)
- **Language**: TypeScript
- **Package manager**: pnpm

### Requirements

- **Node.js** (LTS recommended)
- **pnpm** installed globally:

```bash
npm install -g pnpm
```

### Setup

- **Install dependencies**

```bash
pnpm install
```

- **Run the app**

```bash
pnpm start
```

### Available scripts

- **pnpm start**: Start the Expo development server.
- **pnpm android**: Run the app on an Android device or emulator.
- **pnpm ios**: Run the app on an iOS simulator (macOS only).
- **pnpm web**: Run the app in a web browser.
- **pnpm format**: Format the codebase with Prettier.
- **pnpm format:check**: Check formatting without writing changes.

### Build Commands

To build the application for Android using EAS (Expo Application Services), use the following commands:

- **Build an AAB (Android App Bundle) for production release / Google Play Console:**
  ```bash
  eas build --platform android --profile production
  ```

- **Build an APK for direct installation onto an Android device or emulator:**
  ```bash
  eas build --profile apk --platform android
  ```
