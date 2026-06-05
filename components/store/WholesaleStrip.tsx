'use client';

import ScrollReveal from './ScrollReveal';

const items = [
  { title: 'Trade pricing', desc: 'Volume-friendly wholesale for retailers & distributors.' },
  { title: '92 & 84 carat', desc: 'Consistent purity across every product line.' },
  { title: 'Scalable catalog', desc: 'Dozens of categories — managed from admin, live on site.' },
  { title: 'Heritage craft', desc: 'Ahmedabad goldsmithing with contemporary finishing.' },
];

export default function WholesaleStrip() {
  return (
    <section className="py-16 md:py-20 border-y border-[var(--store-border)] bg-[var(--store-surface)]/50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {items.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 0.06}>
              <div>
                <h3 className="font-display text-lg text-[var(--store-text)] mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-[var(--store-muted)] leading-relaxed">{item.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
