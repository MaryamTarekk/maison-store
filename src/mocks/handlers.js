import { http, HttpResponse, delay } from "msw";

// ========================================
// Simulation Helpers
// ========================================

const randomLatency = () => delay(300 + Math.floor(Math.random() * 500));

const shouldFail = (rate = 0.08) => Math.random() < rate;

// ========================================
// Product Images
// ========================================
// Images are grouped by category.
// Each product gets a deterministic image
// based on its category + id.
//
// IMPORTANT:
// Do NOT use Math.random() here.
// This keeps the same product image stable
// even when React Query refetches the API.
// ========================================

const imagePool = {
  Audio: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=700&q=80",
  ],

  Watches: [
    "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=700&q=80",
  ],

  Bags: [
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=700&q=80",
  ],

  Home: [
    "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=700&q=80",
  ],

  Accessories: [
    "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=700&q=80",
  ],
};

// ========================================
// Deterministic Image Selector
// ========================================

const getProductImage = (category, id) => {
  const pool = imagePool[category] || imagePool.Accessories;

  const index = (id - 1) % pool.length;

  return pool[index];
};

// ========================================
// Original Products
// ========================================

const originalProducts = [
  {
    id: 1,
    name: "Studio Wireless Headphones",
    category: "Audio",
    price: 189,
    oldPrice: null,
    badge: "Bestseller",
    status: "available",
    description:
      "Experience rich, immersive sound with these wireless headphones. Designed for everyday listening with a clean, timeless look.",
    image: getProductImage("Audio", 1),
    featured: true,
  },

  {
    id: 2,
    name: "Classic Leather Watch",
    category: "Watches",
    price: 245,
    oldPrice: null,
    badge: "New",
    status: "available",
    description:
      "A timeless watch with a classic leather strap and a refined design that complements every occasion.",
    image: getProductImage("Watches", 2),
    featured: true,
  },

  {
    id: 3,
    name: "Everyday Leather Bag",
    category: "Bags",
    price: 320,
    oldPrice: 360,
    badge: "Featured",
    status: "available",
    description:
      "A versatile everyday bag with a sophisticated silhouette, designed to bring style and function together.",
    image: getProductImage("Bags", 3),
    featured: true,
  },

  {
    id: 4,
    name: "Sculptural Ceramic Vase",
    category: "Home",
    price: 95,
    oldPrice: null,
    badge: null,
    status: "available",
    description:
      "A sculptural ceramic vase that adds a subtle artistic touch to your home, whether displayed alone or with flowers.",
    image: getProductImage("Home", 4),
    featured: true,
  },
];

// ========================================
// Additional Products
// ========================================

const extraProducts = [
  ["Wireless Earbuds", "Audio", 129],
  ["Premium Studio Speakers", "Audio", 275],
  ["Portable Bluetooth Speaker", "Audio", 89],
  ["Noise Cancelling Headphones", "Audio", 220],

  ["Classic Analog Watch", "Watches", 195],
  ["Minimalist Gold Watch", "Watches", 285],
  ["Silver Mesh Watch", "Watches", 230],
  ["Vintage Leather Watch", "Watches", 260],

  ["Structured Shoulder Bag", "Bags", 290],
  ["Mini Crossbody Bag", "Bags", 175],
  ["Everyday Tote Bag", "Bags", 210],
  ["Classic Leather Backpack", "Bags", 340],

  ["Handcrafted Ceramic Bowl", "Home", 65],
  ["Minimalist Table Lamp", "Home", 145],
  ["Decorative Candle Holder", "Home", 55],
  ["Textured Ceramic Planter", "Home", 75],
  ["Abstract Wall Art", "Home", 120],
  ["Linen Cushion Cover", "Home", 45],
  ["Modern Coffee Table Tray", "Home", 85],
  ["Sculptural Desk Organizer", "Home", 70],

  ["Gold Hoop Earrings", "Accessories", 55],
  ["Minimalist Pendant Necklace", "Accessories", 85],
  ["Classic Leather Wallet", "Accessories", 110],
  ["Silk Printed Scarf", "Accessories", 95],
  ["Everyday Sunglasses", "Accessories", 135],
  ["Pearl Bracelet", "Accessories", 75],
  ["Leather Card Holder", "Accessories", 65],
  ["Statement Ring", "Accessories", 90],

  ["Wireless Charging Stand", "Audio", 79],
  ["Retro Headphones", "Audio", 165],

  ["Luxury Travel Watch", "Watches", 310],
  ["Slim Leather Watch", "Watches", 225],

  ["Soft Leather Clutch", "Bags", 185],
  ["Weekend Travel Bag", "Bags", 390],
  ["Woven Everyday Bag", "Bags", 155],
  ["Mini Leather Handbag", "Bags", 245],

  ["Artisan Ceramic Mug", "Home", 35],
  ["Decorative Glass Vase", "Home", 80],
  ["Natural Wood Picture Frame", "Home", 50],
  ["Soft Knit Throw Blanket", "Home", 160],

  ["Layered Gold Necklace", "Accessories", 125],
  ["Classic Leather Belt", "Accessories", 95],
  ["Minimalist Stud Earrings", "Accessories", 45],
  ["Everyday Jewelry Box", "Accessories", 115],
  ["Travel Jewelry Case", "Accessories", 70],

  ["Premium Desk Clock", "Home", 180],
];

