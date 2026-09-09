import styles from "./Footer.module.scss";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <p>Starsoft © {new Date().getFullYear()} todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
