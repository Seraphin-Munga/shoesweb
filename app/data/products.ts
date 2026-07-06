export type Product = {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  badge?: string;
  bgColor: string;
  sizes: number[];
  colors: { name: string; hex: string }[];
  description: string;
  features: string[];
  category: string;
  imageUrls?: string[];
};

export const products: Product[] = [
  {
    id: 1,
    name: "Air Vortex Pro",
    brand: "STRYDE",
    price: 189.99,
    rating: 4.8,
    reviews: 124,
    badge: "New",
    bgColor: "#f0f4ff",
    sizes: [7, 8, 9, 10, 11, 12],
    colors: [
      { name: "Midnight", hex: "#1a1a2e" },
      { name: "Cobalt",   hex: "#3b5bdb" },
      { name: "Pearl",    hex: "#f1f3f5" },
      { name: "Slate",    hex: "#868e96" },
    ],
    description:
      "Engineered for speed and built for endurance. The Air Vortex Pro features our proprietary foam technology that returns energy with every step. Whether you're on the track or the street, this shoe adapts to your stride.",
    features: [
      "Adaptive foam midsole with 40% energy return",
      "Breathable mesh upper for all-day comfort",
      "Non-slip rubber outsole for all surfaces",
      "Reflective details for low-light visibility",
    ],
    category: "Running",
  },
  {
    id: 2,
    name: "Urban Runner X",
    brand: "STRYDE",
    price: 149.99,
    originalPrice: 199.99,
    rating: 4.6,
    reviews: 89,
    badge: "Sale",
    bgColor: "#fff5f5",
    sizes: [7, 8, 9, 10, 11],
    colors: [
      { name: "Crimson", hex: "#e03131" },
      { name: "Charcoal", hex: "#343a40" },
      { name: "Fog",     hex: "#dee2e6" },
    ],
    description:
      "The Urban Runner X bridges the gap between performance running and everyday style. Lightweight construction meets streetwear aesthetics for a shoe that works in every context.",
    features: [
      "Lightweight EVA foam for cushioned landings",
      "Dual-layer upper for structure and flexibility",
      "Low-profile sole for a clean street look",
      "Padded collar for ankle support",
    ],
    category: "Casual",
  },
  {
    id: 3,
    name: "Classic Luxe",
    brand: "STRYDE",
    price: 219.99,
    rating: 4.9,
    reviews: 201,
    badge: "Best Seller",
    bgColor: "#fffbeb",
    sizes: [6, 7, 8, 9, 10, 11, 12],
    colors: [
      { name: "Cream",   hex: "#fff3cd" },
      { name: "Tan",     hex: "#c69963" },
      { name: "Onyx",    hex: "#212529" },
      { name: "Ivory",   hex: "#f8f9fa" },
    ],
    description:
      "Timeless design meets modern comfort. The Classic Luxe is crafted from premium materials with meticulous attention to detail, a shoe that only gets better with time.",
    features: [
      "Full-grain leather upper (sustainably sourced)",
      "Memory foam insole for all-day luxury",
      "Hand-stitched welt construction",
      "Goodyear-welted sole for longevity",
    ],
    category: "Casual",
  },
  {
    id: 4,
    name: "Street Edge V2",
    brand: "STRYDE",
    price: 174.99,
    rating: 4.7,
    reviews: 67,
    bgColor: "#f0fff4",
    sizes: [8, 9, 10, 11, 12],
    colors: [
      { name: "Forest",  hex: "#2f9e44" },
      { name: "Stone",   hex: "#868e96" },
      { name: "Black",   hex: "#212529" },
    ],
    description:
      "The Street Edge V2 is for those who move with purpose. Chunky sole, bold silhouette, and STRYDE's most durable upper yet, built to handle whatever the city throws at you.",
    features: [
      "Chunky platform sole with extra grip",
      "Reinforced toe cap for impact protection",
      "Wide-fit last for relaxed comfort",
      "Waterproof coating on upper",
    ],
    category: "Casual",
  },
  {
    id: 5,
    name: "Cloud Walk Elite",
    brand: "STRYDE",
    price: 259.99,
    rating: 5.0,
    reviews: 45,
    badge: "Limited",
    bgColor: "#faf5ff",
    sizes: [7, 8, 9, 10],
    colors: [
      { name: "Violet",  hex: "#7048e8" },
      { name: "Lilac",   hex: "#d0bfff" },
      { name: "White",   hex: "#ffffff" },
    ],
    description:
      "A limited-edition masterpiece. The Cloud Walk Elite uses our most advanced CloudFoam technology for a sensation unlike any other, it's the closest thing to walking on air.",
    features: [
      "Multi-layer CloudFoam stack (patent pending)",
      "Knit upper with zero-pressure seams",
      "Carbon fibre plate for propulsion",
      "Limited run of 2,000 pairs worldwide",
    ],
    category: "Running",
  },
  {
    id: 6,
    name: "Trail Blazer GTX",
    brand: "STRYDE",
    price: 199.99,
    rating: 4.5,
    reviews: 156,
    bgColor: "#fff7ed",
    sizes: [7, 8, 9, 10, 11, 12, 13],
    colors: [
      { name: "Ember",   hex: "#e8590c" },
      { name: "Olive",   hex: "#74c476" },
      { name: "Brown",   hex: "#7c5c3b" },
    ],
    description:
      "Conquer any terrain. The Trail Blazer GTX features full waterproof Gore-Tex construction, aggressive outsole lugs, and a supportive midsole built for long days on uneven ground.",
    features: [
      "Gore-Tex waterproof membrane",
      "Aggressive multi-directional outsole",
      "Rockplate for underfoot protection",
      "High-traction rubber compound",
    ],
    category: "Trail",
  },
  {
    id: 7,
    name: "Velocity Sprint",
    brand: "STRYDE",
    price: 134.99,
    originalPrice: 169.99,
    rating: 4.4,
    reviews: 93,
    badge: "Sale",
    bgColor: "#ecfeff",
    sizes: [6, 7, 8, 9, 10, 11],
    colors: [
      { name: "Aqua",    hex: "#22d3ee" },
      { name: "Navy",    hex: "#1e3a5f" },
      { name: "White",   hex: "#f8fafc" },
    ],
    description:
      "Speed is everything. The Velocity Sprint is stripped back for maximum performance, a racing flat-inspired silhouette with the cushioning you need for long distances.",
    features: [
      "Ultra-lightweight at 185g per shoe",
      "Propulsion plate for faster turnover",
      "Sock-like knit upper for a glove fit",
      "Minimal heel-toe drop (4mm)",
    ],
    category: "Running",
  },
  {
    id: 8,
    name: "Night Runner Dark",
    brand: "STRYDE",
    price: 244.99,
    rating: 4.8,
    reviews: 38,
    badge: "New",
    bgColor: "#fdf4ff",
    sizes: [7, 8, 9, 10, 11],
    colors: [
      { name: "Midnight", hex: "#2d1b69" },
      { name: "Rose",     hex: "#f43f5e" },
      { name: "Obsidian", hex: "#0f0f0f" },
    ],
    description:
      "Built for the hours after dark. The Night Runner Dark has 360° reflective detailing, an ultra-responsive sole, and a sleek silhouette that turns heads under streetlights.",
    features: [
      "360° reflective material on upper",
      "Glow-in-the-dark outsole accents",
      "High-rebound foam for night runs",
      "Secure lace system that won't come undone",
    ],
    category: "Running",
  },
];

export function getProduct(id: number): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getRelated(id: number, limit = 4): Product[] {
  const product = getProduct(id);
  if (!product) return [];
  return products.filter((p) => p.id !== id && p.category === product.category).slice(0, limit).concat(
    products.filter((p) => p.id !== id && p.category !== product.category)
  ).slice(0, limit);
}
