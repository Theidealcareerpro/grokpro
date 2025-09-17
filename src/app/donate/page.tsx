'use client';

import * as React from 'react';

export default function DonatePage() {
  // Optional: if you want a simple visual goal; tweak values or remove.
  const goal = 100;    // coffees
  const raised = 25;   // coffees (example)
  const pct = Math.max(0, Math.min(100, Math.round((raised / goal) * 100)));

  return (
    <main className="container-app max-w-3xl py-12">
      <section className="card p-8">
        <header className="mb-4">
          <p className="section-title">Support TheIdealProGen</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground">
            Support Us
          </h1>
          <p className="mt-2 text-muted-foreground">
            Your $5 coffee keeps this platform free for students and early-career professionals. Thank you!
          </p>
        </header>

        {/* Primary CTAs */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {/* Official Buy Me a Coffee button */}
          <a
            href="buymeacoffee.com/theidealcag"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Buy me a coffee on Buy Me a Coffee"
            className="inline-block"
          >
            <img
              src="https://img.buymeacoffee.com/button-api/?text=Buy%20me%20a%20coffee&emoji=☕&slug=theidealprogen&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=FF0000"
              alt="Buy Me a Coffee"
              className="h-12 w-auto"
              loading="lazy"
              decoding="async"
            />
          </a>

          {/* Amount shortcuts — all route to the same external page */}
          {['$5', '$10', '$25'].map((amt) => (
            <a
              key={amt}
              href="https://www.buymeacoffee.com/theidealprogen"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              aria-label={`Donate ${amt} on Buy Me a Coffee`}
            >
              Give {amt}
            </a>
          ))}
        </div>

        {/* Community goal (optional visual) */}
        <div className="mt-8">
          <h2 className="text-base font-semibold text-foreground">Community Goal</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Goal: {goal} coffees • Raised: {raised} coffees
          </p>
          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-[hsl(var(--border))]">
            <div
              className="h-full rounded-full bg-[hsl(var(--primary))] transition-[width] duration-700 ease-out"
              style={{ width: `${pct}%` }}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={pct}
              aria-label="Donation progress"
            />
          </div>
        </div>

        {/* Trust bullets */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { title: 'Transparent', desc: 'Donations fund hosting and free student access.' },
            { title: 'Secure', desc: 'Payments handled by Buy Me a Coffee.' },
            { title: 'Impactful', desc: 'Every coffee helps more people publish.' },
          ].map((f) => (
            <div key={f.title} className="card p-4">
              <div className="text-sm font-semibold text-foreground">
                {f.title}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Small print */}
        <p className="mt-8 text-xs text-muted-foreground">
          We don’t store your payment details. External links open in a new tab.
        </p>
      </section>
    </main>
  );
}
