# Acumen Logic Website Backend

Backend server for the Acumen Logic website that handles diagnostic assessment leads and results.

## Features

- **POST /api/lead** - Receives diagnostic assessment results from the frontend
- **GET /api/leads** - Retrieves stored leads (with optional filtering and pagination)
- **GET /api/stats** - Returns summary statistics
- **GET /api/health** - Health check endpoint

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Edit `.env` to configure your settings (optional)

4. Start the server:
```bash
npm start
```

For development:
```bash
npm run dev
```

## API Endpoints

### POST /api/lead

Submit a diagnostic assessment result.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "firm": "Deloitte",
  "termsAccepted": true,
  "roadmapOptIn": true,
  "scores": {
    "numerical": { "correct": 5, "total": 7 },
    "data": { "correct": 6, "total": 7 },
    "logical": { "correct": 4, "total": 6 },
    "overall": { "correct": 15, "total": 20 }
  },
  "answers": { "1": 0, "2": 1, ... },
  "timeRemaining": 120,
  "timestamp": "2024-01-01T12:00:00.000Z",
  "source": "https://acumenlogic.co.uk/diagnostic.html"
}
```

**Response:**
```json
{
  "success": true,
  "id": "abc123",
  "message": "Lead submitted successfully"
}
```

### GET /api/leads

Retrieve stored leads.

**Query Parameters:**
- `email` (optional) - Filter by email address
- `limit` (optional, default: 100) - Number of results to return
- `offset` (optional, default: 0) - Pagination offset

**Response:**
```json
{
  "count": 50,
  "total": 150,
  "limit": 100,
  "offset": 0,
  "leads": [...]
}
```

### GET /api/stats

Get summary statistics.

**Response:**
```json
{
  "total_leads": 150,
  "unique_emails": 120,
  "average_score": 65,
  "roadmap_opt_ins": 100,
  "firm_distribution": {
    "Deloitte": 30,
    "PwC": 25,
    ...
  }
}
```

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "version": "1.0.0",
  "service": "acumen-logic-website-backend"
}
```

## Data Storage

Data is stored as JSON files in the `data/` directory:
- `data/leads.json` - All diagnostic leads and results

## Rate Limiting

Rate limiting is implemented to prevent abuse:
- Maximum 10 requests per minute per IP address
- Returns 429 status code when limit exceeded

## CORS

CORS is enabled for the following origins by default:
- `http://localhost:3000`
- `http://localhost:5500`
- `https://acumenlogic.co.uk`
- `https://www.acumenlogic.co.uk`

Configure additional origins via the `ALLOWED_ORIGINS` environment variable.

## Deployment

The server can be deployed to any Node.js hosting platform:
- Railway
- Render
- Heroku
- VPS (PM2 recommended)

Set the `PORT` environment variable on your hosting platform.
