function buildQuery(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    // تجاهل القيم الفارغة
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });

  return query.toString();
}

// Get featured products
export async function getFeaturedProducts({ signal } = {}) {
  const response = await fetch("/api/products/featured", { signal });

  if (!response.ok) {
    throw new Error("Failed to fetch featured products");
  }

  return response.json();
}

// Get products with search, filters, sorting and pagination
export async function getProducts(params = {}, options = {}) {
  const query = buildQuery(params);
  const url = `/api/products${query ? `?${query}` : ""}`;

  const response = await fetch(url, { signal: options.signal });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}

// Get a single product by ID
export async function getProductById(id, { signal } = {}) {
  const response = await fetch(`/api/products/${encodeURIComponent(id)}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch product details");
  }

  return response.json();
}

// Update a product (status, name, price, etc.) — used for optimistic updates
export async function updateProduct(id, data) {
  const response = await fetch(`/api/products/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to update product");
  }

  return response.json();
}
