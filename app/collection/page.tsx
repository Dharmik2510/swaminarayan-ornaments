"use client";
import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import StoreLayout from "@/components/store/StoreLayout";
import AtelierProduct from "@/components/store/AtelierProduct";
import { useCatalog } from "@/hooks/useCatalog";
import { filterProducts, sortProducts } from "@/lib/catalog";
function Collection() {
  const { catalog } = useCatalog();
  const params = useSearchParams();
  const router = useRouter();
  const category = params.get("category") || "All";
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"default" | "name-asc" | "newest">(
    "default",
  );
  const products = sortProducts(
    filterProducts(catalog.products, { category, search: query }),
    sort,
  );
  const selectCategory = (name: string) =>
    router.replace(
      name === "All"
        ? "/collection"
        : `/collection?category=${encodeURIComponent(name)}`,
      { scroll: false },
    );
  return (
    <StoreLayout>
      <main id="main-content" className="catalog-main">
        <div className="catalog-title">
          <span className="eyebrow">The Swaminarayan collection</span>
          <h1>
            A little extraordinary.
            <br />
            <em>Entirely yours.</em>
          </h1>
          <p>
            Explore the collection. Save your favourites. Start a conversation.
          </p>
        </div>
        <div className="catalog-tools">
          <label className="catalog-search">
            <Search size={18} />
            <input
              type="search"
              placeholder="Search for a piece…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search collection"
            />
            {query && (
              <button
                className="icon-button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </label>
          <label className="catalog-sort">
            Sort by{" "}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
            >
              <option value="default">Our selection</option>
              <option value="name-asc">Name A–Z</option>
              <option value="newest">Newest first</option>
            </select>
          </label>
        </div>
        <div className="catalog-categories" aria-label="Filter by category">
          {catalog.categoryFilters.map((name) => (
            <button
              key={name}
              onClick={() => selectCategory(name)}
              aria-pressed={category === name}
              className={category === name ? "active" : ""}
            >
              {name}
            </button>
          ))}
        </div>
        <div className="catalog-count" aria-live="polite">
          <span>{category === "All" ? "All pieces" : category}</span>
          <span>
            {products.length} {products.length === 1 ? "piece" : "pieces"}
          </span>
        </div>
        {products.length ? (
          <div className="product-grid catalog-grid">
            {products.map((p) => (
              <AtelierProduct key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="catalog-empty">
            <span aria-hidden="true">✧</span>
            <h2>A new discovery awaits.</h2>
            <p>
              No pieces match this selection. Try another category or search.
            </p>
            <button
              className="atelier-button"
              onClick={() => {
                setQuery("");
                selectCategory("All");
              }}
            >
              Explore all pieces
            </button>
          </div>
        )}
      </main>
    </StoreLayout>
  );
}
export default function CollectionPage() {
  return (
    <Suspense
      fallback={
        <div className="atelier catalog-loading" role="status">
          Opening the collection…
        </div>
      }
    >
      <Collection />
    </Suspense>
  );
}
