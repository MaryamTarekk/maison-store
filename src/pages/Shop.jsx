import { useEffect, useState, useCallback, useRef, memo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  RefreshCw,
  Heart,
  ChevronLeft,
  ChevronRight,
  Pencil,
} from "lucide-react";
import { getProducts, updateProduct } from "../services/products.api";
import { useToast } from "../components/Toast";
import ProductEditModal from "../components/ProductEditModal";

const categories = ["All", "Audio", "Watches", "Bags", "Home", "Accessories"];

const WISHLIST_KEY = "maison-wishlist";
const PAGE_SIZE = 12;
const POLL_INTERVAL = 30_000; // Auto-refresh every 30 seconds

// ── Status Styles & Cycle ────────────────────────────────
const statusStyles = {
  available: {
    label: "Available",
    color: "#16A34A",
    bg: "rgba(22, 163, 74, 0.1)",
  },
  "low-stock": {
    label: "Low Stock",
    color: "#F59E0B",
    bg: "rgba(245, 158, 11, 0.1)",
  },
  "out-of-stock": {
    label: "Out of Stock",
    color: "#DC2626",
    bg: "rgba(220, 38, 38, 0.1)",
  },
};

const nextStatus = {
  available: "low-stock",
  "low-stock": "out-of-stock",
  "out-of-stock": "available",
};

// ── Animation Variants ───────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.85 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// ── Memoized Product Card (prevents unnecessary re-renders) ──
const ProductCard = memo(function ProductCard({
  product,
  isFavorite,
  onToggleWishlist,
  onToggleStatus,
  onEdit,
}) {
  const style = statusStyles[product.status] || statusStyles.available;
  const isOutOfStock = product.status === "out-of-stock";

  return (
    <motion.article
      variants={cardVariants}
      whileHover={{ y: -8, transition: { duration: 0.25 } }}
      className="group relative min-w-0"
    >
      {/* Product Image */}
      <div className="relative overflow-hidden rounded-2xl bg-[var(--color-surface)]">
        {product.badge && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-[var(--color-primary)] px-3 py-1 text-[10px] font-medium text-white sm:text-xs">
            {product.badge}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={() => onToggleWishlist(product)}
          disabled={isOutOfStock}
          aria-label={
            isFavorite
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          aria-pressed={isFavorite}
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-bg)] text-[var(--color-primary)] shadow-sm transition hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          <Heart
            size={19}
            fill={isFavorite ? "currentColor" : "none"}
            strokeWidth={1.8}
          />
        </button>

        {/* Edit Button (appears on hover) */}
        <button
          type="button"
          onClick={() => onEdit(product)}
          aria-label={`Edit ${product.name}`}
          className="absolute bottom-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-bg)]/90 text-[var(--color-text)] opacity-0 shadow-sm backdrop-blur-sm transition group-hover:opacity-100 hover:scale-110 hover:text-[var(--color-primary)]"
        >
          <Pencil size={15} />
        </button>

        {isOutOfStock ? (
          <div
            aria-disabled="true"
            className="relative block cursor-not-allowed"
          >
            <img
              src={product.image}
              alt={product.name}
              width="700"
              height="850"
              loading="lazy"
              decoding="async"
              className="aspect-[4/5] w-full object-cover blur-[3px] grayscale-[0.4]"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/15">
              <span className="rounded-full bg-[var(--color-bg)]/95 px-4 py-1.5 text-xs font-medium tracking-wide text-[var(--color-text)] shadow-sm">
                Out of Stock
              </span>
            </div>
          </div>
        ) : (
          <Link to={`/product/${product.id}`} className="block">
            <img
              src={product.image}
              alt={product.name}
              width="700"
              height="850"
              loading="lazy"
              decoding="async"
              className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>
        )}
      </div>

      {/* Product Info */}
      <div className="mt-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-[var(--color-muted)]">
            {product.category}
          </p>

          {/* Optimistic Status Toggle */}
          <button
            type="button"
            onClick={() => onToggleStatus(product)}
            title={`Click to change status (currently: ${style.label})`}
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium transition hover:opacity-80"
            style={{ backgroundColor: style.bg, color: style.color }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: style.color }}
            />
            {style.label}
          </button>
        </div>

        {isOutOfStock ? (
          <div className="mt-1 block cursor-not-allowed opacity-60">
            <h2 className="font-medium text-[var(--color-text)]">
              {product.name}
            </h2>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <span className="font-medium text-[var(--color-text)]">
                ${Number(product.price).toFixed(2)}
              </span>

              {product.oldPrice != null && (
                <span className="text-[var(--color-muted)] line-through">
                  ${Number(product.oldPrice).toFixed(2)}
                </span>
              )}
            </div>
          </div>
        ) : (
          <Link to={`/product/${product.id}`} className="mt-1 block">
            <h2 className="font-medium text-[var(--color-text)] transition-colors group-hover:text-[var(--color-primary)]">
              {product.name}
            </h2>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <span className="font-medium text-[var(--color-text)]">
                ${Number(product.price).toFixed(2)}
              </span>

              {product.oldPrice != null && (
                <span className="text-[var(--color-muted)] line-through">
                  ${Number(product.oldPrice).toFixed(2)}
                </span>
              )}
            </div>
          </Link>
        )}
      </div>
    </motion.article>
  );
});

