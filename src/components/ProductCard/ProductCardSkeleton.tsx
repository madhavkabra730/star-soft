import styles from "./ProductCardSkeleton.module.scss";

/** Loading placeholder matching ProductCard's dimensions, shown while React Query fetches a page. */
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
