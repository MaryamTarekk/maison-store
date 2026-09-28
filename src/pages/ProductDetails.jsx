import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Minus, Plus, ShoppingBag, RefreshCw } from "lucide-react";
import { getProductById } from "../services/products.api";

export default function ProductDetails() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
  });

  const product = data?.data;

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[var(--color-bg)] px-5 py-20 transition-colors duration-300">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="h-6 w-32 rounded bg-[var(--color-border)]" />

          <div className="mt-10 grid gap-10 md:grid-cols-2">
            <div className="aspect-[4/5] rounded-2xl bg-[var(--color-border)]" />

            <div className="space-y-5 py-8">
              <div className="h-5 w-24 rounded bg-[var(--color-border)]" />
              <div className="h-10 w-3/4 rounded bg-[var(--color-border)]" />
              <div className="h-6 w-32 rounded bg-[var(--color-border)]" />
              <div className="h-24 rounded bg-[var(--color-border)]" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (isError || !product) {
    return (
      <main className="min-h-screen bg-[var(--color-bg)] px-5 py-24 text-center transition-colors duration-300">
        <h1 className="font-serif text-3xl text-[var(--color-text)]">
          We couldn't load this product.
        </h1>

        <button
          type="button"
          onClick={() => refetch()}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-text)] px-6 py-3 text-sm text-[var(--color-bg)] transition hover:bg-[var(--color-primary)] hover:text-white"
        >
          <RefreshCw size={16} />
          Try again
        </button>

        <div>
          <Link
            to="/shop"
            className="mt-6 inline-block text-sm text-[var(--color-primary)] hover:underline"
          >
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  const increaseQuantity = () => {
    setQuantity((current) => current + 1);
    setAdded(false);
  };

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
    setAdded(false);
  };

  const handleAddToCart = () => {
    const existingCart = JSON.parse(
      localStorage.getItem("maison-cart") || "[]",
    );

    const existingItem = existingCart.find((item) => item.id === product.id);

    let updatedCart;

    if (existingItem) {
      updatedCart = existingCart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item,
      );
    } else {
      updatedCart = [
        ...existingCart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
        },
      ];
    }

    localStorage.setItem("maison-cart", JSON.stringify(updatedCart));

    window.dispatchEvent(new Event("cartUpdated"));
    setAdded(true);
  };

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-300">
      <section className="mx-auto max-w-[1440px] px-5 py-10 sm:px-10 lg:px-14">
        {/* Breadcrumb */}
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] transition hover:text-[var(--color-primary)]"
        >
          <ArrowLeft size={17} />
          Back to Shop
        </Link>

        {/* Product */}
        <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-16">
          {/* Image */}
          <div className="relative overflow-hidden rounded-2xl bg-[var(--color-surface)]">
            {product.badge && (
              <span className="absolute left-5 top-5 z-10 rounded-full bg-[var(--color-primary)] px-4 py-2 text-xs text-white">
                {product.badge}
              </span>
            )}

            <img
              src={product.image}
              alt={product.name}
              width="800"
              height="1000"
              loading="eager"
              decoding="async"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center py-4 md:py-10">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-primary)]">
              {product.category}
            </p>

            <h1 className="mt-4 font-serif text-4xl leading-tight text-[var(--color-text)] sm:text-5xl">
              {product.name}
            </h1>

            <div className="mt-6 flex items-center gap-3">
              <span className="text-2xl font-medium text-[var(--color-text)]">
                ${Number(product.price).toFixed(2)}
              </span>

              {product.oldPrice != null && (
                <span className="text-lg text-[var(--color-muted)] line-through">
                  ${Number(product.oldPrice).toFixed(2)}
                </span>
              )}
            </div>

            <div className="my-8 h-px bg-[var(--color-border)]" />

            <p className="text-base leading-8 text-[var(--color-muted)]">
              {product.description}
            </p>

            {/* Quantity */}
            <div className="mt-8">
              <p className="mb-3 text-sm font-medium text-[var(--color-text)]">
                Quantity
              </p>

              <div className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity === 1}
                  aria-label="Decrease quantity"
                  className="p-4 text-[var(--color-text)] transition hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Minus size={16} />
                </button>

                <span className="min-w-10 text-center text-sm text-[var(--color-text)]">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  aria-label="Increase quantity"
                  className="p-4 text-[var(--color-text)] transition hover:text-[var(--color-primary)]"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="mt-8 flex w-full items-center justify-center gap-3 rounded-full bg-[var(--color-text)] px-8 py-4 text-sm font-medium text-[var(--color-bg)] transition hover:bg-[var(--color-primary)] hover:text-white"
            >
              <ShoppingBag size={19} />
              {added ? "Added to bag ✓" : "Add to Cart"}
            </button>

            {added && (
              <p className="mt-4 text-center text-sm text-[var(--color-primary)]">
                Product added to your bag successfully.
              </p>
            )}

            <p className="mt-5 text-center text-xs leading-6 text-[var(--color-muted)]">
              Thoughtfully chosen pieces for everyday living.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
