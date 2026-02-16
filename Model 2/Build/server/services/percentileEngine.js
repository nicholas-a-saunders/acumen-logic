/**
 * Percentile Engine
 *
 * Calculates percentile rankings based on all benchmark assessment data
 * plus simulated seed data. Caches results for performance.
 */

const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour
const REAL_DATA_THRESHOLD = 1000; // Show "Estimated" until this many real results

let cache = {};

async function calculatePercentile(pool, score, category) {
  const cacheKey = category || 'overall';
  const cached = cache[cacheKey];

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION_MS) {
    return computeFromDistribution(cached.scores, score, cached.totalReal);
  }

  // Fetch real benchmark scores
  let realScores;
  if (category) {
    const colCorrect = `score_${category.toLowerCase()}_correct`;
    const colTotal = `score_${category.toLowerCase()}_total`;
    const result = await pool.query(
      `SELECT CASE WHEN ${colTotal} > 0 THEN ROUND(${colCorrect}::numeric / ${colTotal} * 100) ELSE 0 END as pct
       FROM m2_assessment_sessions
       WHERE is_benchmark = TRUE AND completed_at IS NOT NULL AND ${colTotal} > 0`
    );
    realScores = result.rows.map(r => parseInt(r.pct));
  } else {
    const result = await pool.query(
      `SELECT score_percentage as pct FROM m2_assessment_sessions
       WHERE is_benchmark = TRUE AND completed_at IS NOT NULL AND score_percentage IS NOT NULL`
    );
    realScores = result.rows.map(r => parseInt(r.pct));
  }

  // Fetch seed data
  let seedScores;
  if (category) {
    const colMap = { NR: 'score_nr', DI: 'score_di', LR: 'score_lr' };
    const col = colMap[category];
    const seedResult = await pool.query(
      `SELECT ${col} as pct FROM m2_seed_data WHERE ${col} IS NOT NULL`
    );
    seedScores = seedResult.rows.map(r => parseInt(r.pct));
  } else {
    const seedResult = await pool.query(
      'SELECT score_percentage as pct FROM m2_seed_data'
    );
    seedScores = seedResult.rows.map(r => parseInt(r.pct));
  }

  const allScores = [...realScores, ...seedScores];

  cache[cacheKey] = {
    scores: allScores,
    totalReal: realScores.length,
    timestamp: Date.now()
  };

  return computeFromDistribution(allScores, score, realScores.length);
}

function computeFromDistribution(scores, targetScore, totalReal) {
  if (scores.length === 0) {
    return { percentile: 50, isEstimated: true, totalAssessments: 0 };
  }

  const below = scores.filter(s => s < targetScore).length;
  const equal = scores.filter(s => s === targetScore).length;
  const percentile = Math.round((below + equal * 0.5) / scores.length * 100);

  return {
    percentile: Math.min(99, Math.max(1, percentile)),
    isEstimated: totalReal < REAL_DATA_THRESHOLD,
    totalAssessments: scores.length,
    totalReal: totalReal
  };
}

async function getDistribution(pool, category) {
  const cacheKey = (category || 'overall') + '_dist';
  const cached = cache[cacheKey];

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION_MS) {
    return cached.data;
  }

  let query;
  if (category) {
    const colCorrect = `score_${category.toLowerCase()}_correct`;
    const colTotal = `score_${category.toLowerCase()}_total`;
    query = `
      SELECT bucket, COUNT(*) as count FROM (
        SELECT CASE
          WHEN pct >= 90 THEN '90-100'
          WHEN pct >= 80 THEN '80-89'
          WHEN pct >= 70 THEN '70-79'
          WHEN pct >= 60 THEN '60-69'
          WHEN pct >= 50 THEN '50-59'
          WHEN pct >= 40 THEN '40-49'
          WHEN pct >= 30 THEN '30-39'
          WHEN pct >= 20 THEN '20-29'
          WHEN pct >= 10 THEN '10-19'
          ELSE '0-9'
        END as bucket
        FROM (
          SELECT ROUND(${colCorrect}::numeric / NULLIF(${colTotal}, 0) * 100) as pct
          FROM m2_assessment_sessions
          WHERE is_benchmark = TRUE AND completed_at IS NOT NULL AND ${colTotal} > 0
          UNION ALL
          SELECT ${category === 'NR' ? 'score_nr' : category === 'DI' ? 'score_di' : 'score_lr'} as pct FROM m2_seed_data
        ) scores
      ) bucketed
      GROUP BY bucket ORDER BY bucket`;
  } else {
    query = `
      SELECT bucket, COUNT(*) as count FROM (
        SELECT CASE
          WHEN pct >= 90 THEN '90-100'
          WHEN pct >= 80 THEN '80-89'
          WHEN pct >= 70 THEN '70-79'
          WHEN pct >= 60 THEN '60-69'
          WHEN pct >= 50 THEN '50-59'
          WHEN pct >= 40 THEN '40-49'
          WHEN pct >= 30 THEN '30-39'
          WHEN pct >= 20 THEN '20-29'
          WHEN pct >= 10 THEN '10-19'
          ELSE '0-9'
        END as bucket
        FROM (
          SELECT score_percentage as pct FROM m2_assessment_sessions
          WHERE is_benchmark = TRUE AND completed_at IS NOT NULL AND score_percentage IS NOT NULL
          UNION ALL
          SELECT score_percentage as pct FROM m2_seed_data
        ) scores
      ) bucketed
      GROUP BY bucket ORDER BY bucket`;
  }

  const result = await pool.query(query);
  const data = result.rows.map(r => ({ bucket: r.bucket, count: parseInt(r.count) }));

  cache[cacheKey] = { data, timestamp: Date.now() };
  return data;
}

function clearCache() {
  cache = {};
}

module.exports = { calculatePercentile, getDistribution, clearCache };
