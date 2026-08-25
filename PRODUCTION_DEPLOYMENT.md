# Production Deployment Checklist

**Career Source Group Website**  
**Launch Date: September 1, 2026**  
**Status: CODE COMPLETE & TESTED**

---

## PRE-DEPLOYMENT (THIS SESSION) ✅

- [x] Code audit complete (all 23 sections verified)
- [x] 145 unit tests passing
- [x] TypeScript type-safe (locked file exemption documented)
- [x] Production build successful
- [x] Debug code removed
- [x] Compliance checks passed (address, privacy, CTAs)
- [x] SEO configured (sitemap, robots.txt, canonicals)
- [x] Forms working (Supabase + CRM sync)
- [x] Analytics module ready
- [x] All temporary docs cleaned up

---

## DEPLOYMENT CHECKLIST (BEFORE GOING LIVE)

### 1. Domain & Infrastructure
- [ ] Production domain registered: `careersourcegroup.com`
- [ ] DNS records pointing to production server
- [ ] SSL certificate installed (HTTPS)
- [ ] Server running Node.js v18+
- [ ] Uptime monitoring configured

### 2. Environment Configuration
Create `.env.production` with:
```
NEXT_PUBLIC_SITE_URL=https://careersourcegroup.com
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX (from Google Analytics)
NEXT_PUBLIC_LINKEDIN_URL=https://www.linkedin.com/company/...
NEXT_PUBLIC_YOUTUBE_URL=https://www.youtube.com/@...
NEXT_PUBLIC_FACEBOOK_URL=https://www.facebook.com/...
NEXT_PUBLIC_INSTAGRAM_URL=https://www.instagram.com/...

# Supabase (production project)
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Email (Resend)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@careersourcegroup.com
CONTACT_NOTIFICATION_EMAIL=hello@careersourcegroup.com

# CRM (HubSpot)
CRM_ENDPOINT_URL=https://api.hubapi.com/crm/v3/objects/contacts
CRM_API_KEY=pat-...

# Turnstile (Cloudflare)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=...
TURNSTILE_SECRET_KEY=...

# Analytics
NEXT_PUBLIC_ENABLE_ANALYTICS=true

# Calendly
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/...
```

### 3. Google Analytics 4 (OPTIONAL POST-LAUNCH)
- [ ] GA4 property created (can add after launch)
- [ ] GA4 ID configured in .env.production (optional, site works without it)
- [ ] Data streams configured (optional)
- [ ] Goals/conversions defined per Section 18.2 (optional)
- [ ] Test event verified (optional)
**Note:** GA4 module is built-in but gracefully skips if GA4_ID not configured.

### 4. Google Search Console (OPTIONAL POST-LAUNCH)
- [ ] Production domain verified (can add within first week)
- [ ] sitemap.xml submitted: https://careersourcegroup.com/sitemap.xml
- [ ] robots.txt verified (already configured correctly)
- [ ] Mobile-friendly test passed (optional)
- [ ] Core Web Vitals setup (optional)
- [ ] Coverage report reviewed (optional)
**Note:** Site is indexable without GSC; GSC just gives insights.

### 5. CRM Integration (HubSpot) ✅ DONE
- [x] HubSpot workspace created
- [x] Contacts API endpoint verified
- [x] API key configured (in .env.local, add to .env.production)
- [x] Test form submission → HubSpot verified (working end-to-end)
- [ ] Lead qualification workflow created (optional, can add later)
- [ ] Email template for notifications set up (optional, manual for now)

### 6. Social Media Profiles ✅ DONE
- [x] LinkedIn Company Page created with logo, cover, "Request Talent" button
- [x] LinkedIn Company URL finalized: `https://www.linkedin.com/company/career-source-group-llc/`
- [x] YouTube channel created with channel art and about
- [x] Facebook Page created with business details (NO residential address)
- [x] Instagram professional account created
- [ ] All URLs added to .env.production
- [ ] Footer links verified to show correct URLs

### 7. Email Configuration ✅ DONE
- [x] Resend API key verified (in .env.local)
- [x] RESEND_FROM_EMAIL: `noreply@careersourcegroup.com` (update in .env.production)
- [x] CONTACT_NOTIFICATION_EMAIL: internal team email configured
- [x] Test email sent and received (verified working)
- [x] Email templates working for all form submissions

### 8. Bot Protection (Cloudflare Turnstile) ✅ DONE
- [x] Turnstile site key and secret configured (in .env.local)
- [x] Bot protection tested on forms (working)
- [x] False-positive rate acceptable (copy keys to .env.production)

### 9. Preview Environment
- [ ] `csg-v2.vercel.app` (preview) has robots.txt `noindex` or access control
- [ ] Preview environment NOT indexed in Google
- [ ] Only production domain indexed

