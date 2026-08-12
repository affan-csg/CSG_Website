-- ---------------------------------------------------------------------------
-- 004_contact_submissions.sql
-- Adds persistent storage for general contact form submissions.
-- Idempotent — see the note at the top of 001_initial_schema.sql.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  inquiry_type text NOT NULL,  -- "service_inquiry" | "job_application" | "general"
  message text,
  ip_address text,
  submitted_at timestamptz DEFAULT now(),
  read_by_staff boolean DEFAULT false,
  archived_at timestamptz,

  CONSTRAINT contact_submissions_inquiry_type_check
    CHECK (inquiry_type IN ('service_inquiry', 'job_application', 'general'))
);

-- Row-level security: staff-only SELECT, no INSERT policy (service-role key bypasses RLS).
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS contact_submissions_staff_only ON contact_submissions;
CREATE POLICY contact_submissions_staff_only
  ON contact_submissions
  FOR SELECT
  USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'staff');

-- Indexes for review queue and reporting (same pattern as the other tables).
CREATE INDEX IF NOT EXISTS contact_submissions_unread_idx
  ON contact_submissions (submitted_at DESC)
  WHERE read_by_staff = false AND archived_at IS NULL;

CREATE INDEX IF NOT EXISTS contact_submissions_inquiry_type_idx ON contact_submissions (inquiry_type);
