import {
  countRecentApplicationsByEmail,
  countRecentApplicationsByIp,
  countRecentClientRequirementsByEmail,
  countRecentClientRequirementsByIp,
} from "@/lib/server/submissions";

/**
 * Server-side rate limiting for form submissions.
 *
 *   Per email : 5 submissions/hour
 *   Per IP    : 20 submissions/hour
 *
 * Counts are summed across BOTH intake tables (client_requirements and
 * candidate_applications) so alternating between the two forms doesn't
 * double an abuser's budget. Counts read straight off submitted_at/applied_at,
 * so there's no separate store to keep alive.
 *
 * The general contact form is not covered here — it has no rate-limit
 * lookup, matching the honeypot-only defense it always had.
 */

export const RATE_LIMITS = {
  perEmailPerHour: 5,
  perIpPerHour: 20,
} as const;

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  /** Unix ms when the window resets. */
  resetAt: number;
}

function resultFrom(count: number, limit: number): RateLimitResult {
  return {
    allowed: count < limit,
    remaining: Math.max(0, limit - count),
    resetAt: Date.now() + 60 * 60 * 1000,
  };
}

export async function checkEmailRateLimit(email: string): Promise<RateLimitResult> {
  const [clientCount, candidateCount] = await Promise.all([
    countRecentClientRequirementsByEmail(email),
    countRecentApplicationsByEmail(email),
  ]);

  return resultFrom(clientCount + candidateCount, RATE_LIMITS.perEmailPerHour);
}

export async function checkIpRateLimit(ip: string): Promise<RateLimitResult> {
  const [clientCount, candidateCount] = await Promise.all([
    countRecentClientRequirementsByIp(ip),
    countRecentApplicationsByIp(ip),
  ]);

  return resultFrom(clientCount + candidateCount, RATE_LIMITS.perIpPerHour);
}
