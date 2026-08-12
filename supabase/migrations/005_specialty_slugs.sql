-- ============================================================================
-- 005_specialty_slugs.sql
-- Idempotent — see the note at the top of 001_initial_schema.sql.
--
-- Widens the specialty CHECK constraints on both intake tables from the six
-- original practice areas to include the three added later.
--
-- Added slugs: mlops, devops, devsecops.
-- Unchanged:   ai-ml, data, cloud, software-dev, product.
--
-- `grc` is kept, NOT dropped. The app's specialtyOptions (src/lib/forms.ts)
-- no longer offers it as a selectable value, so no new row will ever be
-- written with skill_needed/specialty = 'grc' — but at least one real
-- historical client_requirements row already has it (submitted 2026-08-04,
-- before the practice-area list changed), and dropping it from the CHECK
-- constraint here would make that existing row violate the constraint,
-- which fails the ALTER TABLE outright (Postgres validates CHECK
-- constraints against all existing rows when you add one). Widening as a
-- pure superset — old six plus the three new ones — is the only form of
-- this migration that both fixes the up-to-date value set AND never
-- rejects data that already exists.
--
-- The source of truth for current (selectable) values is specialtyOptions
-- in src/lib/forms.ts; 'grc' is intentionally not in that list and this
-- constraint is the one place it is still allowed to exist, for historical
-- rows only.
-- ============================================================================

ALTER TABLE client_requirements
  DROP CONSTRAINT IF EXISTS client_requirements_skill_needed_check;

ALTER TABLE client_requirements
  ADD CONSTRAINT client_requirements_skill_needed_check
  CHECK (skill_needed IN (
    'ai-ml','mlops','data','devops','devsecops','cloud','software-dev','product','grc'
  ));

ALTER TABLE candidate_applications
  DROP CONSTRAINT IF EXISTS candidate_applications_specialty_check;

ALTER TABLE candidate_applications
  ADD CONSTRAINT candidate_applications_specialty_check
  CHECK (specialty IN (
    'ai-ml','mlops','data','devops','devsecops','cloud','software-dev','product','grc'
  ));
