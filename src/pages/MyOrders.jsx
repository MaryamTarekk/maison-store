import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Package,
  ShoppingBag,
  CalendarDays,
  Clock3,
  MapPin,
  CheckCircle2,
  Truck,
  AlertCircle,
} from "lucide-react";

const ORDERS_KEY = "maison-orders";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    try {
      const savedOrders = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");

      setOrders(Array.isArray(savedOrders) ? savedOrders : []);
    } catch {
      setOrders([]);
    }
  }, []);

  const formatPrice = (price) => `$${Number(price || 0).toFixed(2)}`;

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusStyle = (status) => {
    const normalizedStatus = String(status || "Pending").toLowerCase();

    if (
      normalizedStatus.includes("deliver") ||
      normalizedStatus.includes("complete")
    ) {
      return {
        icon: CheckCircle2,
        label: status || "Pending",
        color: "#16A34A",
        background: "rgba(22, 163, 74, 0.12)",
      };
    }

    if (
      normalizedStatus.includes("ship") ||
      normalizedStatus.includes("transit")
    ) {
      return {
        icon: Truck,
        label: status || "Pending",
        color: "#3B82F6",
        background: "rgba(59, 130, 246, 0.12)",
      };
    }

    if (
      normalizedStatus.includes("cancel") ||
      normalizedStatus.includes("fail")
    ) {
      return {
        icon: AlertCircle,
        label: status || "Pending",
        color: "#DC2626",
        background: "rgba(220, 38, 38, 0.12)",
      };
    }

    return {
      icon: Clock3,
      label: status || "Pending",
      color: "var(--color-primary)",
      background: "var(--color-border)",
    };
  };

  const getOrderTotal = (order) => {
    if (order.total !== undefined && order.total !== null) {
      return Number(order.total) || 0;
    }

    return (order.items || []).reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
      0,
    );
  };

  // Empty Orders
  if (orders.length === 0) {
    return (
      <motion.main
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex min-h-[70vh] flex-col items-center justify-center px-5 py-16 text-center"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex h-20 w-20 items-center justify-center rounded-full"
          style={{ backgroundColor: "var(--color-border)" }}
        >
          <Package size={34} style={{ color: "var(--color-text)" }} />
        </motion.div>

        <h1
          className="mt-8 font-serif text-4xl sm:text-5xl"
          style={{ color: "var(--color-text)" }}
        >
          No Orders Yet
        </h1>

        <p
          className="mt-4 max-w-md leading-7"
          style={{ color: "var(--color-muted)" }}
        >
          You haven't placed any orders yet. Explore our collection and discover
          something special for your everyday life.
        </p>

        <motion.div
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="mt-8"
        >
          <Link
            to="/shop"
            className="inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm transition-colors"
            style={{
              backgroundColor: "var(--color-text)",
              color: "var(--color-bg)",
            }}
          >
            <ShoppingBag size={17} />
            Start Shopping
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
      <section className="mx-auto max-w-[1100px]">
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
            My Orders
          </h1>

          <p className="mt-4" style={{ color: "var(--color-muted)" }}>
            Keep track of your purchases and order details.
          </p>
        </motion.div>

        {/* Orders List */}
        <div className="space-y-8">
          {orders.map((order, index) => {
            const status = getStatusStyle(order.status);
            const StatusIcon = status.icon;
            const items = Array.isArray(order.items) ? order.items : [];

            return (
              <motion.article
                key={order.id || `order-${index}`}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: Math.min(index * 0.1, 0.5),
                }}
                whileHover={{ y: -3 }}
                className="overflow-hidden rounded-2xl border"
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderColor: "var(--color-border)",
                }}
              >
                {/* Order Header */}
                <div
                  className="flex flex-col gap-5 border-b p-6 sm:flex-row sm:items-center sm:justify-between sm:px-8"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <div>
                    <p
                      className="text-xs uppercase tracking-wider"
                      style={{ color: "var(--color-muted)" }}
                    >
                      Order Number
                    </p>

                    <h2
                      className="mt-2 text-lg font-semibold"
                      style={{ color: "var(--color-text)" }}
                    >
                      {order.id || `Order #${index + 1}`}
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-5">
                    <div>
                      <p
                        className="flex items-center gap-2 text-xs"
                        style={{ color: "var(--color-muted)" }}
                      >
                        <CalendarDays size={14} />
                        Order Date
                      </p>

                      <p
                        className="mt-2 text-sm"
                        style={{ color: "var(--color-text)" }}
                      >
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <span
                      className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium"
                      style={{
                        backgroundColor: status.background,
                        color: status.color,
                      }}
                    >
                      <StatusIcon size={14} />
                      {status.label}
                    </span>
                  </div>
                </div>

                {/* Products */}
                <div className="space-y-5 p-6 sm:px-8">
                  {items.length > 0 ? (
                    items.map((item, itemIndex) => (
                      <motion.div
                        key={`${order.id || index}-${item.id || itemIndex}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.35, delay: 0.1 }}
                        className="flex flex-col gap-4 sm:flex-row sm:items-center"
                      >
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name || "Product"}
                            loading="lazy"
                            className="h-24 w-24 rounded-xl object-cover"
                            style={{
                              backgroundColor: "var(--color-border)",
                            }}
                          />
                        ) : (
                          <div
                            className="flex h-24 w-24 items-center justify-center rounded-xl"
                            style={{
                              backgroundColor: "var(--color-border)",
                              color: "var(--color-muted)",
                            }}
                          >
                            <Package size={28} />
                          </div>
                        )}

                        <div className="flex-1">
                          <h3
                            className="font-serif text-xl"
                            style={{ color: "var(--color-text)" }}
                          >
                            {item.name || "Product"}
                          </h3>

                          <p
                            className="mt-2 text-sm"
                            style={{ color: "var(--color-muted)" }}
                          >
                            Quantity: {Number(item.quantity || 0)}
                          </p>

                          <p
                            className="mt-2 text-sm"
                            style={{ color: "var(--color-muted)" }}
                          >
                            Unit Price: {formatPrice(item.price)}
                          </p>
                        </div>

                        <p
                          className="font-medium"
                          style={{ color: "var(--color-text)" }}
                        >
                          {formatPrice(
                            Number(item.price || 0) *
                              Number(item.quantity || 0),
                          )}
                        </p>
                      </motion.div>
                    ))
                  ) : (
                    <p
                      className="text-sm"
                      style={{ color: "var(--color-muted)" }}
                    >
                      No product details available for this order.
                    </p>
                  )}
                </div>

                {/* Order Footer */}
                <div
                  className="flex flex-col gap-5 border-t p-6 sm:flex-row sm:items-center sm:justify-between sm:px-8"
                  style={{
                    borderColor: "var(--color-border)",
                    backgroundColor: "var(--color-bg)",
                  }}
                >
                  <div>
                    <p
                      className="text-xs"
                      style={{ color: "var(--color-muted)" }}
                    >
                      Shipping Address
                    </p>

                    <p
                      className="mt-2 flex items-center gap-2 text-sm"
                      style={{ color: "var(--color-text)" }}
                    >
                      <MapPin size={15} className="shrink-0" />
                      {order.customer?.address || "Address unavailable"}
                      {order.customer?.city ? `, ${order.customer.city}` : ""}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p
                      className="text-sm"
                      style={{ color: "var(--color-muted)" }}
                    >
                      Order Total
                    </p>

                    <p
                      className="mt-2 font-serif text-2xl"
                      style={{ color: "var(--color-primary)" }}
                    >
                      {formatPrice(getOrderTotal(order))}
                    </p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* Continue Shopping */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-10"
        >
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
            style={{ color: "var(--color-primary)" }}
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
