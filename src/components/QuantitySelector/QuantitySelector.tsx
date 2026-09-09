import styles from "./QuantitySelector.module.scss";

interface QuantitySelectorProps {
  quantity: number;
  itemName: string;
  onIncrement: () => void;
  onDecrement: () => void;
}

export function QuantitySelector({ quantity, itemName, onIncrement, onDecrement }: QuantitySelectorProps) {
  return (
    <div className={styles.stepper} role="group" aria-label={`Quantidade de ${itemName}`}>
      <button type="button" onClick={onDecrement} aria-label={`Diminuir quantidade de ${itemName}`}>
        −
      </button>
      <span className={styles.value}>{quantity}</span>
      <button type="button" onClick={onIncrement} aria-label={`Aumentar quantidade de ${itemName}`}>
        +
      </button>
    </div>
  );
}
