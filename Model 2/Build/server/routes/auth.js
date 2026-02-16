const express = require('express');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const { generateToken, generateRefreshToken, requireAuth, requireAdmin, COOKIE_OPTIONS, REFRESH_COOKIE_OPTIONS } = require('../middleware/auth');
const { authLimit } = require('../middleware/rateLimit');
const { addSubscriber } = require('../services/kitIntegration');

const router = express.Router();

module.exports = function(pool) {

  const googleClient = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'PLACEHOLDER'
    ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
    : null;

  // ── Register ──────────────────────────────────────────────
  router.post('/register', authLimit, async (req, res) => {
    try {
      const { email, password, name, target_firm, email_opt_in } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
      }

      if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
      }

      const emailLower = email.toLowerCase().trim();
      const existing = await pool.query('SELECT id FROM m2_users WHERE email = $1', [emailLower]);
      if (existing.rows.length > 0) {
        return res.status(409).json({ error: 'An account with this email already exists' });
      }

      const passwordHash = await bcrypt.hash(password, 12);

      const result = await pool.query(
        `INSERT INTO m2_users (email, password_hash, name, target_firm, email_opt_in)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, email, name, tier, created_at`,
        [emailLower, passwordHash, name.trim(), target_firm || null, email_opt_in || false]
      );

      const user = result.rows[0];
      const token = generateToken(user);
      const refreshToken = generateRefreshToken(user);

      // Add subscriber to Kit (fire-and-forget)
      addSubscriber(user.email, name.trim(), {});

      res.cookie('token', token, COOKIE_OPTIONS);
      res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);

      res.status(201).json({
        user: { id: user.id, email: user.email, name: user.name, tier: user.tier }
      });
    } catch (err) {
      console.error('Registration error:', err);
      res.status(500).json({ error: 'Registration failed' });
    }
  });

  // ── Login ─────────────────────────────────────────────────
  router.post('/login', authLimit, async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const emailLower = email.toLowerCase().trim();
      const result = await pool.query(
        'SELECT id, email, name, password_hash, tier FROM m2_users WHERE email = $1',
        [emailLower]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const user = result.rows[0];

      if (!user.password_hash) {
        return res.status(401).json({ error: 'This account uses Google login. Please sign in with Google.' });
      }

      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      await pool.query('UPDATE m2_users SET last_login_at = NOW() WHERE id = $1', [user.id]);

      const token = generateToken(user);
      const refreshToken = generateRefreshToken(user);

      res.cookie('token', token, COOKIE_OPTIONS);
      res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);

      res.json({
        user: { id: user.id, email: user.email, name: user.name, tier: user.tier }
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Login failed' });
    }
  });

  // ── Google OAuth ──────────────────────────────────────────
  router.post('/google', authLimit, async (req, res) => {
    try {
      if (!googleClient) {
        return res.status(501).json({ error: 'Google login not configured yet' });
      }

      const { credential } = req.body;
      if (!credential) {
        return res.status(400).json({ error: 'Google credential required' });
      }

      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      const payload = ticket.getPayload();
      const { sub: googleId, email, name, picture } = payload;

      let result = await pool.query('SELECT id, email, name, tier FROM m2_users WHERE google_id = $1', [googleId]);

      if (result.rows.length === 0) {
        result = await pool.query('SELECT id, email, name, tier, google_id FROM m2_users WHERE email = $1', [email.toLowerCase()]);

        if (result.rows.length > 0 && !result.rows[0].google_id) {
          await pool.query(
            'UPDATE m2_users SET google_id = $1, avatar_url = $2, last_login_at = NOW() WHERE id = $3',
            [googleId, picture, result.rows[0].id]
          );
        } else if (result.rows.length === 0) {
          result = await pool.query(
            `INSERT INTO m2_users (email, name, google_id, avatar_url)
             VALUES ($1, $2, $3, $4)
             RETURNING id, email, name, tier`,
            [email.toLowerCase(), name, googleId, picture]
          );
        }
      } else {
        await pool.query(
          'UPDATE m2_users SET last_login_at = NOW(), avatar_url = $1 WHERE id = $2',
          [picture, result.rows[0].id]
        );
      }

      const user = result.rows[0];
      const token = generateToken(user);
      const refreshToken = generateRefreshToken(user);

      res.cookie('token', token, COOKIE_OPTIONS);
      res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);

      res.json({
        user: { id: user.id, email: user.email, name: user.name, tier: user.tier }
      });
    } catch (err) {
      console.error('Google auth error:', err);
      res.status(500).json({ error: 'Google authentication failed' });
    }
  });

  // ── Logout ────────────────────────────────────────────────
  router.post('/logout', (req, res) => {
    res.clearCookie('token', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });
    res.json({ success: true });
  });

  // ── Get Current User ─────────────────────────────────────
  router.get('/me', requireAuth, async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT id, email, name, tier, avatar_url, target_firm, email_opt_in,
                pro_expires_at, created_at, last_login_at,
                assessments_this_month
         FROM m2_users WHERE id = $1`,
        [req.user.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ user: result.rows[0] });
    } catch (err) {
      console.error('Get user error:', err);
      res.status(500).json({ error: 'Failed to get user' });
    }
  });

  // ── Update Profile ────────────────────────────────────────
  router.put('/me', requireAuth, async (req, res) => {
    try {
      const { name, target_firm, email_opt_in } = req.body;

      const result = await pool.query(
        `UPDATE m2_users
         SET name = COALESCE($1, name),
             target_firm = COALESCE($2, target_firm),
             email_opt_in = COALESCE($3, email_opt_in)
         WHERE id = $4
         RETURNING id, email, name, tier, target_firm, email_opt_in`,
        [name, target_firm, email_opt_in, req.user.id]
      );

      res.json({ user: result.rows[0] });
    } catch (err) {
      console.error('Update profile error:', err);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  });

  // ── Admin: Promote User (secret setup endpoint) ───────────
  // POST /api/auth/promote-admin
  // Body: { "email": "...", "admin_secret": "..." }
  // The admin_secret must match the ADMIN_SECRET env var
  router.post('/promote-admin', async (req, res) => {
    try {
      const { email, admin_secret } = req.body;
      const expectedSecret = process.env.ADMIN_SECRET;

      if (!expectedSecret) {
        return res.status(501).json({ error: 'ADMIN_SECRET not configured on server' });
      }

      if (!admin_secret || admin_secret !== expectedSecret) {
        return res.status(403).json({ error: 'Invalid admin secret' });
      }

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const result = await pool.query(
        `UPDATE m2_users SET tier = 'admin' WHERE email = $1 RETURNING id, email, name, tier`,
        [email.toLowerCase().trim()]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found. Register first, then promote.' });
      }

      res.json({ success: true, user: result.rows[0] });
    } catch (err) {
      console.error('Promote admin error:', err);
      res.status(500).json({ error: 'Failed to promote user' });
    }
  });

  return router;
};
