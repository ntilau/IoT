# Cross application... 
"# Cross Mobile App

Cordova-based mobile application for the Crossed social networking platform. This app enables users to discover nearby peers using Bluetooth Low Energy and exchange messages in real-time.

## Features

- Bluetooth Low Energy peer discovery
- Real-time messaging between connected devices
- Camera integration for profile photos
- Background Bluetooth operations
- Cross-platform support (iOS, Android, Browser)

## Prerequisites

- Node.js (v10+)
- Cordova CLI: `npm install -g cordova`
- Xcode (for iOS development)
- Android SDK (for Android development)

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Add platforms**:
   ```bash
   cordova platform add ios
   cordova platform add android
   cordova platform add browser
   ```

3. **Install plugins**:
   ```bash
   cordova plugin add cordova-plugin-bluetoothle
   cordova plugin add cordova-plugin-background-mode-bluetooth-central
   cordova plugin add cordova-plugin-background-mode-bluetooth-peripheral
   cordova plugin add cordova-plugin-camera
   cordova plugin add cordova-plugin-uniquedeviceid
   cordova plugin add cordova-plugin-splashscreen
   cordova plugin add cordova-plugin-whitelist
   ```

## Configuration

### API Server
Update the server URL in `www/js/index.js`:
```javascript
var server = "https://your-api-server.com/";
```

### Bluetooth Service
The app uses a custom BLE service:
- **Service UUID**: `76202B97-51E8-40BC-B6F7-B7D440935FFE`
- **Characteristic UUID**: `51001225-1CF0-475F-93DB-D61B38200898`

## Building

### iOS
```bash
cordova build ios
cordova run ios
```

### Android
```bash
cordova build android
cordova run android
```

### Browser (for testing)
```bash
cordova build browser
cordova run browser
```

## Project Structure

- `www/`: Web assets (HTML, CSS, JS)
  - `index.html`: Main app interface
  - `js/index.js`: Main application logic
  - `css/index.css`: Styles
- `plugins/`: Cordova plugins
- `platforms/`: Platform-specific code
- `res/`: Icons and splash screens
- `api/`: Server-side API files

## Development Notes

- The app uses Onsen UI for the mobile interface
- jQuery is included for DOM manipulation
- BLE operations require physical devices for testing
- Background modes allow BLE scanning when app is not active

## Troubleshooting

### iOS Issues
- Ensure Bluetooth permissions are granted
- Check background mode capabilities in Xcode

### Android Issues
- Verify AndroidManifest.xml permissions
- Test on physical device (BLE may not work in emulator)

### Common Problems
- BLE not working: Check device Bluetooth settings
- API calls failing: Verify server URL and network connectivity" 
