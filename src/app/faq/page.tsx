'use client';

import * as React from 'react';
import Link from 'next/link';

/* ----------------------------- Types & data ----------------------------- */

type Category =
  | 'General'
  | 'Portfolio'
  | 'CV'
  | 'Cover Letter'
  | 'Privacy'
  | 'Pricing & Support';

type FAQ = {
  q: string;
  a: React.ReactNode;
  category: Category;
};

const FAQS: FAQ[] = [
  {
    category: 'General',
    q: 'What is TheIdealProGen?',
    a: (
      <>
        It’s a toolkit to help you ship a professional portfolio, CV, and cover
        letter in minutes—live preview, beautiful templates, and one-click deploy.
        Your data stays on your device until you export.
      </>
    ),
  },
  {
    category: 'General',
    q: 'Is it really free?',
    a: (
      <>
        Yes. The platform is free to use. If you find it helpful, you can support
        us with a <Link className="underline" href="/donate">coffee</Link>.
      </>
    ),
  },
  {
    category: 'General',
    q: 'How do I switch themes (light / warm light / dark)?',
    a: (
      <>
        Use the theme toggle in the header. We support <strong>light</strong>,
        a calmer <strong>warm light</strong>, and <strong>dark</strong>. All colors
        respect accessibility (AA/AAA) in every mode.
      </>
    ),
  },
  {
    category: 'Portfolio',
    q: 'How do I create and publish a portfolio?',
    a: (
      <>
        Go to <Link className="underline" href="/portfolio">Portfolio Builder</Link>,
        pick a template, edit with live preview, then click <em>Deploy</em> to publish
        your portfolio. We’ll guide you through the repo and branch setup.
      </>
    ),
  },
  {
    category: 'Portfolio',
    q: 'Can I use my own domain?',
    a: (
      <>
        Yes. Point your domain to your portfolio (CNAME). Then add your domain in the
        repo settings. We include basic instructions in the deploy step.
      </>
    ),
  },
  {
    category: 'CV',
    q: 'Are the CV templates ATS-friendly?',
    a: (
      <>
        Yes. We avoid multi-column layouts and image-heavy designs in the core content.
        Export to PDF for applications; you can also export JSON to reuse later.
      </>
    ),
  },
  {
    category: 'CV',
    q: 'Can I customize fonts and colors?',
    a: (
      <>
        Yes. Choose a template and tweak heading sizes, spacing, and accent color.
        Everything stays readable in light and dark.
      </>
    ),
  },
  {
    category: 'Cover Letter',
    q: 'Do you have a structure or prompts for cover letters?',
    a: (
      <>
        Yes—start with our guided template (intro, value, proof, close). You can tailor
        tone and emphasis, then export to PDF.
      </>
    ),
  },
  {
    category: 'Privacy',
    q: 'Do you store my data?',
    a: (
      <>
        By default, your content stays on your device. When you choose to deploy or export,
        we only process what’s required. See our privacy note in the UI.
      </>
    ),
  },
  {
    category: 'Pricing & Support',
    q: 'What does a $5 coffee support?',
    a: (
      <>
        Hosting, templates, and student access. Supporters may see early features and
        extended hosting windows. You can donate on our{' '}
        <Link className="underline" href="/donate">Donate</Link> page.
      </>
    ),
  },
  {
    category: 'Pricing & Support',
    q: 'How do I contact support?',
    a: (
      <>
        Email <a className="underline" href="mailto:support@xaiportfolio.com">support@xaiportfolio.com</a>.
        We aim to respond within 1–2 business days.
      </>
    ),
  },
];

/* ----------------------------- Helpers ----------------------------- */

const ALL_CATEGORIES = ['All', ...Array.from(new Set(FAQS.map((f) => f.category)))] as const;
type FilterCat = typeof ALL_CATEGORIES[number];

