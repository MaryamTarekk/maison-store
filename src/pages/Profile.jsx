import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  UserRound,
  Mail,
  Save,
  LogOut,
  Package,
  ShoppingBag,
  CheckCircle,
} from "lucide-react";

const CUSTOMER_KEY = "maison-customer";

export default function Profile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    try {
      const savedCustomer = JSON.parse(
        localStorage.getItem(CUSTOMER_KEY) || "null",
      );

      if (savedCustomer) {
        setForm({
          name: savedCustomer.name || "",
          email: savedCustomer.email || "",
        });

        setIsLoggedIn(true);
      }
    } catch {
      setForm({ name: "", email: "" });
      setIsLoggedIn(false);
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const customer = {
      name: form.name.trim(),
      email: form.email.trim(),
    };

    localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer));

    setForm(customer);
    setIsLoggedIn(true);
    setMessage("Your profile has been updated successfully.");
  };

  const handleLogout = () => {
    localStorage.removeItem(CUSTOMER_KEY);
    setIsLoggedIn(false);
    navigate("/account");
  };

  const initials = form.name
    ? form.name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("")
    : "M";

  // No saved customer
  if (!isLoggedIn) {
    return (
      <motion.main
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <UserRound size={52} style={{ color: "var(--color-primary)" }} />
        </motion.div>

        <h1
          className="mt-6 font-serif text-4xl"
          style={{ color: "var(--color-text)" }}
        >
          Sign In to Your Account
        </h1>

        <p
          className="mt-4 max-w-md leading-7"
          style={{ color: "var(--color-muted)" }}
        >
          Please sign in or create an account to view your profile.
        </p>

        <motion.div
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="mt-8"
        >
          <Link
            to="/account"
            className="inline-flex rounded-full px-8 py-4 text-sm transition-colors"
            style={{
              backgroundColor: "var(--color-text)",
              color: "var(--color-bg)",
            }}
          >
            Sign In
          </Link>
        </motion.div>
      </motion.main>
    );
  }

  return (
    <main
      className="min-h-screen px-5 py-14 sm:px-10 lg:px-14"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <section className="mx-auto max-w-[1000px]">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p
            className="mb-4 text-xs uppercase tracking-[0.25em]"
            style={{ color: "var(--color-primary)" }}
          >
            Your Maison Account
          </p>

          <h1
            className="font-serif text-5xl sm:text-6xl"
            style={{ color: "var(--color-text)" }}
          >
            My Profile
          </h1>

          <p className="mt-4" style={{ color: "var(--color-muted)" }}>
            Manage your personal information and account.
          </p>
        </motion.div>

        <div className="grid items-start gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl border p-6"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            <div className="flex flex-col items-center text-center">
              <motion.div
                whileHover={{ scale: 1.06 }}
                className="flex h-24 w-24 items-center justify-center rounded-full font-serif text-3xl"
                style={{
                  backgroundColor: "var(--color-border)",
                  color: "var(--color-text)",
                }}
              >
                {initials}
              </motion.div>

              <h2
                className="mt-5 font-serif text-2xl"
                style={{ color: "var(--color-text)" }}
              >
                {form.name || "Maison Customer"}
              </h2>

              <p
                className="mt-2 break-all text-sm"
                style={{ color: "var(--color-muted)" }}
              >
                {form.email}
              </p>
            </div>

            <div
              className="mt-8 space-y-3 border-t pt-6"
              style={{ borderColor: "var(--color-border)" }}
            >
              <Link
                to="/my-orders"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors"
                style={{ color: "var(--color-text)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--color-border)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <Package size={18} />
                My Orders
              </Link>

              <Link
                to="/shop"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors"
                style={{ color: "var(--color-text)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--color-border)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <ShoppingBag size={18} />
                Continue Shopping
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors"
                style={{ color: "var(--color-primary)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--color-border)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </motion.aside>

          {/* Profile Form */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl border p-6 sm:p-9"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            <h2
              className="font-serif text-2xl"
              style={{ color: "var(--color-text)" }}
            >
              Personal Information
            </h2>

            <p
              className="mt-3 text-sm leading-6"
              style={{ color: "var(--color-muted)" }}
            >
              Update your name and email address below.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="profile-name"
                  className="mb-2 block text-sm"
                  style={{ color: "var(--color-muted)" }}
                >
                  Full Name
                </label>

                <div
                  className="flex items-center gap-3 rounded-xl border px-4 transition-colors focus-within:border-[var(--color-primary)]"
                  style={{
                    backgroundColor: "var(--color-bg)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <UserRound
                    size={18}
                    style={{ color: "var(--color-muted)" }}
                  />

                  <input
                    id="profile-name"
                    required
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full bg-transparent py-4 text-sm outline-none"
                    style={{ color: "var(--color-text)" }}
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label
                  htmlFor="profile-email"
                  className="mb-2 block text-sm"
                  style={{ color: "var(--color-muted)" }}
                >
                  Email Address
                </label>

                <div
                  className="flex items-center gap-3 rounded-xl border px-4 transition-colors focus-within:border-[var(--color-primary)]"
                  style={{
                    backgroundColor: "var(--color-bg)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <Mail size={18} style={{ color: "var(--color-muted)" }} />

                  <input
                    id="profile-email"
                    required
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full bg-transparent py-4 text-sm outline-none"
                    style={{ color: "var(--color-text)" }}
                  />
                </div>
              </div>

              {/* Success Message */}
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 rounded-xl p-4 text-sm"
                  style={{
                    backgroundColor: "var(--color-border)",
                    color: "var(--color-text)",
                  }}
                >
                  <CheckCircle
                    size={18}
                    style={{ color: "var(--color-primary)" }}
                  />
                  {message}
                </motion.div>
              )}

              {/* Save Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-3 rounded-full px-8 py-4 text-sm font-medium transition-colors"
                style={{
                  backgroundColor: "var(--color-text)",
                  color: "var(--color-bg)",
                }}
              >
                <Save size={17} />
                Save Changes
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
