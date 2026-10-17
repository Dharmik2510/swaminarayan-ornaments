"use client";

import { Suspense, useMemo, useState, type CSSProperties } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCatalog } from "@/hooks/useCatalog";
import { filterProducts, sortProducts } from "@/lib/catalog";
import { PieceLabel, PiecePhoto, SaveButton } from "@/components/store/Piece";
import { useSelection } from "@/components/store/Selection";

type Sort = "default" | "name-asc" | "newest";

function Shelf() {
  const { catalog } = useCatalog();
  const { openPiece } = useSelection();
  const params = useSearchParams();
  const router = useRouter();
  const category = params.get("category") || "All";
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("default");

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    catalog.products.forEach((p) => m.set(p.category, (m.get(p.category) ?? 0) + 1));
    return m;
  }, [catalog.products]);

  // Only drawers that hold something get a tab; the rest live in the cabinet.
  const tabs = catalog.categoryFilters.filter((c) => c === "All" || (counts.get(c) ?? 0) > 0 || c === category);

  const products = sortProducts(filterProducts(catalog.products, { category, search: query }), sort);

  const choose = (name: string) =>
    router.replace(name === "All" ? "/collection" : `/collection?category=${encodeURIComponent(name)}`, {
      scroll: false,
    });

  return (
    <main id="main" className="vt-shelf" data-ground="light">
      <header className="vt-shelf__head">
        <h1 className="vt-display">
          The <em>collection.</em>
        </h1>
        <p>
          Every piece on view, each with the same label. Open one for its full description, and save
          the pieces you want to ask about.
        </p>
      </header>

      <div className="vt-shelf__tools">
        <div className="vt-shelf__cats" role="group" aria-label="Filter by category">
          {tabs.map((name) => (
            <button key={name} type="button" aria-pressed={category === name} onClick={() => choose(name)}>
              {name}
              {name !== "All" && <sup>{counts.get(name) ?? 0}</sup>}
            </button>
          ))}
        </div>
        <label className="vt-search">
          <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
            <circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
            <path d="M12.6 12.6 L17 17" stroke="currentColor" strokeWidth="1.3" />
          </svg>
          <input
            type="search"
            placeholder="Search by name, stone, style"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search the collection"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
              <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true">
                <path d="M5 5 L15 15 M15 5 L5 15" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </button>
          )}
        </label>
        <label className="vt-sort">
          Sort
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            <option value="default">Our selection</option>
            <option value="name-asc">Name, A to Z</option>
            <option value="newest">Newest first</option>
          </select>
        </label>
      </div>

      <p className="vt-shelf__count" aria-live="polite">
        <span>{category === "All" ? "All pieces" : category}</span>
        <span>
          {products.length} {products.length === 1 ? "piece" : "pieces"}
        </span>
      </p>

      {products.length > 0 ? (
        <ul className="vt-wall" key={`${category}|${sort}`}>
          {products.map((p, i) => (
            <li key={p.id} className="vt-card" style={{ "--i": i } as CSSProperties}>
              <button type="button" className="vt-card__frame" onClick={() => openPiece(p)} aria-label={`View ${p.name}`}>
                <PiecePhoto
                  src={p.images[0]}
                  alt={p.name}
                  sizes="(max-width: 600px) 92vw, (max-width: 1100px) 45vw, 24vw"
                  preload={i < 4}
                />
              </button>
              <div className="vt-card__label">
                <PieceLabel product={p} compact />
                <SaveButton product={p} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="vt-empty">
          <h2 className="vt-display vt-display--sm">
            Nothing in this <em>drawer</em> yet.
          </h2>
          <p>
            {query
              ? `No piece matches “${query}”. Try a stone, a style or a category instead.`
              : "This category has no pieces online. Enquire, and the house will show you what it holds."}
          </p>
          <button
            type="button"
            className="vt-button vt-button--solid"
            onClick={() => {
              setQuery("");
              choose("All");
            }}
          >
            Show all pieces
          </button>
        </div>
      )}
    </main>
  );
}

export default function CollectionPage() {
  return (
    <Suspense fallback={<main id="main" className="vt-shelf" data-ground="light" aria-busy="true" />}>
      <Shelf />
    </Suspense>
  );
}
