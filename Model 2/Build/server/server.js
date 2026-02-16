require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

const { requireAuth, requireAdmin } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 10000;
const isProduction = process.env.NODE_ENV === 'production';

// ═══════════════════════════════════════════════════════════
// DATABASE
// ═══════════════════════════════════════════════════════════

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is required.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});

// ═══════════════════════════════════════════════════════════
// TRUST PROXY (required for Render / secure cookies behind LB)
// ═══════════════════════════════════════════════════════════

app.set('trust proxy', 1);

// ═══════════════════════════════════════════════════════════
// MIDDLEWARE
// ═══════════════════════════════════════════════════════════

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:10000').split(',').map(s => s.trim());

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('CORS: unexpected origin allowed with warning:', origin);
      callback(null, true);
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Determine the public folder path — works whether public/ is a sibling
// directory (local dev) or was copied into the same repo root (Render)
const publicDir = fs.existsSync(path.join(__dirname, '..', 'public'))
  ? path.join(__dirname, '..', 'public')
  : fs.existsSync(path.join(__dirname, 'public'))
    ? path.join(__dirname, 'public')
    : path.join(__dirname, '..', 'public');

// ── ThriveCart Webhook ──────────────────────────────────────
app.post('/api/webhooks/thrivecart', async (req, res) => {
  try {
    const secret = process.env.THRIVECART_SECRET;
    if (secret && req.body.thrivecart_secret !== secret && req.headers['x-thrivecart-secret'] !== secret) {
      console.warn('ThriveCart webhook: invalid secret');
      return res.status(403).json({ error: 'Invalid secret' });
    }

    const event = req.body.event || req.body.thrivecart_event;
    if (event !== 'order.success' && event !== 'order.subscription_payment') {
      return res.status(200).json({ message: 'Event ignored: ' + event });
    }

    const customer = req.body.customer || {};
    const email = (customer.email || '').toLowerCase().trim();
    const productId = String(req.body.order && req.body.order.item ? req.body.order.item.id : req.body.product_id || '');

    if (!email) {
      return res.status(400).json({ error: 'No customer email' });
    }

    // Map product IDs to tiers — update these with real ThriveCart product IDs
    const PRODUCT_TIER_MAP = {
      'THRIVECART_PRO_PRODUCT_ID': 'pro',
      'THRIVECART_ELITE_PRODUCT_ID': 'elite'
    };

    const newTier = PRODUCT_TIER_MAP[productId] || 'pro';

    const result = await pool.query(
      'UPDATE m2_users SET tier = $1 WHERE email = $2 RETURNING id, email, tier',
      [newTier, email]
    );

    if (result.rows.length === 0) {
      console.warn('ThriveCart webhook: user not found for email ' + email);
      return res.status(200).json({ message: 'User not found, will be upgraded on next login' });
    }

    console.log('ThriveCart webhook: upgraded ' + email + ' to ' + newTier);
    res.status(200).json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error('ThriveCart webhook error:', err);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

console.log('Serving static files from:', publicDir);
app.use(express.static(publicDir));

// ═══════════════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════════════

const authRoutes = require('./routes/auth')(pool);
const assessmentRoutes = require('./routes/assessments')(pool);
const dashboardRoutes = require('./routes/dashboard')(pool);
const percentileRoutes = require('./routes/percentiles')(pool);
const adminRoutes = require('./routes/admin')(pool);

app.use('/api/auth', authRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/percentiles', percentileRoutes);
app.use('/api/admin', adminRoutes);

// ═══════════════════════════════════════════════════════════
// HEALTH CHECK
// ═══════════════════════════════════════════════════════════

// Public health check — no auth required
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Detailed health check — admin only
app.get('/api/health/details', requireAuth, requireAdmin, async (req, res) => {
  try {
    const dbResult = await pool.query('SELECT NOW() as time');
    const seedCount = await pool.query('SELECT COUNT(*) FROM m2_seed_data').catch(() => ({ rows: [{ count: 0 }] }));
    const userCount = await pool.query('SELECT COUNT(*) FROM m2_users').catch(() => ({ rows: [{ count: 0 }] }));
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      db_time: dbResult.rows[0].time,
      seed_data: parseInt(seedCount.rows[0].count),
      users: parseInt(userCount.rows[0].count),
      static_dir: publicDir,
      static_exists: fs.existsSync(publicDir)
    });
  } catch (err) {
    res.status(500).json({ status: 'unhealthy', error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════
// SPA FALLBACK — serve index.html for all non-API routes
// ═══════════════════════════════════════════════════════════

app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }

  const requestedFile = path.join(publicDir, req.path);
  if (fs.existsSync(requestedFile) && fs.statSync(requestedFile).isFile()) {
    return res.sendFile(requestedFile);
  }

  const indexPath = path.join(publicDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }

  res.status(404).send('Frontend not found. Check that public/ directory is deployed correctly.');
});

// ═══════════════════════════════════════════════════════════
// DATABASE INITIALISATION + SEED
// ═══════════════════════════════════════════════════════════

async function initDatabase() {
  const client = await pool.connect();
  try {
    const schemaPath = path.join(__dirname, 'db', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await client.query(schema);
    console.log('Database schema initialised.');

    // Auto-seed if no seed data exists
    const seedCheck = await client.query('SELECT COUNT(*) FROM m2_seed_data');
    if (parseInt(seedCheck.rows[0].count) === 0) {
      console.log('No seed data found. Auto-seeding 500 simulated results...');
      await autoSeed(client);
    } else {
      console.log('Seed data already present:', seedCheck.rows[0].count, 'records');
    }
  } catch (err) {
    console.error('Database init error:', err.message);
  } finally {
    client.release();
  }
}

function gaussianRandom(mean, stdDev) {
  let u1 = Math.random();
  let u2 = Math.random();
  while (u1 === 0) u1 = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return mean + z * stdDev;
}

async function autoSeed(client) {
  const records = [];
  for (let i = 0; i < 500; i++) {
    const overall = Math.round(Math.min(100, Math.max(5, gaussianRandom(60, 15))));
    const nr = Math.round(Math.min(100, Math.max(0, gaussianRandom(62, 16))));
    const di = Math.round(Math.min(100, Math.max(0, gaussianRandom(58, 17))));
    const lr = Math.round(Math.min(100, Math.max(0, gaussianRandom(60, 15))));
    records.push({ overall, nr, di, lr });
  }

  const batchSize = 50;
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    const values = [];
    const params = [];
    let idx = 1;
    for (const r of batch) {
      values.push(`($${idx}, $${idx+1}, $${idx+2}, $${idx+3})`);
      params.push(r.overall, r.nr, r.di, r.lr);
      idx += 4;
    }
    await client.query(
      `INSERT INTO m2_seed_data (score_percentage, score_nr, score_di, score_lr) VALUES ${values.join(', ')}`,
      params
    );
  }
  console.log('Auto-seeded 500 simulated benchmark results.');
}

// ═══════════════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════════════

async function start() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Connected to PostgreSQL at', result.rows[0].now);
  } catch (err) {
    console.error('Failed to connect to database:', err.message);
    process.exit(1);
  }

  await initDatabase();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Acumen Logic Model 2 running on port ${PORT}`);
    console.log(`Environment: ${isProduction ? 'PRODUCTION' : 'development'}`);
    console.log(`Static files: ${publicDir}`);
    if (!isProduction) {
      console.log(`Frontend: http://localhost:${PORT}`);
      console.log(`Health: http://localhost:${PORT}/api/health`);
    }
  });
}

// ═══════════════════════════════════════════════════════════
// GRACEFUL SHUTDOWN
// ═══════════════════════════════════════════════════════════

process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  try {
    await pool.end();
    console.log('Database pool closed.');
  } catch (err) {
    console.error('Error closing database pool:', err.message);
  }
  process.exit(0);
});

start();
