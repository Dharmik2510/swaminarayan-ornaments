"use client";
import { useRef, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import StoreLayout from "@/components/store/StoreLayout";
import AtelierProduct from "@/components/store/AtelierProduct";
import { useCatalog } from "@/hooks/useCatalog";
function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={false}
      whileInView={reduced ? {} : { y: [24, 0], opacity: [0.65, 1] }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -65]);
  return (
    <section ref={ref} className="atelier-hero">
      <div className="hero-editorial">
        <motion.div style={reduced ? {} : { y: textY }}>
          <span className="eyebrow">
            <span className="little-line" /> A world of timeless ornaments
          </span>
          <h1>
            Some things
            <br />
            are beyond
            <br />
            <em>ordinary.</em>
          </h1>
          <p>
            Jewellery that holds a little more.
            <br />A story. A celebration. A part of you.
          </p>
          <Link href="/collection" className="atelier-button">
            Explore the collection <ArrowUpRight size={18} />
          </Link>
        </motion.div>
        <a href="#collections" className="scroll-cue">
          <span className="scroll-circle">
            <ArrowDown size={17} />
          </span>
          Scroll to discover
        </a>
      </div>
      <div className="hero-photograph">
        <motion.div className="hero-image-layer" style={reduced ? {} : { y }}>
          <Image
            src="/images/emerald_necklace.png"
            alt="Emerald and white stone necklace on deep green velvet"
            fill
            priority
            sizes="(max-width: 700px) 100vw, 56vw"
          />
        </motion.div>
        <div className="hero-photo-top">
          <span>THE ART OF ADORNMENT</span>
          <span>01 — 03</span>
        </div>
        <div className="hero-photo-bottom">
          <span>
            The emerald edit<small>A study in quiet brilliance</small>
          </span>
          <Link
            href="/collection?category=Necklaces"
            aria-label="Explore necklaces"
          >
            <ArrowUpRight size={23} />
          </Link>
        </div>
        <span className="vertical-caption">
          SWAMINARAYAN ORNAMENTS · SELECTED PIECES
        </span>
      </div>
    </section>
  );
}
function DetailStory() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  return (
    <section id="details" ref={ref} className="detail-story">
      <div className="detail-story-image">
        <motion.div style={reduced ? {} : { scale }}>
          <Image
            src="/images/emerald_bangle.png"
            alt="Close-up of an emerald bangle and its intricate stone setting"
            fill
            sizes="(max-width: 700px) 100vw, 55vw"
          />
        </motion.div>
        <span className="image-footnote">
          A closer look. A lasting impression.
        </span>
      </div>
      <div className="detail-story-copy">
        <Reveal>
          <span className="eyebrow">02 / The beauty is in the details</span>
          <h2>
            Made to be seen.
            <br />
            <em>
              Remembered
              <br />
              for how it feels.
            </em>
          </h2>
          <p>
            The curve of a bangle. The fall of a necklace. The way a stone
            catches the light. Discover ornaments where every detail becomes
            part of the whole.
          </p>
          <Link href="/collection?category=Bangles" className="text-link">
            Discover the details <ArrowUpRight size={18} />
          </Link>
        </Reveal>
        <div className="craft-notes">
          <div>
            <span>01</span>
            <h3>Distinctive by nature</h3>
            <p>Expressive forms, considered proportions.</p>
          </div>
          <div>
            <span>02</span>
            <h3>Personal by choice</h3>
            <p>Pieces for your own kind of occasion.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
export default function Home() {
  const { catalog } = useCatalog();
  const featured = catalog.products.filter((p) => p.featured).slice(0, 3);
  return (
    <StoreLayout>
      <main id="main-content">
        <Hero />
        <div className="brand-ribbon">
          <span>Rooted in tradition</span>
          <i>✧</i>
          <span>Chosen with intention</span>
          <i>✧</i>
          <span>Worn with feeling</span>
          <i>✧</i>
          <span>Swaminarayan Ornaments</span>
        </div>
        <section id="collections" className="collection-intro section-space">
          <Reveal className="section-heading">
            <div>
              <span className="eyebrow">01 / The collections</span>
              <h2>
                For every expression
                <br />
                <em>of you.</em>
              </h2>
            </div>
            <div>
              <p>
                From a quiet statement to a grand celebration.
                <br />
                Find the piece that feels like you.
              </p>
              <Link href="/collection" className="text-link">
                View all collections <ArrowUpRight size={18} />
              </Link>
            </div>
          </Reveal>
          <div className="category-editorial">
            {[
              {
                name: "Necklaces",
                image: "emerald_necklace",
                note: "A beautiful beginning",
              },
              {
                name: "Bangles",
                image: "emerald_bangle",
                note: "Grace in every gesture",
              },
              {
                name: "Earrings",
                image: "emerald_earrings",
                note: "The finishing touch",
              },
            ].map((cat, i) => (
              <Reveal key={cat.name}>
                <Link
                  href={`/collection?category=${cat.name}`}
                  className="category-story"
                >
                  <div className="category-image">
                    <Image
                      src={`/images/${cat.image}.png`}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 700px) 90vw, 30vw"
                    />
                    <span className="category-number">0{i + 1}</span>
                  </div>
                  <div className="category-caption">
                    <div>
                      <small>{cat.note}</small>
                      <h3>{cat.name}</h3>
                    </div>
                    <span className="round-arrow">
                      <ArrowUpRight size={20} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
        <DetailStory />
        <section className="section-space featured-section">
          <Reveal className="section-heading">
            <div>
              <span className="eyebrow">03 / A considered selection</span>
              <h2>
                Pieces to <em>fall for.</em>
              </h2>
            </div>
            <Link href="/collection" className="text-link">
              Explore all pieces <ArrowUpRight size={18} />
            </Link>
          </Reveal>
          <div className="product-grid">
            {featured.map((p) => (
              <Reveal key={p.id}>
                <AtelierProduct product={p} />
              </Reveal>
            ))}
          </div>
        </section>
        <section id="story" className="brand-story">
          <span className="eyebrow">04 / The spirit of Swaminarayan</span>
          <Reveal>
            <span className="story-star" aria-hidden="true">
              ✧
            </span>
            <h2>
              Ornaments for today.
              <br />
              <em>Stories for a lifetime.</em>
            </h2>
            <p>
              We believe the most meaningful jewellery is the jewellery that
              becomes part of your story. Inspired by the richness of Indian
              adornment, our collection brings together tradition, expression,
              and a love of beautiful things.
            </p>
            <Link href="/collection" className="text-link">
              Find your next story <ArrowUpRight size={18} />
            </Link>
          </Reveal>
          <span className="story-signature">Swaminarayan Ornaments</span>
        </section>
      </main>
    </StoreLayout>
  );
}
