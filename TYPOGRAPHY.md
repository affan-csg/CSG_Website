# Typography System — Career Source Group

## Overview

This document outlines the premium typography system for the Career Source Group website, built on **Manrope** (weights: 400, 500, 600, 700, 800).

All typography is managed through reusable utility classes defined in `src/styles.css`. Do not use hardcoded font sizes or weights in components—always use the provided utilities.

---

## Font Stack

```css
--font-display: "Manrope", ui-sans-serif, system-ui, sans-serif;
--font-sans: "Manrope", ui-sans-serif, system-ui, sans-serif;
--font-mono: "JetBrains Mono", ui-monospace, monospace;
```

**Manrope** is imported from Google Fonts with weights: **400, 500, 600, 700, 800**

---

## Typography Utilities

### Headings

#### `heading-hero`
**Large, confident, editorial hero headings**
- Font: Manrope Bold (700)
- Size: `clamp(2.375rem, 5vw, 4.5rem)` (38-72px responsive)
- Line Height: 1.05
- Letter Spacing: -0.045em
- Usage: Main page hero h1 elements

#### `heading-section`
**Major section headings**
- Font: Manrope Bold (700)
- Size: `clamp(2rem, 4vw, 3.75rem)` (32-60px responsive)
- Line Height: 1.08
- Letter Spacing: -0.04em
- Usage: Page section h2 elements

#### `heading-subsection`
**Sub-section and smaller headings**
- Font: Manrope SemiBold (600)
- Size: `clamp(1.125rem, 1.75vw, 1.75rem)` (18-28px responsive)
- Line Height: 1.2
- Letter Spacing: -0.025em
- Usage: Card titles, subsection headings

### Body Text

#### `body-copy`
**Primary readable content**
- Font: Manrope Regular (400)
- Size: `clamp(0.9375rem, 1.2vw, 1.125rem)` (15-18px responsive)
- Line Height: 1.65
- Letter Spacing: normal
- Usage: Main paragraph content, descriptions

#### `body-small`
**Secondary readable content**
- Font: Manrope Regular (400)
- Size: 15px
- Line Height: 1.6
- Letter Spacing: normal
- Usage: Supporting text, error messages

### Navigation

#### `nav-text`
**Navigation items and links**
- Font: Manrope Medium (500)
- Size: `clamp(14px, 0.9vw, 16px)`
- Line Height: 1.4
- Letter Spacing: 0.01em
- Usage: Main navigation, top nav items

### Labels & Eyebrows

#### `eyebrow`
**Small uppercase labels above headings**
- Font: Manrope SemiBold (600)
- Size: 12px
- Line Height: 1.3
- Letter Spacing: 0.1em
- Color: Gold
- Usage: Section labels, category tags

#### `eyebrow-lg`
**Larger eyebrow variant**
- Font: Manrope SemiBold (600)
- Size: 13px
- Line Height: 1.3
- Letter Spacing: 0.12em
- Color: Gold
- Usage: Premium eyebrow spacing

#### `label-small`
**Compact labels for tight layouts**
- Font: Manrope SemiBold (600)
- Size: 12px
- Line Height: 1.3
- Letter Spacing: 0.1em
- Usage: Form labels, metadata, small tags

#### `form-label-small`
**Form field labels (compact)**
- Font: Manrope SemiBold (600)
- Size: 11px
- Line Height: 1.3
- Letter Spacing: 0.08em
- Uppercase: Yes
- Usage: Form input labels

### Buttons & CTAs

#### `button-text`
**Primary button text**
- Font: Manrope SemiBold (600)
- Size: 15px
- Line Height: 1.3
- Letter Spacing: 0.02em
- Usage: Button text, call-to-action links

#### `button-text-lg`
**Large button variant**
- Font: Manrope SemiBold (600)
- Size: 16px
- Line Height: 1.3
- Letter Spacing: 0.01em
- Usage: Prominent primary buttons

### Forms

#### `form-label`
**Standard form labels**
- Font: Manrope SemiBold (600)
- Size: 14px
- Line Height: 1.4
- Letter Spacing: normal
- Usage: Form input labels (standard size)

#### `form-input`
**Form input text**
- Font: Manrope Regular (400)
- Size: 15px
- Line Height: 1.5
- Letter Spacing: normal
- Usage: Input fields, select dropdowns, textareas

### Cards & Components

#### `card-title`
**Card headings**
- Font: Manrope SemiBold (600)
- Size: `clamp(1.25rem, 1.3vw, 1.625rem)` (20-26px responsive)
- Line Height: 1.3
- Letter Spacing: -0.01em
- Usage: Card titles, component headings

#### `card-description`
**Card supporting text**
- Font: Manrope Regular (400)
- Size: 15px
- Line Height: 1.6
- Letter Spacing: normal
- Usage: Card descriptions, meta content

#### `card-meta`
**Card metadata**
- Font: Manrope Medium (500)
- Size: 13px
- Line Height: 1.3
- Letter Spacing: normal
- Usage: Dates, tags, secondary info

### Statistics

#### `stat-value`
**Large statistics and numbers**
- Font: Manrope ExtraBold (800)
- Size: `clamp(2.5rem, 5vw, 3.5rem)` (40-56px responsive)
- Line Height: 1.0
- Letter Spacing: -0.05em
- Usage: Large numbers, percentages, values

