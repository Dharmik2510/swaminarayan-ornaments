// Product data types and mock data for Swaminarayan Ornaments

export type ProductStatus = 'active' | 'draft' | 'archived';

export interface Product {
  id: string;
  name: string;
  description: string;
  carat: 92 | 84;
  category: string;
  tags: string[];
  images: string[];
  featured: boolean;
  status: ProductStatus;
  order: number;
  createdAt: string;
  updatedAt: string;
  seoTitle?: string;
  seoDescription?: string;
  /** @deprecated kept for display-only on existing products */
  priceRange?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  order: number;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  action: 'created' | 'updated' | 'deleted' | 'duplicated';
  entityType: 'product' | 'category';
  entityId: string;
  entityName: string;
  timestamp: string;
  user: string;
}

export const defaultCategories: CategoryItem[] = [
  { id: 'cat-001', name: 'Necklaces',    slug: 'necklaces',    order: 1, createdAt: '2024-01-01' },
  { id: 'cat-002', name: 'Bangles',      slug: 'bangles',      order: 2, createdAt: '2024-01-01' },
  { id: 'cat-003', name: 'Earrings',     slug: 'earrings',     order: 3, createdAt: '2024-01-01' },
  { id: 'cat-004', name: 'Rings',        slug: 'rings',        order: 4, createdAt: '2024-01-01' },
  { id: 'cat-005', name: 'Chains',       slug: 'chains',       order: 5, createdAt: '2024-01-01' },
  { id: 'cat-006', name: 'Bracelets',    slug: 'bracelets',    order: 6, createdAt: '2024-01-01' },
  { id: 'cat-007', name: 'Pendants',     slug: 'pendants',     order: 7, createdAt: '2024-01-01' },
  { id: 'cat-008', name: 'Mangalsutra',  slug: 'mangalsutra',  order: 8, createdAt: '2024-01-01' },
];

export interface ProductSummary {
  id: string;
  name: string;
  category: string;
  carat: 92 | 84;
  tags: string[];
  description: string;
}

export interface ConciergeResult {
  matchIds: string[];
  caption: string;
  understood: {
    category?: string;
    carat?: 92 | 84;
    vibe?: string;
  };
}

export const categories = [
  'All',
  'Necklaces',
  'Bangles',
  'Earrings',
  'Rings',
  'Chains',
  'Bracelets',
  'Pendants',
  'Mangalsutra',
] as const;

export type Category = (typeof categories)[number];