// ── Shop Page ────────────────────────────────────────────
export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  // Read filters from URL
  const searchFromUrl = searchParams.get("search") || "";
  const category = searchParams.get("category") || "All";
  const sort = searchParams.get("sort") || "default";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const [searchInput, setSearchInput] = useState(searchFromUrl);
  const [editingProduct, setEditingProduct] = useState(null);
  const dirtyRef = useRef(false);

  // Wishlist state
  const [wishlistIds, setWishlistIds] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");
      return Array.isArray(saved) ? saved.map((item) => item.id) : [];
    } catch {
      return [];
    }
  });

  // Sync search input with URL
  useEffect(() => {
    setSearchInput(searchFromUrl);
  }, [searchFromUrl]);

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const nextSearch = searchInput.trim();

      if (nextSearch === searchFromUrl) return;

      const nextParams = new URLSearchParams(searchParams);

      if (nextSearch) {
        nextParams.set("search", nextSearch);
      } else {
        nextParams.delete("search");
      }

      // Reset pagination when search changes
      nextParams.delete("page");

      setSearchParams(nextParams, { replace: true });
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [searchInput, searchFromUrl, searchParams, setSearchParams]);

  // Update URL filters
  const updateParams = useCallback(
    (updates = {}) => {
      const nextParams = new URLSearchParams(searchParams);

      Object.entries(updates).forEach(([key, value]) => {
        if (
          value === null ||
          value === undefined ||
          value === "" ||
          value === "All" ||
          value === "default"
        ) {
          nextParams.delete(key);
        } else {
          nextParams.set(key, String(value));
        }
      });

      setSearchParams(nextParams);
    },
    [searchParams, setSearchParams],
  );

  // ── Fetch Products (with background polling) ──
  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ["products", searchFromUrl, category, sort, page, PAGE_SIZE],

    queryFn: ({ signal }) =>
      getProducts(
        {
          ...(searchFromUrl ? { search: searchFromUrl } : {}),
          ...(category !== "All" ? { category } : {}),
          ...(sort !== "default" ? { sort } : {}),
          page,
          limit: PAGE_SIZE,
        },
        { signal },
      ),

    placeholderData: (previousData) => previousData,
    staleTime: 30_000,
    refetchInterval: POLL_INTERVAL, // Auto-refresh without losing state
  });

  // Support paginated and non-paginated responses
  const products = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
      ? data
      : [];

  const totalProducts = data?.total ?? products.length;

  const totalPages =
    data?.totalPages ?? Math.max(1, Math.ceil(totalProducts / PAGE_SIZE));

  // ── Optimistic Status Toggle Mutation ──────────────────
  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateProduct(id, { status }),

    onMutate: async ({ id, status }) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["products"] });

      // Snapshot all product queries for rollback
      const snapshot = queryClient.getQueriesData({ queryKey: ["products"] });

      // Optimistically update ALL cached product queries
      queryClient.setQueriesData({ queryKey: ["products"] }, (old) => {
        if (!old?.data) return old;

        return {
          ...old,
          data: old.data.map((p) => (p.id === id ? { ...p, status } : p)),
        };
      });

      return { snapshot };
    },

    onError: (_error, _vars, context) => {
      // Rollback all product queries to previous state
      context?.snapshot?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });

      addToast({
        message: "Failed to update status. Changes reverted.",
        type: "error",
      });
    },

    onSuccess: () => {
      addToast({
        message: "Product status updated!",
        type: "success",
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  // ── Product Edit Mutation (from modal) ─────────────────
  const editMutation = useMutation({
    mutationFn: ({ id, updateData }) => updateProduct(id, updateData),

    onMutate: async ({ id, updateData }) => {
      await queryClient.cancelQueries({ queryKey: ["products"] });

      const snapshot = queryClient.getQueriesData({ queryKey: ["products"] });

      queryClient.setQueriesData({ queryKey: ["products"] }, (old) => {
        if (!old?.data) return old;

        return {
          ...old,
          data: old.data.map((p) =>
            p.id === id ? { ...p, ...updateData } : p,
          ),
        };
      });

      return { snapshot };
    },

    onError: (_error, _vars, context) => {
      context?.snapshot?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });

      addToast({
        message: "Failed to save changes. Reverted.",
        type: "error",
      });
    },

    onSuccess: () => {
      addToast({
        message: "Product updated successfully!",
        type: "success",
      });

      setEditingProduct(null);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  // ── Event Handlers (memoized) ──────────────────────────
  const handleToggleStatus = useCallback(
    (product) => {
      const newStatus = nextStatus[product.status] || "available";
      statusMutation.mutate({ id: product.id, status: newStatus });
    },
    [statusMutation],
  );

  const handleEditOpen = useCallback(
    (product) => {
      // Check for unsaved changes in current editor before switching
      if (editingProduct && dirtyRef.current) {
        if (!window.confirm("You have unsaved changes. Discard them?")) return;
      }

      setEditingProduct(product);
    },
    [editingProduct],
  );

  const handleEditSave = useCallback(
    (updateData) => {
      if (!editingProduct) return;

      editMutation.mutate({ id: editingProduct.id, updateData });
    },
    [editingProduct, editMutation],
  );

  const handleEditClose = useCallback(() => {
    setEditingProduct(null);
    dirtyRef.current = false;
  }, []);

  const handleDirtyChange = useCallback((dirty) => {
    dirtyRef.current = dirty;
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setSearchInput("");
    setSearchParams({});
  }, [setSearchParams]);

  // Toggle wishlist
  const toggleWishlist = useCallback((product) => {
    try {
      const saved = JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");
      const wishlist = Array.isArray(saved) ? saved : [];
      const exists = wishlist.some((item) => item.id === product.id);

      const updated = exists
        ? wishlist.filter((item) => item.id !== product.id)
        : [...wishlist, product];

      localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
      setWishlistIds(updated.map((item) => item.id));
      window.dispatchEvent(new Event("wishlist-updated"));
    } catch (error) {
      console.error("Could not update wishlist:", error);
    }
  }, []);

  const isFavorite = useCallback(
    (productId) => wishlistIds.includes(productId),
    [wishlistIds],
  );

  const hasFilters =
    Boolean(searchFromUrl) || category !== "All" || sort !== "default";

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-300">
      {/* Page Header */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-[1440px] px-5 py-14 sm:px-10 lg:px-14 lg:py-20"
      >
        <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[var(--color-primary)]">
          The Maison Edit
        </p>

        <h1 className="font-serif text-5xl text-[var(--color-text)] sm:text-6xl lg:text-7xl">
          The Collection
        </h1>

        <p className="mt-5 max-w-xl text-base leading-8 text-[var(--color-muted)]">
          Thoughtfully chosen pieces for everyday living. Discover timeless
          designs made to stay.
        </p>
      </motion.section>

      {/* Products Section */}
      <section className="mx-auto max-w-[1440px] px-5 pb-20 sm:px-10 lg:px-14">
        {/* Search and Sorting */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="relative w-full lg:max-w-md">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
            />

            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search products..."
              aria-label="Search products"
              className="w-full rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] py-4 pl-12 pr-5 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)]"
            />
          </div>

          {/* Sorting */}
          <div className="flex items-center gap-3">
            <ArrowUpDown size={18} className="text-[var(--color-muted)]" />

            <select
              value={sort}
              onChange={(event) =>
                updateParams({
                  sort: event.target.value,
                  page: null,
                })
              }
              aria-label="Sort products"
              className="w-full rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-primary)] sm:w-auto"
            >
              <option value="default">Default sorting</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-10 flex flex-wrap items-center gap-3">
          <SlidersHorizontal
            size={18}
            className="mr-1 text-[var(--color-muted)]"
          />

          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() =>
                updateParams({
                  category: item,
                  page: null,
                })
              }
              aria-pressed={category === item}
              className={`rounded-full border px-5 py-2.5 text-sm transition-colors duration-200 ${
                category === item
                  ? "border-[var(--color-text)] bg-[var(--color-text)] text-[var(--color-bg)]"
                  : "border-[var(--color-border)] bg-transparent text-[var(--color-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Results Count + Polling Indicator */}
        <div className="mb-6 flex items-center justify-between border-b border-[var(--color-border)] pb-5">
          <p className="text-sm text-[var(--color-muted)]">
            {isLoading ? "Loading products..." : `${totalProducts} products`}
          </p>

          <div className="flex items-center gap-4">
            {isFetching && !isLoading && (
              <span className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
                <RefreshCw size={12} className="animate-spin" />
                Syncing...
              </span>
            )}

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm text-[var(--color-primary)] hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[4/5] rounded-2xl bg-[var(--color-border)]" />
                <div className="mt-4 h-4 w-2/3 rounded bg-[var(--color-border)]" />
                <div className="mt-3 h-4 w-1/3 rounded bg-[var(--color-border)]" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="py-16 text-center">
            <p className="text-[var(--color-muted)]">
              We couldn&apos;t load the products.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--color-text)] px-6 py-3 text-sm text-[var(--color-bg)] transition hover:bg-[var(--color-primary)] hover:text-white"
            >
              <RefreshCw size={16} />
              Try again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && products.length === 0 && (
          <div className="py-20 text-center">
            <h2 className="font-serif text-3xl text-[var(--color-text)]">
              No products found
            </h2>

            <p className="mt-3 text-sm text-[var(--color-muted)]">
              Try another search or category.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 rounded-full bg-[var(--color-text)] px-6 py-3 text-sm text-[var(--color-bg)] transition hover:bg-[var(--color-primary)] hover:text-white"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Products Grid with Memoized Cards */}
        {!isLoading && !isError && products.length > 0 && (
          <>
            <motion.div
              key={`${searchFromUrl}-${category}-${sort}-${page}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6"
            >
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFavorite={isFavorite(product.id)}
                  onToggleWishlist={toggleWishlist}
                  onToggleStatus={handleToggleStatus}
                  onEdit={handleEditOpen}
                />
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => updateParams({ page: page - 1 })}
                  className="flex h-11 items-center gap-2 rounded-full border border-[var(--color-border)] px-5 text-sm text-[var(--color-text)] transition hover:border-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={17} />
                  Previous
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1,
                ).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => updateParams({ page: pageNumber })}
                    aria-current={page === pageNumber ? "page" : undefined}
                    className={`h-11 min-w-11 rounded-full border px-3 text-sm transition ${
                      page === pageNumber
                        ? "border-[var(--color-text)] bg-[var(--color-text)] text-[var(--color-bg)]"
                        : "border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)]"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => updateParams({ page: page + 1 })}
                  className="flex h-11 items-center gap-2 rounded-full border border-[var(--color-border)] px-5 text-sm text-[var(--color-text)] transition hover:border-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={17} />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Edit Modal (unsaved changes protection built-in) */}
      {editingProduct && (
        <ProductEditModal
          product={editingProduct}
          onClose={handleEditClose}
          onSave={handleEditSave}
          isSaving={editMutation.isPending}
          onDirtyChange={handleDirtyChange}
        />
      )}
    </main>
  );
}
