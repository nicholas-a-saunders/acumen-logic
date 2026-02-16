/**
 * Question Randomisation Engine
 *
 * Takes a question template and a seed, generates random numbers
 * within the defined constraints, calculates the correct answer
 * and distractor answers, and returns a complete question.
 */

class SeededRNG {
  constructor(seed) {
    this.seed = seed % 2147483647;
    if (this.seed <= 0) this.seed += 2147483646;
  }

  next() {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }

  intBetween(min, max, step) {
    step = step || 1;
    const range = Math.floor((max - min) / step) + 1;
    return min + Math.floor(this.next() * range) * step;
  }

  floatBetween(min, max, decimals) {
    decimals = decimals || 2;
    const val = min + this.next() * (max - min);
    return parseFloat(val.toFixed(decimals));
  }

  pick(arr) {
    return arr[Math.floor(this.next() * arr.length)];
  }

  shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}

function generateVariables(template, rng) {
  const vars = {};

  // Run _setup function first if it exists (for pattern/series questions)
  if (typeof template._setup === 'function') {
    const setupVars = template._setup(rng);
    Object.assign(vars, setupVars);
  }

  for (const [name, def] of Object.entries(template.variables || {})) {
    if (vars[name] !== undefined) continue; // Skip if already set by _setup
    if (def.type === 'choice') {
      vars[name] = rng.pick(def.options);
    } else if (def.decimals) {
      vars[name] = rng.floatBetween(def.min, def.max, def.decimals);
    } else {
      vars[name] = rng.intBetween(def.min, def.max, def.step || 1);
    }
  }
  return vars;
}

function evaluateFormula(formula, vars) {
  const safeVars = { ...vars, Math };
  const keys = Object.keys(safeVars);
  const values = Object.values(safeVars);
  try {
    const fn = new Function(...keys, `"use strict"; return (${formula});`);
    const result = fn(...values);
    if (typeof result !== 'number' || !isFinite(result)) return null;
    return result;
  } catch (e) {
    return null;
  }
}

function roundAnswer(val, decimals) {
  if (decimals === undefined) decimals = 2;
  return parseFloat(val.toFixed(decimals));
}

function substituteText(text, vars) {
  if (!text) return null;
  let result = text;
  for (const [key, val] of Object.entries(vars)) {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    result = result.replace(regex, typeof val === 'number' ? formatNumber(val) : String(val));
  }
  return result;
}

function formatNumber(n) {
  if (Number.isInteger(n)) return n.toLocaleString('en-GB');
  return n.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function generateQuestion(template, seed) {
  if (!seed) seed = Math.floor(Math.random() * 2147483646) + 1;

  const maxAttempts = 15;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const rng = new SeededRNG(seed + attempt);
    const vars = generateVariables(template, rng);

    const correctRaw = evaluateFormula(template.correct_formula, vars);
    if (correctRaw === null) continue;
    if (template.allow_negative === false && correctRaw < 0) continue;

    const answerDecimals = template.answer_decimals !== undefined ? template.answer_decimals : 2;
    const correct = roundAnswer(correctRaw, answerDecimals);

    const distractors = [];
    const seen = new Set([correct]);

    for (const formula of (template.distractor_formulas || [])) {
      const val = evaluateFormula(formula, vars);
      if (val === null) continue;
      const rounded = roundAnswer(val, answerDecimals);
      if (seen.has(rounded)) continue;
      seen.add(rounded);
      distractors.push(rounded);
    }

    // Generate nearby values if not enough distractors
    if (distractors.length < 4) {
      const offsets = [0.9, 1.1, 0.85, 1.15, 0.95, 1.05, 0.8, 1.2, 0.75, 1.25];
      for (const mult of offsets) {
        if (distractors.length >= 4) break;
        const val = roundAnswer(correct * mult, answerDecimals);
        if (!seen.has(val) && val !== 0) {
          seen.add(val);
          distractors.push(val);
        }
      }
      if (distractors.length < 4) {
        const addOffsets = [1, -1, 2, -2, 5, -5, 10, -10, 3, -3];
        for (const off of addOffsets) {
          if (distractors.length >= 4) break;
          const val = roundAnswer(correct + off, answerDecimals);
          if (!seen.has(val)) {
            seen.add(val);
            distractors.push(val);
          }
        }
      }
    }

    if (distractors.length < 4) continue;

    // Take only 4 distractors (5 options total: A-E)
    const finalDistractors = distractors.slice(0, 4);
    const allAnswers = [correct, ...finalDistractors];
    const shuffled = rng.shuffle(allAnswers);
    const correctIndex = shuffled.indexOf(correct);

    const questionText = substituteText(template.question_text, vars);
    const explanationText = template.explanation_text
      ? substituteText(template.explanation_text, { ...vars, answer: formatNumber(correct) })
      : null;

    // Generate table data if template has a table_generator
    let tableData = null;
    if (typeof template.table_generator === 'function') {
      try {
        tableData = template.table_generator(vars);
      } catch (e) {
        tableData = null;
      }
    }

    const options = shuffled.map((val, i) => ({
      label: String.fromCharCode(65 + i),
      value: val,
      display: template.answer_prefix
        ? `${template.answer_prefix}${formatNumber(val)}${template.answer_suffix || ''}`
        : formatNumber(val)
    }));

    return {
      template_id: template.id,
      seed: seed + attempt,
      category: template.category,
      sub_category: template.sub_category,
      difficulty: template.difficulty,
      question_text: questionText,
      context: template.context ? substituteText(template.context, vars) : null,
      table_data: tableData,
      options: options,
      correct_index: correctIndex,
      explanation: explanationText,
      tags: template.tags || []
    };
  }

  return null;
}

function selectQuestions(questionBank, config) {
  const { countNR, countDI, countLR, count, categories, difficulties, excludeIds, rng } = config;

  let pool = questionBank.filter(t => t.is_active !== false);

  if (categories && categories.length > 0) {
    pool = pool.filter(t => categories.includes(t.category));
  }

  if (difficulties && difficulties.length > 0) {
    pool = pool.filter(t => difficulties.includes(t.difficulty));
  }

  if (excludeIds && excludeIds.length > 0) {
    pool = pool.filter(t => !excludeIds.includes(t.id));
  }

  const shuffled = rng ? rng.shuffle(pool) : pool.sort(() => Math.random() - 0.5);

  // If specific per-category counts are provided (6/6/7 format)
  if (countNR !== undefined && countDI !== undefined && countLR !== undefined) {
    const selected = [];
    const nrPool = shuffled.filter(t => t.category === 'NR');
    const diPool = shuffled.filter(t => t.category === 'DI');
    const lrPool = shuffled.filter(t => t.category === 'LR');

    selected.push(...nrPool.slice(0, countNR));
    selected.push(...diPool.slice(0, countDI));
    selected.push(...lrPool.slice(0, countLR));

    return rng ? rng.shuffle(selected) : selected.sort(() => Math.random() - 0.5);
  }

  // Default: even split across categories
  if (!categories || categories.length !== 1) {
    const perCategory = Math.ceil(count / 3);
    const selected = [];
    const cats = ['NR', 'DI', 'LR'];

    for (const cat of cats) {
      const catPool = shuffled.filter(t => t.category === cat);
      selected.push(...catPool.slice(0, perCategory));
    }

    const finalShuffled = rng ? rng.shuffle(selected) : selected.sort(() => Math.random() - 0.5);
    return finalShuffled.slice(0, count);
  }

  return shuffled.slice(0, count);
}

module.exports = { generateQuestion, selectQuestions, SeededRNG };