export const mockProducts: Product[] = [
  {
    id: 'prod-001',
    name: 'Royal Kundan Haar',
    description: 'Exquisitely crafted 92-carat gold necklace featuring intricate Kundan work with hand-set uncut diamonds and emeralds. A statement piece for the modern maharani.',
    carat: 92,
    category: 'Necklaces',
    tags: ['kundan', 'bridal', 'premium'],
    priceRange: '₹2,50,000 - ₹3,00,000',
    images: ['/images/emerald_necklace.png'],
    featured: true,
    status: 'active',
    order: 1,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: 'prod-002',
    name: 'Heritage Gold Bangles',
    description: 'Set of 4 hand-crafted 92-carat gold bangles with traditional motifs and detailed filigree work. Each bangle tells a story of timeless craftsmanship.',
    carat: 92,
    category: 'Bangles',
    tags: ['traditional', 'filigree'],
    priceRange: '₹1,80,000 - ₹2,20,000',
    images: ['/images/emerald_bangle.png'],
    featured: true,
    status: 'active',
    order: 2,
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
  },
  {
    id: 'prod-003',
    name: 'Celestial Jhumka',
    description: 'Magnificent 84-carat gold jhumka earrings with cascading gold drops and pearl accents. Inspired by celestial motifs of ancient temples.',
    carat: 84,
    category: 'Earrings',
    tags: ['jhumka', 'temple', 'pearls'],
    priceRange: '₹85,000 - ₹1,10,000',
    images: ['/images/emerald_earrings.png'],
    featured: true,
    status: 'active',
    order: 3,
    createdAt: '2024-02-01',
    updatedAt: '2024-02-01',
  },
  {
    id: 'prod-004',
    name: 'Imperial Signet Ring',
    description: 'Bold 92-carat gold signet ring with geometric patterns and a polished finish. A symbol of power and prestige.',
    carat: 92,
    category: 'Rings',
    tags: ['signet', 'geometric'],
    priceRange: '₹45,000 - ₹65,000',
    images: ['/images/emerald_necklace.png'],
    featured: false,
    status: 'active',
    order: 4,
    createdAt: '2024-02-10',
    updatedAt: '2024-02-10',
  },
  {
    id: 'prod-005',
    name: 'Venetian Gold Chain',
    description: 'Sleek 84-carat gold chain with innovative interlocking links. Modern design meets traditional craftsmanship.',
    carat: 84,
    category: 'Chains',
    tags: ['modern', 'chain'],
    priceRange: '₹1,20,000 - ₹1,50,000',
    images: ['/images/emerald_bangle.png'],
    featured: true,
    status: 'active',
    order: 5,
    createdAt: '2024-02-15',
    updatedAt: '2024-02-15',
  },
  {
    id: 'prod-006',
    name: 'Temple Bracelet',
    description: 'Ornate 92-carat gold bracelet featuring temple-inspired architecture and sacred motifs. A wearable piece of heritage.',
    carat: 92,
    category: 'Bracelets',
    tags: ['temple', 'heritage'],
    priceRange: '₹95,000 - ₹1,25,000',
    images: ['/images/emerald_bangle.png'],
    featured: false,
    status: 'active',
    order: 6,
    createdAt: '2024-03-01',
    updatedAt: '2024-03-01',
  },
  {
    id: 'prod-007',
    name: 'Divine Om Pendant',
    description: 'Spiritual 92-carat gold Om pendant with diamond-cut detailing and a sacred aura. Perfect for daily devotion and style.',
    carat: 92,
    category: 'Pendants',
    tags: ['spiritual', 'om', 'diamond-cut'],
    priceRange: '₹35,000 - ₹55,000',
    images: ['/images/emerald_necklace.png'],
    featured: true,
    status: 'active',
    order: 7,
    createdAt: '2024-03-05',
    updatedAt: '2024-03-05',
  },
  {
    id: 'prod-008',
    name: 'Bridal Mangalsutra',
    description: 'Luxurious 84-carat gold mangalsutra with black bead accents and a stunning central pendant. The epitome of marital bliss.',
    carat: 84,
    category: 'Mangalsutra',
    tags: ['bridal', 'wedding'],
    priceRange: '₹75,000 - ₹1,00,000',
    images: ['/images/emerald_earrings.png'],
    featured: true,
    status: 'active',
    order: 8,
    createdAt: '2024-03-10',
    updatedAt: '2024-03-10',
  },
  {
    id: 'prod-009',
    name: 'Mughal Rose Necklace',
    description: 'Inspired by Mughal gardens, this 84-carat gold necklace features rose motifs with ruby centre stones. An ode to royal romance.',
    carat: 84,
    category: 'Necklaces',
    tags: ['mughal', 'ruby', 'rose'],
    priceRange: '₹3,50,000 - ₹4,00,000',
    images: ['/images/emerald_necklace.png'],
    featured: false,
    status: 'active',
    order: 9,
    createdAt: '2024-03-15',
    updatedAt: '2024-03-15',
  },
  {
    id: 'prod-010',
    name: 'Rajasthani Kada',
    description: 'Robust 92-carat gold kada (bangle) with traditional Rajasthani meenakari work. Bold, beautiful, and undeniably royal.',
    carat: 92,
    category: 'Bangles',
    tags: ['rajasthani', 'meenakari', 'kada'],
    priceRange: '₹2,00,000 - ₹2,50,000',
    images: ['/images/emerald_bangle.png'],
    featured: false,
    status: 'active',
    order: 10,
    createdAt: '2024-03-20',
    updatedAt: '2024-03-20',
  },
  {
    id: 'prod-011',
    name: 'Lotus Drop Earrings',
    description: 'Delicate 92-carat gold earrings shaped like blooming lotus flowers with micro-detailed petals. Pure elegance.',
    carat: 92,
    category: 'Earrings',
    tags: ['lotus', 'floral', 'delicate'],
    priceRange: '₹65,000 - ₹80,000',
    images: ['/images/emerald_earrings.png'],
    featured: false,
    status: 'active',
    order: 11,
    createdAt: '2024-04-01',
    updatedAt: '2024-04-01',
  },
  {
    id: 'prod-012',
    name: 'Diamond-Cut Rope Chain',
    description: 'Stunning 92-carat gold rope chain with diamond-cut finish that catches light from every angle. Timeless sophistication.',
    carat: 92,
    category: 'Chains',
    tags: ['diamond-cut', 'rope', 'chain'],
    priceRange: '₹1,80,000 - ₹2,10,000',
    images: ['/images/emerald_necklace.png'],
    featured: true,
    status: 'active',
    order: 12,
    createdAt: '2024-04-05',
    updatedAt: '2024-04-05',
  },
];
