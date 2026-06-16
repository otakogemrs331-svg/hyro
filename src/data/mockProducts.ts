import { Product } from "@/context/CartContext";

// Initial set of luxury books
const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "The Silent Canopy",
    author: "Aria Vance",
    genre: "Memoir",
    slug: "the-silent-canopy",
    description: "A profound reflection on spending a winter in absolute isolation within the high cedar forests of the Pacific Northwest. Written with poetic clarity, Vance explores the subtle dialogue between human solitude and ancient wood structures.",
    price: 68.00,
    stock: 5,
    category_id: "cat-memoir",
    theme_tags: ["deep-woods", "trail-reading"],
    images: ["#0A251C", "#D4AF37"] // Primary color theme for the cover representation
  },
  {
    id: "prod-2",
    name: "Wanderer's Guide to High Peaks",
    author: "Marcus Valerius",
    genre: "Guidebook",
    slug: "wanderers-guide-high-peaks",
    description: "The definitive cartographical and botanical guide to traversing alpine ridges above 10,000 feet. Features gold foil sketches, detailed terrain assessments, and safety checklists for wilderness mountaineers.",
    price: 85.00,
    stock: 12,
    category_id: "cat-guide",
    theme_tags: ["trail-reading"],
    images: ["#1C2D42", "#C5A059"]
  },
  {
    id: "prod-3",
    name: "Wild Foraging & Alpine Botany",
    author: "Dr. Robert Thorne",
    genre: "Manual",
    slug: "wild-foraging-alpine-botany",
    description: "An exhaustive field manual detailing edible and medicinal flora of sub-alpine valleys. Features hand-drawn diagrams, poisonous look-alike charts, and gourmet trail preparation recipes.",
    price: 110.00,
    stock: 3,
    category_id: "cat-manual",
    theme_tags: ["survival", "deep-woods"],
    images: ["#2B3E2A", "#D4AF37"]
  },
  {
    id: "prod-4",
    name: "Solitude at Timberline",
    author: "Silas Frost",
    genre: "Essays",
    slug: "solitude-at-timberline",
    description: "A collection of short, philosophical essays penned on the wind-swept ridges of the northern Rockies. Frost invites readers to slow down, observe glacial shifts, and re-attune their senses to nature.",
    price: 45.00,
    stock: 20,
    category_id: "cat-essays",
    theme_tags: ["trail-reading"],
    images: ["#3D3425", "#F9F6F0"]
  },
  {
    id: "prod-5",
    name: "The Art of Alpine Woodcraft",
    author: "Elena Rostova",
    genre: "Manual",
    slug: "art-alpine-woodcraft",
    description: "Mastering the elements with nothing but a steel blade and natural cordage. Rostova outlines essential shelter construction, fire-making in damp climates, and basic wooden tool carving.",
    price: 125.00,
    stock: 4,
    category_id: "cat-manual",
    theme_tags: ["survival"],
    images: ["#1F1A13", "#D4AF37"]
  },
  {
    id: "prod-6",
    name: "Echoes of the Ridge",
    author: "John Muir Jr.",
    genre: "Adventure",
    slug: "echoes-of-the-ridge",
    description: "A gripping chronological narrative of a solo, undocumented 800-mile traversal through the rugged cascades. A tale of raw resilience, trail fellowship, and close calls with glacial slides.",
    price: 55.00,
    stock: 8,
    category_id: "cat-adventure",
    theme_tags: ["trail-reading", "deep-woods"],
    images: ["#24152A", "#C8C5BD"]
  }
];

// Helper to handle in-memory cache (cross-request updates for user testing)
let mockProductsCache: Product[] = [];

const initializeCache = () => {
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem("antigravity_mock_products");
    if (cached) {
      try {
        mockProductsCache = JSON.parse(cached);
        return;
      } catch (e) {
        console.error("Failed to parse mock products cache", e);
      }
    }
  }
  mockProductsCache = [...INITIAL_PRODUCTS];
  saveCache();
};

const saveCache = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem("antigravity_mock_products", JSON.stringify(mockProductsCache));
  }
};

export const getMockProducts = (): Product[] => {
  if (mockProductsCache.length === 0) {
    initializeCache();
  }
  return mockProductsCache;
};

export const getMockProductBySlug = (slug: string): Product | undefined => {
  return getMockProducts().find((p) => p.slug === slug);
};

export const addMockProduct = (product: Omit<Product, "id">): Product => {
  const newProduct: Product = {
    ...product,
    id: `prod-${Date.now()}`
  };
  mockProductsCache.push(newProduct);
  saveCache();
  return newProduct;
};

export const updateMockProduct = (id: string, updatedFields: Partial<Product>): Product | undefined => {
  const index = getMockProducts().findIndex((p) => p.id === id);
  if (index !== -1) {
    mockProductsCache[index] = {
      ...mockProductsCache[index],
      ...updatedFields
    };
    saveCache();
    return mockProductsCache[index];
  }
  return undefined;
};

export const deleteMockProduct = (id: string): boolean => {
  const initialLen = getMockProducts().length;
  mockProductsCache = mockProductsCache.filter((p) => p.id !== id);
  saveCache();
  return mockProductsCache.length < initialLen;
};

// Seed categories list
export interface Category {
  id: string;
  name: string;
  slug: string;
}

export const getMockCategories = (): Category[] => [
  { id: "cat-memoir", name: "Memoirs", slug: "memoirs" },
  { id: "cat-guide", name: "Guidebooks", slug: "guidebooks" },
  { id: "cat-manual", name: "Manuals", slug: "manuals" },
  { id: "cat-essays", name: "Essays", slug: "essays" },
  { id: "cat-adventure", name: "Adventure Logs", slug: "adventure-logs" }
];
