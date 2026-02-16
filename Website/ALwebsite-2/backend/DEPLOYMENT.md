# Deployment Guide

## Overview

The backend server handles diagnostic assessment leads from the Acumen Logic website. It runs on port 3001 by default and stores data in JSON files.

## Deployment Options

### Option 1: Same Domain (Recommended)

Deploy the backend to the same domain as the frontend (e.g., `acumenlogic.co.uk`) using a reverse proxy:

**Nginx Configuration Example:**
```nginx
server {
    listen 80;
    server_name acumenlogic.co.uk;

    # Frontend static files
    location / {
        root /var/www/acumenlogic;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### Option 2: Separate Subdomain

Deploy backend to `api.acumenlogic.co.uk` and update frontend endpoint:

1. Update `LEAD_ENDPOINT` in `assets/js/diagnostic.js`:
```javascript
const LEAD_ENDPOINT = 'https://api.acumenlogic.co.uk/api/lead';
```

2. Add subdomain to CORS allowed origins in backend `.env`:
```
ALLOWED_ORIGINS=https://acumenlogic.co.uk,https://www.acumenlogic.co.uk
```

### Option 3: Platform-as-a-Service

Deploy to Railway, Render, or similar:

1. Connect your repository
2. Set environment variables:
   - `PORT` (usually auto-set by platform)
   - `ALLOWED_ORIGINS` (your frontend domain)
3. The platform will provide a URL like `https://your-app.railway.app`
4. Update frontend `LEAD_ENDPOINT` to use the platform URL

## Environment Variables

Create a `.env` file:

```bash
PORT=3001
ALLOWED_ORIGINS=https://acumenlogic.co.uk,https://www.acumenlogic.co.uk
```

## Production Checklist

- [ ] Set `ALLOWED_ORIGINS` to production domain(s)
- [ ] Ensure `data/` directory is writable
- [ ] Set up log rotation for production logs
- [ ] Configure process manager (PM2 recommended)
- [ ] Set up SSL/TLS certificates
- [ ] Configure backup for `data/leads.json`
- [ ] Set up monitoring/alerting

## PM2 Setup (Recommended for VPS)

```bash
# Install PM2
npm install -g pm2

# Start server
pm2 start server.js --name acumen-backend

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

## Data Backup

The `data/leads.json` file contains all diagnostic results. Set up regular backups:

```bash
# Example backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
cp data/leads.json backups/leads_${DATE}.json
```

## Monitoring

Check server health:
```bash
curl http://localhost:3001/api/health
```

View logs:
```bash
# PM2
pm2 logs acumen-backend

# Direct
tail -f logs/app.log
```

## Troubleshooting

### CORS Errors
- Verify `ALLOWED_ORIGINS` includes your frontend domain
- Check browser console for exact origin being blocked

### 429 Rate Limit Errors
- Normal behavior - client retries automatically
- Adjust `RATE_LIMIT_MAX` in server.js if needed

### Data Not Saving
- Check `data/` directory permissions
- Verify disk space available
- Check server logs for errors
