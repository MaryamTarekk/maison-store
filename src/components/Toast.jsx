import { createContext, useCallback, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

let nextId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(
    ({ message, type = "success", duration = 4000 }) => {
      const id = ++nextId;

      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);

      return id;
    },
    [],
  );

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}

      <div
        className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3"
        style={{ maxWidth: 400 }}
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

const iconMap = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const colorMap = {
  success: { icon: "#16A34A", bg: "rgba(22, 163, 74, 0.1)" },
  error: { icon: "#DC2626", bg: "rgba(220, 38, 38, 0.1)" },
  info: { icon: "#3B82F6", bg: "rgba(59, 130, 246, 0.1)" },
};

function ToastItem({ toast, onClose }) {
  const Icon = iconMap[toast.type] || iconMap.info;
  const color = colorMap[toast.type] || colorMap.info;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-start gap-3 rounded-2xl border px-5 py-4 shadow-2xl backdrop-blur-xl"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div
        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: color.bg }}
      >
        <Icon size={16} style={{ color: color.icon }} />
      </div>

      <p
        className="flex-1 text-sm leading-6"
        style={{ color: "var(--color-text)" }}
      >
        {toast.message}
      </p>

      <button
        type="button"
        onClick={onClose}
        className="mt-0.5 shrink-0 rounded-full p-1 opacity-40 transition hover:opacity-100"
        style={{ color: "var(--color-muted)" }}
      >
        <X size={15} />
      </button>
    </motion.div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}