// ========================================
// Generated Products
// ========================================

const generatedProducts = extraProducts.map(
  ([name, category, price], index) => {
    const id = index + 5;

    return {
      id,
      name,
      category,
      price,
      oldPrice: null,

      badge: index % 7 === 0 ? "New" : null,

      status:
        index % 8 === 0
          ? "out-of-stock"
          : index % 5 === 0
            ? "low-stock"
            : "available",

      description: `${name} from Maison. A thoughtfully selected piece combining timeless style, quality, and everyday functionality.`,

      image: getProductImage(category, id),

      featured: index < 8,
    };
  },
);

// ========================================
// All Products
// ========================================

const products = [...originalProducts, ...generatedProducts];

// ========================================
// API Handlers
// ========================================

export const handlers = [
  // ========================================
  // GET /api/products
  // ========================================

  http.get("/api/products", async ({ request }) => {
    await randomLatency();

    if (shouldFail(0.05)) {
      return HttpResponse.json(
        {
          success: false,
          message: "Internal server error",
        },
        {
          status: 500,
        },
      );
    }

    const url = new URL(request.url);

    const search = url.searchParams.get("search")?.trim().toLowerCase();

    const category = url.searchParams.get("category");

    const minPrice = Number(url.searchParams.get("minPrice"));

    const maxPrice = Number(url.searchParams.get("maxPrice"));

    const sort = url.searchParams.get("sort");

    const page = Math.max(
      1,
      Number.parseInt(url.searchParams.get("page") || "1", 10) || 1,
    );

    const limitParam = url.searchParams.get("limit");

    const limit = limitParam
      ? Math.max(1, Number.parseInt(limitParam, 10) || 8)
      : null;

    let result = [...products];

    // ========================================
    // Search
    // ========================================

    if (search) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(search),
      );
    }

    // ========================================
    // Category
    // ========================================

    if (category && category !== "All") {
      result = result.filter((product) => product.category === category);
    }

    // ========================================
    // Minimum Price
    // ========================================

    if (url.searchParams.has("minPrice") && Number.isFinite(minPrice)) {
      result = result.filter((product) => product.price >= minPrice);
    }

    // ========================================
    // Maximum Price
    // ========================================

    if (url.searchParams.has("maxPrice") && Number.isFinite(maxPrice)) {
      result = result.filter((product) => product.price <= maxPrice);
    }

    // ========================================
    // Sorting
    // ========================================

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;

      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;

      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;

      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;

      case "newest":
        result.sort((a, b) => b.id - a.id);
        break;

      default:
        break;
    }

    // ========================================
    // Pagination
    // ========================================

    const total = result.length;

    const totalPages = limit ? Math.ceil(total / limit) : 1;

    if (limit) {
      const startIndex = (page - 1) * limit;

      result = result.slice(startIndex, startIndex + limit);
    }

    // ========================================
    // Response
    // ========================================

    return HttpResponse.json({
      success: true,
      data: result,
      total,
      page,
      limit,
      totalPages,
    });
  }),

  // ========================================
  // GET /api/products/featured
  // ========================================

  http.get("/api/products/featured", async () => {
    await randomLatency();

    const featuredProducts = products.filter((product) => product.featured);

    return HttpResponse.json({
      success: true,
      data: featuredProducts,
      total: featuredProducts.length,
    });
  }),

  // ========================================
  // GET /api/products/:id
  // ========================================

  http.get("/api/products/:id", async ({ params }) => {
    await randomLatency();

    const product = products.find((item) => item.id === Number(params.id));

    if (!product) {
      return HttpResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        {
          status: 404,
        },
      );
    }

    return HttpResponse.json({
      success: true,
      data: product,
    });
  }),

  // ========================================
  // PATCH /api/products/:id
  // ========================================

  http.patch("/api/products/:id", async ({ params, request }) => {
    await delay(400 + Math.floor(Math.random() * 400));

    if (shouldFail(0.2)) {
      return HttpResponse.json(
        {
          success: false,
          message: "Server error — could not update product",
        },
        {
          status: 500,
        },
      );
    }

    const index = products.findIndex(
      (product) => product.id === Number(params.id),
    );

    if (index === -1) {
      return HttpResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        {
          status: 404,
        },
      );
    }

    const body = await request.json();

    const allowed = ["name", "price", "description", "status", "badge"];

    const updates = {};

    for (const key of allowed) {
      if (key in body) {
        updates[key] = body[key];
      }
    }

    products[index] = {
      ...products[index],
      ...updates,
    };

    return HttpResponse.json({
      success: true,
      data: products[index],
    });
  }),
];
