import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { UserRound, Mail, LockKeyhole, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useToast } from "../components/Toast";

const initialForm = { name: "", email: "", password: "" };

export default function Account() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(initialForm);
  const shouldReduceMotion = useReducedMotion();
  const { addToast } = useToast();

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();

      const customer = {
        name: mode === "register" ? form.name.trim() : form.email.split("@")[0],
        email: form.email.trim(),
      };

      try {
        localStorage.setItem("maison-customer", JSON.stringify(customer));

        addToast({
          message:
            mode === "register"
              ? "Your account has been created for this demo!"
              : "You're signed in for this demo!",
          type: "success",
        });
      } catch {
        addToast({
          message: "Something went wrong. Please try again.",
          type: "error",
        });
      }
    },
    [mode, form, addToast],
  );

  const switchMode = useCallback((newMode) => {
    setMode(newMode);
    setForm(initialForm);
  }, []);

  return (
    <motion.main
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
      className="min-h-[75vh] bg-[var(--color-bg)] px-5 py-12 text-[var(--color-text)] transition-colors duration-300 sm:py-16"
    >
      <div className="mx-auto max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-primary)] transition-colors hover:underline"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <motion.div
          layout
          className="mt-8 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors duration-300 sm:p-10"
        >
          {/* Header */}
          <div className="text-center">
            <motion.div
              initial={shouldReduceMotion ? false : { scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-border)]"
            >
              <UserRound size={28} className="text-[var(--color-primary)]" />
            </motion.div>

            <h1 className="mt-6 font-serif text-3xl sm:text-4xl">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h1>

            <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
              {mode === "login"
                ? "Sign in to continue your Maison experience."
                : "Join Maison and discover pieces made for everyday life."}
            </p>
          </div>

          {/* Tabs */}
          <div className="mt-8 grid grid-cols-2 rounded-full bg-[var(--color-border)] p-1">
            <motion.button
              type="button"
              onClick={() => switchMode("login")}
              whileTap={{ scale: 0.97 }}
              aria-pressed={mode === "login"}
              className={`rounded-full py-3 text-sm transition-colors ${
                mode === "login"
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-transparent text-[var(--color-muted)]"
              }`}
            >
              Sign In
            </motion.button>

            <motion.button
              type="button"
              onClick={() => switchMode("register")}
              whileTap={{ scale: 0.97 }}
              aria-pressed={mode === "register"}
              className={`rounded-full py-3 text-sm transition-colors ${
                mode === "register"
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-transparent text-[var(--color-muted)]"
              }`}
            >
              Create Account
            </motion.button>
          </div>

          {/* Form */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.form
              key={mode}
              initial={shouldReduceMotion ? false : { opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={
                shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -15 }
              }
              transition={{ duration: shouldReduceMotion ? 0.15 : 0.25 }}
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              {mode === "register" && (
                <div>
                  <label
                    htmlFor="account-name"
                    className="mb-2 block text-sm text-[var(--color-muted)]"
                  >
                    Full Name
                  </label>

                  <div className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 transition-colors">
                    <UserRound
                      size={18}
                      className="shrink-0 text-[var(--color-muted)]"
                    />

                    <input
                      id="account-name"
                      required
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      className="w-full bg-transparent py-3.5 text-sm text-[var(--color-text)] outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="account-email"
                  className="mb-2 block text-sm text-[var(--color-muted)]"
                >
                  Email Address
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 transition-colors">
                  <Mail
                    size={18}
                    className="shrink-0 text-[var(--color-muted)]"
                  />

                  <input
                    id="account-email"
                    required
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full bg-transparent py-3.5 text-sm text-[var(--color-text)] outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="account-password"
                  className="mb-2 block text-sm text-[var(--color-muted)]"
                >
                  Password
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 transition-colors">
                  <LockKeyhole
                    size={18}
                    className="shrink-0 text-[var(--color-muted)]"
                  />

                  <input
                    id="account-password"
                    required
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    minLength={6}
                    placeholder="Enter your password"
                    autoComplete={
                      mode === "register" ? "new-password" : "current-password"
                    }
                    className="w-full bg-transparent py-3.5 text-sm text-[var(--color-text)] outline-none"
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full rounded-full bg-[var(--color-primary)] px-6 py-4 text-sm font-medium text-white transition-colors"
              >
                {mode === "login" ? "Sign In" : "Create Account"}
              </motion.button>
            </motion.form>
          </AnimatePresence>

          <p className="mt-6 text-center text-xs leading-6 text-[var(--color-muted)]">
            Demo account only. Real authentication will be connected to a
            backend later.
          </p>
        </motion.div>
      </div>
    </motion.main>
  );
}
