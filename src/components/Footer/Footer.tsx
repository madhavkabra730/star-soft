import styles from "./Footer.module.scss";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <p>© {new Date().getFullYear()} NFTarket — Starsoft Frontend Challenge.</p>
      </div>
    </footer>
  );
}
