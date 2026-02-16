# ACUMEN LOGIC — Complete Context Transfer Package

> **System Instruction for AI Code Assistant**
> You are building HTML/CSS lesson content for Acumen Logic, a premium aptitude test preparation course targeting UK finance and consulting professionals. This document contains every specification you need. Follow it exactly.

---

## 1. BRAND IDENTITY

### 1.1 Colour System

All colours are defined as CSS custom properties on the `.al-lesson` container:

```css
--al-navy: #1B2A4A;        /* Primary — headings, backgrounds, borders */
--al-navy-light: #2A3D66;   /* Hero gradient mid-point */
--al-navy-muted: #3D5280;   /* Hero gradient end */
--al-gold: #C8A951;          /* Accent — eyebrows, highlights, buttons */
--al-gold-light: #D4BC72;    /* Hover states */
--al-gold-pale: #F5EFD9;     /* Highlighted cells, light backgrounds */
--al-cream: #FAFAF6;          /* Alternating table rows, practice question backgrounds */
--al-white: #FFFFFF;          /* Card backgrounds, body text areas */
--al-text: #2C2C2C;           /* Primary body text */
--al-text-light: #6B6B6B;     /* Secondary text, captions, table notes */
--al-border: #E8E4DA;         /* Card borders, dividers, table borders */
--al-success: #2D8F5E;        /* Correct answers, green callouts */
--al-success-bg: #EDF7F0;     /* Green background for "right" comparison boxes */
--al-danger: #C0392B;         /* Incorrect answers, red callouts */
--al-danger-bg: #FDF2F0;      /* Red background for "wrong" comparison boxes */
```

### 1.2 Typography

**CRITICAL: Source Sans 3 is the ONLY font. No other font is used anywhere.**

```css
/* Google Fonts import — always include in every lesson file */
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700&display=swap');

/* Base container */
.al-lesson {
  font-family: 'Source Sans 3', 'Segoe UI', system-ui, sans-serif;
}

/* Headlines — same font family, differentiated by weight */
.al-lesson h1, .al-lesson h2, .al-lesson h3,
.al-section-number, .al-example-label, .al-next-title {
  font-family: 'Source Sans 3', 'Segoe UI', system-ui, sans-serif;
  font-weight: 700;
  color: var(--al-navy);
  line-height: 1.25;
}
```

**Font history note:** Earlier lessons (1.3, 1.4, 1.5) were originally built with DM Serif Display for headings. This was replaced with Source Sans 3 across the entire system from Module 2 onwards. All new builds must use Source Sans 3 only. If rebuilding earlier lessons, replace DM Serif Display. Zero references to DM Serif Display should appear in any file.

### 1.3 Visual Aesthetic

- Clean, professional, premium feel — not flashy or gamified
- Navy/gold/cream palette throughout — never neon, never primary colours
- Generous whitespace between sections
- Rounded corners (`border-radius: 10px`) on all cards, callouts, and containers
- Subtle box shadows (`0 2px 12px rgba(27, 42, 74, 0.08)`) for depth
- No decorative imagery or icons — content-first design

---

## 2. PEDAGOGICAL RULES

### 2.1 Lesson Types

Every lesson has a classified type that determines its structure:

| Type | Structure | Example |
|------|-----------|---------|
| **Theory** | Concept explanation → Visual aids → Key rules → Summary | 1.1, 1.3 |
| **Strategy** | Framework introduction → Application rules → When to use → Speed tips | 1.2, 2.5, 5.1–5.4 |
| **Teaching** | Theory + Worked examples + Practice (the longest lessons) | 3.1, 3.2, 3.3 |
| **Worked Examples** | Data sources → Worked examples with step-by-step solutions → Wrong vs Right comparisons → Practice questions with reveals | 2.1–2.4 |
| **Practice** | Questions with reveal-style answers, minimal new theory | 3.5, 4.5 |
| **Assessment** | Timed test format, JS scoring (exception to no-JS rule) | 1.5, 2.6, 3.6, 5.5, 6.2, 6.4 |

### 2.2 Worked Example Format

The core teaching pattern used across all "Worked Examples" and "Teaching" lessons:

```
1. QUESTION — Presented in navy header with gold label
2. STEP-BY-STEP SOLUTION — Numbered steps with circular navy step badges
3. RESULT — Highlighted in green (font-weight: 700, color: var(--al-success))
4. TRAP EXPLANATION — Why the wrong method gives a plausible but incorrect answer
```

