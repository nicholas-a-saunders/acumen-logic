// Acumen Logic - Diagnostic Question Bank
// Canonical question set synced with diagnostic.html

const questions = [
  // ============================================
  // NUMERICAL REASONING (Questions 1, 4, 7, 10, 13, 16, 19)
  // ============================================

  {
    id: 1,
    category: 'Numerical Reasoning',
    text: 'A company\'s revenue increased by 15% from Q1 to Q2, then decreased by 8% from Q2 to Q3. If Q1 revenue was £2.4 million, what was the Q3 revenue?',
    options: [
      '£2.54 million',
      '£2.57 million',
      '£2.76 million',
      '£2.49 million',
      'Cannot say'
    ],
    explanation: 'Q2 revenue = £2.4m × 1.15 = £2.76m. Q3 revenue = £2.76m × 0.92 = £2.5392m, which rounds to £2.54m (to 2 decimal places). Common error: adding percentages (15% - 8% = 7%) gives £2.568m, which is incorrect due to different base values.'
  },

  {
    id: 4,
    category: 'Numerical Reasoning',
    text: 'An investment of £15,000 earns 4.5% compound interest annually. What is the value after 3 years (to the nearest £100)?',
    options: [
      '£16,350',
      '£17,100',
      '£17,600',
      '£18,200',
      '£19,000'
    ],
    explanation: 'Compound interest formula: £15,000 × (1.045)³ = £15,000 × 1.141166 = £17,117.48 ≈ £17,100. Simple interest would give £17,025. Common error: calculating simple interest or rounding incorrectly.'
  },

  {
    id: 7,
    category: 'Numerical Reasoning',
    text: 'If the ratio of senior to junior staff is 3:5 and there are 240 employees in total, how many more junior staff are there than senior staff?',
    options: [
      '30',
      '40',
      '60',
      '90',
      '120'
    ],
    explanation: 'Total parts = 3 + 5 = 8. Senior = (3/8) × 240 = 90. Junior = (5/8) × 240 = 150. Difference = 60. Common error: calculating totals but not the difference, or misreading the ratio order.'
  },

  {
    id: 10,
    category: 'Numerical Reasoning',
    text: 'A product has a list price of £250 per unit. A 12% trade discount applies to all sales. In addition, 40% of customers take a further 2% cash discount on the discounted price. Variable cost is £150 per unit and fixed campaign cost is £96,000 spread across an expected 2,400 units. What is the expected operating margin on net revenue?',
    options: [
      '12.9%',
      '14.4%',
      '16.2%',
      '18.0%',
      '20.7%'
    ],
    explanation: 'Discounted unit price = 250 × 0.88 = £220. Average net realised price = 220 × (0.6 + 0.4×0.98) = £218.24. Net revenue = 218.24 × 2,400 = £523,776. Costs = variable (£150×2,400 = £360,000) + fixed (£96,000) = £456,000. Operating profit = £67,776. Margin = 67,776 ÷ 523,776 = 12.94% ≈ 12.9%.'
  },

  {
    id: 13,
    category: 'Numerical Reasoning',
    text: 'A department\'s budget was reduced by 12% this year to £352,000. What was last year\'s budget?',
    options: [
      '£380,000',
      '£394,240',
      '£400,000',
      '£410,500',
      '£420,000'
    ],
    explanation: 'If £352,000 = 88% of last year\'s budget, then original = £352,000 ÷ 0.88 = £400,000. Common error: adding 12% to £352,000 (£394,240), which calculates growth from reduced amount rather than reduction from original.'
  },

  {
    id: 16,
    category: 'Numerical Reasoning',
    text: 'Share prices rose 20% on Monday, fell 10% on Tuesday, and rose 5% on Wednesday. What is the net percentage change from the start of Monday to end of Wednesday?',
    options: [
      '12.4%',
      '13.4%',
      '15%',
      '15.4%',
      '18%'
    ],
    explanation: 'Multiplicative change: 1.20 × 0.90 × 1.05 = 1.134 = 13.4% increase. Common error: adding percentages (20 - 10 + 5 = 15%), ignoring compounding effects.'
  },

  {
    id: 19,
    category: 'Numerical Reasoning',
    text: 'A firm reports 2025 revenue of £84m, gross margin of 42%, and operating expenses equal to 60% of gross profit. If revenue grows 8% in 2026 and gross margin falls by 2 percentage points (with the same operating-expense ratio), what is projected 2026 operating profit?',
    options: [
      '£13.6m',
      '£14.5m',
      '£15.8m',
      '£16.9m',
      '£18.2m'
    ],
    explanation: '2026 revenue = 84 × 1.08 = 90.72. New gross margin = 40%, so gross profit = 90.72 × 0.40 = 36.288. Operating expenses = 60% of gross profit = 21.7728. Operating profit = 36.288 - 21.7728 = 14.5152 ≈ £14.5m.'
  },

  // ============================================
  // DATA INTERPRETATION (Questions 2, 5, 8, 11, 14, 17, 20)
  // ============================================

  {
    id: 2,
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
      '8.2%',
      '8.8%',
      '9.1%',
      '10.3%',
      '12.4%'
    ],
    explanation: '2022 total: 450 + 120 + 280 = 850. 2023 total: 480 + 135 + 310 = 925. Increase: 75. Percentage: (75/850) × 100 = 8.82% ≈ 8.8%. Common error: calculating individual category changes instead of total change.'
  },

  {
    id: 5,
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
      'West',
      'Cannot determine'
    ],
    explanation: 'Revenue per employee: North = £45.2m/850 = £53,176. South = £62.8m/1,200 = £52,333. East = £38.6m/620 = £62,258. West = £71.4m/1,400 = £51,000. East has highest revenue per employee despite lowest total revenue. Common error: selecting highest total revenue (West).'
  },

  {
    id: 8,
    category: 'Data Interpretation',
    text: 'Based on the quarterly data, which product showed the most consistent growth rate across all four quarters?',
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
      'Delta',
      'Cannot determine'
    ],
    explanation: 'Consistency means smallest variance. Alpha: range 10% (5-15), irregular pattern. Beta: range 2% (9-11), very stable. Gamma: range 12% (6-18), highly volatile. Delta: range 3% (10-13), stable but wider than Beta. Beta is most consistent. Common error: selecting highest growth (Gamma) or final highest value (Alpha).'
  },

  {
    id: 11,
    category: 'Data Interpretation',
    text: 'Using the table, what is the projected Q1 operating profit if revenue grows 6% from Q4, gross margin stays at the Q4 level, and operating expenses remain 65% of gross profit?',
    table: {
      headers: ['Quarter', 'Revenue (£m)', 'Gross Margin'],
      rows: [
        ['Q1', '48', '38%'],
        ['Q2', '52', '39%'],
        ['Q3', '55', '41%'],
        ['Q4', '60', '42%']
      ]
    },
    options: [
      '£8.82m',
      '£9.35m',
      '£10.08m',
      '£11.21m',
      'Cannot be determined'
    ],
    explanation: 'Projected revenue = 60 × 1.06 = £63.6m. Gross profit = 63.6 × 42% = £26.712m. Operating expenses = 65% of gross profit = £17.3628m. Operating profit = 26.712 - 17.3628 = £9.3492m ≈ £9.35m.'
  },

  {
    id: 14,
    category: 'Data Interpretation',
    text: 'A buyer must place one order of 1,200 units. Using total landed cost = (unit price × quantity) + freight - applicable rebate, which supplier is cheapest?',
    table: {
      headers: ['Supplier', 'Unit Price', 'Freight', 'Rebate Rule', 'Lead Time'],
      rows: [
        ['X', '£8.40', '£320', '£0.15 per unit above 1,000 units', '8 days'],
        ['Y', '£8.10', '£500', 'No rebate', '5 days'],
        ['Z', '£8.55', '£180', '£0.40 per unit on all units if order is 1,200+', '10 days'],
        ['W', '£8.00', '£650', '£0.10 per unit above 1,500 units', '6 days']
      ]
    },
    options: [
      'Supplier X',
      'Supplier Y',
      'Supplier Z',
      'Supplier W',
      'Cannot determine'
    ],
    explanation: 'For 1,200 units: X = (1,200×8.40)+320-(200×0.15)=£10,370. Y = (1,200×8.10)+500=£10,220. Z = (1,200×8.55)+180-(1,200×0.40)=£9,960. W = (1,200×8.00)+650=£10,250. Supplier Z is lowest.'
  },

  {
    id: 17,
    category: 'Data Interpretation',
    text: 'Using the table, which region contributed the most to operating profit growth from 2024 to 2025?',
    table: {
      headers: ['Region', '2024 Revenue (£m)', '2024 Op Margin', '2025 Revenue (£m)', '2025 Op Margin'],
      rows: [
        ['North', '110', '16%', '118', '17%'],
        ['South', '96', '19%', '104', '18%'],
        ['East', '88', '14%', '92', '16%'],
        ['West', '72', '11%', '86', '15%']
      ]
    },
    options: [
      'North',
      'South',
      'East',
      'West',
      'Cannot determine'
    ],
    explanation: 'Operating profit = Revenue × margin. Growth by region: North 17.60→20.06 (+2.46), South 18.24→18.72 (+0.48), East 12.32→14.72 (+2.40), West 7.92→12.90 (+4.98). West contributes the most growth.'
  },

  {
    id: 20,
    category: 'Data Interpretation',
    text: 'Using the chart, management forecasts next-quarter revenue to rise by 9% from Q4 and costs to rise by 12% from Q4. What is the projected next-quarter operating margin?',
    chart: {
      title: 'Quarterly Revenue and Costs (£m)',
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      series: [
        { name: 'Revenue', values: [52, 58, 64, 71] },
        { name: 'Costs', values: [39, 42, 47, 53] }
      ]
    },
    options: [
      '21.8%',
      '22.4%',
      '23.3%',
      '24.6%',
      '25.4%'
    ],
    explanation: 'From Q4: Revenue = 71, Costs = 53. Next-quarter revenue = 71×1.09 = 77.39. Next-quarter costs = 53×1.12 = 59.36. Operating margin = (77.39-59.36)/77.39 = 23.3% (approx).'
  },

  // ============================================
  // LOGICAL REASONING (Questions 3, 6, 9, 12, 15, 18)
  // ============================================

  {
    id: 3,
    category: 'Logical Reasoning',
    text: 'All successful candidates have strong analytical skills. Some candidates with strong analytical skills lack commercial awareness. Therefore:',
    options: [
      'All successful candidates lack commercial awareness',
      'Some successful candidates lack commercial awareness',
      'No successful candidates lack commercial awareness',
      'At least one successful candidate definitely lacks commercial awareness',
      'Cannot be determined from the premises'
    ],
    explanation: 'All successful candidates are in the analytical-skills group, and some people in that group lack commercial awareness. That "some" may or may not include successful candidates. So no definite conclusion about successful candidates\' commercial awareness can be drawn.'
  },

  {
    id: 6,
    category: 'Logical Reasoning',
    text: 'If all A are B, and no B are C, which of the following must be true?',
    options: [
      'All C are A',
      'No A are C',
      'Some A are C',
      'All B are A',
      'None of the above'
    ],
    explanation: 'Logical deduction: If A → B, and B → not C, then A → not C. Therefore no A are C. This is valid syllogistic reasoning. Common error: confusing converse (all B are A) or inverse relationships.'
  },

  {
    id: 9,
    category: 'Logical Reasoning',
    text: 'Four analysts - Aisha, Ben, Chloe, and Daniel - are each assigned one different workstream: Modelling, Valuation, Risk, and Reporting. Which analyst must be assigned to Risk?',
    bullets: [
      'Daniel is assigned to Reporting.',
      'Ben is assigned either Valuation or Risk.',
      'If Ben is assigned to Risk, then Chloe is assigned to Modelling.',
      'Chloe is not assigned to Modelling.',
      'Aisha is not assigned to Reporting.'
    ],
    options: [
      'Aisha',
      'Ben',
      'Chloe',
      'Daniel',
      'Cannot be determined from the constraints'
    ],
    explanation: 'Chloe cannot be Modelling. Therefore the conditional "if Ben is Risk, then Chloe is Modelling" means Ben cannot be Risk, so Ben must be Valuation. Daniel is Reporting. The remaining roles for Aisha and Chloe are Modelling and Risk, and Chloe cannot be Modelling, so Chloe must be Risk.'
  },

  {
    id: 12,
    category: 'Logical Reasoning',
    text: 'In a sequence where each term is the sum of the previous two terms, starting 3, 7, 10, 17... what is the 7th term?',
    options: [
      '29',
      '44',
      '71',
      '115',
      '186'
    ],
    explanation: 'Sequence: 3, 7, 10 (3+7), 17 (7+10), 27 (10+17), 44 (17+27), 71 (27+44). The 7th term is 71. Common error: miscounting terms or arithmetic errors in addition.'
  },

  {
    id: 15,
    category: 'Logical Reasoning',
    text: 'If all employees in Department X received bonuses, and Sarah received a bonus, then:',
    options: [
      'Sarah is definitely in Department X',
      'Sarah is definitely not in Department X',
      'Sarah may be in Department X',
      'No one in Department X received bonuses',
      'Cannot be determined'
    ],
    explanation: 'Logical form: All X → Bonus. Sarah → Bonus. This does not entail Sarah → X (affirming the consequent fallacy). Sarah may be in Department X, or she may be in another department that also gives bonuses. Common error: selecting A (assuming only Department X gives bonuses).'
  },

  {
    id: 18,
    category: 'Logical Reasoning',
    text: 'A deal team schedules four client calls, one per day from Monday to Thursday, with one analyst per day: James, Kavita, Leo, and Mina. Based on the constraints, who must be scheduled on Thursday?',
    bullets: [
      'James is scheduled immediately after Leo.',
      'Leo is scheduled before Mina.',
      'Mina is not scheduled on Thursday.',
      'Kavita is not scheduled on Monday.'
    ],
    options: [
      'James',
      'Kavita',
      'Leo',
      'Mina',
      'Cannot be determined from the constraints'
    ],
    explanation: 'If Leo/James are Tue/Wed or Wed/Thu, Leo would not be before Mina once Mina cannot be Thu, so those patterns fail. The only valid pattern is Leo Monday and James Tuesday. Mina cannot be Thursday, so Mina must be Wednesday, leaving Thursday for Kavita.'
  }
];

