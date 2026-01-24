# MangaReader - React Native Demo App

A simple React Native application for learning mobile development on iOS and Android.

## Features

- Counter with increment/decrement functionality
- Text input with real-time greeting
- Dark mode support
- Cross-platform (iOS & Android)

## What You'll Learn

This demo app demonstrates:
- React Native basics
- State management with `useState`
- Styling with StyleSheet
- Platform-specific rendering
- User interactions (buttons, text inputs)
- Dark mode detection

## Prerequisites

Before you start, make sure you have the following installed:

### For Both Platforms
- **Node.js** (v18 or newer): [Download here](https://nodejs.org/)
- **Watchman** (recommended for macOS): `brew install watchman`

### For iOS Development (macOS only)
- **Xcode** (latest version from Mac App Store)
- **CocoaPods**: `sudo gem install cocoapods`

### For Android Development
- **Android Studio**: [Download here](https://developer.android.com/studio)
- **Java Development Kit (JDK)**: JDK 17 or newer

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. iOS Setup (macOS only)

Install iOS dependencies using CocoaPods:

```bash
cd ios
pod install
cd ..
```

### 3. Android Setup

Make sure you have Android Studio installed with:
- Android SDK
- Android SDK Platform
- Android Virtual Device (AVD)

## Running the App

### Option 1: Using React Native CLI

#### Run on Android:
```bash
npm run android
```

This will:
1. Start the Metro bundler
2. Build the Android app
3. Install it on your connected device or emulator

#### Run on iOS (macOS only):
```bash
npm run ios
```

This will:
1. Start the Metro bundler
2. Build the iOS app
3. Launch the iOS simulator

### Option 2: Manual Steps

#### Start Metro Bundler:
```bash
npm start
```

Then in another terminal:

**For Android:**
```bash
npm run android
```

**For iOS:**
```bash
npm run ios
```

## Testing on Different Devices

### Testing on Android

#### Using Android Emulator:
1. Open Android Studio
2. Go to **Tools > Device Manager**
3. Click **Create Device**
4. Select a device (e.g., Pixel 5)
5. Select a system image (e.g., Android 13)
6. Click **Finish**
7. Start the emulator
8. Run `npm run android`

#### Using Physical Android Device:
1. Enable **Developer Options** on your device:
   - Go to Settings > About Phone
   - Tap "Build Number" 7 times
2. Enable **USB Debugging** in Developer Options
3. Connect your device via USB
4. Run `adb devices` to verify connection
5. Run `npm run android`

### Testing on iOS (macOS only)

#### Using iOS Simulator:
```bash
npm run ios
```

Or specify a device:
```bash
npm run ios -- --simulator="iPhone 15 Pro"
```

#### Using Physical iOS Device:
1. Open `ios/MangaReader.xcworkspace` in Xcode
2. Select your device from the device dropdown
3. Click the Play button or press Cmd+R

## Troubleshooting

### Metro Bundler Issues
If you encounter issues, try resetting the cache:
```bash
npm start -- --reset-cache
```

### Android Build Failures
Clean the build:
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### iOS Build Failures
Clean and reinstall pods:
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
npm run ios
```

### Port Already in Use
If port 8081 is already in use:
```bash
npx react-native start --port 8082
```

## Project Structure

```
manga-reader-react-native-mobile/
├── App.tsx              # Main application component
├── index.js             # App entry point
├── package.json         # Dependencies and scripts
├── android/             # Android-specific code
├── ios/                 # iOS-specific code
└── README.md           # This file
```

## Next Steps

Now that you have a working React Native app, try:
1. Modifying the styles in `App.tsx`
2. Adding new components
3. Implementing navigation
4. Adding third-party libraries
5. Building your manga reader app!

## Resources

- [React Native Documentation](https://reactnative.dev/)
- [React Documentation](https://react.dev/)
- [Metro Bundler](https://facebook.github.io/metro/)

## License

This is a demo project for learning purposes.