Step lines use this HTML pattern:
```html
<div class="al-step-line">
  <span class="al-step-num">1</span>
  <span class="al-step-calc">Revenue: £5,400k × (1 − 0.58) = <span class="al-step-result">£2,268k</span></span>
</div>
```

### 2.3 Wrong vs Right Comparison Boxes

Used whenever a common trap exists. Side-by-side grid:

```html
<div class="al-vs">
  <div class="al-vs-box al-vs-wrong">
    <div class="al-vs-label">Common Mistake</div>
    <!-- Wrong method + wrong answer in red -->
  </div>
  <div class="al-vs-box al-vs-right">
    <div class="al-vs-label">Correct Method</div>
    <!-- Right method + right answer in green -->
  </div>
</div>
```

Wrong boxes: red border, `#FDF2F0` background. Right boxes: green border, `#EDF7F0` background. Collapses to single column on mobile (`max-width: 600px`).

### 2.4 Practice Questions with Reveal

All practice questions use the HTML `<details>/<summary>` pattern — zero JavaScript:

```html
<div class="al-practice">
  <div class="al-practice-label">Practice Question 1</div>
  <div class="al-practice-q">Question text here</div>
  <div class="al-practice-options">
    <p>(A) Option &emsp; (B) Option &emsp; (C) Option &emsp; (D) Option</p>
  </div>
</div>
<details class="al-reveal">
  <summary class="al-reveal-btn">Show Answer ▾</summary>
  <div class="al-reveal-content">
    <!-- Step-by-step solution with trap explanation -->
  </div>
</details>
```

### 2.5 Trap Design Philosophy

Every practice question should have **at least one distractor answer** that corresponds to a specific, named wrong method. In the reveal, explicitly state what wrong method produces each trap answer. Examples:

- "Option A (£504k) = 18% × £2,800k — using annual revenue instead of Q3 total"
- "Option D (68.0%) comes from using the y-axis position instead of the segment value"

This teaches error recognition, not just correct answers.

### 2.6 Tone and Voice

- **Professional but direct.** Write as a knowledgeable tutor, not a textbook.
- **No filler.** Never write "In this lesson we will learn about..." — get straight to content.
- **Mentor-style.** Acknowledge difficulty, build confidence through competence, not cheerleading.
- **Concise.** Theory sections should be tight. Worked example sections can be longer (they carry the teaching load).
- **Finance-contextualised.** Use business scenarios: revenue, margins, headcount, market share — not abstract maths.

---

## 3. CONTENT SPECIFICATIONS

### 3.1 Course Structure — 6 Modules, 34 Lessons

#### Module 1: Foundations & Strategic Framework (5 Lessons)

| # | Title | Type |
|---|-------|------|
| 1.1 | What These Tests Actually Measure | Theory |
| 1.2 | The Elite Timing Reality | Strategy |
| 1.3 | How Aptitude Tests Are Scored | Theory |
| 1.4 | Speed & Accuracy Fundamentals | Practice |
| 1.5 | Your Diagnostic Assessment | Assessment |

#### Module 2: Numerical Reasoning — Core Skills (6 Lessons)

| # | Title | Type |
|---|-------|------|
| 2.1 | Percentages Mastery | Worked Examples |
| 2.2 | Ratios & Proportions | Worked Examples |
| 2.3 | Fractions, Decimals & Conversions | Worked Examples |
| 2.4 | Averages, Growth & Compound Change | Worked Examples |
| 2.5 | Speed Arithmetic & Estimation | Strategy |
| 2.6 | Core Skills Practice Test | Assessment |

#### Module 3: Data Interpretation & Applied Numeracy (6 Lessons)

| # | Title | Type |
|---|-------|------|
| 3.1 | Reading Tables & Extracting Data | Teaching |
| 3.2 | Bar Charts, Line Graphs & Pie Charts | Teaching |
| 3.3 | Multi-Source Data Integration | Teaching |
| 3.4 | Percentage Change & Growth Analysis | Worked Examples |
| 3.5 | Profit, Loss & Financial Statements | Worked Examples |
| 3.6 | Data Interpretation Practice Test | Assessment |

#### Module 4: Logical Reasoning Systems (6 Lessons)