// Obfuscated answer key (Base64-encoded JSON: { questionId: correctOptionIndex })
const ENCODED_ANSWER_KEY = 'eyIxIjowLCIyIjoxLCIzIjo0LCI0IjoxLCI1IjoyLCI2IjoxLCI3IjoyLCI4IjoxLCI5IjoyLCIxMCI6MCwiMTEiOjEsIjEyIjoyLCIxMyI6MiwiMTQiOjIsIjE1IjoyLCIxNiI6MSwiMTciOjMsIjE4IjoxLCIxOSI6MSwiMjAiOjJ9';

let decodedAnswerKeyCache = null;
let answerKeyDecodeFailed = false;

function decodeAnswerKey() {
  if (decodedAnswerKeyCache) return decodedAnswerKeyCache;
  if (answerKeyDecodeFailed) return null;

  try {
    let json = '';
    if (typeof atob === 'function') {
      json = atob(ENCODED_ANSWER_KEY);
    } else if (typeof Buffer !== 'undefined') {
      json = Buffer.from(ENCODED_ANSWER_KEY, 'base64').toString('utf8');
    } else {
      throw new Error('No Base64 decoder available');
    }

    const parsed = JSON.parse(json);
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Decoded answer key is invalid');
    }

    decodedAnswerKeyCache = parsed;
    return decodedAnswerKeyCache;
  } catch (err) {
    answerKeyDecodeFailed = true;
    if (typeof console !== 'undefined' && console.error) {
      console.error('Failed to decode diagnostic answer key:', err);
    }
    return null;
  }
}

function getCorrectAnswerIndex(questionId) {
  const map = decodeAnswerKey();
  if (!map) return null;
  const raw = map[String(questionId)];
  return Number.isInteger(raw) ? raw : null;
}

if (typeof window !== 'undefined') {
  window.questions = questions;
  window.getCorrectAnswerIndex = getCorrectAnswerIndex;
}

// Export for use in diagnostic.js or node tooling
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    questions,
    getCorrectAnswerIndex,
    decodeAnswerKey
  };
}
