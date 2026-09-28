import { useCallback, useEffect, useRef } from "react";

/**
 * Hook to warn about unsaved changes.
 * - Adds `beforeunload` listener when `hasChanges` is true.
 * - Provides `confirmDiscard()` to gate navigation/modal close.
 */
export function useUnsavedChanges(hasChanges) {
  const ref = useRef(hasChanges);
  ref.current = hasChanges;

  useEffect(() => {
    const handler = (e) => {
      if (ref.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handler);

    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  const confirmDiscard = useCallback(() => {
    if (!ref.current) return true;

    return window.confirm(
      "You have unsaved changes. Are you sure you want to discard them?",
    );
  }, []);

  return { confirmDiscard };
}
