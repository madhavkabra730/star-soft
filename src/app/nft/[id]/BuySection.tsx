"use client";

import { motion } from "framer-motion";
import { useProduct } from "@/hooks/useProduct";
import { PriceTag } from "@/components/PriceTag/PriceTag";
import { Button } from "@/components/Button/Button";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { addToCart, selectIsInCart } from "@/features/cart/cartSlice";
import type { Product } from "@/types/product";
import styles from "./BuySection.module.scss";

interface BuySectionProps {
  /** Server-rendered product, used to seed React Query so there's no client refetch/flash. */
  product: Product;
}

/** Interactive price + buy button on the NFT detail page; reads/writes cart state via Redux. */
export function BuySection({ product: initialProduct }: BuySectionProps) {
  const { data: product } = useProduct(initialProduct.id, { initialData: initialProduct });
  const dispatch = useAppDispatch();
  const inCart = useAppSelector(selectIsInCart(product.id));

  return (
    <div className={styles.buySection}>
      <PriceTag price={product.price} size="lg" />

      <motion.div whileTap={{ scale: 0.97 }}>
        <Button
          variant={inCart ? "primary" : "neutral"}
          onClick={() => !inCart && dispatch(addToCart(product))}
          disabled={inCart}
          aria-pressed={inCart}
        >
          {inCart ? "Adicionado ao carrinho" : "Comprar"}
        </Button>
      </motion.div>
    </div>
  );
}
