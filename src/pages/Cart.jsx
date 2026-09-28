import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

const CART_KEY = "maison-cart";

export default function Cart() {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");

      setCart(Array.isArray(savedCart) ? savedCart : []);
    } catch {
      setCart([]);
    }
  }, []);

  // Save cart and notify Navbar
  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));

    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Increase quantity
  const increaseQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
    );

    updateCart(updatedCart);
  };

  // Decrease quantity
  const decreaseQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: Math.max(1, item.quantity - 1),
          }
        : item,
    );

    updateCart(updatedCart);
  };

  // Remove product
  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    updateCart(updatedCart);
  };

  // Calculate totals
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const formatPrice = (price) => `$${Number(price).toFixed(2)}`;

  // Empty cart
  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-[var(--color-bg)] px-5 py-20 text-[var(--color-text)] transition-colors duration-300">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-border)]">
            <ShoppingBag size={32} className="text-[var(--color-text)]" />
          </div>

          <h1 className="mt-8 font-serif text-4xl text-[var(--color-text)] sm:text-5xl">
            Your Bag is Empty
          </h1>

          <p className="mt-4 text-base leading-7 text-[var(--color-muted)]">
            Looks like you haven't added anything to your bag yet. Discover our
            collection and find something you love.
          </p>

          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-[var(--color-text)] px-8 py-4 text-sm text-[var(--color-bg)] transition hover:bg-[var(--color-primary)] hover:text-white"
          >
            <ArrowLeft size={17} />
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-300">
      <section className="mx-auto max-w-[1440px] px-5 py-14 sm:px-10 lg:px-14 lg:py-20">
        {/* Header */}
        <div className="mb-10">
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[var(--color-primary)]">
            The Maison Edit
          </p>

          <h1 className="font-serif text-5xl text-[var(--color-text)] sm:text-6xl">
            Shopping Bag
          </h1>

          <p className="mt-4 text-sm text-[var(--color-muted)]">
            {totalItems} {totalItems === 1 ? "item" : "items"} in your bag
          </p>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-[1fr_380px]">
          {/* Cart Items */}
          <div className="space-y-6">
            {cart.map((item) => (
              <article
                key={item.id}
                className="flex flex-col gap-5 border-b border-[var(--color-border)] pb-6 sm:flex-row"
              >
                {/* Product Image */}
                <Link
                  to={`/product/${item.id}`}
                  className="block w-full shrink-0 overflow-hidden rounded-2xl bg-[var(--color-surface)] sm:w-44"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    width="400"
                    height="500"
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/5] w-full object-cover"
                  />
                </Link>

                {/* Product Details */}
                <div className="flex flex-1 flex-col justify-between gap-5">
                  <div>
                    <Link
                      to={`/product/${item.id}`}
                      className="font-serif text-2xl text-[var(--color-text)] transition hover:text-[var(--color-primary)]"
                    >
                      {item.name}
                    </Link>

                    <p className="mt-3 text-lg font-medium text-[var(--color-text)]">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    {/* Quantity */}
                    <div className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]">
                      <button
                        type="button"
                        onClick={() => decreaseQuantity(item.id)}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                        className="p-3 text-[var(--color-text)] transition hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Minus size={15} />
                      </button>

                      <span className="min-w-8 text-center text-sm text-[var(--color-text)]">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => increaseQuantity(item.id)}
                        aria-label="Increase quantity"
                        className="p-3 text-[var(--color-text)] transition hover:text-[var(--color-primary)]"
                      >
                        <Plus size={15} />
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] transition hover:text-[var(--color-primary)]"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>

                  <p className="text-sm text-[var(--color-muted)]">
                    Item total:{" "}
                    <span className="font-medium text-[var(--color-text)]">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </p>
                </div>
              </article>
            ))}

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 pt-3 text-sm text-[var(--color-primary)] transition hover:underline"
            >
              <ArrowLeft size={16} />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <aside className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors duration-300 sm:p-8">
            <h2 className="font-serif text-2xl text-[var(--color-text)]">
              Order Summary
            </h2>

            <div className="mt-8 space-y-5 border-b border-[var(--color-border)] pb-6">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-[var(--color-muted)]">
                  Subtotal ({totalItems} items)
                </span>

                <span className="font-medium text-[var(--color-text)]">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-[var(--color-muted)]">Shipping</span>

                <span className="text-[var(--color-muted)]">
                  Calculated at checkout
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4">
              <span className="font-medium text-[var(--color-text)]">
                Total
              </span>

              <span className="text-xl font-medium text-[var(--color-text)]">
                {formatPrice(subtotal)}
              </span>
            </div>

            <Link
              to="/checkout"
              className="mt-8 block w-full rounded-full bg-[var(--color-text)] px-6 py-4 text-center text-sm font-medium text-[var(--color-bg)] transition hover:bg-[var(--color-primary)] hover:text-white"
            >
              Proceed to Checkout
            </Link>

            <p className="mt-4 text-center text-xs leading-6 text-[var(--color-muted)]">
              Shipping and payment details will be available at checkout.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}
