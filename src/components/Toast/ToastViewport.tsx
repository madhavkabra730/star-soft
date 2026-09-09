"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { removeToast, selectToasts, type ToastItem } from "@/features/toast/toastSlice";
import styles from "./ToastViewport.module.scss";

const TOAST_DURATION_MS = 3000;

function ToastCard({ id, message, variant }: ToastItem) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timer = setTimeout(() => dispatch(removeToast(id)), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [id, dispatch]);

  return (
    <motion.li
      className={`${styles.toast} ${styles[variant]}`}
      layout
      initial={{ opacity: 0, y: -16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, transition: { duration: 0.15 } }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      role="status"
    >
      <span className={styles.dot} aria-hidden />
      <p>{message}</p>
      <button
        type="button"
        className={styles.close}
        onClick={() => dispatch(removeToast(id))}
        aria-label="Fechar notificação"
      >
        ×
      </button>
    </motion.li>
  );
}

export function ToastViewport() {
  const toasts = useAppSelector(selectToasts) ?? [];

  return (
    <ul className={styles.viewport} aria-live="polite">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastCard key={toast.id} {...toast} />
        ))}
      </AnimatePresence>
    </ul>
  );
}
