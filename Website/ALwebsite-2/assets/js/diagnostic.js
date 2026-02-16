// Acumen Logic - Diagnostic Assessment Engine
// Handles 20-question assessment with timer, scoring, and results

(function() {
  'use strict';

  // ============================================
  // CONFIGURATION
  // ============================================

  const CONFIG = {
    TOTAL_QUESTIONS: 20,
    DURATION: 900, // 15 minutes in seconds
    WARNING_THRESHOLD: 120, // 2 minutes warning
    CATEGORIES: {
      NR: 'Numerical Reasoning',
      DI: 'Data Interpretation',
      LR: 'Logical Reasoning'
    }
  };

  // Progressive sequence: easier to harder across the full diagnostic
  const QUESTION_SEQUENCE = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
  ];
  const STORAGE_KEY = 'acumenDiagnosticStateV2';
  const RESULTS_STORAGE_KEY = 'acumenResultsV1';
  const LEAD_ENDPOINT = '/api/lead';
  const KIT_ENABLED = false;
  const LEAD_QUEUE_KEY = 'acumenLeadQueueV1';
  const RETRY_SCHEDULE_MS = [5000, 15000, 45000, 120000, 300000];
  const MAX_LEAD_ATTEMPTS = 5;
  const DEBUG_MODE = new URLSearchParams(window.location.search).get('debug') === '1';

  // ============================================
  // STATE
  // ============================================

  let state = {
    currentQuestion: 1,
    timeRemaining: CONFIG.DURATION,
    answers: {},
    userData: {},
    timer: null,
    isComplete: false,
    submitLocked: false
  };
  let isFlushingQueue = false;
  let isFinishing = false;
  let answerKeyErrorShown = false;

  // ============================================
  // PERSISTENCE
  // ============================================

  function debugLog(eventName, data) {
    if (!DEBUG_MODE) return;
    if (data === undefined) {
      console.log(`[diagnostic] ${eventName}`);
      return;
    }
    console.log(`[diagnostic] ${eventName}`, data);
  }

  function safeGetStorage(storage, key) {
    try {
      return storage.getItem(key);
    } catch (err) {
      debugLog('storage-read-failed', { key, error: err.message });
      return null;
    }
  }

  function safeSetStorage(storage, key, value) {
    try {
      storage.setItem(key, value);
      return true;
    } catch (err) {
      debugLog('storage-write-failed', { key, error: err.message });
      return false;
    }
  }

  function safeRemoveStorage(storage, key) {
    try {
      storage.removeItem(key);
      return true;
    } catch (err) {
      debugLog('storage-remove-failed', { key, error: err.message });
      return false;
    }
  }

  function persistProgress() {
    if (!elements.assessment || state.isComplete || elements.assessment.classList.contains('hidden')) return;
    const snapshot = {
      currentQuestion: state.currentQuestion,
      timeRemaining: state.timeRemaining,
      answers: state.answers,
      userData: state.userData,
      savedAt: Date.now()
    };
    safeSetStorage(localStorage, STORAGE_KEY, JSON.stringify(snapshot));
  }

  function clearSavedProgress() {
    safeRemoveStorage(localStorage, STORAGE_KEY);
  }

  function saveResults(results) {
    const serialized = JSON.stringify(results);
    safeSetStorage(sessionStorage, RESULTS_STORAGE_KEY, serialized);
    safeSetStorage(localStorage, RESULTS_STORAGE_KEY, serialized);
  }

  function getSavedResults() {
    const fromSession = safeGetStorage(sessionStorage, RESULTS_STORAGE_KEY);
    const raw = fromSession || safeGetStorage(localStorage, RESULTS_STORAGE_KEY);
    if (!raw) return null;

    try {
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return null;
      return parsed;
    } catch (err) {
      safeRemoveStorage(sessionStorage, RESULTS_STORAGE_KEY);
      safeRemoveStorage(localStorage, RESULTS_STORAGE_KEY);
      return null;
    }
  }

  // ============================================
  // DOM ELEMENTS
  // ============================================

  const elements = {
    landing: document.getElementById('landing'),
    assessment: document.getElementById('assessment'),
    results: document.getElementById('results'),
    review: document.getElementById('review'),
    startForm: document.getElementById('startForm'),
    termsConsent: document.getElementById('termsConsent'),
    roadmapOptIn: document.getElementById('roadmapOptIn'),
    consentError: document.getElementById('consentError'),
    submissionNotice: document.getElementById('submissionNotice'),
    assessmentNotice: document.getElementById('assessmentNotice'),
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
    overallScore: document.getElementById('overallScore'),
    overallPct: document.getElementById('overallPct'),
    unansweredInfo: document.getElementById('unansweredInfo'),
    nrLabel: document.getElementById('nrLabel'),
    diLabel: document.getElementById('diLabel'),
    lrLabel: document.getElementById('lrLabel'),
    focusArea: document.getElementById('focusArea'),
    reviewContainer: document.getElementById('reviewContainer')
  };

  // ============================================
  // CATEGORY UTILITIES
  // ============================================

  function getCategoryCode(categoryName) {
    if (!categoryName) return null;
    const normalized = String(categoryName).toLowerCase();
    if (normalized.includes('numerical')) return 'NR';
    if (normalized.includes('data')) return 'DI';
    if (normalized.includes('logical')) return 'LR';
    return null;
  }

  function getCategoryClass(category) {
    const classes = {
      'NR': 'bg-gold-400/20 text-gold-400 border border-gold-400/40',
      'DI': 'bg-gold-400/20 text-gold-400 border border-gold-400/40',
      'LR': 'bg-gold-400/20 text-gold-400 border border-gold-400/40'
    };
    return classes[category] || 'bg-navy-900 text-slate-500';
  }

  function getInactiveCategoryClass() {
    return 'bg-navy-100 text-navy-300 border border-navy-200';
  }

  function showAnswerKeyErrorNotice() {
    if (answerKeyErrorShown) return;
    answerKeyErrorShown = true;

    const message = 'We hit a scoring issue while checking answers. Please refresh and try again.';
    const resultsWrapper = elements.results && elements.results.querySelector('.max-w-3xl');
    if (resultsWrapper) {
      const notice = document.createElement('p');
      notice.id = 'answerKeyErrorNotice';
      notice.className = 'text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-4 py-3 mb-6';
      notice.textContent = message;
      const heading = resultsWrapper.querySelector('h1');
      if (heading && heading.parentNode) {
        heading.parentNode.insertBefore(notice, heading.nextSibling);
      } else {
        resultsWrapper.prepend(notice);
      }
      return;
    }

    console.error(message);
  }

  function getCorrectIndex(questionId) {
    if (typeof window.getCorrectAnswerIndex !== 'function') {
      showAnswerKeyErrorNotice();
      return null;
    }

    const correctIndex = window.getCorrectAnswerIndex(questionId);
    if (!Number.isInteger(correctIndex)) {
      showAnswerKeyErrorNotice();
      return null;
    }
    return correctIndex;
  }

  // ============================================
  // TIMER FUNCTIONS
  // ============================================

  function startTimer() {
    stopTimer();
    updateTimerDisplay();
    updateTimerBar();
    persistProgress();
    
    state.timer = setInterval(() => {
      if (state.timeRemaining <= 0) {
        finishAssessment({ allowIncomplete: true, trigger: 'timer' });
        return;
      }
      state.timeRemaining--;
      updateTimerDisplay();
      updateTimerBar();
      persistProgress();
      
      if (state.timeRemaining <= CONFIG.WARNING_THRESHOLD) {
        elements.timer.classList.add('timer-warning');
      } else {
        elements.timer.classList.remove('timer-warning');
      }
      
      if (state.timeRemaining <= 0) {
        finishAssessment({ allowIncomplete: true, trigger: 'timer' });
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const minutes = Math.floor(state.timeRemaining / 60);
    const seconds = state.timeRemaining % 60;
    elements.timer.textContent = 
      `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  function updateTimerBar() {
    const bar = document.getElementById('timerBar');
    if (!bar) return;
    const pct = Math.max(0, Math.min(100, (state.timeRemaining / CONFIG.DURATION) * 100));
    bar.style.width = `${pct}%`;
  }

  function scrollToQuestionTop(behavior = 'smooth') {
    if (!elements.questionContainer) return;
    const navOffset = 92;
    const stickyHeader = elements.assessment.querySelector('.sticky');
    const target = stickyHeader || elements.questionContainer;
    const questionTop = target.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: Math.max(0, questionTop - navOffset),
      behavior
    });
  }

  function showAssessmentNotice(message) {
    if (!elements.assessmentNotice) return;
    elements.assessmentNotice.textContent = message;
    elements.assessmentNotice.classList.remove('hidden');
  }

  function clearAssessmentNotice() {
    if (!elements.assessmentNotice) return;
    elements.assessmentNotice.classList.add('hidden');
    elements.assessmentNotice.textContent = '';
  }

  function getUnansweredQuestionIds() {
    return QUESTION_SEQUENCE.filter(qId => !Object.prototype.hasOwnProperty.call(state.answers, qId));
  }

  function stopTimer() {
    clearInterval(state.timer);
    state.timer = null;
  }

  function renderBarChart(chart) {
    if (!chart || !Array.isArray(chart.labels) || !Array.isArray(chart.series)) return '';

    const labels = chart.labels;
    const series = chart.series.filter(s => s && Array.isArray(s.values));
    if (!labels.length || !series.length) return '';

    const palette = ['bg-navy-700', 'bg-gold-400', 'bg-emerald-500'];
    const numericValues = series.flatMap(s => s.values.map(v => Number(v) || 0));
    const maxValue = Math.max(1, ...numericValues);

    return `
      <div class="mb-6 bg-navy-50 rounded-lg p-4 border border-navy-100">
        <div class="flex items-center justify-between mb-4">
          <p class="text-sm font-semibold text-navy-600">${escapeHtml(chart.title || 'Chart Data')}</p>
          <div class="flex flex-wrap gap-3 text-xs text-navy-500">
            ${series.map((s, idx) => `
              <span class="inline-flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-sm ${palette[idx % palette.length]}"></span>
                ${escapeHtml(s.name || `Series ${idx + 1}`)}
              </span>
            `).join('')}
          </div>
        </div>

        <div class="h-44 flex items-end justify-between gap-3">
          ${labels.map((label, labelIdx) => `
            <div class="flex-1 min-w-0 flex flex-col items-center">
              <div class="w-full h-36 flex items-end justify-center gap-1">
                ${series.map((s, seriesIdx) => {
                  const value = Number(s.values[labelIdx]) || 0;
                  const heightPct = Math.max(4, (value / maxValue) * 100);
                  return `
                    <div class="w-3 sm:w-4 relative ${palette[seriesIdx % palette.length]} rounded-t" style="height:${heightPct.toFixed(2)}%">
                      <span class="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-navy-500 font-medium">${value}</span>
                    </div>
                  `;
                }).join('')}
              </div>
              <span class="mt-2 text-[11px] text-navy-500 font-medium">${escapeHtml(label)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ============================================
  // QUESTION RENDERING
  // ============================================

  function loadQuestion(qNum) {
    state.currentQuestion = qNum;
    const questionId = QUESTION_SEQUENCE[qNum - 1];
    const questionBank = window.questions;
    const question = Array.isArray(questionBank) ? questionBank.find(q => q.id === questionId) : null;
    const category = getCategoryCode(question.category) || 'NR';

    if (!question) return;

    // Update progress
    elements.currentQ.textContent = qNum;
    elements.progressBar.style.width = `${(qNum / CONFIG.TOTAL_QUESTIONS) * 100}%`;

    // Update category indicators
    elements.catNr.className = `px-2 py-1 rounded text-xs font-medium ${category === 'NR' ? getCategoryClass('NR') : getInactiveCategoryClass()}`;
    elements.catDi.className = `px-2 py-1 rounded text-xs font-medium ${category === 'DI' ? getCategoryClass('DI') : getInactiveCategoryClass()}`;
    elements.catLr.className = `px-2 py-1 rounded text-xs font-medium ${category === 'LR' ? getCategoryClass('LR') : getInactiveCategoryClass()}`;

    // Update buttons
    elements.prevBtn.disabled = qNum === 1;
    elements.nextBtn.textContent = qNum === CONFIG.TOTAL_QUESTIONS ? 'Finish' : 'Next Question';

    const bulletsHtml = Array.isArray(question.bullets) && question.bullets.length
      ? `
        <ul class="mt-4 pl-5 list-disc space-y-2 text-sm text-navy-600 leading-relaxed">
          ${question.bullets.map(item => {
            const raw = String(item || '');
            const match = raw.match(/^([A-Z])[:.)-]\s*(.*)$/);
            if (match) {
              return `<li><span class="font-semibold text-navy-700">${escapeHtml(match[1])}.</span> ${escapeHtml(match[2])}</li>`;
            }
            return `<li>${escapeHtml(raw)}</li>`;
          }).join('')}
        </ul>
      `
      : '';

    // Build question HTML
    let html = `
      <div class="mb-7 pt-1">
        <div class="flex items-center gap-3 mb-6">
          <span class="px-3 py-1 rounded-full text-xs font-medium ${getCategoryClass(category)}">
            ${CONFIG.CATEGORIES[category]}
          </span>
          <span class="text-xs text-navy-200">Question ${qNum} of ${CONFIG.TOTAL_QUESTIONS}</span>
        </div>
        <h3 class="mt-1 text-lg font-medium text-navy-700 leading-relaxed">${escapeHtml(question.text)}</h3>
        ${bulletsHtml}
      </div>
    `;

    // Add table if present
    if (question.table) {
      html += `
        <div class="mb-6 overflow-x-auto bg-navy-50 rounded-lg p-4 border border-navy-100">
          <table class="w-full text-sm" style="min-width: 520px;">
            <thead>
              <tr class="border-b border-navy-100">
                ${question.table.headers.map(h => `<th class="text-left py-2 px-3 text-navy-500 font-semibold text-xs uppercase tracking-wide">${escapeHtml(h)}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${question.table.rows.map(row => `
                <tr class="border-b border-navy-100 last:border-0">
                  ${row.map(cell => `<td class="py-2 px-3 text-navy-700 font-mono text-sm">${escapeHtml(cell)}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    if (question.chart) {
      html += renderBarChart(question.chart);
    }

    // Add options
    html += `<div class="space-y-3">`;
    question.options.forEach((opt, idx) => {
      const isSelected = state.answers[questionId] === idx;
      const selectedClass = isSelected 
        ? 'border-navy-700 bg-navy-50 text-navy-700' 
        : 'border-navy-200 text-navy-600 hover:border-gold-400/50 hover:bg-gold-50';
      
      html += `
        <button 
          type="button"
          onclick="diagnostic.selectAnswer(${questionId}, ${idx})" 
          class="w-full p-4 text-left rounded-lg border-2 ${selectedClass} transition-all duration-200 flex items-start gap-3 cursor-pointer"
        >
          <span class="flex-shrink-0 w-6 h-6 rounded-full border-2 ${isSelected ? 'border-navy-700 bg-navy-700 text-white' : 'border-navy-300 text-navy-500'} flex items-center justify-center text-xs font-bold mt-0.5">
            ${String.fromCharCode(65 + idx)}
          </span>
          <span class="text-sm leading-relaxed">${escapeHtml(opt)}</span>
        </button>
      `;
    });
    html += `</div>`;

    elements.questionContainer.innerHTML = html;
    persistProgress();
  }

  // ============================================
  // ANSWER HANDLING
  // ============================================

  function selectAnswer(questionId, optionIdx) {
    state.answers[questionId] = optionIdx;
    clearAssessmentNotice();
    debugLog('answer-selected', { questionId, optionIdx });
    persistProgress();
    loadQuestion(state.currentQuestion);
  }

  function prevQuestion() {
    if (state.currentQuestion > 1) {
      debugLog('question-prev', { from: state.currentQuestion, to: state.currentQuestion - 1 });
      loadQuestion(state.currentQuestion - 1);
      requestAnimationFrame(() => {
        scrollToQuestionTop('smooth');
      });
    }
  }

  function nextQuestion() {
    if (state.submitLocked || isFinishing) return;
    if (state.currentQuestion < CONFIG.TOTAL_QUESTIONS) {
      debugLog('question-next', { from: state.currentQuestion, to: state.currentQuestion + 1 });
      loadQuestion(state.currentQuestion + 1);
      requestAnimationFrame(() => {
        scrollToQuestionTop('smooth');
      });
    } else {
      finishAssessment({ allowIncomplete: false, trigger: 'manual' });
    }
  }

  // ============================================
  // ASSESSMENT COMPLETION
  // ============================================

  function finishAssessment(options = {}) {
    const allowIncomplete = !!options.allowIncomplete;
    const trigger = options.trigger || 'manual';

    if (isFinishing || state.isComplete) return;

    const unansweredIds = getUnansweredQuestionIds();
    if (!allowIncomplete && unansweredIds.length) {
      const firstUnansweredId = unansweredIds[0];
      const firstUnansweredNumber = QUESTION_SEQUENCE.indexOf(firstUnansweredId) + 1;
      showAssessmentNotice('Please answer all questions before submitting. We have taken you to the first unanswered question.');
      debugLog('submit-blocked-unanswered', { unansweredCount: unansweredIds.length, firstUnansweredId });
      if (firstUnansweredNumber > 0) {
        loadQuestion(firstUnansweredNumber);
        requestAnimationFrame(() => {
          scrollToQuestionTop('smooth');
        });
      }
      return;
    }

    isFinishing = true;
    state.submitLocked = true;
    if (elements.nextBtn) elements.nextBtn.disabled = true;
    if (elements.prevBtn) elements.prevBtn.disabled = true;
    stopTimer();
    state.isComplete = true;
    clearSavedProgress();
    clearAssessmentNotice();
    debugLog('finish-assessment', { trigger, unansweredCount: unansweredIds.length });

    // Calculate scores
    const scores = calculateScores();
    
    // Store results
    const results = {
      ...scores,
      answers: state.answers,
      user: state.userData,
      timeRemaining: state.timeRemaining,
      unansweredCount: unansweredIds.length,
      completionTrigger: trigger,
      timestamp: new Date().toISOString()
    };
    debugLog('scores-computed', scores);
    saveResults(results);

    // Show results
    showResults(results);
    submitLead(results);
    storeResultsLocally(results);
    if (window.location.hash !== '#results') {
      window.history.pushState({ view: 'results' }, '', '#results');
    }
    isFinishing = false;
  }

  function calculateScores() {
    let nrCorrect = 0, diCorrect = 0, lrCorrect = 0;
    let nrTotal = 0, diTotal = 0, lrTotal = 0;

    QUESTION_SEQUENCE.forEach((qId) => {
      const q = window.questions.find(question => question.id === qId);
      const cat = getCategoryCode(q && q.category) || 'NR';
      const correctIndex = getCorrectIndex(qId);
      const isCorrect = correctIndex !== null && state.answers[qId] === correctIndex;

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
  // LEAD SUBMISSION (PLACEHOLDER API)
  // ============================================

  function getLeadQueue() {
    try {
      const raw = localStorage.getItem(LEAD_QUEUE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.log('Lead queue read failed:', err);
      return [];
    }
  }

  function saveLeadQueue(queue) {
    try {
      localStorage.setItem(LEAD_QUEUE_KEY, JSON.stringify(queue));
    } catch (err) {
      console.log('Lead queue save failed:', err);
    }
  }

  function getRetryDelayMs(attempts) {
    const idx = Math.min(Math.max((attempts || 1) - 1, 0), RETRY_SCHEDULE_MS.length - 1);
    return RETRY_SCHEDULE_MS[idx];
  }

  function queueLeadPayload(payload, attempts, errorMessage) {
    const now = Date.now();
    const safeAttempts = Math.max(1, Number(attempts) || 1);
    const queue = getLeadQueue();
    queue.push({
      payload,
      createdAt: now,
      attempts: safeAttempts,
      nextAttemptAt: now + getRetryDelayMs(safeAttempts),
      failed: false,
      lastError: errorMessage || ''
    });
    saveLeadQueue(queue);
  }

  function buildLeadPayload(results) {
    if (!results || !results.user || !results.user.termsAccepted) return null;
    return {
      name: results.user.name,
      email: results.user.email,
      firm: results.user.firm || null,
      termsAccepted: !!results.user.termsAccepted,
      roadmapOptIn: !!results.user.roadmapOptIn,
      scores: {
        numerical: { correct: results.nr, total: results.nrTotal },
        data: { correct: results.di, total: results.diTotal },
        logical: { correct: results.lr, total: results.lrTotal },
        overall: { correct: results.total, total: CONFIG.TOTAL_QUESTIONS }
      },
      answers: results.answers,
      timeRemaining: results.timeRemaining,
      timestamp: results.timestamp,
      source: window.location.href
    };
  }

  async function postLeadPayload(payload) {
    const response = await fetch(LEAD_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Lead endpoint failed (${response.status})`);
    }
  }

  function showSubmissionNotice(message) {
    if (!elements.submissionNotice) return;
    elements.submissionNotice.textContent = message;
    elements.submissionNotice.classList.remove('hidden');
  }

  function clearSubmissionNotice() {
    if (!elements.submissionNotice) return;
    elements.submissionNotice.classList.add('hidden');
    elements.submissionNotice.textContent = '';
  }

  async function flushQueue() {
    if (isFlushingQueue) return;
    isFlushingQueue = true;
    const now = Date.now();
    const queue = getLeadQueue();
    let changed = false;

    try {
      for (let i = 0; i < queue.length; i++) {
        const item = queue[i];
        if (!item || item.failed) continue;
        if ((item.attempts || 0) >= MAX_LEAD_ATTEMPTS) {
          item.failed = true;
          item.failedAt = now;
          item.nextAttemptAt = null;
          changed = true;
          continue;
        }
        if (item.nextAttemptAt && item.nextAttemptAt > now) continue;

        try {
          await postLeadPayload(item.payload);
          queue.splice(i, 1);
          i--;
          changed = true;
        } catch (err) {
          const nextAttempts = (item.attempts || 0) + 1;
          item.attempts = nextAttempts;
          item.lastError = err.message || 'Submission failed';
          if (nextAttempts >= MAX_LEAD_ATTEMPTS) {
            item.failed = true;
            item.failedAt = Date.now();
            item.nextAttemptAt = null;
          } else {
            item.nextAttemptAt = Date.now() + getRetryDelayMs(nextAttempts);
          }
          changed = true;
        }
      }
    } finally {
      if (changed) saveLeadQueue(queue);
      isFlushingQueue = false;
    }

    const hasPendingRetries = queue.some(item => item && !item.failed);
    if (!hasPendingRetries) {
      clearSubmissionNotice();
    }
  }

  async function submitLead(results) {
    const payload = buildLeadPayload(results);
    if (!payload) return;

    try {
      await postLeadPayload(payload);
      clearSubmissionNotice();
      flushQueue();
    } catch (err) {
      queueLeadPayload(payload, 1, err.message || 'Submission failed');
      showSubmissionNotice('We couldn’t send your results right now. They’ll retry automatically.');
    }

    if (results.user.email && results.user.roadmapOptIn) {
      sendToKit(results);
    }
  }

  function storeResultsLocally(results) {
    const historyRaw = safeGetStorage(localStorage, 'acumenResultsHistory');
    let history = [];
    if (historyRaw) {
      try {
        const parsed = JSON.parse(historyRaw);
        if (Array.isArray(parsed)) history = parsed;
      } catch (err) {
        history = [];
      }
    }

    history.push({
      timestamp: results.timestamp,
      name: results.user && results.user.name ? results.user.name : '',
      email: results.user && results.user.email ? results.user.email : '',
      firm: results.user && results.user.firm ? results.user.firm : null,
      scores: { nr: results.nr, di: results.di, lr: results.lr, total: results.total }
    });
    safeSetStorage(localStorage, 'acumenResultsHistory', JSON.stringify(history));
  }

  function sendToKit(results) {
    if (!KIT_ENABLED) return;
    const kitFormId = 'YOUR_KIT_FORM_ID';
    const kitUrl = `https://api.convertkit.com/v3/forms/${kitFormId}/subscribe`;
    const hasConfiguredKit = kitFormId && !kitFormId.includes('YOUR_KIT_FORM_ID');
    
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

    if (!hasConfiguredKit) return;

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

  // ============================================
  // RESULTS DISPLAY
  // ============================================

  function showResults(results) {
    if (!results) return;
    stopTimer();
    const scores = {
      nr: Number(results.nr) || 0,
      di: Number(results.di) || 0,
      lr: Number(results.lr) || 0,
      nrTotal: Number(results.nrTotal) || 0,
      diTotal: Number(results.diTotal) || 0,
      lrTotal: Number(results.lrTotal) || 0,
      total: Number(results.total) || 0
    };

    elements.assessment.classList.add('hidden');
    elements.results.classList.remove('hidden');
    elements.review.classList.add('hidden');

    // Update score displays
    elements.nrScore.textContent = `${scores.nr}/${scores.nrTotal}`;
    elements.diScore.textContent = `${scores.di}/${scores.diTotal}`;
    elements.lrScore.textContent = `${scores.lr}/${scores.lrTotal}`;
    elements.overallScore.textContent = `${scores.total}/${CONFIG.TOTAL_QUESTIONS}`;
    const percentage = Math.round((scores.total / CONFIG.TOTAL_QUESTIONS) * 100);
    elements.overallPct.textContent = `${percentage}%`;

    // Determine strength/weakness
    const nrStrength = scores.nr >= 4 ? 'Strong' : 'Weak';
    const diStrength = scores.di >= 4 ? 'Strong' : 'Weak';
    const lrStrength = scores.lr >= 3 ? 'Strong' : 'Weak';

    elements.nrLabel.textContent = nrStrength;
    elements.diLabel.textContent = diStrength;
    elements.lrLabel.textContent = lrStrength;

    // Color code labels
    elements.nrLabel.className = `text-xs mt-1 ${nrStrength === 'Strong' ? 'text-emerald-600' : 'text-rose-600'}`;
    elements.diLabel.className = `text-xs mt-1 ${diStrength === 'Strong' ? 'text-emerald-600' : 'text-rose-600'}`;
    elements.lrLabel.className = `text-xs mt-1 ${lrStrength === 'Strong' ? 'text-emerald-600' : 'text-rose-600'}`;

    // Find weakest category (or shared weakest categories on an exact tie)
    const categories = [
      { name: 'Numerical Reasoning', score: scores.nr, max: scores.nrTotal, ratio: scores.nr / scores.nrTotal },
      { name: 'Data Interpretation', score: scores.di, max: scores.diTotal, ratio: scores.di / scores.diTotal },
      { name: 'Logical Reasoning', score: scores.lr, max: scores.lrTotal, ratio: scores.lr / scores.lrTotal }
    ];

    const minRatio = Math.min(...categories.map(cat => cat.ratio));
    const weakestCategories = categories.filter(cat => Math.abs(cat.ratio - minRatio) < 0.000001);

    if (weakestCategories.length === 1) {
      const weakest = weakestCategories[0];
      elements.focusArea.innerHTML =
        `Your <strong class="text-gold-500">${weakest.name}</strong> score (${weakest.score}/${weakest.max}) indicates this is your primary bottleneck. ` +
        `The training programme includes targeted modules to strengthen this specific area.`;
    } else {
      const names = weakestCategories.map(cat => cat.name).join(' and ');
      elements.focusArea.innerHTML =
        `Your results show a <strong class="text-gold-500">shared bottleneck</strong> between ${names}. ` +
        `These categories have the same lowest percentage score, so both should be prioritised.`;
    }

    const remaining = Number.isFinite(Number(results.timeRemaining))
      ? Number(results.timeRemaining)
      : state.timeRemaining;
    const timeUsed = Math.max(0, CONFIG.DURATION - remaining);
    const mins = Math.floor(timeUsed / 60);
    const secs = timeUsed % 60;
    const timeText = `${mins}:${secs.toString().padStart(2, '0')}`;
    const timeEl = document.getElementById('timeUsed');
    if (timeEl) timeEl.textContent = timeText;

    if (elements.unansweredInfo) {
      const unansweredCount = Number(results.unansweredCount) || 0;
      if (unansweredCount > 0) {
        elements.unansweredInfo.textContent = `Unanswered questions counted as incorrect: ${unansweredCount}`;
        elements.unansweredInfo.classList.remove('hidden');
      } else {
        elements.unansweredInfo.classList.add('hidden');
      }
    }
  }

  // ============================================
  // REVIEW MODE
  // ============================================

  function reviewAnswers() {
    const results = getSavedResults();
    if (!results) return;

    elements.results.classList.add('hidden');
    elements.review.classList.remove('hidden');
    if (window.location.hash !== '#review') {
      window.history.pushState({ view: 'review' }, '', '#review');
    }
    let html = '';

    QUESTION_SEQUENCE.forEach((qId, idx) => {
      const q = window.questions.find(question => question.id === qId);
      const userAnswer = results.answers[qId];
      const correctIndex = getCorrectIndex(qId);
      const hasCorrectIndex = Number.isInteger(correctIndex);
      const isCorrect = hasCorrectIndex && userAnswer === correctIndex;
      const category = getCategoryCode(q && q.category) || 'NR';

      html += `
        <div class="bg-white rounded-xl p-6 border ${isCorrect ? 'border-emerald-200' : 'border-rose-200'} shadow-sm">
          <div class="flex items-start justify-between mb-4">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="px-2 py-1 rounded text-xs font-medium ${getCategoryClass(category)}">${category}</span>
                <span class="text-xs text-navy-400">Question ${idx + 1}</span>
              </div>
              <p class="text-navy-700 font-medium">${escapeHtml(q.text)}</p>
            </div>
            ${isCorrect 
              ? '<span class="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">Correct</span>'
              : '<span class="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold">Incorrect</span>'
            }
          </div>
          
          <div class="space-y-2 mb-4">
            ${q.options.map((opt, i) => {
              let classes = 'p-3 rounded-lg border text-sm flex items-start gap-3 ';
              if (hasCorrectIndex && i === correctIndex) {
                classes += 'border-emerald-200 bg-emerald-50 text-emerald-700';
              } else if (i === userAnswer && !isCorrect) {
                classes += 'border-rose-200 bg-rose-50 text-rose-700';
              } else {
                classes += 'border-navy-100 text-navy-500';
              }
              return `
                <div class="${classes}">
                  <span class="flex-shrink-0 w-5 h-5 rounded-full border-2 ${hasCorrectIndex && i === correctIndex ? 'border-emerald-600 bg-emerald-600 text-white' : (i === userAnswer ? 'border-rose-600' : 'border-navy-200')} flex items-center justify-center text-xs font-bold">
                    ${String.fromCharCode(65 + i)}
                  </span>
                  <span>${escapeHtml(opt)}</span>
                </div>
              `;
            }).join('')}
          </div>

          <div class="p-4 bg-navy-50 rounded-lg border border-navy-100">
            <p class="text-sm text-navy-600">
              <strong class="text-gold-500">Correct Answer:</strong> ${hasCorrectIndex ? `${String.fromCharCode(65 + correctIndex)}. ${escapeHtml(q.options[correctIndex])}` : 'Unavailable'}
            </p>
            <p class="text-sm text-navy-600 mt-2">
              <strong class="text-gold-500">Your Answer:</strong> ${userAnswer !== undefined ? `${String.fromCharCode(65 + userAnswer)}. ${escapeHtml(q.options[userAnswer])}` : 'No answer'}
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
    if (window.location.hash !== '#results') {
      window.history.pushState({ view: 'results' }, '', '#results');
    }
  }

  function restoreSavedProgress() {
    const savedStateRaw = safeGetStorage(localStorage, STORAGE_KEY);

    if (!savedStateRaw) return false;

    let savedState;
    try {
      savedState = JSON.parse(savedStateRaw);
    } catch (err) {
      clearSavedProgress();
      return false;
    }

    if (!savedState || typeof savedState !== 'object' || !savedState.userData) {
      clearSavedProgress();
      return false;
    }

    const elapsedSinceSave = Math.max(0, Math.floor((Date.now() - (savedState.savedAt || Date.now())) / 1000));
    const restoredTimeRemaining = Math.max(0, Number(savedState.timeRemaining || 0) - elapsedSinceSave);

    state.currentQuestion = Math.max(1, Math.min(CONFIG.TOTAL_QUESTIONS, Number(savedState.currentQuestion) || 1));
    state.timeRemaining = restoredTimeRemaining;
    state.answers = savedState.answers && typeof savedState.answers === 'object' ? savedState.answers : {};
    state.userData = savedState.userData;
    state.isComplete = false;
    state.submitLocked = false;
    isFinishing = false;

    elements.landing.classList.add('hidden');
    elements.results.classList.add('hidden');
    elements.review.classList.add('hidden');
    elements.assessment.classList.remove('hidden');
    elements.timer.classList.remove('timer-warning');

    loadQuestion(state.currentQuestion);
    updateTimerDisplay();
    updateTimerBar();
    if (window.location.hash !== '#assessment') {
      window.history.replaceState({ view: 'assessment' }, '', '#assessment');
    }
    debugLog('progress-restored', {
      question: state.currentQuestion,
      timeRemaining: state.timeRemaining
    });

    if (state.timeRemaining <= 0) {
      finishAssessment({ allowIncomplete: true, trigger: 'timer' });
    } else {
      startTimer();
    }

    requestAnimationFrame(() => {
      scrollToQuestionTop('auto');
    });

    return true;
  }

  function showLandingView() {
    stopTimer();
    elements.landing.classList.remove('hidden');
    elements.assessment.classList.add('hidden');
    elements.results.classList.add('hidden');
    elements.review.classList.add('hidden');
    if (window.location.hash !== '#landing') {
      window.history.replaceState({ view: 'landing' }, '', '#landing');
    }
  }

  function restoreResultsView() {
    const savedResults = getSavedResults();
    if (!savedResults) return false;
    clearAssessmentNotice();
    state.answers = savedResults.answers && typeof savedResults.answers === 'object' ? savedResults.answers : {};
    state.userData = savedResults.user && typeof savedResults.user === 'object' ? savedResults.user : {};
    state.timeRemaining = Number(savedResults.timeRemaining) || 0;
    state.isComplete = true;
    state.submitLocked = true;
    showResults(savedResults);
    return true;
  }

  function handleHistoryNavigation() {
    const hash = (window.location.hash || '').replace('#', '').toLowerCase();
    if (!hash) return;

    if (hash === 'review') {
      if (restoreResultsView()) {
        reviewAnswers();
      } else {
        showLandingView();
      }
      return;
    }

    if (hash === 'results') {
      if (!restoreResultsView()) {
        showLandingView();
      }
      return;
    }

    if (hash === 'assessment') {
      if (!restoreSavedProgress()) {
        if (!restoreResultsView()) {
          showLandingView();
        }
      }
      return;
    }

    if (hash === 'landing') {
      showLandingView();
    }
  }

  // ============================================
  // INITIALISATION
  // ============================================

  function startAssessment(e) {
    e.preventDefault();

    if (elements.startForm && !elements.startForm.checkValidity()) {
      elements.startForm.reportValidity();
      return;
    }

    const termsAccepted = !!(elements.termsConsent && elements.termsConsent.checked);
    const roadmapOptIn = !!(elements.roadmapOptIn && elements.roadmapOptIn.checked);

    if (!termsAccepted) {
      if (elements.consentError) {
        elements.consentError.classList.remove('hidden');
      }
      return;
    }

    if (elements.consentError) {
      elements.consentError.classList.add('hidden');
    }
    
    // Collect user data
    const userData = {
      name: document.getElementById('userName').value.trim(),
      email: document.getElementById('userEmail').value.trim(),
      firm: document.getElementById('targetFirm').value,
      termsAccepted,
      roadmapOptIn,
      startedAt: new Date().toISOString()
    };

    // Validate
    if (!userData.name || !userData.email || !userData.termsAccepted) {
      return;
    }

    stopTimer();
    isFinishing = false;
    state.currentQuestion = 1;
    state.timeRemaining = CONFIG.DURATION;
    state.answers = {};
    state.userData = userData;
    state.isComplete = false;
    state.submitLocked = false;
    elements.timer.classList.remove('timer-warning');
    clearSavedProgress();
    clearAssessmentNotice();
    clearSubmissionNotice();
    debugLog('start-assessment', {
      userEmail: userData.email,
      targetFirm: userData.firm || null
    });

    // Switch views
    elements.landing.classList.add('hidden');
    elements.assessment.classList.remove('hidden');
    elements.results.classList.add('hidden');
    elements.review.classList.add('hidden');

    // Start
    loadQuestion(1);
    startTimer();
    if (window.location.hash !== '#assessment') {
      window.history.pushState({ view: 'assessment' }, '', '#assessment');
    }

    // Keep view at top of assessment
    requestAnimationFrame(() => {
      scrollToQuestionTop('smooth');
    });
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
    if (elements.termsConsent) {
      elements.termsConsent.addEventListener('change', () => {
        if (elements.termsConsent.checked && elements.consentError) {
          elements.consentError.classList.add('hidden');
        }
      });
    }
    flushQueue();
    setInterval(flushQueue, 20000);
    window.addEventListener('popstate', handleHistoryNavigation);
    window.addEventListener('hashchange', handleHistoryNavigation);

    if (window.location.hash) {
      handleHistoryNavigation();
    } else if (!restoreSavedProgress()) {
      const savedResults = getSavedResults();
      if (savedResults) {
        showResults(savedResults);
        window.history.replaceState({ view: 'results' }, '', '#results');
      } else {
        window.history.replaceState({ view: 'landing' }, '', '#landing');
      }
    }
  }

})();
