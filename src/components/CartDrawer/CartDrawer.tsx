"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/Button/Button";
import { PriceTag } from "@/components/PriceTag/PriceTag";
import { CartItemRow } from "./CartItemRow";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  checkout,
  removeFromCart,
  resetCart,
  selectCartItems,
  selectCartTotal,
  selectCheckoutStatus,
} from "@/features/cart/cartSlice";
import styles from "./CartDrawer.module.scss";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CHECKOUT_RESET_DELAY_MS = 2200;

/** Slide-over cart: lists items, totals them in ETH, and drives the finish-bt purchase flow. */
export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const status = useAppSelector(selectCheckoutStatus);

  // After showing "COMPRA FINALIZADA!", clear the cart and close the drawer.
  useEffect(() => {
    if (status !== "completed") return;
    const timer = setTimeout(() => {
      dispatch(resetCart());
      onClose();
    }, CHECKOUT_RESET_DELAY_MS);
    return () => clearTimeout(timer);
  }, [status, dispatch, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className={styles.drawer}
            role="dialog"
            aria-modal="true"
            aria-label="Carrinho de compras"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
          >
            <header className={styles.header}>
              <h2>Carrinho</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar carrinho"
                className={styles.closeButton}
              >
                ✕
              </button>
            </header>

            {items.length === 0 ? (
              <p className={styles.empty}>Seu carrinho está vazio.</p>
            ) : (
              <ul className={styles.items}>
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <CartItemRow key={item.id} item={item} onRemove={(id) => dispatch(removeFromCart(id))} />
                  ))}
                </AnimatePresence>
              </ul>
            )}

            <footer className={styles.footer}>
              <div className={styles.total}>
                <span>Total</span>
                <PriceTag price={total} cryptoSymbol="ETH" cryptoIconPath="/icons/eth.svg" size="lg" />
              </div>

              <Button
                variant="primary"
                fullWidth
                disabled={items.length === 0 || status === "completed"}
                onClick={() => dispatch(checkout())}
              >
                {status === "completed" ? "Compra finalizada!" : "Finalizar compra"}
              </Button>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
