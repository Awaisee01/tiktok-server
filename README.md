# TikTok Downloader API

A simple Node.js API for downloading TikTok videos.

## Features

- Download TikTok videos (with or without watermark)
- Support for TikTok image slideshows
- Simple REST API interface

## API Endpoints

### Health Check
```
GET /api/healthcheck
```

### Download TikTok Content
```
POST /api/download
```

**Request Body:**
```json
{
  "url": "https://www.tiktok.com/@username/video/1234567890123456789",
  "withWatermark": "false"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://v16-webapp-prime.tiktok.com/...",
    "id": "1234567890123456789",
    "isSlideshow": false
  }
}
```

## Installation

1. Install dependencies:
```
npm install
```

2. Build the project:
```
npm run build
```

3. Start the server:
```
npm start
```

## Environment Variables

- `PORT`: The port to run the server on (default: 5000)

## Deployment

This backend can be deployed to any Node.js hosting platform:

- Render
- Heroku
- Vercel
- AWS
- Digital Ocean

## Credits

Based on code by Naufal Taufiq Ridwan (https://github.com/n0l3r)