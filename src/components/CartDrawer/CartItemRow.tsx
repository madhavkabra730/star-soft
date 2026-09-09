import Image from "next/image";
import { motion } from "framer-motion";
import { PriceTag } from "@/components/PriceTag/PriceTag";
import { QuantitySelector } from "@/components/QuantitySelector/QuantitySelector";
import type { CartItem } from "@/features/cart/cartSlice";
import styles from "./CartDrawer.module.scss";

interface CartItemRowProps {
  item: CartItem;
  onRemove: (id: number) => void;
  onIncrement: (id: number) => void;
  onDecrement: (id: number) => void;
}

export function CartItemRow({ item, onRemove, onIncrement, onDecrement }: CartItemRowProps) {
  return (
    <motion.li
      className={styles.item}
      layout
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className={styles.itemImage}>
        <Image
          src={item.image}
          alt={item.name}
          fill
          className={styles.itemImageEl}
          sizes="(min-width: 768px) 161px, 104px"
        />
      </div>

      <div className={styles.itemInfo}>
        <p className={styles.itemName}>{item.name}</p>
        <p className={styles.itemDescription}>{item.description}</p>
        <div className={styles.priceRow}>
          <PriceTag price={item.price} size="sm" />
        </div>

        <QuantitySelector
          quantity={item.quantity}
          itemName={item.name}
          onIncrement={() => onIncrement(item.id)}
          onDecrement={() => onDecrement(item.id)}
        />
      </div>

      <button
        type="button"
        className={styles.removeButton}
        onClick={() => onRemove(item.id)}
        aria-label={`Remover ${item.name} do carrinho`}
      >
        <Image src="/icons/trash.svg" alt="" width={26} height={26} aria-hidden />
      </button>
    </motion.li>
  );
}
