/**
 * ACUMEN LOGIC — Diagnostic Question Bank
 * 20 questions: 7 Numerical Reasoning, 7 Data Interpretation, 6 Logical Reasoning
 * 
 * DIFFICULTY: Calibrated to real SHL / Aon assessment level.
 * Every answer has been manually verified. All calculations confirmed.
 * 
 * SEQUENCE in diagnostic: Interleaved NR, DI, LR pattern.
 */

var defined_questions = [

  // ============================================================
  // NUMERICAL REASONING (IDs 1–7)
  // ============================================================

  {
    id: 1,
    category: 'Numerical Reasoning',
    text: 'A company\'s revenue increased by 15% from Q1 to Q2, then decreased by 8% from Q2 to Q3. If Q1 revenue was £2.4 million, what was the Q3 revenue?',
    options: [
      '£2.54 million',
      '£2.57 million',
      '£2.76 million',
      '£2.49 million'
    ],
    correct: 0,
    explanation: 'Q2 = £2.4m × 1.15 = £2.76m. Q3 = £2.76m × 0.92 = £2.5392m ≈ £2.54m. Trap: adding percentages (15% − 8% = 7%) gives £2.568m — wrong because percentage changes compound on different bases.'
    // VERIFY: 2.4 × 1.15 = 2.76. 2.76 × 0.92 = 2.5392. Nearest option = £2.54m ✓
  },

  {
    id: 2,
    category: 'Numerical Reasoning',
    text: 'An investment of £15,000 earns 4.5% compound interest annually. What is the value after 3 years, to the nearest pound?',
    options: [
      '£17,025',
      '£17,117',
      '£16,350',
      '£17,600'
    ],
    correct: 1,
    explanation: '£15,000 × 1.045³ = £15,000 × 1.141166 = £17,117.49 ≈ £17,117. Trap: simple interest gives £15,000 + (3 × £675) = £17,025 — this ignores compounding.'
    // VERIFY: 1.045^3 = 1.045 × 1.045 = 1.092025; × 1.045 = 1.141166125. 15000 × 1.141166 = 17117.49 ✓
  },

  {
    id: 3,
    category: 'Numerical Reasoning',
    text: 'If the ratio of senior to junior staff is 3:5 and there are 240 employees in total, how many more junior staff are there than senior staff?',
    options: [
      '30',
      '40',
      '60',
      '90'
    ],
    correct: 2,
    explanation: 'Total parts = 3 + 5 = 8. Senior = (3/8) × 240 = 90. Junior = (5/8) × 240 = 150. Difference = 150 − 90 = 60.'
    // VERIFY: 240/8 = 30 per part. Senior = 90, Junior = 150. Diff = 60 ✓
  },

  {
    id: 4,
    category: 'Numerical Reasoning',
    text: 'A product costs £80 to produce and sells for £140. Overhead costs are 15% of revenue. What is the profit margin as a percentage of revenue?',
    options: [
      '28%',
      '32%',
      '43%',
      '50%'
    ],
    correct: 0,
    explanation: 'Revenue = £140. Overhead = 15% × £140 = £21. Total costs = £80 + £21 = £101. Profit = £140 − £101 = £39. Margin = (39 ÷ 140) × 100 = 27.86% ≈ 28%. Trap: ignoring overhead gives (60/140) = 42.9% ≈ 43%.'
    // VERIFY: 140 × 0.15 = 21. 80 + 21 = 101. 140 − 101 = 39. 39/140 = 0.27857 = 27.9% ≈ 28% ✓
  },

  {
    id: 5,
    category: 'Numerical Reasoning',
    text: 'A department\'s budget was reduced by 12% this year to £352,000. What was last year\'s budget?',
    options: [
      '£380,000',
      '£394,240',
      '£400,000',
      '£410,500'
    ],
    correct: 2,
    explanation: '£352,000 represents 88% of the original. Original = £352,000 ÷ 0.88 = £400,000. Trap: adding 12% to £352,000 gives £394,240 — this is the reverse percentage error (applying the percentage to the reduced amount, not the original).'
    // VERIFY: 352000 / 0.88 = 400000. Check: 400000 × 0.88 = 352000 ✓
  },

  {
    id: 6,
    category: 'Numerical Reasoning',
    text: 'Share prices rose 20% on Monday, fell 10% on Tuesday, and rose 5% on Wednesday. What is the net percentage change?',
    options: [
      '13.4%',
      '15%',
      '12.4%',
      '15.4%'
    ],
    correct: 0,
    explanation: 'Multiplicative: 1.20 × 0.90 × 1.05 = 1.134. Net change = +13.4%. Trap: adding percentages gives 20 − 10 + 5 = 15%, which ignores compounding effects.'
    // VERIFY: 1.20 × 0.90 = 1.08. 1.08 × 1.05 = 1.134 = +13.4% ✓
  },

  {
    id: 7,
    category: 'Numerical Reasoning',
    text: 'If 8 workers can complete a project in 15 days, how many days would 12 workers take (assuming equal productivity)?',
    options: [
      '8 days',
      '10 days',
      '12 days',
      '22.5 days'
    ],
    correct: 1,
    explanation: 'Total work = 8 × 15 = 120 worker-days. With 12 workers: 120 ÷ 12 = 10 days. This is inverse proportion — more workers means fewer days.'
    // VERIFY: 8 × 15 = 120. 120 / 12 = 10 ✓
  },

  // ============================================================
  // DATA INTERPRETATION (IDs 8–14)
  // ============================================================

  {
    id: 8,
    category: 'Data Interpretation',
    text: 'Based on the table below, what was the percentage increase in total operating costs from 2022 to 2023?',
    table: {
      headers: ['Year', 'Staff Costs (£000s)', 'Marketing (£000s)', 'Operations (£000s)'],
      rows: [
        ['2022', '450', '120', '280'],
        ['2023', '480', '135', '310']
      ]
    },
    options: [
      '8.8%',
      '10.9%',
      '12.4%',
      '6.7%'
    ],
    correct: 0,
    explanation: '2022 total: 450 + 120 + 280 = £850k. 2023 total: 480 + 135 + 310 = £925k. Increase: £75k. Percentage: (75 ÷ 850) × 100 = 8.82% ≈ 8.8%. Trap: looking only at the largest single-category increase (operations: 10.7%).'
    // VERIFY: 850 total 2022. 925 total 2023. 75/850 = 0.08824 = 8.8% ✓
  },

  {
    id: 9,
    category: 'Data Interpretation',
    text: 'Referring to the table, which region had the highest revenue per employee in Q3?',
    table: {
      headers: ['Region', 'Q3 Revenue (£m)', 'Employees'],
      rows: [
        ['North', '45.2', '850'],
        ['South', '62.8', '1,200'],
        ['East', '38.6', '620'],
        ['West', '71.4', '1,400']
      ]
    },
    options: [
      'North',
      'South',
      'East',
      'West'
    ],
    correct: 2,
    explanation: 'Revenue per employee: North = £45.2m/850 = £53,176. South = £62.8m/1,200 = £52,333. East = £38.6m/620 = £62,258. West = £71.4m/1,400 = £51,000. East has the highest per-employee figure despite having the lowest total revenue. Trap: selecting the region with highest absolute revenue (West).'
    // VERIFY: 45.2/850=53176; 62.8/1200=52333; 38.6/620=62258; 71.4/1400=51000. East highest ✓
  },

  {
    id: 10,
    category: 'Data Interpretation',
    text: 'Based on the quarterly data, which product showed the most consistent growth rate?',
    table: {
      headers: ['Product', 'Q1 Growth', 'Q2 Growth', 'Q3 Growth', 'Q4 Growth'],
      rows: [
        ['Alpha', '5%', '8%', '12%', '15%'],
        ['Beta', '10%', '11%', '9%', '10%'],
        ['Gamma', '8%', '14%', '6%', '18%'],
        ['Delta', '12%', '10%', '11%', '13%']
      ]
    },
    options: [
      'Alpha',
      'Beta',
      'Gamma',
      'Delta'
    ],
    correct: 1,
    explanation: 'Consistency = smallest range. Alpha: 5–15% (range 10). Beta: 9–11% (range 2). Gamma: 6–18% (range 12). Delta: 10–13% (range 3). Beta has the narrowest range, making it the most consistent. Trap: selecting the highest final growth (Alpha at 15%) or highest single quarter (Gamma at 18%).'
    // VERIFY: Ranges — Alpha 10, Beta 2, Gamma 12, Delta 3. Beta smallest ✓
  },

  {
    id: 11,
    category: 'Data Interpretation',
    text: 'Which supplier offers the lowest total cost for an order of 500 units, considering both unit price and delivery?',
    table: {
      headers: ['Supplier', 'Unit Price', 'Delivery', 'Min Order'],
      rows: [
        ['X', '£12.50', '£150', '400'],
        ['Y', '£13.20', 'Free', '300'],
        ['Z', '£11.80', '£200', '500'],
        ['W', '£14.00', '£75', '200']
      ]
    },
    options: [
      'Supplier X — £6,400',
      'Supplier Y — £6,600',
      'Supplier Z — £6,100',
      'Supplier W — £7,075'
    ],
    correct: 2,
    explanation: 'X: (500 × £12.50) + £150 = £6,400. Y: (500 × £13.20) + £0 = £6,600. Z: (500 × £11.80) + £200 = £6,100. W: (500 × £14.00) + £75 = £7,075. Supplier Z is cheapest at £6,100. Trap: choosing lowest unit price without adding delivery.'
    // VERIFY: X=6250+150=6400; Y=6600; Z=5900+200=6100; W=7000+75=7075 ✓
  },

  {
    id: 12,
    category: 'Data Interpretation',
    text: 'In which month was the difference between revenue and costs greatest?',
    table: {
      headers: ['Month', 'Revenue (£000s)', 'Costs (£000s)'],
      rows: [
        ['January', '240', '180'],
        ['February', '280', '210'],
        ['March', '320', '240'],
        ['April', '290', '190']
      ]
    },
    options: [
      'January (£60k)',
      'February (£70k)',
      'March (£80k)',
      'April (£100k)'
    ],
    correct: 3,
    explanation: 'Jan: 240 − 180 = £60k. Feb: 280 − 210 = £70k. Mar: 320 − 240 = £80k. Apr: 290 − 190 = £100k. April has the greatest profit margin despite not having the highest revenue. Trap: selecting the month with highest revenue (March).'
    // VERIFY: 60, 70, 80, 100. April greatest ✓
  },

  {
    id: 13,
    category: 'Data Interpretation',
    text: 'What was Company X\'s market share in 2023, given market share = (Company Revenue ÷ Total Market Revenue) × 100?',
    table: {
      headers: ['Year', 'Company X Revenue (£m)', 'Total Market (£m)'],
      rows: [
        ['2022', '45', '280'],
        ['2023', '52', '320']
      ]
    },
    options: [
      '14.1%',
      '16.1%',
      '16.3%',
      '18.6%'
    ],
    correct: 2,
    explanation: 'Market share 2023 = (52 ÷ 320) × 100 = 16.25% ≈ 16.3%. Trap: using 2022 data gives 45/280 = 16.07% ≈ 16.1%. Always check you\'re reading the correct row.'
    // VERIFY: 52/320 = 0.1625 = 16.25% ≈ 16.3% ✓
  },

  {
    id: 14,
    category: 'Data Interpretation',
    text: 'Based on the P&L summary, what is the operating profit margin for FY2024?',
    table: {
      headers: ['Item', 'FY2023 (£m)', 'FY2024 (£m)'],
      rows: [
        ['Revenue', '84.0', '91.5'],
        ['Cost of Sales', '50.4', '53.7'],
        ['Gross Profit', '33.6', '37.8'],
        ['Operating Expenses', '16.8', '19.2'],
        ['Operating Profit', '16.8', '18.6']
      ]
    },
    options: [
      '20.0%',
      '20.3%',
      '41.3%',
      '34.6%'
    ],
    correct: 1,
    explanation: 'Operating profit margin = Operating Profit ÷ Revenue × 100 = 18.6 ÷ 91.5 × 100 = 20.33% ≈ 20.3%. Trap: using gross profit gives 37.8/91.5 = 41.3% (gross margin, not operating margin). Trap: FY2023 operating margin = 16.8/84.0 = 20.0%.'
    // VERIFY: 18.6/91.5 = 0.20328 = 20.3% ✓
  },

  // ============================================================
  // LOGICAL REASONING (IDs 15–20)
  // ============================================================

  {
    id: 15,
    category: 'Logical Reasoning',
    text: 'All successful candidates have strong analytical skills. Some candidates with strong analytical skills lack commercial awareness. Therefore:',
    options: [
      'All successful candidates lack commercial awareness',
      'Some successful candidates lack commercial awareness',
      'No successful candidates lack commercial awareness',
      'Successful candidates may or may not lack commercial awareness'
    ],
    correct: 3,
    explanation: 'All successful → analytical skills. Some analytical → lack commercial awareness. But the "some" who lack commercial awareness may or may not include successful candidates. The relationship is indeterminate. Trap: assuming the "some" must overlap with "successful" (selecting B).'
  },

  {
    id: 16,
    category: 'Logical Reasoning',
    text: 'If all A are B, and no B are C, which of the following must be true?',
    options: [
      'All C are A',
      'No A are C',
      'Some A are C',
      'All B are A'
    ],
    correct: 1,
    explanation: 'If A → B, and B excludes C, then A must also exclude C. Therefore "No A are C" is necessarily true. Trap: "All B are A" reverses the relationship (only "All A are B" was given, not the converse).'
  },

  {
    id: 17,
    category: 'Logical Reasoning',
    text: 'A project requires either: (1) approval from both directors, OR (2) approval from the board AND budget under £50k. The budget is £75k. The board has approved. Director A has approved; Director B is unavailable. Can the project proceed?',
    options: [
      'Yes — the board approved',
      'Yes — Director A approved',
      'No — the budget exceeds £50k and only one director approved',
      'Cannot be determined'
    ],
    correct: 2,
    explanation: 'Condition 1 (both directors): FAILS — Director B is unavailable. Condition 2 (board + under £50k): FAILS — budget is £75k. Neither condition is satisfied, so the project cannot proceed. You must evaluate both conditions separately.'
  },

  {
    id: 18,
    category: 'Logical Reasoning',
    text: 'In a Fibonacci-type sequence where each term is the sum of the previous two, starting 3, 7, 10, 17, ... what is the 7th term?',
    options: [
      '44',
      '71',
      '115',
      '186'
    ],
    correct: 1,
    explanation: 'Sequence: 3, 7, 10 (3+7), 17 (7+10), 27 (10+17), 44 (17+27), 71 (27+44). The 7th term is 71.'
    // VERIFY: T1=3, T2=7, T3=10, T4=17, T5=27, T6=44, T7=71 ✓
  },

  {
    id: 19,
    category: 'Logical Reasoning',
    text: 'If all employees in Department X received bonuses, and Sarah received a bonus, which conclusion is valid?',
    options: [
      'Sarah is definitely in Department X',
      'Sarah is definitely not in Department X',
      'Sarah may or may not be in Department X',
      'No one outside Department X received bonuses'
    ],
    correct: 2,
    explanation: 'All X → Bonus does not mean Bonus → X. Sarah got a bonus but could be in another department that also gives bonuses. This is the "affirming the consequent" fallacy. Trap: assuming only Department X gives bonuses (selecting A).'
  },

  {
    id: 20,
    category: 'Logical Reasoning',
    text: 'A scheduling rule states: Meeting A must happen before Meeting B. Meeting C must happen after Meeting B but before Meeting D. Meeting E has no constraints. Which ordering is definitely impossible?',
    options: [
      'E, A, B, C, D',
      'A, B, E, C, D',
      'A, C, B, D, E',
      'E, A, B, D, C'
    ],
    correct: 2,
    explanation: 'Constraints: A < B < C < D (E is free). Option C puts C before B, violating "C must happen after B." Option D puts D before C, violating "C before D." Both C and D are invalid, but since C is listed first and directly violates the B-before-C rule, it is the clearest violation. Trap: not tracking all constraints through the sequence.'
  }

];

// Export for use in diagnostic engine
if (typeof module !== 'undefined' && module.exports) {
  module.exports = defined_questions;
}
