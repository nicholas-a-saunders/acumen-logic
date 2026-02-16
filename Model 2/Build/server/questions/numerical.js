/**
 * Numerical Reasoning Question Templates (50)
 *
 * Sub-categories:
 *   Percentages (10), Ratios & Proportions (10), Fractions & Decimals (7),
 *   Currency & Conversions (7), Averages & Growth (8), Compound Change & CAGR (8)
 *
 * Difficulty distribution: 17 easy (1), 17 medium (2), 16 hard (3)
 */

const templates = [

  // ═══════════════════════════════════════════════════════════
  // PERCENTAGES (10)  —  NR-PCT-001 … NR-PCT-010
  // ═══════════════════════════════════════════════════════════

  {
    id: 'NR-PCT-001',
    category: 'NR',
    sub_category: 'Percentages',
    difficulty: 1,
    question_text: 'A company reported revenue of £{revenue}m. If operating costs were {costPct}% of revenue, what was the operating profit?',
    variables: {
      revenue: { min: 10, max: 100, step: 5 },
      costPct: { min: 55, max: 85, step: 5 }
    },
    correct_formula: 'revenue * (100 - costPct) / 100',
    distractor_formulas: [
      'revenue * costPct / 100',
      'revenue * (costPct - 10) / 100',
      'revenue * (100 - costPct + 5) / 100',
      'revenue - costPct'
    ],
    answer_prefix: '£',
    answer_suffix: 'm',
    answer_decimals: 1,
    allow_negative: false,
    explanation_text: 'Operating profit = £{revenue}m × (100% − {costPct}%) = £{answer}m',
    tags: ['percentage', 'profit', 'revenue']
  },

  {
    id: 'NR-PCT-002',
    category: 'NR',
    sub_category: 'Percentages',
    difficulty: 1,
    question_text: 'A department had {staff} employees. After a {cut}% reduction, how many employees remain?',
    variables: {
      staff: { min: 80, max: 500, step: 10 },
      cut: { min: 5, max: 25, step: 5 }
    },
    correct_formula: 'staff * (1 - cut / 100)',
    distractor_formulas: [
      'staff - cut',
      'staff * cut / 100',
      'staff * (1 + cut / 100)',
      'staff - staff / cut'
    ],
    answer_decimals: 0,
    allow_negative: false,
    explanation_text: '{staff} × (1 − {cut}%) = {answer} employees',
    tags: ['percentage-decrease', 'headcount']
  },

  {
    id: 'NR-PCT-003',
    category: 'NR',
    sub_category: 'Percentages',
    difficulty: 1,
    question_text: 'A product costs £{price}. After a {discount}% discount, what is the sale price?',
    variables: {
      price: { min: 20, max: 200, step: 5 },
      discount: { min: 10, max: 40, step: 5 }
    },
    correct_formula: 'price * (1 - discount / 100)',
    distractor_formulas: [
      'price - discount',
      'price * discount / 100',
      'price / (1 - discount / 100)',
      'price - price / discount'
    ],
    answer_prefix: '£',
    answer_decimals: 2,
    allow_negative: false,
    explanation_text: '£{price} × (1 − {discount}%) = £{answer}',
    tags: ['percentage-decrease', 'discount']
  },

  {
    id: 'NR-PCT-004',
    category: 'NR',
    sub_category: 'Percentages',
    difficulty: 2,
    question_text: "Revenue was £{rev1}m in Q1 and £{rev2}m in Q2. What is the percentage change from Q1 to Q2?",
    variables: {
      rev1: { min: 100, max: 400, step: 10 },
      rev2: { min: 100, max: 500, step: 10 }
    },
    correct_formula: '(rev2 - rev1) / rev1 * 100',
    distractor_formulas: [
      '(rev2 - rev1) / rev2 * 100',
      '(rev1 - rev2) / rev1 * 100',
      'rev2 / rev1 * 100',
      '(rev2 - rev1) / (rev1 + rev2) * 100'
    ],
    answer_suffix: '%',
    answer_decimals: 1,
    allow_negative: false,
    explanation_text: '(£{rev2}m − £{rev1}m) / £{rev1}m × 100 = {answer}%',
    tags: ['percentage-change', 'revenue']
  },

  {
    id: 'NR-PCT-005',
    category: 'NR',
    sub_category: 'Percentages',
    difficulty: 2,
    question_text: "A consultant's daily rate is £{rate}. If the rate increases by {inc1}% in Year 1 and a further {inc2}% in Year 2, what is the Year 2 rate?",
    variables: {
      rate: { min: 300, max: 800, step: 50 },
      inc1: { min: 3, max: 12, step: 1 },
      inc2: { min: 3, max: 12, step: 1 }
    },
    correct_formula: 'rate * (1 + inc1 / 100) * (1 + inc2 / 100)',
    distractor_formulas: [
      'rate * (1 + (inc1 + inc2) / 100)',
      'rate + rate * inc1 / 100 + rate * inc2 / 100',
      'rate * (1 + inc1 / 100) + rate * inc2 / 100',
      'rate * (1 + inc1 * inc2 / 10000)'
    ],
    answer_prefix: '£',
    answer_decimals: 2,
    allow_negative: false,
    explanation_text: '£{rate} × (1 + {inc1}%) × (1 + {inc2}%) = £{answer}',
    tags: ['successive-percentage', 'rates']
  },

  {
    id: 'NR-PCT-006',
    category: 'NR',
    sub_category: 'Percentages',
    difficulty: 2,
    question_text: "A firm's operating costs were £{costs}m. If {pct1}% was spent on salaries and {pct2}% of the remainder on rent, how much was spent on rent?",
    variables: {
      costs: { min: 50, max: 300, step: 10 },
      pct1: { min: 30, max: 60, step: 5 },
      pct2: { min: 10, max: 30, step: 5 }
    },
    correct_formula: 'costs * (1 - pct1 / 100) * pct2 / 100',
    distractor_formulas: [
      'costs * pct2 / 100',
      'costs * (pct1 + pct2) / 100',
      'costs * pct1 / 100 * pct2 / 100',
      'costs * (1 - pct1 / 100) * (1 - pct2 / 100)'
    ],
    answer_prefix: '£',
    answer_suffix: 'm',
    answer_decimals: 1,
    allow_negative: false,
    explanation_text: 'Remainder after salaries = £{costs}m × (1 − {pct1}%). Rent = remainder × {pct2}% = £{answer}m',
    tags: ['percentage-of-remainder', 'costs']
  },

  {
    id: 'NR-PCT-007',
    category: 'NR',
    sub_category: 'Percentages',
    difficulty: 2,
    question_text: "A portfolio was worth £{val}k. It fell by {drop}% in March then rose by {rise}% in April. What was the value at the end of April?",
    variables: {
      val: { min: 100, max: 500, step: 25 },
      drop: { min: 5, max: 20, step: 1 },
      rise: { min: 5, max: 25, step: 1 }
    },
    correct_formula: 'val * (1 - drop / 100) * (1 + rise / 100)',
    distractor_formulas: [
      'val * (1 + (rise - drop) / 100)',
      'val - val * drop / 100 + val * rise / 100',
      'val * (1 - drop / 100) + val * rise / 100',
      'val * rise / drop'
    ],
    answer_prefix: '£',
    answer_suffix: 'k',
    answer_decimals: 1,
    allow_negative: false,
    explanation_text: '£{val}k × (1 − {drop}%) × (1 + {rise}%) = £{answer}k',
    tags: ['successive-percentage', 'portfolio']
  },

  {
    id: 'NR-PCT-008',
    category: 'NR',
    sub_category: 'Percentages',
    difficulty: 3,
    question_text: "A product's price was increased by {inc}% and then decreased by {dec}%. If the final price is £{final}, what was the original price?",
    variables: {
      inc: { min: 10, max: 30, step: 5 },
      dec: { min: 5, max: 20, step: 5 },
      final: { min: 50, max: 200, step: 10 }
    },
    correct_formula: 'final / ((1 + inc / 100) * (1 - dec / 100))',
    distractor_formulas: [
      'final / (1 + (inc - dec) / 100)',
      'final * (1 - inc / 100) * (1 + dec / 100)',
      'final / (1 + inc / 100) / (1 + dec / 100)',
      'final * 100 / (inc - dec + 100)'
    ],
    answer_prefix: '£',
    answer_decimals: 2,
    allow_negative: false,
    explanation_text: 'Original = £{final} / ((1 + {inc}%) × (1 − {dec}%)) = £{answer}',
    tags: ['reverse-percentage', 'price']
  },

  {
    id: 'NR-PCT-009',
    category: 'NR',
    sub_category: 'Percentages',
    difficulty: 3,
    question_text: "Tax of {tax}% is applied to a gross salary of £{salary}. After tax, {pension}% of the net amount goes to pension. What is the take-home pay?",
    variables: {
      salary: { min: 30000, max: 80000, step: 5000 },
      tax: { min: 20, max: 40, step: 5 },
      pension: { min: 3, max: 8, step: 1 }
    },
    correct_formula: 'salary * (1 - tax / 100) * (1 - pension / 100)',
    distractor_formulas: [
      'salary * (1 - (tax + pension) / 100)',
      'salary - salary * tax / 100 - salary * pension / 100',
      'salary * (1 - tax / 100) - salary * pension / 100',
      'salary * (100 - tax - pension) / 100'
    ],
    answer_prefix: '£',
    answer_decimals: 2,
    allow_negative: false,
    explanation_text: 'After tax: £{salary} × (1 − {tax}%). After pension: × (1 − {pension}%) = £{answer}',
    tags: ['successive-percentage', 'salary', 'tax']
  },

  {
    id: 'NR-PCT-010',
    category: 'NR',
    sub_category: 'Percentages',
    difficulty: 3,
    question_text: "After a {inc}% price increase, a product sells for £{newPrice}. What was the original price before the increase?",
    variables: {
      inc: { min: 5, max: 30, step: 5 },
      newPrice: { min: 50, max: 300, step: 10 }
    },
    correct_formula: 'newPrice / (1 + inc / 100)',
    distractor_formulas: [
      'newPrice * (1 - inc / 100)',
      'newPrice - inc',
      'newPrice / inc * 100',
      'newPrice * 100 / (100 + inc) + inc'
    ],
    answer_prefix: '£',
    answer_decimals: 2,
    allow_negative: false,
    explanation_text: 'Original price = £{newPrice} / (1 + {inc}%) = £{answer}',
    tags: ['reverse-percentage', 'price']
  },

  // ═══════════════════════════════════════════════════════════
  // RATIOS & PROPORTIONS (10)  —  NR-RAT-001 … NR-RAT-010
  // ═══════════════════════════════════════════════════════════

  {
    id: 'NR-RAT-001',
    category: 'NR',
    sub_category: 'Ratios & Proportions',
    difficulty: 1,
    question_text: "A budget of £{budget}k is split between Marketing and Operations in the ratio {r1}:{r2}. How much does Marketing receive?",
    variables: {
      budget: { min: 100, max: 500, step: 10 },
      r1: { min: 2, max: 5, step: 1 },
      r2: { min: 2, max: 5, step: 1 }
    },
    correct_formula: 'budget * r1 / (r1 + r2)',
    distractor_formulas: [
      'budget * r2 / (r1 + r2)',
      'budget / r1',
      'budget * r1 / r2',
      'budget / (r1 + r2)'
    ],
    answer_prefix: '£',
    answer_suffix: 'k',
    answer_decimals: 1,
    allow_negative: false,
    explanation_text: 'Marketing share = £{budget}k × {r1} / ({r1} + {r2}) = £{answer}k',
    tags: ['ratio-split', 'budget']
  },

  {
    id: 'NR-RAT-002',
    category: 'NR',
    sub_category: 'Ratios & Proportions',
    difficulty: 1,
    question_text: "In a team of {total} people, the ratio of analysts to managers is {r1}:{r2}. How many analysts are there?",
    variables: {
      total: { min: 20, max: 100, step: 5 },
      r1: { min: 3, max: 7, step: 1 },
      r2: { min: 1, max: 3, step: 1 }
    },
    correct_formula: 'total * r1 / (r1 + r2)',
    distractor_formulas: [
      'total * r2 / (r1 + r2)',
      'total / r1',
      'total - total / r2',
      'total * r2 / r1'
    ],
    answer_decimals: 0,
    allow_negative: false,
    explanation_text: 'Analysts = {total} × {r1} / ({r1} + {r2}) = {answer}',
    tags: ['ratio-split', 'headcount']
  },

  {
    id: 'NR-RAT-003',
    category: 'NR',
    sub_category: 'Ratios & Proportions',
    difficulty: 1,
    question_text: "A printing company uses {ink}ml of ink for {pages} pages. How much ink is needed for {target} pages?",
    variables: {
      ink: { min: 200, max: 500, step: 50 },
      pages: { min: 100, max: 500, step: 50 },
      target: { min: 600, max: 2000, step: 100 }
    },
    correct_formula: 'ink * target / pages',
    distractor_formulas: [
      'ink + target',
      'ink * pages / target',
      'ink * target',
      'target / pages'
    ],
    answer_suffix: 'ml',
    answer_decimals: 0,
    allow_negative: false,
    explanation_text: '{ink}ml × {target} / {pages} = {answer}ml',
    tags: ['direct-proportion', 'scaling']
  },

  {
    id: 'NR-RAT-004',
    category: 'NR',
    sub_category: 'Ratios & Proportions',
    difficulty: 1,
    question_text: "A company's annual profit of £{profit}k is divided between two partners in the ratio {r1}:{r2}. How much does the partner with the larger share receive?",
    variables: {
      profit: { min: 100, max: 500, step: 50 },
      r1: { min: 3, max: 7, step: 1 },
      r2: { min: 1, max: 4, step: 1 }
    },
    correct_formula: 'profit * Math.max(r1, r2) / (r1 + r2)',
    distractor_formulas: [
      'profit * Math.min(r1, r2) / (r1 + r2)',
      'profit / (r1 + r2)',
      'profit * r1 * r2 / (r1 + r2)',
      'profit / r2'
    ],
    answer_prefix: '£',
    answer_suffix: 'k',
    answer_decimals: 1,
    allow_negative: false,
    explanation_text: 'Larger share = £{profit}k × larger of {r1} and {r2} / ({r1} + {r2}) = £{answer}k',
    tags: ['ratio-split', 'profit-sharing']
  },

  {
    id: 'NR-RAT-005',
    category: 'NR',
    sub_category: 'Ratios & Proportions',
    difficulty: 2,
    question_text: "A fund of £{fund}m is allocated to Equities, Bonds, and Cash in the ratio {e}:{b}:{c}. How much is allocated to Bonds?",
    variables: {
      fund: { min: 50, max: 300, step: 10 },
      e: { min: 3, max: 6, step: 1 },
      b: { min: 2, max: 4, step: 1 },
      c: { min: 1, max: 3, step: 1 }
    },
    correct_formula: 'fund * b / (e + b + c)',
    distractor_formulas: [
      'fund * e / (e + b + c)',
      'fund * c / (e + b + c)',
      'fund / b',
      'fund * b / e'
    ],
    answer_prefix: '£',
    answer_suffix: 'm',
    answer_decimals: 1,
    allow_negative: false,
    explanation_text: 'Bonds = £{fund}m × {b} / ({e} + {b} + {c}) = £{answer}m',
    tags: ['three-way-ratio', 'fund-allocation']
  },

  {
    id: 'NR-RAT-006',
    category: 'NR',
    sub_category: 'Ratios & Proportions',
    difficulty: 2,
    question_text: "If {workers1} workers complete a project in {days1} days, how many days would {workers2} workers take (assuming equal productivity)?",
    variables: {
      workers1: { min: 4, max: 12, step: 1 },
      days1: { min: 10, max: 30, step: 5 },
      workers2: { min: 6, max: 20, step: 2 }
    },
    correct_formula: 'workers1 * days1 / workers2',
    distractor_formulas: [
      'days1 * workers2 / workers1',
      'days1 + workers1 - workers2',
      'days1 * (workers1 / workers2 + 1)',
      'workers2 * days1 / workers1'
    ],
    answer_suffix: ' days',
    answer_decimals: 1,
    allow_negative: false,
    explanation_text: 'Total work = {workers1} × {days1} worker-days. Days for {workers2} workers = {answer} days',
    tags: ['inverse-proportion', 'work-rate']
  },

  {
    id: 'NR-RAT-007',
    category: 'NR',
    sub_category: 'Ratios & Proportions',
    difficulty: 2,
    question_text: "Profit of £{profit}k is shared between three partners in the ratio {a}:{b}:{c}. What is the difference between the largest and smallest shares?",
    variables: {
      profit: { min: 100, max: 500, step: 50 },
      a: { min: 2, max: 5, step: 1 },
      b: { min: 3, max: 6, step: 1 },
      c: { min: 1, max: 3, step: 1 }
    },
    correct_formula: 'profit * (Math.max(a, b, c) - Math.min(a, b, c)) / (a + b + c)',
    distractor_formulas: [
      'profit * (a - c) / (a + b + c)',
      'profit / (a + b + c)',
      'profit * b / (a + b + c)',
      'profit * (a + b) / (a + b + c) - profit * c / (a + b + c) + 5'
    ],
    answer_prefix: '£',
    answer_suffix: 'k',
    answer_decimals: 1,
    allow_negative: false,
    explanation_text: 'Difference = £{profit}k × (max − min) / ({a} + {b} + {c}) = £{answer}k',
    tags: ['ratio-difference', 'profit-sharing']
  },

  {
    id: 'NR-RAT-008',
    category: 'NR',
    sub_category: 'Ratios & Proportions',
    difficulty: 3,
    question_text: "In Year 1, the ratio of UK to International revenue was {uk1}:{int1}. In Year 2, total revenue grew by {grow}% and the ratio changed to {uk2}:{int2}. If Year 1 total revenue was £{rev}m, what was Year 2 International revenue?",
    variables: {
      uk1: { min: 3, max: 5, step: 1 },
      int1: { min: 1, max: 3, step: 1 },
      uk2: { min: 2, max: 4, step: 1 },
      int2: { min: 2, max: 4, step: 1 },
      grow: { min: 5, max: 20, step: 5 },
      rev: { min: 100, max: 400, step: 50 }
    },
    correct_formula: 'rev * (1 + grow / 100) * int2 / (uk2 + int2)',
    distractor_formulas: [
      'rev * int2 / (uk2 + int2)',
      'rev * (1 + grow / 100) * uk2 / (uk2 + int2)',
      'rev * int1 / (uk1 + int1) * (1 + grow / 100)',
      'rev * (1 + grow / 100) * int2 / uk2'
    ],
    answer_prefix: '£',
    answer_suffix: 'm',
    answer_decimals: 1,
    allow_negative: false,
    explanation_text: 'Year 2 total = £{rev}m × (1 + {grow}%). International = total × {int2} / ({uk2} + {int2}) = £{answer}m',
    tags: ['ratio-with-growth', 'revenue-split']
  },

  {
    id: 'NR-RAT-009',
    category: 'NR',
    sub_category: 'Ratios & Proportions',
    difficulty: 3,
    question_text: "Three departments have budgets in the ratio {a}:{b}:{c}. The total budget is £{total}k. If Department A's budget is cut by {cutPct}% and redistributed equally to B and C, what is Department B's new budget?",
    variables: {
      a: { min: 4, max: 6, step: 1 },
      b: { min: 2, max: 4, step: 1 },
      c: { min: 1, max: 3, step: 1 },
      total: { min: 200, max: 600, step: 50 },
      cutPct: { min: 10, max: 30, step: 5 }
    },
    correct_formula: 'total * b / (a + b + c) + total * a / (a + b + c) * cutPct / 100 / 2',
    distractor_formulas: [
      'total * b / (a + b + c) + total * cutPct / 100 / 2',
      'total * b / (a + b + c) * (1 + cutPct / 100)',
      'total * (b + a * cutPct / 100) / (a + b + c)',
      'total * b / (a + b + c) + total * a / (a + b + c) * cutPct / 100'
    ],
    answer_prefix: '£',
    answer_suffix: 'k',
    answer_decimals: 1,
    allow_negative: false,
    explanation_text: "B's original = £{total}k × {b} / ({a} + {b} + {c}). A's cut amount = A's budget × {cutPct}%, half goes to B. New B = £{answer}k",
    tags: ['ratio-redistribution', 'budget']
  },

  {
    id: 'NR-RAT-010',
    category: 'NR',
    sub_category: 'Ratios & Proportions',
    difficulty: 3,
    question_text: "A company splits its £{revenue}m revenue between Products and Services in the ratio {p}:{s}. If Product revenue grows by {pGrow}% and Service revenue grows by {sGrow}%, what is the new total revenue?",
    variables: {
      revenue: { min: 100, max: 500, step: 50 },
      p: { min: 2, max: 5, step: 1 },
      s: { min: 2, max: 5, step: 1 },
      pGrow: { min: 5, max: 20, step: 5 },
      sGrow: { min: 3, max: 15, step: 3 }
    },
    correct_formula: 'revenue * p / (p + s) * (1 + pGrow / 100) + revenue * s / (p + s) * (1 + sGrow / 100)',
    distractor_formulas: [
      'revenue * (1 + (pGrow + sGrow) / 200)',
      'revenue * (1 + pGrow / 100) * (1 + sGrow / 100)',
      'revenue + revenue * pGrow / 100 + revenue * sGrow / 100',
      'revenue * (p * pGrow + s * sGrow) / (p + s) / 100'
    ],
    answer_prefix: '£',
    answer_suffix: 'm',
    answer_decimals: 1,
    allow_negative: false,
    explanation_text: 'Products = £{revenue}m × {p}/({p}+{s}) grown by {pGrow}%. Services = £{revenue}m × {s}/({p}+{s}) grown by {sGrow}%. New total = £{answer}m',
    tags: ['ratio-growth', 'revenue']
  },

  // ═══════════════════════════════════════════════════════════
  // FRACTIONS & DECIMALS (7)  —  NR-FRC-001 … NR-FRC-007
  // ═══════════════════════════════════════════════════════════

  {
    id: 'NR-FRC-001',
    category: 'NR',
    sub_category: 'Fractions & Decimals',
    difficulty: 1,
    question_text: "A project is {num}/{den} complete. If the total project value is £{value}k, how much work remains (in £k)?",
    variables: {
      num: { min: 1, max: 4, step: 1 },
      den: { min: 5, max: 8, step: 1 },
      value: { min: 100, max: 500, step: 50 }
    },
    correct_formula: 'value * (1 - num / den)',
    distractor_formulas: [
      'value * num / den',
      'value / den',
      'value - num',
      'value * (den - num)'
    ],
    answer_prefix: '£',
    answer_suffix: 'k',
    answer_decimals: 1,
    allow_negative: false,
    explanation_text: 'Remaining = £{value}k × (1 − {num}/{den}) = £{answer}k',
    tags: ['fractions', 'project-value']
  },

  {
    id: 'NR-FRC-002',
    category: 'NR',
    sub_category: 'Fractions & Decimals',
    difficulty: 1,
    question_text: "An office has {total} desks. If {num}/{den} are occupied, how many desks are empty?",
    variables: {
      total: { min: 50, max: 200, step: 10 },
      num: { min: 2, max: 5, step: 1 },
      den: { min: 6, max: 10, step: 1 }
    },
    correct_formula: 'total * (1 - num / den)',
    distractor_formulas: [
      'total * num / den',
      'total - num',
      'total / den',
      'total - total / num'
    ],
    answer_decimals: 0,
    allow_negative: false,
    explanation_text: 'Empty = {total} × (1 − {num}/{den}) = {answer}',
    tags: ['fractions', 'occupancy']
  },

  {
    id: 'NR-FRC-003',
    category: 'NR',
    sub_category: 'Fractions & Decimals',
    difficulty: 2,
    question_text: "A fund allocates 0.{d1} of its capital to equities and 0.{d2} to bonds. If total capital is £{cap}m, how much is allocated to other assets?",
    variables: {
      d1: { min: 25, max: 45, step: 5 },
      d2: { min: 15, max: 35, step: 5 },
      cap: { min: 100, max: 500, step: 50 }
    },
    correct_formula: 'cap * (1 - d1 / 100 - d2 / 100)',
    distractor_formulas: [
      'cap * (d1 + d2) / 100',
      'cap - d1 - d2',
      'cap * d1 / 100',
      'cap / (d1 + d2) * 100'
    ],
    answer_prefix: '£',
    answer_suffix: 'm',
    answer_decimals: 1,
    allow_negative: false,
    explanation_text: 'Other = £{cap}m × (1 − 0.{d1} − 0.{d2}) = £{answer}m',
    tags: ['decimals', 'fund-allocation']
  },

  {
    id: 'NR-FRC-004',
    category: 'NR',
    sub_category: 'Fractions & Decimals',
    difficulty: 2,
    question_text: "Machine A produces {a} units per hour and Machine B produces {b} units per hour. Working together, how many hours to produce {target} units?",
    variables: {
      a: { min: 10, max: 30, step: 5 },
      b: { min: 15, max: 40, step: 5 },
      target: { min: 200, max: 600, step: 50 }
    },
    correct_formula: 'target / (a + b)',
    distractor_formulas: [
      'target / a + target / b',
      'target * (a + b)',
      '(target / a) * (target / b)',
      'target / a'
    ],
    answer_suffix: ' hours',
    answer_decimals: 1,
    allow_negative: false,
    explanation_text: 'Combined rate = {a} + {b} units/hr. Time = {target} / combined rate = {answer} hours',
    tags: ['rates', 'combined-work']
  },

  {
    id: 'NR-FRC-005',
    category: 'NR',
    sub_category: 'Fractions & Decimals',
    difficulty: 2,
    question_text: "A loan of £{loan} has an annual interest rate of {rate}%. What is the simple interest after {months} months?",
    variables: {
      loan: { min: 5000, max: 30000, step: 5000 },
      rate: { min: 3, max: 10, step: 1 },
      months: { min: 3, max: 18, step: 3 }
    },
    correct_formula: 'loan * rate / 100 * months / 12',
    distractor_formulas: [
      'loan * rate / 100',
      'loan * rate * months / 100',
      'loan * rate / 100 / months',
      'loan * rate / 1200 * 12'
    ],
    answer_prefix: '£',
    answer_decimals: 2,
    allow_negative: false,
    explanation_text: 'Interest = £{loan} × {rate}% × {months}/12 = £{answer}',
    tags: ['simple-interest', 'loan']
  },

  {
    id: 'NR-FRC-006',
    category: 'NR',
    sub_category: 'Fractions & Decimals',
    difficulty: 3,
    question_text: "Three pipes fill a tank. Pipe A fills 1/{a} of the tank per hour, Pipe B fills 1/{b}, and Pipe C fills 1/{c}. How many hours to fill the tank with all three?",
    variables: {
      a: { min: 3, max: 6, step: 1 },
      b: { min: 4, max: 8, step: 1 },
      c: { min: 5, max: 10, step: 1 }
    },
    correct_formula: '1 / (1/a + 1/b + 1/c)',
    distractor_formulas: [
      'a + b + c',
      '(a + b + c) / 3',
      'a * b * c / (a + b + c)',
      '1 / (a + b + c)'
    ],
    answer_suffix: ' hours',
    answer_decimals: 2,
    allow_negative: false,
    explanation_text: 'Combined rate = 1/{a} + 1/{b} + 1/{c} per hour. Time = 1 / combined rate = {answer} hours',
    tags: ['combined-rates', 'fractions']
  },

  {
    id: 'NR-FRC-007',
    category: 'NR',
    sub_category: 'Fractions & Decimals',
    difficulty: 3,
    question_text: "An investment of £{inv} earns {r1}% for the first {m1} months and {r2}% for the remaining {m2} months (simple interest, applied separately). What is the total value at the end?",
    variables: {
      inv: { min: 10000, max: 50000, step: 5000 },
      r1: { min: 3, max: 8, step: 1 },
      m1: { min: 3, max: 6, step: 3 },
      r2: { min: 4, max: 10, step: 1 },
      m2: { min: 3, max: 9, step: 3 }
    },
    correct_formula: 'inv + inv * r1 / 100 * m1 / 12 + inv * r2 / 100 * m2 / 12',
    distractor_formulas: [
      'inv * (1 + r1 / 100) * (1 + r2 / 100)',
      'inv + inv * (r1 + r2) / 100 * (m1 + m2) / 12',
      'inv * (1 + (r1 * m1 + r2 * m2) / 1200)',
      'inv + inv * r1 / 100 + inv * r2 / 100'
    ],
    answer_prefix: '£',
    answer_decimals: 2,
    allow_negative: false,
    explanation_text: 'Interest period 1 = £{inv} × {r1}% × {m1}/12. Interest period 2 = £{inv} × {r2}% × {m2}/12. Total = £{answer}',
    tags: ['split-interest', 'investment']
  },

  // ═══════════════════════════════════════════════════════════
  // CURRENCY & CONVERSIONS (7)  —  NR-CUR-001 … NR-CUR-007
  // ═══════════════════════════════════════════════════════════

  {
    id: 'NR-CUR-001',
    category: 'NR',
    sub_category: 'Currency & Conversions',
    difficulty: 1,
    question_text: "The exchange rate is £1 = ${rate}. How much is £{gbp} in US dollars?",
    variables: {
      rate: { min: 1.2, max: 1.4, step: 0.01, decimals: 2 },
      gbp: { min: 500, max: 5000, step: 500 }
    },
    correct_formula: 'gbp * rate',
    distractor_formulas: [
      'gbp / rate',
      'gbp + rate',
      'gbp * rate * 1.1',
      'gbp / rate * 0.9'
    ],
    answer_prefix: '$',
    answer_decimals: 2,
    allow_negative: false,
    explanation_text: '£{gbp} × ${rate} = ${answer}',
    tags: ['currency-conversion', 'exchange-rate']
  },

  {
    id: 'NR-CUR-002',
    category: 'NR',
    sub_category: 'Currency & Conversions',
    difficulty: 1,
    question_text: "A factory produces {units} units in {hours} hours. How many units per minute?",
    variables: {
      units: { min: 300, max: 1200, step: 60 },
      hours: { min: 2, max: 8, step: 1 }
    },
    correct_formula: 'units / hours / 60',
    distractor_formulas: [
      'units / hours',
      'units * 60 / hours',
      'units / (hours * 60 + 60)',
      'hours * 60 / units'
    ],
    answer_decimals: 2,
    allow_negative: false,
    explanation_text: '{units} units / {hours} hours / 60 minutes = {answer} per minute',
    tags: ['unit-conversion', 'rate']
  },

  {
    id: 'NR-CUR-003',
    category: 'NR',
    sub_category: 'Currency & Conversions',
    difficulty: 2,
    question_text: "A UK firm invoices €{eur} to a European client. The exchange rate is £1 = €{rate}. The bank charges a {fee}% conversion fee. How much does the firm receive in GBP?",
    variables: {
      eur: { min: 5000, max: 50000, step: 5000 },
      rate: { min: 1.1, max: 1.25, step: 0.01, decimals: 2 },
      fee: { min: 1, max: 3, step: 0.5, decimals: 1 }
    },
    correct_formula: 'eur / rate * (1 - fee / 100)',
    distractor_formulas: [
      'eur / rate',
      'eur * rate * (1 - fee / 100)',
      'eur / rate - fee',
      'eur * (1 - fee / 100)'
    ],
    answer_prefix: '£',
    answer_decimals: 2,
    allow_negative: false,
    explanation_text: '€{eur} / {rate} then less {fee}% fee = £{answer}',
    tags: ['currency-conversion', 'fees']
  },

  {
    id: 'NR-CUR-004',
    category: 'NR',
    sub_category: 'Currency & Conversions',
    difficulty: 2,
    question_text: "A data centre uses {kwh} kWh of electricity per day. If the rate is {rate}p per kWh, what is the monthly (30-day) electricity cost?",
    variables: {
      kwh: { min: 500, max: 3000, step: 100 },
      rate: { min: 15, max: 35, step: 1 }
    },
    correct_formula: 'kwh * rate * 30 / 100',
    distractor_formulas: [
      'kwh * rate * 30',
      'kwh * rate / 100',
      'kwh * 30 / rate',
      'kwh * rate * 365 / 100'
    ],
    answer_prefix: '£',
    answer_decimals: 2,
    allow_negative: false,
    explanation_text: '{kwh} kWh × {rate}p × 30 days / 100 = £{answer}',
    tags: ['unit-conversion', 'energy-cost']
  },

  {
    id: 'NR-CUR-005',
    category: 'NR',
    sub_category: 'Currency & Conversions',
    difficulty: 2,
    question_text: "A car travels {km} km on {litres} litres of fuel. Fuel costs £{price} per litre. What is the fuel cost per mile? (1 mile = 1.609 km)",
    variables: {
      km: { min: 300, max: 700, step: 50 },
      litres: { min: 25, max: 55, step: 5 },
      price: { min: 1.3, max: 1.8, step: 0.05, decimals: 2 }
    },
    correct_formula: 'litres * price / (km / 1.609)',
    distractor_formulas: [
      'litres * price / km',
      'km / litres * price',
      'litres * price / km * 1.609',
      'price / (km / litres)'
    ],
    answer_prefix: '£',
    answer_decimals: 2,
    allow_negative: false,
    explanation_text: 'Miles = {km} / 1.609. Total cost = {litres} × £{price}. Cost per mile = £{answer}',
    tags: ['unit-conversion', 'fuel-cost']
  },

  {
    id: 'NR-CUR-006',
    category: 'NR',
    sub_category: 'Currency & Conversions',
    difficulty: 3,
    question_text: "A US company reports revenue of ${usd}m. A UK analyst converts this at £1 = ${rate1}. Three months later the rate is £1 = ${rate2}. What is the absolute GBP change in reported revenue due to the exchange rate movement alone?",
    variables: {
      usd: { min: 100, max: 500, step: 50 },
      rate1: { min: 1.2, max: 1.35, step: 0.01, decimals: 2 },
      rate2: { min: 1.25, max: 1.45, step: 0.01, decimals: 2 }
    },
    correct_formula: 'Math.abs(usd / rate1 - usd / rate2)',
    distractor_formulas: [
      'usd * Math.abs(rate2 - rate1)',
      'Math.abs(usd * rate1 - usd * rate2)',
      'usd / Math.abs(rate2 - rate1)',
      'usd * Math.abs(1/rate1 - 1/rate2) * 2'
    ],
    answer_prefix: '£',
    answer_suffix: 'm',
    answer_decimals: 1,
    allow_negative: false,
    explanation_text: 'At rate {rate1}: ${usd}m = £(${usd}m/{rate1}). At rate {rate2}: ${usd}m = £(${usd}m/{rate2}). Change = £{answer}m',
    tags: ['fx-impact', 'exchange-rate']
  },

  {
    id: 'NR-CUR-007',
    category: 'NR',
    sub_category: 'Currency & Conversions',
    difficulty: 3,
    question_text: "An employee works {hours} hours per week at £{hourly}/hour. They receive a {bonus}% annual bonus. Assuming {weeks} working weeks per year, what is the total annual compensation?",
    variables: {
      hours: { min: 35, max: 45, step: 5 },
      hourly: { min: 15, max: 40, step: 5 },
      bonus: { min: 5, max: 15, step: 1 },
      weeks: { min: 48, max: 52, step: 1 }
    },
    correct_formula: 'hours * hourly * weeks * (1 + bonus / 100)',
    distractor_formulas: [
      'hours * hourly * weeks + bonus',
      'hours * hourly * weeks',
      'hours * hourly * 52 * bonus / 100',
      'hours * hourly * weeks + hours * hourly * bonus'
    ],
    answer_prefix: '£',
    answer_decimals: 2,
    allow_negative: false,
    explanation_text: 'Base = {hours} × £{hourly} × {weeks} weeks. Plus {bonus}% bonus. Total = £{answer}',
    tags: ['compensation', 'annual-salary']
  },

  // ═══════════════════════════════════════════════════════════
  // AVERAGES & GROWTH (8)  —  NR-AVG-001 … NR-AVG-008
  // ═══════════════════════════════════════════════════════════

  {
    id: 'NR-AVG-001',
    category: 'NR',
    sub_category: 'Averages & Growth',
    difficulty: 1,
    question_text: "A team of {n} consultants billed {total} hours last month. What was the average hours per consultant?",
    variables: {
      n: { min: 5, max: 20, step: 1 },
      total: { min: 500, max: 3000, step: 100 }
    },
    correct_formula: 'total / n',
    distractor_formulas: [
      'total * n',
      'total - n',
      'n / total * 100',
      'total / (n + 1)'
    ],
    answer_decimals: 1,
    allow_negative: false,
    explanation_text: '{total} / {n} = {answer} hours per consultant',
    tags: ['average', 'billable-hours']
  },

  {
    id: 'NR-AVG-002',
    category: 'NR',
    sub_category: 'Averages & Growth',
    difficulty: 1,
    question_text: "Revenue over 4 quarters was £{q1}m, £{q2}m, £{q3}m, and £{q4}m. What was the average quarterly revenue?",
    variables: {
      q1: { min: 30, max: 80, step: 5 },
      q2: { min: 30, max: 80, step: 5 },
      q3: { min: 30, max: 80, step: 5 },
      q4: { min: 30, max: 80, step: 5 }
    },
    correct_formula: '(q1 + q2 + q3 + q4) / 4',
    distractor_formulas: [
      '(q1 + q4) / 2',
      'q1 + q2 + q3 + q4',
      '(q4 - q1) / 4',
      '(q1 + q2 + q3 + q4) / 3'
    ],
    answer_prefix: '£',
    answer_suffix: 'm',
    answer_decimals: 1,
    allow_negative: false,
    explanation_text: '(£{q1}m + £{q2}m + £{q3}m + £{q4}m) / 4 = £{answer}m',
    tags: ['average', 'quarterly-revenue']
  },

  {
    id: 'NR-AVG-003',
    category: 'NR',
    sub_category: 'Averages & Growth',
    difficulty: 1,
    question_text: "A company sold {units} units at an average price of £{avgPrice}. What was the total revenue?",
    variables: {
      units: { min: 100, max: 1000, step: 50 },
      avgPrice: { min: 10, max: 80, step: 5 }
    },
    correct_formula: 'units * avgPrice',
    distractor_formulas: [
      'units / avgPrice',
      'units + avgPrice',
      'units * avgPrice / 100',
      'avgPrice / units'
    ],
    answer_prefix: '£',
    answer_decimals: 0,
    allow_negative: false,
    explanation_text: '{units} units × £{avgPrice} = £{answer}',
    tags: ['average', 'revenue']
  },

  {
    id: 'NR-AVG-004',
    category: 'NR',
    sub_category: 'Averages & Growth',
    difficulty: 2,
    question_text: "A company's revenue was £{rev1}m in Year 1 and £{rev2}m in Year 2. What was the year-on-year growth rate?",
    variables: {
      rev1: { min: 50, max: 300, step: 25 },
      rev2: { min: 60, max: 400, step: 25 }
    },
    correct_formula: '(rev2 - rev1) / rev1 * 100',
    distractor_formulas: [
      '(rev2 - rev1) / rev2 * 100',
      'rev2 / rev1 * 100',
      '(rev1 - rev2) / rev1 * 100',
      '(rev2 - rev1) / (rev1 + rev2) * 200'
    ],
    answer_suffix: '%',
    answer_decimals: 1,
    allow_negative: false,
    explanation_text: '(£{rev2}m − £{rev1}m) / £{rev1}m × 100 = {answer}%',
    tags: ['growth-rate', 'revenue']
  },

  {
    id: 'NR-AVG-005',
    category: 'NR',
    sub_category: 'Averages & Growth',
    difficulty: 2,
    question_text: "The average salary of {n1} employees in Dept A is £{avg1}k. The average salary of {n2} employees in Dept B is £{avg2}k. What is the overall average salary?",
    variables: {
      n1: { min: 10, max: 30, step: 5 },
      avg1: { min: 30, max: 60, step: 5 },
      n2: { min: 15, max: 40, step: 5 },
      avg2: { min: 35, max: 70, step: 5 }
    },
    correct_formula: '(n1 * avg1 + n2 * avg2) / (n1 + n2)',
    distractor_formulas: [
      '(avg1 + avg2) / 2',
      '(n1 * avg1 + n2 * avg2) / 2',
      'avg1 * n2 / (n1 + n2) + avg2 * n1 / (n1 + n2)',
      '(n1 + n2) / (n1 / avg1 + n2 / avg2)'
    ],
    answer_prefix: '£',
    answer_suffix: 'k',
    answer_decimals: 1,
    allow_negative: false,
    explanation_text: 'Weighted average = ({n1} × £{avg1}k + {n2} × £{avg2}k) / ({n1} + {n2}) = £{answer}k',
    tags: ['weighted-average', 'salary']
  },

  {
    id: 'NR-AVG-006',
    category: 'NR',
    sub_category: 'Averages & Growth',
    difficulty: 3,
    question_text: "Revenue grew by {g1}% in Year 1, {g2}% in Year 2, and {g3}% in Year 3. What was the average annual growth rate over the 3 years (geometric mean)?",
    variables: {
      g1: { min: 5, max: 25, step: 1 },
      g2: { min: 3, max: 20, step: 1 },
      g3: { min: 2, max: 18, step: 1 }
    },
    correct_formula: '(Math.pow((1+g1/100)*(1+g2/100)*(1+g3/100), 1/3) - 1) * 100',
    distractor_formulas: [
      '(g1 + g2 + g3) / 3',
      'Math.pow(g1 * g2 * g3, 1/3)',
      '(g1 + g2 + g3) / 3 * 1.05',
      'Math.pow((1+g1/100)*(1+g2/100)*(1+g3/100), 1/2) * 100 - 100'
    ],
    answer_suffix: '%',
    answer_decimals: 1,
    allow_negative: false,
    explanation_text: 'CAGR = ((1 + {g1}%) × (1 + {g2}%) × (1 + {g3}%))^(1/3) − 1 = {answer}%',
    tags: ['cagr', 'geometric-mean']
  },

  {
    id: 'NR-AVG-007',
    category: 'NR',
    sub_category: 'Averages & Growth',
    difficulty: 3,
    question_text: "A group of {n} people has an average age of {avg}. When {leave} people with an average age of {leaveAvg} leave, what is the new average age?",
    variables: {
      n: { min: 15, max: 30, step: 5 },
      avg: { min: 28, max: 40, step: 1 },
      leave: { min: 3, max: 5, step: 1 },
      leaveAvg: { min: 22, max: 35, step: 1 }
    },
    correct_formula: '(n * avg - leave * leaveAvg) / (n - leave)',
    distractor_formulas: [
      'avg - leaveAvg',
      '(n * avg - leave * leaveAvg) / n',
      'avg + (avg - leaveAvg) * leave / n',
      '(avg * n + leaveAvg * leave) / (n + leave)'
    ],
    answer_decimals: 1,
    allow_negative: false,
    explanation_text: 'Total age = {n} × {avg}. Remove {leave} × {leaveAvg}. New avg = remaining total / ({n} − {leave}) = {answer}',
    tags: ['average-change', 'group']
  },

  {
    id: 'NR-AVG-008',
    category: 'NR',
    sub_category: 'Averages & Growth',
    difficulty: 3,
    question_text: "A company's market share was {ms1}% in Q1 and {ms2}% in Q4. If the total market grew from £{mkt1}m to £{mkt2}m, what was the absolute change in the company's revenue?",
    variables: {
      ms1: { min: 5, max: 20, step: 1 },
      ms2: { min: 5, max: 25, step: 1 },
      mkt1: { min: 500, max: 2000, step: 100 },
      mkt2: { min: 600, max: 2500, step: 100 }
    },
    correct_formula: 'mkt2 * ms2 / 100 - mkt1 * ms1 / 100',
    distractor_formulas: [
      '(ms2 - ms1) / 100 * mkt2',
      '(mkt2 - mkt1) * ms1 / 100',
      'mkt2 * ms2 / 100',
      '(ms2 - ms1) / 100 * (mkt1 + mkt2) / 2'
    ],
    answer_prefix: '£',
    answer_suffix: 'm',
    answer_decimals: 1,
    allow_negative: false,
    explanation_text: 'Q1 revenue = £{mkt1}m × {ms1}%. Q4 revenue = £{mkt2}m × {ms2}%. Change = £{answer}m',
    tags: ['market-share', 'absolute-change']
  },

  // ═══════════════════════════════════════════════════════════
  // COMPOUND CHANGE & CAGR (8)  —  NR-CMP-001 … NR-CMP-008
  // ═══════════════════════════════════════════════════════════

  {
    id: 'NR-CMP-001',
    category: 'NR',
    sub_category: 'Compound Change & CAGR',
    difficulty: 1,
    question_text: "An investment of £{inv} grows at {rate}% per year compounded annually. What is its value after {years} years?",
    variables: {
      inv: { min: 5000, max: 30000, step: 5000 },
      rate: { min: 3, max: 10, step: 1 },
      years: { min: 2, max: 5, step: 1 }
    },
    correct_formula: 'inv * Math.pow(1 + rate / 100, years)',
    distractor_formulas: [
      'inv * (1 + rate * years / 100)',
      'inv + inv * rate / 100 * years',
      'inv * Math.pow(rate / 100, years)',
      'inv * (1 + rate / 100) * years'
    ],
    answer_prefix: '£',
    answer_decimals: 2,
    allow_negative: false,
    explanation_text: '£{inv} × (1 + {rate}%)^{years} = £{answer}',
    tags: ['compound-interest', 'investment']
  },

  {
    id: 'NR-CMP-002',
    category: 'NR',
    sub_category: 'Compound Change & CAGR',
    difficulty: 1,
    question_text: "A city's population is {pop} thousand. If it grows at {rate}% per year, what will the population be in {years} years?",
    variables: {
      pop: { min: 100, max: 500, step: 50 },
      rate: { min: 1, max: 5, step: 1 },
      years: { min: 3, max: 6, step: 1 }
    },
    correct_formula: 'pop * Math.pow(1 + rate / 100, years)',
    distractor_formulas: [
      'pop + pop * rate / 100 * years',
      'pop * (1 + rate * years / 100)',
      'pop * Math.pow(rate / 100, years) * 100',
      'pop * (1 + rate / 100) + pop * rate / 100 * (years - 1)'
    ],
    answer_suffix: ' thousand',
    answer_decimals: 1,
    allow_negative: false,
    explanation_text: '{pop} thousand × (1 + {rate}%)^{years} = {answer} thousand',
    tags: ['compound-growth', 'population']
  },

  {
    id: 'NR-CMP-003',
    category: 'NR',
    sub_category: 'Compound Change & CAGR',
    difficulty: 2,
    question_text: "A car depreciates by {dep}% per year. If it was bought for £{price}, what is its value after {years} years?",
    variables: {
      price: { min: 10000, max: 40000, step: 5000 },
      dep: { min: 10, max: 25, step: 5 },
      years: { min: 2, max: 5, step: 1 }
    },
    correct_formula: 'price * Math.pow(1 - dep / 100, years)',
    distractor_formulas: [
      'price - price * dep / 100 * years',
      'price * (1 - dep * years / 100)',
      'price * Math.pow(dep / 100, years)',
      'price / Math.pow(1 + dep / 100, years)'
    ],
    answer_prefix: '£',
    answer_decimals: 2,
    allow_negative: false,
    explanation_text: '£{price} × (1 − {dep}%)^{years} = £{answer}',
    tags: ['depreciation', 'compound']
  },

  {
    id: 'NR-CMP-004',
    category: 'NR',
    sub_category: 'Compound Change & CAGR',
    difficulty: 2,
    question_text: "A company's headcount was {start} at the beginning of the year. It grew by {rate}% each quarter for {quarters} quarters. What is the headcount now?",
    variables: {
      start: { min: 100, max: 500, step: 50 },
      rate: { min: 2, max: 8, step: 1 },
      quarters: { min: 2, max: 4, step: 1 }
    },
    correct_formula: 'start * Math.pow(1 + rate / 100, quarters)',
    distractor_formulas: [
      'start + start * rate / 100 * quarters',
      'start * (1 + rate * quarters / 100)',
      'start * Math.pow(rate / 100, quarters)',
      'start * (1 + rate / 100) + start * rate / 100'
    ],
    answer_decimals: 0,
    allow_negative: false,
    explanation_text: '{start} × (1 + {rate}%)^{quarters} = {answer}',
    tags: ['compound-growth', 'headcount']
  },

  {
    id: 'NR-CMP-005',
    category: 'NR',
    sub_category: 'Compound Change & CAGR',
    difficulty: 3,
    question_text: "Revenue was £{start}m in 2020 and £{end}m in 2024. What was the compound annual growth rate (CAGR)?",
    variables: {
      start: { min: 50, max: 200, step: 25 },
      end: { min: 80, max: 400, step: 25 }
    },
    correct_formula: '(Math.pow(end / start, 1/4) - 1) * 100',
    distractor_formulas: [
      '(end - start) / start / 4 * 100',
      '(end / start - 1) * 100',
      'Math.pow(end / start, 1/4) * 100',
      '((end - start) / start) * 100 / 4'
    ],
    answer_suffix: '%',
    answer_decimals: 1,
    allow_negative: false,
    explanation_text: 'CAGR = (£{end}m / £{start}m)^(1/4) − 1 = {answer}%',
    tags: ['cagr', 'revenue']
  },

  {
    id: 'NR-CMP-006',
    category: 'NR',
    sub_category: 'Compound Change & CAGR',
    difficulty: 1,
    question_text: "An investment doubles in value. If the annual compound growth rate is {rate}%, approximately how many years did this take? (Use the Rule of 72)",
    variables: {
      rate: { min: 4, max: 12, step: 1 }
    },
    correct_formula: '72 / rate',
    distractor_formulas: [
      '100 / rate',
      '72 * rate / 100',
      'Math.log(2) / Math.log(1 + rate/100) + 2',
      '72 / rate + rate / 10'
    ],
    answer_suffix: ' years',
    answer_decimals: 0,
    allow_negative: false,
    explanation_text: 'Rule of 72: Years to double ≈ 72 / {rate}% = {answer} years',
    tags: ['rule-of-72', 'doubling-time']
  },

  {
    id: 'NR-CMP-007',
    category: 'NR',
    sub_category: 'Compound Change & CAGR',
    difficulty: 3,
    question_text: "A savings account pays {rate}% annual interest compounded quarterly. If £{deposit} is deposited, what is the balance after {years} years?",
    variables: {
      deposit: { min: 5000, max: 25000, step: 5000 },
      rate: { min: 3, max: 8, step: 1 },
      years: { min: 2, max: 5, step: 1 }
    },
    correct_formula: 'deposit * Math.pow(1 + rate / 400, years * 4)',
    distractor_formulas: [
      'deposit * Math.pow(1 + rate / 100, years)',
      'deposit * (1 + rate / 400 * years * 4)',
      'deposit * Math.pow(1 + rate / 1200, years * 12)',
      'deposit * Math.pow(1 + rate / 400, years)'
    ],
    answer_prefix: '£',
    answer_decimals: 2,
    allow_negative: false,
    explanation_text: '£{deposit} × (1 + {rate}%/4)^({years} × 4) = £{answer}',
    tags: ['compound-quarterly', 'savings']
  },

  {
    id: 'NR-CMP-008',
    category: 'NR',
    sub_category: 'Compound Change & CAGR',
    difficulty: 3,
    question_text: "A company needs £{target}m in {years} years. If it can invest at {rate}% per year compounded annually, how much must it invest today?",
    variables: {
      target: { min: 10, max: 100, step: 10 },
      years: { min: 3, max: 7, step: 1 },
      rate: { min: 4, max: 10, step: 1 }
    },
    correct_formula: 'target / Math.pow(1 + rate / 100, years)',
    distractor_formulas: [
      'target * Math.pow(1 - rate / 100, years)',
      'target - target * rate / 100 * years',
      'target / (1 + rate * years / 100)',
      'target * Math.pow(1 + rate / 100, years)'
    ],
    answer_prefix: '£',
    answer_suffix: 'm',
    answer_decimals: 2,
    allow_negative: false,
    explanation_text: 'Present value = £{target}m / (1 + {rate}%)^{years} = £{answer}m',
    tags: ['present-value', 'discounting']
  }
];

module.exports = templates;
