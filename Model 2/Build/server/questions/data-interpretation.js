/**
 * Data Interpretation Question Templates (50)
 *
 * Sub-categories:
 *   Table Reading (8), Bar Chart Analysis (8), Line Graph Trends (7),
 *   Pie Chart Calculations (7), Multi-Source Integration (8),
 *   Financial Statement Analysis (8), Weighted Averages & Index (4)
 *
 * Difficulty distribution: 17 easy (1), 17 medium (2), 16 hard (3)
 *
 * Every template includes a table_generator function returning structured
 * JSON for frontend rendering (table, bar-chart, or pie-chart).
 */

const templates = [

  // ═══════════════════════════════════════════════════════════
  // TABLE READING (8)
  // ═══════════════════════════════════════════════════════════

  {
    id: 'DI-TBL-001', category: 'DI', sub_category: 'Table Reading', difficulty: 1,
    question_text: 'The table shows quarterly revenue (£m) for a company. What is the total annual revenue?',
    variables: {
      q1: { min: 20, max: 60, step: 5 },
      q2: { min: 25, max: 65, step: 5 },
      q3: { min: 20, max: 55, step: 5 },
      q4: { min: 30, max: 70, step: 5 }
    },
    table_generator: (vars) => ({
      type: 'table',
      title: 'Quarterly Revenue (£m)',
      headers: ['Quarter', 'Revenue (£m)'],
      rows: [
        ['Q1', vars.q1],
        ['Q2', vars.q2],
        ['Q3', vars.q3],
        ['Q4', vars.q4]
      ]
    }),
    correct_formula: 'q1 + q2 + q3 + q4',
    distractor_formulas: [
      '(q1 + q2 + q3 + q4) / 4',
      'q4 - q1 + q2 + q3',
      'q1 + q2 + q3 + q4 + 10',
      '(q1 + q4) * 2'
    ],
    answer_prefix: '£', answer_suffix: 'm', answer_decimals: 0,
    explanation_text: '£{q1}m + £{q2}m + £{q3}m + £{q4}m = £{answer}m',
    tags: ['table', 'sum', 'revenue']
  },

  {
    id: 'DI-TBL-002', category: 'DI', sub_category: 'Table Reading', difficulty: 1,
    question_text: 'The table shows employee counts by department. What percentage of total staff work in Sales?',
    variables: {
      fin: { min: 20, max: 60, step: 5 },
      sales: { min: 30, max: 80, step: 5 },
      ops: { min: 25, max: 70, step: 5 },
      hr: { min: 10, max: 30, step: 5 }
    },
    table_generator: (vars) => ({
      type: 'table',
      title: 'Department Headcount',
      headers: ['Department', 'Employees'],
      rows: [
        ['Finance', vars.fin],
        ['Sales', vars.sales],
        ['Operations', vars.ops],
        ['HR', vars.hr]
      ]
    }),
    correct_formula: 'sales / (fin + sales + ops + hr) * 100',
    distractor_formulas: [
      'sales / fin * 100',
      'sales / (fin + ops + hr) * 100',
      'fin / (fin + sales + ops + hr) * 100',
      'sales / (sales + ops) * 100'
    ],
    answer_suffix: '%', answer_decimals: 1,
    explanation_text: '{sales} / ({fin}+{sales}+{ops}+{hr}) × 100 = {answer}%',
    tags: ['table', 'percentage', 'headcount']
  },

  {
    id: 'DI-TBL-003', category: 'DI', sub_category: 'Table Reading', difficulty: 1,
    question_text: 'The table shows product sales data. What is the highest revenue per unit across all products?',
    variables: {
      unitsA: { min: 100, max: 500, step: 50 },
      revA: { min: 50, max: 200, step: 10 },
      unitsB: { min: 200, max: 600, step: 50 },
      revB: { min: 80, max: 250, step: 10 },
      unitsC: { min: 150, max: 400, step: 50 },
      revC: { min: 60, max: 180, step: 10 }
    },
    table_generator: (vars) => ({
      type: 'table',
      title: 'Product Sales Summary',
      headers: ['Product', 'Units Sold', 'Revenue (£k)'],
      rows: [
        ['Product A', vars.unitsA, vars.revA],
        ['Product B', vars.unitsB, vars.revB],
        ['Product C', vars.unitsC, vars.revC]
      ]
    }),
    correct_formula: 'Math.max(revA * 1000 / unitsA, revB * 1000 / unitsB, revC * 1000 / unitsC)',
    distractor_formulas: [
      'Math.min(revA * 1000 / unitsA, revB * 1000 / unitsB, revC * 1000 / unitsC)',
      '(revA + revB + revC) * 1000 / (unitsA + unitsB + unitsC)',
      'Math.max(revA, revB, revC) * 1000 / Math.min(unitsA, unitsB, unitsC)',
      'Math.max(revA * 1000 / unitsA, revB * 1000 / unitsB, revC * 1000 / unitsC) * 1.1'
    ],
    answer_prefix: '£', answer_decimals: 2,
    explanation_text: 'Revenue per unit: A = £{revA}k×1000/{unitsA}, B = £{revB}k×1000/{unitsB}, C = £{revC}k×1000/{unitsC}. Highest = £{answer}',
    tags: ['table', 'revenue-per-unit', 'comparison']
  },

  {
    id: 'DI-TBL-004', category: 'DI', sub_category: 'Table Reading', difficulty: 1,
    question_text: 'The table shows regional performance data. What is the percentage difference in profit margin between the highest and lowest performing regions?',
    variables: {
      rN: { min: 30, max: 80, step: 5 },
      cN: { min: 20, max: 60, step: 5 },
      rS: { min: 40, max: 90, step: 5 },
      cS: { min: 25, max: 70, step: 5 },
      rE: { min: 25, max: 70, step: 5 },
      cE: { min: 15, max: 55, step: 5 }
    },
    table_generator: (vars) => ({
      type: 'table',
      title: 'Regional Performance (£m)',
      headers: ['Region', 'Revenue (£m)', 'Costs (£m)', 'Profit (£m)'],
      rows: [
        ['North', vars.rN, vars.cN, vars.rN - vars.cN],
        ['South', vars.rS, vars.cS, vars.rS - vars.cS],
        ['East', vars.rE, vars.cE, vars.rE - vars.cE]
      ]
    }),
    correct_formula: 'Math.max((rN-cN)/rN*100, (rS-cS)/rS*100, (rE-cE)/rE*100) - Math.min((rN-cN)/rN*100, (rS-cS)/rS*100, (rE-cE)/rE*100)',
    distractor_formulas: [
      'Math.max((rN-cN)/rN*100, (rS-cS)/rS*100, (rE-cE)/rE*100)',
      '((rN+rS+rE) - (cN+cS+cE)) / (rN+rS+rE) * 100',
      'Math.max(rN-cN, rS-cS, rE-cE) - Math.min(rN-cN, rS-cS, rE-cE)',
      'Math.max((rN-cN)/rN*100, (rS-cS)/rS*100, (rE-cE)/rE*100) + 5'
    ],
    answer_suffix: ' percentage points', answer_decimals: 1,
    explanation_text: 'Margins: North = ({rN}-{cN})/{rN}×100, South = ({rS}-{cS})/{rS}×100, East = ({rE}-{cE})/{rE}×100. Difference = {answer} pp',
    tags: ['table', 'profit-margin', 'comparison']
  },

  {
    id: 'DI-TBL-005', category: 'DI', sub_category: 'Table Reading', difficulty: 2,
    question_text: 'The table shows monthly website traffic. What was the average monthly growth rate from January to April?',
    variables: {
      jan: { min: 50, max: 150, step: 10 },
      feb: { min: 55, max: 170, step: 10 },
      mar: { min: 60, max: 190, step: 10 },
      apr: { min: 70, max: 220, step: 10 }
    },
    table_generator: (vars) => ({
      type: 'table',
      title: 'Monthly Website Visitors (thousands)',
      headers: ['Month', 'Visitors (k)'],
      rows: [
        ['January', vars.jan],
        ['February', vars.feb],
        ['March', vars.mar],
        ['April', vars.apr]
      ]
    }),
    correct_formula: '(Math.pow(apr / jan, 1/3) - 1) * 100',
    distractor_formulas: [
      '(apr - jan) / jan * 100 / 3',
      '(apr / jan - 1) * 100',
      '((feb-jan)/jan + (mar-feb)/feb + (apr-mar)/mar) / 3 * 100 + 1',
      '(apr - jan) / jan * 100'
    ],
    answer_suffix: '%', answer_decimals: 1,
    explanation_text: 'Average monthly growth = ({apr}/{jan})^(1/3) − 1 = {answer}%',
    tags: ['table', 'growth-rate', 'traffic']
  },

  {
    id: 'DI-TBL-006', category: 'DI', sub_category: 'Table Reading', difficulty: 2,
    question_text: 'The table shows project costs by category. If the IT budget is cut by {cut}%, how much is redistributed to Marketing and Operations equally?',
    variables: {
      it: { min: 100, max: 300, step: 20 },
      mkt: { min: 50, max: 150, step: 10 },
      ops: { min: 80, max: 200, step: 20 },
      admin: { min: 30, max: 80, step: 10 },
      cut: { min: 10, max: 30, step: 5 }
    },
    table_generator: (vars) => ({
      type: 'table',
      title: 'Project Budget Allocation (£k)',
      headers: ['Category', 'Budget (£k)'],
      rows: [
        ['IT', vars.it],
        ['Marketing', vars.mkt],
        ['Operations', vars.ops],
        ['Admin', vars.admin]
      ]
    }),
    correct_formula: 'it * cut / 100 / 2',
    distractor_formulas: [
      'it * cut / 100',
      '(it + mkt + ops + admin) * cut / 100 / 2',
      'it * cut / 100 / 3',
      'mkt + it * cut / 100 / 2'
    ],
    answer_prefix: '£', answer_suffix: 'k', answer_decimals: 1,
    explanation_text: 'IT cut = £{it}k × {cut}% = £{answer}k each (split between two departments)',
    tags: ['table', 'budget-reallocation']
  },

  {
    id: 'DI-TBL-007', category: 'DI', sub_category: 'Table Reading', difficulty: 3,
    question_text: 'The table shows sales data for two years. Which product showed the greatest absolute increase in profit?',
    variables: {
      rx1: { min: 100, max: 300, step: 20 },
      rx2: { min: 120, max: 350, step: 20 },
      cx1: { min: 60, max: 200, step: 15 },
      cx2: { min: 65, max: 220, step: 15 },
      ry1: { min: 80, max: 250, step: 20 },
      ry2: { min: 100, max: 300, step: 20 },
      cy1: { min: 50, max: 180, step: 15 },
      cy2: { min: 55, max: 200, step: 15 },
      rz1: { min: 60, max: 200, step: 20 },
      rz2: { min: 80, max: 250, step: 20 },
      cz1: { min: 40, max: 150, step: 15 },
      cz2: { min: 45, max: 170, step: 15 }
    },
    table_generator: (vars) => ({
      type: 'table',
      title: 'Product Performance Year-on-Year (£k)',
      headers: ['Product', 'Y1 Revenue', 'Y1 Cost', 'Y2 Revenue', 'Y2 Cost'],
      rows: [
        ['Product X', vars.rx1, vars.cx1, vars.rx2, vars.cx2],
        ['Product Y', vars.ry1, vars.cy1, vars.ry2, vars.cy2],
        ['Product Z', vars.rz1, vars.cz1, vars.rz2, vars.cz2]
      ]
    }),
    correct_formula: 'Math.max((rx2-cx2)-(rx1-cx1), (ry2-cy2)-(ry1-cy1), (rz2-cz2)-(rz1-cz1))',
    distractor_formulas: [
      'Math.max(rx2-rx1, ry2-ry1, rz2-rz1)',
      'Math.max((rx2-cx2), (ry2-cy2), (rz2-cz2))',
      'Math.min((rx2-cx2)-(rx1-cx1), (ry2-cy2)-(ry1-cy1), (rz2-cz2)-(rz1-cz1))',
      '((rx2-cx2)-(rx1-cx1) + (ry2-cy2)-(ry1-cy1) + (rz2-cz2)-(rz1-cz1)) / 3'
    ],
    answer_prefix: '£', answer_suffix: 'k', answer_decimals: 0,
    explanation_text: 'Profit change X = ({rx2}-{cx2})-({rx1}-{cx1}), Y = ({ry2}-{cy2})-({ry1}-{cy1}), Z = ({rz2}-{cz2})-({rz1}-{cz1}). Greatest = £{answer}k',
    tags: ['table', 'profit-change', 'multi-product']
  },

  {
    id: 'DI-TBL-008', category: 'DI', sub_category: 'Table Reading', difficulty: 3,
    question_text: 'The table shows staff productivity metrics. If the target is {target} units per employee, how many additional employees are needed to meet the total output target of {totalTarget} units?',
    variables: {
      staffA: { min: 10, max: 30, step: 5 },
      outputA: { min: 500, max: 1500, step: 100 },
      staffB: { min: 15, max: 40, step: 5 },
      outputB: { min: 600, max: 1800, step: 100 },
      target: { min: 40, max: 60, step: 5 },
      totalTarget: { min: 2000, max: 4000, step: 500 }
    },
    table_generator: (vars) => ({
      type: 'table',
      title: 'Current Staffing & Output',
      headers: ['Department', 'Employees', 'Output (units)'],
      rows: [
        ['Dept A', vars.staffA, vars.outputA],
        ['Dept B', vars.staffB, vars.outputB]
      ]
    }),
    correct_formula: 'Math.max(0, Math.ceil(totalTarget / target) - (staffA + staffB))',
    distractor_formulas: [
      'Math.ceil(totalTarget / target)',
      'totalTarget / target - staffA',
      'Math.ceil((totalTarget - outputA - outputB) / target)',
      'Math.ceil(totalTarget / target) - staffA - staffB + 5'
    ],
    answer_decimals: 0,
    explanation_text: 'Staff needed = {totalTarget} / {target} = required. Current = {staffA}+{staffB}. Additional = {answer}',
    tags: ['table', 'productivity', 'staffing']
  },

  // ═══════════════════════════════════════════════════════════
  // BAR CHART ANALYSIS (8)
  // ═══════════════════════════════════════════════════════════

  {
    id: 'DI-BAR-001', category: 'DI', sub_category: 'Bar Chart Analysis', difficulty: 1,
    question_text: 'The bar chart shows monthly sales. What is the difference between the highest and lowest months?',
    variables: {
      jan: { min: 30, max: 80, step: 5 },
      feb: { min: 25, max: 75, step: 5 },
      mar: { min: 35, max: 85, step: 5 },
      apr: { min: 40, max: 90, step: 5 },
      may: { min: 30, max: 95, step: 5 },
      jun: { min: 35, max: 100, step: 5 }
    },
    table_generator: (vars) => ({
      type: 'bar-chart',
      title: 'Monthly Sales (£k)',
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Sales (£k)',
        values: [vars.jan, vars.feb, vars.mar, vars.apr, vars.may, vars.jun]
      }]
    }),
    correct_formula: 'Math.max(jan,feb,mar,apr,may,jun) - Math.min(jan,feb,mar,apr,may,jun)',
    distractor_formulas: [
      '(jan+feb+mar+apr+may+jun)/6',
      'Math.max(jan,feb,mar,apr,may,jun)',
      'jun - jan',
      'Math.max(jan,feb,mar,apr,may,jun) - Math.min(jan,feb,mar,apr,may,jun) + 5'
    ],
    answer_prefix: '£', answer_suffix: 'k', answer_decimals: 0,
    explanation_text: 'Range = Highest − Lowest = £{answer}k',
    tags: ['bar-chart', 'range']
  },

  {
    id: 'DI-BAR-002', category: 'DI', sub_category: 'Bar Chart Analysis', difficulty: 1,
    question_text: 'The bar chart shows revenue by region. What percentage of total revenue comes from the London region?',
    variables: {
      lon: { min: 40, max: 120, step: 10 },
      se: { min: 20, max: 60, step: 5 },
      mid: { min: 15, max: 50, step: 5 },
      nth: { min: 10, max: 45, step: 5 }
    },
    table_generator: (vars) => ({
      type: 'bar-chart',
      title: 'Revenue by Region (£m)',
      labels: ['London', 'South East', 'Midlands', 'North'],
      datasets: [{
        label: 'Revenue (£m)',
        values: [vars.lon, vars.se, vars.mid, vars.nth]
      }]
    }),
    correct_formula: 'lon / (lon + se + mid + nth) * 100',
    distractor_formulas: [
      'lon / se * 100',
      'lon / (se + mid + nth) * 100',
      '(lon + se) / (lon + se + mid + nth) * 100',
      'lon / (lon + se + mid + nth) * 100 + 3'
    ],
    answer_suffix: '%', answer_decimals: 1,
    explanation_text: '{lon} / ({lon}+{se}+{mid}+{nth}) × 100 = {answer}%',
    tags: ['bar-chart', 'percentage', 'regional']
  },

  {
    id: 'DI-BAR-003', category: 'DI', sub_category: 'Bar Chart Analysis', difficulty: 1,
    question_text: 'The stacked bar chart shows costs split between Fixed and Variable. What percentage of total cost is variable?',
    variables: {
      fixed: { min: 50, max: 200, step: 10 },
      variable: { min: 30, max: 150, step: 10 }
    },
    table_generator: (vars) => ({
      type: 'bar-chart',
      title: 'Cost Breakdown (£k)',
      labels: ['Total Cost'],
      datasets: [
        { label: 'Fixed (£k)', values: [vars.fixed] },
        { label: 'Variable (£k)', values: [vars.variable] }
      ]
    }),
    correct_formula: 'variable / (fixed + variable) * 100',
    distractor_formulas: [
      'fixed / (fixed + variable) * 100',
      'variable / fixed * 100',
      '(fixed + variable) / variable * 100',
      'variable / (fixed + variable) * 100 + 5'
    ],
    answer_suffix: '%', answer_decimals: 1,
    explanation_text: 'Variable % = {variable} / ({fixed} + {variable}) × 100 = {answer}%',
    tags: ['stacked-bar', 'cost-split']
  },

  {
    id: 'DI-BAR-004', category: 'DI', sub_category: 'Bar Chart Analysis', difficulty: 1,
    question_text: 'The grouped bar chart compares Year 1 and Year 2 sales by product. Which product had the highest percentage growth?',
    variables: {
      a1: { min: 50, max: 150, step: 10 },
      a2: { min: 60, max: 200, step: 10 },
      b1: { min: 40, max: 120, step: 10 },
      b2: { min: 50, max: 170, step: 10 },
      c1: { min: 30, max: 100, step: 10 },
      c2: { min: 35, max: 140, step: 10 }
    },
    table_generator: (vars) => ({
      type: 'bar-chart',
      title: 'Product Sales Year-on-Year (£k)',
      labels: ['Product A', 'Product B', 'Product C'],
      datasets: [
        { label: 'Year 1 (£k)', values: [vars.a1, vars.b1, vars.c1] },
        { label: 'Year 2 (£k)', values: [vars.a2, vars.b2, vars.c2] }
      ]
    }),
    correct_formula: 'Math.max((a2-a1)/a1*100, (b2-b1)/b1*100, (c2-c1)/c1*100)',
    distractor_formulas: [
      'Math.max(a2-a1, b2-b1, c2-c1)',
      '(a2-a1)/a1*100',
      'Math.min((a2-a1)/a1*100, (b2-b1)/b1*100, (c2-c1)/c1*100)',
      '((a2-a1)+(b2-b1)+(c2-c1)) / (a1+b1+c1) * 100'
    ],
    answer_suffix: '%', answer_decimals: 1,
    explanation_text: 'Growth: A = ({a2}-{a1})/{a1}×100, B = ({b2}-{b1})/{b1}×100, C = ({c2}-{c1})/{c1}×100. Highest = {answer}%',
    tags: ['grouped-bar', 'growth-comparison']
  },

  {
    id: 'DI-BAR-005', category: 'DI', sub_category: 'Bar Chart Analysis', difficulty: 2,
    question_text: 'The bar chart shows quarterly profit. If Q1 profit was reinvested at {rate}% return, what would the combined value of Q1 profit plus return plus Q2 profit be?',
    variables: {
      q1: { min: 50, max: 150, step: 10 },
      q2: { min: 40, max: 140, step: 10 },
      q3: { min: 45, max: 130, step: 10 },
      q4: { min: 55, max: 160, step: 10 },
      rate: { min: 5, max: 15, step: 1 }
    },
    table_generator: (vars) => ({
      type: 'bar-chart',
      title: 'Quarterly Profit (£k)',
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [{
        label: 'Profit (£k)',
        values: [vars.q1, vars.q2, vars.q3, vars.q4]
      }]
    }),
    correct_formula: 'q1 * (1 + rate / 100) + q2',
    distractor_formulas: [
      '(q1 + q2) * (1 + rate / 100)',
      'q1 + q2 + q1 * rate / 100 + q2 * rate / 100',
      'q1 * rate / 100 + q2',
      'q1 + q2'
    ],
    answer_prefix: '£', answer_suffix: 'k', answer_decimals: 1,
    explanation_text: 'Q1 with return = £{q1}k × (1+{rate}%) + £{q2}k = £{answer}k',
    tags: ['bar-chart', 'reinvestment']
  },

  {
    id: 'DI-BAR-006', category: 'DI', sub_category: 'Bar Chart Analysis', difficulty: 2,
    question_text: 'The bar chart shows employee satisfaction scores (out of 10) by department. What is the weighted average score given the department sizes shown?',
    variables: {
      nF: { min: 20, max: 50, step: 5 },
      sF: { min: 5, max: 9, step: 1 },
      nS: { min: 30, max: 70, step: 5 },
      sS: { min: 4, max: 8, step: 1 },
      nT: { min: 15, max: 40, step: 5 },
      sT: { min: 6, max: 9, step: 1 }
    },
    table_generator: (vars) => ({
      type: 'bar-chart',
      title: 'Employee Satisfaction by Department',
      labels: ['Finance (' + vars.nF + ' staff)', 'Sales (' + vars.nS + ' staff)', 'Tech (' + vars.nT + ' staff)'],
      datasets: [{
        label: 'Score (/10)',
        values: [vars.sF, vars.sS, vars.sT]
      }]
    }),
    correct_formula: '(nF * sF + nS * sS + nT * sT) / (nF + nS + nT)',
    distractor_formulas: [
      '(sF + sS + sT) / 3',
      '(nF * sF + nS * sS + nT * sT) / 3',
      'Math.max(sF, sS, sT)',
      '(sF + sS + sT) / 3 + 0.5'
    ],
    answer_suffix: '/10', answer_decimals: 1,
    explanation_text: 'Weighted avg = ({nF}×{sF} + {nS}×{sS} + {nT}×{sT}) / ({nF}+{nS}+{nT}) = {answer}',
    tags: ['bar-chart', 'weighted-average', 'satisfaction']
  },

  {
    id: 'DI-BAR-007', category: 'DI', sub_category: 'Bar Chart Analysis', difficulty: 3,
    question_text: 'The bar chart shows revenue and costs for 3 divisions. If the company needs an overall profit margin of {targetMargin}%, what is the minimum additional revenue needed (assuming costs stay the same)?',
    variables: {
      ra: { min: 30, max: 80, step: 5 },
      ca: { min: 20, max: 60, step: 5 },
      rb: { min: 40, max: 90, step: 5 },
      cb: { min: 30, max: 70, step: 5 },
      rc: { min: 20, max: 60, step: 5 },
      cc: { min: 15, max: 50, step: 5 },
      targetMargin: { min: 15, max: 30, step: 5 }
    },
    table_generator: (vars) => ({
      type: 'bar-chart',
      title: 'Division Revenue & Costs (£m)',
      labels: ['Division A', 'Division B', 'Division C'],
      datasets: [
        { label: 'Revenue (£m)', values: [vars.ra, vars.rb, vars.rc] },
        { label: 'Costs (£m)', values: [vars.ca, vars.cb, vars.cc] }
      ]
    }),
    correct_formula: 'Math.max(0, (ca + cb + cc) / (1 - targetMargin / 100) - (ra + rb + rc))',
    distractor_formulas: [
      '(ca + cb + cc) * targetMargin / 100',
      '(ra + rb + rc) * targetMargin / 100 - (ra + rb + rc - ca - cb - cc)',
      '(ca + cb + cc) / (1 - targetMargin / 100)',
      '(ra + rb + rc) * (1 + targetMargin / 100) - (ra + rb + rc)'
    ],
    answer_prefix: '£', answer_suffix: 'm', answer_decimals: 1,
    explanation_text: 'Total costs = £{ca}m+£{cb}m+£{cc}m. Required revenue for {targetMargin}% margin = total costs / (1−{targetMargin}%). Additional = £{answer}m',
    tags: ['bar-chart', 'target-margin', 'revenue-gap']
  },

  {
    id: 'DI-BAR-008', category: 'DI', sub_category: 'Bar Chart Analysis', difficulty: 3,
    question_text: 'The stacked bar chart shows revenue from 3 product lines. If Product A grew by {gA}%, Product B by {gB}%, and Product C by {gC}%, what was the overall revenue growth?',
    variables: {
      a: { min: 20, max: 60, step: 5 },
      b: { min: 30, max: 70, step: 5 },
      c: { min: 15, max: 50, step: 5 },
      gA: { min: 5, max: 25, step: 1 },
      gB: { min: -5, max: 20, step: 1 },
      gC: { min: 3, max: 30, step: 1 }
    },
    table_generator: (vars) => ({
      type: 'bar-chart',
      title: 'Year 1 Revenue by Product Line (£m)',
      labels: ['Product A', 'Product B', 'Product C'],
      datasets: [{
        label: 'Revenue (£m)',
        values: [vars.a, vars.b, vars.c]
      }]
    }),
    correct_formula: '(a * gA / 100 + b * gB / 100 + c * gC / 100) / (a + b + c) * 100',
    distractor_formulas: [
      '(gA + gB + gC) / 3',
      '(a * gA + b * gB + c * gC) / (a + b + c)',
      'Math.max(gA, gB, gC)',
      '(gA + gB + gC) / 3 + 2'
    ],
    answer_suffix: '%', answer_decimals: 1,
    explanation_text: 'Weighted growth = ({a}×{gA}% + {b}×{gB}% + {c}×{gC}%) / ({a}+{b}+{c}) = {answer}%',
    tags: ['stacked-bar', 'weighted-growth']
  },

  // ═══════════════════════════════════════════════════════════
  // LINE GRAPH TRENDS (7)
  // ═══════════════════════════════════════════════════════════

  {
    id: 'DI-LIN-001', category: 'DI', sub_category: 'Line Graph Trends', difficulty: 1,
    question_text: 'The chart shows a share price over 5 trading days. What was the total percentage change from Day 1 to Day 5?',
    variables: {
      d1: { min: 100, max: 300, step: 10 },
      d2: { min: 95, max: 310, step: 10 },
      d3: { min: 90, max: 320, step: 10 },
      d4: { min: 100, max: 330, step: 10 },
      d5: { min: 105, max: 350, step: 10 }
    },
    table_generator: (vars) => ({
      type: 'bar-chart',
      title: 'Share Price (pence) — 5-Day Trend',
      labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
      datasets: [{
        label: 'Price (p)',
        values: [vars.d1, vars.d2, vars.d3, vars.d4, vars.d5]
      }]
    }),
    correct_formula: '(d5 - d1) / d1 * 100',
    distractor_formulas: [
      '(d5 - d1) / d5 * 100',
      'd5 - d1',
      '(d5 - d1) / (d1 + d5) * 200',
      '(d5 / d1) * 100'
    ],
    answer_suffix: '%', answer_decimals: 1,
    explanation_text: '({d5}p − {d1}p) / {d1}p × 100 = {answer}%',
    tags: ['line-graph', 'percentage-change', 'share-price']
  },

  {
    id: 'DI-LIN-002', category: 'DI', sub_category: 'Line Graph Trends', difficulty: 1,
    question_text: 'The chart shows monthly website visitors. What was the largest month-on-month increase?',
    variables: {
      jan: { min: 30, max: 60, step: 5 },
      feb: { min: 35, max: 70, step: 5 },
      mar: { min: 40, max: 80, step: 5 },
      apr: { min: 38, max: 85, step: 5 },
      may: { min: 42, max: 95, step: 5 }
    },
    table_generator: (vars) => ({
      type: 'bar-chart',
      title: 'Monthly Website Visitors (thousands)',
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datasets: [{
        label: 'Visitors (k)',
        values: [vars.jan, vars.feb, vars.mar, vars.apr, vars.may]
      }]
    }),
    correct_formula: 'Math.max(feb - jan, mar - feb, apr - mar, may - apr)',
    distractor_formulas: [
      'may - jan',
      'Math.min(feb - jan, mar - feb, apr - mar, may - apr)',
      '(may - jan) / 4',
      '(feb - jan + mar - feb + apr - mar + may - apr) / 4 + 3'
    ],
    answer_suffix: 'k', answer_decimals: 0,
    explanation_text: 'Monthly increases: Feb-Jan = {feb}-{jan}, Mar-Feb = {mar}-{feb}, Apr-Mar = {apr}-{mar}, May-Apr = {may}-{apr}. Largest = {answer}k',
    tags: ['line-graph', 'month-on-month', 'traffic']
  },

  {
    id: 'DI-LIN-003', category: 'DI', sub_category: 'Line Graph Trends', difficulty: 1,
    question_text: 'The chart shows Company A and Company B revenue over 3 years. In which year was the gap between them the smallest (in £m)?',
    variables: {
      a1: { min: 50, max: 150, step: 10 },
      b1: { min: 40, max: 140, step: 10 },
      a2: { min: 60, max: 160, step: 10 },
      b2: { min: 55, max: 155, step: 10 },
      a3: { min: 70, max: 180, step: 10 },
      b3: { min: 65, max: 175, step: 10 }
    },
    table_generator: (vars) => ({
      type: 'bar-chart',
      title: 'Revenue Comparison (£m)',
      labels: ['Year 1', 'Year 2', 'Year 3'],
      datasets: [
        { label: 'Company A (£m)', values: [vars.a1, vars.a2, vars.a3] },
        { label: 'Company B (£m)', values: [vars.b1, vars.b2, vars.b3] }
      ]
    }),
    correct_formula: 'Math.min(Math.abs(a1-b1), Math.abs(a2-b2), Math.abs(a3-b3))',
    distractor_formulas: [
      'Math.max(Math.abs(a1-b1), Math.abs(a2-b2), Math.abs(a3-b3))',
      'Math.abs(a3-b3)',
      '(Math.abs(a1-b1) + Math.abs(a2-b2) + Math.abs(a3-b3)) / 3',
      'Math.min(a1,a2,a3) - Math.min(b1,b2,b3)'
    ],
    answer_prefix: '£', answer_suffix: 'm', answer_decimals: 0,
    explanation_text: 'Gaps: Y1 = |{a1}-{b1}|, Y2 = |{a2}-{b2}|, Y3 = |{a3}-{b3}|. Smallest = £{answer}m',
    tags: ['line-graph', 'comparison', 'gap-analysis']
  },

  {
    id: 'DI-LIN-004', category: 'DI', sub_category: 'Line Graph Trends', difficulty: 2,
    question_text: 'The chart shows quarterly GDP growth rates. What is the cumulative growth over the 4 quarters?',
    variables: {
      g1: { min: 1, max: 5, step: 1 },
      g2: { min: -2, max: 4, step: 1 },
      g3: { min: 1, max: 6, step: 1 },
      g4: { min: -1, max: 5, step: 1 }
    },
    table_generator: (vars) => ({
      type: 'bar-chart',
      title: 'Quarterly GDP Growth Rate (%)',
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [{
        label: 'Growth (%)',
        values: [vars.g1, vars.g2, vars.g3, vars.g4]
      }]
    }),
    correct_formula: '((1+g1/100)*(1+g2/100)*(1+g3/100)*(1+g4/100) - 1) * 100',
    distractor_formulas: [
      'g1 + g2 + g3 + g4',
      '(g1 + g2 + g3 + g4) / 4',
      '(1+g1/100)*(1+g2/100)*(1+g3/100)*(1+g4/100) * 100',
      'g1 + g2 + g3 + g4 + 1'
    ],
    answer_suffix: '%', answer_decimals: 2,
    explanation_text: 'Cumulative = (1+{g1}%)(1+{g2}%)(1+{g3}%)(1+{g4}%) − 1 = {answer}%',
    tags: ['line-graph', 'cumulative-growth', 'gdp']
  },

  {
    id: 'DI-LIN-005', category: 'DI', sub_category: 'Line Graph Trends', difficulty: 2,
    question_text: 'The chart shows a company\'s market share over 6 months. If the total market is worth £{market}m, what was the change in the company\'s revenue from Month 1 ({ms1}% share) to Month 6 ({ms6}% share)?',
    variables: {
      market: { min: 500, max: 2000, step: 100 },
      ms1: { min: 5, max: 15, step: 1 },
      ms6: { min: 8, max: 20, step: 1 }
    },
    table_generator: (vars) => ({
      type: 'bar-chart',
      title: 'Market Share Trend (%)',
      labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'],
      datasets: [{
        label: 'Market Share (%)',
        values: [
          vars.ms1,
          Math.round(vars.ms1 + (vars.ms6 - vars.ms1) * 0.2),
          Math.round(vars.ms1 + (vars.ms6 - vars.ms1) * 0.4),
          Math.round(vars.ms1 + (vars.ms6 - vars.ms1) * 0.6),
          Math.round(vars.ms1 + (vars.ms6 - vars.ms1) * 0.8),
          vars.ms6
        ]
      }]
    }),
    correct_formula: 'market * (ms6 - ms1) / 100',
    distractor_formulas: [
      '(ms6 - ms1) * market / 10',
      'market * ms6 / 100',
      'market * ms6 / 100 - market * ms1 / 100 + 10',
      '(ms6 / ms1 - 1) * market'
    ],
    answer_prefix: '£', answer_suffix: 'm', answer_decimals: 1,
    explanation_text: 'Revenue change = £{market}m × ({ms6}% − {ms1}%) = £{answer}m',
    tags: ['line-graph', 'market-share', 'revenue-change']
  },

  {
    id: 'DI-LIN-006', category: 'DI', sub_category: 'Line Graph Trends', difficulty: 3,
    question_text: 'A dual-axis chart shows revenue and profit margin. If revenue was £{rev}m with a {margin}% margin in Q1, and revenue grew by {revG}% while margin fell by {mDrop} percentage points in Q2, what was Q2 profit?',
    variables: {
      rev: { min: 50, max: 200, step: 10 },
      margin: { min: 15, max: 30, step: 1 },
      revG: { min: 5, max: 20, step: 1 },
      mDrop: { min: 2, max: 8, step: 1 }
    },
    table_generator: (vars) => ({
      type: 'bar-chart',
      title: 'Revenue (£m) & Profit Margin (%)',
      labels: ['Q1', 'Q2'],
      datasets: [
        { label: 'Revenue (£m)', values: [vars.rev, Math.round(vars.rev * (1 + vars.revG / 100) * 10) / 10] },
        { label: 'Margin (%)', values: [vars.margin, vars.margin - vars.mDrop] }
      ]
    }),
    correct_formula: 'rev * (1 + revG / 100) * (margin - mDrop) / 100',
    distractor_formulas: [
      'rev * (1 + revG / 100) * margin / 100',
      'rev * margin / 100 * (1 + revG / 100 - mDrop / 100)',
      'rev * (margin - mDrop) / 100',
      'rev * (1 + revG / 100) * (margin - mDrop) / 100 + rev * mDrop / 100'
    ],
    answer_prefix: '£', answer_suffix: 'm', answer_decimals: 1,
    explanation_text: 'Q2 revenue = £{rev}m × (1+{revG}%). Q2 margin = {margin}% − {mDrop}pp. Q2 profit = £{answer}m',
    tags: ['dual-axis', 'revenue-margin', 'profit']
  },

  {
    id: 'DI-LIN-007', category: 'DI', sub_category: 'Line Graph Trends', difficulty: 3,
    question_text: 'The chart shows an index starting at 100. After changes of {c1}%, {c2}%, {c3}%, and {c4}% over 4 periods, what is the final index value?',
    variables: {
      c1: { min: -10, max: 15, step: 1 },
      c2: { min: -8, max: 12, step: 1 },
      c3: { min: -5, max: 10, step: 1 },
      c4: { min: -12, max: 15, step: 1 }
    },
    table_generator: (vars) => {
      var v1 = 100 * (1 + vars.c1 / 100);
      var v2 = v1 * (1 + vars.c2 / 100);
      var v3 = v2 * (1 + vars.c3 / 100);
      var v4 = v3 * (1 + vars.c4 / 100);
      return {
        type: 'bar-chart',
        title: 'Index Value Over 4 Periods',
        labels: ['Start', 'Period 1', 'Period 2', 'Period 3', 'Period 4'],
        datasets: [{
          label: 'Index',
          values: [100, Math.round(v1 * 10) / 10, Math.round(v2 * 10) / 10, Math.round(v3 * 10) / 10, Math.round(v4 * 10) / 10]
        }]
      };
    },
    correct_formula: '100 * (1 + c1/100) * (1 + c2/100) * (1 + c3/100) * (1 + c4/100)',
    distractor_formulas: [
      '100 + c1 + c2 + c3 + c4',
      '100 * (1 + (c1+c2+c3+c4)/100)',
      '100 * (1 + c1/100) * (1 + c4/100)',
      '100 * (1 + (c1+c2+c3+c4)/400)'
    ],
    answer_decimals: 1,
    explanation_text: '100 × (1+{c1}%) × (1+{c2}%) × (1+{c3}%) × (1+{c4}%) = {answer}',
    tags: ['index', 'compound-changes']
  },

  // ═══════════════════════════════════════════════════════════
  // PIE CHART CALCULATIONS (7)
  // ═══════════════════════════════════════════════════════════

  {
    id: 'DI-PIE-001', category: 'DI', sub_category: 'Pie Chart Calculations', difficulty: 1,
    question_text: 'The pie chart shows market share. If the total market is worth £{market}m and Company X has {share}% share, what is Company X\'s revenue?',
    variables: {
      market: { min: 500, max: 3000, step: 100 },
      share: { min: 5, max: 25, step: 1 }
    },
    table_generator: (vars) => ({
      type: 'pie-chart',
      title: 'Market Share (%)',
      segments: [
        { label: 'Company X', value: vars.share },
        { label: 'Company Y', value: Math.round((100 - vars.share) * 0.4) },
        { label: 'Company Z', value: Math.round((100 - vars.share) * 0.35) },
        { label: 'Others', value: 100 - vars.share - Math.round((100 - vars.share) * 0.4) - Math.round((100 - vars.share) * 0.35) }
      ]
    }),
    correct_formula: 'market * share / 100',
    distractor_formulas: [
      'market / share',
      'market * share',
      'market / share * 100',
      'market * share / 100 + market * 0.01'
    ],
    answer_prefix: '£', answer_suffix: 'm', answer_decimals: 1,
    explanation_text: '£{market}m × {share}% = £{answer}m',
    tags: ['pie-chart', 'market-share', 'revenue']
  },

  {
    id: 'DI-PIE-002', category: 'DI', sub_category: 'Pie Chart Calculations', difficulty: 1,
    question_text: 'The pie chart shows expense categories. If total expenses are £{total}k and Rent is {rent}%, Salaries {sal}%, and Marketing {mkt}%, how much is spent on \'Other\'?',
    variables: {
      total: { min: 200, max: 800, step: 50 },
      rent: { min: 15, max: 30, step: 1 },
      sal: { min: 30, max: 50, step: 1 },
      mkt: { min: 10, max: 20, step: 1 }
    },
    table_generator: (vars) => ({
      type: 'pie-chart',
      title: 'Expense Breakdown (%)',
      segments: [
        { label: 'Rent', value: vars.rent },
        { label: 'Salaries', value: vars.sal },
        { label: 'Marketing', value: vars.mkt },
        { label: 'Other', value: 100 - vars.rent - vars.sal - vars.mkt }
      ]
    }),
    correct_formula: 'total * (100 - rent - sal - mkt) / 100',
    distractor_formulas: [
      'total * (rent + sal + mkt) / 100',
      'total - rent - sal - mkt',
      'total * (100 - rent - sal) / 100',
      'total / (100 - rent - sal - mkt) * 100'
    ],
    answer_prefix: '£', answer_suffix: 'k', answer_decimals: 1,
    explanation_text: 'Other = £{total}k × (100% − {rent}% − {sal}% − {mkt}%) = £{answer}k',
    tags: ['pie-chart', 'expenses', 'remainder']
  },

  {
    id: 'DI-PIE-003', category: 'DI', sub_category: 'Pie Chart Calculations', difficulty: 1,
    question_text: 'Two pie charts show revenue split in Year 1 (total £{t1}m) and Year 2 (total £{t2}m). Product A was {a1}% in Year 1 and {a2}% in Year 2. What was the absolute change in Product A revenue?',
    variables: {
      t1: { min: 100, max: 400, step: 50 },
      t2: { min: 120, max: 500, step: 50 },
      a1: { min: 20, max: 40, step: 5 },
      a2: { min: 15, max: 45, step: 5 }
    },
    table_generator: (vars) => ({
      type: 'pie-chart',
      title: 'Revenue Split — Year 1: £' + vars.t1 + 'm / Year 2: £' + vars.t2 + 'm',
      segments: [
        { label: 'Product A (Y1: ' + vars.a1 + '%, Y2: ' + vars.a2 + '%)', value: vars.a2 },
        { label: 'Product B', value: Math.round((100 - vars.a2) * 0.45) },
        { label: 'Product C', value: 100 - vars.a2 - Math.round((100 - vars.a2) * 0.45) }
      ]
    }),
    correct_formula: 't2 * a2 / 100 - t1 * a1 / 100',
    distractor_formulas: [
      '(a2 - a1) / 100 * t2',
      '(t2 - t1) * a1 / 100',
      't2 * a2 / 100',
      '(a2 - a1) / 100 * (t1 + t2) / 2'
    ],
    answer_prefix: '£', answer_suffix: 'm', answer_decimals: 1,
    explanation_text: 'Y1: £{t1}m × {a1}%. Y2: £{t2}m × {a2}%. Change = £{answer}m',
    tags: ['pie-chart', 'year-comparison', 'absolute-change']
  },

  {
    id: 'DI-PIE-004', category: 'DI', sub_category: 'Pie Chart Calculations', difficulty: 2,
    question_text: 'The pie chart shows the degree breakdown of a budget. If Salaries occupy {degrees}° of the pie and the total budget is £{budget}k, how much is the salary budget?',
    variables: {
      degrees: { min: 90, max: 180, step: 10 },
      budget: { min: 200, max: 800, step: 50 }
    },
    table_generator: (vars) => ({
      type: 'pie-chart',
      title: 'Budget Allocation (Total: £' + vars.budget + 'k)',
      segments: [
        { label: 'Salaries (' + vars.degrees + '°)', value: Math.round(vars.degrees / 360 * 100) },
        { label: 'Rent', value: Math.round((360 - vars.degrees) * 0.35 / 360 * 100) },
        { label: 'Operations', value: Math.round((360 - vars.degrees) * 0.4 / 360 * 100) },
        { label: 'Other', value: 100 - Math.round(vars.degrees / 360 * 100) - Math.round((360 - vars.degrees) * 0.35 / 360 * 100) - Math.round((360 - vars.degrees) * 0.4 / 360 * 100) }
      ]
    }),
    correct_formula: 'budget * degrees / 360',
    distractor_formulas: [
      'budget * degrees / 100',
      'budget / 360 * (360 - degrees)',
      'budget * degrees / 180',
      'budget / degrees * 360'
    ],
    answer_prefix: '£', answer_suffix: 'k', answer_decimals: 1,
    explanation_text: '£{budget}k × {degrees}°/360° = £{answer}k',
    tags: ['pie-chart', 'degrees', 'budget']
  },

  {
    id: 'DI-PIE-005', category: 'DI', sub_category: 'Pie Chart Calculations', difficulty: 2,
    question_text: 'The pie chart shows client revenue distribution. The top 3 clients account for {top3}% of total revenue (£{total}m). If Client 1 has twice the revenue of Client 2, and Client 2 has {ratio} times the revenue of Client 3, what is Client 1\'s revenue?',
    variables: {
      total: { min: 50, max: 200, step: 10 },
      top3: { min: 40, max: 70, step: 5 },
      ratio: { min: 2, max: 3, step: 1 }
    },
    table_generator: (vars) => {
      var top3Val = vars.total * vars.top3 / 100;
      var denom = 2 * vars.ratio + vars.ratio + 1;
      var c3 = top3Val / denom;
      var c2 = c3 * vars.ratio;
      var c1 = c2 * 2;
      return {
        type: 'pie-chart',
        title: 'Client Revenue Distribution (Total: £' + vars.total + 'm)',
        segments: [
          { label: 'Client 1', value: Math.round(c1 / vars.total * 100) },
          { label: 'Client 2', value: Math.round(c2 / vars.total * 100) },
          { label: 'Client 3', value: Math.round(c3 / vars.total * 100) },
          { label: 'Other Clients', value: 100 - vars.top3 }
        ]
      };
    },
    correct_formula: 'total * top3 / 100 * 2 * ratio / (2 * ratio + ratio + 1)',
    distractor_formulas: [
      'total * top3 / 100 / 3',
      'total * top3 / 100 * 2 / 3',
      'total * top3 / 100 / (1 + ratio + 2 * ratio) * 2',
      'total * top3 / 100 * 2 * ratio / (2 * ratio + ratio + 1) + 5'
    ],
    answer_prefix: '£', answer_suffix: 'm', answer_decimals: 1,
    explanation_text: 'Top 3 = £{total}m × {top3}%. Ratio C1:C2:C3 = 2×{ratio}:{ratio}:1. Client 1 = £{answer}m',
    tags: ['pie-chart', 'client-concentration']
  },

  {
    id: 'DI-PIE-006', category: 'DI', sub_category: 'Pie Chart Calculations', difficulty: 3,
    question_text: 'The pie chart shows that {pctA}% of a £{total}m fund is in equities. If equities return {retE}% and the rest of the fund returns {retR}%, what is the total fund value after one year?',
    variables: {
      total: { min: 50, max: 300, step: 25 },
      pctA: { min: 40, max: 70, step: 5 },
      retE: { min: 5, max: 20, step: 1 },
      retR: { min: 2, max: 8, step: 1 }
    },
    table_generator: (vars) => ({
      type: 'pie-chart',
      title: 'Fund Allocation (£' + vars.total + 'm)',
      segments: [
        { label: 'Equities', value: vars.pctA },
        { label: 'Bonds', value: Math.round((100 - vars.pctA) * 0.6) },
        { label: 'Cash', value: 100 - vars.pctA - Math.round((100 - vars.pctA) * 0.6) }
      ]
    }),
    correct_formula: 'total * pctA / 100 * (1 + retE / 100) + total * (100 - pctA) / 100 * (1 + retR / 100)',
    distractor_formulas: [
      'total * (1 + (pctA * retE + (100 - pctA) * retR) / 10000) + 5',
      'total * (1 + retE / 100)',
      'total * (1 + (retE + retR) / 200)',
      'total + total * retE / 100'
    ],
    answer_prefix: '£', answer_suffix: 'm', answer_decimals: 1,
    explanation_text: 'Equities: £{total}m × {pctA}% × (1+{retE}%). Rest: £{total}m × (100−{pctA})% × (1+{retR}%). Total = £{answer}m',
    tags: ['pie-chart', 'portfolio-return']
  },

  {
    id: 'DI-PIE-007', category: 'DI', sub_category: 'Pie Chart Calculations', difficulty: 3,
    question_text: 'The pie chart shows cost allocation. If total costs increase by {inc}% but the Salaries portion ({salPct}%) increases by {salInc}%, what percentage of the new total do Salaries represent?',
    variables: {
      inc: { min: 5, max: 15, step: 1 },
      salPct: { min: 30, max: 50, step: 5 },
      salInc: { min: 8, max: 25, step: 1 }
    },
    table_generator: (vars) => ({
      type: 'pie-chart',
      title: 'Current Cost Allocation (%)',
      segments: [
        { label: 'Salaries', value: vars.salPct },
        { label: 'Rent', value: Math.round((100 - vars.salPct) * 0.3) },
        { label: 'Materials', value: Math.round((100 - vars.salPct) * 0.4) },
        { label: 'Other', value: 100 - vars.salPct - Math.round((100 - vars.salPct) * 0.3) - Math.round((100 - vars.salPct) * 0.4) }
      ]
    }),
    correct_formula: 'salPct * (1 + salInc / 100) / (100 * (1 + inc / 100)) * 100',
    distractor_formulas: [
      'salPct + salInc - inc',
      'salPct * (1 + salInc / 100) / 100 * 100',
      'salPct * salInc / inc',
      'salPct + (salInc - inc)'
    ],
    answer_suffix: '%', answer_decimals: 1,
    explanation_text: 'New salaries share = {salPct}% × (1+{salInc}%) / (100% × (1+{inc}%)) × 100 = {answer}%',
    tags: ['pie-chart', 'changing-proportions']
  },

  // ═══════════════════════════════════════════════════════════
  // MULTI-SOURCE INTEGRATION (8)
  // ═══════════════════════════════════════════════════════════

  {
    id: 'DI-MSI-001', category: 'DI', sub_category: 'Multi-Source Integration', difficulty: 1,
    question_text: 'A table shows revenue by region and a pie chart shows the cost split. If total revenue is £{rev}m and total costs are {costPct}% of revenue, with {regionPct}% of costs allocated to the UK region, what is the UK region\'s cost?',
    variables: {
      rev: { min: 100, max: 500, step: 50 },
      costPct: { min: 60, max: 85, step: 5 },
      regionPct: { min: 25, max: 50, step: 5 }
    },
    table_generator: (vars) => ({
      type: 'table',
      title: 'Revenue & Cost Allocation',
      headers: ['Metric', 'Value'],
      rows: [
        ['Total Revenue', '£' + vars.rev + 'm'],
        ['Total Costs (% of Revenue)', vars.costPct + '%'],
        ['UK Region Cost Allocation', vars.regionPct + '%'],
        ['EU Region Cost Allocation', (100 - vars.regionPct) + '%']
      ]
    }),
    correct_formula: 'rev * costPct / 100 * regionPct / 100',
    distractor_formulas: [
      'rev * regionPct / 100',
      'rev * costPct / 100',
      'rev * (costPct + regionPct) / 100',
      'rev * costPct * regionPct / 10000 + 5'
    ],
    answer_prefix: '£', answer_suffix: 'm', answer_decimals: 1,
    explanation_text: 'Total costs = £{rev}m × {costPct}%. UK costs = total costs × {regionPct}% = £{answer}m',
    tags: ['multi-source', 'cost-allocation']
  },

  {
    id: 'DI-MSI-002', category: 'DI', sub_category: 'Multi-Source Integration', difficulty: 2,
    question_text: 'A bar chart shows units sold and a table shows unit prices. What is the total revenue from Products A and B combined?',
    variables: {
      unitsA: { min: 100, max: 500, step: 50 },
      priceA: { min: 10, max: 50, step: 5 },
      unitsB: { min: 200, max: 600, step: 50 },
      priceB: { min: 15, max: 60, step: 5 },
      unitsC: { min: 50, max: 300, step: 50 },
      priceC: { min: 20, max: 80, step: 10 }
    },
    table_generator: (vars) => ({
      type: 'table',
      title: 'Product Sales Data',
      headers: ['Product', 'Units Sold', 'Unit Price (£)'],
      rows: [
        ['Product A', vars.unitsA, '£' + vars.priceA],
        ['Product B', vars.unitsB, '£' + vars.priceB],
        ['Product C', vars.unitsC, '£' + vars.priceC]
      ]
    }),
    correct_formula: 'unitsA * priceA + unitsB * priceB',
    distractor_formulas: [
      'unitsA * priceA + unitsB * priceB + unitsC * priceC',
      '(unitsA + unitsB) * (priceA + priceB) / 2',
      'unitsA * priceB + unitsB * priceA',
      '(unitsA * priceA + unitsB * priceB) * 1.1'
    ],
    answer_prefix: '£', answer_decimals: 0,
    explanation_text: 'A: {unitsA} × £{priceA} = £{unitsA}×{priceA}. B: {unitsB} × £{priceB}. Total = £{answer}',
    tags: ['multi-source', 'revenue-calculation']
  },

  {
    id: 'DI-MSI-003', category: 'DI', sub_category: 'Multi-Source Integration', difficulty: 2,
    question_text: 'A line graph shows monthly revenue growth of {growth}% per month. A table shows January revenue was £{jan}k. What is the projected March revenue?',
    variables: {
      jan: { min: 50, max: 200, step: 10 },
      growth: { min: 3, max: 12, step: 1 }
    },
    table_generator: (vars) => ({
      type: 'table',
      title: 'Revenue Projection Data',
      headers: ['Month', 'Revenue (£k)', 'Growth Rate'],
      rows: [
        ['January', '£' + vars.jan + 'k', '—'],
        ['February', '?', vars.growth + '% m-o-m'],
        ['March', '?', vars.growth + '% m-o-m']
      ]
    }),
    correct_formula: 'jan * Math.pow(1 + growth / 100, 2)',
    distractor_formulas: [
      'jan * (1 + growth / 100 * 2)',
      'jan + jan * growth / 100 * 2',
      'jan * (1 + growth / 100) + jan * growth / 100',
      'jan * Math.pow(1 + growth / 100, 3)'
    ],
    answer_prefix: '£', answer_suffix: 'k', answer_decimals: 1,
    explanation_text: 'Feb = £{jan}k × (1+{growth}%). Mar = Feb × (1+{growth}%) = £{answer}k',
    tags: ['multi-source', 'projection']
  },

  {
    id: 'DI-MSI-004', category: 'DI', sub_category: 'Multi-Source Integration', difficulty: 3,
    question_text: 'A table shows headcount by grade and a bar chart shows average salary by grade. What is the total salary bill?',
    variables: {
      nJ: { min: 20, max: 50, step: 5 },
      sJ: { min: 25, max: 35, step: 1 },
      nM: { min: 15, max: 35, step: 5 },
      sM: { min: 40, max: 55, step: 1 },
      nS: { min: 5, max: 20, step: 5 },
      sS: { min: 60, max: 85, step: 5 }
    },
    table_generator: (vars) => ({
      type: 'table',
      title: 'Headcount & Average Salary by Grade',
      headers: ['Grade', 'Headcount', 'Avg Salary (£k)'],
      rows: [
        ['Junior', vars.nJ, '£' + vars.sJ + 'k'],
        ['Mid-Level', vars.nM, '£' + vars.sM + 'k'],
        ['Senior', vars.nS, '£' + vars.sS + 'k']
      ]
    }),
    correct_formula: 'nJ * sJ + nM * sM + nS * sS',
    distractor_formulas: [
      '(nJ + nM + nS) * (sJ + sM + sS) / 3',
      'nJ * sJ + nM * sM',
      '(sJ + sM + sS) / 3 * (nJ + nM + nS)',
      'nJ * sJ + nM * sM + nS * sS + 100'
    ],
    answer_prefix: '£', answer_suffix: 'k', answer_decimals: 0,
    explanation_text: 'Total = {nJ}×£{sJ}k + {nM}×£{sM}k + {nS}×£{sS}k = £{answer}k',
    tags: ['multi-source', 'salary-bill']
  },

  {
    id: 'DI-MSI-005', category: 'DI', sub_category: 'Multi-Source Integration', difficulty: 3,
    question_text: 'A pie chart shows market share and a line graph shows total market size growing at {growth}% per year from £{market}m. If Company X has {share}% market share, what will its revenue be in 2 years?',
    variables: {
      market: { min: 500, max: 2000, step: 100 },
      growth: { min: 3, max: 10, step: 1 },
      share: { min: 5, max: 20, step: 1 }
    },
    table_generator: (vars) => ({
      type: 'table',
      title: 'Market Data & Projections',
      headers: ['Metric', 'Value'],
      rows: [
        ['Current Market Size', '£' + vars.market + 'm'],
        ['Annual Market Growth', vars.growth + '%'],
        ['Company X Market Share', vars.share + '%'],
        ['Projection Period', '2 years']
      ]
    }),
    correct_formula: 'market * Math.pow(1 + growth / 100, 2) * share / 100',
    distractor_formulas: [
      'market * share / 100 * (1 + growth / 100 * 2)',
      'market * (1 + growth / 100) * share / 100',
      'market * share / 100 + market * growth / 100 * 2',
      'market * Math.pow(1 + growth / 100, 2) * share / 100 * 1.05'
    ],
    answer_prefix: '£', answer_suffix: 'm', answer_decimals: 1,
    explanation_text: 'Market in 2 years = £{market}m × (1+{growth}%)². Company X revenue = market × {share}% = £{answer}m',
    tags: ['multi-source', 'market-projection']
  },

  {
    id: 'DI-MSI-006', category: 'DI', sub_category: 'Multi-Source Integration', difficulty: 2,
    question_text: 'A table shows conversion data by channel. Which channel has the best (lowest) cost per acquisition?',
    variables: {
      spS: { min: 10, max: 50, step: 5 },
      convS: { min: 50, max: 200, step: 10 },
      spR: { min: 20, max: 60, step: 5 },
      convR: { min: 80, max: 300, step: 10 },
      spE: { min: 5, max: 25, step: 5 },
      convE: { min: 30, max: 150, step: 10 }
    },
    table_generator: (vars) => ({
      type: 'table',
      title: 'Marketing Channel Performance',
      headers: ['Channel', 'Spend (£k)', 'Conversions'],
      rows: [
        ['Social Media', vars.spS, vars.convS],
        ['Search Ads', vars.spR, vars.convR],
        ['Email', vars.spE, vars.convE]
      ]
    }),
    correct_formula: 'Math.min(spS * 1000 / convS, spR * 1000 / convR, spE * 1000 / convE)',
    distractor_formulas: [
      'Math.max(spS * 1000 / convS, spR * 1000 / convR, spE * 1000 / convE)',
      '(spS + spR + spE) * 1000 / (convS + convR + convE)',
      'Math.min(spS, spR, spE) * 1000 / Math.max(convS, convR, convE)',
      'Math.min(spS * 1000 / convS, spR * 1000 / convR, spE * 1000 / convE) * 0.9'
    ],
    answer_prefix: '£', answer_decimals: 2,
    explanation_text: 'CPA: Social = £{spS}k×1000/{convS}, Search = £{spR}k×1000/{convR}, Email = £{spE}k×1000/{convE}. Best = £{answer}',
    tags: ['multi-source', 'cpa', 'marketing']
  },

  {
    id: 'DI-MSI-007', category: 'DI', sub_category: 'Multi-Source Integration', difficulty: 3,
    question_text: 'A table shows quarterly revenue and a separate chart shows that {taxRate}% tax is applied to profit. If Q1 revenue is £{rev}m and costs are £{costs}m, what is the after-tax profit?',
    variables: {
      rev: { min: 50, max: 200, step: 10 },
      costs: { min: 30, max: 150, step: 10 },
      taxRate: { min: 19, max: 25, step: 1 }
    },
    table_generator: (vars) => ({
      type: 'table',
      title: 'Q1 Financial Summary',
      headers: ['Item', 'Amount (£m)'],
      rows: [
        ['Revenue', vars.rev],
        ['Costs', vars.costs],
        ['Pre-Tax Profit', vars.rev - vars.costs],
        ['Corporation Tax Rate', vars.taxRate + '%']
      ]
    }),
    correct_formula: '(rev - costs) * (1 - taxRate / 100)',
    distractor_formulas: [
      '(rev - costs) * taxRate / 100',
      'rev * (1 - taxRate / 100) - costs',
      '(rev - costs) * (1 + taxRate / 100)',
      'rev * (1 - taxRate / 100)'
    ],
    answer_prefix: '£', answer_suffix: 'm', answer_decimals: 1,
    explanation_text: 'Profit = £{rev}m − £{costs}m. After tax = profit × (1−{taxRate}%) = £{answer}m',
    tags: ['multi-source', 'tax', 'after-tax-profit']
  },

  {
    id: 'DI-MSI-008', category: 'DI', sub_category: 'Multi-Source Integration', difficulty: 3,
    question_text: 'A bar chart shows production volumes and a table shows defect rates. If Product A has {defA}% defect rate on {volA} units and Product B has {defB}% on {volB} units, what is the overall defect rate?',
    variables: {
      volA: { min: 1000, max: 5000, step: 500 },
      defA: { min: 1, max: 5, step: 1 },
      volB: { min: 2000, max: 8000, step: 500 },
      defB: { min: 2, max: 7, step: 1 }
    },
    table_generator: (vars) => ({
      type: 'table',
      title: 'Production & Quality Data',
      headers: ['Product', 'Volume (units)', 'Defect Rate (%)'],
      rows: [
        ['Product A', vars.volA, vars.defA + '%'],
        ['Product B', vars.volB, vars.defB + '%'],
        ['Total', vars.volA + vars.volB, '?']
      ]
    }),
    correct_formula: '(volA * defA / 100 + volB * defB / 100) / (volA + volB) * 100',
    distractor_formulas: [
      '(defA + defB) / 2',
      '(volA * defA + volB * defB) / (volA + volB)',
      'defA * volA / (volA + volB) + defB',
      '(volA * defA / 100 + volB * defB / 100) / (volA + volB) * 100 + 1'
    ],
    answer_suffix: '%', answer_decimals: 2,
    explanation_text: 'Defects: A = {volA}×{defA}%, B = {volB}×{defB}%. Overall = total defects / ({volA}+{volB}) × 100 = {answer}%',
    tags: ['multi-source', 'defect-rate', 'weighted']
  },

  // ═══════════════════════════════════════════════════════════
  // FINANCIAL STATEMENT ANALYSIS (8)
  // ═══════════════════════════════════════════════════════════

  {
    id: 'DI-FIN-001', category: 'DI', sub_category: 'Financial Statement Analysis', difficulty: 1,
    question_text: 'From the income statement below: what is the operating profit margin?',
    variables: {
      rev: { min: 100, max: 500, step: 25 },
      cogs: { min: 40, max: 250, step: 15 },
      opex: { min: 20, max: 100, step: 10 }
    },
    table_generator: (vars) => ({
      type: 'table',
      title: 'Income Statement Extract (£m)',
      headers: ['Line Item', 'Amount (£m)'],
      rows: [
        ['Revenue', vars.rev],
        ['Cost of Goods Sold', vars.cogs],
        ['Gross Profit', vars.rev - vars.cogs],
        ['Operating Expenses', vars.opex],
        ['Operating Profit', vars.rev - vars.cogs - vars.opex]
      ]
    }),
    correct_formula: '(rev - cogs - opex) / rev * 100',
    distractor_formulas: [
      '(rev - cogs) / rev * 100',
      '(rev - opex) / rev * 100',
      '(cogs + opex) / rev * 100',
      '(rev - cogs - opex) / (cogs + opex) * 100'
    ],
    answer_suffix: '%', answer_decimals: 1,
    explanation_text: 'Operating profit = £{rev}m − £{cogs}m − £{opex}m. Margin = operating profit / £{rev}m × 100 = {answer}%',
    tags: ['income-statement', 'operating-margin']
  },

  {
    id: 'DI-FIN-002', category: 'DI', sub_category: 'Financial Statement Analysis', difficulty: 2,
    question_text: 'The balance sheet shows Total Assets of £{assets}m and Total Liabilities of £{liab}m. What is the debt-to-equity ratio?',
    variables: {
      assets: { min: 200, max: 800, step: 50 },
      liab: { min: 80, max: 500, step: 25 }
    },
    table_generator: (vars) => ({
      type: 'table',
      title: 'Balance Sheet Summary (£m)',
      headers: ['Item', 'Amount (£m)'],
      rows: [
        ['Total Assets', vars.assets],
        ['Total Liabilities', vars.liab],
        ['Shareholders\' Equity', vars.assets - vars.liab]
      ]
    }),
    correct_formula: 'liab / (assets - liab)',
    distractor_formulas: [
      'liab / assets',
      'assets / liab',
      '(assets - liab) / liab',
      '(assets - liab) / assets'
    ],
    answer_decimals: 2,
    explanation_text: 'Equity = £{assets}m − £{liab}m. D/E = £{liab}m / equity = {answer}',
    tags: ['balance-sheet', 'debt-to-equity']
  },

  {
    id: 'DI-FIN-003', category: 'DI', sub_category: 'Financial Statement Analysis', difficulty: 2,
    question_text: 'Revenue is £{rev}m, Gross Profit is £{gp}m, and Net Profit is £{np}m. What is the ratio of operating expenses to gross profit?',
    variables: {
      rev: { min: 100, max: 400, step: 25 },
      gp: { min: 40, max: 200, step: 15 },
      np: { min: 10, max: 80, step: 10 }
    },
    table_generator: (vars) => ({
      type: 'table',
      title: 'Profit & Loss Summary (£m)',
      headers: ['Line Item', 'Amount (£m)'],
      rows: [
        ['Revenue', vars.rev],
        ['Gross Profit', vars.gp],
        ['Operating Expenses', vars.gp - vars.np],
        ['Net Profit', vars.np]
      ]
    }),
    correct_formula: '(gp - np) / gp * 100',
    distractor_formulas: [
      'np / gp * 100',
      '(rev - gp) / rev * 100',
      'gp / rev * 100',
      '(gp - np) / rev * 100'
    ],
    answer_suffix: '%', answer_decimals: 1,
    explanation_text: 'OpEx = £{gp}m − £{np}m. OpEx/GP = (£{gp}m−£{np}m) / £{gp}m × 100 = {answer}%',
    tags: ['income-statement', 'opex-ratio']
  },

  {
    id: 'DI-FIN-004', category: 'DI', sub_category: 'Financial Statement Analysis', difficulty: 2,
    question_text: 'A company has {shares}m shares outstanding and net profit of £{np}m. If the share price is £{price}, what is the P/E ratio?',
    variables: {
      shares: { min: 50, max: 200, step: 10 },
      np: { min: 20, max: 100, step: 10 },
      price: { min: 5, max: 30, step: 1 }
    },
    table_generator: (vars) => ({
      type: 'table',
      title: 'Company Valuation Data',
      headers: ['Metric', 'Value'],
      rows: [
        ['Net Profit', '£' + vars.np + 'm'],
        ['Shares Outstanding', vars.shares + 'm'],
        ['EPS', '£' + (Math.round(vars.np / vars.shares * 100) / 100)],
        ['Share Price', '£' + vars.price]
      ]
    }),
    correct_formula: 'price / (np / shares)',
    distractor_formulas: [
      'np / shares / price',
      'price * shares / np',
      'np / (price * shares)',
      'price / np * shares + 1'
    ],
    answer_decimals: 1,
    explanation_text: 'EPS = £{np}m / {shares}m. P/E = £{price} / EPS = {answer}',
    tags: ['valuation', 'pe-ratio']
  },

  {
    id: 'DI-FIN-005', category: 'DI', sub_category: 'Financial Statement Analysis', difficulty: 2,
    question_text: 'From the cash flow statement: Operating Cash Flow £{ocf}m, Capital Expenditure £{capex}m. If the company pays {divPct}% of Free Cash Flow as dividends, what is the dividend per share with {shares}m shares?',
    variables: {
      ocf: { min: 50, max: 200, step: 10 },
      capex: { min: 15, max: 80, step: 5 },
      divPct: { min: 30, max: 60, step: 5 },
      shares: { min: 50, max: 200, step: 10 }
    },
    table_generator: (vars) => ({
      type: 'table',
      title: 'Cash Flow Statement Extract (£m)',
      headers: ['Item', 'Amount (£m)'],
      rows: [
        ['Operating Cash Flow', vars.ocf],
        ['Capital Expenditure', vars.capex],
        ['Free Cash Flow', vars.ocf - vars.capex],
        ['Dividend Payout Ratio', vars.divPct + '%'],
        ['Shares Outstanding', vars.shares + 'm']
      ]
    }),
    correct_formula: '(ocf - capex) * divPct / 100 / shares',
    distractor_formulas: [
      'ocf * divPct / 100 / shares',
      '(ocf - capex) / shares',
      '(ocf - capex) * divPct / 100',
      'ocf / shares * divPct / 100'
    ],
    answer_prefix: '£', answer_decimals: 2,
    explanation_text: 'FCF = £{ocf}m − £{capex}m. Dividends = FCF × {divPct}%. DPS = dividends / {shares}m = £{answer}',
    tags: ['cash-flow', 'dividend', 'fcf']
  },

  {
    id: 'DI-FIN-006', category: 'DI', sub_category: 'Financial Statement Analysis', difficulty: 3,
    question_text: 'A company\'s Return on Equity (ROE) is {roe}%. If equity is £{equity}m and the company retains {retain}% of earnings, what is the sustainable growth rate?',
    variables: {
      roe: { min: 10, max: 25, step: 1 },
      equity: { min: 100, max: 500, step: 50 },
      retain: { min: 40, max: 80, step: 5 }
    },
    table_generator: (vars) => ({
      type: 'table',
      title: 'Growth & Retention Analysis',
      headers: ['Metric', 'Value'],
      rows: [
        ['Return on Equity (ROE)', vars.roe + '%'],
        ['Shareholders\' Equity', '£' + vars.equity + 'm'],
        ['Net Profit', '£' + (Math.round(vars.equity * vars.roe / 100 * 10) / 10) + 'm'],
        ['Retention Ratio', vars.retain + '%'],
        ['Payout Ratio', (100 - vars.retain) + '%']
      ]
    }),
    correct_formula: 'roe * retain / 100',
    distractor_formulas: [
      'roe * (100 - retain) / 100',
      'equity * roe / 100 * retain / 100',
      'roe + retain',
      'roe / retain * 100'
    ],
    answer_suffix: '%', answer_decimals: 1,
    explanation_text: 'Sustainable growth = ROE × Retention ratio = {roe}% × {retain}% = {answer}%',
    tags: ['roe', 'sustainable-growth']
  },

  {
    id: 'DI-FIN-007', category: 'DI', sub_category: 'Financial Statement Analysis', difficulty: 3,
    question_text: 'Revenue grew from £{rev1}m to £{rev2}m. COGS was {cogsPct}% of revenue in both years. Operating expenses were £{opex1}m in Year 1 and £{opex2}m in Year 2. What was the change in operating profit margin (in percentage points)?',
    variables: {
      rev1: { min: 100, max: 300, step: 25 },
      rev2: { min: 120, max: 400, step: 25 },
      cogsPct: { min: 40, max: 65, step: 5 },
      opex1: { min: 20, max: 60, step: 5 },
      opex2: { min: 25, max: 70, step: 5 }
    },
    table_generator: (vars) => ({
      type: 'table',
      title: 'Year-on-Year Income Statement Comparison (£m)',
      headers: ['Line Item', 'Year 1', 'Year 2'],
      rows: [
        ['Revenue', vars.rev1, vars.rev2],
        ['COGS (' + vars.cogsPct + '% of Rev)', Math.round(vars.rev1 * vars.cogsPct / 100 * 10) / 10, Math.round(vars.rev2 * vars.cogsPct / 100 * 10) / 10],
        ['Gross Profit', Math.round(vars.rev1 * (1 - vars.cogsPct / 100) * 10) / 10, Math.round(vars.rev2 * (1 - vars.cogsPct / 100) * 10) / 10],
        ['Operating Expenses', vars.opex1, vars.opex2]
      ]
    }),
    correct_formula: '(rev2 * (1 - cogsPct/100) - opex2) / rev2 * 100 - (rev1 * (1 - cogsPct/100) - opex1) / rev1 * 100',
    distractor_formulas: [
      '(rev2 - rev1) / rev1 * 100',
      '((rev2 - rev2*cogsPct/100 - opex2) - (rev1 - rev1*cogsPct/100 - opex1)) / rev1 * 100',
      '(opex2 - opex1) / opex1 * 100',
      '(rev2 * (1 - cogsPct/100) - opex2) / rev2 * 100'
    ],
    answer_suffix: ' pp', answer_decimals: 1,
    explanation_text: 'Y1 margin = (£{rev1}m×(1−{cogsPct}%) − £{opex1}m) / £{rev1}m. Y2 similarly. Change = {answer} pp',
    tags: ['income-statement', 'margin-change']
  },

  {
    id: 'DI-FIN-008', category: 'DI', sub_category: 'Financial Statement Analysis', difficulty: 3,
    question_text: 'A company has current assets of £{ca}m and current liabilities of £{cl}m. If inventory is £{inv}m, what is the quick ratio?',
    variables: {
      ca: { min: 50, max: 200, step: 10 },
      cl: { min: 30, max: 120, step: 10 },
      inv: { min: 10, max: 60, step: 5 }
    },
    table_generator: (vars) => ({
      type: 'table',
      title: 'Balance Sheet — Current Items (£m)',
      headers: ['Item', 'Amount (£m)'],
      rows: [
        ['Current Assets', vars.ca],
        ['  of which: Inventory', vars.inv],
        ['  of which: Other Current Assets', vars.ca - vars.inv],
        ['Current Liabilities', vars.cl]
      ]
    }),
    correct_formula: '(ca - inv) / cl',
    distractor_formulas: [
      'ca / cl',
      'ca / (cl - inv)',
      '(ca - inv) / (cl - inv)',
      'inv / cl'
    ],
    answer_decimals: 2,
    explanation_text: 'Quick ratio = (£{ca}m − £{inv}m) / £{cl}m = {answer}',
    tags: ['balance-sheet', 'quick-ratio', 'liquidity']
  },

  // ═══════════════════════════════════════════════════════════
  // WEIGHTED AVERAGES & INDEX (4)
  // ═══════════════════════════════════════════════════════════

  {
    id: 'DI-WGT-001', category: 'DI', sub_category: 'Weighted Averages & Index', difficulty: 1,
    question_text: 'An index tracks 3 stocks. Stock A (weight {wA}%) returned {rA}%, Stock B ({wB}%) returned {rB}%, Stock C ({wC}%) returned {rC}%. What was the index return?',
    variables: {
      wA: { min: 20, max: 50, step: 5 },
      wB: { min: 20, max: 40, step: 5 },
      wC: { min: 10, max: 30, step: 5 },
      rA: { min: -5, max: 20, step: 1 },
      rB: { min: -10, max: 15, step: 1 },
      rC: { min: -8, max: 25, step: 1 }
    },
    table_generator: (vars) => ({
      type: 'table',
      title: 'Index Composition & Returns',
      headers: ['Stock', 'Weight (%)', 'Return (%)'],
      rows: [
        ['Stock A', vars.wA + '%', vars.rA + '%'],
        ['Stock B', vars.wB + '%', vars.rB + '%'],
        ['Stock C', vars.wC + '%', vars.rC + '%']
      ]
    }),
    correct_formula: '(wA * rA + wB * rB + wC * rC) / (wA + wB + wC)',
    distractor_formulas: [
      '(rA + rB + rC) / 3',
      'wA * rA / 100 + wB * rB / 100 + wC * rC / 100',
      'Math.max(rA, rB, rC)',
      '(wA * rA + wB * rB + wC * rC) / 100'
    ],
    answer_suffix: '%', answer_decimals: 1,
    explanation_text: 'Weighted return = ({wA}%×{rA}% + {wB}%×{rB}% + {wC}%×{rC}%) / ({wA}%+{wB}%+{wC}%) = {answer}%',
    tags: ['weighted-average', 'index-return']
  },

  {
    id: 'DI-WGT-002', category: 'DI', sub_category: 'Weighted Averages & Index', difficulty: 2,
    question_text: 'A price index was {base} in the base year. Prices of the 3 components changed by {c1}%, {c2}%, and {c3}% respectively, with equal weighting. What is the new index value?',
    variables: {
      base: { min: 100, max: 100, step: 1 },
      c1: { min: -5, max: 10, step: 1 },
      c2: { min: -3, max: 12, step: 1 },
      c3: { min: -8, max: 8, step: 1 }
    },
    table_generator: (vars) => ({
      type: 'table',
      title: 'Price Index Components',
      headers: ['Component', 'Weight', 'Price Change (%)'],
      rows: [
        ['Component 1', 'Equal (1/3)', vars.c1 + '%'],
        ['Component 2', 'Equal (1/3)', vars.c2 + '%'],
        ['Component 3', 'Equal (1/3)', vars.c3 + '%'],
        ['Base Index', '', vars.base]
      ]
    }),
    correct_formula: 'base * (1 + (c1 + c2 + c3) / 300)',
    distractor_formulas: [
      'base + c1 + c2 + c3',
      'base * (1 + c1/100) * (1 + c2/100) * (1 + c3/100)',
      'base * (c1 + c2 + c3) / 100',
      'base + (c1 + c2 + c3) / 3 + 1'
    ],
    answer_decimals: 1,
    explanation_text: 'Average change = ({c1}% + {c2}% + {c3}%) / 3. New index = {base} × (1 + avg change) = {answer}',
    tags: ['index', 'price-change']
  },

  {
    id: 'DI-WGT-003', category: 'DI', sub_category: 'Weighted Averages & Index', difficulty: 2,
    question_text: 'A trainee\'s final assessment is weighted: Exam {wE}%, Coursework {wC}%, Participation {wP}%. They scored {sE}%, {sC}%, and {sP}% respectively. What is their final grade?',
    variables: {
      wE: { min: 40, max: 60, step: 5 },
      wC: { min: 20, max: 40, step: 5 },
      wP: { min: 10, max: 20, step: 5 },
      sE: { min: 50, max: 90, step: 5 },
      sC: { min: 55, max: 95, step: 5 },
      sP: { min: 60, max: 100, step: 5 }
    },
    table_generator: (vars) => ({
      type: 'table',
      title: 'Assessment Breakdown',
      headers: ['Component', 'Weight (%)', 'Score (%)'],
      rows: [
        ['Exam', vars.wE + '%', vars.sE + '%'],
        ['Coursework', vars.wC + '%', vars.sC + '%'],
        ['Participation', vars.wP + '%', vars.sP + '%']
      ]
    }),
    correct_formula: '(wE * sE + wC * sC + wP * sP) / (wE + wC + wP)',
    distractor_formulas: [
      '(sE + sC + sP) / 3',
      '(wE * sE + wC * sC + wP * sP) / 100',
      'sE * 0.5 + sC * 0.3 + sP * 0.2',
      '(wE * sE + wC * sC + wP * sP) / (wE + wC + wP) + 2'
    ],
    answer_suffix: '%', answer_decimals: 1,
    explanation_text: 'Final = ({wE}%×{sE}% + {wC}%×{sC}% + {wP}%×{sP}%) / ({wE}%+{wC}%+{wP}%) = {answer}%',
    tags: ['weighted-average', 'grading']
  },

  {
    id: 'DI-WGT-004', category: 'DI', sub_category: 'Weighted Averages & Index', difficulty: 3,
    question_text: 'A composite index is made up of Manufacturing ({wM}%), Services ({wS}%), and Construction ({wC}%). If Manufacturing falls by {fM}% and Services rises by {rS}%, what change in Construction is needed to keep the index unchanged?',
    variables: {
      wM: { min: 25, max: 40, step: 5 },
      wS: { min: 30, max: 50, step: 5 },
      wC: { min: 15, max: 30, step: 5 },
      fM: { min: 2, max: 8, step: 1 },
      rS: { min: 1, max: 6, step: 1 }
    },
    table_generator: (vars) => ({
      type: 'table',
      title: 'Composite Index Components',
      headers: ['Sector', 'Weight (%)', 'Change (%)'],
      rows: [
        ['Manufacturing', vars.wM + '%', '−' + vars.fM + '%'],
        ['Services', vars.wS + '%', '+' + vars.rS + '%'],
        ['Construction', vars.wC + '%', '?']
      ]
    }),
    correct_formula: '(wM * fM - wS * rS) / wC',
    distractor_formulas: [
      'fM - rS',
      '(fM * wM + rS * wS) / wC',
      '(wM * fM) / wC',
      '(fM + rS) / 2'
    ],
    answer_suffix: '%', answer_decimals: 1,
    explanation_text: 'Need: {wM}×(−{fM}%) + {wS}×{rS}% + {wC}×X% = 0. X = ({wM}×{fM} − {wS}×{rS}) / {wC} = {answer}%',
    tags: ['index', 'balancing', 'composite']
  }
];

module.exports = templates;
