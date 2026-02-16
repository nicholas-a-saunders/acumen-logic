// Acumen Logic - Diagnostic Assessment Engine
// Handles 20-question assessment with timer, scoring, and results

(function() {
  'use strict';

  // ============================================
  // CONFIGURATION
  // ============================================

  const CONFIG = {
    TOTAL_QUESTIONS: 20,
    DURATION: 1500, // 25 minutes in seconds
    WARNING_THRESHOLD: 120, // 2 minutes warning
    CATEGORIES: {
      NR: 'Numerical Reasoning',
      DI: 'Data Interpretation',
      LR: 'Logical Reasoning'
    }
  };

  // Question sequence: NR, DI, LR repeating (7 NR, 7 DI, 6 LR)
  const QUESTION_SEQUENCE = [
    1, 8, 15, 2, 9, 16, 3, 10, 17, 4, 11, 18, 5, 12, 19, 6, 13, 20, 7, 14
  ];

  // ============================================
  // STATE
  // ============================================

  let state = {
    currentQuestion: 1,
    timeRemaining: CONFIG.DURATION,
    answers: {},
    userData: {},
    timer: null,
    isComplete: false
  };

  // ============================================
  // DOM ELEMENTS
  // ============================================

  const elements = {
    landing: document.getElementById('landing'),
    assessment: document.getElementById('assessment'),
    results: document.getElementById('results'),
    review: document.getElementById('review'),
    startForm: document.getElementById('startForm'),
    questionContainer: document.getElementById('questionContainer'),
    currentQ: document.getElementById('currentQ'),
    progressBar: document.getElementById('progressBar'),
    timer: document.getElementById('timer'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    catNr: document.getElementById('cat-nr'),
    catDi: document.getElementById('cat-di'),
    catLr: document.getElementById('cat-lr'),
    nrScore: document.getElementById('nrScore'),
    diScore: document.getElementById('diScore'),
    lrScore: document.getElementById('lrScore'),
    nrLabel: document.getElementById('nrLabel'),
    diLabel: document.getElementById('diLabel'),
    lrLabel: document.getElementById('lrLabel'),
    focusArea: document.getElementById('focusArea'),
    reviewContainer: document.getElementById('reviewContainer')
  };

  // ============================================
  // CATEGORY UTILITIES
  // ============================================

  function getCategory(questionNum) {
    const idx = (questionNum - 1) % 3;
    return ['NR', 'DI', 'LR'][idx];
  }

  function getCategoryClass(category) {
    const classes = {
      'NR': 'bg-gold-400/20 text-gold-400',
      'DI': 'bg-blue-400/20 text-blue-400',
      'LR': 'bg-purple-400/20 text-purple-400'
    };
    return classes[category] || 'bg-navy-900 text-slate-500';
  }

  // ============================================
  // TIMER FUNCTIONS
  // ============================================

  function startTimer() {
    updateTimerDisplay();
    
    state.timer = setInterval(() => {
      state.timeRemaining--;
      updateTimerDisplay();
      
      if (state.timeRemaining <= CONFIG.WARNING_THRESHOLD) {
        elements.timer.classList.add('timer-warning');
      }
      
      if (state.timeRemaining <= 0) {
        finishAssessment();
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const minutes = Math.floor(state.timeRemaining / 60);
    const seconds = state.timeRemaining % 60;
    elements.timer.textContent = 
      `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  function stopTimer() {
    clearInterval(state.timer);
  }

  // ============================================
  // QUESTION RENDERING
  // ============================================

  function loadQuestion(qNum) {
    state.currentQuestion = qNum;
    const questionId = QUESTION_SEQUENCE[qNum - 1];
    const question = window.questions.find(q => q.id === questionId);
    const category = getCategory(qNum);

    // Update progress
    elements.currentQ.textContent = qNum;
    elements.progressBar.style.width = `${(qNum / CONFIG.TOTAL_QUESTIONS) * 100}%`;

    // Update category indicators
    elements.catNr.className = `px-2 py-1 rounded text-xs font-medium ${category === 'NR' ? getCategoryClass('NR') : 'bg-navy-900 text-slate-500'}`;
    elements.catDi.className = `px-2 py-1 rounded text-xs font-medium ${category === 'DI' ? getCategoryClass('DI') : 'bg-navy-900 text-slate-500'}`;
    elements.catLr.className = `px-2 py-1 rounded text-xs font-medium ${category === 'LR' ? getCategoryClass('LR') : 'bg-navy-900 text-slate-500'}`;

    // Update buttons
    elements.prevBtn.disabled = qNum === 1;
    elements.nextBtn.textContent = qNum === CONFIG.TOTAL_QUESTIONS ? 'Finish' : 'Next Question';

    // Build question HTML
    let html = `
      <div class="mb-6">
        <div class="flex items-center gap-3 mb-3">
          <span class="px-3 py-1 rounded-full text-xs font-medium ${getCategoryClass(category)}">
            ${CONFIG.CATEGORIES[category]}
          </span>
          <span class="text-xs text-slate-500">Question ${qNum} of ${CONFIG.TOTAL_QUESTIONS}</span>
        </div>
        <h3 class="text-lg font-medium text-white leading-relaxed">${escapeHtml(question.text)}</h3>
      </div>
    `;

    // Add table if present
    if (question.table) {
      html += `
        <div class="mb-6 overflow-x-auto glass-effect rounded-lg p-4 border border-gold-400/10">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gold-400/20">
                ${question.table.headers.map(h => `<th class="text-left py-2 px-3 text-gold-400 font-semibold text-xs uppercase tracking-wide">${escapeHtml(h)}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${question.table.rows.map(row => `
                <tr class="border-b border-gold-400/10 last:border-0">
                  ${row.map(cell => `<td class="py-2 px-3 text-slate-300 font-mono text-sm">${escapeHtml(cell)}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    // Add options
    html += `<div class="space-y-3">`;
    question.options.forEach((opt, idx) => {
      const isSelected = state.answers[questionId] === idx;
      const selectedClass = isSelected 
        ? 'border-gold-400 bg-gold-400/10 text-white' 
        : 'border-gold-400/20 text-slate-300 hover:border-gold-400/50 hover:bg-gold-400/5';
      
      html += `
        <button 
          onclick="diagnostic.selectAnswer(${questionId}, ${idx})" 
          class="w-full p-4 text-left rounded-lg border-2 ${selectedClass} transition-all duration-200 flex items-start gap-3"
        >
          <span class="flex-shrink-0 w-6 h-6 rounded-full border-2 ${isSelected ? 'border-gold-400 bg-gold-400 text-navy-900' : 'border-slate-600 text-slate-500'} flex items-center justify-center text-xs font-bold mt-0.5">
            ${String.fromCharCode(65 + idx)}
          </span>
          <span class="text-sm leading-relaxed">${escapeHtml(opt)}</span>
        </button>
      `;
    });
    html += `</div>`;

    elements.questionContainer.innerHTML = html;
  }

  // ============================================
  // ANSWER HANDLING
  // ============================================

  function selectAnswer(questionId, optionIdx) {
    state.answers[questionId] = optionIdx;
    loadQuestion(state.currentQuestion);
  }

  function prevQuestion() {
    if (state.currentQuestion > 1) {
      loadQuestion(state.currentQuestion - 1);
    }
  }

  function nextQuestion() {
    if (state.currentQuestion < CONFIG.TOTAL_QUESTIONS) {
      loadQuestion(state.currentQuestion + 1);
    } else {
      finishAssessment();
    }
  }

  // ============================================
  // ASSESSMENT COMPLETION
  // ============================================

  function finishAssessment() {
    stopTimer();
    state.isComplete = true;

    // Calculate scores
    const scores = calculateScores();
    
    // Store results
    const results = {
      ...scores,
      answers: state.answers,
      user: state.userData,
      timeRemaining: state.timeRemaining,
      timestamp: new Date().toISOString()
    };
    
    sessionStorage.setItem('acumenResults', JSON.stringify(results));

    // Send to Zapier
    sendToZapier(results);

    // Show results
    showResults(scores);
  }

  function calculateScores() {
    let nrCorrect = 0, diCorrect = 0, lrCorrect = 0;
    let nrTotal = 0, diTotal = 0, lrTotal = 0;

    QUESTION_SEQUENCE.forEach((qId, idx) => {
      const q = window.questions.find(question => question.id === qId);
      const cat = getCategory(idx + 1);
      const isCorrect = state.answers[qId] === q.correct;

      if (cat === 'NR') {
        nrTotal++;
        if (isCorrect) nrCorrect++;
      } else if (cat === 'DI') {
        diTotal++;
        if (isCorrect) diCorrect++;
      } else {
        lrTotal++;
        if (isCorrect) lrCorrect++;
      }
    });

    return {
      nr: nrCorrect,
      di: diCorrect,
      lr: lrCorrect,
      nrTotal,
      diTotal,
      lrTotal,
      total: nrCorrect + diCorrect + lrCorrect
    };
  }

  // ============================================
  // ZAPIER INTEGRATION
  // ============================================

  function sendToZapier(results) {
    // Replace with your actual Zapier webhook URL
    const webhookUrl = 'https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_ID/';
    
    const payload = {
      name: results.user.name,
      email: results.user.email,
      firm: results.user.firm || 'Not specified',
      marketing_consent: results.user.consent,
      nr_score: `${results.nr}/${results.nrTotal}`,
      di_score: `${results.di}/${results.diTotal}`,
      lr_score: `${results.lr}/${results.lrTotal}`,
      total_score: `${results.total}/${CONFIG.TOTAL_QUESTIONS}`,
      time_remaining: formatTime(results.timeRemaining),
      timestamp: results.timestamp,
      source: window.location.href
    };

    // Send to Zapier
    fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      mode: 'no-cors' // Required for Zapier webhooks
    }).catch(err => {
      console.log('Zapier webhook failed, queued for retry:', err);
      // Store failed submissions for retry
      queueFailedSubmission(payload);
    });

    // Also send to Kit if email provided
    if (results.user.email && results.user.consent) {
      sendToKit(results);
    }
  }

  function sendToKit(results) {
    // Replace with your Kit (ConvertKit) API endpoint or form ID
    const kitFormId = 'YOUR_KIT_FORM_ID';
    const kitUrl = `https://api.convertkit.com/v3/forms/${kitFormId}/subscribe`;
    
    const payload = {
      email: results.user.email,
      first_name: results.user.name.split(' ')[0],
      fields: {
        overall_score: `${results.total}/${CONFIG.TOTAL_QUESTIONS}`,
        numerical_score: results.nr,
        data_score: results.di,
        logical_score: results.lr,
        target_firm: results.user.firm || ''
      },
      tags: determineTags(results)
    };

    fetch(kitUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(err => console.log('Kit submission failed:', err));
  }

  function determineTags(results) {
    const tags = ['diagnostic-completed'];
    
    if (results.nr >= 4) tags.push('nr-strong');
    else tags.push('nr-weak');
    
    if (results.di >= 4) tags.push('di-strong');
    else tags.push('di-weak');
    
    if (results.lr >= 3) tags.push('lr-strong');
    else tags.push('lr-weak');
    
    return tags;
  }

  function queueFailedSubmission(payload) {
    const queue = JSON.parse(localStorage.getItem('acumenFailedSubmissions') || '[]');
    queue.push({ payload, timestamp: Date.now() });
    localStorage.setItem('acumenFailedSubmissions', JSON.stringify(queue));
  }

  // ============================================
  // RESULTS DISPLAY
  // ============================================

  function showResults(scores) {
    elements.assessment.classList.add('hidden');
    elements.results.classList.remove('hidden');

    // Update score displays
    elements.nrScore.textContent = `${scores.nr}/${scores.nrTotal}`;
    elements.diScore.textContent = `${scores.di}/${scores.diTotal}`;
    elements.lrScore.textContent = `${scores.lr}/${scores.lrTotal}`;

    // Determine strength/weakness
    const nrStrength = scores.nr >= 4 ? 'Strong' : 'Weak';
    const diStrength = scores.di >= 4 ? 'Strong' : 'Weak';
    const lrStrength = scores.lr >= 3 ? 'Strong' : 'Weak';

    elements.nrLabel.textContent = nrStrength;
    elements.diLabel.textContent = diStrength;
    elements.lrLabel.textContent = lrStrength;

    // Color code labels
    elements.nrLabel.className = `text-xs mt-1 ${nrStrength === 'Strong' ? 'text-green-400' : 'text-red-400'}`;
    elements.diLabel.className = `text-xs mt-1 ${diStrength === 'Strong' ? 'text-green-400' : 'text-red-400'}`;
    elements.lrLabel.className = `text-xs mt-1 ${lrStrength === 'Strong' ? 'text-green-400' : 'text-red-400'}`;

    // Find weakest category
    const categories = [
      { name: 'Numerical Reasoning', score: scores.nr, max: scores.nrTotal, ratio: scores.nr / scores.nrTotal },
      { name: 'Data Interpretation', score: scores.di, max: scores.diTotal, ratio: scores.di / scores.diTotal },
      { name: 'Logical Reasoning', score: scores.lr, max: scores.lrTotal, ratio: scores.lr / scores.lrTotal }
    ];
    
    const weakest = categories.sort((a, b) => a.ratio - b.ratio)[0];
    
    elements.focusArea.innerHTML = 
      `Your <strong class="text-gold-400">${weakest.name}</strong> score (${weakest.score}/${weakest.max}) indicates this is your primary bottleneck. ` +
      `The training programme includes targeted modules to strengthen this specific area.`;
  }

  // ============================================
  // REVIEW MODE
  // ============================================

  function reviewAnswers() {
    elements.results.classList.add('hidden');
    elements.review.classList.remove('hidden');

    const results = JSON.parse(sessionStorage.getItem('acumenResults'));
    let html = '';

    QUESTION_SEQUENCE.forEach((qId, idx) => {
      const q = window.questions.find(question => question.id === qId);
      const userAnswer = results.answers[qId];
      const isCorrect = userAnswer === q.correct;
      const category = getCategory(idx + 1);

      html += `
        <div class="glass-effect rounded-xl p-6 border ${isCorrect ? 'border-green-400/20' : 'border-red-400/20'}">
          <div class="flex items-start justify-between mb-4">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="px-2 py-1 rounded text-xs font-medium ${getCategoryClass(category)}">${category}</span>
                <span class="text-xs text-slate-500">Question ${idx + 1}</span>
              </div>
              <p class="text-white font-medium">${escapeHtml(q.text)}</p>
            </div>
            ${isCorrect 
              ? '<span class="px-3 py-1 rounded-full bg-green-400/10 text-green-400 text-xs font-semibold">Correct</span>'
              : '<span class="px-3 py-1 rounded-full bg-red-400/10 text-red-400 text-xs font-semibold">Incorrect</span>'
            }
          </div>
          
          <div class="space-y-2 mb-4">
            ${q.options.map((opt, i) => {
              let classes = 'p-3 rounded-lg border text-sm flex items-start gap-3 ';
              if (i === q.correct) {
                classes += 'border-green-400 bg-green-400/5 text-green-400';
              } else if (i === userAnswer && !isCorrect) {
                classes += 'border-red-400 bg-red-400/5 text-red-400';
              } else {
                classes += 'border-gold-400/10 text-slate-400';
              }
              return `
                <div class="${classes}">
                  <span class="flex-shrink-0 w-5 h-5 rounded-full border-2 ${i === q.correct ? 'border-green-400 bg-green-400 text-navy-900' : (i === userAnswer ? 'border-red-400' : 'border-slate-600')} flex items-center justify-center text-xs font-bold">
                    ${String.fromCharCode(65 + i)}
                  </span>
                  <span>${escapeHtml(opt)}</span>
                </div>
              `;
            }).join('')}
          </div>

          <div class="p-4 bg-navy-800/50 rounded-lg border border-gold-400/10">
            <p class="text-sm text-slate-300">
              <strong class="text-gold-400">Explanation:</strong> ${escapeHtml(q.explanation)}
            </p>
          </div>
        </div>
      `;
    });

    elements.reviewContainer.innerHTML = html;
  }

  function closeReview() {
    elements.review.classList.add('hidden');
    elements.results.classList.remove('hidden');
  }

  // ============================================
  // INITIALISATION
  // ============================================

  function startAssessment(e) {
    e.preventDefault();
    
    // Collect user data
    state.userData = {
      name: document.getElementById('userName').value.trim(),
      email: document.getElementById('userEmail').value.trim(),
      firm: document.getElementById('targetFirm').value,
      consent: document.getElementById('marketingConsent').checked,
      startedAt: new Date().toISOString()
    };

    // Validate
    if (!state.userData.name || !state.userData.email) {
      alert('Please enter your name and email to continue.');
      return;
    }

    // Switch views
    elements.landing.classList.add('hidden');
    elements.assessment.classList.remove('hidden');

    // Start
    startTimer();
    loadQuestion(1);
  }

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // ============================================
  // PUBLIC API
  // ============================================

  window.diagnostic = {
    start: startAssessment,
    selectAnswer: selectAnswer,
    prevQuestion: prevQuestion,
    nextQuestion: nextQuestion,
    reviewAnswers: reviewAnswers,
    closeReview: closeReview
  };

  // Initialise form handler if on diagnostic page
  if (elements.startForm) {
    elements.startForm.addEventListener('submit', startAssessment);
    elements.prevBtn.addEventListener('click', prevQuestion);
    elements.nextBtn.addEventListener('click', nextQuestion);
  }

})();