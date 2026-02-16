const express = require('express');
const { requireAuth, requirePro } = require('../middleware/auth');
const { assessmentLimit } = require('../middleware/rateLimit');
const { generateQuestion, selectQuestions, SeededRNG } = require('../services/questionEngine');
const { calculateScores, calculateTimeTaken } = require('../services/scoringEngine');
const { calculatePercentile } = require('../services/percentileEngine');
const { allQuestions } = require('../questions');
const { addSubscriber } = require('../services/kitIntegration');

const router = express.Router();

const ASSESSMENT_CONFIG = {
  'quick-benchmark': { countNR: 6, countDI: 6, countLR: 7, timeLimit: 900, isBenchmark: true, tier: 'free' },
  'full-benchmark':  { countNR: 10, countDI: 10, countLR: 10, timeLimit: 1500, isBenchmark: true, tier: 'pro' },
  'category-drill':  { count: 10, timeLimit: 480, isBenchmark: false, tier: 'pro' },
  'custom':          { count: null, timeLimit: null, isBenchmark: false, tier: 'pro' }
};

const FREE_MONTHLY_LIMIT = 3;

module.exports = function(pool) {

  // ── Start Assessment ──────────────────────────────────────
  router.post('/start', requireAuth, assessmentLimit, async (req, res) => {
    try {
      const { type, category, questionCount, difficulty } = req.body;

      if (!type || !ASSESSMENT_CONFIG[type]) {
        return res.status(400).json({ error: 'Invalid assessment type' });
      }

      const config = ASSESSMENT_CONFIG[type];

      // Tier check (allow elite tier too)
      if (config.tier === 'pro' && !['pro', 'elite', 'admin'].includes(req.user.tier)) {
        return res.status(403).json({ error: 'Pro subscription required', upgrade: true });
      }

      // Free tier monthly limit
      if (req.user.tier === 'free' && config.isBenchmark) {
        const userResult = await pool.query(
          'SELECT assessments_this_month, month_reset_at FROM m2_users WHERE id = $1',
          [req.user.id]
        );
        const user = userResult.rows[0];

        const now = new Date();
        const resetAt = new Date(user.month_reset_at);
        if (now.getMonth() !== resetAt.getMonth() || now.getFullYear() !== resetAt.getFullYear()) {
          await pool.query(
            'UPDATE m2_users SET assessments_this_month = 0, month_reset_at = NOW() WHERE id = $1',
            [req.user.id]
          );
        } else if (user.assessments_this_month >= FREE_MONTHLY_LIMIT) {
          return res.status(403).json({
            error: `Free tier limited to ${FREE_MONTHLY_LIMIT} benchmarks per month`,
            upgrade: true,
            remaining: 0
          });
        }
      }

      // Select questions using the 6/6/7 format or count-based
      const categories = category ? [category] : null;
      const difficulties = difficulty ? [difficulty] : null;
      const rng = new SeededRNG(Date.now());

      let selectConfig = { categories, difficulties, excludeIds: [], rng };

      if (config.countNR !== undefined) {
        selectConfig.countNR = config.countNR;
        selectConfig.countDI = config.countDI;
        selectConfig.countLR = config.countLR;
      } else {
        selectConfig.count = config.count || questionCount || 19;
      }

      const selectedTemplates = selectQuestions(allQuestions, selectConfig);

      if (selectedTemplates.length === 0) {
        return res.status(400).json({ error: 'No questions available for this configuration' });
      }

      const totalCount = config.countNR !== undefined
        ? config.countNR + config.countDI + config.countLR
        : (config.count || questionCount || 19);
      const timeLimit = config.timeLimit || (totalCount * 45);

      // Create session
      const sessionResult = await pool.query(
        `INSERT INTO m2_assessment_sessions
         (user_id, assessment_type, category_filter, time_limit_seconds, question_count, is_benchmark)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, started_at`,
        [req.user.id, type, category || null, timeLimit, selectedTemplates.length, config.isBenchmark]
      );

      const session = sessionResult.rows[0];

      // Generate and store questions
      const questions = [];
      let orderNum = 0;
      for (let i = 0; i < selectedTemplates.length; i++) {
        const template = selectedTemplates[i];
        const seed = Math.floor(rng.next() * 2147483646) + 1;
        const generated = generateQuestion(template, seed);

        if (!generated) continue;
        orderNum++;

        await pool.query(
          `INSERT INTO m2_session_answers
           (session_id, question_template_id, question_seed, question_order, category, difficulty, generated_question, correct_answer)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [session.id, template.id, generated.seed, orderNum, generated.category, generated.difficulty,
           JSON.stringify({
             text: generated.question_text,
             context: generated.context,
             table_data: generated.table_data,
             options: generated.options
           }),
           generated.correct_index]
        );

        questions.push({
          order: orderNum,
          category: generated.category,
          difficulty: generated.difficulty,
          question_text: generated.question_text,
          context: generated.context,
          table_data: generated.table_data,
          options: generated.options.map(o => ({ label: o.label, display: o.display }))
        });
      }

      // Increment monthly counter for free users
      if (req.user.tier === 'free' && config.isBenchmark) {
        await pool.query(
          'UPDATE m2_users SET assessments_this_month = assessments_this_month + 1 WHERE id = $1',
          [req.user.id]
        );
      }

      res.status(201).json({
        session_id: session.id,
        started_at: session.started_at,
        time_limit_seconds: timeLimit,
        question_count: questions.length,
        questions: questions
      });
    } catch (err) {
      console.error('Start assessment error:', err);
      res.status(500).json({ error: 'Failed to start assessment' });
    }
  });

  // ── Submit Answer ─────────────────────────────────────────
  router.post('/:id/answer', requireAuth, async (req, res) => {
    try {
      const { question_order, selected_answer, time_spent_seconds } = req.body;

      // Verify session belongs to user
      const sessionCheck = await pool.query(
        'SELECT id FROM m2_assessment_sessions WHERE id = $1 AND user_id = $2 AND completed_at IS NULL',
        [req.params.id, req.user.id]
      );

      if (sessionCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Active session not found' });
      }

      // Get the correct answer
      const answerRow = await pool.query(
        'SELECT correct_answer FROM m2_session_answers WHERE session_id = $1 AND question_order = $2',
        [req.params.id, question_order]
      );

      if (answerRow.rows.length === 0) {
        return res.status(404).json({ error: 'Question not found' });
      }

      const isCorrect = selected_answer === answerRow.rows[0].correct_answer;

      await pool.query(
        `UPDATE m2_session_answers
         SET selected_answer = $1, is_correct = $2, time_spent_seconds = $3
         WHERE session_id = $4 AND question_order = $5`,
        [selected_answer, isCorrect, time_spent_seconds || null, req.params.id, question_order]
      );

      res.json({ is_correct: isCorrect });
    } catch (err) {
      console.error('Submit answer error:', err);
      res.status(500).json({ error: 'Failed to submit answer' });
    }
  });

  // ── Complete Assessment ───────────────────────────────────
  router.post('/:id/complete', requireAuth, async (req, res) => {
    try {
      const sessionCheck = await pool.query(
        'SELECT * FROM m2_assessment_sessions WHERE id = $1 AND user_id = $2 AND completed_at IS NULL',
        [req.params.id, req.user.id]
      );

      if (sessionCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Active session not found' });
      }

      const session = sessionCheck.rows[0];

      // Get all answers
      const answersResult = await pool.query(
        'SELECT * FROM m2_session_answers WHERE session_id = $1 ORDER BY question_order',
        [req.params.id]
      );

      const scores = calculateScores(answersResult.rows);
      const timeTaken = calculateTimeTaken(session.started_at, new Date());

      // Calculate percentiles if benchmark
      let percentiles = { overall: null, nr: null, di: null, lr: null };
      if (session.is_benchmark) {
        const overallP = await calculatePercentile(pool, scores.score_percentage, null);
        percentiles.overall = overallP.percentile;

        if (scores.score_nr_total > 0) {
          const nrPct = Math.round(scores.score_nr_correct / scores.score_nr_total * 100);
          const nrP = await calculatePercentile(pool, nrPct, 'NR');
          percentiles.nr = nrP.percentile;
        }
        if (scores.score_di_total > 0) {
          const diPct = Math.round(scores.score_di_correct / scores.score_di_total * 100);
          const diP = await calculatePercentile(pool, diPct, 'DI');
          percentiles.di = diP.percentile;
        }
        if (scores.score_lr_total > 0) {
          const lrPct = Math.round(scores.score_lr_correct / scores.score_lr_total * 100);
          const lrP = await calculatePercentile(pool, lrPct, 'LR');
          percentiles.lr = lrP.percentile;
        }
      }

      // Update session
      await pool.query(
        `UPDATE m2_assessment_sessions SET
         completed_at = NOW(),
         score_correct = $1, score_total = $2, score_percentage = $3,
         percentile_overall = $4, percentile_nr = $5, percentile_di = $6, percentile_lr = $7,
         score_nr_correct = $8, score_nr_total = $9,
         score_di_correct = $10, score_di_total = $11,
         score_lr_correct = $12, score_lr_total = $13,
         time_taken_seconds = $14
         WHERE id = $15`,
        [scores.score_correct, scores.score_total, scores.score_percentage,
         percentiles.overall, percentiles.nr, percentiles.di, percentiles.lr,
         scores.score_nr_correct, scores.score_nr_total,
         scores.score_di_correct, scores.score_di_total,
         scores.score_lr_correct, scores.score_lr_total,
         timeTaken, req.params.id]
      );

      // Update Kit subscriber with assessment results (fire-and-forget)
      const userResult = await pool.query(
        'SELECT email, name FROM m2_users WHERE id = $1',
        [req.user.id]
      );
      if (userResult.rows.length > 0) {
        const user = userResult.rows[0];
        addSubscriber(user.email, user.name, {
          last_score: scores.score_percentage,
          last_percentile: percentiles.overall,
          assessments_completed: 'true'
        });
      }

      res.json({
        session_id: req.params.id,
        scores,
        percentiles,
        time_taken_seconds: timeTaken
      });
    } catch (err) {
      console.error('Complete assessment error:', err);
      res.status(500).json({ error: 'Failed to complete assessment' });
    }
  });

  // ── Get Results ───────────────────────────────────────────
  router.get('/:id/results', requireAuth, async (req, res) => {
    try {
      const sessionResult = await pool.query(
        'SELECT * FROM m2_assessment_sessions WHERE id = $1 AND user_id = $2',
        [req.params.id, req.user.id]
      );

      if (sessionResult.rows.length === 0) {
        return res.status(404).json({ error: 'Session not found' });
      }

      const session = sessionResult.rows[0];

      // Get answers (with question details for Pro users)
      const answersResult = await pool.query(
        'SELECT * FROM m2_session_answers WHERE session_id = $1 ORDER BY question_order',
        [req.params.id]
      );

      const isPro = ['pro', 'elite', 'admin'].includes(req.user.tier);

      const answers = answersResult.rows.map(a => {
        const base = {
          order: a.question_order,
          category: a.category,
          difficulty: a.difficulty,
          selected_answer: a.selected_answer,
          correct_answer: a.correct_answer,
          is_correct: a.is_correct,
          time_spent_seconds: a.time_spent_seconds
        };

        if (isPro && a.generated_question) {
          base.question = a.generated_question;
        }

        return base;
      });

      // Check if percentile is estimated
      const countResult = await pool.query(
        'SELECT COUNT(*) as cnt FROM m2_assessment_sessions WHERE completed_at IS NOT NULL AND is_benchmark = true'
      );
      const totalAssessments = parseInt(countResult.rows[0].cnt);
      const isEstimated = totalAssessments < 100;

      res.json({
        session,
        answers,
        is_pro: isPro,
        is_estimated: isEstimated,
        total_assessments: totalAssessments
      });
    } catch (err) {
      console.error('Get results error:', err);
      res.status(500).json({ error: 'Failed to get results' });
    }
  });

  return router;
};
