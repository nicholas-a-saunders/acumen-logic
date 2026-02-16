/**
 * ACUMEN LOGIC — Assessment Results Backend
 *
 * Express server that:
 *  1. Receives assessment results via POST /api/results
 *  2. Stores them as JSON files in /data (one file per assessment type)
 *  3. Serves an admin dashboard at GET /
 *  4. Provides JSON API at GET /api/results
 *  5. Exports CSV at GET /api/export/:type
 *  6. Basic rate limiting to prevent abuse
 *
 * Assessment types:
 *   diagnostic, practice-2-6, practice-3-7, practice-4-6, mock-1, mock-2
 *
 * No database required — pure JSON file storage.
 * DEPLOYMENT: Run with `npm start` on any Node.js host (Railway, Render, VPS)
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');

// ─── Middleware ──────────────────────────────────────────────────────────────

// CORS — allow requests from the frontend domain
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://acumenlogic.co.uk', 'https://www.acumenlogic.co.uk'];

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

// Serve the admin dashboard
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
    return res.status(429).json({ error: 'Too many requests. Please wait before submitting again.' });
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

const VALID_TYPES = {
  'diagnostic':   'diagnostic.json',
  'practice-2-6': 'practice-2-6.json',
  'practice-3-7': 'practice-3-7.json',
  'practice-4-6': 'practice-4-6.json',
  'mock-1':       'mock-1.json',
  'mock-2':       'mock-2.json'
};

function getFilePath(assessmentType) {
  const filename = VALID_TYPES[assessmentType];
  if (!filename) return null;
  return path.join(DATA_DIR, filename);
}

function readResults(filePath) {
  try {
    if (!fs.existsSync(filePath)) return [];
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading', filePath, err.message);
    return [];
  }
}

function writeResults(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// Sanitise string input
function sanitise(val, maxLen) {
  if (typeof val !== 'string') return '';
  return val.trim().substring(0, maxLen || 200);
}

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// ─── API: Health Check ──────────────────────────────────────────────────────

app.get('/api/health', function(req, res) {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '2.0.0' });
});

// ─── API: Submit Results ────────────────────────────────────────────────────

app.post('/api/results', rateLimit, function(req, res) {
  try {
    const body = req.body;

    // Validate assessment type
    if (!body.assessment_type || !VALID_TYPES[body.assessment_type]) {
      return res.status(400).json({
        error: 'Invalid assessment_type. Must be one of: ' + Object.keys(VALID_TYPES).join(', ')
      });
    }

    // Validate required score fields
    const scoreCorrect = parseInt(body.score_correct);
    const scoreTotal = parseInt(body.score_total);
    if (isNaN(scoreCorrect) || isNaN(scoreTotal) || scoreTotal <= 0) {
      return res.status(400).json({ error: 'Valid score_correct and score_total (> 0) are required.' });
    }

    // Validate score range
    if (scoreCorrect < 0 || scoreCorrect > scoreTotal) {
      return res.status(400).json({ error: 'score_correct must be between 0 and score_total.' });
    }

    // Build sanitised record
    const record = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 6),
      submitted_at: new Date().toISOString(),
      assessment_type: body.assessment_type,
      user_name: sanitise(body.user_name, 100) || 'Anonymous',
      user_email: sanitise(body.user_email, 200) || 'not-provided',
      score_correct: scoreCorrect,
      score_total: scoreTotal,
      score_percentage: Math.round((scoreCorrect / scoreTotal) * 100),
      score_wrong: parseInt(body.score_wrong) || 0,
      score_skipped: parseInt(body.score_skipped) || 0,
      section_breakdown: body.section_breakdown || null,
      answers: body.answers || null,
      time_taken_seconds: body.time_taken_seconds ? parseInt(body.time_taken_seconds) : null,
      performance_tier: sanitise(body.performance_tier, 20) || null,
      meta: body.meta || null
    };

    // Read, append, write
    const filePath = getFilePath(body.assessment_type);
    const existing = readResults(filePath);
    existing.push(record);
    writeResults(filePath, existing);

    console.log(
      '[%s] Saved %s result for %s — %d/%d (%d%%)',
      new Date().toISOString(),
      body.assessment_type,
      record.user_email,
      record.score_correct,
      record.score_total,
      record.score_percentage
    );

    res.status(201).json({ success: true, id: record.id });

  } catch (err) {
    console.error('POST /api/results error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── API: Get Results ───────────────────────────────────────────────────────

app.get('/api/results', function(req, res) {
  try {
    const type = req.query.type;

    if (type && VALID_TYPES[type]) {
      const filePath = getFilePath(type);
      const results = readResults(filePath);
      return res.json({ assessment_type: type, count: results.length, results: results });
    }

    // All assessment types
    const all = {};
    for (const typeName of Object.keys(VALID_TYPES)) {
      const filePath = path.join(DATA_DIR, VALID_TYPES[typeName]);
      const results = readResults(filePath);
      all[typeName] = { count: results.length, results: results };
    }

    res.json(all);

  } catch (err) {
    console.error('GET /api/results error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── API: Get Stats Summary ─────────────────────────────────────────────────

app.get('/api/stats', function(req, res) {
  try {
    let totalSubmissions = 0;
    let totalScoreSum = 0;
    const uniqueEmails = {};
    const typeCounts = {};

    for (const typeName of Object.keys(VALID_TYPES)) {
      const filePath = path.join(DATA_DIR, VALID_TYPES[typeName]);
      const results = readResults(filePath);
      typeCounts[typeName] = results.length;
      totalSubmissions += results.length;

      results.forEach(function(r) {
        totalScoreSum += (r.score_percentage || 0);
        if (r.user_email && r.user_email !== 'not-provided') {
          uniqueEmails[r.user_email] = true;
        }
      });
    }

    res.json({
      total_submissions: totalSubmissions,
      average_score: totalSubmissions > 0 ? Math.round(totalScoreSum / totalSubmissions) : 0,
      unique_students: Object.keys(uniqueEmails).length,
      by_type: typeCounts
    });

  } catch (err) {
    console.error('GET /api/stats error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── API: Export CSV ────────────────────────────────────────────────────────

app.get('/api/export/:type', function(req, res) {
  try {
    const type = req.params.type;
    if (!VALID_TYPES[type]) {
      return res.status(400).json({ error: 'Invalid assessment type' });
    }

    const filePath = getFilePath(type);
    const results = readResults(filePath);

    if (results.length === 0) {
      return res.status(404).json({ error: 'No results found for ' + type });
    }

    const headers = [
      'Date', 'Name', 'Email', 'Score', 'Total', 'Percentage',
      'Wrong', 'Skipped', 'Time (seconds)', 'Tier', 'Section Breakdown'
    ];

    const rows = results.map(function(r) {
      return [
        r.submitted_at,
        '"' + (r.user_name || '').replace(/"/g, '""') + '"',
        '"' + (r.user_email || '').replace(/"/g, '""') + '"',
        r.score_correct,
        r.score_total,
        r.score_percentage + '%',
        r.score_wrong,
        r.score_skipped,
        r.time_taken_seconds || '',
        r.performance_tier || '',
        r.section_breakdown ? '"' + JSON.stringify(r.section_breakdown).replace(/"/g, '""') + '"' : ''
      ].join(',');
    });

    const csv = headers.join(',') + '\n' + rows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=acumen-logic-' + type + '-results.csv');
    res.send(csv);

  } catch (err) {
    console.error('GET /api/export error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── 404 Handler ────────────────────────────────────────────────────────────

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
  console.log('  ✦ Acumen Logic Results Server v2.0');
  console.log('  ✦ Running on http://localhost:' + PORT);
  console.log('  ✦ Dashboard: http://localhost:' + PORT);
  console.log('  ✦ API: http://localhost:' + PORT + '/api/results');
  console.log('  ✦ Health: http://localhost:' + PORT + '/api/health');
  console.log('  ✦ Data stored in: ' + DATA_DIR);
  console.log('');
});
