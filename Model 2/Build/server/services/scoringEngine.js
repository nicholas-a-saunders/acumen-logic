/**
 * Scoring Engine
 *
 * Calculates scores from session answers and determines category breakdowns.
 */

function calculateScores(answers) {
  const totals = { overall: { correct: 0, total: 0 }, NR: { correct: 0, total: 0 }, DI: { correct: 0, total: 0 }, LR: { correct: 0, total: 0 } };

  for (const answer of answers) {
    totals.overall.total++;
    totals[answer.category].total++;

    if (answer.is_correct) {
      totals.overall.correct++;
      totals[answer.category].correct++;
    }
  }

  const percentage = totals.overall.total > 0
    ? Math.round(totals.overall.correct / totals.overall.total * 100)
    : 0;

  return {
    score_correct: totals.overall.correct,
    score_total: totals.overall.total,
    score_percentage: percentage,
    score_nr_correct: totals.NR.correct,
    score_nr_total: totals.NR.total,
    score_di_correct: totals.DI.correct,
    score_di_total: totals.DI.total,
    score_lr_correct: totals.LR.correct,
    score_lr_total: totals.LR.total
  };
}

function calculateTimeTaken(startedAt, completedAt) {
  if (!startedAt || !completedAt) return null;
  const start = new Date(startedAt);
  const end = new Date(completedAt);
  return Math.round((end - start) / 1000);
}

function getPerformanceTier(percentile) {
  if (percentile >= 90) return { label: 'Elite', color: '#C9A961' };
  if (percentile >= 75) return { label: 'Strong', color: '#4ade80' };
  if (percentile >= 50) return { label: 'Competitive', color: '#60a5fa' };
  if (percentile >= 25) return { label: 'Developing', color: '#facc15' };
  return { label: 'Needs Work', color: '#f87171' };
}

function getCategoryStrength(correct, total) {
  if (total === 0) return 'N/A';
  const pct = correct / total * 100;
  if (pct >= 80) return 'Strong';
  if (pct >= 60) return 'Average';
  return 'Weak';
}

function generateRecommendations(scores) {
  const recs = [];

  const categories = [
    { key: 'NR', name: 'Numerical Reasoning', correct: scores.score_nr_correct, total: scores.score_nr_total },
    { key: 'DI', name: 'Data Interpretation', correct: scores.score_di_correct, total: scores.score_di_total },
    { key: 'LR', name: 'Logical Reasoning', correct: scores.score_lr_correct, total: scores.score_lr_total }
  ];

  const sorted = categories
    .filter(c => c.total > 0)
    .sort((a, b) => (a.correct / a.total) - (b.correct / b.total));

  if (sorted.length > 0 && sorted[0].correct / sorted[0].total < 0.6) {
    recs.push({
      type: 'weakness',
      category: sorted[0].key,
      message: `Your ${sorted[0].name} score is below 60%. Focus on ${sorted[0].name} drills to improve.`
    });
  }

  if (scores.score_percentage < 50) {
    recs.push({
      type: 'general',
      message: 'Your overall score is below 50%. Consider taking category-specific drills to build foundational skills.'
    });
  } else if (scores.score_percentage >= 80) {
    recs.push({
      type: 'strength',
      message: 'Excellent performance! Try harder difficulty questions to push your percentile higher.'
    });
  }

  if (sorted.length >= 2) {
    const best = sorted[sorted.length - 1];
    const worst = sorted[0];
    const gap = (best.correct / best.total - worst.correct / worst.total) * 100;
    if (gap > 20) {
      recs.push({
        type: 'balance',
        message: `There's a ${Math.round(gap)}% gap between your strongest (${best.name}) and weakest (${worst.name}) categories. Balancing your skills will improve your overall percentile.`
      });
    }
  }

  return recs;
}

module.exports = { calculateScores, calculateTimeTaken, getPerformanceTier, getCategoryStrength, generateRecommendations };