function toPlainText(node: React.ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (!node) return '';
  if (Array.isArray(node)) return node.map(toPlainText).join(' ');
  if (React.isValidElement(node)) return toPlainText(node.props.children);
  return '';
}

/* ----------------------------- Page ----------------------------- */

export default function FAQPage() {
  const [query, setQuery] = React.useState('');
  const [active, setActive] = React.useState<FilterCat>('All');

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQS.filter((item) => {
      const matchCat = active === 'All' || item.category === active;
      if (!q) return matchCat;
      const hay = `${item.q} ${toPlainText(item.a)}`.toLowerCase();
      return matchCat && hay.includes(q);
    });
  }, [query, active]);

  // JSON-LD for SEO (use a subset or all)
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: filtered.slice(0, 12).map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: toPlainText(f.a),
      },
    })),
  };

  return (
    <main className="container-app py-12">
      <section className="mx-auto max-w-3xl">
        <header className="mb-6">
          <p className="section-title">Help Center</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground">Frequently Asked Questions</h1>
          <p className="mt-2 text-muted-foreground">
            Quick answers to common questions about portfolio, CV, cover letters, deployment, and privacy.
          </p>
        </header>

        {/* Search */}
        <div className="card p-4">
          <label htmlFor="faq-search" className="sr-only">
            Search FAQs
          </label>
          <input
            id="faq-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search: e.g. deploy, domain, ATS, privacy…"
            className="w-full rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--card))] px-3 py-2 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
            autoComplete="off"
            aria-describedby="faq-count"
          />
          <div id="faq-count" className="mt-2 text-xs text-muted-foreground">
            {filtered.length} result{filtered.length === 1 ? '' : 's'}
          </div>

          {/* Categories */}
          <div className="mt-3 flex flex-wrap gap-2">
            {ALL_CATEGORIES.map((cat) => {
              const isActive = cat === active;
              return (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className={
                    isActive
                      ? 'btn btn-secondary'
                      : 'btn btn-ghost'
                  }
                  aria-pressed={isActive}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ list */}
        <div className="mt-6 space-y-3">
          {filtered.map((f, i) => (
            <details
              key={`${f.q}-${i}`}
              className="group rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 transition-shadow hover:shadow-[0_1px_2px_hsl(var(--overlay-1)),0_8px_24px_hsl(var(--overlay-2))]"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-foreground">{f.q}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{f.category}</div>
                </div>
                <span
                  aria-hidden
                  className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-md border border-[hsl(var(--border))] text-[hsl(var(--foreground))]"
                >
                  {/* plus/minus icon with CSS only */}
                  <span className="block h-0.5 w-3 bg-[hsl(var(--foreground))] transition-transform group-open:rotate-180" />
                  <span className="absolute block h-3 w-0.5 bg-[hsl(var(--foreground))] transition-opacity group-open:opacity-0" />
                </span>
              </summary>
              <div className="mt-3 text-sm text-foreground">
                {f.a}
              </div>
            </details>
          ))}

          {filtered.length === 0 && (
            <div className="card p-6 text-center">
              <p className="text-sm text-muted-foreground">
                No results. Try another keyword or browse categories.
              </p>
            </div>
          )}
        </div>

        {/* Still need help */}
        <div className="mt-8 card p-6">
          <h2 className="text-base font-semibold text-foreground">Still need help?</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Email <a className="underline" href="mailto:support@xaiportfolio.com">support@xaiportfolio.com</a>{' '}
            or say hello on{' '}
            <a
              className="underline"
              href="https://twitter.com/xaiportfolio"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter/X
            </a>
            . You can also chip in a coffee on our{' '}
            <Link className="underline" href="/donate">Donate</Link> page.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/portfolio" className="btn btn-primary">Create Portfolio</Link>
            <Link href="/cv" className="btn btn-ghost">Build CV</Link>
            <Link href="/cl" className="btn btn-ghost">Cover Letter</Link>
          </div>
        </div>
      </section>

      {/* SEO: FAQ schema */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </main>
  );
}
