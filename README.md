# PropertyVault UK

UK property platform covering investor tools, education, listings, and landlord management. Built with Next.js and deployed on Vercel.

## Sub-brands

The codebase hosts four products under one Next.js app, each routed from `src/app`:

| Area | Route | What it is |
| --- | --- | --- |
| **PropertyVault** | `/` | Main site — calculators, guides, blog, guaranteed rent, deal sourcing |
| **Academy** | `/academy` | Courses, lessons, certificates, playbooks, and deal reviews |
| **Makan** | `/makan` | Property listings and enquiries, with per-country pages |
| **Rentura** | `/rentura` | Landlord management — properties, tenancies, arrears, compliance, tax |

## What's in here

- **22 calculators** (`src/app/calculators`) — stamp duty, BTL mortgage, rental yield, BRRR, Section 24, capital gains, and more
- **21 blog posts** (`src/app/blog`) — long-form UK property guides
- **19 document templates** (`src/app/templates`) — AST, Section 8/13 notices, inventories, inspection records
- **41 downloadable documents** (`public/downloads`) — printable checklists and letters for landlords, buyers, and commercial

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router) with React 19 and TypeScript
- [Tailwind CSS 4](https://tailwindcss.com) for styling
- [Supabase](https://supabase.com) for auth and data
- [Stripe](https://stripe.com) for subscriptions and checkout
- [Resend](https://resend.com) with React Email for transactional mail
- [Anthropic SDK](https://docs.anthropic.com) for the Rentura assistant and document extraction
- Chart.js, Framer Motion, and jsPDF for charts, motion, and PDF export

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Create a `.env.local` in the project root. This file is gitignored — never commit real keys.

```bash
# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_EMAIL=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=


# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID=
RENTURA_STRIPE_PRICE_ID=

# Email
RESEND_API_KEY=

# AI
ANTHROPIC_API_KEY=

# Scheduled jobs
CRON_SECRET=
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run Vitest |

## Project structure

```
src/
  app/           Routes (App Router) — PropertyVault, Academy, Makan, Rentura
    api/         Route handlers — Stripe, Rentura, tenant, notifications
    calculators/ Investor calculators
    blog/        Blog posts
    templates/   Printable document templates
  components/    Shared UI — layout, calculators, blog, Rentura
  lib/           Supabase client, auth and language context, shared types
  emails/        React Email templates
public/          Static assets and downloadable documents
```

## Contributing

Read [AGENTS.md](AGENTS.md) before making changes. This project runs a Next.js version newer than most training data, so check the bundled docs in `node_modules/next/dist/docs/` rather than relying on remembered APIs.

## Deployment

Deployed on [Vercel](https://vercel.com). Pushes to `master` deploy to production; see `vercel.json` for configuration.
