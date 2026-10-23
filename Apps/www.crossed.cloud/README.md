"# Crossed Web Backend

PHP-based web application providing authentication and profile management for the Crossed mobile app. Handles Google OAuth integration and serves as the API backend for user data.

## Features

- Google OAuth 2.0 authentication
- User profile storage and retrieval
- RESTful API for mobile app communication
- Session management
- CORS support for cross-origin requests

## Prerequisites

- PHP 7.0 or higher
- Composer (PHP dependency manager)
- MySQL database
- Google Cloud Console account
- Web server (Apache/Nginx) with PHP support

## Installation

1. **Install PHP dependencies**:
   ```bash
   composer install
   ```

2. **Set up Google OAuth**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable the Google+ API
   - Create OAuth 2.0 credentials
   - Download the `client_secrets.json` file and place it in the root directory
   - Add authorized redirect URIs:
     - `https://yourdomain.com/oauth2callback.php`
     - `http://localhost/oauth2callback.php` (for development)

3. **Configure database**:
   - Create a MySQL database named `apidb`
   - Import the schema from `../cloud.crossed/api/api.sql`
   - Update database connection in `api/api.php`:
     ```php
     $con = mysqli_connect("localhost","username","password","apidb");
     ```

4. **Set up web server**:
   - Ensure `mod_rewrite` is enabled (for Apache)
   - Configure document root to point to this directory
   - Set up SSL certificate for production

## Configuration

### OAuth Scopes
The app requests the following Google OAuth scopes:
- `https://www.googleapis.com/auth/userinfo.profile`
- `https://www.googleapis.com/auth/userinfo.email`

### Profile Storage
User profiles are stored as JSON files in the `core/prof/` directory:
```
{
  "name": "User Name",
  "picture": "https://profile-picture-url"
}
```

## API Endpoints

See the main project README for detailed API documentation.

## File Structure

- `index.php`: Main entry point with OAuth flow
- `oauth2callback.php`: OAuth callback handler
- `api/api.php`: REST API endpoints
- `core/prof/`: User profile storage
- `vendor/`: Composer dependencies
- `client_secrets.json`: Google OAuth credentials

## Development

### Local Development
1. Set up a local web server (e.g., MAMP, XAMPP, or built-in PHP server)
2. Update redirect URIs in Google Console to include localhost
3. Access the app at `http://localhost`

### Testing API
Use tools like Postman or curl to test API endpoints:
```bash
curl -X POST -d "getpeer=1&id=user123" http://localhost/api/api.php
```

## Security Considerations

- Store `client_secrets.json` outside web root in production
- Use HTTPS in production
- Validate all API inputs
- Implement rate limiting for API endpoints
- Regularly update PHP and dependencies

## Deployment

1. Upload files to web server
2. Configure database credentials
3. Set up Google OAuth credentials for production domain
4. Ensure proper file permissions for `core/prof/` directory
5. Test OAuth flow and API endpoints

## Troubleshooting

### OAuth Issues
- Verify `client_secrets.json` is correctly placed and formatted
- Check redirect URIs in Google Console
- Ensure HTTPS is used in production

### Database Connection
- Confirm MySQL server is running
- Check database credentials
- Verify database and table exist

### File Permissions
- `core/prof/` directory needs write permissions for PHP
- Check web server user permissions" 
