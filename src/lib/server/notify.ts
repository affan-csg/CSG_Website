/**
 * Best-effort staff notification email via the Resend REST API. Submissions
 * are already durably stored in Supabase before this runs, so a failure here
 * is logged and swallowed rather than surfaced to the submitter — a missed
 * email should never turn a successful submission into an error response.
 */
export async function sendNotificationEmail(subject: string, text: string): Promise<void> {
  const apiKey = process.env["RESEND_API_KEY"];
  const from = process.env["RESEND_FROM_EMAIL"];
  const to = process.env["CONTACT_NOTIFICATION_EMAIL"];

  if (!apiKey || !from || !to) {
    return;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, text }),
      // Resend being slow or unreachable must never stall the form's own
      // response — give up well before a submitter would notice the wait.
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      console.error("sendNotificationEmail failed", response.status, await response.text());
    }
  } catch (error) {
    console.error("sendNotificationEmail failed", error);
  }
}
