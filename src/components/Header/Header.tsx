"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useAppSelector } from "@/lib/hooks";
import { selectCartCount } from "@/features/cart/cartSlice";
import styles from "./Header.module.scss";

// CartDrawer pulls in framer-motion's AnimatePresence and is only ever
// needed once the user opens the cart — split it into its own chunk instead
// of shipping it in the initial page bundle.
const CartDrawer = dynamic(() => import("@/components/CartDrawer/CartDrawer").then((mod) => mod.CartDrawer), {
  ssr: false,
});

export function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartCount = useAppSelector(selectCartCount);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.content}>
          <Link href="/" className={styles.logo} aria-label="Página inicial">
            <Image src="/icons/logo.svg" alt="NFTarket" width={140} height={32} priority />
          </Link>

          <button
            type="button"
            className={styles.cartButton}
            onClick={() => setIsCartOpen(true)}
            aria-label={`Abrir carrinho, ${cartCount} ${cartCount === 1 ? "item" : "itens"}`}
          >
            <Image src="/icons/bag.svg" alt="" width={26} height={26} aria-hidden />
            {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
          </button>
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
