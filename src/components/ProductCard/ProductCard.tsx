"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/Button/Button";
import { PriceTag } from "@/components/PriceTag/PriceTag";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { addToCart, selectIsInCart } from "@/features/cart/cartSlice";
import type { Product } from "@/types/product";
import styles from "./ProductCard.module.scss";

interface ProductCardProps {
  product: Product;
  /** Disables the entrance animation — used when cards are appended via "load more" to avoid re-animating the whole grid. */
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const inCart = useAppSelector(selectIsInCart(product.id));

  const handleBuy = () => {
    if (!inCart) {
      dispatch(addToCart(product));
    }
  };

  return (
    <motion.article
      className={styles.card}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    >
      <Link href={`/nft/${product.id}`} className={styles.imageLink} aria-label={product.name}>
        <div className={styles.imageWrapper}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 480px) 90vw, (max-width: 768px) 45vw, 300px"
            className={styles.image}
            priority={priority}
          />
        </div>
      </Link>

      <div className={styles.content}>
        <Link href={`/nft/${product.id}`} className={styles.titleLink}>
          <h3 className={styles.title}>{product.name}</h3>
        </Link>
        <p className={styles.description}>{product.description}</p>

        <div className={styles.footer}>
          <PriceTag price={product.price} />

          <motion.div whileTap={{ scale: 0.97 }} className={styles.buyButtonWrap}>
            <Button
              variant={inCart ? "primary" : "neutral"}
              fullWidth
              onClick={handleBuy}
              disabled={inCart}
              aria-pressed={inCart}
            >
              {inCart ? "Adicionado ao carrinho" : "Comprar"}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
}
