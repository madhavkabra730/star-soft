"use client";

import { useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/Button/Button";
import { PriceTag } from "@/components/PriceTag/PriceTag";
import { CartItemRow } from "./CartItemRow";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  checkout,
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
  resetCart,
  selectCartItems,
  selectCartTotal,
  selectCheckoutStatus,
} from "@/features/cart/cartSlice";
import { useToast } from "@/hooks/useToast";
import styles from "./CartDrawer.module.scss";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CHECKOUT_RESET_DELAY_MS = 2200;

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const status = useAppSelector(selectCheckoutStatus);
  const showToast = useToast();

  const handleRemove = (id: number) => {
    const item = items.find((entry) => entry.id === id);
    dispatch(removeFromCart(id));
    if (item) showToast(`${item.name} removido do carrinho`, "info");
  };

  const handleCheckout = () => {
    dispatch(checkout());
    showToast("Compra finalizada!");
  };

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
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
          >
            <header className={styles.header}>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar carrinho"
                className={styles.backButton}
              >
                <Image src="/icons/arrow-left.svg" alt="" width={22} height={22} aria-hidden />
              </button>
              <h2>Mochila de Compras</h2>
            </header>

            {items.length === 0 ? (
              <p className={styles.empty}>Seu carrinho está vazio.</p>
            ) : (
              <ul className={styles.items}>
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <CartItemRow
                      key={item.id}
                      item={item}
                      onRemove={handleRemove}
                      onIncrement={(id) => dispatch(incrementQuantity(id))}
                      onDecrement={(id) => dispatch(decrementQuantity(id))}
                    />
                  ))}
                </AnimatePresence>
              </ul>
            )}

            <footer className={styles.footer}>
              <div className={styles.total}>
                <span>Total</span>
                <PriceTag price={total} size="lg" className={styles.totalPrice} />
              </div>

              <Button
                variant="primary"
                fullWidth
                className={styles.checkoutButton}
                disabled={items.length === 0 || status === "completed"}
                onClick={handleCheckout}
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
