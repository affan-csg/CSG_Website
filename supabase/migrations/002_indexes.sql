-- ---------------------------------------------------------------------------
-- 002_indexes.sql
-- Indexes supporting the rate-limit lookups and the staff review queue.
-- Idempotent — see the note at the top of 001_initial_schema.sql.
-- ---------------------------------------------------------------------------

-- Rate limiting is "how many submissions from this email in the last hour".
-- A composite index on (email, timestamp DESC) answers that from the index
-- alone; an index on email alone would still scan every row for a frequent
-- submitter.
CREATE INDEX IF NOT EXISTS client_requirements_email_submitted_at_idx
  ON client_requirements (email, submitted_at DESC);

CREATE INDEX IF NOT EXISTS candidate_applications_email_applied_at_idx
  ON candidate_applications (email, applied_at DESC);

-- Staff review queue: unread first, newest first. Partial indexes, because the
-- queue only ever queries unread rows and the archive grows without bound.
CREATE INDEX IF NOT EXISTS client_requirements_unread_idx
  ON client_requirements (submitted_at DESC)
  WHERE read_by_staff = false AND archived_at IS NULL;

CREATE INDEX IF NOT EXISTS candidate_applications_unread_idx
  ON candidate_applications (applied_at DESC)
  WHERE reviewed_by_staff = false AND archived_at IS NULL;

-- Reporting by specialty, for "which skills are in demand / on the bench".
CREATE INDEX IF NOT EXISTS client_requirements_skill_idx ON client_requirements (skill_needed);
CREATE INDEX IF NOT EXISTS candidate_applications_specialty_idx ON candidate_applications (specialty);
