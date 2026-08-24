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
