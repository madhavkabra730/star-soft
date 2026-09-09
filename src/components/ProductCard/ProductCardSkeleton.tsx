import styles from "./ProductCardSkeleton.module.scss";

export function ProductCardSkeleton() {
  return (
    <div className={styles.card} aria-hidden>
      <div className={styles.image} />
      <div className={styles.content}>
        <div className={`${styles.line} ${styles.title}`} />
        <div className={`${styles.line} ${styles.text}`} />
        <div className={`${styles.line} ${styles.button}`} />
      </div>
    </div>
  );
}
