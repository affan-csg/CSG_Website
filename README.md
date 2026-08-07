# Career Source Group Website

Modern staffing website for Career Source Group, LLC - a US staffing and talent delivery firm.

## Tech Stack

- **Framework:** TanStack Start (React SSR)
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion + GSAP
- **3D Effects:** Three.js particles
- **Forms:** React Hook Form + Zod

## Features

- Responsive design (mobile-first)
- SEO optimized with JSON-LD structured data
- Three.js animated particles
- Smooth scroll animations
- Dynamic routing for services and global delivery
- Contact and requirement forms
- Blog with CMS-ready structure

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── site/       # Site-specific components
│   └── ui/         # shadcn/ui components
├── content/        # Static content data
├── lib/            # Utilities and helpers
├── routes/         # Page routes (file-based routing)
└── styles.css      # Global styles

public/
├── images/         # Static images
└── favicon.svg     # Site favicon
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
VITE_FORMSPREE_ENDPOINT=your_formspree_id
```

## Deployment

This project can be deployed to:
- Vercel
- Netlify
- Cloudflare Workers
- Any Node.js hosting

## License

© 2024 Career Source Group, LLC. All rights reserved.
