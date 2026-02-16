/**
 * ACUMEN LOGIC — Website Backend Server
 *
 * Express server that:
 *  1. Receives diagnostic leads via POST /api/lead
 *  2. Stores them as JSON files in /data
 *  3. Provides JSON API at GET /api/leads
 *  4. Basic rate limiting to prevent abuse
 *  5. CORS enabled for frontend domain
 *
 * No database required — pure JSON file storage.
 * DEPLOYMENT: Run with `npm start` on any Node.js host (Railway, Render, VPS)
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_DIR = path.join(__dirname, 'data');

// ─── Middleware ──────────────────────────────────────────────────────────────

// CORS — allow requests from the frontend domain
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:5500',
      'http://127.0.0.1:5500',
      'https://acumenlogic.co.uk',
      'https://www.acumenlogic.co.uk'
    ];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (server-to-server, Postman, etc.)
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.indexOf(origin) !== -1) return callback(null, true);
    callback(null, false);
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '500kb' }));

// Serve static files if needed
app.use(express.static(path.join(__dirname, 'public')));

// ─── Rate Limiting (simple in-memory) ───────────────────────────────────────

const rateLimitMap = {};
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // max 10 submissions per minute per IP

function rateLimit(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();

  if (!rateLimitMap[ip]) {
    rateLimitMap[ip] = [];
  }

  // Remove entries outside window
  rateLimitMap[ip] = rateLimitMap[ip].filter(function(ts) {
    return now - ts < RATE_LIMIT_WINDOW;
  });

  if (rateLimitMap[ip].length >= RATE_LIMIT_MAX) {
    return res.status(429).json({ 
      error: 'Too many requests. Please wait before submitting again.' 
    });
  }

  rateLimitMap[ip].push(now);
  next();
}

// Clean up rate limit map periodically
setInterval(function() {
  const now = Date.now();
  for (const ip in rateLimitMap) {
    rateLimitMap[ip] = rateLimitMap[ip].filter(function(ts) {
      return now - ts < RATE_LIMIT_WINDOW;
    });
    if (rateLimitMap[ip].length === 0) {
      delete rateLimitMap[ip];
    }
  }
}, 5 * 60 * 1000);

// ─── Helpers ────────────────────────────────────────────────────────────────

const LEADS_FILE = path.join(DATA_DIR, 'leads.json');

function readLeads() {
  try {
    if (!fs.existsSync(LEADS_FILE)) return [];
    const raw = fs.readFileSync(LEADS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading leads file:', err.message);
    return [];
  }
}

function writeLeads(data) {
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing leads file:', err.message);
    return false;
  }
}

// Sanitise string input
function sanitise(val, maxLen) {
  if (typeof val !== 'string') return '';
  return val.trim().substring(0, maxLen || 200);
}

// Validate email format
function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// ─── API: Health Check ──────────────────────────────────────────────────────

app.get('/api/health', function(req, res) {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(), 
    version: '1.0.0',
    service: 'acumen-logic-website-backend'
  });
});

// ─── API: Submit Lead ──────────────────────────────────────────────────────

app.post('/api/lead', rateLimit, function(req, res) {
  try {
    const body = req.body;

    // Validate required fields
    if (!body.name || !body.email) {
      return res.status(400).json({
        error: 'name and email are required fields'
      });
    }

    // Validate email format
    if (!isValidEmail(body.email)) {
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }

    // Validate terms acceptance
    if (!body.termsAccepted) {
      return res.status(400).json({
        error: 'termsAccepted must be true'
      });
    }

    // Validate scores structure
    if (!body.scores || typeof body.scores !== 'object') {
      return res.status(400).json({
        error: 'scores object is required'
      });
    }

    const scores = body.scores;
    if (typeof scores.numerical !== 'object' || 
        typeof scores.data !== 'object' || 
        typeof scores.logical !== 'object' ||
        typeof scores.overall !== 'object') {
      return res.status(400).json({
        error: 'scores must contain numerical, data, logical, and overall objects'
      });
    }

    // Build sanitised record
    const record = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 6),
      submitted_at: new Date().toISOString(),
      name: sanitise(body.name, 100),
      email: sanitise(body.email, 200).toLowerCase(),
      firm: sanitise(body.firm, 100) || null,
      termsAccepted: !!body.termsAccepted,
      roadmapOptIn: !!body.roadmapOptIn,
      scores: {
        numerical: {
          correct: parseInt(scores.numerical.correct) || 0,
          total: parseInt(scores.numerical.total) || 0
        },
        data: {
          correct: parseInt(scores.data.correct) || 0,
          total: parseInt(scores.data.total) || 0
        },
        logical: {
          correct: parseInt(scores.logical.correct) || 0,
          total: parseInt(scores.logical.total) || 0
        },
        overall: {
          correct: parseInt(scores.overall.correct) || 0,
          total: parseInt(scores.overall.total) || 0
        }
      },
      answers: body.answers || null,
      timeRemaining: typeof body.timeRemaining === 'number' ? body.timeRemaining : null,
      timestamp: body.timestamp || new Date().toISOString(),
      source: sanitise(body.source, 500) || null
    };

    // Calculate percentages
    if (record.scores.numerical.total > 0) {
      record.scores.numerical.percentage = Math.round(
        (record.scores.numerical.correct / record.scores.numerical.total) * 100
      );
    }
    if (record.scores.data.total > 0) {
      record.scores.data.percentage = Math.round(
        (record.scores.data.correct / record.scores.data.total) * 100
      );
    }
    if (record.scores.logical.total > 0) {
      record.scores.logical.percentage = Math.round(
        (record.scores.logical.correct / record.scores.logical.total) * 100
      );
    }
    if (record.scores.overall.total > 0) {
      record.scores.overall.percentage = Math.round(
        (record.scores.overall.correct / record.scores.overall.total) * 100
      );
    }

    // Read, append, write
    const existing = readLeads();
    existing.push(record);
    
    if (!writeLeads(existing)) {
      return res.status(500).json({ error: 'Failed to save lead data' });
    }

    console.log(
      '[%s] Saved lead for %s (%s) — Score: %d/%d (%d%%)',
      new Date().toISOString(),
      record.name,
      record.email,
      record.scores.overall.correct,
      record.scores.overall.total,
      record.scores.overall.percentage
    );

    res.status(201).json({ 
      success: true, 
      id: record.id,
      message: 'Lead submitted successfully'
    });

  } catch (err) {
    console.error('POST /api/lead error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── API: Get Leads ─────────────────────────────────────────────────────────

app.get('/api/leads', function(req, res) {
  try {
    const leads = readLeads();
    
    // Optional query parameters for filtering
    const email = req.query.email;
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    let filteredLeads = leads;

    // Filter by email if provided
    if (email) {
      filteredLeads = filteredLeads.filter(function(lead) {
        return lead.email && lead.email.toLowerCase() === email.toLowerCase();
      });
    }

    // Sort by submission date (newest first)
    filteredLeads.sort(function(a, b) {
      return new Date(b.submitted_at) - new Date(a.submitted_at);
    });

    // Apply pagination
    const paginatedLeads = filteredLeads.slice(offset, offset + limit);

    res.json({
      count: filteredLeads.length,
      total: leads.length,
      limit: limit,
      offset: offset,
      leads: paginatedLeads
    });

  } catch (err) {
    console.error('GET /api/leads error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── API: Get Stats Summary ────────────────────────────────────────────────

app.get('/api/stats', function(req, res) {
  try {
    const leads = readLeads();
    
    let totalLeads = leads.length;
    let uniqueEmails = {};
    let totalScoreSum = 0;
    let scoreCount = 0;
    let roadmapOptIns = 0;
    let firmCounts = {};

    leads.forEach(function(lead) {
      if (lead.email && lead.email !== 'not-provided') {
        uniqueEmails[lead.email] = true;
      }
      
      if (lead.scores && lead.scores.overall && lead.scores.overall.percentage !== undefined) {
        totalScoreSum += lead.scores.overall.percentage;
        scoreCount++;
      }
      
      if (lead.roadmapOptIn) {
        roadmapOptIns++;
      }
      
      if (lead.firm) {
        firmCounts[lead.firm] = (firmCounts[lead.firm] || 0) + 1;
      }
    });

    res.json({
      total_leads: totalLeads,
      unique_emails: Object.keys(uniqueEmails).length,
      average_score: scoreCount > 0 ? Math.round(totalScoreSum / scoreCount) : 0,
      roadmap_opt_ins: roadmapOptIns,
      firm_distribution: firmCounts
    });

  } catch (err) {
    console.error('GET /api/stats error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── 404 Handler ───────────────────────────────────────────────────────────

app.use(function(req, res) {
  res.status(404).json({ error: 'Not found' });
});

// ─── Error Handler ──────────────────────────────────────────────────────────

app.use(function(err, req, res, next) {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ─── Start ──────────────────────────────────────────────────────────────────

app.listen(PORT, function() {
  console.log('');
  console.log('  ✦ Acumen Logic Website Backend v1.0');
  console.log('  ✦ Running on http://localhost:' + PORT);
  console.log('  ✦ API: http://localhost:' + PORT + '/api/lead');
  console.log('  ✦ Health: http://localhost:' + PORT + '/api/health');
  console.log('  ✦ Data stored in: ' + DATA_DIR);
  console.log('');
});
