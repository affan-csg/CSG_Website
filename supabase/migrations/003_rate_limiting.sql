-- ---------------------------------------------------------------------------
-- 003_rate_limiting.sql
-- Adds the IP column the rate limiter reads (src/lib/server/rate-limit.ts).
-- Idempotent — see the note at the top of 001_initial_schema.sql.
--
-- Email-based limiting was already answerable from 002_indexes.sql's
-- (email, timestamp) indexes. IP-based limiting had nowhere to read from —
-- neither table captured the submitter's IP at all. Reusing these two tables
-- (rather than standing up a separate rate_limit_events table or an external
-- store) keeps rate limiting on infrastructure the project already has, and
-- the IP doubles as a legitimate audit field alongside submitted_at.
-- Nullable: rows inserted before this migration, or a request where the IP
-- genuinely could not be read, must not break the insert.
-- ---------------------------------------------------------------------------

ALTER TABLE client_requirements ADD COLUMN IF NOT EXISTS ip_address text;
ALTER TABLE candidate_applications ADD COLUMN IF NOT EXISTS ip_address text;

CREATE INDEX IF NOT EXISTS client_requirements_ip_submitted_at_idx
  ON client_requirements (ip_address, submitted_at DESC);

CREATE INDEX IF NOT EXISTS candidate_applications_ip_applied_at_idx
  ON candidate_applications (ip_address, applied_at DESC);