### 10. Database & Backups
- [ ] Supabase production project set up
- [ ] Database schema created (tables: client_requirements, candidate_applications, contact_submissions)
- [ ] Backups configured and tested
- [ ] Row-level security (RLS) policies in place
- [ ] Private "resumes" storage bucket exists with access control

### 11. Monitoring & Alerting (OPTIONAL POST-LAUNCH)
- [ ] Error tracking configured (Sentry or equivalent) — can add later
- [ ] Uptime monitoring active — can add later
- [ ] GA4 alerts configured (optional but recommended):
  - Tracking outages (zero daily pageviews)
  - Zero form submissions after paid spend
  - Conversion drop >20%
- [ ] Email alerts to ops team (optional for hypercare)
- [ ] Dashboard access granted to team

### 12. Quality Assurance
- [ ] All forms tested end-to-end (form submit → data saved → email sent)
- [ ] 301 redirects tested:
  - [ ] /blog → /insights
  - [ ] /staffing/mlops → /staffing/ai-ml
- [ ] Mobile responsiveness verified (375px, 768px, 1024px)
- [ ] Accessibility smoke test (keyboard nav, screen reader, WCAG AA)
- [ ] Performance audit (Core Web Vitals, PageSpeed Insights)
- [ ] Canonical URLs verified (https://careersourcegroup.com/*)
- [ ] No residential address anywhere (final grep check)
- [ ] Social icons render correctly with approved URLs
- [ ] Form success states display correctly

### 13. CEO & Stakeholder UAT
- [ ] CEO/founder walked through all major flows
- [ ] Homepage hero copy confirmed correct
- [ ] Contact page reviewed
- [ ] Employer form (/get-started) tested
- [ ] Candidate form (/join-our-bench) tested
- [ ] Client list (Verifone, GoodRco, Snapdocs, Lilt) verified
- [ ] No issues blocking launch

### 14. Team Communication
- [ ] Launch announcement prepared (internal)
- [ ] Support playbook documented
- [ ] On-call team identified (Sept 2-8 hypercare)
- [ ] Rollback procedure documented
- [ ] Team trained on new dashboard/analytics

### 15. Final Verification
- [ ] DNS propagated and working
- [ ] SSL certificate valid
- [ ] https://careersourcegroup.com loads correctly
- [ ] All forms working
- [ ] Analytics firing in GA4 (check real-time)
- [ ] CRM receiving leads (submit test form)
- [ ] Emails sending (check inbox for notifications)
- [ ] No console errors (DevTools)

---

## DEPLOYMENT STEPS

### Build & Deploy
```bash
# Build for production
npm run build

# Deploy to production (your hosting platform)
# Example: vercel deploy --prod
# Or: git push origin main (if using CI/CD)

# Deploy pre-built to Nitro
npx nitro deploy --prebuilt
```

### Immediate Post-Deployment (Within 1 hour)
1. [ ] Verify production site loads (no 500 errors)
2. [ ] Check analytics real-time (GA4 dashboard)
3. [ ] Submit test form (check CRM received it)
4. [ ] Test email submission notification
5. [ ] Verify social icons link to correct profiles
6. [ ] Check mobile on real device

---

## LAUNCH DAY SCHEDULE (Sep 1, 2026)

| Time | Action | Owner |
|------|--------|-------|
| 8:00 AM | Final production verification | DevOps |
| 8:30 AM | CEO walkthrough on live site | Product |
| 9:00 AM | Enable monitoring & alerts | DevOps |
| 9:15 AM | Announce launch (internal) | Marketing |
| 9:30 AM | Monitor dashboard (first hour) | All |
| 10:00 AM | Check form submissions | Sales |
| 11:00 AM | Review analytics first hour | Analytics |
| 12:00 PM | Declare launch successful | CEO |

---

## HYPERCARE PERIOD (Sep 2-8)

Daily standup checklist:
- [ ] Zero critical errors in monitoring
- [ ] Form submissions flowing normally
- [ ] CRM receiving all leads
- [ ] Emails delivering successfully
- [ ] Analytics data accurate
- [ ] No spike in error rates
- [ ] Performance metrics healthy

---

## ROLLBACK PROCEDURE (If needed)

If critical issues discovered:
1. Revert to previous stable build
2. Notify team immediately
3. Document issue
4. Fix and re-deploy

Contact: [On-call number] [On-call email]

---

## POST-LAUNCH (Sep 9+)

- [ ] Disable hypercare standup
- [ ] Transition to standard ops monitoring
- [ ] Analyze first week metrics
- [ ] Collect team feedback
- [ ] Plan next iteration

---

**Prepared by:** Development Team  
**Date:** 2026-08-24  
**Status:** READY FOR DEPLOYMENT
