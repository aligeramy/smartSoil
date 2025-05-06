# SmartSoil - IoT Plant Monitoring App

![SmartSoil Logo](assets/images/logo/icon/icon.png)

## Overview

SmartSoil is a mobile application designed to connect with an ESP8266-based soil moisture sensor system to help users monitor and optimize plant care. The app provides real-time data on soil moisture, temperature, and humidity to ensure your plants receive the perfect amount of water and ideal growing conditions.

## Features

- **Real-time Sensor Data**: Monitor soil moisture, air temperature, and humidity levels directly from your IoT devices
- **Interactive Dashboard**: Easy-to-read visual displays of all key plant health metrics
- **Trend Analysis**: Track changes in growing conditions over time with historical data charts
- **Guided Setup**: Step-by-step tutorial to help you connect your ESP8266 soil monitoring hardware
- **Plant Care Guidance**: Recommendations based on soil moisture levels for various plant types

## Technical Requirements

- iOS 14.0 or higher
- Android 9.0 (API level 28) or higher
- ESP8266 hardware module with soil moisture, temperature, and humidity sensors

## Getting Started

1. **Hardware Setup**: Follow the in-app tutorial to set up your ESP8266 soil moisture monitoring device
2. **Connect to the Device**: Join the WiFi network created by your ESP module
3. **Access Data**: View real-time readings and historical trends on the dashboard

## For Developers

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/smartsoil.git

# Install dependencies
cd smartsoil
npm install

# Start the development server
npm start
```

### Building the App

```bash
# Build for Android
npx eas build --platform android --profile androidApk

# Build for iOS
npx eas build --platform ios --profile production
```

### Submitting to App Stores

```bash
# Submit to Google Play Store
npx eas submit --platform android --profile production

# Submit to Apple App Store
npx eas submit --platform ios --profile production
```

## App Store Submission Checklist

### Google Play Store

- [x] App Bundle (AAB) created with `npx eas build --platform android --profile androidAab`
- [ ] Privacy Policy URL added to app listing
- [ ] Data safety form completed
- [ ] App content rated
- [ ] Store listing details (description, screenshots, promo graphics)
- [ ] Contact information updated
- [ ] App signing configured

### Apple App Store

- [ ] App binary built with `npx eas build --platform ios --profile production`
- [ ] App Store Connect listing complete
- [ ] Privacy policy URL added
- [ ] App privacy details provided
- [ ] Screenshots for all required device sizes
- [ ] App Review Information supplied
- [ ] Export compliance documentation

## GDPR and Data Privacy Compliance

SmartSoil is designed with privacy in mind:

- No personal data is stored in the cloud
- Sensor data remains on the local device
- No tracking or analytics beyond basic app functionality
- No third-party data sharing
- User has full control to delete any stored information

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact support@smartsoil-app.com or visit our website at https://www.smartsoil-app.com/support

## Acknowledgments

- Built with React Native and Expo
- ESP8266 firmware based on Arduino
- Icons provided by Ionicons
