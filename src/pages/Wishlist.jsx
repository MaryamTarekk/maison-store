import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Trash2, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const WISHLIST_KEY = "maison-wishlist";
const CART_KEY = "maison-cart";

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.2 },
  },
};

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");

      setWishlist(Array.isArray(saved) ? saved : []);
    } catch {
      setWishlist([]);
    }
  }, []);

  const saveWishlist = (updatedWishlist) => {
    setWishlist(updatedWishlist);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updatedWishlist));
  };

  const removeFromWishlist = (id) => {
    const updatedWishlist = wishlist.filter((item) => item.id !== id);

    saveWishlist(updatedWishlist);
  };

  const addToCart = (product) => {
    try {
      const savedCart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");

      const cart = Array.isArray(savedCart) ? savedCart : [];
      const existingItem = cart.find((item) => item.id === product.id);

      let updatedCart;

      if (existingItem) {
        updatedCart = cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        updatedCart = [...cart, { ...product, quantity: 1 }];
      }

      localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));

      window.dispatchEvent(new Event("cartUpdated"));

      removeFromWishlist(product.id);
    } catch {
      // Keep the item in the wishlist if saving the cart fails.
    }
  };

  const formatPrice = (price) => `$${Number(price || 0).toFixed(2)}`;

  if (wishlist.length === 0) {
    return (
      <motion.main
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="flex min-h-[70vh] flex-col items-center justify-center px-5 py-16 text-center"
        style={{
          backgroundColor: "var(--color-bg)",
          color: "var(--color-text)",
        }}
      >
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex h-20 w-20 items-center justify-center rounded-full"
          style={{ backgroundColor: "var(--color-border)" }}
        >
          <Heart size={34} style={{ color: "var(--color-primary)" }} />
        </motion.div>

        <h1 className="mt-8 font-serif text-4xl sm:text-5xl">
          Your Wishlist is Empty
        </h1>

        <p
          className="mt-4 max-w-md leading-7"
          style={{ color: "var(--color-muted)" }}
        >
          Save your favorite pieces here and come back to them whenever you
          like.
        </p>

        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm text-white transition"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "#FFFFFF",
            }}
          >
            <ShoppingBag size={17} />
            Explore the Collection
          </Link>
        </motion.div>
      </motion.main>
    );
  }

  return (
    <motion.main
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen px-5 py-14 sm:px-10 lg:px-14"
      style={{
        backgroundColor: "var(--color-bg)",
        color: "var(--color-text)",
      }}
    >
      <section className="mx-auto max-w-[1200px]">
        <div className="mb-10">
          <p
            className="mb-4 text-xs uppercase tracking-[0.25em]"
            style={{ color: "var(--color-primary)" }}
          >
            Your Maison Favorites
          </p>

          <h1 className="font-serif text-5xl sm:text-6xl">My Wishlist</h1>

          <p className="mt-4" style={{ color: "var(--color-muted)" }}>
            {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
            for later.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {wishlist.map((product) => (
              <motion.article
                key={product.id}
                variants={cardVariants}
                exit="exit"
                layout
                whileHover={{ y: -5 }}
                className="overflow-hidden rounded-2xl border"
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderColor: "var(--color-border)",
                }}
              >
                <Link
                  to={`/product/${product.id}`}
                  className="relative block overflow-hidden"
                  style={{ backgroundColor: "var(--color-border)" }}
                >
                  <motion.img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.5 }}
                    className="aspect-[4/5] w-full object-cover"
                  />
                </Link>

                <div className="p-5">
                  <p
                    className="text-xs uppercase tracking-wider"
                    style={{ color: "var(--color-muted)" }}
                  >
                    {product.category}
                  </p>

                  <Link
                    to={`/product/${product.id}`}
                    className="mt-2 block font-serif text-2xl transition"
                    style={{ color: "var(--color-text)" }}
                  >
                    {product.name}
                  </Link>

                  <p
                    className="mt-3 text-lg font-medium"
                    style={{ color: "var(--color-text)" }}
                  >
                    {formatPrice(product.price)}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <motion.button
                      type="button"
                      onClick={() => addToCart(product)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm text-white transition"
                      style={{
                        backgroundColor: "var(--color-primary)",
                        color: "#FFFFFF",
                      }}
                    >
                      <ShoppingBag size={16} />
                      Add to Bag
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={() => removeFromWishlist(product.id)}
                      aria-label={`Remove ${product.name} from wishlist`}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center justify-center rounded-full border px-4 transition"
                      style={{
                        borderColor: "var(--color-border)",
                        color: "var(--color-muted)",
                      }}
                    >
                      <Trash2 size={17} />
                    </motion.button>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-10">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm transition hover:underline"
            style={{ color: "var(--color-primary)" }}
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>
        </div>
      </section>
    </motion.main>
  );
}
