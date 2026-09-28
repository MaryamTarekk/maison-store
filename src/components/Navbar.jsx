import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShoppingBag,
  UserRound,
  Menu,
  X,
  Heart,
  Sun,
  Moon,
  ChevronDown,
  Package,
} from "lucide-react";

import { useTheme } from "../theme/ThemeContext";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Contact Us", to: "/contact" },
  { label: "About", to: "/about" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  const accountRef = useRef(null);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const closeMenu = () => setMenuOpen(false);

  // Track scroll to give the header a bit of depth once the page moves
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the account dropdown on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("maison-cart") || "[]");
        const count = Array.isArray(cart)
          ? cart.reduce((total, item) => total + (item.quantity || 0), 0)
          : 0;
        setCartCount(count);
      } catch {
        setCartCount(0);
      }
    };

    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    return () => window.removeEventListener("cartUpdated", updateCartCount);
  }, []);

  const isActive = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  const iconBtn =
    "flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text)]/80 transition-colors duration-200 hover:text-[var(--color-primary)]";

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-[var(--color-bg)]/90 backdrop-blur-md transition-shadow duration-300 ${
        scrolled
          ? "border-[var(--color-border)] shadow-[0_1px_0_rgba(0,0,0,0.04)]"
          : "border-transparent"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-6 px-5 md:px-10 lg:px-14">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="shrink-0 font-serif text-[26px] font-bold tracking-tight text-[var(--color-text)]"
        >
          Maison<span className="text-[var(--color-primary)]">.</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:gap-9">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative py-2 text-[13.5px] font-medium tracking-wide transition-colors duration-200 ${
                  active
                    ? "text-[var(--color-primary)]"
                    : "text-[var(--color-text)]/85 hover:text-[var(--color-primary)]"
                }`}
              >
                {link.label}
                <span
                  className={`absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-[var(--color-primary)] transition-transform duration-200 ${
                    active ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1">
          <Link
            to="/wishlist"
            aria-label="My Wishlist"
            className={`hidden sm:flex ${iconBtn}`}
          >
            <Heart size={19} strokeWidth={1.7} />
          </Link>

          <Link
            to="/cart"
            aria-label={`Shopping bag, ${cartCount} items`}
            className={`relative ${iconBtn}`}
          >
            <ShoppingBag size={19} strokeWidth={1.7} />
            {cartCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[10px] font-medium text-white">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light Mode" : "Dark Mode"}
            className={iconBtn}
          >
            {isDark ? (
              <Sun size={19} strokeWidth={1.7} />
            ) : (
              <Moon size={19} strokeWidth={1.7} />
            )}
          </button>

          {/* Divider */}
          <span className="mx-2 hidden h-6 w-px bg-[var(--color-border)] sm:block" />

          {/* Account dropdown */}
          <div className="relative hidden sm:block" ref={accountRef}>
            <button
              type="button"
              onClick={() => setAccountOpen((v) => !v)}
              aria-expanded={accountOpen}
              className="flex items-center gap-1.5 rounded-full py-1.5 pl-1.5 pr-2.5 text-[13.5px] font-medium text-[var(--color-text)]/85 transition-colors duration-200 hover:text-[var(--color-primary)]"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-primary)]/12 text-[var(--color-primary)]">
                <UserRound size={16} strokeWidth={1.9} />
              </span>
              Account
              <ChevronDown
                size={14}
                strokeWidth={2}
                className={`transition-transform duration-200 ${accountOpen ? "rotate-180" : ""}`}
              />
            </button>

            {accountOpen && (
              <div className="absolute right-0 top-[calc(100%+10px)] w-52 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] py-1.5 shadow-lg">
                <Link
                  to="/account"
                  onClick={() => setAccountOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-[13.5px] text-[var(--color-text)] transition-colors hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)]"
                >
                  <UserRound size={16} strokeWidth={1.7} />
                  Sign in
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setAccountOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-[13.5px] text-[var(--color-text)] transition-colors hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)]"
                >
                  <UserRound size={16} strokeWidth={1.7} />
                  My Profile
                </Link>
                <Link
                  to="/my-orders"
                  onClick={() => setAccountOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-[13.5px] text-[var(--color-text)] transition-colors hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)]"
                >
                  <Package size={16} strokeWidth={1.7} />
                  My Orders
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className={`ml-1 md:hidden ${iconBtn}`}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav
        className={`overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-bg)] transition-[max-height] duration-300 md:hidden ${
          menuOpen ? "max-h-[560px]" : "max-h-0 border-t-0"
        }`}
      >
        <div className="flex flex-col gap-1 px-6 py-5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={closeMenu}
              className={`rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors ${
                isActive(link.to)
                  ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                  : "text-[var(--color-text)]"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <span className="my-2 h-px bg-[var(--color-border)]" />

          <Link
            to="/account"
            onClick={closeMenu}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[15px] text-[var(--color-text)]"
          >
            <UserRound size={18} strokeWidth={1.7} />
            Sign in
          </Link>
          <Link
            to="/profile"
            onClick={closeMenu}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[15px] text-[var(--color-text)]"
          >
            <UserRound size={18} strokeWidth={1.7} />
            My Profile
          </Link>
          <Link
            to="/my-orders"
            onClick={closeMenu}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[15px] text-[var(--color-text)]"
          >
            <Package size={18} strokeWidth={1.7} />
            My Orders
          </Link>
          <Link
            to="/wishlist"
            onClick={closeMenu}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[15px] text-[var(--color-text)]"
          >
            <Heart size={18} strokeWidth={1.7} />
            My Wishlist
          </Link>
        </div>
      </nav>
    </header>
  );
}
