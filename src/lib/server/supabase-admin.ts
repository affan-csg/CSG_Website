import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/server/db-types";

/**
 * Service-role Supabase client. BYPASSES row-level security — this file must
 * only ever be imported from server function handlers (src/lib/server/actions.ts),
 * never from a component, so the key never reaches the client bundle.
 */
let adminClient: SupabaseClient<Database> | null = null;

export function getSupabaseAdmin(): SupabaseClient<Database> {
  if (adminClient) return adminClient;

  const url = process.env["NEXT_PUBLIC_SUPABASE_URL"];
  const serviceRoleKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.",
    );
  }

  adminClient = createClient<Database>(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return adminClient;
}
