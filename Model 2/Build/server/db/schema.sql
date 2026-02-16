-- ACUMEN LOGIC MODEL 2 — Database Schema
-- PostgreSQL (Supabase)

-- ═══════════════════════════════════════════════════════════════
-- EXTENSIONS
-- ═══════════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ═══════════════════════════════════════════════════════════════
-- USERS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS m2_users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT UNIQUE NOT NULL,
  password_hash   TEXT,
  name            TEXT NOT NULL,
  google_id       TEXT UNIQUE,
  avatar_url      TEXT,
  tier            TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'admin')),
  pro_expires_at  TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at   TIMESTAMPTZ,
  target_firm     TEXT,
  email_opt_in    BOOLEAN DEFAULT FALSE,
  assessments_this_month INTEGER DEFAULT 0,
  month_reset_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_m2_users_email ON m2_users(email);
CREATE INDEX IF NOT EXISTS idx_m2_users_google ON m2_users(google_id);

-- ═══════════════════════════════════════════════════════════════
-- ASSESSMENT SESSIONS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS m2_assessment_sessions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES m2_users(id) ON DELETE CASCADE,
  assessment_type     TEXT NOT NULL CHECK (assessment_type IN ('quick-benchmark', 'full-benchmark', 'category-drill', 'custom')),
  category_filter     TEXT CHECK (category_filter IN ('NR', 'DI', 'LR', NULL)),
  started_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at        TIMESTAMPTZ,
  time_limit_seconds  INTEGER NOT NULL,
  question_count      INTEGER NOT NULL,
  score_correct       INTEGER,
  score_total         INTEGER,
  score_percentage    INTEGER,
  percentile_overall  INTEGER,
  percentile_nr       INTEGER,
  percentile_di       INTEGER,
  percentile_lr       INTEGER,
  score_nr_correct    INTEGER DEFAULT 0,
  score_nr_total      INTEGER DEFAULT 0,
  score_di_correct    INTEGER DEFAULT 0,
  score_di_total      INTEGER DEFAULT 0,
  score_lr_correct    INTEGER DEFAULT 0,
  score_lr_total      INTEGER DEFAULT 0,
  time_taken_seconds  INTEGER,
  is_benchmark        BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_m2_sessions_user ON m2_assessment_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_m2_sessions_type ON m2_assessment_sessions(assessment_type);
CREATE INDEX IF NOT EXISTS idx_m2_sessions_completed ON m2_assessment_sessions(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_m2_sessions_benchmark ON m2_assessment_sessions(is_benchmark) WHERE is_benchmark = TRUE;

-- ═══════════════════════════════════════════════════════════════
-- SESSION ANSWERS
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS m2_session_answers (
  id                    SERIAL PRIMARY KEY,
  session_id            UUID NOT NULL REFERENCES m2_assessment_sessions(id) ON DELETE CASCADE,
  question_template_id  TEXT NOT NULL,
  question_seed         INTEGER NOT NULL,
  question_order        INTEGER NOT NULL,
  category              TEXT NOT NULL,
  difficulty            INTEGER NOT NULL,
  generated_question    JSONB,
  selected_answer       INTEGER,
  correct_answer        INTEGER NOT NULL,
  is_correct            BOOLEAN,
  time_spent_seconds    INTEGER
);

CREATE INDEX IF NOT EXISTS idx_m2_answers_session ON m2_session_answers(session_id);

-- ═══════════════════════════════════════════════════════════════
-- PERCENTILE CACHE
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS m2_percentile_cache (
  id                SERIAL PRIMARY KEY,
  cache_key         TEXT UNIQUE NOT NULL,
  percentile_data   JSONB NOT NULL,
  total_assessments INTEGER NOT NULL,
  calculated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════════
-- SEED DATA TRACKING
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS m2_seed_data (
  id              SERIAL PRIMARY KEY,
  score_percentage INTEGER NOT NULL,
  score_nr        INTEGER,
  score_di        INTEGER,
  score_lr        INTEGER,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_simulated    BOOLEAN DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_m2_seed_score ON m2_seed_data(score_percentage);
