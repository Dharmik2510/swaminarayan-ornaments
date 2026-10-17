"use client";

import { useMemo } from "react";
import { useCatalog } from "@/hooks/useCatalog";
import { useScrollCraft } from "@/hooks/useScrollCraft";
import { HERO, TOUR } from "@/lib/storefront";
import VitrineHero from "@/components/store/home/VitrineHero";
import MacroTour from "@/components/store/home/MacroTour";
import Tray from "@/components/store/home/Tray";
import Cabinet from "@/components/store/home/Cabinet";
import House from "@/components/store/home/House";
import TilakClose from "@/components/store/home/TilakClose";
import Thread from "@/components/store/home/Thread";

const TRAY_MAX = 6;

export default function Home() {
  const { catalog } = useCatalog();
  const { products, categoriesWithStats } = catalog;

  const { hero, tour, house, tray } = useMemo(() => {
    const byImage = (src: string) => products.find((p) => p.images[0] === src) ?? null;
    const featured = products.filter((p) => p.featured);
    const hero = byImage(HERO.matchImage) ?? featured[0] ?? products[0] ?? null;
    const tour = byImage(TOUR.matchImage);
    const house = byImage("/images/emerald_earrings.png");
    const shown = new Set([hero?.id, tour?.id]);
    const pool = [...featured, ...products.filter((p) => !p.featured)];
    const tray = pool.filter((p) => !shown.has(p.id)).slice(0, TRAY_MAX);
    return { hero, tour, house, tray };
  }, [products]);

  // Remount the engine when the tray's contents change (sample data first,
  // then the live catalog), so its rail and cues track the real elements.
  const version = tray.map((p) => p.id).join("|");
  useScrollCraft(undefined, [version]);

  return (
    <main id="main" className="vt-home">
      <Thread version={version} />
      <div data-bead={hero?.id ?? "hero"} data-bead-name={hero?.name ?? "On view"} data-bead-img={hero?.images[0] ?? ""}>
        <VitrineHero piece={hero} />
      </div>
      <div data-bead={tour?.id ?? "tour"} data-bead-name={tour?.name ?? "Look closer"} data-bead-img={tour?.images[0] ?? ""}>
        <MacroTour piece={tour} />
      </div>
      <Tray pieces={tray} />
      <Cabinet categories={categoriesWithStats} />
      <House piece={house} />
      <TilakClose />
    </main>
  );
}
