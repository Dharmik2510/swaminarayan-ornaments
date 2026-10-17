'use client';

import { useEffect, useState } from 'react';
import { getFallbackCatalog, loadCatalog, type CatalogData } from '@/lib/catalog';

export function useCatalog() {
  const [catalog, setCatalog] = useState<CatalogData>(() => getFallbackCatalog());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadCatalog()
      .then((data) => {
        if (!cancelled) setCatalog(data);
      })
      .catch(() => {
        if (!cancelled) setError('Could not load catalog');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { catalog, loading, error };
}
