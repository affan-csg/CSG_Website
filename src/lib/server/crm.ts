/**
 * Best-effort CRM sync (HubSpot Contacts API) for employer leads. The
 * requirement is already durably stored in Supabase before this runs, so a
 * failure here is logged and swallowed rather than surfaced to the
 * submitter — a missed CRM sync should never turn a successful submission
 * into an error response.
 */
export async function syncLeadToCrm(lead: {
  email: string;
  firstName: string;
  lastName: string;
  companyName?: string | null | undefined;
  phone?: string | null | undefined;
}): Promise<void> {
  const endpoint = process.env["CRM_ENDPOINT_URL"];
  const apiKey = process.env["CRM_API_KEY"];

  if (!endpoint || !apiKey) {
    return;
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        properties: {
          email: lead.email,
          firstname: lead.firstName,
          ...(lead.lastName ? { lastname: lead.lastName } : {}),
          ...(lead.companyName ? { company: lead.companyName } : {}),
          ...(lead.phone ? { phone: lead.phone } : {}),
        },
      }),
      // The CRM being slow or unreachable must never stall the form's own
      // response — give up well before a submitter would notice the wait.
      signal: AbortSignal.timeout(5000),
    });

    // A 409 means a contact with this email already exists in the CRM —
    // it's already known there, so this isn't a failure worth logging.
    if (!response.ok && response.status !== 409) {
      console.error("syncLeadToCrm failed", response.status, await response.text());
    }
  } catch (error) {
    console.error("syncLeadToCrm failed", error);
  }
}
