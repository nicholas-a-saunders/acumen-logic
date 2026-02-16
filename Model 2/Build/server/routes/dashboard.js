const express = require('express');
const { requireAuth, requirePro } = require('../middleware/auth');
const { calculatePercentile, getDistribution } = require('../services/percentileEngine');
const { getPerformanceTier, generateRecommendations } = require('../services/scoringEngine');

const router = express.Router();

module.exports = function(pool) {

  // ── Dashboard Summary ─────────────────────────────────────
  router.get('/summary', requireAuth, async (req, res) => {
    try {
      // Get latest benchmark result
      const latestResult = await pool.query(
        `SELECT * FROM m2_assessment_sessions
         WHERE user_id = $1 AND is_benchmark = TRUE AND completed_at IS NOT NULL
         ORDER BY completed_at DESC LIMIT 1`,
        [req.user.id]
      );

      // Get aggregate stats
      const statsResult = await pool.query(
        `SELECT
           COUNT(*) as total_assessments,
           AVG(score_percentage) as avg_score,
           MAX(score_percentage) as best_score,
           MIN(score_percentage) as worst_score
         FROM m2_assessment_sessions
         WHERE user_id = $1 AND completed_at IS NOT NULL`,
        [req.user.id]
      );

      // Get monthly assessment count
      const monthlyResult = await pool.query(
        'SELECT assessments_this_month FROM m2_users WHERE id = $1',
        [req.user.id]
      );

      // Get global benchmark count to determine if percentiles are estimated
      const benchmarkCountResult = await pool.query(
        `SELECT COUNT(*) FROM m2_assessment_sessions
         WHERE completed_at IS NOT NULL AND is_benchmark = TRUE`
      );
      const totalBenchmarkAssessments = parseInt(benchmarkCountResult.rows[0].count);
      const isEstimated = totalBenchmarkAssessments < 100;

      const latest = latestResult.rows[0] || null;
      const stats = statsResult.rows[0];
      const user = monthlyResult.rows[0];

      let percentileData = null;
      let tier = null;
      let recommendations = [];

      if (latest) {
        percentileData = await calculatePercentile(pool, latest.score_percentage, null);
        tier = getPerformanceTier(percentileData.percentile);
        recommendations = generateRecommendations(latest);
      }

      res.json({
        latest_assessment: latest,
        percentile: percentileData,
        performance_tier: tier,
        stats: {
          total_assessments: parseInt(stats.total_assessments),
          avg_score: stats.avg_score ? Math.round(parseFloat(stats.avg_score)) : null,
          best_score: stats.best_score ? parseInt(stats.best_score) : null,
          worst_score: stats.worst_score ? parseInt(stats.worst_score) : null
        },
        is_estimated: isEstimated,
        total_benchmark_assessments: totalBenchmarkAssessments,
        monthly_assessments: user.assessments_this_month,
        monthly_limit: req.user.tier === 'free' ? 3 : null,
        recommendations
      });
    } catch (err) {
      console.error('Dashboard summary error:', err);
      res.status(500).json({ error: 'Failed to load dashboard' });
    }
  });

  // ── Assessment History ────────────────────────────────────
  router.get('/history', requireAuth, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 20;
      const offset = parseInt(req.query.offset) || 0;

      const result = await pool.query(
        `SELECT id, assessment_type, category_filter, started_at, completed_at,
                score_correct, score_total, score_percentage,
                percentile_overall, time_taken_seconds, is_benchmark
         FROM m2_assessment_sessions
         WHERE user_id = $1 AND completed_at IS NOT NULL
         ORDER BY completed_at DESC
         LIMIT $2 OFFSET $3`,
        [req.user.id, limit, offset]
      );

      const countResult = await pool.query(
        'SELECT COUNT(*) FROM m2_assessment_sessions WHERE user_id = $1 AND completed_at IS NOT NULL',
        [req.user.id]
      );

      res.json({
        assessments: result.rows,
        total: parseInt(countResult.rows[0].count),
        limit,
        offset
      });
    } catch (err) {
      console.error('History error:', err);
      res.status(500).json({ error: 'Failed to load history' });
    }
  });

  // ── Progress Tracking (Pro) ───────────────────────────────
  router.get('/progress', requireAuth, requirePro, async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT completed_at, score_percentage,
                percentile_overall, percentile_nr, percentile_di, percentile_lr,
                score_nr_correct, score_nr_total,
                score_di_correct, score_di_total,
                score_lr_correct, score_lr_total,
                time_taken_seconds, question_count
         FROM m2_assessment_sessions
         WHERE user_id = $1 AND is_benchmark = TRUE AND completed_at IS NOT NULL
         ORDER BY completed_at ASC`,
        [req.user.id]
      );

      const dataPoints = result.rows.map(r => ({
        date: r.completed_at,
        score: r.score_percentage,
        percentile: r.percentile_overall,
        nr: r.score_nr_total > 0 ? Math.round(r.score_nr_correct / r.score_nr_total * 100) : null,
        di: r.score_di_total > 0 ? Math.round(r.score_di_correct / r.score_di_total * 100) : null,
        lr: r.score_lr_total > 0 ? Math.round(r.score_lr_correct / r.score_lr_total * 100) : null,
        time_per_question: r.question_count > 0 ? Math.round(r.time_taken_seconds / r.question_count) : null
      }));

      res.json({ progress: dataPoints });
    } catch (err) {
      console.error('Progress error:', err);
      res.status(500).json({ error: 'Failed to load progress' });
    }
  });

  // ── Percentile Distribution ───────────────────────────────
  router.get('/percentiles', requireAuth, async (req, res) => {
    try {
      const category = req.query.category || null;
      const distribution = await getDistribution(pool, category);

      // Get user's latest percentile
      const latest = await pool.query(
        `SELECT score_percentage, percentile_overall, percentile_nr, percentile_di, percentile_lr
         FROM m2_assessment_sessions
         WHERE user_id = $1 AND is_benchmark = TRUE AND completed_at IS NOT NULL
         ORDER BY completed_at DESC LIMIT 1`,
        [req.user.id]
      );

      const userScore = latest.rows[0] || null;

      res.json({
        distribution,
        user_score: userScore,
        benchmarks: {
          mbb_average: 82,
          big4_average: 64
        }
      });
    } catch (err) {
      console.error('Percentiles error:', err);
      res.status(500).json({ error: 'Failed to load percentiles' });
    }
  });

  return router;
};
