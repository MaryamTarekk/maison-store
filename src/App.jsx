import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import { ThemeProvider } from "./theme/ThemeContext";
import { ToastProvider } from "./components/Toast";
import "./theme/theme.css";

// Lazy-loaded pages for code splitting
const Home = lazy(() => import("./pages/Home"));
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const Account = lazy(() => import("./pages/Account"));
const Profile = lazy(() => import("./pages/Profile"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Contact = lazy(() => import("./pages/Contact"));
const About = lazy(() => import("./pages/About"));

// Elegant page-level loading state (not full-page reload)
function PageLoader() {
  return (
    <div
      className="flex min-h-[60vh] items-center justify-center"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-10 w-10 animate-spin rounded-full border-2 border-t-transparent"
          style={{
            borderColor: "var(--color-border)",
            borderTopColor: "var(--color-primary)",
          }}
        />

        <p className="text-sm" style={{ color: "var(--color-muted)" }}>
          Loading...
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-300">
            <Navbar />

            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/my-orders" element={<MyOrders />} />
                <Route path="/account" element={<Account />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </Suspense>

            <Footer />
          </div>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}
