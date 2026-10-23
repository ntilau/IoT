# Crossed

A social networking mobile application that enables users to discover and connect with nearby peers using Bluetooth Low Energy (BLE) technology. The app facilitates real-time messaging and peer management through a hybrid mobile app built with Cordova and a PHP backend for authentication and data storage.

## Project Structure

This repository contains two main components:

- **`cloud.crossed/`**: Cordova-based mobile application for iOS, Android, and browser platforms
- **`www.crossed.cloud/`**: PHP web application handling Google OAuth authentication and user profile management

## Features

- **Bluetooth Peer Discovery**: Uses BLE to detect and connect with nearby devices
- **Real-time Messaging**: Send and receive messages between connected peers
- **Google OAuth Integration**: Secure user authentication via Google accounts
- **Profile Management**: Store and retrieve user profiles with images
- **Cross-platform Support**: Runs on iOS, Android, and web browsers

## Architecture

### Mobile App (Cordova)

The mobile app is built using:
- **Framework**: Apache Cordova with Onsen UI for the interface
- **Plugins**:
  - `cordova-plugin-bluetoothle`: BLE communication
  - `cordova-plugin-background-mode-bluetooth-*`: Background BLE operations
  - `cordova-plugin-camera`: Photo capture
  - `cordova-plugin-uniquedeviceid`: Unique device identification
- **BLE Service**: Custom service UUID `76202B97-51E8-40BC-B6F7-B7D440935FFE` with characteristic `51001225-1CF0-475F-93DB-D61B38200898`

### Web Backend (PHP)

The web component handles:
- **Authentication**: Google OAuth 2.0 flow
- **Profile Storage**: JSON files stored in `core/prof/` directory
- **API**: RESTful endpoints for peer and message management

## Setup Instructions

### Prerequisites

- Node.js and npm
- Cordova CLI: `npm install -g cordova`
- PHP 7+ with Composer
- MySQL database
- Google Cloud Console project with OAuth credentials

### Mobile App Setup

1. **Clone and navigate**:
   ```bash
   cd cloud.crossed
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Add platforms**:
   ```bash
   cordova platform add ios
   cordova platform add android
   ```

4. **Configure API server**:
   Update the `server` variable in `www/js/index.js` to point to your API endpoint.

5. **Build the app**:
   ```bash
   cordova build ios
   cordova build android
   ```

6. **Run on device/emulator**:
   ```bash
   cordova run ios
   cordova run android
   ```

### Web App Setup

1. **Navigate to web directory**:
   ```bash
   cd www.crossed.cloud
   ```

2. **Install PHP dependencies**:
   ```bash
   composer install
   ```

3. **Configure Google OAuth**:
   - Create a project in Google Cloud Console
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Download `client_secrets.json` and place in the root directory
   - Update redirect URIs to match your domain

4. **Set up database**:
   - Create MySQL database named `apidb`
   - Import the schema from `cloud.crossed/api/api.sql`
   - Update database credentials in `api/api.php`

5. **Deploy to web server**:
   - Ensure PHP sessions are enabled
   - Configure CORS headers if needed
   - Set up SSL for production

## API Documentation

The mobile app communicates with the PHP backend via HTTP POST requests.

### Endpoints

All endpoints accept POST parameters and return JSON responses.

#### Get Peer Image
- **Endpoint**: `api.php`
- **Parameter**: `getpeer=1`, `id=<user_id>`
- **Response**: `{"image": "<image_url>"}`

#### Get User Status
- **Endpoint**: `api.php`
- **Parameter**: `getstatus=1`, `id=<user_id>`
- **Response**: `{"peers": [<peer_ids>], "msgs": [<messages>]}`

#### Add Peer Connection
- **Endpoint**: `api.php`
- **Parameters**: `mkpeer=1`, `fromid=<user_id>`, `toid=<peer_id>`
- **Response**: Updates peer lists for both users

#### Remove Peer Connection
- **Endpoint**: `api.php`
- **Parameters**: `rmpeer=1`, `fromid=<user_id>`, `toid=<peer_id>`
- **Response**: Removes peer connections and associated messages

#### Send Message
- **Endpoint**: `api.php`
- **Parameters**: `sendmsg=1`, `fromid=<user_id>`, `toid=<peer_id>`, `msg=<message_text>`
- **Response**: Adds message to recipient's message queue

#### Get Messages
- **Endpoint**: `api.php`
- **Parameters**: `getmsg=1`, `id=<user_id>`
- **Response**: `{"msgs": [<message_objects>]}`

### Database Schema

#### users table
- `id` (VARCHAR): Unique user identifier
- `image` (TEXT): Profile image URL
- `peers` (TEXT): JSON array of connected peer IDs
- `msgs` (TEXT): JSON array of pending messages

## Development

### Code Style
- JavaScript: Follow standard ES5 practices
- PHP: Use procedural style with mysqli
- HTML/CSS: Onsen UI components

### Testing
- Test BLE functionality on physical devices
- Verify OAuth flow in web browser
- Check API responses with tools like Postman

### Deployment
- Mobile: Submit to App Store and Google Play
- Web: Deploy to hosting service with PHP support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and test thoroughly
4. Submit a pull request

## License

[Specify license if applicable]

## Support

For issues and questions, please create an issue in this repository.</content>
<parameter name="filePath">README.md
