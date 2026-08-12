-- ============================================================================
-- 006_bench_form_fields.sql
--
-- The Join Our Bench form (src/components/forms/bench-form.tsx) gained a
-- Seniority dropdown and an Expected Monthly Rate field, and always had a
-- free-text "Additional information" field that was never persisted (the old
-- schema had no message column on candidate_applications at all). This adds
-- all three so nothing entered on the form is silently dropped on insert.
--
-- Nullable, no CHECK on rate beyond non-negative: seniority and rate are
-- required in the UI but kept optional at the DB level, matching how
-- `availability` was handled in 001 — the application layer enforces
-- required-ness for new submissions; the column itself stays permissive.
--
-- Idempotent (IF NOT EXISTS / IF EXISTS) so this is safe to run more than
-- once against the same database.
-- ============================================================================

ALTER TABLE candidate_applications
  ADD COLUMN IF NOT EXISTS seniority text,
  ADD COLUMN IF NOT EXISTS expected_monthly_rate integer,
  ADD COLUMN IF NOT EXISTS message text;

ALTER TABLE candidate_applications
  DROP CONSTRAINT IF EXISTS candidate_applications_seniority_check;

ALTER TABLE candidate_applications
  ADD CONSTRAINT candidate_applications_seniority_check
  CHECK (seniority IS NULL OR seniority IN ('junior','mid-level','senior','lead','principal'));

ALTER TABLE candidate_applications
  DROP CONSTRAINT IF EXISTS candidate_applications_expected_monthly_rate_check;

ALTER TABLE candidate_applications
  ADD CONSTRAINT candidate_applications_expected_monthly_rate_check
  CHECK (expected_monthly_rate IS NULL OR expected_monthly_rate >= 0);
