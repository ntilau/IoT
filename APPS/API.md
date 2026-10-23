# Crossed API Documentation

This document describes the REST API endpoints used by the Crossed mobile application for peer management, messaging, and profile operations.

## Base URL
The API is accessed via POST requests to `api.php` with form-encoded parameters.

## Authentication
Currently, no authentication is implemented. User IDs are passed as parameters.

## Endpoints

### Get Peer Image
Retrieves the profile image for a specific user.

**Parameters:**
- `getpeer` (required): Set to `1`
- `id` (required): User ID string

**Response:**
```json
{
  "image": "base64_encoded_image_data"
}
```

### Get User Status
Retrieves peer connections and pending message notifications for a user.

**Parameters:**
- `getstatus` (required): Set to `1`
- `id` (required): User ID string

**Response:**
```json
{
  "peers": ["peer_id_1", "peer_id_2"],
  "msgs": ["sender_id_1", "sender_id_2"]
}
```

### Add Peer Connection
Establishes a bidirectional peer connection between two users.

**Parameters:**
- `mkpeer` (required): Set to `1`
- `fromid` (required): Initiating user ID
- `toid` (required): Target user ID

**Response:**
Empty response. Updates peer lists for both users.

### Remove Peer Connection
Removes a bidirectional peer connection and associated messages.

**Parameters:**
- `rmpeer` (required): Set to `1`
- `fromid` (required): Initiating user ID
- `toid` (required): Target user ID

**Response:**
Empty response. Removes connections and deletes message history between users.

### Send Message
Sends a message from one user to another and returns the updated chat history.

**Parameters:**
- `sendmsg` (required): Set to `1`
- `fromid` (required): Sender user ID
- `toid` (required): Recipient user ID
- `msg` (required): Message text

**Response:**
Array of message objects representing the complete chat history:
```json
[
  {
    "fromid": "sender_id",
    "toid": "recipient_id",
    "msg": "message text",
    "datetime": "2023-01-01 12:00:00"
  }
]
```

### Get Messages
Retrieves chat history between two users and marks messages as read.

**Parameters:**
- `getmsg` (required): Set to `1`
- `fromid` (required): Current user ID
- `toid` (required): Chat partner user ID

**Response:**
Array of message objects:
```json
[
  {
    "fromid": "sender_id",
    "toid": "recipient_id",
    "msg": "message text",
    "datetime": "2023-01-01 12:00:00"
  }
]
```

### Get Profile
Retrieves or creates a user profile based on device ID.

**Parameters:**
- `getprf` (required): Set to `1`
- `device` (required): Unique device identifier

**Response:**
If profile exists:
```json
{
  "id": "user_id",
  "device": "device_id",
  "image": "profile_image",
  "peers": "[]",
  "msgs": "[]",
  "datetime": "2023-01-01 12:00:00"
}
```

If new profile created:
```json
{
  "id": "generated_user_id",
  "device": "device_id"
}
```

### Set Profile
Updates user profile information.

**Parameters:**
- `setprf` (required): Set to `1`
- `id` (required): User ID
- `device` (required): Device ID
- `image` (required): Base64 encoded image data

**Response:**
Updated user object:
```json
{
  "id": "user_id",
  "device": "device_id",
  "image": "updated_image_data",
  "peers": "[]",
  "msgs": "[]",
  "datetime": "2023-01-01 12:00:00"
}
```

### Remove Profile
Completely removes a user profile and all associated data.

**Parameters:**
- `rmprf` (required): Set to `1`
- `id` (required): User ID to remove

**Response:**
Empty response. Removes user from all peer lists, deletes all messages, and removes profile.

## Database Schema

### users table
| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR | Unique user identifier |
| device | VARCHAR | Unique device identifier |
| image | TEXT | Base64 encoded profile image |
| peers | TEXT | JSON array of connected peer IDs |
| msgs | TEXT | JSON array of users with pending messages |
| datetime | DATETIME | Last update timestamp |

### msgs table
| Column | Type | Description |
|--------|------|-------------|
| fromid | VARCHAR | Sender user ID |
| toid | VARCHAR | Recipient user ID |
| msg | TEXT | Message content |
| datetime | DATETIME | Message timestamp |

## Error Handling

The API does not have standardized error responses. Database connection failures will terminate with a PHP error. Invalid parameters may result in empty responses or unexpected behavior.

## Security Notes

- No input validation or sanitization
- No rate limiting
- No authentication
- SQL injection vulnerabilities present
- CORS allows all origins

**Warning:** This API is not production-ready and should not be exposed to untrusted networks without significant security improvements.