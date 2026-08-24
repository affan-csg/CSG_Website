# Google Analytics 4 Setup Guide

## Why It's Not in .env Yet

GA4 is **optional for launch** — the site works fine without it. We built the analytics module to gracefully skip GA4 if the ID isn't configured.

**You only need GA4 if you want to:**
- Track user behavior (page views, clicks)
- Monitor form submissions
- See where traffic comes from
- Measure conversions

---

## What You Need (Not an API Key — a Property ID)

GA4 doesn't use an API key like HubSpot. It uses a **Measurement ID** (looks like `G-XXXXXXXXXX`).

### Step 1: Create GA4 Property in Google Analytics

1. Go to https://analytics.google.com
2. Sign in with Google account that owns careersourcegroup.com
3. Click **Admin** (bottom left)
4. Click **Create Property**
5. Name it: "Career Source Group Production"
6. Select **Web**
7. Enter website URL: `https://careersourcegroup.com`
8. Agree to terms
9. Click **Create**

### Step 2: Get Your Measurement ID

After creating the property:

1. Click **Data Streams** (left menu)
2. Click your web data stream
3. You'll see **Measurement ID** at the top — looks like `G-XXXXXXXXXX`
4. Copy this ID

### Step 3: Add to .env.production

```env
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX  # (paste your ID here)
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

That's it. No other setup needed.

---

## How It Works (What's Already Built)

Our code (`src/lib/analytics.ts`) handles everything:

1. **On page load:** Loads Google's gtag script and initializes with your GA4_ID
2. **On form submit:** Fires event with form details (no personal info)
3. **On page view:** Tracks which pages people visit
4. **On CTA clicks:** Records clicks to "Request Talent" etc.

### What We DON'T Track (Privacy)

✅ Safely excluded from GA4:
- Email addresses
- Phone numbers
- Resume files
- Compensation/salary info
- Work authorization status
- Any personal data

GA4 only sees:
- Page views
- Button clicks
- Form submissions (count only, not data)
- Traffic source (Google, LinkedIn, etc.)
- Device type (mobile/desktop)
- Location (country/region, not specific address)

---

## Timeline

**Sep 1:** Launch WITHOUT GA4 (NEXT_PUBLIC_ENABLE_ANALYTICS=false)
- Site works perfectly
- Forms submit normally
- Emails send normally
- No tracking overhead

**Sep 2-8 (Hypercare):** Add GA4 if desired
- Set up GA4 property
- Add GA4_ID to .env.production
- Redeploy with NEXT_PUBLIC_ENABLE_ANALYTICS=true
- Start tracking user behavior

---

## Why We Deferred It

1. **Not blocking launch** — forms work without it
2. **Can be added anytime** — no database changes needed
3. **Low risk** — it's just tracking; no dependencies
4. **Flexibility** — might want Mixpanel or other tool instead

---

## Dashboard Setup (Optional)

Once GA4 is running, you can create a dashboard in Looker Studio:

1. Go to https://looker.studio
2. Click **Create** → **Report**
3. Connect Google Analytics 4 data source
4. Add charts:
   - Sessions over time
   - Form submissions by day
   - Top landing pages
   - Traffic sources

---

## TL;DR

- **No API key needed** — just a Measurement ID from Google Analytics
- **Launch without it** — it's optional
- **Add within first week** — low-effort, high-value
- **Code is ready** — we built it, just need the GA4_ID

Not adding it to .env.local/production right now keeps launch simple.
When you're ready to track, create GA4 property, grab the ID, add it, done.

---

# ALL 4 OPTIONAL POST-LAUNCH TASKS

## Task 1: Google Analytics 4 (GA4)

**What it's for:** Track user behavior, page views, form submissions, traffic sources

**How to do it:**

1. Go to https://analytics.google.com
2. Sign in with Google account
3. Click **Admin** → **Create Property**
4. Name: "Career Source Group Production"
5. Select **Web**, enter URL: `https://careersourcegroup.com`
6. Click **Create**
7. Click **Data Streams** → your web stream
8. Copy **Measurement ID** (looks like `G-XXXXXXXXXX`)
9. Update `.env.production`:
   ```
   NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
   NEXT_PUBLIC_ENABLE_ANALYTICS=true
   ```
10. Redeploy site
11. Wait 24 hours for data to appear in GA4 dashboard

**Time to complete:** 10 minutes

---

## Task 2: Google Search Console

**What it's for:** Monitor search visibility, see what Google knows about your site, fix indexing issues

**How to do it:**

1. Go to https://search.google.com/search-console
2. Click **Add property**
3. Select **URL prefix** → enter `https://careersourcegroup.com`
4. Verify ownership (choose method):
   - **HTML file:** Download file, upload to root of website
   - **Domain name:** Add DNS record (easiest if you have DNS access)
   - **Google Analytics:** If GA4 is set up (recommended)
5. Click **Verify**
6. Once verified, click **Sitemaps** (left menu)
7. Enter: `https://careersourcegroup.com/sitemap.xml`
8. Click **Submit**
9. Check **Coverage** report to see which pages are indexed

**Time to complete:** 15 minutes

**Typical first-week results:**
- Day 1-2: Pages discovered
- Day 3-7: Most pages indexed
- By end of week: 30-40 pages in Google index

---

## Task 3: Dashboard / BI Tool (Looker Studio)

