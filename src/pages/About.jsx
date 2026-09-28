import { Link } from "react-router-dom";
import { Heart, Sparkles, ShieldCheck, Truck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Heart,
    title: "Made with Care",
    description:
      "We believe every detail matters, from the products we choose to the experience we create for you.",
  },
  {
    icon: Sparkles,
    title: "Timeless Style",
    description:
      "Discover thoughtfully selected pieces designed to bring beauty and personality into your everyday life.",
  },
  {
    icon: ShieldCheck,
    title: "Quality First",
    description:
      "We focus on quality, craftsmanship, and products you'll love having in your home and wardrobe.",
  },
  {
    icon: Truck,
    title: "A Smooth Experience",
    description:
      "Our goal is to make discovering and shopping for your favorite pieces simple and enjoyable.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

export default function About() {
  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: "var(--color-bg)",
        color: "var(--color-text)",
      }}
    >
      {/* Hero */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative overflow-hidden px-6 py-20 text-center md:py-28"
        style={{ backgroundColor: "var(--color-border)" }}
      >
        <motion.p
          variants={fadeUp}
          className="mb-5 text-xs uppercase tracking-[0.35em]"
          style={{ color: "var(--color-primary)" }}
        >
          The Story Behind Maison
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="mb-6 font-serif text-5xl font-light leading-tight md:text-7xl"
        >
          A Little More
          <br />
          <span className="italic" style={{ color: "var(--color-primary)" }}>
            Beautiful
          </span>
          <br />
          Every Day.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mx-auto max-w-xl text-sm leading-8 md:text-base"
          style={{ color: "var(--color-muted)" }}
        >
          At Maison, we believe that the little things make life special. Our
          collection brings together timeless style, thoughtful details, and
          pieces that feel like you.
        </motion.p>

        <motion.div variants={fadeUp}>
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="mt-9 inline-block"
          >
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 px-8 py-4 text-sm text-white transition"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Explore Our Collection
              <ArrowRight size={17} />
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Our Story */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:px-10 md:py-24">
        <motion.div
          initial={{ opacity: 0, x: -35 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="flex min-h-[350px] items-center justify-center p-10 md:min-h-[500px]"
          style={{ backgroundColor: "var(--color-border)" }}
        >
          <div className="max-w-sm text-center">
            <p
              className="mb-5 font-serif text-6xl"
              style={{ color: "var(--color-primary)" }}
            >
              Maison.
            </p>

            <p
              className="text-xs uppercase tracking-[0.3em]"
              style={{ color: "var(--color-muted)" }}
            >
              Your Everyday Inspiration
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 35 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <p
            className="mb-4 text-xs uppercase tracking-[0.3em]"
            style={{ color: "var(--color-primary)" }}
          >
            Who We Are
          </p>

          <h2 className="mb-7 font-serif text-4xl font-light leading-tight md:text-5xl">
            More Than Just
            <br />A Shopping Experience
          </h2>

          <p
            className="mb-5 text-sm leading-8"
            style={{ color: "var(--color-muted)" }}
          >
            Maison is a lifestyle-inspired store built around the idea that
            everyday essentials can be beautiful, meaningful, and full of
            character.
          </p>

          <p
            className="mb-8 text-sm leading-8"
            style={{ color: "var(--color-muted)" }}
          >
            From accessories to home details, we bring together a curated
            selection of pieces that combine style, quality, and simplicity.
          </p>

          <motion.div whileHover={{ x: 5 }} className="inline-block">
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 border-b pb-2 text-sm transition"
              style={{
                borderColor: "var(--color-primary)",
                color: "var(--color-primary)",
              }}
            >
              Discover Maison
              <ArrowRight size={17} />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section
        className="px-6 py-16 md:px-10 md:py-24"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            className="mb-14 text-center"
          >
            <motion.p
              variants={fadeUp}
              className="mb-4 text-xs uppercase tracking-[0.3em]"
              style={{ color: "var(--color-primary)" }}
            >
              What Makes Us Special
            </motion.p>

            <motion.h2
              variants={fadeUp}
              className="font-serif text-4xl font-light md:text-5xl"
            >
              The Maison Experience
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerContainer}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={index}
                  variants={fadeUp}
                  whileHover={{ y: -7 }}
                  className="border p-7 transition-shadow hover:shadow-lg"
                  style={{
                    borderColor: "var(--color-border)",
                    backgroundColor: "var(--color-bg)",
                  }}
                >
                  <div
                    className="mb-6 flex h-14 w-14 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: "var(--color-border)",
                      color: "var(--color-primary)",
                    }}
                  >
                    <Icon size={26} />
                  </div>

                  <h3 className="mb-4 font-serif text-xl">{feature.title}</h3>

                  <p
                    className="text-sm leading-7"
                    style={{ color: "var(--color-muted)" }}
                  >
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Call To Action */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="px-6 py-20 text-center md:py-28"
      >
        <motion.p
          variants={fadeUp}
          className="mb-4 text-xs uppercase tracking-[0.3em]"
          style={{ color: "var(--color-primary)" }}
        >
          Find Your Favorites
        </motion.p>

        <motion.h2
          variants={fadeUp}
          className="mb-6 font-serif text-4xl font-light md:text-6xl"
        >
          Make Every Day
          <br />
          Feel Special.
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="mx-auto mb-9 max-w-lg text-sm leading-7"
          style={{ color: "var(--color-muted)" }}
        >
          Explore our collection and find the pieces that make your everyday
          moments a little more beautiful.
        </motion.p>

        <motion.div variants={fadeUp}>
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="inline-block"
          >
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 px-9 py-4 text-sm text-white transition"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Shop Now
              <ArrowRight size={17} />
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>
    </main>
  );
}
