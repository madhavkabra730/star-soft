import Image from "next/image";
import styles from "./PriceTag.module.scss";

interface PriceTagProps {
  price: number;
  /** The API returns a plain decimal with no currency; Figma always displays it as ETH regardless, so that's the default rather than something read off `Product`. */
  cryptoSymbol?: string;
  cryptoIconPath?: string;
  size?: "sm" | "md" | "lg";
}

/** Displays a crypto price with its icon, e.g. "◆ 1.42 ETH". Reused in cards, the detail page, and the cart. */
export function PriceTag({
  price,
  cryptoSymbol = "ETH",
  cryptoIconPath = "/icons/eth.svg",
  size = "md",
}: PriceTagProps) {
  return (
    <span className={`${styles.priceTag} ${styles[size]}`}>
      <Image src={cryptoIconPath} alt="" width={20} height={20} className={styles.icon} aria-hidden />
      <span>
        {price.toFixed(3)} <span className={styles.symbol}>{cryptoSymbol}</span>
      </span>
    </span>
  );
}
