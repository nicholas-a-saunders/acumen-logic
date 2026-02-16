const express = require('express');
const { optionalAuth } = require('../middleware/auth');
const { calculatePercentile, getDistribution } = require('../services/percentileEngine');

const router = express.Router();

module.exports = function(pool) {

  // ── Get Current Distribution ──────────────────────────────
  router.get('/current', optionalAuth, async (req, res) => {
    try {
      const category = req.query.category || null;
      const distribution = await getDistribution(pool, category);

      const totalResult = await pool.query(
        "SELECT COUNT(*) as real_count FROM m2_assessment_sessions WHERE is_benchmark = TRUE AND completed_at IS NOT NULL"
      );
      const seedResult = await pool.query("SELECT COUNT(*) as seed_count FROM m2_seed_data");

      res.json({
        distribution,
        total_real: parseInt(totalResult.rows[0].real_count),
        total_seed: parseInt(seedResult.rows[0].seed_count),
        is_estimated: parseInt(totalResult.rows[0].real_count) < 1000,
        benchmarks: { mbb_average: 82, big4_average: 64 }
      });
    } catch (err) {
      console.error('Percentile distribution error:', err);
      res.status(500).json({ error: 'Failed to get distribution' });
    }
  });

  // ── Calculate Rank for a Score ────────────────────────────
  router.get('/rank', optionalAuth, async (req, res) => {
    try {
      const score = parseInt(req.query.score);
      const category = req.query.category || null;

      if (isNaN(score) || score < 0 || score > 100) {
        return res.status(400).json({ error: 'Score must be between 0 and 100' });
      }

      const result = await calculatePercentile(pool, score, category);
      res.json(result);
    } catch (err) {
      console.error('Percentile rank error:', err);
      res.status(500).json({ error: 'Failed to calculate rank' });
    }
  });

  return router;
};
