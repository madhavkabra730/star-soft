import Image from "next/image";
import styles from "./PriceTag.module.scss";

interface PriceTagProps {
  price: number;
  cryptoSymbol?: string;
  cryptoIconPath?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PriceTag({
  price,
  cryptoSymbol = "ETH",
  cryptoIconPath = "/icons/eth.svg",
  size = "md",
  className,
}: PriceTagProps) {
  const classes = [styles.priceTag, styles[size], className].filter(Boolean).join(" ");

  return (
    <span className={classes}>
      <Image src={cryptoIconPath} alt="" width={20} height={20} className={styles.icon} aria-hidden />
      <span>
        {price.toFixed(3)} <span className={styles.symbol}>{cryptoSymbol}</span>
      </span>
    </span>
  );
}
