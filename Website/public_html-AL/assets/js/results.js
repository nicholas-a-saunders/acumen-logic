// Acumen Logic - Results Processing & Analytics
// Handles score calculation, percentile simulation, and results display

(function() {
  'use strict';

  // ============================================
  // CONFIGURATION
  // ============================================

  const CONFIG = {
    TOTAL_QUESTIONS: 20,
    PASS_THRESHOLD: 12, // 60% overall
    STRONG_THRESHOLD: 0.6, // 60% within category
    
    // Category weights for Big 4 vs Investment Banking
    CATEGORY_WEIGHTS: {
      BIG4: { NR: 0.35, DI: 0.40, LR: 0.25 },
      IB: { NR: 0.40, DI: 0.35, LR: 0.25 }
    },
    
    // Benchmark percentiles (Model 2 placeholder)
    BENCHMARKS: {
      MBB_AVERAGE: 82,
      BIG4_AVERAGE: 64,
      BANKING_AVERAGE: 70
    }
  };

  // ============================================
  // SCORE CALCULATION
  // ============================================

  const ScoreCalculator = {
    
    /**
     * Calculate raw scores by category
     * @param {Object} answers - Map of questionId -> selectedOption
     * @returns {Object} Scores for each category
     */
    calculateRawScores: function(answers) {
      const scores = {
        NR: { correct: 0, total: 7, questions: [] },
        DI: { correct: 0, total: 7, questions: [] },
        LR: { correct: 0, total: 6, questions: [] }
      };

      // Map question IDs to categories based on sequence
      const sequence = [1,8,15,2,9,16,3,10,17,4,11,18,5,12,19,6,13,20,7,14];
      
      sequence.forEach((qId, idx) => {
        const category = this.getCategory(idx + 1);
        const question = window.questions.find(q => q.id === qId);
        const isCorrect = answers[qId] === question.correct;
        
        scores[category].questions.push({
          id: qId,
          correct: isCorrect,
          selected: answers[qId],
          answer: question.correct
        });
        
        if (isCorrect) {
          scores[category].correct++;
        }
      });

      return scores;
    },

    /**
     * Get category for question number
     */
    getCategory: function(qNum) {
      const idx = (qNum - 1) % 3;
      return ['NR', 'DI', 'LR'][idx];
    },

    /**
     * Calculate weighted score for specific firm type
     */
    calculateWeightedScore: function(scores, firmType = 'BIG4') {
      const weights = CONFIG.CATEGORY_WEIGHTS[firmType] || CONFIG.CATEGORY_WEIGHTS.BIG4;
      
      const nrPct = scores.NR.correct / scores.NR.total;
      const diPct = scores.DI.correct / scores.DI.total;
      const lrPct = scores.LR.correct / scores.LR.total;
      
      return {
        NR: Math.round(nrPct * 100),
        DI: Math.round(diPct * 100),
        LR: Math.round(lrPct * 100),
        overall: Math.round((nrPct * weights.NR + diPct * weights.DI + lrPct * weights.LR) * 100)
      };
    },

    /**
     * Calculate simple percentage scores
     */
    calculatePercentages: function(scores) {
      return {
        NR: Math.round((scores.NR.correct / scores.NR.total) * 100),
        DI: Math.round((scores.DI.correct / scores.DI.total) * 100),
        LR: Math.round((scores.LR.correct / scores.LR.total) * 100),
        overall: Math.round(
          ((scores.NR.correct + scores.DI.correct + scores.LR.correct) / CONFIG.TOTAL_QUESTIONS) * 100
        )
      };
    },

    /**
     * Determine strength/weakness classification
     */
    classifyStrengths: function(percentages) {
      return {
        NR: {
          level: percentages.NR >= 60 ? 'Strong' : 'Weak',
          score: percentages.NR,
          priority: this.calculatePriority(percentages.NR)
        },
        DI: {
          level: percentages.DI >= 60 ? 'Strong' : 'Weak',
          score: percentages.DI,
          priority: this.calculatePriority(percentages.DI)
        },
        LR: {
          level: percentages.LR >= 60 ? 'Strong' : 'Weak',
          score: percentages.LR,
          priority: this.calculatePriority(percentages.LR)
        }
      };
    },

    /**
     * Calculate training priority (1 = highest)
     */
    calculatePriority: function(percentage) {
      if (percentage < 40) return 1; // Critical
      if (percentage < 60) return 2; // Weak
      if (percentage < 80) return 3; // Developing
      return 4; // Strong
    },

    /**
     * Identify primary bottleneck
     */
    identifyBottleneck: function(classifications) {
      const sorted = Object.entries(classifications)
        .sort((a, b) => a[1].priority - b[1].priority);
      
      return {
        primary: sorted[0][0],
        secondary: sorted[1][0] !== sorted[0][0] && sorted[1][1].priority <= 2 ? sorted[1][0] : null,
        categories: classifications
      };
    },

    /**
     * Simulate percentile (Model 1 approximation)
     * In Model 2, this would query actual database
     */
    estimatePercentile: function(overallScore) {
      // Rough approximation based on score distribution
      const percentiles = {
        95: 99, 90: 95, 85: 90, 80: 85, 75: 80,
        70: 75, 65: 70, 60: 65, 55: 60, 50: 55,
        45: 50, 40: 45, 35: 40, 30: 35, 25: 30,
        20: 25, 15: 20, 10: 15, 5: 10, 0: 5
      };
      
      const floorScore = Math.floor(overallScore / 5) * 5;
      return percentiles[floorScore] || 50;
    },

    /**
     * Generate comparative analysis
     */
    generateComparison: function(percentages, targetFirm) {
      const benchmarks = [];
      
      // MBB comparison
      benchmarks.push({
        name: 'MBB Average',
        percentile: CONFIG.BENCHMARKS.MBB_AVERAGE,
        yourScore: percentages.overall,
        difference: percentages.overall - CONFIG.BENCHMARKS.MBB_AVERAGE
      });
      
      // Big 4 comparison
      benchmarks.push({
        name: 'Big 4 Average',
        percentile: CONFIG.BENCHMARKS.BIG4_AVERAGE,
        yourScore: percentages.overall,
        difference: percentages.overall - CONFIG.BENCHMARKS.BIG4_AVERAGE
      });
      
      // Investment Banking comparison
      if (targetFirm && ['goldman', 'jpmorgan', 'barclays'].includes(targetFirm)) {
        benchmarks.push({
          name: 'Investment Banking Average',
          percentile: CONFIG.BENCHMARKS.BANKING_AVERAGE,
          yourScore: percentages.overall,
          difference: percentages.overall - CONFIG.BENCHMARKS.BANKING_AVERAGE
        });
      }
      
      return benchmarks.sort((a, b) => b.difference - a.difference);
    },

    /**
     * Calculate time performance
     */
    analyzeTimePerformance: function(timeRemaining, answers) {
      const timeUsed = 1500 - timeRemaining; // 25 minutes = 1500 seconds
      const avgTimePerQuestion = timeUsed / Object.keys(answers).length;
      const questionsAnswered = Object.keys(answers).length;
      const completionRate = (questionsAnswered / CONFIG.TOTAL_QUESTIONS) * 100;
      
      return {
        timeUsed: timeUsed,
        timeRemaining: timeRemaining,
        avgTimePerQuestion: Math.round(avgTimePerQuestion),
        completionRate: completionRate,
        pace: avgTimePerQuestion < 60 ? 'Fast' : avgTimePerQuestion < 90 ? 'Standard' : 'Slow'
      };
    }
  };

  // ============================================
  // RESULTS FORMATTING
  // ============================================

  const ResultsFormatter = {
    
    /**
     * Format score for display
     */
    formatScore: function(score, total) {
      return `${score}/${total}`;
    },

    /**
     * Format percentage
     */
    formatPercent: function(value) {
      return `${Math.round(value)}%`;
    },

    /**
     * Format time
     */
    formatTime: function(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    },

    /**
     * Get category full name
     */
    getCategoryName: function(code) {
      const names = {
        'NR': 'Numerical Reasoning',
        'DI': 'Data Interpretation',
        'LR': 'Logical Reasoning'
      };
      return names[code] || code;
    },

    /**
     * Get recommendation based on bottleneck
     */
    getRecommendation: function(bottleneck) {
      const recommendations = {
        'NR': {
          title: 'Numerical Reasoning Focus',
          description: 'Your calculations need strengthening. Focus on percentage shortcuts, ratio handling, and mental math fluency.',
          modules: ['Module 1: Foundations & Calculation Speed', 'Module 3: Numerical Reasoning Systems']
        },
        'DI': {
          title: 'Data Interpretation Focus',
          description: 'Multi-table integration is your bottleneck. Practice structured data extraction and cross-referencing techniques.',
          modules: ['Module 2: Data Interpretation Architecture', 'Module 4: Multi-Table Integration']
        },
        'LR': {
          title: 'Logical Reasoning Focus',
          description: 'Your logical inference needs work. Focus on syllogistic reasoning, pattern recognition, and conditional logic.',
          modules: ['Module 3: Numerical Reasoning Systems (Logic Gates)', 'Module 5: Pressure Protocols']
        }
      };
      
      const rec = recommendations[bottleneck.primary];
      
      if (bottleneck.secondary) {
        rec.description += ` Your secondary focus should be ${this.getCategoryName(bottleneck.secondary)}.`;
      }
      
      return rec;
    },

    /**
     * Generate email report content
     */
    generateEmailReport: function(results) {
      const { scores, percentages, classifications, bottleneck, timeAnalysis } = results;
      
      return `
Your Acumen Logic Diagnostic Results

Overall Score: ${percentages.overall}% (${scores.NR.correct + scores.DI.correct + scores.LR.correct}/${CONFIG.TOTAL_QUESTIONS})
Estimated Percentile: ${results.estimatedPercentile}th

Category Breakdown:
• Numerical Reasoning: ${percentages.NR}% (${scores.NR.correct}/${scores.NR.total}) - ${classifications.NR.level}
• Data Interpretation: ${percentages.DI}% (${scores.DI.correct}/${scores.DI.total}) - ${classifications.DI.level}
• Logical Reasoning: ${percentages.LR}% (${scores.LR.correct}/${scores.LR.total}) - ${classifications.LR.level}

Your Primary Focus: ${this.getCategoryName(bottleneck.primary)}

${results.recommendation.description}

Recommended Training:
${results.recommendation.modules.map(m => `• ${m}`).join('\n')}

Time Performance: ${timeAnalysis.pace} pace (${timeAnalysis.avgTimePerQuestion}s per question)

Next Steps:
1. Review your detailed answers in the diagnostic review mode
2. Begin training with your priority modules
3. Retake diagnostic after 2 weeks to measure improvement

Access your training: https://acumenlogic.co.uk/masterclass.html
      `.trim();
    }
  };

  // ============================================
  // PUBLIC API
  // ============================================

  window.ResultsProcessor = {
    
    /**
     * Process complete results from diagnostic
     */
    process: function(answers, timeRemaining, userData) {
      // Calculate all metrics
      const rawScores = ScoreCalculator.calculateRawScores(answers);
      const percentages = ScoreCalculator.calculatePercentages(rawScores);
      const weightedBig4 = ScoreCalculator.calculateWeightedScore(rawScores, 'BIG4');
      const weightedIB = ScoreCalculator.calculateWeightedScore(rawScores, 'IB');
      const classifications = ScoreCalculator.classifyStrengths(percentages);
      const bottleneck = ScoreCalculator.identifyBottleneck(classifications);
      const estimatedPercentile = ScoreCalculator.estimatePercentile(percentages.overall);
      const comparison = ScoreCalculator.generateComparison(percentages, userData.firm);
      const timeAnalysis = ScoreCalculator.analyzeTimePerformance(timeRemaining, answers);
      const recommendation = ResultsFormatter.getRecommendation(bottleneck);
      
      // Compile complete results object
      const results = {
        timestamp: new Date().toISOString(),
        user: userData,
        scores: rawScores,
        percentages: percentages,
        weighted: {
          big4: weightedBig4,
          ib: weightedIB
        },
        classifications: classifications,
        bottleneck: bottleneck,
        estimatedPercentile: estimatedPercentile,
        comparison: comparison,
        timeAnalysis: timeAnalysis,
        recommendation: recommendation,
        
        // Summary for display
        summary: {
          overall: `${Math.round(percentages.overall)}%`,
          totalCorrect: rawScores.NR.correct + rawScores.DI.correct + rawScores.LR.correct,
          totalQuestions: CONFIG.TOTAL_QUESTIONS,
          categoryScores: {
            NR: `${rawScores.NR.correct}/${rawScores.NR.total}`,
            DI: `${rawScores.DI.correct}/${rawScores.DI.total}`,
            LR: `${rawScores.LR.correct}/${rawScores.LR.total}`
          },
          strongest: Object.entries(classifications)
            .sort((a, b) => b[1].score - a[1].score)[0][0],
          weakest: bottleneck.primary
        }
      };
      
      // Store for later use
      sessionStorage.setItem('acumenProcessedResults', JSON.stringify(results));
      
      return results;
    },

    /**
     * Get stored results
     */
    getStoredResults: function() {
      const stored = sessionStorage.getItem('acumenProcessedResults');
      return stored ? JSON.parse(stored) : null;
    },

    /**
     * Generate report data for Zapier/Kit
     */
    generateReportData: function(results) {
      return {
        email_content: ResultsFormatter.generateEmailReport(results),
        tags: this.generateTags(results),
        custom_fields: {
          overall_score: results.percentages.overall,
          nr_score: results.percentages.NR,
          di_score: results.percentages.DI,
          lr_score: results.percentages.LR,
          nr_level: results.classifications.NR.level,
          di_level: results.classifications.DI.level,
          lr_level: results.classifications.LR.level,
          primary_bottleneck: results.bottleneck.primary,
          estimated_percentile: results.estimatedPercentile,
          time_pace: results.timeAnalysis.pace
        }
      };
    },

    /**
     * Generate email tags based on results
     */
    generateTags: function(results) {
      const tags = ['diagnostic-completed'];
      
      // Category strength tags
      Object.entries(results.classifications).forEach(([cat, data]) => {
        tags.push(`${cat.toLowerCase()}-${data.level.toLowerCase()}`);
      });
      
      // Overall performance tags
      if (results.percentages.overall >= 80) tags.push('high-performer');
      else if (results.percentages.overall >= 60) tags.push('solid-performer');
      else tags.push('needs-development');
      
      // Bottleneck tag
      tags.push(`focus-${results.bottleneck.primary.toLowerCase()}`);
      
      return tags;
    },

    /**
     * Check if user passes basic threshold
     */
    isPass: function(percentages) {
      return percentages.overall >= 60;
    },

    /**
     * Get training track recommendation
     */
    getTrainingTrack: function(results) {
      const score = results.percentages.overall;
      
      if (score >= 80) {
        return {
          track: 'Advanced',
          description: 'Focus on speed optimisation and complex multi-table scenarios.',
          modules: [4, 5, 6]
        };
      } else if (score >= 60) {
        return {
          track: 'Standard',
          description: 'Complete all modules with emphasis on your weak categories.',
          modules: [1, 2, 3, 4, 5, 6]
        };
      } else {
        return {
          track: 'Intensive',
          description: 'Extended focus on foundations before advancing.',
          modules: [1, 1, 2, 3, 4, 5, 6] // Module 1 repeated
        };
      }
    }
  };

})();