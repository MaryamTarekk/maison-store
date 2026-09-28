import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle,
  ShoppingBag,
  MapPin,
  CreditCard,
  Truck,
} from "lucide-react";

const CART_KEY = "maison-cart";
const ORDERS_KEY = "maison-orders";

export default function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    payment: "cod",
  });

  useEffect(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");

      setCart(Array.isArray(savedCart) ? savedCart : []);
    } catch {
      setCart([]);
    }
  }, []);

  const subtotal = cart.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.quantity || 0),
    0,
  );

  const formatPrice = (price) => `$${Number(price || 0).toFixed(2)}`;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (cart.length === 0 || form.payment === "card") return;

    const order = {
      id: `MS-${Date.now()}`,
      customer: {
        ...form,
        name: form.fullName,
      },
      items: cart,
      total: subtotal,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    try {
      const previousOrders = JSON.parse(
        localStorage.getItem(ORDERS_KEY) || "[]",
      );

      const validOrders = Array.isArray(previousOrders) ? previousOrders : [];

      localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...validOrders]));

      localStorage.removeItem(CART_KEY);
      window.dispatchEvent(new Event("cartUpdated"));

      setOrderPlaced(true);
    } catch {
      alert("Unable to place your order. Please try again.");
    }
  };

  const inputStyle = {
    backgroundColor: "var(--color-bg)",
    borderColor: "var(--color-border)",
    color: "var(--color-text)",
  };

  const labelStyle = {
    color: "var(--color-muted)",
  };

  const cardStyle = {
    backgroundColor: "var(--color-surface)",
    borderColor: "var(--color-border)",
  };

  // Order Success
  if (orderPlaced) {
    return (
      <motion.main
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex min-h-[70vh] items-center justify-center px-5 py-16"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-xl rounded-3xl border p-8 text-center sm:p-12"
          style={cardStyle}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 150, delay: 0.2 }}
          >
            <CheckCircle
              size={64}
              strokeWidth={1.4}
              className="mx-auto"
              style={{ color: "var(--color-primary)" }}
            />
          </motion.div>

          <h1
            className="mt-6 font-serif text-4xl"
            style={{ color: "var(--color-text)" }}
          >
            Thank You for Your Order!
          </h1>

          <p className="mt-4 leading-7" style={{ color: "var(--color-muted)" }}>
            Your order has been placed successfully. We appreciate you choosing
            Maison.
          </p>

          <motion.button
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/shop")}
            className="mt-8 rounded-full px-8 py-4 text-sm transition-colors"
            style={{
              backgroundColor: "var(--color-text)",
              color: "var(--color-bg)",
            }}
          >
            Continue Shopping
          </motion.button>
        </motion.div>
      </motion.main>
    );
  }

  // Empty Cart
  if (cart.length === 0) {
    return (
      <motion.main
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        <ShoppingBag size={50} style={{ color: "var(--color-primary)" }} />

        <h1
          className="mt-6 font-serif text-4xl"
          style={{ color: "var(--color-text)" }}
        >
          Your Bag is Empty
        </h1>

        <p className="mt-4" style={{ color: "var(--color-muted)" }}>
          Add some products before checking out.
        </p>

        <Link
          to="/shop"
          className="mt-8 rounded-full px-8 py-4 text-sm transition-colors"
          style={{
            backgroundColor: "var(--color-text)",
            color: "var(--color-bg)",
          }}
        >
          Continue Shopping
        </Link>
      </motion.main>
    );
  }

  return (
    <main
      className="min-h-screen px-5 py-14 sm:px-10 lg:px-14"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="mx-auto max-w-[1200px]">
        {/* Back to Cart */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
            style={{ color: "var(--color-primary)" }}
          >
            <ArrowLeft size={17} />
            Back to Bag
          </Link>
        </motion.div>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1
            className="mt-6 font-serif text-5xl"
            style={{ color: "var(--color-text)" }}
          >
            Checkout
          </h1>

          <p className="mt-4" style={{ color: "var(--color-muted)" }}>
            Complete your details to place your order.
          </p>
        </motion.div>

        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1fr_380px]">
          {/* Customer Information */}
          <motion.form
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            onSubmit={handleSubmit}
            className="rounded-2xl border p-6 sm:p-9"
            style={cardStyle}
          >
            <div className="flex items-center gap-3">
              <MapPin size={22} style={{ color: "var(--color-primary)" }} />

              <h2
                className="font-serif text-2xl"
                style={{ color: "var(--color-text)" }}
              >
                Shipping Information
              </h2>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm"
                  style={labelStyle}
                >
                  Full Name
                </label>

                <input
                  id="fullName"
                  required
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--color-primary)]"
                  style={inputStyle}
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm"
                  style={labelStyle}
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  required
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone"
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--color-primary)]"
                  style={inputStyle}
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm"
                  style={labelStyle}
                >
                  Email Address
                </label>

                <input
                  id="email"
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--color-primary)]"
                  style={inputStyle}
                />
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm"
                  style={labelStyle}
                >
                  Street Address
                </label>

                <input
                  id="address"
                  required
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Street, building, apartment..."
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--color-primary)]"
                  style={inputStyle}
                />
              </div>

              {/* City */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="city"
                  className="mb-2 block text-sm"
                  style={labelStyle}
                >
                  City
                </label>

                <input
                  id="city"
                  required
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Enter your city"
                  className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--color-primary)]"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Payment Method */}
            <div
              className="mt-10 border-t pt-8"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div className="flex items-center gap-3">
                <CreditCard
                  size={22}
                  style={{ color: "var(--color-primary)" }}
                />

                <h2
                  className="font-serif text-2xl"
                  style={{ color: "var(--color-text)" }}
                >
                  Payment Method
                </h2>
              </div>

              <div className="mt-5 space-y-4">
                <label
                  className="flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors"
                  style={{
                    borderColor:
                      form.payment === "cod"
                        ? "var(--color-primary)"
                        : "var(--color-border)",
                    backgroundColor:
                      form.payment === "cod"
                        ? "var(--color-bg)"
                        : "transparent",
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={form.payment === "cod"}
                    onChange={handleChange}
                    className="accent-[var(--color-primary)]"
                  />

                  <Truck size={18} style={{ color: "var(--color-primary)" }} />

                  <span
                    className="text-sm"
                    style={{ color: "var(--color-text)" }}
                  >
                    Cash on Delivery
                  </span>
                </label>

                <label
                  className="flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors"
                  style={{
                    borderColor:
                      form.payment === "card"
                        ? "var(--color-primary)"
                        : "var(--color-border)",
                    backgroundColor:
                      form.payment === "card"
                        ? "var(--color-bg)"
                        : "transparent",
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={form.payment === "card"}
                    onChange={handleChange}
                    className="accent-[var(--color-primary)]"
                  />

                  <CreditCard
                    size={18}
                    style={{ color: "var(--color-primary)" }}
                  />

                  <span
                    className="text-sm"
                    style={{ color: "var(--color-text)" }}
                  >
                    Credit / Debit Card
                  </span>
                </label>

                {form.payment === "card" && (
                  <p
                    className="text-sm leading-6"
                    style={{ color: "var(--color-muted)" }}
                  >
                    Card payment is not available yet. Choose Cash on Delivery
                    to complete this demo order.
                  </p>
                )}
              </div>
            </div>

            {/* Place Order */}
            <motion.button
              type="submit"
              disabled={form.payment === "card"}
              whileHover={form.payment !== "card" ? { scale: 1.02 } : {}}
              whileTap={form.payment !== "card" ? { scale: 0.98 } : {}}
              className="mt-8 w-full rounded-full px-6 py-4 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                backgroundColor: "var(--color-text)",
                color: "var(--color-bg)",
              }}
            >
              Place Order — {formatPrice(subtotal)}
            </motion.button>
          </motion.form>

          {/* Order Summary */}
          <motion.aside
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="rounded-2xl border p-6 sm:p-8 lg:sticky lg:top-24"
            style={cardStyle}
          >
            <h2
              className="font-serif text-2xl"
              style={{ color: "var(--color-text)" }}
            >
              Your Order
            </h2>

            <div className="mt-6 space-y-5">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="h-20 w-16 rounded-xl object-cover"
                    style={{
                      backgroundColor: "var(--color-border)",
                    }}
                  />

                  <div className="min-w-0 flex-1">
                    <p
                      className="font-medium"
                      style={{ color: "var(--color-text)" }}
                    >
                      {item.name}
                    </p>

                    <p
                      className="mt-2 text-sm"
                      style={{ color: "var(--color-muted)" }}
                    >
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--color-text)" }}
                  >
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div
              className="mt-8 border-t pt-6"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-sm"
                  style={{ color: "var(--color-muted)" }}
                >
                  Subtotal
                </span>

                <span
                  className="font-medium"
                  style={{ color: "var(--color-text)" }}
                >
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span
                  className="text-sm"
                  style={{ color: "var(--color-muted)" }}
                >
                  Shipping
                </span>

                <span
                  className="text-sm"
                  style={{ color: "var(--color-muted)" }}
                >
                  Calculated later
                </span>
              </div>

              <div
                className="mt-6 flex items-center justify-between border-t pt-6"
                style={{ borderColor: "var(--color-border)" }}
              >
                <span
                  className="font-medium"
                  style={{ color: "var(--color-text)" }}
                >
                  Total
                </span>

                <span
                  className="text-xl font-medium"
                  style={{ color: "var(--color-primary)" }}
                >
                  {formatPrice(subtotal)}
                </span>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </main>
  );
}
