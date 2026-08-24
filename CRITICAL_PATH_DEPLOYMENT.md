# CRITICAL PATH: LAUNCH BLOCKERS ONLY

**What MUST be done before Sep 1, 2026 to go live**

---

## ✅ ALREADY DONE (Copy to .env.production)

These are configured and verified in .env.local — just copy to production:

```
# Supabase (get from your production project)
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=...

# Resend (email — already configured)
RESEND_API_KEY=re_REDACTED
RESEND_FROM_EMAIL=noreply@careersourcegroup.com
CONTACT_NOTIFICATION_EMAIL=hello@careersourcegroup.com

# Turnstile (bot protection — already configured)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAEGNGaJ5ZZOLMcnW
TURNSTILE_SECRET_KEY=0x4AAAAAAEGNGVkxonr8zfuIZeTMzGZJs9Y

# HubSpot CRM (already configured and verified)
CRM_ENDPOINT_URL=https://api.hubapi.com/crm/v3/objects/contacts
CRM_API_KEY=REDACTED

# Social media (already configured)
NEXT_PUBLIC_LINKEDIN_URL=https://www.linkedin.com/company/career-source-group-llc/
NEXT_PUBLIC_YOUTUBE_URL=https://www.youtube.com/@careersourcegroup
NEXT_PUBLIC_FACEBOOK_URL=https://www.facebook.com/careersourcegroup
NEXT_PUBLIC_INSTAGRAM_URL=https://www.instagram.com/careersourcegroup

# Calendly (already configured)
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/affan-careersourcegroup/30min

# Analytics (optional — add after launch if desired)
NEXT_PUBLIC_GA4_ID=  # Leave empty for now; add GA4 ID later
NEXT_PUBLIC_ENABLE_ANALYTICS=false  # Set to true once GA4_ID is ready

# Site
NEXT_PUBLIC_SITE_URL=https://careersourcegroup.com
```

---

## 🔴 LAUNCH BLOCKERS (MUST DO)

### 1. **Production Domain & SSL**
- [ ] Domain `careersourcegroup.com` DNS pointing to production server
- [ ] SSL certificate installed and valid (HTTPS working)
- [ ] Server responding on production IP

**Why:** Forms won't submit, analytics won't fire, browser security warnings.

### 2. **Production Supabase Project**
- [ ] Create new Supabase project for production
- [ ] Run database migrations (5 SQL files in `supabase/migrations/`)
- [ ] Get prod `NEXT_PUBLIC_SUPABASE_URL` and keys
- [ ] Add to `.env.production`

**Why:** Forms can't save data; candidate/employer submissions will fail.

### 3. **Test Form Submissions End-to-End**
- [ ] Deploy with `.env.production` to production server
- [ ] Submit test form via https://careersourcegroup.com/get-started
- [ ] Verify:
  - [ ] Data saved to Supabase (check database)
  - [ ] Email received (check inbox)
  - [ ] Lead appeared in HubSpot (check CRM)

**Why:** If any step fails, forms are broken and launch is blocked.

### 4. **Verify No Residential Address Anywhere**
- [ ] Run: `grep -r "6040\|Yorkridge" /path/to/public /path/to/src/` = 0 matches
- [ ] Load production homepage, check footer text
- [ ] Verify contact page shows only "Headquartered in Alpharetta, Georgia"

**Why:** Compliance requirement; violations could trigger regulatory issues.

---

## ✅ NICE-TO-HAVE (Can add within first week)

These improve operations but don't block launch:

- [ ] Google Analytics 4 (add GA4_ID to .env.production, set ENABLE_ANALYTICS=true)
- [ ] Google Search Console (verify domain, submit sitemap)
- [ ] Error tracking (Sentry or equivalent)
- [ ] Uptime monitoring
- [ ] Dashboard/BI tool setup
- [ ] Paid acquisition campaigns (Google Ads, LinkedIn, Meta)
- [ ] ATS integration (select vendor and integrate after launch)
- [ ] CRM lead qualification workflow

---

## LAUNCH DAY (Sep 1) CHECKLIST

```
8:00 AM  Deploy .env.production to production
         Verify: https://careersourcegroup.com loads (no 500 errors)

8:15 AM  Test form submission end-to-end:
         - Submit /get-started form
         - Check email received
         - Check HubSpot received lead

8:30 AM  Verify critical compliance:
         - No "Yorkridge" or "6040" anywhere
         - Footer shows "Headquartered in Alpharetta"
         - Privacy links on /join-our-bench form

8:45 AM  Mobile & accessibility smoke test:
         - Test on real phone (375px)
         - Tab through form fields (keyboard)
         - Click all CTAs

9:00 AM  CEO/founder walkthrough on live site
         - Homepage looks correct
         - CTAs point to right places
         - Client list (Verifone, GoodRco, Snapdocs, Lilt) visible

9:30 AM  LAUNCH - Announce publicly

9:30-5PM Monitor for errors:
         - Check server logs for 500s
         - Check email inbox (should be quiet)
         - Check form submissions (if any live traffic yet)
```

---

## IF SOMETHING BREAKS

**Critical issues that need immediate rollback:**
- Forms not submitting (data loss)
- 500 errors on homepage
- Residential address visible
- SSL/HTTPS not working

**How to rollback:**
1. Revert `.env.production` to previous known-good state
2. Redeploy to production
3. Test form submission again
4. Call [ON-CALL ENGINEER]

---

## SUCCESS CRITERIA

✅ Launch is successful when:
- [ ] https://careersourcegroup.com loads with no errors
- [ ] Test form submission works end-to-end (Supabase → email → CRM)
- [ ] No residential address visible anywhere
- [ ] No 500 errors in server logs
- [ ] CEO/founder approved the look and feel

---

**That's it. Everything else can wait. Ship this.**