**What it's for:** Visualize analytics data, track form submissions, monitor traffic trends

**How to do it:**

1. Go to https://looker.studio
2. Click **Create** → **Report**
3. When prompted for data source, click **Create new data source**
4. Select **Google Analytics 4**
5. Choose your GA4 property
6. Click **Connect**
7. Name it: "Career Source Group Analytics"
8. Click **Create Report**
9. In the report, click **Insert** → **Table**
10. Add charts for:
    - **Sessions by date** (line chart)
    - **Top landing pages** (table)
    - **Form submissions** (metric card)
    - **Traffic sources** (pie chart)
11. Save the report
12. Share link with team

**Example dashboard metrics:**
- Sessions (visitors)
- Page views
- Form submission rate
- Top pages (where users spend time)
- Traffic sources (Google, LinkedIn, direct)
- Device breakdown (mobile vs desktop)

**Time to complete:** 30 minutes

**Pro tip:** Set up recurring email reports (Looker Studio can email dashboard daily/weekly)

---

## Task 4: Monitoring & Alerts (Error Tracking + Uptime)

**What it's for:** Catch bugs in production, know when site goes down, get instant alerts

**How to do it:**

### Part A: Error Tracking (Sentry)

1. Go to https://sentry.io
2. Click **Sign Up** (or **Sign In** if you have account)
3. Create organization: "Career Source Group"
4. Create project: Select **Node.js** (backend), select **React** (frontend)
5. For Node.js project:
   - Copy **DSN** (looks like `https://xxx@sentry.io/xxx`)
   - Add to `.env.production`:
     ```
     SENTRY_DSN=https://xxx@sentry.io/xxx
     ```
6. For React project:
   - Follow setup guide to add to frontend code
7. Redeploy site
8. Any errors automatically sent to Sentry

**How to use:** Go to Sentry dashboard, see errors grouped by type, click to see stack trace + user info

### Part B: Uptime Monitoring (UptimeRobot or Pingdom)

1. Go to https://uptimerobot.com (free tier available)
2. Click **Sign Up**
3. Click **Add New Monitor**
4. Select **HTTP(s)**
5. URL: `https://careersourcegroup.com`
6. Friendly name: "Career Source Group Website"
7. Check interval: Every 5 minutes
8. Add alert contacts (email)
9. Click **Create Monitor**

**What happens:**
- UptimeRobot pings your site every 5 minutes
- If site doesn't respond for 2+ minutes → emails you immediately
- Shows uptime history (target: 99.9%)

### Part C: Slack Alerts (Optional)

1. Connect Sentry to Slack:
   - In Sentry, go **Settings** → **Integrations**
   - Click **Slack**
   - Authorize Slack workspace
   - Errors now appear in a Slack channel automatically

2. Connect UptimeRobot to Slack:
   - In UptimeRobot, go **Settings** → **Alerts**
   - Add **Slack** notification
   - Downtime alerts appear in Slack immediately

**Time to complete:** 45 minutes (both parts)

**What you'll see:**
- Sentry: Every error with stack trace, how many users affected, which page
- UptimeRobot: Green checkmark = site up, Red X = site down
- Slack: Instant alert when something breaks

---

## IMPLEMENTATION TIMELINE

**Sep 1 (Launch day):** Launch without any of these

**Sep 2-3 (Hypercare day 1-2):**
- Set up GA4 (10 min)
- Set up Google Search Console (15 min)
- Set up Sentry error tracking (15 min)

**Sep 4-5 (Hypercare day 3-4):**
- Set up UptimeRobot (5 min)
- Create Looker Studio dashboard (30 min)
- Connect Slack alerts (10 min)

**By Sep 8:** All monitoring in place, team can track everything

---

## COST BREAKDOWN

| Tool | Cost | Notes |
|------|------|-------|
| GA4 | FREE | Unlimited data |
| Search Console | FREE | Unlimited pages |
| Looker Studio | FREE | Unlimited reports |
| Sentry | FREE tier | 5K events/month (enough for most sites) |
| UptimeRobot | FREE tier | 50 monitors, 5 min checks |
| Slack integration | FREE | If you have Slack workspace |

**Total cost for all 4 tools: $0** (until you scale)

---

## WHICH ONES MATTER MOST?

**Priority 1 (do in first week):**
- ✅ GA4 — Understand where traffic comes from
- ✅ Search Console — Make sure Google is indexing you

**Priority 2 (do in second week):**
- ✅ Sentry — Catch bugs before users report them
- ✅ UptimeRobot — Know if site is down

**Priority 3 (nice to have):**
- ✅ Looker Studio — Pretty dashboard for stakeholders
- ✅ Slack alerts — Real-time notifications

---

## QUICK START (COPY/PASTE)

```
DAY 1 (Sep 2):
1. GA4: https://analytics.google.com → Create property → Get G-XXXXXXXXXX
2. Search Console: https://search.google.com/search-console → Verify domain → Submit sitemap

DAY 2 (Sep 3):
1. Sentry: https://sentry.io → Create project → Copy DSN → Add to .env
2. Redeploy with Sentry DSN

DAY 3 (Sep 4):
1. UptimeRobot: https://uptimerobot.com → Add monitor → Set email alerts
2. Looker Studio: https://looker.studio → Connect GA4 → Create charts

Done! 🎉
```
