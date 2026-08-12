-- ---------------------------------------------------------------------------
-- 001_initial_schema.sql
-- Career Source Group — dual-audience intake tables.
--
-- Ported from the prior Next.js project (C:\dev\career-source-group).
--
-- Idempotent: every statement is safe to re-run against a database that
-- already has some or all of this applied — CREATE ... IF NOT EXISTS, and
-- policies are dropped and recreated rather than assumed absent. Run the
-- whole supabase/migrations/*.sql sequence in order (001 → 006); it
-- converges to the same end state whether the target database is empty or
-- partially migrated.
--
-- Two tables, not one with a discriminator column. The field sets barely
-- overlap (company_name vs. resume_url / availability / portfolio), the
-- retention and reporting needs differ, and a résumé upload needs a row to
-- reference. One table with half its columns null per row would be worse on
-- every count.
-- ---------------------------------------------------------------------------

-- ============================================================ CLIENT INTAKE
CREATE TABLE IF NOT EXISTS client_requirements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  company_name text,
  -- Must match the specialty values in src/lib/forms.ts (specialtyOptions).
  skill_needed text NOT NULL,
  engagement_type text NOT NULL,  -- "specialist" | "pod"
  basis text NOT NULL,            -- "contract" | "full-time" | "open"
  message text,
  submitted_at timestamptz DEFAULT now(),
  read_by_staff boolean DEFAULT false,
  archived_at timestamptz,

  CONSTRAINT client_requirements_skill_needed_check
    CHECK (skill_needed IN ('ai-ml','data','cloud','grc','software-dev','product')),
  CONSTRAINT client_requirements_engagement_type_check
    CHECK (engagement_type IN ('specialist','pod')),
  CONSTRAINT client_requirements_basis_check
    CHECK (basis IN ('contract','full-time','open'))
);

-- ========================================================= CANDIDATE INTAKE
CREATE TABLE IF NOT EXISTS candidate_applications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  location text NOT NULL,
  -- Same six values as client_requirements.skill_needed.
  specialty text NOT NULL,
  basis text NOT NULL,            -- "contract" | "full-time" | "open"
  -- Path within the Supabase Storage bucket, not a public URL. Résumés are
  -- personal data and must never sit in a public bucket.
  resume_url text,
  availability text,              -- "immediately" | "2-4-weeks" | "1-3-months"
  portfolio_url text,
  linkedin_url text,
  applied_at timestamptz DEFAULT now(),
  reviewed_by_staff boolean DEFAULT false,
  archived_at timestamptz,

  CONSTRAINT candidate_applications_specialty_check
    CHECK (specialty IN ('ai-ml','data','cloud','grc','software-dev','product')),
  CONSTRAINT candidate_applications_basis_check
    CHECK (basis IN ('contract','full-time','open')),
  CONSTRAINT candidate_applications_availability_check
    CHECK (availability IS NULL OR availability IN ('immediately','2-4-weeks','1-3-months'))
);

-- =========================================================== ROW-LEVEL SECURITY
-- Both tables hold personal data. RLS is enabled with SELECT restricted to
-- authenticated staff. Note that no INSERT policy is defined: inserts happen
-- exclusively through server functions using the service-role key, which
-- bypasses RLS. That is deliberate — the anon key must never be able to read
-- or write these tables.

ALTER TABLE client_requirements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS client_requirements_staff_only ON client_requirements;
CREATE POLICY client_requirements_staff_only
  ON client_requirements
  FOR SELECT
  USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'staff');

ALTER TABLE candidate_applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS candidate_applications_staff_only ON candidate_applications;
CREATE POLICY candidate_applications_staff_only
  ON candidate_applications
  FOR SELECT
  USING (auth.role() = 'authenticated' AND auth.jwt() ->> 'role' = 'staff');
