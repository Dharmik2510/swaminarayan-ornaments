import { defaultCategories, mockProducts } from '@/lib/data';
import type { CategoryItem, Product } from '@/lib/data';

export const ALL_CATEGORY = 'All' as const;
export type CategoryFilter = typeof ALL_CATEGORY | string;

export interface CategoryWithStats {
  id: string;
  name: string;
  slug: string;
  description?: string;
  order: number;
  productCount: number;
  image: string | null;
}

export interface CatalogData {
  products: Product[];
  categories: CategoryItem[];
  categoryFilters: CategoryFilter[];
  categoriesWithStats: CategoryWithStats[];
}

const FIRESTORE_TIMEOUT_MS = 5000;

export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), ms)
    ),
  ]);
}

function activeProducts(products: Product[]): Product[] {
  return products.filter((p) => p.status === 'active');
}

export function buildCategoryFilters(categoryNames: string[]): CategoryFilter[] {
  const unique = [...new Set(categoryNames.map((n) => n.trim()).filter(Boolean))];
  unique.sort((a, b) => a.localeCompare(b));
  return [ALL_CATEGORY, ...unique];
}

export function buildCategoriesWithStats(
  categories: CategoryItem[],
  products: Product[]
): CategoryWithStats[] {
  const active = activeProducts(products);
  return [...categories]
    .sort((a, b) => a.order - b.order)
    .map((cat) => {
      const catProducts = active.filter((p) => p.category === cat.name);
      const firstImage =
        catProducts.find((p) => p.images?.length)?.images?.[0] ?? null;
      return {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        order: cat.order,
        productCount: catProducts.length,
        image: firstImage,
      };
    });
}

export function filterProducts(
  products: Product[],
  options: {
    category?: CategoryFilter;
    carat?: 'all' | 92 | 84;
    search?: string;
  }
): Product[] {
  const q = options.search?.trim().toLowerCase() ?? '';
  return products.filter((product) => {
    const caratMatch =
      !options.carat || options.carat === 'all' || product.carat === options.carat;
    const categoryMatch =
      !options.category ||
      options.category === ALL_CATEGORY ||
      product.category === options.category;
    const searchMatch =
      !q ||
      product.name.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q) ||
      product.category.toLowerCase().includes(q) ||
      product.tags.some((t) => t.toLowerCase().includes(q));
    return caratMatch && categoryMatch && searchMatch;
  });
}

export function sortProducts(
  products: Product[],
  sortBy: 'default' | 'name-asc' | 'name-desc' | 'newest' | 'oldest'
): Product[] {
  const result = [...products];
  switch (sortBy) {
    case 'name-asc':
      return result.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return result.sort((a, b) => b.name.localeCompare(a.name));
    case 'newest':
      return result.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case 'oldest':
      return result.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    default:
      return result.sort(
        (a, b) =>
          (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || a.order - b.order
      );
  }
}

export async function loadCatalog(): Promise<CatalogData> {
  let products: Product[] = mockProducts;
  let categories: CategoryItem[] = defaultCategories;

  try {
    const { getCategories, getProducts } = await import('@/lib/firebase-db');
    const [cats, prods] = await withTimeout(
      Promise.all([getCategories(), getProducts()]),
      FIRESTORE_TIMEOUT_MS
    );
    if (cats.length > 0) categories = cats;
    if (prods.length > 0) products = prods;
  } catch {
    // fall back to mock data
  }

  const active = activeProducts(products);
  const categoryNames = categories.map((c) => c.name);
  const productOnlyNames = active
    .map((p) => p.category)
    .filter((name) => !categoryNames.includes(name));
  const mergedNames = [...categoryNames, ...productOnlyNames];

  return {
    products: active,
    categories,
    categoryFilters: buildCategoryFilters(mergedNames),
    categoriesWithStats: buildCategoriesWithStats(categories, products),
  };
}
