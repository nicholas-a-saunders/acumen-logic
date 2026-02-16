const express = require('express');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

module.exports = function(pool) {

  const questionBank = require('../questions/index');

  // ── Question Bank Metadata ──────────────────────────────────
  router.get('/questions', requireAuth, requireAdmin, (req, res) => {
    try {
      const category = req.query.category;
      let questions = questionBank.allQuestions;

      if (category && ['NR', 'DI', 'LR'].includes(category.toUpperCase())) {
        questions = questionBank.getByCategory(category.toUpperCase());
      }

      const safe = questions.map(q => ({
        id: q.id,
        category: q.category,
        sub_category: q.sub_category,
        difficulty: q.difficulty,
        question_text: q.question_text
      }));

      const st = questionBank.stats();

      res.json({
        questions: safe,
        stats: {
          total: st.total,
          nr: st.nr,
          di: st.di,
          lr: st.lr
        }
      });
    } catch (err) {
      console.error('Admin questions error:', err);
      res.status(500).json({ error: 'Failed to get questions' });
    }
  });

  // ── Platform Stats ────────────────────────────────────────
  router.get('/stats', requireAuth, requireAdmin, async (req, res) => {
    try {
      const users = await pool.query('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE tier = \'pro\') as pro FROM m2_users');
      const sessions = await pool.query('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE completed_at IS NOT NULL) as completed FROM m2_assessment_sessions');
      const recent = await pool.query('SELECT COUNT(*) as count FROM m2_users WHERE created_at > NOW() - INTERVAL \'7 days\'');

      res.json({
        users: {
          total: parseInt(users.rows[0].total),
          pro: parseInt(users.rows[0].pro),
          free: parseInt(users.rows[0].total) - parseInt(users.rows[0].pro)
        },
        assessments: {
          total: parseInt(sessions.rows[0].total),
          completed: parseInt(sessions.rows[0].completed)
        },
        recent_signups_7d: parseInt(recent.rows[0].count)
      });
    } catch (err) {
      console.error('Admin stats error:', err);
      res.status(500).json({ error: 'Failed to get stats' });
    }
  });

  // ── User List ─────────────────────────────────────────────
  router.get('/users', requireAuth, requireAdmin, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;

      const result = await pool.query(
        `SELECT id, email, name, tier, created_at, last_login_at, assessments_this_month
         FROM m2_users ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
        [limit, offset]
      );

      const count = await pool.query('SELECT COUNT(*) FROM m2_users');

      res.json({ users: result.rows, total: parseInt(count.rows[0].count) });
    } catch (err) {
      console.error('Admin users error:', err);
      res.status(500).json({ error: 'Failed to get users' });
    }
  });

  // ── Export Data ───────────────────────────────────────────
  router.get('/export', requireAuth, requireAdmin, async (req, res) => {
    try {
      const type = req.query.type || 'users';

      if (type === 'users') {
        const result = await pool.query(
          'SELECT id, email, name, tier, target_firm, created_at, last_login_at FROM m2_users ORDER BY created_at DESC'
        );
        const csv = toCSV(result.rows);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=m2_users.csv');
        return res.send(csv);
      }

      if (type === 'assessments') {
        const result = await pool.query(
          `SELECT s.id, u.email, u.name, s.assessment_type, s.score_percentage,
                  s.percentile_overall, s.completed_at, s.time_taken_seconds
           FROM m2_assessment_sessions s JOIN m2_users u ON s.user_id = u.id
           WHERE s.completed_at IS NOT NULL ORDER BY s.completed_at DESC`
        );
        const csv = toCSV(result.rows);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=m2_assessments.csv');
        return res.send(csv);
      }

      res.status(400).json({ error: 'Invalid export type' });
    } catch (err) {
      console.error('Admin export error:', err);
      res.status(500).json({ error: 'Failed to export' });
    }
  });

  // ── Promote / Change User Tier ───────────────────────────
  router.post('/promote', requireAuth, requireAdmin, async (req, res) => {
    try {
      const { email, tier } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const validTiers = ['free', 'pro', 'elite', 'admin'];
      if (!tier || !validTiers.includes(tier)) {
        return res.status(400).json({ error: 'Invalid tier. Must be: free, pro, elite, or admin' });
      }

      const result = await pool.query(
        `UPDATE m2_users SET tier = $1 WHERE email = $2 RETURNING id, email, name, tier`,
        [tier, email.toLowerCase().trim()]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ success: true, user: result.rows[0] });
    } catch (err) {
      console.error('Admin promote error:', err);
      res.status(500).json({ error: 'Failed to update user tier' });
    }
  });

  function toCSV(rows) {
    if (rows.length === 0) return '';
    const headers = Object.keys(rows[0]);
    const lines = [headers.join(',')];
    for (const row of rows) {
      lines.push(headers.map(h => {
        const val = row[h];
        if (val === null || val === undefined) return '';
        const str = String(val);
        return str.includes(',') || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str;
      }).join(','));
    }
    return lines.join('\n');
  }

  return router;
};
