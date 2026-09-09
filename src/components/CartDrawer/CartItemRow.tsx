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
        <Image src={item.image} alt={item.name} fill sizes="64px" />
      </div>

      <div className={styles.itemInfo}>
        <div className={styles.itemHeader}>
          <div className={styles.itemText}>
            <p className={styles.itemName}>{item.name}</p>
            <p className={styles.itemDescription}>{item.description}</p>
            <PriceTag
              price={item.price}
              cryptoSymbol={item.cryptoSymbol}
              cryptoIconPath={item.cryptoIconPath}
              size="sm"
            />
          </div>

          <button
            type="button"
            className={styles.removeButton}
            onClick={() => onRemove(item.id)}
            aria-label={`Remover ${item.name} do carrinho`}
          >
            <Image src="/icons/trash.svg" alt="" width={16} height={16} aria-hidden />
          </button>
        </div>

        <QuantitySelector
          quantity={item.quantity}
          itemName={item.name}
          onIncrement={() => onIncrement(item.id)}
          onDecrement={() => onDecrement(item.id)}
        />
      </div>
    </motion.li>
  );
}
