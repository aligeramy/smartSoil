# SmartSoil - IoT Plant Monitoring App

![SmartSoil Logo](assets/images/logo/icon/icon.png)

## Overview

SmartSoil is a mobile application designed to connect with an ESP8266-based soil moisture sensor system to help users monitor and optimize plant care. The app provides real-time data on soil moisture, temperature, and humidity to ensure your plants receive the perfect amount of water and ideal growing conditions.

## Features

- **Real-time Sensor Data**: Monitor soil moisture, air temperature, and humidity levels directly from your IoT devices
- **Interactive Dashboard**: Easy-to-read visual displays of all key plant health metrics
- **Trend Analysis**: Track changes in growing conditions over time with historical data charts
- **Guided Setup**: Step-by-step tutorial to help you connect your ESP8266 soil monitoring hardware
- **Plant Care Guidance**: Recommendations based on plant type and current conditions

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Setup

1. Clone the repository
   ```
   git clone https://github.com/yourusername/smart-soil.git
   cd smart-soil
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the Expo development server
   ```
   npm start
   ```

## App Icons Management

The SmartSoil app uses a consistent set of icons across iOS, Android, and web platforms. We've included scripts to help manage and generate these icons.

### Icon Requirements

- **iOS Icons**: Square icons with rounded corners (iOS applies rounding automatically)
  - Main App Store icon: 1024×1024px PNG without transparency
  - Various sizes generated automatically for different iOS devices

- **Android Icons**: 
  - Adaptive icons with foreground/background layers
  - Legacy square icons for older Android versions
  - Play Store icon: 512×512px

### Generating Icons

1. Place your source icon files in the correct locations:
   - Main app icon: `assets/images/logo/icon/icon.png`
   - Android adaptive foreground: `assets/images/logo/icon/adaptive-icon.png`

2. Run the icon generation script:
   ```
   npm run generate:icons
   ```

3. The script will generate all required icon sizes in the `assets/app-icons` directory

### Customizing Icons

- To change the background color of Android adaptive icons, modify the `BG_COLOR` variable in `scripts/build-icons.sh`
- To customize icon generation, you can edit the icon generation scripts:
  - Bash script (recommended): `scripts/build-icons.sh`
  - Node.js alternative: `scripts/generate-icons.js`

### Configuration

Icon paths are configured in `app.json`:

```json
{
  "expo": {
    "icon": "./assets/images/logo/icon/icon.png",
    "ios": {
      "icon": "./assets/images/logo/icon/icon.png"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/logo/icon/adaptive-icon.png",
        "backgroundColor": "#063B1D"
      }
    }
  }
}
```

## Deploying to Vercel

SmartSoil includes a web version that can be deployed to Vercel. Follow these steps to deploy the web app:

### Preparing for Deployment

1. Build the web version:
   ```
   npm run build:web
   ```

2. Fix font loading issues (important for icons):
   ```
   node scripts/fix-web-fonts.js
   ```

3. Deploy to Vercel with one of these commands:
   ```
   npm run deploy:web
   # or manually with
   vercel dist --prod
   ```

### Troubleshooting Web Deployment

If icons don't appear in your web app, ensure:

1. You've properly configured the icon fonts to preload in `app/_layout.tsx`
2. The webpack config properly handles font files (TTF)
3. The Vercel config has correct routes for static assets

## Building for Android and iOS

To build the app for Android or iOS, use the following commands:

### Android

```
# Development APK
npm run build:android-dev

# Release APK (Standard)
npm run build:android-apk

# Release APK (Optimized)
eas build --platform android --profile optimizedApk

# Release AAB for Play Store
npm run build:android-aab
```

### iOS

```
# Development Client
eas build --platform ios --profile development

# Production Build
eas build --platform ios --profile production
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Expo](https://expo.dev/) - The app framework
- [React Native](https://reactnative.dev/) - The mobile app platform
- [ESP8266 Community](https://github.com/esp8266/Arduino) - For IoT sensor support