| # | Title | Type |
|---|-------|------|
| 4.1 | Deductive Reasoning & Syllogisms | Theory |
| 4.2 | Pattern Recognition | Worked Examples |
| 4.3 | Rule Application & Ordering | Worked Examples |
| 4.4 | Verbal Reasoning: True/False/Cannot Say | Worked Examples |
| 4.5 | Combined Logical Problems | Practice |
| 4.6 | Logical Reasoning Practice Test | Assessment |

#### Module 5: Pressure Protocols (5 Lessons)

| # | Title | Type |
|---|-------|------|
| 5.1 | Time Management Under Pressure | Strategy |
| 5.2 | Error Pattern Recognition | Strategy |
| 5.3 | Stress Inoculation Training | Strategy |
| 5.4 | Test Day Protocols | Strategy |
| 5.5 | Full-Length Timed Drill | Assessment |

#### Module 6: Assessment Simulation (6 Lessons)

| # | Title | Type |
|---|-------|------|
| 6.1 | Pre-Assessment Strategy Review | Strategy |
| 6.2 | Mock Assessment 1 | Assessment |
| 6.3 | Mock 1 Debrief & Analysis | Theory |
| 6.4 | Mock Assessment 2 | Assessment |
| 6.5 | Mock 2 Debrief & Final Adjustments | Theory |
| 6.6 | Test Day Checklist & Next Steps | Strategy |

### 3.2 Lesson Content Rules

- **These are NOT slide decks.** Each lesson is a single, continuous HTML page — a scrollable document with sections, not individual slides.
- **No maximum line limits per section.** Theory sections should be concise; worked example sections can be as long as needed to teach properly.
- **Every lesson must include a Hero section** (navy gradient, gold eyebrow, white title, subtitle), numbered sections, and a "Next Lesson" teaser at the bottom.
- **Every teaching/worked example lesson must end with Key Takeaways** in a dark navy box with gold heading and checkmark list.
- **Data must be verifiable.** All numerical examples must use specific values that produce exact, checkable answers. Never use approximate or vague data.
- **All calculations must be programmatically verified** before delivery. Include a verification comment block at the end of each HTML file.

### 3.3 Visual Data Presentation

Charts and data visualisations must be built in **pure CSS/HTML or inline SVG**. No JavaScript chart libraries.

Components already established:

| Component | Method | Used In |
|-----------|--------|---------|
| Data tables | `<table class="al-data-table">` with navy headers, alternating cream rows | 3.1, 3.3 |
| Grouped bar charts | CSS `div` elements with calculated pixel heights | 3.2, 3.3 |
| Stacked bar charts | CSS `flex-direction: column-reverse` with coloured segments | 3.2 |
| Line graphs | Inline `<svg>` with `<polyline>` elements and `<circle>` data points | 3.2 |
| Pie charts | CSS `conic-gradient` with calculated degree stops | 3.2, 3.3 |
| Highlighted cells | `.al-cell-highlight` class with gold background + border | 3.1 |
| Source tags | Colour-coded inline badges (`.al-source-tag`) for multi-source lessons | 3.3 |

**Bar chart heights** are calculated as: `pixel_height = (data_value / axis_max) × plot_area_height_px`. All heights must be mathematically verified.

**Pie chart degrees** are calculated as: `degrees = percentage × 3.6`. Must sum to exactly 360°.

---

## 4. TECHNICAL ENVIRONMENT

### 4.1 Platform: ThriveCart Learn+

- Lessons are delivered as **Custom HTML Blocks** inside ThriveCart Learn's course editor
- Each lesson = one HTML code block containing `<style>` + HTML content
- **No external CSS files** — all styles must be inline within `<style>` tags in the same file
- **No JavaScript** in teaching lessons (CSS-only interactivity via `<details>/<summary>`)
- **Exception:** Assessment lessons (2.6, 3.6, 4.6, 5.5, 6.2, 6.4) may use client-side JS for scoring

### 4.2 ThriveCart Override Protection

ThriveCart injects its own CSS that can override lesson styling. All critical styles must use `!important` declarations. The following require explicit protection:

```css
/* These MUST have !important to survive ThriveCart's CSS injection */
.al-hero-eyebrow { color: var(--al-gold) !important; }
.al-lesson .al-hero h1 { color: var(--al-white) !important; }
.al-hero-subtitle { color: rgba(255, 255, 255, 0.9) !important; }
.al-section-number { color: var(--al-white) !important; }
.al-example-label { color: var(--al-gold) !important; }
.al-example-q { color: var(--al-white) !important; }
.al-formula-label { color: var(--al-gold) !important; }
.al-formula-text { color: var(--al-white) !important; }
.al-formula-note { color: rgba(255, 255, 255, 0.75) !important; }
.al-takeaways h3 { color: var(--al-gold) !important; }
.al-takeaways-list li { color: rgba(255, 255, 255, 0.95) !important; }
/* ... and any other text inside navy/dark-background containers */
```

The selector `.al-lesson .al-hero h1` (with parent class) is required for the hero heading — without the parent, ThriveCart wins the specificity battle.

### 4.3 Mobile Responsiveness

All lessons must be fully responsive. Standard breakpoint:

```css
@media (max-width: 600px) {
  .al-hero { padding: 1.75rem 1.25rem 1.5rem; }
  .al-card, .al-example-body, .al-reveal-content { padding: 1.15rem; }
  .al-vs { grid-template-columns: 1fr; }  /* Stack comparison boxes vertically */
  .al-next { flex-direction: column; text-align: center; }
  .al-bar { width: 18px; }  /* Narrower bars on mobile */
  .al-pie { width: 160px; height: 160px; }  /* Smaller pie charts */
}
```

### 4.4 File Structure

Each lesson is a single self-contained HTML file:

```
<!--
  ACUMEN LOGIC — Lesson X.X: Title
  For ThriveCart Learn Custom HTML Block
  Pure CSS · Zero JavaScript · Fully responsive
-->

<style>
  /* Full CSS here — brand tokens, components, responsiveness */
</style>

<div class="al-lesson">
  <!-- Hero -->
  <!-- Sections 1-N -->
  <!-- Key Takeaways -->
  <!-- Next Lesson Teaser -->
</div>

<!--
  CALCULATION VERIFICATION:
  WE1: ... ✓
  PQ1: ... ✓
  etc.
-->
```

### 4.5 Naming Convention

Files are named: `Lesson_X_Y_Title_With_Underscores.html`

Examples:
- `Lesson_3_1_Reading_Tables_Extracting_Data.html`
- `Lesson_3_2_Bar_Charts_Line_Graphs_Pie_Charts.html`

---

## 5. PROGRESS LOG

### 5.1 Completed Lessons (HTML Built & Verified)

| Lesson | Title | Status | Notes |
|--------|-------|--------|-------|
| 1.1 | What These Tests Actually Measure | ✅ Built | Theory lesson |
| 1.2 | The Elite Timing Reality | ✅ Built | Strategy lesson |
| 1.3 | How Aptitude Tests Are Scored | ✅ Built | Has CSS bell curve, needs font update (DM Serif → Source Sans 3) |
| 1.4 | Speed & Accuracy Fundamentals | ✅ Built | First teaching lesson template, needs font update |
| 1.5 | Your Diagnostic Assessment | ✅ Built | Diagnostic explainer with CTA, needs font update |
| 2.1 | Percentages Mastery | ✅ Built | Full worked examples, Source Sans 3 compliant |
| 2.2 | Ratios & Proportions | ✅ Built | Full worked examples, Source Sans 3 compliant |
| 2.3 | Fractions, Decimals & Conversions | ✅ Built | Full worked examples, Source Sans 3 compliant |
| 2.4 | Averages, Growth & Compound Change | ✅ Built | Full worked examples, Source Sans 3 compliant |
| 2.5 | Speed Arithmetic & Estimation | ✅ Built | Strategy lesson (cognitive speed, not mental maths tricks) |
| 3.1 | Reading Tables & Extracting Data | ✅ Built | 6 data tables, 5 worked examples, 5 practice Qs |
| 3.2 | Bar Charts, Line Graphs & Pie Charts | ✅ Built | CSS bar charts, SVG line graph, conic-gradient pie chart |
| 3.3 | Multi-Source Data Integration | ✅ Built | 5-step method, colour-coded source tags, 3-source hard example |

### 5.2 Lessons Not Yet Built