#### `stat-label`
**Supporting text for statistics**
- Font: Manrope Medium (500)
- Size: 14px
- Line Height: 1.4
- Letter Spacing: normal
- Usage: Stat descriptions, labels

### Testimonials

#### `testimonial-quote`
**Testimonial body text**
- Font: Manrope Regular (400)
- Size: `clamp(15px, 1.1vw, 17px)` (15-17px responsive)
- Line Height: 1.7
- Letter Spacing: normal
- Usage: Testimonial quotes, pull quotes

#### `testimonial-author`
**Testimonial author name/title**
- Font: Manrope SemiBold (600)
- Size: 14px
- Line Height: 1.3
- Letter Spacing: -0.01em
- Usage: Author names, titles in testimonials

### Small Text

#### `footer-text`
**Footer text and small links**
- Font: Manrope Regular (400)
- Size: 13px
- Line Height: 1.5
- Letter Spacing: normal
- Usage: Footer content, small links

#### `caption-text`
**Very small supporting text**
- Font: Manrope Regular (400)
- Size: 12px
- Line Height: 1.4
- Letter Spacing: normal
- Usage: Captions, very small hints, legal text

#### `badge-text`
**Badge and pill text**
- Font: Manrope SemiBold (600)
- Size: 11px
- Line Height: 1.2
- Letter Spacing: 0.08em
- Uppercase: Yes
- Usage: Badge labels, pills, tags

---

## Letter Spacing Guidelines

- **Large Headings**: -0.03em to -0.055em (tighter spacing)
- **Body Text**: 0em (normal spacing)
- **Small Uppercase Labels**: 0.08em to 0.14em (loose spacing)

---

## Line Height Guidelines

- **H1/Hero**: 0.95–1.08 (tight, confident)
- **H2/Section**: 1.0–1.1 (clear hierarchy)
- **H3/Subsection**: 1.1–1.2 (readable)
- **Body**: 1.55–1.7 (comfortable reading)
- **Buttons**: 1.2–1.3 (compact, scannable)
- **Small Text/Labels**: 1.2–1.4 (tight to compact)

---

## Usage Examples

### Hero Section
```jsx
<h1 className="heading-hero">Welcome to CSG</h1>
<p className="eyebrow">US · LATAM · Pakistan</p>
<p className="body-copy">Our staffing solution spans three continents...</p>
```

### Section Heading
```jsx
<p className="eyebrow">Why CSG</p>
<h2 className="heading-section">Why choose us?</h2>
<p className="body-copy">We provide transparent, reliable staffing...</p>
```

### Card
```jsx
<h3 className="card-title">DevOps Specialists</h3>
<p className="card-description">Cloud infrastructure and automation experts.</p>
<p className="card-meta">Available in US, LATAM, Pakistan</p>
```

### Form
```jsx
<label className="form-label-small">Email Address</label>
<input className="form-input" type="email" />
```

### Statistics
```jsx
<p className="stat-value">10%</p>
<p className="stat-label">Direct-hire fee vs industry standard 20-30%</p>
```

### Button
```jsx
<button className="button-text bg-cream px-6 py-3 text-navy hover:bg-gold">
  Get Started
</button>
```

---

## Responsive Behavior

All heading and body sizes use `clamp()` for fluid responsive sizing:
- Automatically scales between desktop and mobile
- No media queries needed for typography
- Ensures readability on all screen sizes

Example: `font-size: clamp(2.375rem, 5vw, 4.5rem);`
- Min: 2.375rem (38px)
- Preferred: 5vw (scales with viewport)
- Max: 4.5rem (72px)

---

## Font Smoothing

Global font smoothing is applied for optimal rendering:
```css
html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}
```

---

## DO's and DON'Ts

### ✅ DO
- Use typography utilities for all text styling
- Follow the typography hierarchy
- Use appropriate weights for emphasis (not just size)
- Test responsive sizing on mobile, tablet, and desktop
- Maintain readability (55-75 characters per line for body)

### ❌ DON'T
- Hardcode font sizes (`text-[16px]`)
- Mix multiple unrelated fonts
- Use excessive bold or weight for emphasis
- Apply negative letter-spacing to body text
- Make every element oversized

---

## Color Integration

Typography inherits color from utility classes:
- `text-foreground` - Main body text (cream)
- `text-muted-foreground` - Secondary text (lighter gray)
- `text-gold` - Accent text (eyebrows, links)
- `text-navy` - Dark text on light backgrounds

---

## Accessibility

All typography choices maintain:
- **Contrast**: WCAG AA compliance (4.5:1 minimum for body)
- **Readability**: Font sizes never below 14px (except labels)
- **Line Height**: Minimum 1.5 for body text
- **Focus States**: Visible keyboard navigation
- **Semantic HTML**: Proper h1-h6 hierarchy

---

## Future Updates

When updating typography:
1. Update the utility class in `src/styles.css`
2. All components using that utility automatically update
3. Test responsive sizing on all devices
4. Verify contrast ratios for accessibility
5. Ensure no regressions in existing pages

---

Last Updated: August 2026
System: Manrope Premium Typography
