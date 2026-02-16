/**
 * Logical Reasoning Question Templates (50)
 *
 * Sub-categories:
 *   Deductive Reasoning  (10)  LR-DED-001 → LR-DED-010
 *   Pattern Recognition   (8)  LR-PAT-001 → LR-PAT-008
 *   Rule Application       (8)  LR-RUL-001 → LR-RUL-008
 *   Verbal: True/False    (10)  LR-VRB-001 → LR-VRB-010
 *   Syllogisms             (7)  LR-SYL-001 → LR-SYL-007
 *   Number Series          (7)  LR-NUM-001 → LR-NUM-007
 *
 * Difficulty distribution: 17 easy (1), 17 medium (2), 16 hard (3)
 */

const templates = [

  // ═══════════════════════════════════════════════════════════
  // DEDUCTIVE REASONING (10)
  // ═══════════════════════════════════════════════════════════

  {
    id: 'LR-DED-001',
    category: 'LR',
    sub_category: 'Deductive Reasoning',
    difficulty: 1,
    question_text: 'All analysts at a UK bank earn at least £{minSal}k. If {name} is an analyst, what is the minimum annual salary {name} earns?',
    variables: {
      minSal: { min: 28, max: 55, step: 1 },
      name: { type: 'choice', options: ['Sarah', 'James', 'Priya', 'Tom', 'Elena'] }
    },
    correct_formula: 'minSal',
    distractor_formulas: ['minSal - 5', 'minSal + 10', 'minSal * 2', 'minSal - 10'],
    answer_prefix: '£',
    answer_suffix: 'k',
    answer_decimals: 0,
    explanation_text: 'All analysts earn at least £{minSal}k. {name} is an analyst, so the minimum salary is £{answer}k.',
    tags: ['deductive', 'minimum-value', 'salary']
  },

  {
    id: 'LR-DED-002',
    category: 'LR',
    sub_category: 'Deductive Reasoning',
    difficulty: 1,
    question_text: 'A compliance rule states that every branch must have at least {minStaff} qualified staff. The firm has {branches} branches and {totalStaff} qualified staff in total. What is the maximum number of qualified staff any single branch could have?',
    variables: {
      minStaff: { min: 3, max: 8, step: 1 },
      branches: { min: 4, max: 10, step: 1 },
      totalStaff: { min: 40, max: 120, step: 5 }
    },
    correct_formula: 'totalStaff - minStaff * (branches - 1)',
    distractor_formulas: [
      'totalStaff / branches',
      'totalStaff - minStaff * branches',
      'totalStaff - minStaff',
      'totalStaff / branches + minStaff'
    ],
    answer_decimals: 0,
    explanation_text: 'Other {branches} − 1 branches need minimum {minStaff} each. Max for one branch = {totalStaff} − {minStaff} × ({branches} − 1) = {answer}.',
    tags: ['deductive', 'maximum-value', 'compliance']
  },

  {
    id: 'LR-DED-003',
    category: 'LR',
    sub_category: 'Deductive Reasoning',
    difficulty: 1,
    question_text: 'If all graduate trainees must complete at least {minHours} CPD hours per quarter, and there are {trainees} trainees, what is the minimum total CPD hours the cohort must complete per quarter?',
    variables: {
      minHours: { min: 10, max: 30, step: 5 },
      trainees: { min: 8, max: 25, step: 1 }
    },
    correct_formula: 'minHours * trainees',
    distractor_formulas: [
      'minHours + trainees',
      'minHours * trainees + minHours',
      'minHours * (trainees - 1)',
      'minHours * trainees / 2'
    ],
    answer_suffix: ' hours',
    answer_decimals: 0,
    explanation_text: 'Minimum total = {minHours} hours × {trainees} trainees = {answer} hours.',
    tags: ['deductive', 'minimum-total', 'cpd']
  },

  {
    id: 'LR-DED-004',
    category: 'LR',
    sub_category: 'Deductive Reasoning',
    difficulty: 1,
    question_text: '{people} delegates attend a networking event. Each delegate exchanges business cards with every other delegate exactly once. How many card exchanges take place?',
    variables: {
      people: { min: 6, max: 20, step: 1 }
    },
    correct_formula: 'people * (people - 1) / 2',
    distractor_formulas: [
      'people * (people - 1)',
      'people * people / 2',
      'people * (people + 1) / 2',
      'people * (people - 2) / 2'
    ],
    answer_decimals: 0,
    explanation_text: 'Card exchanges = {people} × ({people} − 1) / 2 = {answer}.',
    tags: ['deductive', 'combinations', 'networking']
  },

  {
    id: 'LR-DED-005',
    category: 'LR',
    sub_category: 'Deductive Reasoning',
    difficulty: 2,
    question_text: 'A bonus is paid only if: (1) revenue exceeds £{revTarget}m AND (2) client satisfaction is above {satTarget}%. Revenue is £{rev}m and satisfaction is {sat}%. The bonus is {bonusPct}% of a £{salary}k salary. What bonus is paid?',
    variables: {
      revTarget: { min: 50, max: 150, step: 10 },
      satTarget: { min: 70, max: 90, step: 5 },
      rev: { min: 40, max: 200, step: 10 },
      sat: { min: 60, max: 95, step: 5 },
      bonusPct: { min: 5, max: 15, step: 1 },
      salary: { min: 40, max: 80, step: 5 }
    },
    correct_formula: '(rev > revTarget && sat > satTarget) ? salary * bonusPct / 100 : 0',
    distractor_formulas: [
      'salary * bonusPct / 100',
      '(rev > revTarget) ? salary * bonusPct / 100 : 0',
      '(sat > satTarget) ? salary * bonusPct / 100 : 0',
      'salary * bonusPct / 100 / 2'
    ],
    answer_prefix: '£',
    answer_suffix: 'k',
    answer_decimals: 1,
    explanation_text: 'Revenue £{rev}m vs £{revTarget}m target. Satisfaction {sat}% vs {satTarget}% target. Both conditions must be met. Bonus = £{answer}k.',
    tags: ['deductive', 'conditional', 'bonus']
  },

  {
    id: 'LR-DED-006',
    category: 'LR',
    sub_category: 'Deductive Reasoning',
    difficulty: 2,
    question_text: 'A project requires {reqHours} hours minimum. Team A has {teamA} members working {hoursA} hours each. Team B has {teamB} members working {hoursB} hours each. How many more hours does the team with fewer total hours need to meet the requirement?',
    variables: {
      reqHours: { min: 200, max: 500, step: 50 },
      teamA: { min: 3, max: 8, step: 1 },
      hoursA: { min: 20, max: 40, step: 5 },
      teamB: { min: 4, max: 10, step: 1 },
      hoursB: { min: 15, max: 35, step: 5 }
    },
    correct_formula: 'Math.max(0, reqHours - Math.min(teamA * hoursA, teamB * hoursB))',
    distractor_formulas: [
      'reqHours - teamA * hoursA',
      'reqHours - teamB * hoursB',
      'Math.abs(teamA * hoursA - teamB * hoursB)',
      'reqHours - (teamA * hoursA + teamB * hoursB) / 2'
    ],
    answer_suffix: ' hours',
    answer_decimals: 0,
    explanation_text: 'Team A total = {teamA} × {hoursA}. Team B total = {teamB} × {hoursB}. Shortfall from {reqHours} hours = {answer} hours.',
    tags: ['deductive', 'shortfall', 'project']
  },

  {
    id: 'LR-DED-007',
    category: 'LR',
    sub_category: 'Deductive Reasoning',
    difficulty: 2,
    question_text: 'A committee of {committee} must be formed from {total} candidates. {must} specific people must be included. How many ways can the remaining spots be filled?',
    variables: {
      total: { min: 8, max: 15, step: 1 },
      committee: { min: 4, max: 6, step: 1 },
      must: { min: 1, max: 3, step: 1 }
    },
    correct_formula: '(function(){var n=total-must,r=committee-must,result=1;for(var i=0;i<r;i++){result=result*(n-i)/(i+1);}return result;})()',
    distractor_formulas: [
      'total - must',
      'committee * (total - must)',
      '(total - must) * (total - must - 1) / 2',
      'total * committee / must'
    ],
    answer_decimals: 0,
    explanation_text: 'Remaining spots = {committee} − {must}. Choose from {total} − {must} candidates. C({total} − {must}, {committee} − {must}) = {answer}.',
    tags: ['deductive', 'combinations', 'committee']
  },

  {
    id: 'LR-DED-008',
    category: 'LR',
    sub_category: 'Deductive Reasoning',
    difficulty: 2,
    question_text: 'A fund manager can invest in {assets} different asset classes. She must choose exactly {pick} for a balanced portfolio. How many distinct portfolios are possible?',
    variables: {
      assets: { min: 6, max: 12, step: 1 },
      pick: { min: 3, max: 5, step: 1 }
    },
    correct_formula: '(function(){var n=assets,r=pick,result=1;for(var i=0;i<r;i++){result=result*(n-i)/(i+1);}return result;})()',
    distractor_formulas: [
      'assets * pick',
      '(function(){var n=assets,r=pick,result=1;for(var i=1;i<=r;i++){result=result*i;}return result;})()',
      'assets * (assets - 1) / 2',
      '(function(){var n=assets,r=pick+1,result=1;for(var i=0;i<r;i++){result=result*(n-i)/(i+1);}return result;})()'
    ],
    answer_decimals: 0,
    explanation_text: 'C({assets}, {pick}) = {answer} distinct portfolios.',
    tags: ['deductive', 'combinations', 'portfolio']
  },

  {
    id: 'LR-DED-009',
    category: 'LR',
    sub_category: 'Deductive Reasoning',
    difficulty: 3,
    question_text: 'A delivery route visits {cities} cities. The driver must start at the warehouse and end at the depot. How many different orderings are possible for the cities in between?',
    variables: {
      cities: { min: 4, max: 7, step: 1 }
    },
    correct_formula: '(function(){var n=cities-2,r=1;for(var i=2;i<=n;i++)r*=i;return r;})()',
    distractor_formulas: [
      'cities * (cities - 1)',
      '(function(){var n=cities,r=1;for(var i=2;i<=n;i++)r*=i;return r;})()',
      '(function(){var n=cities-1,r=1;for(var i=2;i<=n;i++)r*=i;return r;})()',
      'cities * cities - 2'
    ],
    answer_decimals: 0,
    explanation_text: 'Middle cities = {cities} − 2. Permutations = ({cities} − 2)! = {answer}.',
    tags: ['deductive', 'permutations', 'routes']
  },

  {
    id: 'LR-DED-010',
    category: 'LR',
    sub_category: 'Deductive Reasoning',
    difficulty: 3,
    question_text: 'In a round-robin tournament, {teams} teams each play every other team once. {pointsWin} points for a win, {pointsDraw} point for a draw, 0 for a loss. What is the maximum possible points for any single team?',
    variables: {
      teams: { min: 4, max: 8, step: 1 },
      pointsWin: { min: 3, max: 3, step: 1 },
      pointsDraw: { min: 1, max: 1, step: 1 }
    },
    correct_formula: '(teams - 1) * pointsWin',
    distractor_formulas: [
      'teams * pointsWin',
      '(teams - 1) * pointsDraw',
      'teams * (teams - 1) / 2 * pointsWin',
      '(teams - 1) * (pointsWin + pointsDraw)'
    ],
    answer_suffix: ' points',
    answer_decimals: 0,
    explanation_text: 'Each team plays {teams} − 1 games. Maximum = win all = ({teams} − 1) × {pointsWin} = {answer} points.',
    tags: ['deductive', 'tournament', 'maximum']
  },

  // ═══════════════════════════════════════════════════════════
  // PATTERN RECOGNITION (8)
  // ═══════════════════════════════════════════════════════════

  {
    id: 'LR-PAT-001',
    category: 'LR',
    sub_category: 'Pattern Recognition',
    difficulty: 1,
    _setup: function (rng) {
      var start = rng.intBetween(10, 30);
      var step = rng.intBetween(5, 15);
      return { a: start, b: start + step, c: start + 2 * step, d: start + 3 * step, step: step };
    },
    variables: {},
    question_text: 'Quarterly revenue (£m) follows a pattern: £{a}m, £{b}m, £{c}m, £{d}m, … What is the next value?',
    correct_formula: 'd + step',
    distractor_formulas: ['d + step + 5', 'd + step - 5', 'd * 2', 'd + step + step'],
    answer_prefix: '£',
    answer_suffix: 'm',
    answer_decimals: 0,
    explanation_text: 'The pattern increases by £{step}m each quarter. Next = £{d}m + £{step}m = £{answer}m.',
    tags: ['pattern', 'arithmetic-sequence', 'revenue']
  },

  {
    id: 'LR-PAT-002',
    category: 'LR',
    sub_category: 'Pattern Recognition',
    difficulty: 1,
    _setup: function (rng) {
      var a = rng.intBetween(3, 12);
      return { a: a, b: a * 2, c: a * 4, d: a * 8 };
    },
    variables: {},
    question_text: 'A doubling sequence of investment returns: {a}, {b}, {c}, {d}, … What is the next number?',
    correct_formula: 'd * 2',
    distractor_formulas: ['d + a', 'd * 3', 'd + d / 2', 'd * 2 + 1'],
    answer_decimals: 0,
    explanation_text: 'Each term doubles: {a}, {b}, {c}, {d}. Next = {d} × 2 = {answer}.',
    tags: ['pattern', 'geometric-sequence']
  },

  {
    id: 'LR-PAT-003',
    category: 'LR',
    sub_category: 'Pattern Recognition',
    difficulty: 1,
    _setup: function (rng) {
      var a = rng.intBetween(10, 30);
      var firstDiff = rng.intBetween(3, 8);
      var inc = rng.intBetween(2, 5);
      var b = a + firstDiff;
      var c = b + firstDiff + inc;
      var d = c + firstDiff + 2 * inc;
      var nextDiff = firstDiff + 3 * inc;
      return { a: a, b: b, c: c, d: d, firstDiff: firstDiff, inc: inc, nextDiff: nextDiff };
    },
    variables: {},
    question_text: 'Operating costs (£k): £{a}k, £{b}k, £{c}k, £{d}k, … The difference increases by £{inc}k each time. What is the next value?',
    correct_formula: 'd + nextDiff',
    distractor_formulas: ['d + nextDiff + inc', 'd + nextDiff - inc', 'd + firstDiff', 'd * 2'],
    answer_prefix: '£',
    answer_suffix: 'k',
    answer_decimals: 0,
    explanation_text: 'Differences grow by £{inc}k. Next difference = £{nextDiff}k. Next value = £{d}k + £{nextDiff}k = £{answer}k.',
    tags: ['pattern', 'increasing-differences']
  },

  {
    id: 'LR-PAT-004',
    category: 'LR',
    sub_category: 'Pattern Recognition',
    difficulty: 2,
    _setup: function (rng) {
      var start = rng.intBetween(2, 5);
      var mult = rng.intBetween(2, 3);
      var add = rng.intBetween(1, 5);
      var v1 = start * mult;
      var v2 = v1 + add;
      var v3 = v2 * mult;
      var v4 = v3 + add;
      return { start: start, v1: v1, v2: v2, v3: v3, v4: v4, mult: mult, add: add };
    },
    variables: {},
    question_text: 'A pattern uses two operations alternately: ×{mult} then +{add}. Starting from {start}: {v1}, {v2}, {v3}, {v4}. What comes next?',
    correct_formula: 'v4 * mult',
    distractor_formulas: ['v4 + add', 'v4 * mult + add', 'v4 * 2', 'v4 * mult - add'],
    answer_decimals: 0,
    explanation_text: 'Pattern: ×{mult}, +{add}, ×{mult}, +{add}. Next operation is ×{mult}: {v4} × {mult} = {answer}.',
    tags: ['pattern', 'alternating-operations']
  },

  {
    id: 'LR-PAT-005',
    category: 'LR',
    sub_category: 'Pattern Recognition',
    difficulty: 2,
    _setup: function (rng) {
      var a = rng.intBetween(2, 10);
      var b = rng.intBetween(3, 12);
      var c = a + b;
      var d = b + c;
      var e = c + d;
      return { a: a, b: b, c: c, d: d, e: e };
    },
    variables: {},
    question_text: 'Each term is the sum of the previous two: {a}, {b}, {c}, {d}, {e}. What is the next term?',
    correct_formula: 'd + e',
    distractor_formulas: ['e + a', 'e * 2', 'd + e + 1', 'd + e - 1'],
    answer_decimals: 0,
    explanation_text: 'Fibonacci-like: next = {d} + {e} = {answer}.',
    tags: ['pattern', 'fibonacci']
  },

  {
    id: 'LR-PAT-006',
    category: 'LR',
    sub_category: 'Pattern Recognition',
    difficulty: 2,
    _setup: function (rng) {
      var up = rng.intBetween(10, 25);
      var down = rng.intBetween(5, 15);
      var start = rng.intBetween(100, 300);
      var cycles = rng.intBetween(2, 3);
      var multiplier = Math.pow((1 + up / 100) * (1 - down / 100), cycles);
      var result = Math.round(start * multiplier * 10) / 10;
      return { start: start, up: up, down: down, cycles: cycles, result: result };
    },
    variables: {},
    question_text: 'Sales alternate: up {up}%, down {down}%, up {up}%, down {down}%… Starting at £{start}k, what is the value after {cycles} complete up-down cycles?',
    correct_formula: 'start * Math.pow((1 + up / 100) * (1 - down / 100), cycles)',
    distractor_formulas: [
      'start * Math.pow(1 + (up - down) / 100, cycles)',
      'start * (1 + up / 100 * cycles) * (1 - down / 100 * cycles)',
      'start * (1 + (up - down) * cycles / 100)',
      'start * Math.pow(1 + up / 100, cycles) - start * Math.pow(down / 100, cycles)'
    ],
    answer_prefix: '£',
    answer_suffix: 'k',
    answer_decimals: 1,
    explanation_text: 'One cycle multiplier = (1 + {up}%) × (1 − {down}%). After {cycles} cycles: £{start}k × multiplier^{cycles} = £{answer}k.',
    tags: ['pattern', 'alternating', 'compound']
  },

  {
    id: 'LR-PAT-007',
    category: 'LR',
    sub_category: 'Pattern Recognition',
    difficulty: 3,
    _setup: function (rng) {
      var q1 = rng.intBetween(30, 60);
      var q2 = rng.intBetween(40, 70);
      var q3 = rng.intBetween(50, 80);
      var q4 = rng.intBetween(35, 65);
      var growth = rng.intBetween(5, 15);
      return { q1: q1, q2: q2, q3: q3, q4: q4, growth: growth };
    },
    variables: {},
    question_text: 'Quarterly profits show a seasonal pattern. Year 1: Q1 = £{q1}k, Q2 = £{q2}k, Q3 = £{q3}k, Q4 = £{q4}k. In Year 2, each quarter grows by {growth}% from the same quarter in Year 1. What is Year 2 Q3 profit?',
    correct_formula: 'q3 * (1 + growth / 100)',
    distractor_formulas: [
      'q3 + growth',
      '(q1 + q2 + q3 + q4) / 4 * (1 + growth / 100)',
      'q4 * (1 + growth / 100)',
      'q3 * growth / 100'
    ],
    answer_prefix: '£',
    answer_suffix: 'k',
    answer_decimals: 1,
    explanation_text: 'Year 2 Q3 = Year 1 Q3 × (1 + {growth}%) = £{q3}k × (1 + {growth}%) = £{answer}k.',
    tags: ['pattern', 'seasonal', 'growth']
  },

  {
    id: 'LR-PAT-008',
    category: 'LR',
    sub_category: 'Pattern Recognition',
    difficulty: 3,
    _setup: function (rng) {
      var a = rng.intBetween(2, 4);
      var k = rng.intBetween(1, 5);
      var b = a * a - k;
      var c = b * b - k;
      var d = c * c - k;
      var e = d * d - k;
      return { a: a, b: b, c: c, d: d, e: e, k: k };
    },
    variables: {},
    question_text: 'A sequence: {a}, {b}, {c}, {d}, {e}. Each term equals the previous term squared minus a constant. What is the constant?',
    correct_formula: 'k',
    distractor_formulas: ['k + 1', 'k - 1', 'k * 2', 'a'],
    answer_decimals: 0,
    explanation_text: '{b} = {a}² − constant. Constant = {a}² − {b} = {answer}.',
    tags: ['pattern', 'quadratic-sequence']
  },

  // ═══════════════════════════════════════════════════════════
  // RULE APPLICATION & ORDERING (8)
  // ═══════════════════════════════════════════════════════════

  {
    id: 'LR-RUL-001',
    category: 'LR',
    sub_category: 'Rule Application',
    difficulty: 1,
    question_text: 'A delivery company charges £{base} for the first {freeKg}kg, then £{rate} per additional kg. What is the total cost for a {totalKg}kg parcel?',
    variables: {
      base: { min: 5, max: 15, step: 1 },
      freeKg: { min: 2, max: 5, step: 1 },
      rate: { min: 1, max: 4, step: 1 },
      totalKg: { min: 8, max: 25, step: 1 }
    },
    correct_formula: 'base + Math.max(0, totalKg - freeKg) * rate',
    distractor_formulas: [
      'totalKg * rate',
      'base + totalKg * rate',
      'base + (totalKg - freeKg + 1) * rate',
      'base * 2 + (totalKg - freeKg) * rate'
    ],
    answer_prefix: '£',
    answer_decimals: 0,
    allow_negative: false,
    explanation_text: 'Cost = £{base} + ({totalKg} − {freeKg}) × £{rate} = £{answer}.',
    tags: ['rule', 'delivery', 'cost']
  },

  {
    id: 'LR-RUL-002',
    category: 'LR',
    sub_category: 'Rule Application',
    difficulty: 1,
    question_text: 'Shipping policy: orders under £{threshold} pay £{fee} delivery. Orders of £{threshold} or more get free delivery. An order totals £{order}. What is the total cost including delivery?',
    variables: {
      threshold: { min: 30, max: 75, step: 5 },
      fee: { min: 3, max: 8, step: 1 },
      order: { min: 15, max: 100, step: 5 }
    },
    correct_formula: 'order < threshold ? order + fee : order',
    distractor_formulas: [
      'order + fee',
      'order',
      'order < threshold ? order : order + fee',
      'order + fee / 2'
    ],
    answer_prefix: '£',
    answer_decimals: 0,
    explanation_text: 'Order £{order} vs £{threshold} threshold. Total cost = £{answer}.',
    tags: ['rule', 'conditional', 'shipping']
  },

  {
    id: 'LR-RUL-003',
    category: 'LR',
    sub_category: 'Rule Application',
    difficulty: 2,
    question_text: 'UK income tax bands: first £{band1} at {rate1}%, next £{band2} at {rate2}%, remainder at {rate3}%. What is the tax on £{income}?',
    variables: {
      band1: { min: 10000, max: 12570, step: 570 },
      rate1: { min: 0, max: 0, step: 1 },
      band2: { min: 25000, max: 37700, step: 2700 },
      rate2: { min: 20, max: 20, step: 1 },
      rate3: { min: 40, max: 40, step: 1 },
      income: { min: 30000, max: 60000, step: 5000 }
    },
    correct_formula: 'Math.min(income, band1) * rate1 / 100 + Math.min(Math.max(income - band1, 0), band2) * rate2 / 100 + Math.max(income - band1 - band2, 0) * rate3 / 100',
    distractor_formulas: [
      'income * rate2 / 100',
      'income * rate3 / 100',
      '(income - band1) * rate2 / 100',
      'band2 * rate2 / 100 + (income - band1 - band2) * rate3 / 100 + 500'
    ],
    answer_prefix: '£',
    answer_decimals: 0,
    explanation_text: 'First £{band1} at {rate1}% = £0. Next portion at {rate2}%. Remainder at {rate3}%. Total tax = £{answer}.',
    tags: ['rule', 'tax-bands', 'progressive']
  },

  {
    id: 'LR-RUL-004',
    category: 'LR',
    sub_category: 'Rule Application',
    difficulty: 2,
    question_text: 'A loyalty programme awards {pts1} points per £1 for the first £{tier1} spent, then {pts2} points per £1 above that. A customer spends £{spend}. How many points do they earn?',
    variables: {
      pts1: { min: 1, max: 2, step: 1 },
      tier1: { min: 50, max: 100, step: 10 },
      pts2: { min: 3, max: 5, step: 1 },
      spend: { min: 60, max: 200, step: 10 }
    },
    correct_formula: 'Math.min(spend, tier1) * pts1 + Math.max(spend - tier1, 0) * pts2',
    distractor_formulas: [
      'spend * pts1',
      'spend * pts2',
      'tier1 * pts1 + spend * pts2',
      'spend * (pts1 + pts2) / 2'
    ],
    answer_suffix: ' points',
    answer_decimals: 0,
    explanation_text: 'First £{tier1} earns {pts1} pts/£. Above £{tier1}: {pts2} pts/£. Total = {answer} points.',
    tags: ['rule', 'tiered', 'loyalty']
  },

  {
    id: 'LR-RUL-005',
    category: 'LR',
    sub_category: 'Rule Application',
    difficulty: 2,
    question_text: 'Tasks must be completed in order: A takes {a} days, B takes {b} days (starts after A), C takes {c} days (starts after A), D takes {d} days (starts after both B and C). What is the minimum total project duration?',
    variables: {
      a: { min: 2, max: 5, step: 1 },
      b: { min: 3, max: 7, step: 1 },
      c: { min: 2, max: 6, step: 1 },
      d: { min: 2, max: 5, step: 1 }
    },
    correct_formula: 'a + Math.max(b, c) + d',
    distractor_formulas: [
      'a + b + c + d',
      'a + b + d',
      'a + c + d',
      'Math.max(a + b, a + c) + d + 1'
    ],
    answer_suffix: ' days',
    answer_decimals: 0,
    explanation_text: 'Critical path: A ({a}d) then longest of B ({b}d) / C ({c}d), then D ({d}d) = {answer} days.',
    tags: ['rule', 'critical-path', 'scheduling']
  },

  {
    id: 'LR-RUL-006',
    category: 'LR',
    sub_category: 'Rule Application',
    difficulty: 3,
    question_text: 'Overtime rules: first {normal} hours at £{rate}/hr, next {ot1} hours at 1.5× rate, anything beyond at 2× rate. An employee works {total} hours. What is their total pay?',
    variables: {
      normal: { min: 35, max: 40, step: 5 },
      rate: { min: 12, max: 25, step: 1 },
      ot1: { min: 5, max: 10, step: 5 },
      total: { min: 40, max: 55, step: 1 }
    },
    correct_formula: 'Math.min(total, normal) * rate + Math.min(Math.max(total - normal, 0), ot1) * rate * 1.5 + Math.max(total - normal - ot1, 0) * rate * 2',
    distractor_formulas: [
      'total * rate',
      'normal * rate + (total - normal) * rate * 1.5',
      'total * rate * 1.5',
      'normal * rate + (total - normal) * rate * 2'
    ],
    answer_prefix: '£',
    answer_decimals: 2,
    explanation_text: 'Normal hours at £{rate}. OT1 at £{rate} × 1.5. OT2 at £{rate} × 2. Total pay = £{answer}.',
    tags: ['rule', 'overtime', 'tiered-pay']
  },

  {
    id: 'LR-RUL-007',
    category: 'LR',
    sub_category: 'Rule Application',
    difficulty: 3,
    question_text: 'A pricing algorithm: base price £{base}. If quantity > {q1}, apply {d1}% discount. If quantity > {q2}, apply an additional {d2}% on the already-discounted price. Order quantity is {qty}. What is the per-unit price?',
    variables: {
      base: { min: 10, max: 50, step: 5 },
      q1: { min: 50, max: 100, step: 10 },
      d1: { min: 5, max: 15, step: 5 },
      q2: { min: 200, max: 500, step: 50 },
      d2: { min: 5, max: 10, step: 5 },
      qty: { min: 100, max: 600, step: 50 }
    },
    correct_formula: 'qty > q2 ? base * (1 - d1/100) * (1 - d2/100) : qty > q1 ? base * (1 - d1/100) : base',
    distractor_formulas: [
      'base * (1 - (d1 + d2) / 100)',
      'base * (1 - d1 / 100)',
      'base * (1 - d2 / 100)',
      'qty > q2 ? base * (1 - d2 / 100) : base * (1 - d1 / 100)'
    ],
    answer_prefix: '£',
    answer_decimals: 2,
    explanation_text: 'Quantity {qty}: apply discounts based on thresholds {q1} and {q2}. Per-unit price = £{answer}.',
    tags: ['rule', 'tiered-pricing', 'discount']
  },

  {
    id: 'LR-RUL-008',
    category: 'LR',
    sub_category: 'Rule Application',
    difficulty: 3,
    question_text: 'Commission structure: {r1}% on first £{t1}k of sales, {r2}% on next £{t2}k, {r3}% on anything above. A salesperson sells £{sales}k. What is their total commission?',
    variables: {
      r1: { min: 5, max: 10, step: 1 },
      t1: { min: 20, max: 50, step: 10 },
      r2: { min: 8, max: 15, step: 1 },
      t2: { min: 30, max: 50, step: 10 },
      r3: { min: 12, max: 20, step: 1 },
      sales: { min: 50, max: 150, step: 10 }
    },
    correct_formula: 'Math.min(sales, t1) * r1 / 100 + Math.min(Math.max(sales - t1, 0), t2) * r2 / 100 + Math.max(sales - t1 - t2, 0) * r3 / 100',
    distractor_formulas: [
      'sales * r1 / 100',
      'sales * r2 / 100',
      'sales * r3 / 100',
      't1 * r1 / 100 + t2 * r2 / 100 + sales * r3 / 100'
    ],
    answer_prefix: '£',
    answer_suffix: 'k',
    answer_decimals: 2,
    explanation_text: 'Band 1: £{t1}k × {r1}%. Band 2: next £{t2}k × {r2}%. Band 3: remainder × {r3}%. Total commission = £{answer}k.',
    tags: ['rule', 'commission', 'tiered']
  },

  // ═══════════════════════════════════════════════════════════
  // VERBAL: TRUE/FALSE/CANNOT SAY (10)
  // ═══════════════════════════════════════════════════════════

  {
    id: 'LR-VRB-001',
    category: 'LR',
    sub_category: 'Verbal: True/False/Cannot Say',
    difficulty: 1,
    question_text: 'Statement: \'{name} Ltd reported revenue of £{rev}m, up {growth}% from the previous year.\' What was the previous year\'s revenue approximately?',
    variables: {
      name: { type: 'choice', options: ['Apex', 'Vertex', 'Pinnacle', 'Summit', 'Zenith'] },
      rev: { min: 100, max: 500, step: 25 },
      growth: { min: 5, max: 25, step: 5 }
    },
    correct_formula: 'rev / (1 + growth / 100)',
    distractor_formulas: [
      'rev * (1 - growth / 100)',
      'rev - growth',
      'rev / growth * 100',
      'rev * (1 + growth / 100)'
    ],
    answer_prefix: '£',
    answer_suffix: 'm',
    answer_decimals: 1,
    explanation_text: 'Current = £{rev}m after {growth}% growth. Previous = £{rev}m ÷ (1 + {growth}%) = £{answer}m.',
    tags: ['verbal', 'reverse-calculation']
  },

  {
    id: 'LR-VRB-002',
    category: 'LR',
    sub_category: 'Verbal: True/False/Cannot Say',
    difficulty: 1,
    question_text: 'Statement: \'The company employs {total} staff across {offices} offices.\' If staff are distributed equally, how many per office?',
    variables: {
      total: { min: 100, max: 500, step: 25 },
      offices: { min: 3, max: 8, step: 1 }
    },
    correct_formula: 'total / offices',
    distractor_formulas: [
      'total * offices',
      'total - offices',
      'offices / total * 100',
      'total / (offices + 1)'
    ],
    answer_decimals: 1,
    explanation_text: '{total} ÷ {offices} = {answer} staff per office.',
    tags: ['verbal', 'division']
  },

  {
    id: 'LR-VRB-003',
    category: 'LR',
    sub_category: 'Verbal: True/False/Cannot Say',
    difficulty: 1,
    question_text: 'Statement: \'{pct}% of the {total} survey respondents preferred Option A.\' How many respondents preferred Option A?',
    variables: {
      pct: { min: 20, max: 70, step: 5 },
      total: { min: 200, max: 1000, step: 100 }
    },
    correct_formula: 'total * pct / 100',
    distractor_formulas: [
      'total / pct',
      'total - pct',
      'total * pct',
      'total * (100 - pct) / 100'
    ],
    answer_decimals: 0,
    explanation_text: '{total} × {pct}% = {answer} respondents.',
    tags: ['verbal', 'percentage']
  },

  {
    id: 'LR-VRB-004',
    category: 'LR',
    sub_category: 'Verbal: True/False/Cannot Say',
    difficulty: 2,
    question_text: 'Statement: \'Operating costs fell by £{fall}m to £{final}m. Salaries account for {salPct}% of current operating costs.\' What are the salary costs?',
    variables: {
      fall: { min: 5, max: 30, step: 5 },
      final: { min: 50, max: 200, step: 10 },
      salPct: { min: 30, max: 60, step: 5 }
    },
    correct_formula: 'final * salPct / 100',
    distractor_formulas: [
      '(final + fall) * salPct / 100',
      'final - salPct',
      'fall * salPct / 100',
      'final / salPct * 100'
    ],
    answer_prefix: '£',
    answer_suffix: 'm',
    answer_decimals: 1,
    explanation_text: 'Current costs = £{final}m. Salaries = £{final}m × {salPct}% = £{answer}m.',
    tags: ['verbal', 'percentage-of-value']
  },

  {
    id: 'LR-VRB-005',
    category: 'LR',
    sub_category: 'Verbal: True/False/Cannot Say',
    difficulty: 2,
    question_text: 'Statement: \'The firm\'s {region} office generated £{rev}m revenue with {staff} staff.\' What is the revenue per employee (in £)?',
    variables: {
      region: { type: 'choice', options: ['London', 'Manchester', 'Edinburgh', 'Birmingham', 'Bristol'] },
      rev: { min: 20, max: 100, step: 5 },
      staff: { min: 50, max: 200, step: 10 }
    },
    correct_formula: 'rev * 1000000 / staff',
    distractor_formulas: [
      'rev / staff',
      'staff / rev',
      'rev * 1000 / staff',
      'rev * staff'
    ],
    answer_prefix: '£',
    answer_decimals: 0,
    explanation_text: '£{rev}m ÷ {staff} staff = £{answer} per employee.',
    tags: ['verbal', 'revenue-per-head']
  },

  {
    id: 'LR-VRB-006',
    category: 'LR',
    sub_category: 'Verbal: True/False/Cannot Say',
    difficulty: 3,
    question_text: 'Statement: \'Client retention improved from {oldRate}% to {newRate}% year-on-year. The firm had {clients} clients at the start of the year.\' How many additional clients were retained compared to the previous rate?',
    variables: {
      oldRate: { min: 70, max: 85, step: 1 },
      newRate: { min: 80, max: 95, step: 1 },
      clients: { min: 200, max: 800, step: 50 }
    },
    correct_formula: 'clients * (newRate - oldRate) / 100',
    distractor_formulas: [
      '(newRate - oldRate) * clients',
      'clients * newRate / 100',
      'clients * oldRate / 100',
      'clients * (newRate - oldRate) / 100 + 10'
    ],
    answer_decimals: 0,
    explanation_text: 'Additional retained = {clients} × ({newRate}% − {oldRate}%) = {answer}.',
    tags: ['verbal', 'retention', 'difference']
  },

  {
    id: 'LR-VRB-007',
    category: 'LR',
    sub_category: 'Verbal: True/False/Cannot Say',
    difficulty: 3,
    question_text: 'Statement: \'The average transaction value was £{avg} across {trans} transactions. The top {topPct}% of transactions averaged £{topAvg}.\' What was the average of the remaining transactions?',
    variables: {
      avg: { min: 50, max: 200, step: 10 },
      trans: { min: 500, max: 2000, step: 100 },
      topPct: { min: 10, max: 20, step: 5 },
      topAvg: { min: 200, max: 500, step: 50 }
    },
    correct_formula: '(avg * trans - topAvg * trans * topPct / 100) / (trans * (100 - topPct) / 100)',
    distractor_formulas: [
      'avg - topAvg',
      '(avg * trans - topAvg) / (trans - 1)',
      'avg * (100 - topPct) / 100',
      '(avg - topAvg * topPct / 100) / (1 - topPct / 100) + 10'
    ],
    answer_prefix: '£',
    answer_decimals: 2,
    explanation_text: 'Total value = £{avg} × {trans}. Top {topPct}% value = £{topAvg} × top count. Remaining average = £{answer}.',
    tags: ['verbal', 'weighted-average', 'segment']
  },

  {
    id: 'LR-VRB-008',
    category: 'LR',
    sub_category: 'Verbal: True/False/Cannot Say',
    difficulty: 3,
    question_text: 'Statement: \'Market research shows {mktShare}% market share in a £{mktSize}bn market growing at {mktGrowth}% annually. The company targets {targetShare}% share within 2 years.\' What revenue does the target represent?',
    variables: {
      mktShare: { min: 3, max: 10, step: 1 },
      mktSize: { min: 5, max: 30, step: 5 },
      mktGrowth: { min: 3, max: 8, step: 1 },
      targetShare: { min: 5, max: 15, step: 1 }
    },
    correct_formula: 'mktSize * Math.pow(1 + mktGrowth / 100, 2) * targetShare / 100',
    distractor_formulas: [
      'mktSize * targetShare / 100',
      'mktSize * (1 + mktGrowth / 100) * targetShare / 100',
      'mktSize * Math.pow(1 + mktGrowth / 100, 2) * mktShare / 100',
      'mktSize * (1 + mktGrowth * 2 / 100) * targetShare / 100'
    ],
    answer_prefix: '£',
    answer_suffix: 'bn',
    answer_decimals: 2,
    explanation_text: 'Market in 2 years = £{mktSize}bn × (1 + {mktGrowth}%)². Target revenue = market × {targetShare}% = £{answer}bn.',
    tags: ['verbal', 'market-projection', 'target']
  },

  {
    id: 'LR-VRB-009',
    category: 'LR',
    sub_category: 'Verbal: True/False/Cannot Say',
    difficulty: 3,
    question_text: 'Statement: \'The company\'s EBITDA margin was {margin}% on revenue of £{rev}m. Depreciation was £{dep}m and interest was £{int}m.\' What was the net profit before tax?',
    variables: {
      margin: { min: 15, max: 35, step: 5 },
      rev: { min: 100, max: 500, step: 50 },
      dep: { min: 5, max: 30, step: 5 },
      int: { min: 3, max: 15, step: 1 }
    },
    correct_formula: 'rev * margin / 100 - dep - int',
    distractor_formulas: [
      'rev * margin / 100',
      'rev * margin / 100 - dep',
      'rev - dep - int',
      'rev * margin / 100 + dep + int'
    ],
    answer_prefix: '£',
    answer_suffix: 'm',
    answer_decimals: 1,
    explanation_text: 'EBITDA = £{rev}m × {margin}%. Net profit before tax = EBITDA − £{dep}m − £{int}m = £{answer}m.',
    tags: ['verbal', 'ebitda', 'profit']
  },

  {
    id: 'LR-VRB-010',
    category: 'LR',
    sub_category: 'Verbal: True/False/Cannot Say',
    difficulty: 3,
    question_text: 'Statement: \'Headcount grew by {hcGrowth}% to {hcFinal}. Revenue per head improved by {rphGrowth}% to £{rphFinal}k.\' What was the previous year\'s total revenue?',
    variables: {
      hcGrowth: { min: 5, max: 15, step: 1 },
      hcFinal: { min: 200, max: 500, step: 50 },
      rphGrowth: { min: 3, max: 10, step: 1 },
      rphFinal: { min: 80, max: 200, step: 10 }
    },
    correct_formula: 'hcFinal / (1 + hcGrowth / 100) * rphFinal / (1 + rphGrowth / 100)',
    distractor_formulas: [
      'hcFinal * rphFinal / (1 + hcGrowth / 100)',
      'hcFinal / (1 + hcGrowth / 100) * rphFinal',
      'hcFinal * rphFinal',
      '(hcFinal * rphFinal) / ((1 + hcGrowth / 100) * (1 + rphGrowth / 100)) + 500'
    ],
    answer_prefix: '£',
    answer_suffix: 'k',
    answer_decimals: 0,
    explanation_text: 'Previous HC = {hcFinal} ÷ (1 + {hcGrowth}%). Previous RPH = £{rphFinal}k ÷ (1 + {rphGrowth}%). Previous revenue = HC × RPH = £{answer}k.',
    tags: ['verbal', 'reverse-growth', 'revenue']
  },

  // ═══════════════════════════════════════════════════════════
  // SYLLOGISMS (7)
  // ═══════════════════════════════════════════════════════════

  {
    id: 'LR-SYL-001',
    category: 'LR',
    sub_category: 'Syllogisms',
    difficulty: 1,
    question_text: 'All {total} members of the audit team passed the assessment. {passed} members scored above {threshold}%. The rest scored between {low}% and {threshold}%. How many scored between {low}% and {threshold}%?',
    variables: {
      total: { min: 20, max: 50, step: 5 },
      passed: { min: 8, max: 30, step: 2 },
      threshold: { min: 70, max: 85, step: 5 },
      low: { min: 50, max: 65, step: 5 }
    },
    correct_formula: 'total - passed',
    distractor_formulas: [
      'passed',
      'total + passed',
      'total / 2',
      'total - passed + 2'
    ],
    answer_decimals: 0,
    explanation_text: 'Total {total} − above {threshold}% ({passed}) = {answer} scored between {low}% and {threshold}%.',
    tags: ['syllogism', 'set-difference']
  },

  {
    id: 'LR-SYL-002',
    category: 'LR',
    sub_category: 'Syllogisms',
    difficulty: 1,
    question_text: 'All managers have completed compliance training. {trained} employees have completed training. There are {managers} managers. At least how many non-managers have completed training?',
    variables: {
      trained: { min: 30, max: 60, step: 5 },
      managers: { min: 8, max: 20, step: 2 }
    },
    correct_formula: 'trained - managers',
    distractor_formulas: [
      'managers',
      'trained',
      'trained + managers',
      'trained / 2'
    ],
    answer_decimals: 0,
    explanation_text: 'Trained ({trained}) − managers ({managers}) = at least {answer} non-managers trained.',
    tags: ['syllogism', 'minimum', 'compliance']
  },

  {
    id: 'LR-SYL-003',
    category: 'LR',
    sub_category: 'Syllogisms',
    difficulty: 2,
    question_text: 'In a group of {total} finance professionals: {langA} speak French, {langB} speak German, and {both} speak both. How many speak neither?',
    variables: {
      total: { min: 50, max: 100, step: 10 },
      langA: { min: 20, max: 50, step: 5 },
      langB: { min: 15, max: 40, step: 5 },
      both: { min: 5, max: 15, step: 5 }
    },
    correct_formula: 'total - (langA + langB - both)',
    distractor_formulas: [
      'total - langA - langB',
      'total - langA - langB + both * 2',
      'total - both',
      'langA + langB - both'
    ],
    answer_decimals: 0,
    explanation_text: 'At least one language = {langA} + {langB} − {both}. Neither = {total} − ({langA} + {langB} − {both}) = {answer}.',
    tags: ['syllogism', 'venn-diagram', 'inclusion-exclusion']
  },

  {
    id: 'LR-SYL-004',
    category: 'LR',
    sub_category: 'Syllogisms',
    difficulty: 2,
    question_text: 'Of {total} candidates: {quant} passed quantitative, {verbal} passed verbal, {both} passed both. A candidate needs to pass at least one to progress. How many progress?',
    variables: {
      total: { min: 80, max: 200, step: 10 },
      quant: { min: 40, max: 120, step: 10 },
      verbal: { min: 30, max: 100, step: 10 },
      both: { min: 10, max: 40, step: 5 }
    },
    correct_formula: 'quant + verbal - both',
    distractor_formulas: [
      'quant + verbal',
      'both',
      'total - both',
      'quant + verbal - both + 5'
    ],
    answer_decimals: 0,
    explanation_text: 'Pass at least one = {quant} + {verbal} − {both} = {answer}.',
    tags: ['syllogism', 'union', 'assessment']
  },

  {
    id: 'LR-SYL-005',
    category: 'LR',
    sub_category: 'Syllogisms',
    difficulty: 1,
    question_text: 'All {nA} directors are shareholders. Some shareholders are advisors. There are {nB} shareholders and {nC} advisors in total. What is the maximum number of directors that could also be advisors?',
    variables: {
      nA: { min: 5, max: 15, step: 1 },
      nB: { min: 20, max: 40, step: 5 },
      nC: { min: 8, max: 20, step: 2 }
    },
    correct_formula: 'Math.min(nA, nC)',
    distractor_formulas: [
      'nA',
      'nC',
      'nA + nC',
      'Math.min(nA, nC) - 1'
    ],
    answer_decimals: 0,
    explanation_text: 'Max overlap between directors ({nA}) and advisors ({nC}) = min({nA}, {nC}) = {answer}.',
    tags: ['syllogism', 'maximum-overlap']
  },

  {
    id: 'LR-SYL-006',
    category: 'LR',
    sub_category: 'Syllogisms',
    difficulty: 3,
    question_text: 'In a survey of {total} firms: {a} use Cloud, {b} use AI, {c} use Blockchain, {ab} use Cloud+AI, {ac} use Cloud+Blockchain, {bc} use AI+Blockchain, {abc} use all three. How many use exactly one technology?',
    variables: {
      total: { min: 100, max: 200, step: 10 },
      a: { min: 50, max: 100, step: 5 },
      b: { min: 40, max: 90, step: 5 },
      c: { min: 30, max: 70, step: 5 },
      ab: { min: 15, max: 30, step: 5 },
      ac: { min: 10, max: 25, step: 5 },
      bc: { min: 8, max: 20, step: 2 },
      abc: { min: 3, max: 10, step: 1 }
    },
    correct_formula: '(a - ab - ac + abc) + (b - ab - bc + abc) + (c - ac - bc + abc)',
    distractor_formulas: [
      'a + b + c - ab - ac - bc + abc',
      'a + b + c - 2 * (ab + ac + bc) + 3 * abc + 5',
      'total - (ab + ac + bc - abc)',
      'a + b + c - ab - ac - bc'
    ],
    answer_decimals: 0,
    explanation_text: 'Only Cloud = {a} − {ab} − {ac} + {abc}. Only AI = {b} − {ab} − {bc} + {abc}. Only Blockchain = {c} − {ac} − {bc} + {abc}. Total exactly one = {answer}.',
    tags: ['syllogism', 'three-set-venn', 'exactly-one']
  },

  {
    id: 'LR-SYL-007',
    category: 'LR',
    sub_category: 'Syllogisms',
    difficulty: 3,
    question_text: 'Of {total} employees: {remote} work remotely, {fulltime} are full-time, and {senior} are senior. {rf} are remote and full-time, {rs} are remote and senior, {fs} are full-time and senior, {rfs} are all three. How many are none of these?',
    variables: {
      total: { min: 150, max: 300, step: 25 },
      remote: { min: 60, max: 120, step: 10 },
      fulltime: { min: 80, max: 150, step: 10 },
      senior: { min: 30, max: 70, step: 5 },
      rf: { min: 20, max: 50, step: 5 },
      rs: { min: 10, max: 30, step: 5 },
      fs: { min: 15, max: 40, step: 5 },
      rfs: { min: 5, max: 15, step: 5 }
    },
    correct_formula: 'total - (remote + fulltime + senior - rf - rs - fs + rfs)',
    distractor_formulas: [
      'total - remote - fulltime - senior',
      'total - (remote + fulltime + senior)',
      'total - rf - rs - fs + rfs',
      'total - (remote + fulltime + senior - rf - rs - fs + rfs) + 5'
    ],
    answer_decimals: 0,
    explanation_text: 'At least one = {remote} + {fulltime} + {senior} − {rf} − {rs} − {fs} + {rfs}. None = {total} − that sum = {answer}.',
    tags: ['syllogism', 'three-set-venn', 'complement']
  },

  // ═══════════════════════════════════════════════════════════
  // NUMBER SERIES (7)
  // ═══════════════════════════════════════════════════════════

  {
    id: 'LR-NUM-001',
    category: 'LR',
    sub_category: 'Number Series',
    difficulty: 1,
    _setup: function (rng) {
      var start = rng.intBetween(2, 10);
      var diff = rng.intBetween(3, 9);
      return {
        a: start,
        b: start + diff,
        c: start + 2 * diff,
        d: start + 3 * diff,
        e: start + 4 * diff,
        diff: diff
      };
    },
    variables: {},
    question_text: 'What comes next in the series: {a}, {b}, {c}, {d}, {e}, ?',
    correct_formula: 'e + diff',
    distractor_formulas: ['e + diff + 1', 'e + diff - 1', 'e + diff + 2', 'e * 2'],
    answer_decimals: 0,
    explanation_text: 'The series increases by {diff} each time. Next = {e} + {diff} = {answer}.',
    tags: ['series', 'arithmetic']
  },

  {
    id: 'LR-NUM-002',
    category: 'LR',
    sub_category: 'Number Series',
    difficulty: 1,
    _setup: function (rng) {
      var a = rng.intBetween(2, 5);
      var mult = rng.intBetween(2, 3);
      return {
        a: a,
        b: a * mult,
        c: a * mult * mult,
        d: a * Math.pow(mult, 3),
        e: a * Math.pow(mult, 4),
        mult: mult
      };
    },
    variables: {},
    question_text: 'What comes next: {a}, {b}, {c}, {d}, {e}, ?',
    correct_formula: 'e * mult',
    distractor_formulas: ['e * mult + 1', 'e * mult - 1', 'e + mult', 'e * mult + mult'],
    answer_decimals: 0,
    explanation_text: 'Multiply by {mult} each time. Next = {e} × {mult} = {answer}.',
    tags: ['series', 'geometric']
  },

  {
    id: 'LR-NUM-003',
    category: 'LR',
    sub_category: 'Number Series',
    difficulty: 2,
    _setup: function (rng) {
      var a = rng.intBetween(1, 10);
      var firstDiff = rng.intBetween(2, 5);
      var inc = rng.intBetween(1, 3);
      var b = a + firstDiff;
      var c = b + firstDiff + inc;
      var d = c + firstDiff + 2 * inc;
      var e = d + firstDiff + 3 * inc;
      var nextDiff = firstDiff + 4 * inc;
      return { a: a, b: b, c: c, d: d, e: e, firstDiff: firstDiff, inc: inc, nextDiff: nextDiff };
    },
    variables: {},
    question_text: 'What comes next: {a}, {b}, {c}, {d}, {e}, ? (Differences increase by {inc} each time)',
    correct_formula: 'e + nextDiff',
    distractor_formulas: ['e + nextDiff + inc', 'e + nextDiff - inc', 'e + firstDiff', 'e * 2'],
    answer_decimals: 0,
    explanation_text: 'Differences grow by {inc}. Next difference = {nextDiff}. Next = {e} + {nextDiff} = {answer}.',
    tags: ['series', 'quadratic']
  },

  {
    id: 'LR-NUM-004',
    category: 'LR',
    sub_category: 'Number Series',
    difficulty: 2,
    _setup: function (rng) {
      var a = rng.intBetween(2, 8);
      var step1 = rng.intBetween(3, 7);
      var b = rng.intBetween(10, 20);
      var step2 = rng.intBetween(4, 8);
      return {
        a: a,
        b: b,
        c: a + step1,
        d: b + step2,
        e: a + 2 * step1,
        f: b + 2 * step2,
        step1: step1,
        step2: step2
      };
    },
    variables: {},
    question_text: 'Two interleaved sequences: {a}, {b}, {c}, {d}, {e}, {f}, ? What comes next?',
    correct_formula: 'e + step1',
    distractor_formulas: ['f + step2', 'e + step2', 'e + step1 + 1', 'f + step1'],
    answer_decimals: 0,
    explanation_text: 'Odd positions: {a}, {c}, {e}, ? (add {step1}). Even positions: {b}, {d}, {f} (add {step2}). Next = {e} + {step1} = {answer}.',
    tags: ['series', 'interleaved']
  },

  {
    id: 'LR-NUM-005',
    category: 'LR',
    sub_category: 'Number Series',
    difficulty: 2,
    _setup: function (rng) {
      var a = rng.intBetween(1, 5);
      var b = a + 1;
      var c = b + 2;
      var d = c + 3;
      var e = d + 4;
      return { a: a, b: b, c: c, d: d, e: e };
    },
    variables: {},
    question_text: 'What comes next: {a}, {b}, {c}, {d}, {e}, ? (Each gap increases by 1)',
    correct_formula: 'e + 5',
    distractor_formulas: ['e + 4', 'e + 6', 'e + 5 + 1', 'e * 2'],
    answer_decimals: 0,
    explanation_text: 'Gaps: +1, +2, +3, +4, +5. Next = {e} + 5 = {answer}.',
    tags: ['series', 'triangular']
  },

  {
    id: 'LR-NUM-006',
    category: 'LR',
    sub_category: 'Number Series',
    difficulty: 3,
    _setup: function (rng) {
      var k = rng.intBetween(1, 5);
      return {
        a: 1 + k,
        b: 4 + k,
        c: 9 + k,
        d: 16 + k,
        e: 25 + k,
        k: k
      };
    },
    variables: {},
    question_text: 'What comes next: {a}, {b}, {c}, {d}, {e}, ? (Each term is n² + a constant)',
    correct_formula: '36 + k',
    distractor_formulas: ['25 + k', '49 + k', '36 + k + 1', '36 + k - 1'],
    answer_decimals: 0,
    explanation_text: 'Pattern: n² + {k}. Position 6: 36 + {k} = {answer}.',
    tags: ['series', 'quadratic-formula']
  },

  {
    id: 'LR-NUM-007',
    category: 'LR',
    sub_category: 'Number Series',
    difficulty: 3,
    _setup: function (rng) {
      var a = rng.intBetween(2, 5);
      var mult = rng.intBetween(2, 3);
      var add = rng.intBetween(1, 4);
      var b = a * mult;
      var c = b + add;
      var d = c * mult;
      var e = d + add;
      return { a: a, b: b, c: c, d: d, e: e, mult: mult, add: add };
    },
    variables: {},
    question_text: 'What comes next: {a}, {b}, {c}, {d}, {e}, ? (Alternating ×{mult} and +{add})',
    correct_formula: 'e * mult',
    distractor_formulas: ['e + add', 'e * mult + add', 'e * 2', 'e * mult - 1'],
    answer_decimals: 0,
    explanation_text: 'Pattern: ×{mult}, +{add}, ×{mult}, +{add}, ×{mult}. Next = {e} × {mult} = {answer}.',
    tags: ['series', 'alternating-operations']
  }

];

module.exports = templates;
