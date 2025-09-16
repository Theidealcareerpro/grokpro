'use client';

import * as React from 'react';

export default function DonatePage() {
  return (
    <main className="container-app max-w-3xl py-12">
      <section className="card p-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
          Support Us
        </h1>
        <p className="mt-2 text-neutral-700 dark:text-neutral-300">
          Your $5 coffee keeps this platform free for students. Thank you!
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {/* Official Buy Me a Coffee button */}
          <a
            href="https://www.buymeacoffee.com/theidealprogen"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Buy me a coffee"
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

          {/* Simple amount CTAs — all go to the same external page */}
          {['$5', '$10', '$25'].map((amt) => (
            <a
              key={amt}
              href="https://www.buymeacoffee.com/theidealprogen"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              aria-label={`Donate ${amt}`}
            >
              Give {amt}
            </a>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { title: 'Transparent', desc: 'All donations fund hosting and student access.' },
            { title: 'Secure', desc: 'Payments handled by Buy Me a Coffee.' },
            { title: 'Impactful', desc: 'Every coffee keeps it free for more students.' },
          ].map((f) => (
            <div key={f.title} className="card p-4">
              <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                {f.title}
              </div>
              <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
