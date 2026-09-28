import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const footerSections = [
  {
    title: "Explore",
    links: [
      { label: "Home", to: "/" },
      { label: "Shop", to: "/shop" },
      { label: "About", to: "/about" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Customer care",
    links: [
      { label: "My Orders", to: "/my-orders" },
      { label: "My Wishlist", to: "/wishlist" },
      { label: "My Cart", to: "/cart" },
      { label: "My Account", to: "/account" },
    ],
  },
];

const footerVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export default function Footer() {
  return (
    <motion.footer
      id="footer"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={footerVariants}
      className="border-t"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
        color: "var(--color-text)",
      }}
    >
      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-10 lg:px-14 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <motion.div variants={itemVariants} className="sm:col-span-2">
            <Link
              to="/"
              className="font-serif text-4xl font-bold"
              style={{ color: "var(--color-text)" }}
            >
              Maison
              <span style={{ color: "var(--color-primary)" }}>.</span>
            </Link>

            <p
              className="mt-4 max-w-sm text-sm leading-7"
              style={{ color: "var(--color-muted)" }}
            >
              Considered objects for everyday life. Designed to last. Discover
              pieces made to become part of your everyday story.
            </p>

            <motion.div whileHover={{ x: 5 }}>
              <Link
                to="/about"
                className="mt-5 inline-flex items-center gap-2 text-sm transition-colors hover:text-[var(--color-primary)]"
                style={{ color: "var(--color-text)" }}
              >
                Our philosophy
                <ArrowUpRight size={16} />
              </Link>
            </motion.div>
          </motion.div>

          {/* Footer links */}
          {footerSections.map((section) => (
            <motion.div key={section.title} variants={itemVariants}>
              <h3
                className="mb-5 text-xs font-semibold uppercase tracking-[0.18em]"
                style={{ color: "var(--color-text)" }}
              >
                {section.title}
              </h3>

              <div className="flex flex-col gap-4 text-sm">
                {section.links.map((link) => (
                  <motion.div key={link.label} whileHover={{ x: 4 }}>
                    <Link
                      to={link.to}
                      className="w-fit transition-colors hover:text-[var(--color-primary)]"
                      style={{ color: "var(--color-muted)" }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom section */}
        <motion.div
          variants={itemVariants}
          className="mt-12 flex flex-col gap-5 border-t pt-6 text-xs sm:flex-row sm:items-center sm:justify-between"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-muted)",
          }}
        >
          <p>© 2026 Maison. Demo store — no real payments.</p>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 transition-colors hover:text-[var(--color-primary)]"
            style={{ color: "var(--color-muted)" }}
          >
            Back to top
            <ArrowUpRight size={15} />
          </button>
        </motion.div>
      </div>
    </motion.footer>
  );
}
