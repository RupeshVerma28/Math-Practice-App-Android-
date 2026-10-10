# MathSprint

An offline-first Expo Android app for multiplication tables, squares, cubes, mental-math lessons, and temporary practice sessions. It has no account, backend, analytics, ads, cloud sync, persistent storage, haptics, or vibration.

## Run it

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go on Android, or use `npm run android` with an Android emulator/device configured. All learning content and question generation run locally after installation.

## Checks

```bash
npm test
npx expo-doctor
npx expo export --platform android
```

## APK build

EAS needs an Expo account and network access:

```bash
npx eas-cli@latest login
npx eas-cli@latest build:configure
npx eas-cli@latest build --platform android --profile preview
```

The `preview` profile in `eas.json` creates an installable APK. When the build finishes, EAS prints the verified download page; download it there and install the APK on a compatible Android device.

## Project notes

- Session answers, score, streak, timer, and sound preference live in React state only and reset on app restart.
- Practice question ranges prevent negative subtraction results, divide-by-zero, and non-integer division.
- The optional 60-second mode is never enabled by default; ordinary practice has no time pressure.
