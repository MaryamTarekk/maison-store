import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Loader2 } from "lucide-react";
import { useUnsavedChanges } from "../hooks/useUnsavedChanges";

const statusOptions = [
  { value: "available", label: "Available", color: "#16A34A" },
  { value: "low-stock", label: "Low Stock", color: "#F59E0B" },
  { value: "out-of-stock", label: "Out of Stock", color: "#DC2626" },
];

export default function ProductEditModal({
  product,
  onClose,
  onSave,
  isSaving,
  onDirtyChange,
}) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    status: "available",
  });

  const [initialForm, setInitialForm] = useState(null);

  // Initialize form when product changes
  useEffect(() => {
    if (product) {
      const initial = {
        name: product.name || "",
        price: String(product.price || ""),
        description: product.description || "",
        status: product.status || "available",
      };

      setForm(initial);
      setInitialForm(initial);
    }
  }, [product]);

  // Check if form is dirty
  const isDirty = initialForm
    ? form.name !== initialForm.name ||
      form.price !== initialForm.price ||
      form.description !== initialForm.description ||
      form.status !== initialForm.status
    : false;

  // Report dirty state to parent
  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  // Unsaved changes protection (beforeunload)
  const { confirmDiscard } = useUnsavedChanges(isDirty);

  const handleClose = useCallback(() => {
    if (confirmDiscard()) {
      onClose();
    }
  }, [confirmDiscard, onClose]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({
      name: form.name.trim(),
      price: Number(form.price),
      description: form.description.trim(),
      status: form.status,
    });
  };

  if (!product) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border shadow-2xl"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between border-b px-6 py-5"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div>
              <p
                className="text-xs uppercase tracking-[0.2em]"
                style={{ color: "var(--color-primary)" }}
              >
                Edit Product
              </p>

              <h2
                className="mt-1 font-serif text-xl"
                style={{ color: "var(--color-text)" }}
              >
                {product.name}
              </h2>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-[var(--color-border)]"
              style={{ color: "var(--color-muted)" }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 p-6">
            {/* Name */}
            <div>
              <label
                className="mb-2 block text-xs font-medium uppercase tracking-wider"
                style={{ color: "var(--color-muted)" }}
              >
                Product Name
              </label>

              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
                style={{
                  backgroundColor: "var(--color-bg)",
                  borderColor: "var(--color-border)",
                  color: "var(--color-text)",
                }}
              />
            </div>

            {/* Price */}
            <div>
              <label
                className="mb-2 block text-xs font-medium uppercase tracking-wider"
                style={{ color: "var(--color-muted)" }}
              >
                Price ($)
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
                required
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
                style={{
                  backgroundColor: "var(--color-bg)",
                  borderColor: "var(--color-border)",
                  color: "var(--color-text)",
                }}
              />
            </div>

            {/* Status */}
            <div>
              <label
                className="mb-2 block text-xs font-medium uppercase tracking-wider"
                style={{ color: "var(--color-muted)" }}
              >
                Status
              </label>

              <div className="flex flex-wrap gap-2">
                {statusOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleChange("status", opt.value)}
                    className="flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition"
                    style={{
                      borderColor:
                        form.status === opt.value
                          ? opt.color
                          : "var(--color-border)",
                      backgroundColor:
                        form.status === opt.value
                          ? `${opt.color}15`
                          : "transparent",
                      color:
                        form.status === opt.value
                          ? opt.color
                          : "var(--color-muted)",
                    }}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: opt.color }}
                    />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                className="mb-2 block text-xs font-medium uppercase tracking-wider"
                style={{ color: "var(--color-muted)" }}
              >
                Description
              </label>

              <textarea
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
                className="w-full resize-none rounded-xl border px-4 py-3 text-sm leading-6 outline-none transition focus:border-[var(--color-primary)]"
                style={{
                  backgroundColor: "var(--color-bg)",
                  borderColor: "var(--color-border)",
                  color: "var(--color-text)",
                }}
              />
            </div>

            {/* Dirty indicator */}
            {isDirty && (
              <p className="text-xs" style={{ color: "var(--color-primary)" }}>
                ● You have unsaved changes
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-full border px-5 py-2.5 text-sm transition hover:border-[var(--color-primary)]"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-text)",
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!isDirty || isSaving}
                className="flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition disabled:opacity-40"
                style={{
                  backgroundColor: "var(--color-text)",
                  color: "var(--color-bg)",
                }}
              >
                {isSaving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