| Lesson | Title | Status |
|--------|-------|--------|
| 2.6 | Core Skills Practice Test | Not started (Assessment — requires JS) |
| 3.4 | Percentage Change & Growth Analysis | Not started |
| 3.5 | Profit, Loss & Financial Statements | Not started |
| 3.6 | Data Interpretation Practice Test | Not started (Assessment — requires JS) |
| 4.1–4.6 | All Module 4 | Not started |
| 5.1–5.5 | All Module 5 | Not started |
| 6.1–6.6 | All Module 6 | Not started |

### 5.3 Known Technical Debt

1. **Lessons 1.3, 1.4, 1.5** still use DM Serif Display for headings — need rebuild with Source Sans 3 only
2. **No Assessment lessons built yet** — these will need JavaScript scoring mechanisms, which is the one exception to the zero-JS rule
3. **Module 3.4 onwards** — all remaining content needs to be built from the prompt master specifications (available as a separate document)

### 5.4 Immediate Next Steps

The next lessons to build in sequence are:
1. **3.4** — Percentage Change & Growth Analysis (Worked Examples)
2. **3.5** — Profit, Loss & Financial Statements (Worked Examples)
3. **3.6** — Data Interpretation Practice Test (Assessment — JS scoring)
4. Then proceed to Module 4

---

## 6. COMPONENT REFERENCE

### 6.1 Hero Section (every lesson)

```html
<div class="al-hero">
  <div class="al-hero-eyebrow">Module X · Lesson X.X</div>
  <h1>Lesson Title Here</h1>
  <hr class="al-hero-rule">
  <p class="al-hero-subtitle">Brief description of what this lesson covers.</p>
</div>
```

### 6.2 Section Headers (numbered)

```html
<div class="al-section">
  <div class="al-section-header">
    <div class="al-section-number">1</div>
    <h2>Section Title</h2>
  </div>
  <!-- Section content -->
</div>
```

### 6.3 Worked Example Block

```html
<div class="al-example">
  <div class="al-example-header">
    <span class="al-example-label">Worked Example 1</span>
    <span class="al-example-q">"Question text in quotes"</span>
  </div>
  <div class="al-example-body">
    <!-- Step lines, explanations, result -->
  </div>
</div>
```

### 6.4 Formula/Rule Card

```html
<div class="al-formula">
  <div class="al-formula-label">Rule Name</div>
  <div class="al-formula-text">Formula or key principle</div>
  <div class="al-formula-note">Additional context</div>
</div>
```

### 6.5 Callout Boxes

Three variants: `.al-callout-tip` (green), `.al-callout-warn` (orange), `.al-callout-danger` (red).

```html
<div class="al-callout al-callout-tip">
  <div class="al-callout-label">Technique</div>
  <p>Callout content here.</p>
</div>
```

### 6.6 Key Takeaways (every lesson)

```html
<div class="al-takeaways">
  <h3>Key Takeaways</h3>
  <ul class="al-takeaways-list">
    <li>Takeaway point with checkmark prefix (added via CSS ::before)</li>
  </ul>
</div>
```

### 6.7 Next Lesson Teaser (every lesson)

```html
<div class="al-next">
  <div class="al-next-arrow">→</div>
  <div>
    <div class="al-next-label">Next Lesson</div>
    <div class="al-next-title">X.X — Title</div>
    <div class="al-next-desc">Brief teaser description.</div>
  </div>
</div>
```

---

## 7. QUALITY CHECKLIST

Before delivering any lesson, verify:

- [ ] **Source Sans 3 only** — zero references to DM Serif Display or any other font
- [ ] **Zero JavaScript** — unless this is an Assessment lesson (2.6, 3.6, 4.6, 5.5, 6.2, 6.4)
- [ ] **!important declarations** on all text inside navy/dark containers
- [ ] **All calculations verified** — every numerical answer in every worked example and practice question
- [ ] **Trap answers correspond to named wrong methods** — each incorrect option in practice questions traces to a specific error
- [ ] **Mobile responsive** — comparison boxes stack vertically, charts scale down, padding reduces
- [ ] **Consistent class naming** — all classes use `al-` prefix
- [ ] **Verification comment block** at end of file listing every calculation with ✓
- [ ] **Hero section** present with eyebrow, title, rule, subtitle
- [ ] **Key Takeaways** section present at end
- [ ] **Next Lesson teaser** present at end
- [ ] **Section dividers** (`<hr class="al-divider">`) between major sections
