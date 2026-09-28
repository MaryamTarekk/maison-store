import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Truck, RefreshCw, ShieldCheck, Send } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getFeaturedProducts } from "../services/products.api";
import { useToast } from "../components/Toast";

// ── Category Data ────────────────────────────────────────
const categories = [
  {
    name: "Audio",
    description: "Sound, thoughtfully designed.",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Watches",
    description: "Timeless by nature.",
    image:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Bags",
    description: "Made to go everywhere.",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Home",
    description: "Objects that feel like home.",
    image:
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=700&q=80",
  },
];

// Build a responsive srcset from an Unsplash URL by swapping its width param,
// so mobile doesn't download the same bytes as a 1440px desktop hero.
const unsplashSrcSet = (url, widths) =>
  widths
    .map((w) => `${url.replace(/([?&])w=\d+/, `$1w=${w}`)} ${w}w`)
    .join(", ");

export default function Home() {
  const shouldReduceMotion = useReducedMotion();
  const { addToast } = useToast();
  const [email, setEmail] = useState("");

  // Motion variants collapse to simple fades (no travel/scale) when the
  // visitor has requested reduced motion, instead of framer-motion still
  // running the full transform timeline under the hood.
  const fadeInUp = useMemo(
    () =>
      shouldReduceMotion
        ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
        : {
            hidden: { opacity: 0, y: 40 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
            },
          },
    [shouldReduceMotion],
  );

  const staggerContainer = useMemo(
    () =>
      shouldReduceMotion
        ? { hidden: {}, visible: {} }
        : { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } },
    [shouldReduceMotion],
  );

  const scaleIn = useMemo(
    () =>
      shouldReduceMotion
        ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
        : {
            hidden: { opacity: 0, scale: 0.9 },
            visible: {
              opacity: 1,
              scale: 1,
              transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
            },
          },
    [shouldReduceMotion],
  );

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["featured-products"],
    queryFn: getFeaturedProducts,
    staleTime: 60_000,
  });

  const products = data?.data ?? [];

  return (
    <main
      id="top"
      className="bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-300"
    >
      {/* ─── Hero ─── */}
      <section className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 py-12 sm:px-10 md:py-16 lg:grid-cols-2 lg:gap-14 lg:px-14 lg:py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="order-2 lg:order-1"
        >
          <motion.p
            variants={fadeInUp}
            className="mb-5 text-xs font-medium uppercase tracking-[0.28em] text-[var(--color-primary)]"
          >
            Autumn Edit — 2026
          </motion.p>

          <motion.h1
            variants={fadeInUp}
            className="max-w-[620px] font-serif text-5xl leading-[1.08] tracking-tight text-[var(--color-text)] sm:text-6xl lg:text-7xl xl:text-[82px]"
          >
            Fewer things, better made.
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mt-6 max-w-[460px] text-base leading-8 text-[var(--color-muted)] sm:text-lg"
          >
            Headphones, watches, leather and home objects — designed with
            restraint and built to be kept.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link
              to="/shop"
              className="group inline-flex items-center gap-3 rounded-full bg-[var(--color-text)] px-7 py-4 text-sm font-medium text-[var(--color-bg)] transition-colors hover:bg-[var(--color-primary)] hover:text-white"
            >
              Shop the collection
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <a
              href="#categories"
              className="rounded-full border border-[var(--color-border)] px-7 py-4 text-sm text-[var(--color-text)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            >
              Explore categories
            </a>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="mt-12 flex items-center gap-4 border-t border-[var(--color-border)] pt-6"
          >
            <div className="flex -space-x-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=70"
                alt=""
                className="h-10 w-10 rounded-full border-2 border-[var(--color-bg)] object-cover"
                width="40"
                height="40"
                decoding="async"
              />

              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=70"
                alt=""
                className="h-10 w-10 rounded-full border-2 border-[var(--color-bg)] object-cover"
                width="40"
                height="40"
                decoding="async"
              />

              <img
                src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=80&q=70"
                alt=""
                className="h-10 w-10 rounded-full border-2 border-[var(--color-bg)] object-cover"
                width="40"
                height="40"
                decoding="async"
              />
            </div>

            <div>
              <p className="font-serif text-xl text-[var(--color-text)]">
                24,000+ customers
              </p>

              <p className="mt-1 text-xs text-[var(--color-muted)]">
                Thoughtfully chosen. Loved every day.
              </p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="order-1 lg:order-2"
        >
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85"
              srcSet={unsplashSrcSet(
                "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85",
                [600, 900, 1200, 1600],
              )}
              sizes="(min-width: 1024px) 50vw, 100vw"
              alt="Premium leather bag from the Maison collection"
              className="h-[360px] w-full rounded-[28px] object-cover sm:h-[480px] lg:h-[570px]"
              width="1200"
              height="1400"
              fetchPriority="high"
              decoding="async"
            />

            {/* Gradient overlay for depth */}
            <div className="absolute inset-0 rounded-[28px] bg-gradient-to-t from-black/20 via-transparent to-transparent" />

            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: shouldReduceMotion ? 0 : 0.5,
                duration: 0.5,
              }}
              className="absolute -bottom-5 left-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-lg backdrop-blur-sm sm:left-8 sm:p-6"
            >
              <p className="text-xs text-[var(--color-muted)]">
                The everyday icon
              </p>

              <p className="mt-1 font-serif text-2xl text-[var(--color-text)]">
                The Maison Tote
              </p>

              <Link
                to="/product/3"
                className="mt-3 inline-block border-b border-[var(--color-primary)] pb-0.5 text-sm text-[var(--color-primary)]"
              >
                Discover the piece
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ─── Benefits ─── */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto grid max-w-[1440px] gap-6 px-5 py-6 sm:grid-cols-3 sm:px-10 lg:px-14">
          <div className="flex items-center justify-center gap-3 text-sm text-[var(--color-text)] sm:justify-start">
            <Truck size={20} className="text-[var(--color-primary)]" />
            Free shipping over $150
          </div>

          <div className="flex items-center justify-center gap-3 text-sm text-[var(--color-text)]">
            <RefreshCw size={20} className="text-[var(--color-primary)]" />
            30-day returns
          </div>

          <div className="flex items-center justify-center gap-3 text-sm text-[var(--color-text)] sm:justify-end">
            <ShieldCheck size={20} className="text-[var(--color-primary)]" />
            2-year warranty
          </div>
        </div>
      </section>

      {/* ─── Categories (scroll-animated) ─── */}
      <motion.section
        id="categories"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainer}
        className="mx-auto max-w-[1440px] px-5 py-20 sm:px-10 lg:px-14 lg:py-28"
      >
        <motion.div
          variants={fadeInUp}
          className="mb-10 flex items-end justify-between gap-4"
        >
          <div>
            <h2 className="font-serif text-4xl text-[var(--color-text)] sm:text-5xl">
              Shop by category
            </h2>

            <p className="mt-3 max-w-md text-sm text-[var(--color-muted)]">
              Four collections, each built around one idea done well.
            </p>
          </div>

          <Link
            to="/shop"
            className="hidden shrink-0 border-b border-transparent text-sm text-[var(--color-text)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] sm:block"
          >
            View all
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {categories.map((cat) => (
            <motion.div key={cat.name} variants={scaleIn}>
              <Link to={`/shop?category=${cat.name}`} className="group block">
                <div className="overflow-hidden rounded-2xl bg-[var(--color-surface)]">
                  <img
                    src={cat.image}
                    srcSet={unsplashSrcSet(cat.image, [350, 500, 700])}
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                    alt={cat.name}
                    width="700"
                    height="850"
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="mt-4">
                  <h3 className="font-serif text-xl text-[var(--color-text)] underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-[var(--color-primary)] sm:text-2xl">
                    {cat.name}
                  </h3>

                  <p className="mt-1 text-xs text-[var(--color-muted)] sm:text-sm">
                    {cat.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ─── Featured Products (scroll-animated) ─── */}
      <motion.section
        id="collection"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
        className="bg-[var(--color-surface)] py-20 transition-colors duration-300 sm:py-24"
      >
        <div className="mx-auto max-w-[1440px] px-5 sm:px-10 lg:px-14">
          <motion.div
            variants={fadeInUp}
            className="mb-10 flex items-end justify-between gap-4"
          >
            <div>
              <h2 className="font-serif text-4xl text-[var(--color-text)] sm:text-5xl">
                The collection
              </h2>

              <p className="mt-3 max-w-md text-sm text-[var(--color-muted)]">
                A rotating edit of the pieces worth keeping.
              </p>
            </div>

            <Link
              to="/shop"
              className="shrink-0 border-b border-transparent text-sm text-[var(--color-text)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            >
              Explore all
            </Link>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-[4/5] rounded-2xl bg-[var(--color-border)]" />
                  <div className="mt-4 h-4 w-2/3 rounded bg-[var(--color-border)]" />
                  <div className="mt-3 h-4 w-1/3 rounded bg-[var(--color-border)]" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="py-12 text-center">
              <p className="text-[var(--color-muted)]">
                We couldn&apos;t load the products.
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-4 rounded-full bg-[var(--color-text)] px-6 py-3 text-sm text-[var(--color-bg)] transition hover:bg-[var(--color-primary)] hover:text-white"
              >
                Try again
              </button>
            </div>
          ) : products.length === 0 ? (
            <p className="py-12 text-center text-[var(--color-muted)]">
              No products available right now.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {products.map((product) => (
                <motion.article
                  key={product.id}
                  variants={scaleIn}
                  className="group min-w-0"
                >
                  <Link to={`/product/${product.id}`} className="block">
                    <div className="relative overflow-hidden rounded-2xl bg-[var(--color-bg)]">
                      {product.badge && (
                        <span className="absolute left-3 top-3 z-10 rounded-full bg-[var(--color-primary)] px-3 py-1 text-[10px] font-medium text-white sm:text-xs">
                          {product.badge}
                        </span>
                      )}

                      <img
                        src={product.image}
                        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                        alt={product.name}
                        width="700"
                        height="850"
                        loading="lazy"
                        decoding="async"
                        className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="mt-4">
                      <p className="text-xs text-[var(--color-muted)]">
                        {product.category}
                      </p>

                      <h3 className="mt-1 font-medium text-[var(--color-text)] transition-colors group-hover:text-[var(--color-primary)] sm:text-base">
                        {product.name}
                      </h3>

                      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                        <span className="font-medium text-[var(--color-text)]">
                          ${Number(product.price).toFixed(2)}
                        </span>

                        {product.oldPrice && (
                          <span className="text-[var(--color-muted)] line-through">
                            ${Number(product.oldPrice).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      {/* ─── Brand Story (scroll-animated) ─── */}
      <motion.section
        id="about"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 py-20 sm:px-10 lg:grid-cols-2 lg:gap-16 lg:px-14 lg:py-28"
      >
        <motion.div
          variants={scaleIn}
          className="overflow-hidden rounded-[24px] bg-[var(--color-surface)]"
        >
          <img
            src="https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=1100&q=80"
            srcSet={unsplashSrcSet(
              "https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=1100&q=80",
              [500, 800, 1100],
            )}
            sizes="(min-width: 1024px) 50vw, 100vw"
            alt="A thoughtfully styled interior with natural materials"
            width="1100"
            height="850"
            loading="lazy"
            decoding="async"
            className="aspect-[5/4] w-full object-cover"
          />
        </motion.div>

        <motion.div variants={fadeInUp}>
          <h2 className="font-serif text-4xl leading-tight text-[var(--color-text)] sm:text-5xl">
            Good things deserve to stay.
          </h2>

          <p className="mt-6 max-w-lg text-base leading-8 text-[var(--color-muted)]">
            We believe in fewer, better things. Objects chosen with care, made
            to be used every day, and designed to feel right for years to come.
          </p>

          <Link
            to="/about"
            className="mt-8 inline-block border-b border-[var(--color-primary)] pb-2 text-sm text-[var(--color-text)] transition-colors hover:text-[var(--color-primary)]"
          >
            Discover the Maison approach
          </Link>
        </motion.div>
      </motion.section>

      {/* ─── Newsletter (scroll-animated) ─── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
        className="border-t border-[var(--color-border)] bg-[var(--color-surface)]"
      >
        <div className="mx-auto max-w-[1440px] px-5 py-20 text-center sm:px-10 lg:px-14">
          <h2 className="font-serif text-4xl text-[var(--color-text)] sm:text-5xl">
            Join the Maison world
          </h2>

          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[var(--color-muted)]">
            Be the first to know about new arrivals, exclusive offers, and
            stories from the studio.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();

              const trimmed = email.trim();

              if (!trimmed) {
                addToast({
                  message: "Enter your email address first.",
                  type: "error",
                });
                return;
              }

              // No backend call yet — just confirm receipt to the visitor.
              addToast({
                message: "You're on the list! Check your inbox soon.",
                type: "success",
              });

              setEmail("");
            }}
            className="mx-auto mt-8 flex max-w-md items-center gap-3"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              aria-label="Email address"
              className="flex-1 rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] px-6 py-4 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)]"
            />

            <button
              type="submit"
              className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[var(--color-text)] text-[var(--color-bg)] transition hover:bg-[var(--color-primary)] hover:text-white"
              aria-label="Subscribe"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </motion.section>
    </main>
  );
}
